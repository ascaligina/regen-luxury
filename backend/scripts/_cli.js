// Utilità per gli script da terminale (colori, input nascosto, chiamate HTTP).
import readline from "node:readline";

export const colore = {
  verde: (t) => `\x1b[32m${t}\x1b[0m`,
  rosso: (t) => `\x1b[31m${t}\x1b[0m`,
  giallo: (t) => `\x1b[33m${t}\x1b[0m`,
  ciano: (t) => `\x1b[36m${t}\x1b[0m`,
};

// Chiede un valore al terminale. Con { nascosto: true } (password) al posto dei
// caratteri scritti o incollati compare un * per ciascuno.
export function chiedi(domanda, { nascosto = false } = {}) {
  if (nascosto && process.stdin.isTTY) return chiediNascosto(domanda);
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: !nascosto && process.stdin.isTTY });
    rl.question(domanda, (risposta) => {
      rl.close();
      resolve(risposta.trim());
    });
  });
}

// Lettura carattere per carattere in "raw mode": il terminale mostra solo asterischi.
function chiediNascosto(domanda) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    stdout.write(domanda);
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.resume();
    let valore = "";
    const fine = () => {
      stdin.off("data", suDati);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write("\n");
      resolve(valore.trim());
    };
    const suDati = (blocco) => {
      // toglie le sequenze di controllo (frecce, incolla "bracketed" del terminale)
      for (const c of blocco.replace(/\x1b\[[0-9;?]*[~A-Za-z]/g, "")) {
        if (c === "\r" || c === "\n") return fine();
        if (c === "\u0003") { // Ctrl+C
          stdin.setRawMode(false);
          stdout.write("\n");
          process.exit(130);
        }
        if (c === "\u007f" || c === "\b") { // cancella
          if (valore) {
            valore = valore.slice(0, -1);
            stdout.write("\b \b");
          }
        } else if (c >= " ") {
          valore += c;
          stdout.write("*");
        }
      }
    };
    stdin.on("data", suDati);
  });
}

export async function chiamata(base, metodo, percorso, { corpo, token } = {}) {
  const risposta = await fetch(`${base}${percorso}`, {
    method: metodo,
    headers: {
      ...(corpo ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const testo = await risposta.text();
  let dati;
  try {
    dati = JSON.parse(testo);
  } catch {
    dati = testo;
  }
  return { status: risposta.status, dati };
}

export const attendi = (ms) => new Promise((r) => setTimeout(r, ms));
