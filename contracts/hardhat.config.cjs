// Solo per "npm run chain": avvia una blockchain locale di prova (chainId 31337)
// con 20 account già finanziati. Nessun costo, nessun wallet reale.
module.exports = {
  solidity: "0.8.24",
  networks: { hardhat: { chainId: 31337, hardfork: "cancun" } },
};
