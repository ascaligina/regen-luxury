/*
 * ARCHIVIO DIMOSTRATIVO — generatore dei capi di lusso per la demo.
 *
 * Produce sempre lo stesso insieme di capi (generatore pseudo-casuale con seme fisso),
 * così lo script di popolamento è ripetibile. TUTTI I DATI SONO INVENTATI: i marchi sono
 * citati a solo scopo illustrativo (i nomi appartengono ai rispettivi titolari, nessuna
 * affiliazione), i proprietari e i laboratori non esistono, gli scambi e le date sono
 * casuali. Nel database i capi sono marcati "dimostrativo: true" e il certificato lo dichiara.
 *
 * Copertura: 1980 → 2025, 47 maison di molti paesi, 11 categorie, scambi in tutti i continenti.
 */

// [categoria, modello, materialePrincipale, materialiOriginari]
const BRAND = [
  { n: "Hermès", s: "HER", f: ["Francia (Parigi)", "Francia (Pantin)", "Francia (Lione)"], a: [
    ["borsa", "Borsa a mano in pelle Togo con cuciture a sella", "pelle", "Pelle di vitello Togo, filo di lino cerato, ferramenta placcata palladio"],
    ["accessorio", "Carré in twill di seta stampato a mano", "seta", "Twill di seta 90 cm, bordi arrotolati a mano"],
    ["borsa", "Borsa a spalla in pelle Box, chiusura a lucchetto", "pelle", "Pelle di vitello Box, fodera in capra"],
  ] },
  { n: "Chanel", s: "CHA", f: ["Francia (Parigi)", "Francia (Normandia)"], a: [
    ["giacca", "Giacca in tweed bouclé con bottoni gioiello", "lana", "Tweed di lana e seta, fodera in seta con catenella di ancoraggio"],
    ["borsa", "Borsa trapuntata matelassé a tracolla", "pelle", "Pelle d'agnello trapuntata, catena intrecciata in metallo"],
    ["scarpe", "Décolleté bicolore con punta in pelle verniciata", "pelle", "Pelle di capretto beige, punta in vernice nera"],
  ] },
  { n: "Louis Vuitton", s: "LVT", f: ["Francia (Asnières)", "Francia (Parigi)", "Italia (Fiesso d'Artico)"], a: [
    ["borsa", "Borsa a mano in tela monogram con bordi in vacchetta", "misto", "Tela spalmata, vacchetta naturale, ottone dorato"],
    ["accessorio", "Portadocumenti rigido in pelle Epi", "pelle", "Pelle granata Epi, cuciture a filo di lino"],
    ["altro", "Baule da viaggio in tela rinforzata con angolari in ottone", "misto", "Tela spalmata, legno di pioppo, ottone"],
  ] },
  { n: "Dior", s: "DIO", f: ["Francia (Parigi)", "Italia (Toscana)"], a: [
    ["abito", "Abito da sera a corolla in taffetà di seta", "seta", "Taffetà di seta, tulle, crinolina in crine"],
    ["giacca", "Giacca Bar in lana con vita segnata", "lana", "Lana fredda, imbottitura in crine, fodera in seta"],
    ["borsa", "Borsa a mano in tela jacquard con pelle", "misto", "Jacquard di cotone, pelle d'agnello"],
  ] },
  { n: "Saint Laurent", s: "SLR", f: ["Francia (Parigi)", "Italia (Firenze)"], a: [
    ["giacca", "Smoking a un petto in lana e mohair", "lana", "Lana e mohair, rever in raso di seta"],
    ["borsa", "Borsa a tracolla in pelle con placca metallica", "pelle", "Pelle di vitello, ferramenta in ottone"],
    ["camicia", "Camicia in crêpe de chine con fiocco al collo", "seta", "Crêpe de chine di seta"],
  ] },
  { n: "Givenchy", s: "GIV", f: ["Francia (Parigi)", "Italia (Veneto)"], a: [
    ["abito", "Abito a tubino in cady di lana", "lana", "Cady di lana, fodera in viscosa"],
    ["cappotto", "Cappotto scultura in doppia lana", "lana", "Doppia lana, bottoni ricoperti"],
  ] },
  { n: "Celine", s: "CEL", f: ["Francia (Parigi)", "Italia (Toscana)"], a: [
    ["borsa", "Borsa a spalla in pelle liscia con chiusura a molla", "pelle", "Pelle di vitello, fodera in camoscio"],
    ["camicia", "Camicia oversize in popeline di cotone", "cotone", "Popeline di cotone egiziano"],
    ["cappotto", "Cappotto avvolgente in cashmere", "cashmere", "Cashmere doppio, fodera in cupro"],
  ] },
  { n: "Balenciaga", s: "BAL", f: ["Francia (Parigi)", "Spagna (Barcellona)", "Italia (Toscana)"], a: [
    ["giacca", "Giacca scultorea a spalle arrotondate", "lana", "Gabardine di lana, imbottiture strutturali"],
    ["borsa", "Borsa a mano in pelle morbida con borchie", "pelle", "Pelle di agnello, borchie in ottone anticato"],
    ["scarpe", "Stivaletto in pelle con tacco scolpito", "pelle", "Pelle di vitello, suola in cuoio"],
  ] },
  { n: "Gucci", s: "GUC", f: ["Italia (Firenze)", "Italia (Scandicci)", "Italia (Toscana)"], a: [
    ["borsa", "Borsa a mano in pelle con morsetto in bambù", "pelle", "Pelle di maiale, bambù lavorato a fuoco"],
    ["scarpe", "Mocassino in pelle con morsetto in metallo", "pelle", "Pelle di vitello, morsetto placcato oro"],
    ["accessorio", "Foulard in seta stampata a motivi floreali", "seta", "Twill di seta stampato"],
  ] },
  { n: "Prada", s: "PRA", f: ["Italia (Milano)", "Italia (Toscana)", "Italia (Valvigna)"], a: [
    ["borsa", "Zaino in nylon tecnico con triangolo metallico", "nylon", "Nylon tecnico Re-Nylon, pelle, metallo"],
    ["abito", "Abito in seta con taglio geometrico", "seta", "Gazar di seta"],
    ["giacca", "Giacca in gabardine tecnico", "poliestere", "Gabardine di poliestere riciclato"],
  ] },
  { n: "Fendi", s: "FEN", f: ["Italia (Roma)", "Italia (Bagno a Ripoli)"], a: [
    ["borsa", "Borsa a mano in pelle con doppia F", "pelle", "Pelle di vitello, ferramenta dorata"],
    ["cappotto", "Cappotto reversibile in lana e shearling", "lana", "Lana cardata, shearling"],
    ["accessorio", "Stola in seta e lana", "misto", "Seta e lana, frange annodate a mano"],
  ] },
  { n: "Bottega Veneta", s: "BOT", f: ["Italia (Vicenza)", "Italia (Veneto)"], a: [
    ["borsa", "Borsa a mano in pelle intrecciata", "pelle", "Strisce di pelle di agnello intrecciate a mano"],
    ["accessorio", "Pochette intrecciata senza fodera", "pelle", "Pelle di vitello intrecciata, chiusura a incastro"],
    ["scarpe", "Sandalo in pelle con intreccio", "pelle", "Pelle di vitello, suola in cuoio"],
  ] },
  { n: "Valentino", s: "VAL", f: ["Italia (Roma)", "Italia (Como)"], a: [
    ["abito", "Abito da sera rosso in crêpe di seta", "seta", "Crêpe di seta cady, fiocco in faille"],
    ["cappotto", "Cappotto lungo in cashmere", "cashmere", "Cashmere pettinato"],
    ["scarpe", "Décolleté con borchie piramidali", "pelle", "Pelle di vitello, borchie in metallo"],
  ] },
  { n: "Giorgio Armani", s: "ARM", f: ["Italia (Milano)", "Italia (Como)"], a: [
    ["giacca", "Giacca destrutturata in lana fredda", "lana", "Lana fredda, fodera in viscosa"],
    ["pantaloni", "Pantaloni a gamba larga in seta e lana", "misto", "Seta e lana"],
    ["abito", "Abito da sera in chiffon di seta", "seta", "Chiffon di seta, paillettes"],
  ] },
  { n: "Versace", s: "VER", f: ["Italia (Milano)", "Italia (Como)"], a: [
    ["camicia", "Camicia in seta stampata barocca", "seta", "Twill di seta stampato"],
    ["abito", "Abito in maglia metallica", "altro", "Maglia metallica, fodera in seta"],
    ["giacca", "Giacca doppiopetto con bottoni a medusa", "lana", "Lana fredda, bottoni in metallo"],
  ] },
  { n: "Dolce & Gabbana", s: "DGB", f: ["Italia (Milano)", "Italia (Sicilia)", "Italia (Como)"], a: [
    ["abito", "Abito in pizzo con bustier", "misto", "Pizzo di cotone e seta"],
    ["giacca", "Giacca sartoriale in lana mohair", "lana", "Lana e mohair, fodera in seta"],
    ["gonna", "Gonna a ruota in broccato", "misto", "Broccato di seta e lurex"],
  ] },
  { n: "Salvatore Ferragamo", s: "FER", f: ["Italia (Firenze)", "Italia (Osmannoro)"], a: [
    ["scarpe", "Décolleté in pelle con fiocco Vara", "pelle", "Pelle di vitello, suola in cuoio"],
    ["accessorio", "Cintura reversibile con fibbia Gancini", "pelle", "Pelle di vitello, fibbia in ottone"],
    ["borsa", "Borsa a mano in pelle con chiusura Gancini", "pelle", "Pelle di vitello, ferramenta placcata"],
  ] },
  { n: "Max Mara", s: "MAX", f: ["Italia (Reggio Emilia)", "Italia (Emilia-Romagna)"], a: [
    ["cappotto", "Cappotto avvolgente in lana e cashmere", "cashmere", "Lana e cashmere, fodera in viscosa"],
    ["giacca", "Giacca in cammello a un petto", "lana", "Pelo di cammello"],
  ] },
  { n: "Moncler", s: "MON", f: ["Italia (Lombardia)", "Romania (Sibiu)"], a: [
    ["giacca", "Piumino corto trapuntato lucido", "nylon", "Nylon laqué, piumino d'oca 90/10"],
    ["cappotto", "Piumino lungo con cappuccio", "nylon", "Nylon ripstop, piumino d'oca"],
  ] },
  { n: "Loro Piana", s: "LPI", f: ["Italia (Piemonte)", "Italia (Quarona)"], a: [
    ["maglione", "Maglione girocollo in cashmere baby", "cashmere", "Cashmere di capra Hircus"],
    ["giacca", "Giacca in vicuña e seta", "misto", "Vicuña, seta, fodera in cotone"],
    ["pantaloni", "Pantaloni in lino e lana", "lino", "Lino e lana fredda"],
  ] },
  { n: "Brunello Cucinelli", s: "BCU", f: ["Italia (Solomeo)", "Italia (Umbria)"], a: [
    ["maglione", "Cardigan in cashmere a coste", "cashmere", "Cashmere a doppio filo"],
    ["camicia", "Camicia in lino stone-washed", "lino", "Lino lavato"],
    ["giacca", "Giacca in camoscio leggero", "pelle", "Camoscio di agnello"],
  ] },
  { n: "Ermenegildo Zegna", s: "ZEG", f: ["Italia (Trivero)", "Italia (Piemonte)"], a: [
    ["giacca", "Giacca in lana Trofeo", "lana", "Lana merino finissima"],
    ["cappotto", "Cappotto in cashmere e seta", "cashmere", "Cashmere e seta"],
    ["pantaloni", "Pantaloni in lana tropical", "lana", "Lana tropical"],
  ] },
  { n: "Tod's", s: "TOD", f: ["Italia (Marche)", "Italia (Brugnano)"], a: [
    ["scarpe", "Mocassino Gommino in pelle con suola a 133 pallini", "pelle", "Pelle di vitello, gomma"],
    ["borsa", "Borsa a mano in pelle morbida", "pelle", "Pelle di vitello lavata"],
  ] },
  { n: "Missoni", s: "MIS", f: ["Italia (Sumirago)", "Italia (Lombardia)"], a: [
    ["maglione", "Cardigan a zig-zag in maglia", "misto", "Lana e viscosa, lavorazione a maglia"],
    ["abito", "Abito lungo in maglia a onde", "viscosa", "Viscosa e lurex"],
  ] },
  { n: "Etro", s: "ETR", f: ["Italia (Milano)", "Italia (Como)"], a: [
    ["camicia", "Camicia in seta stampata paisley", "seta", "Twill di seta stampato"],
    ["accessorio", "Scialle in cashmere e seta paisley", "cashmere", "Cashmere e seta"],
  ] },
  { n: "Emilio Pucci", s: "PUC", f: ["Italia (Firenze)", "Italia (Como)"], a: [
    ["abito", "Abito in jersey di seta stampato caleidoscopico", "seta", "Jersey di seta stampato"],
    ["camicia", "Camicia in seta a stampa geometrica", "seta", "Twill di seta"],
  ] },
  { n: "Miu Miu", s: "MMI", da: 1993, f: ["Italia (Milano)", "Italia (Toscana)"], a: [
    ["giacca", "Giacca corta in tweed con bottoni gioiello", "lana", "Tweed di lana"],
    ["scarpe", "Ballerina in raso con cristalli", "altro", "Raso, cristalli Swarovski"],
  ] },
  { n: "Marni", s: "MAR", da: 1994, f: ["Italia (Milano)", "Italia (Toscana)"], a: [
    ["abito", "Abito in popeline di cotone a stampa grafica", "cotone", "Popeline di cotone"],
    ["borsa", "Borsa a mano in pelle colorata", "pelle", "Pelle di vitello"],
  ] },
  { n: "Burberry", s: "BUR", f: ["Regno Unito (Castleford)", "Regno Unito (Yorkshire)"], a: [
    ["cappotto", "Trench doppiopetto in gabardine", "cotone", "Gabardine di cotone, fodera a quadri"],
    ["accessorio", "Sciarpa in cashmere a quadri", "cashmere", "Cashmere pettinato"],
    ["giacca", "Giacca trapuntata con collo in velluto", "misto", "Nylon cerato, imbottitura in poliestere"],
  ] },
  { n: "Alexander McQueen", s: "AMQ", da: 1992, f: ["Regno Unito (Londra)", "Italia (Toscana)"], a: [
    ["abito", "Abito scultoreo in crêpe di lana", "lana", "Crêpe di lana, corsetto interno"],
    ["giacca", "Giacca sartoriale dalla spalla affilata", "lana", "Lana fredda, fodera in seta"],
    ["scarpe", "Sneaker in pelle con suola oversize", "pelle", "Pelle di vitello, gomma"],
  ] },
  { n: "Stella McCartney", s: "SMC", da: 2001, f: ["Italia (Veneto)", "Regno Unito (Londra)"], a: [
    ["giacca", "Blazer in lana vegana certificata", "lana", "Lana riciclata certificata"],
    ["borsa", "Borsa in materiale vegetale a base di mais", "altro", "Materiale vegetale, poliestere riciclato"],
  ] },
  { n: "Paul Smith", s: "PSM", f: ["Regno Unito (Nottingham)", "Italia (Toscana)"], a: [
    ["camicia", "Camicia a righe multicolore in popeline", "cotone", "Popeline di cotone"],
    ["giacca", "Giacca in lana con fodera a righe", "lana", "Lana pettinata"],
  ] },
  { n: "Loewe", s: "LOE", f: ["Spagna (Madrid)", "Spagna (Getafe)", "Spagna (Castiglia)"], a: [
    ["borsa", "Borsa a mano a cuscino in pelle", "pelle", "Pelle di vitello nappa"],
    ["accessorio", "Portafoglio in pelle con anagramma", "pelle", "Pelle di vitello"],
    ["giacca", "Giacca in pelle scamosciata", "pelle", "Pelle di agnello scamosciata"],
  ] },
  { n: "Jil Sander", s: "JSA", f: ["Germania (Amburgo)", "Italia (Marche)"], a: [
    ["camicia", "Camicia minimal in popeline", "cotone", "Popeline di cotone"],
    ["cappotto", "Cappotto monopetto in lana", "lana", "Lana cardata"],
  ] },
  { n: "Issey Miyake", s: "ISM", f: ["Giappone (Tokyo)", "Giappone (Niigata)"], a: [
    ["abito", "Abito plissettato in poliestere", "poliestere", "Poliestere termoplissettato"],
    ["camicia", "Camicia in cotone con piegatura origami", "cotone", "Cotone lavorato"],
  ] },
  { n: "Comme des Garçons", s: "CDG", f: ["Giappone (Tokyo)", "Giappone (Kyoto)"], a: [
    ["giacca", "Giacca decostruita in lana", "lana", "Lana cardata, cuciture a vista"],
    ["camicia", "Camicia asimmetrica in cotone", "cotone", "Cotone compatto"],
  ] },
  { n: "Yohji Yamamoto", s: "YYA", f: ["Giappone (Tokyo)", "Giappone (Fukuoka)"], a: [
    ["cappotto", "Cappotto nero oversize in lana", "lana", "Lana bouclé"],
    ["pantaloni", "Pantaloni a gamba ampia in gabardine", "cotone", "Gabardine di cotone"],
  ] },
  { n: "Ralph Lauren Purple Label", s: "RLP", f: ["Stati Uniti (New York)", "Italia (Toscana)"], a: [
    ["giacca", "Blazer in cashmere e seta", "cashmere", "Cashmere e seta"],
    ["camicia", "Camicia button-down in oxford", "cotone", "Oxford di cotone"],
  ] },
  { n: "Tom Ford", s: "TFO", da: 2006, f: ["Italia (Veneto)", "Stati Uniti (New York)"], a: [
    ["giacca", "Smoking in raso di seta", "seta", "Lana e seta, rever in raso"],
    ["scarpe", "Mocassino in velluto con monogramma", "altro", "Velluto di cotone, pelle"],
  ] },
  { n: "Oscar de la Renta", s: "ODR", f: ["Stati Uniti (New York)", "Repubblica Dominicana (Santo Domingo)"], a: [
    ["abito", "Abito da sera in tulle ricamato", "misto", "Tulle di seta, ricami a mano"],
    ["gonna", "Gonna a ruota in taffetà", "seta", "Taffetà di seta"],
  ] },
  { n: "Carolina Herrera", s: "CHE", f: ["Stati Uniti (New York)", "Italia (Lombardia)"], a: [
    ["camicia", "Camicia bianca in popeline con maniche ampie", "cotone", "Popeline di cotone"],
    ["abito", "Abito in faille di seta con gonna a ruota", "seta", "Faille di seta"],
  ] },
  { n: "Goyard", s: "GOY", f: ["Francia (Parigi)", "Francia (Île-de-France)"], a: [
    ["borsa", "Borsa tote in tela chevron con pelle", "misto", "Tela di lino e cotone, pelle di vitello"],
    ["accessorio", "Portacarte in tela chevron dipinta a mano", "misto", "Tela spalmata, pelle"],
  ] },
  { n: "Lanvin", s: "LAN", f: ["Francia (Parigi)", "Italia (Toscana)"], a: [
    ["abito", "Abito drappeggiato in raso di seta", "seta", "Raso di seta"],
    ["scarpe", "Derby in pelle con suola sottile", "pelle", "Pelle di vitello"],
  ] },
  { n: "Chloé", s: "CLO", f: ["Francia (Parigi)", "Italia (Marche)"], a: [
    ["abito", "Abito in georgette di seta con plissé", "seta", "Georgette di seta"],
    ["borsa", "Borsa a tracolla in pelle con ferramenta dorata", "pelle", "Pelle di vitello"],
  ] },
  { n: "Balmain", s: "BLM", f: ["Francia (Parigi)", "Italia (Toscana)"], a: [
    ["giacca", "Blazer doppiopetto con bottoni dorati", "lana", "Lana, bottoni dorati"],
    ["abito", "Abito in jersey con spalle strutturate", "viscosa", "Jersey di viscosa"],
  ] },
  { n: "Kenzo", s: "KEN", f: ["Francia (Parigi)", "Giappone (Tokyo)"], a: [
    ["maglione", "Maglione in lana con ricamo floreale", "lana", "Lana merino, ricamo a macchina"],
    ["camicia", "Camicia in cotone a stampa tropicale", "cotone", "Cotone stampato"],
  ] },
  { n: "Jacquemus", s: "JAC", da: 2009, f: ["Francia (Parigi)", "Portogallo (Porto)"], a: [
    ["borsa", "Borsa minuscola in pelle con manico rigido", "pelle", "Pelle di vitello"],
    ["abito", "Abito corto scultoreo in viscosa", "viscosa", "Viscosa e acetato"],
  ] },
];

