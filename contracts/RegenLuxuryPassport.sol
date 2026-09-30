// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Passaporto digitale on-chain dei capi rigenerati (Capitolo 4.2).
// Principi:
//  - nessun dato personale on-chain (GDPR): si salvano solo IMPRONTE (keccak256)
//  - un tag = un solo token: un tag già registrato non può identificare un altro capo
//  - storico append-only: rigenerazioni e passaggi di proprietà si possono solo aggiungere
//  - la piattaforma custodisce i token e paga il gas (utente finale senza wallet, RC-5)
//  - ERC-2771: predisposto per meta-transazioni tramite un trusted forwarder

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";

contract RegenLuxuryPassport is ERC721, AccessControl, ERC2771Context {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE"); // brand manager / piattaforma
    bytes32 public constant ARTISAN_ROLE = keccak256("ARTISAN_ROLE");     // laboratori di rigenerazione

    uint256 private _nextTokenId = 1;

    /// impronta del tagId fisico -> tokenId (0 = non registrato)
    mapping(bytes32 => uint256) public tokenByTag;
    /// impronta attuale dei dati identificativi del capo
    mapping(uint256 => bytes32) public dataHashOf;
    /// storico immutabile delle impronte (rigenerazioni e passaggi di proprietà)
    mapping(uint256 => bytes32[]) private _history;

    event ItemRegistered(uint256 indexed tokenId, bytes32 indexed tagHash, bytes32 dataHash);
    event DataHashUpdated(uint256 indexed tokenId, bytes32 previousHash, bytes32 newHash);
    event RegenerationRecorded(uint256 indexed tokenId, bytes32 eventHash, address indexed operator);
    event OwnershipRecorded(uint256 indexed tokenId, bytes32 transferHash);

    error TagAlreadyRegistered(bytes32 tagHash);
    error UnknownToken(uint256 tokenId);

    constructor(address trustedForwarder, address admin)
        ERC721("Regen Luxury Passport", "RLP")
        ERC2771Context(trustedForwarder)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, admin);
        _grantRole(ARTISAN_ROLE, admin);
    }

    /// Crea l'identità digitale del capo (mint del token) legata all'impronta del tag.
    function registerItem(address custody, bytes32 tagHash, bytes32 dataHash)
        external
        onlyRole(REGISTRAR_ROLE)
        returns (uint256 tokenId)
    {
        if (tokenByTag[tagHash] != 0) revert TagAlreadyRegistered(tagHash);
        tokenId = _nextTokenId++;
        tokenByTag[tagHash] = tokenId;
        dataHashOf[tokenId] = dataHash;
        _safeMint(custody, tokenId);
        emit ItemRegistered(tokenId, tagHash, dataHash);
    }

    /// Aggiorna l'impronta dei dati (modifica o archiviazione): la precedente resta negli eventi.
    function updateDataHash(uint256 tokenId, bytes32 newHash) external onlyRole(REGISTRAR_ROLE) {
        _requireExists(tokenId);
        emit DataHashUpdated(tokenId, dataHashOf[tokenId], newHash);
        dataHashOf[tokenId] = newHash;
    }

    /// Ancora l'impronta di un intervento di rigenerazione.
    function recordRegeneration(uint256 tokenId, bytes32 eventHash) external onlyRole(ARTISAN_ROLE) {
        _requireExists(tokenId);
        _history[tokenId].push(eventHash);
        emit RegenerationRecorded(tokenId, eventHash, _msgSender());
    }

    /// Ancora l'impronta di un passaggio di proprietà (i nomi restano off-chain).
    function recordTransfer(uint256 tokenId, bytes32 transferHash) external onlyRole(REGISTRAR_ROLE) {
        _requireExists(tokenId);
        _history[tokenId].push(transferHash);
        emit OwnershipRecorded(tokenId, transferHash);
    }

    /// Verifica pubblica: lettura gratuita, nessuna transazione.
    function recordByTag(bytes32 tagHash)
        external
        view
        returns (bool registered, uint256 tokenId, bytes32 dataHash, bytes32[] memory history)
    {
        tokenId = tokenByTag[tagHash];
        if (tokenId == 0) return (false, 0, bytes32(0), new bytes32[](0));
        return (true, tokenId, dataHashOf[tokenId], _history[tokenId]);
    }

    function _requireExists(uint256 tokenId) private view {
        if (_ownerOf(tokenId) == address(0)) revert UnknownToken(tokenId);
    }

    // --- override richiesti dall'ereditarietà multipla ---
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    function _contextSuffixLength() internal view override(Context, ERC2771Context) returns (uint256) {
        return ERC2771Context._contextSuffixLength();
    }
}
