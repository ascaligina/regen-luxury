# Costi on-chain misurati — dati per il Capitolo 6 (punto 14)

Misure ottenute con `npm run misura-gas` nella cartella `contracts/` (chain locale Hardhat, solc 0.8.24,
ottimizzatore 200 run, contratto `RegenLuxuryPassport`). Il **gas** di ogni operazione è lo stesso su Polygon
Amoy e sulla rete principale Polygon PoS (stessa EVM); il **costo** dipende da prezzo del gas e prezzo di POL.

| Operazione | Gas |
|---|---:|
| Deploy del contratto (una tantum) | 1.633.950 |
| Registrazione del primo capo (mint) | 124.074 |
| Registrazione di un capo successivo | 106.974 |
| Aggiornamento dati / archiviazione | 33.720 |
| Primo evento di rigenerazione | 73.186 |
| Evento di rigenerazione successivo | 56.086 |
| Passaggio di proprietà | 55.503 |
| Verifica pubblica (`recordByTag`) | 0 (sola lettura) |

**Ciclo di vita tipico di un capo** (registrazione + 3 interventi + 2 passaggi di proprietà): **403.338 gas**.

## Costo per capo: scenari

costo (POL) = gas × prezzo del gas (gwei) × 10⁻⁹ — costo (€) = costo (POL) × prezzo di POL (€)

| Prezzo del gas | POL a 0,10 € | POL a 0,50 € |
|---|---:|---:|
| 30 gwei | 0,0012 € | 0,0061 € |
| 100 gwei | 0,0040 € | 0,0202 € |
| 300 gwei | 0,0121 € | 0,0605 € |

Anche nello scenario più sfavorevole il costo dell'intera storia di un capo resta sotto i **7 centesimi**.

## Come ottenere i valori da citare in tesi

I prezzi cambiano di continuo: nella tesi va indicato un valore **con data e fonte**.

1. Prezzo del gas su Polygon PoS: PolygonScan Gas Tracker — https://polygonscan.com/gastracker
2. Prezzo di POL in euro: CoinGecko — https://www.coingecko.com/en/coins/polygon/eur
3. Ricalcolo: `npm run misura-gas -- --gwei <valore> --prezzo-pol <valore>` (salva i risultati e l'esito dei controlli di sicurezza in `docs/costi/misure-gas.json`; se un controllo fallisce lo script termina con errore).

## Direzioni per la sostenibilità economica (Cap. 6, §3.3.3)

1. **Costo assorbito dalla piattaforma**: con costi marginali di frazioni di centesimo per capo, anche mille
   capi l'anno costano pochi euro.
2. **Quota associativa simbolica** di una cooperativa di operatori, che copre gas e hosting.
3. **Ancoraggio a lotti**: invece di una transazione per evento, un'unica impronta (radice di un *Merkle tree*)
   al giorno per tutti gli eventi → costo quasi indipendente dal numero di capi (sviluppo futuro).