const LUOGHI = [
  // città di riferimento della moda (più frequenti: servono ai primi acquisti)
  "Parigi, Francia", "Milano, Italia", "Londra, Regno Unito", "New York, Stati Uniti", "Tokyo, Giappone",
  "Roma, Italia", "Firenze, Italia", "Ginevra, Svizzera", "Dubai, Emirati Arabi Uniti", "Hong Kong, Cina",
  "Los Angeles, Stati Uniti", "Madrid, Spagna", "Monaco di Baviera, Germania", "Seul, Corea del Sud", "Singapore, Singapore",
  // resto del mondo, in tutti i continenti
  "Zurigo, Svizzera", "Vienna, Austria", "Bruxelles, Belgio", "Amsterdam, Paesi Bassi", "Copenaghen, Danimarca",
  "Stoccolma, Svezia", "Oslo, Norvegia", "Helsinki, Finlandia", "Reykjavík, Islanda", "Lisbona, Portogallo",
  "Atene, Grecia", "Praga, Repubblica Ceca", "Varsavia, Polonia", "Budapest, Ungheria", "Istanbul, Turchia",
  "Mosca, Russia", "Dublino, Irlanda", "Edimburgo, Regno Unito", "Barcellona, Spagna", "Monaco, Principato di Monaco",
  "Provenza, Francia", "Toscana, Italia", "Sicilia, Italia", "Puglia, Italia", "Catalogna, Spagna", "Baviera, Germania",
  "Shanghai, Cina", "Pechino, Cina", "Osaka, Giappone", "Hokkaidō, Giappone", "Taipei, Taiwan", "Bangkok, Thailandia",
  "Kuala Lumpur, Malesia", "Giacarta, Indonesia", "Manila, Filippine", "Hanoi, Vietnam", "Mumbai, India", "Nuova Delhi, India",
  "Doha, Qatar", "Riad, Arabia Saudita", "Tel Aviv, Israele", "Il Cairo, Egitto", "Marrakech, Marocco", "Tunisi, Tunisia",
  "Lagos, Nigeria", "Nairobi, Kenya", "Accra, Ghana", "Città del Capo, Sudafrica", "Johannesburg, Sudafrica",
  "Toronto, Canada", "Montréal, Canada", "Vancouver, Canada", "Miami, Stati Uniti", "Chicago, Stati Uniti", "California, Stati Uniti",
  "Città del Messico, Messico", "Bogotà, Colombia", "Lima, Perù", "Santiago, Cile", "Buenos Aires, Argentina", "São Paulo, Brasile",
  "Rio de Janeiro, Brasile", "Sydney, Australia", "Melbourne, Australia", "Nuovo Galles del Sud, Australia", "Auckland, Nuova Zelanda",
];
const LUOGHI_PRIMI_ACQUISTI = LUOGHI.slice(0, 15);

