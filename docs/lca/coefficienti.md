# Coefficienti LCA per la stima dell'impatto evitato (punto 23)

Il calcolo è nel backend (`backend/services/impactService.js`, dati in `backend/data/coefficienti-lca.json`).

**Metodo.** Un capo rigenerato evita in parte l'acquisto di un capo nuovo equivalente:

> impatto evitato = impatto di produzione del capo nuovo × fattore di sostituzione

Si considerano solo le fasi di **produzione** (fibra → tessuto → confezione → distribuzione): l'uso e il fine
vita avvengono comunque, con capo nuovo o rigenerato. Il risultato è una **stima**, non una misura.

## Fattore di sostituzione

| Valore usato | Intervallo | Fonte |
|---|---|---|
| **0,60** (prudente) | 0,60 – 0,85 | Farrant L., Olsen S.I., Wangel A. (2010). *Environmental benefits from reusing clothes*. Int. J. Life Cycle Assessment, 15, 726–736: l'acquisto di 100 capi di seconda mano evita la produzione di 60–85 capi nuovi. |

## Impatto di produzione per categoria

| Categoria | kg CO₂e | Litri d'acqua | Unità funzionale | Fonte | Stato |
|---|---|---|---|---|---|
| jeans | **20,0** | **2.922** | un paio di Levi's 501; fasi fibra, tessuto, confezione, accessori/imballaggio, trasporto e vendita | Levi Strauss & Co. (2015), *The Life Cycle of a Jean*. Totale ciclo di vita 33,4 kg CO₂e e 3.781 L: esclusi cura del consumatore (12,5 kg; 860 L) e fine vita (0,9 kg; 0 L) | verificato sulla presentazione dei risultati LCA |
| t-shirt | 3,53 | 725 | t-shirt in cotone da 250 g, cradle-to-gate | Forfora N. et al. (2026), *A Comparative Life Cycle Assessment of T-Shirt Production Using Viscose, Lyocell, Cotton, and Polyester*, Sustainability 18(8), 4070: 14,1 kg CO₂e/kg e 2,9 m³/kg | **da verificare** sulla tabella dei risultati dell'articolo |

Risultato mostrato per un paio di jeans: 20,0 × 0,6 = **12 kg CO₂e** e 2.922 × 0,6 = **1.753 L**
(intervallo 12–17 kg e 1.753–2.484 L con fattore 0,60–0,85).

## Categorie senza dati

Per le altre categorie (giacca, borsa, scarpe, …) la web app mostra "stima non disponibile" invece di un
numero senza fonte. Per aggiungerne una, inserire nel JSON valori con **fonte, anno, unità funzionale e
confini del sistema** (ISO 14040/14044) e impostare `"verificato": true` solo dopo aver letto la fonte.

## Nota sul prototipo precedente

La prima versione del backend usava 15 kg CO₂e e 2.700 L per capo, moltiplicati per il numero di interventi,
senza fonte: sono stati sostituiti da questo metodo, più prudente e citabile. Il dato molto diffuso "2.700 litri
per una t-shirt" (WWF, 2013) è un'impronta idrica (water footprint), dovuta soprattutto alla coltivazione del
cotone: è una grandezza calcolata con un metodo diverso dal consumo d'acqua dell'LCA, quindi non va mescolata
con i valori di questa tabella.
