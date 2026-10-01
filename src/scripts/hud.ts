// Barra superior: agent, XP, integritat i fragments de la clau.
import { SALES } from '../data/joc';
import { carrega, desa, emmagatzematgeDisponible, xpTotal, type Estat } from './estat';

export function pintaHud(estat: Estat = carrega()): void {
  const hud = document.getElementById('hud');
  if (!hud) return;
  hud.querySelector<HTMLElement>('[data-hud="agent"]')!.textContent = estat.agent || '—';
  hud.querySelector<HTMLElement>('[data-hud="xp"]')!.textContent = String(xpTotal(estat));

  const barra = hud.querySelector<HTMLElement>('[data-hud="barra"]')!;
  barra.style.width = `${estat.integritat}%`;
  barra.dataset.nivell = estat.integritat > 60 ? 'alt' : estat.integritat > 30 ? 'mig' : 'baix';
  hud.querySelector<HTMLElement>('[data-hud="integritat"]')!.textContent = `${estat.integritat}%`;

  const slots = hud.querySelector<HTMLElement>('[data-hud="fragments"]')!;
  slots.innerHTML = '';
  SALES.forEach((sala) => {
    const slot = document.createElement('span');
    const tinc = estat.sales[sala.id]?.completada;
    slot.className = tinc ? 'slot ple' : 'slot';
    slot.textContent = tinc ? sala.fragment.lletra : '?';
    slot.title = tinc ? `Cartutx del ${sala.codi.toLowerCase()}` : `${sala.codi} pendent`;
    slots.append(slot);
  });

  const boto = hud.querySelector<HTMLButtonElement>('[data-hud="so"]')!;
  boto.textContent = estat.so ? '♪ So' : '♪ Mut';
  boto.setAttribute('aria-pressed', String(estat.so));
}

export function iniciaHud(): void {
  pintaHud();
  if (!emmagatzematgeDisponible()) {
    const avis = document.createElement('p');
    avis.className = 'avis-emmagatzematge';
    avis.textContent =
      'El teu navegador no deixa desar dades d\'aquesta web. Pots jugar igualment, però no tanquis aquesta pestanya o perdràs el progrés.';
    document.querySelector('.contingut')?.prepend(avis);
  }
  document.querySelector<HTMLButtonElement>('[data-hud="so"]')?.addEventListener('click', () => {
    const estat = carrega();
    estat.so = !estat.so;
    desa(estat);
    pintaHud(estat);
  });
}

/** Petita animació quan canvia un valor del HUD. */
export function destacaHud(camp: 'xp' | 'integritat'): void {
  const el = document.querySelector<HTMLElement>(`[data-hud="${camp}"]`)?.closest<HTMLElement>('.hud-bloc');
  if (!el) return;
  el.classList.remove('pols');
  void el.offsetWidth;
  el.classList.add('pols');
}