const LABORATORI = [
  ["Atelier Rinnova", "Parigi, Francia"], ["Bottega Ferraris", "Milano, Italia"], ["Kintsugi Couture", "Kyoto, Giappone"],
  ["Maison Reparo", "Bruxelles, Belgio"], ["Nordic Mend", "Copenaghen, Danimarca"], ["Taller Hilo de Oro", "Madrid, Spagna"],
  ["Sartoria Levante", "Napoli, Italia"], ["Couture Revival", "New York, Stati Uniti"], ["Atelier Nomade", "Marrakech, Marocco"],
  ["Studio Fil Doré", "Ginevra, Svizzera"], ["Re-Loom Workshop", "Londra, Regno Unito"], ["Oficina do Couro", "Lisbona, Portogallo"],
  ["Seoul Stitch Lab", "Seul, Corea del Sud"], ["Jaipur Threadworks", "Jaipur, India"], ["Ateliê Renascer", "São Paulo, Brasile"],
  ["Sydney Restoration Co.", "Sydney, Australia"], ["Pelletteria Artigiana Lecce", "Lecce, Italia"], ["Laboratorio Rinascita", "Bari, Italia"],
  ["Maison Fil Rouge", "Lione, Francia"], ["Werkstatt Neuanfang", "Vienna, Austria"], ["Studio Kiyomi", "Tokyo, Giappone"],
  ["Cape Mend & Co.", "Città del Capo, Sudafrica"], ["Hong Kong Needle Guild", "Hong Kong, Cina"], ["Toronto Heritage Tailors", "Toronto, Canada"],
];

