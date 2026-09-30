// Icone lineari (SVG in linea: nessuna libreria esterna)
const Base = ({ children, dimensione = 22, ...resto }) => (
  <svg width={dimensione} height={dimensione} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...resto}>
    {children}
  </svg>
);

export const IconaScansione = (p) => (
  <Base {...p}>
    <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
    <path d="M7 12h10" />
  </Base>
);
export const IconaScudo = (p) => (
  <Base {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </Base>
);
export const IconaAgo = (p) => (
  <Base {...p}>
    <path d="M19 5L7 17M16 4l4 4M5 19c1-2 2-3 4-3" />
    <path d="M14 6c-4 0-9 3-9 8" strokeDasharray="2 2.5" />
  </Base>
);
export const IconaFoglia = (p) => (
  <Base {...p}>
    <path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14" />
    <path d="M5 19l7-7" />
  </Base>
);
export const IconaGruccia = (p) => (
  <Base {...p}>
    <path d="M12 7a2 2 0 1 1 2-2c0 1.2-2 1.5-2 3v1" />
    <path d="M12 9L3 16a1 1 0 0 0 .6 1.8h16.8A1 1 0 0 0 21 16l-9-7z" />
  </Base>
);
export const IconaOrologio = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Base>
);
export const IconaUtente = (p) => (
  <Base {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c1-3.5 3.8-5 7-5s6 1.5 7 5" />
  </Base>
);
export const IconaChip = (p) => (
  <Base {...p}>
    <path d="M6 8.5a8 8 0 0 1 0 7M9.5 6.5a12 12 0 0 1 0 11M13 5a15 15 0 0 1 0 14" />
    <rect x="16" y="9" width="4" height="6" rx="1" />
  </Base>
);
export const IconaCestino = (p) => (
  <Base {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" />
  </Base>
);
export const IconaFreccia = (p) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);
