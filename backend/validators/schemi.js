// Validazione dei dati in ingresso (requisito R: nessun dato malformato nel database).
import { z } from "zod";
import { TIPI_EVENTO, RUOLI, CATEGORIE, MATERIALI, STATI_CAPO, TAG_REGEX } from "../models/costanti.js";

const testo = (max) => z.string().trim().min(1, "Campo obbligatorio").max(max, `Massimo ${max} caratteri`);
const testoOpzionale = (max) => z.string().trim().max(max, `Massimo ${max} caratteri`).optional();

export const tagId = z.string().trim().regex(TAG_REGEX, "Il tagId deve avere 3-64 caratteri tra lettere, numeri, - e _");
export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "ID non valido");

export const login = z.object({
  email: z.string().trim().email("Email non valida"),
  password: z.string().min(1, "Password obbligatoria").max(200),
});

export const nuovoUtente = z.object({
  nome: testo(100),
  email: z.string().trim().email("Email non valida"),
  password: z.string().min(10, "La password deve avere almeno 10 caratteri").max(200),
  ruolo: z.enum(RUOLI),
  organizzazione: testoOpzionale(150),
});

export const cambioPassword = z.object({
  vecchia: z.string().min(1).max(200),
  nuova: z.string().min(10, "La nuova password deve avere almeno 10 caratteri").max(200),
});

const campiCapo = {
  brand: testo(100),
  codiceModello: testo(100),
  materialiOriginari: testo(300),
  filieraProvenienza: testoOpzionale(200),
  categoria: z.enum(CATEGORIE).optional(),
  materialePrincipale: z.enum(MATERIALI).optional(),
  annoProduzione: z.coerce
    .number()
    .int()
    .min(1900)
    .refine((a) => a <= new Date().getFullYear(), "L'anno non può essere nel futuro")
    .optional(),
};

// In modifica i campi facoltativi si possono svuotare inviando null
const svuotabile = (schema) => schema.unwrap().nullable().optional();

export const nuovoCapo = z
  .object({ ...campiCapo, tagId, proprietarioIniziale: testoOpzionale(100) })
  .strict();

// Il tagId NON è modificabile: è il legame con il chip fisico
export const modificaCapo = z
  .object({
    ...campiCapo,
    filieraProvenienza: svuotabile(campiCapo.filieraProvenienza),
    categoria: svuotabile(campiCapo.categoria),
    materialePrincipale: svuotabile(campiCapo.materialePrincipale),
    annoProduzione: svuotabile(campiCapo.annoProduzione),
  })
  .partial()
  .strict()
  .refine((d) => Object.keys(d).length > 0, "Nessun campo da modificare");

export const nuovoEvento = z
  .object({
    tipo: z.enum(TIPI_EVENTO, {
      errorMap: () => ({ message: `Il campo 'tipo' deve essere uno tra: ${TIPI_EVENTO.join(", ")}` }),
    }),
    descrizione: testo(1000),
    materialiNuovi: testoOpzionale(300),
    operatore: testoOpzionale(100),
    data: z.coerce
      .date()
      .refine((d) => d.getTime() <= Date.now() + 60_000, "La data non può essere nel futuro")
      .optional(),
  })
  .strict();

export const nuovoPassaggio = z.object({ proprietario: testo(100) }).strict();

export const filtriElenco = z.object({
  q: z.string().trim().max(100).optional(),
  stato: z.enum(STATI_CAPO).optional(),
  pagina: z.coerce.number().int().min(1).default(1),
  perPagina: z.coerce.number().int().min(1).max(100).default(20),
});

const hex = (n) => z.string().regex(new RegExp(`^[0-9A-Fa-f]{${n}}$`), `Atteso un valore esadecimale di ${n} caratteri`);

// Messaggio SUN del chip NTAG 424 DNA (parametri dell'URL: e = PICCData, c = CMAC)
export const messaggioSun = z.object({ e: hex(32), c: hex(16) });

export const associaNfc = z.union([messaggioSun.strict(), z.object({ uid: hex(14) }).strict()]);
