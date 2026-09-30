// Lettura dei tag NFC dal browser (Web NFC): disponibile solo su Chrome per Android.
// Su iPhone non serve: il sistema apre da solo l'URL scritto nel tag.
export const nfcDisponibile = () => typeof window !== "undefined" && "NDEFReader" in window;

export async function leggiTagNfc({ signal } = {}) {
  // eslint-disable-next-line no-undef
  const lettore = new NDEFReader();
  await lettore.scan({ signal });
  return new Promise((resolve, reject) => {
    lettore.onreadingerror = () => reject(new Error("Tag non leggibile: riprova avvicinando il telefono."));
    lettore.onreading = (evento) => {
      const uid = (evento.serialNumber ?? "").replaceAll(":", "").toUpperCase() || null;
      for (const record of evento.message.records) {
        if (record.recordType === "url" || record.recordType === "absolute-url") {
          resolve({ url: new TextDecoder().decode(record.data), uid });
          return;
        }
      }
      resolve({ url: null, uid });
    };
  });
}