const NOMI = ["Giulia", "Marco", "Laura", "Francesca", "Paolo", "Elena", "Luca", "Chiara", "Andrea", "Sofia", "Camille", "Louis", "Élodie",
  "Hugo", "Charlotte", "James", "Eleanor", "Oliver", "Isabella", "Emma", "Michael", "Sarah", "Daniel", "Yuki", "Haruto", "Mei", "Wei", "Jin",
  "Min-jun", "Aarav", "Priya", "Omar", "Leila", "Youssef", "Amara", "Kofi", "Thabo", "Ana", "Mateo", "Valentina", "Sebastián", "Lucía",
  "Lars", "Astrid", "Freja", "Henrik", "Ingrid", "Noa", "Dmitri", "Anastasia", "Kwame", "Zara", "Sven", "Tomás", "Ines"];
const COGNOMI = ["Conti", "Esposito", "Ricci", "De Santis", "Bianchi", "Moretti", "Romano", "Greco", "Fontana", "Marino", "Dubois", "Lefèvre",
  "Moreau", "Laurent", "Bernard", "Smith", "Thompson", "Hughes", "Carter", "Bennett", "Nakamura", "Tanaka", "Watanabe", "Chen", "Wang", "Kim",
  "Park", "Sharma", "Mehta", "Haddad", "Nasser", "Diallo", "Okafor", "Mensah", "Nkosi", "Silva", "Fernández", "Rojas", "Andersson", "Nielsen",
  "Hansen", "Berg", "Kowalski", "Novak", "Petrov", "Ivanova", "Weber", "Schneider", "Lopes", "Costa", "Almeida", "Cohen"];
