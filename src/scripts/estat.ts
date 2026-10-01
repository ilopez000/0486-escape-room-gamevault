// Estat de la partida. Es desa al navegador de l'alumne.
import { PUNTS, SALES } from '../data/joc';

export interface EstatSala {
  completada: boolean;
  xp: number;
  errors: number;
  pistes: number;
}

export interface Estat {
  agent: string;
  sales: Record<number, EstatSala>;
  integritat: number;
  clauIntroduida: boolean;
  final: EstatSala;
  so: boolean;
}

const CLAU = 'gamevault-0486-v1';

function buit(): Estat {
  return {
    agent: '',
    sales: {},
    integritat: 100,
    clauIntroduida: false,
    final: { completada: false, xp: 0, errors: 0, pistes: 0 },
    so: true,
  };
}

// La partida es desa a localStorage. Si el navegador el té bloquejat (galetes o dades de llocs
// desactivades), es desa a window.name, que es conserva mentre no es tanqui la pestanya.
const PREFIX_NOM = 'gv0486:';

function llegeixDesat(): string | null {
  try {
    const desat = localStorage.getItem(CLAU);
    if (desat) return desat;
  } catch {
    /* emmagatzematge bloquejat */
  }
  return window.name.startsWith(PREFIX_NOM) ? window.name.slice(PREFIX_NOM.length) : null;
}

export function emmagatzematgeDisponible(): boolean {
  try {
    const prova = '__prova__';
    localStorage.setItem(prova, '1');
    localStorage.removeItem(prova);
    return true;
  } catch {
    return false;
  }
}

export function carrega(): Estat {
  try {
    const desat = llegeixDesat();
    if (!desat) return buit();
    return { ...buit(), ...(JSON.parse(desat) as Partial<Estat>) };
  } catch {
    return buit();
  }
}

export function desa(estat: Estat): void {
  const text = JSON.stringify(estat);
  window.name = PREFIX_NOM + text;
  try {
    localStorage.setItem(CLAU, text);
  } catch {
    /* sense localStorage: queda a window.name */
  }
}

export function reinicia(): Estat {
  const nou = buit();
  nou.so = carrega().so;
  desa(nou);
  return nou;
}

export function salaDesbloquejada(estat: Estat, id: number): boolean {
  return id === 1 || Boolean(estat.sales[id - 1]?.completada);
}

export function totesCompletades(estat: Estat): boolean {
  return SALES.every((sala) => estat.sales[sala.id]?.completada);
}

export function xpTotal(estat: Estat): number {
  const sales = Object.values(estat.sales).reduce((suma, s) => suma + (s.completada ? s.xp : 0), 0);
  return sales + (estat.final.completada ? estat.final.xp : 0);
}

/** Màxim possible: cada repte de cada nivell més el boss final. */
export function xpMaxim(): number {
  const panys = SALES.reduce((suma, sala) => suma + sala.proves.length, 0) + 1;
  return panys * PUNTS.pany;
}

export function xpPany(errors: number, pistes: number): number {
  return Math.max(PUNTS.minimPany, PUNTS.pany - errors * PUNTS.error - pistes * PUNTS.pista);
}

export function perdIntegritat(estat: Estat): void {
  estat.integritat = Math.max(0, estat.integritat - PUNTS.integritatError);
  desa(estat);
}

export function url(camí: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${camí.replace(/^\//, '')}`;
}
