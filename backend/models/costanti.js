// Valori ammessi, condivisi da modelli, validazione e frontend.
export const TIPI_EVENTO = ["riparazione", "upcycling", "sostituzione_parti"];

export const RUOLI = ["admin", "brand_manager", "commerciante", "artigiano"];

export const CATEGORIE = [
  "giacca", "cappotto", "abito", "camicia", "t-shirt", "maglione",
  "pantaloni", "jeans", "gonna", "borsa", "scarpe", "accessorio", "altro",
];

export const MATERIALI = [
  "cotone", "lana", "seta", "lino", "cashmere", "pelle", "denim",
  "poliestere", "nylon", "viscosa", "misto", "altro",
];

export const STATI_CAPO = ["attivo", "archiviato"];

export const STATI_ANCORAGGIO = ["in_attesa", "confermato", "fallito"];

// Formato ammesso per il codice del tag fisico (es. NFC-001)
export const TAG_REGEX = /^[A-Za-z0-9_-]{3,64}$/;