const RIVENDITE = ["Casa del Ritorno", "Archivio Eleganza", "Bottega del Tempo", "Sala del Guardaroba", "Maison du Temps", "Salon Intemporel",
  "The Second Chapter Boutique", "Guardaroba Sereno", "Empório Aurora", "Galleria Seconda Vita", "Atelier Memoria", "Vintage Nord Collection"];

// Interventi plausibili per gruppo di prodotto: [descrizione, materiale nuovo]
const EVENTI = {
  riparazione: {
    borse: [
      ["Ricucitura dei manici e ritocco del colore sugli angoli", "Filo di lino cerato e tinture all'acqua"],
      ["Fodera interna rifatta e lucidatura della ferramenta", "Cotone biologico e cera d'api"],
      ["Sostituzione della cerniera e rinforzo delle cuciture laterali", "Cerniera in ottone di recupero"],
    ],
    scarpe: [
      ["Risuolatura a mano e lucidatura della tomaia", "Cuoio conciato al vegetale"],
      ["Rinforzo del contrafforte e ritocco del colore sulla punta", "Pelle di recupero e cere naturali"],
    ],
    tessile: [
      ["Rammendo invisibile e rinforzo delle cuciture", "Filato di seta recuperato"],
      ["Ricostruzione dell'orlo e stiratura a vapore", "Cotone riciclato"],
      ["Sostituzione della fodera lacerata e fermatura dei bottoni", "Viscosa rigenerata certificata"],
    ],
  },
  sostituzione_parti: {
    borse: [
      ["Nuova tracolla in pelle e moschettoni in ottone", "Pelle conciata al vegetale, ottone recuperato"],
      ["Sostituzione della chiusura e dei rivetti", "Ottone di recupero"],
    ],
    scarpe: [
      ["Nuova suola in cuoio e tacco rifatto", "Cuoio conciato al vegetale"],
      ["Sostituzione della fibbia e delle fodere interne", "Ottone recuperato, pelle di capretto"],
    ],
    tessile: [
      ["Bottoni sostituiti con bottoni in madreperla di recupero", "Madreperla di recupero"],
      ["Colletto e polsini rifatti con tessuto originale di scorta", "Tessuto di giacenza originale"],
      ["Nuova zip in metallo e fodera in seta", "Seta biologica, zip in ottone"],
    ],
  },
  upcycling: {
    borse: [
      ["Trasformata in un modello più compatto con pelle di recupero", "Pelle di recupero"],
      ["Pannelli originali riutilizzati per un nuovo accessorio abbinato", "Pannelli originali del capo"],
    ],
    scarpe: [["Tomaia rinnovata con pelle di recupero e nuova tintura naturale", "Pelle di recupero, tinture naturali"]],
    tessile: [
      ["Modello accorciato e rimodernato, con scampoli originali per i dettagli", "Scampoli originali del capo"],
      ["Trasformato in un capo senza stagione con tinture naturali", "Tinture naturali"],
    ],
  },
};

