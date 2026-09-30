"""Classi di materiale riconosciute dal modello e corrispondenza con le etichette di TextileNet.

TextileNet (Zhong et al., 2023) etichetta le immagini per FIBRA (33 classi).
Le fibre sono raggruppate nelle 9 classi di materiale usate dalla piattaforma
(le stesse del campo "materialePrincipale" del backend).
"""

CLASSI = ["cotone", "lana", "cashmere", "seta", "lino", "pelle", "poliestere", "nylon", "viscosa"]

# etichetta TextileNet-fibre -> classe della piattaforma (le altre fibre sono escluse)
MAPPA_TEXTILENET = {
    "cotton": "cotone",
    "wool": "lana",
    "alpaca": "lana",
    "camel": "lana",
    "llama": "lana",
    "mohair": "lana",
    "yak": "lana",
    "angora": "lana",
    "cashmere": "cashmere",
    "silk": "seta",
    "flax_linen": "lino",
    "leather": "pelle",
    "suede": "pelle",
    "polyester": "poliestere",
    "nylon": "nylon",
    "viscose_rayon": "viscosa",
    "modal": "viscosa",
    "lyocell": "viscosa",
    "cupro": "viscosa",
}

# Normalizzazione ImageNet: la stessa usata dalla rete pre-addestrata
MEDIA = [0.485, 0.456, 0.406]
DEVIAZIONE = [0.229, 0.224, 0.225]
LATO = 224