const GRUPPO = { borsa: "borse", accessorio: "borse", altro: "borse", scarpe: "scarpe" }; // il resto è "tessile"

// Generatore pseudo-casuale con seme (mulberry32): stesso seme, stessa sequenza
function generatore(seme) {
  let a = seme >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FINE = Date.UTC(2026, 7, 15); // tutte le date precedono il 15 agosto 2026: mai nel futuro
const GIORNO = 86_400_000;

export const NUMERO_CAPI_PREDEFINITO = 216;

/** Restituisce `quanti` capi con eventi e passaggi di proprietà, ordinati per codice tag. */
export function generaArchivio({ quanti = NUMERO_CAPI_PREDEFINITO, seme = 20260930 } = {}) {
  const rnd = generatore(seme);
  const scegli = (lista) => lista[Math.floor(rnd() * lista.length)];
  const tra = (min, max) => min + Math.floor(rnd() * (max - min + 1));
  const nomePersona = () => (rnd() < 0.3 ? scegli(RIVENDITE) : `${scegli(NOMI)} ${scegli(COGNOMI)}`);
  const capi = [];

  for (let i = 0; i < quanti; i++) {
    const brand = BRAND[i % BRAND.length];
    const [categoria, modello, materiale, materialiOriginari] = brand.a[(Math.floor(i / BRAND.length) + tra(0, 2)) % brand.a.length];

    // anno di produzione 1980–2025, con più capi recenti
    const annoMin = Math.max(1980, brand.da ?? 1980);
    const anno = Math.min(2025, annoMin + Math.floor(rnd() ** 0.85 * (2025 - annoMin + 1)));
    const inizio = Date.UTC(anno, tra(0, 11), tra(1, 28));
    const eta = 2026 - anno;

    // passaggi di proprietà: primo acquisto entro un anno dalla produzione, poi scambi distribuiti fino a oggi
    const nPassaggi = Math.min(6, 1 + Math.floor(rnd() * Math.min(5.99, 1 + eta / 6)));
    const primo = Math.min(inizio + tra(10, 330) * GIORNO, FINE - 120 * GIORNO);
    const passaggi = [{ proprietario: nomePersona(), luogo: scegli(LUOGHI_PRIMI_ACQUISTI), data: primo }];
    for (let k = 1; k < nPassaggi; k++) {
      const da = primo + ((FINE - 60 * GIORNO - primo) * (k - 1)) / (nPassaggi - 1);
      const a = primo + ((FINE - 60 * GIORNO - primo) * k) / (nPassaggi - 1);
      passaggi.push({ proprietario: nomePersona(), luogo: scegli(LUOGHI), data: Math.round(da + (a - da) * (0.15 + rnd() * 0.8)) });
    }

    // interventi di rigenerazione (più probabili sui capi più anziani)
    const nEventi = eta < 3 ? (rnd() < 0.2 ? 1 : 0) : Math.min(3, Math.floor(rnd() * (1 + Math.min(3, eta / 10))) + (rnd() < 0.35 ? 1 : 0));
    const gruppo = GRUPPO[categoria] ?? "tessile";
    const eventi = [];
    for (let k = 0; k < nEventi; k++) {
      const tipo = scegli(["riparazione", "riparazione", "sostituzione_parti", "upcycling"]);
      const [operatore, luogoLab] = scegli(LABORATORI);
      const data = primo + 90 * GIORNO + Math.floor(rnd() * Math.max(1, FINE - 30 * GIORNO - primo - 90 * GIORNO));
      const [descrizione, materialiNuovi] = scegli(EVENTI[tipo][gruppo]);
      eventi.push({
        tipo,
        descrizione,
        materialiNuovi,
        operatore,
        luogo: luogoLab,
        data: Math.min(data, FINE - 30 * GIORNO),
      });
    }
    eventi.sort((x, y) => x.data - y.data);

    const numero = String(i + 1).padStart(3, "0");
    capi.push({
      capo: {
        tagId: `LUX-${brand.s}-${anno}-${numero}`,
        brand: brand.n,
        codiceModello: `${modello} (${brand.s}-${String(categoria).slice(0, 3).toUpperCase()}-${anno})`.slice(0, 100),
        materialiOriginari,
        filieraProvenienza: scegli(brand.f),
        categoria,
        materialePrincipale: materiale,
        annoProduzione: anno,
      },
      eventi: eventi.map((e) => ({ ...e, data: new Date(e.data).toISOString() })),
      passaggi: passaggi.map((p) => ({ ...p, data: new Date(p.data).toISOString() })),
    });
  }
  return capi;
}

/** Riepilogo dell'archivio generato (per la modalità di prova e per il report). */
export function riepilogoArchivio(capi) {
  const conta = (valori) => [...valori.reduce((m, v) => m.set(v, (m.get(v) ?? 0) + 1), new Map())].sort((a, b) => b[1] - a[1]);
  const paesi = capi.flatMap((c) => c.passaggi.map((p) => p.luogo.split(",").at(-1).trim()));
  const anni = capi.map((c) => c.capo.annoProduzione);
  return {
    capi: capi.length,
    brand: new Set(capi.map((c) => c.capo.brand)).size,
    eventi: capi.reduce((n, c) => n + c.eventi.length, 0),
    passaggi: capi.reduce((n, c) => n + c.passaggi.length, 0),
    paesi: new Set(paesi).size,
    annoMin: Math.min(...anni),
    annoMax: Math.max(...anni),
    primiPaesi: conta(paesi).slice(0, 8),
  };
}
