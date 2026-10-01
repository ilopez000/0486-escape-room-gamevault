// Ressaltat senzill de sintaxi Java (paraules clau, cadenes, comentaris, números i tipus).
// Retorna HTML segur: tot el text s'escapa abans de pintar-lo.

const CLAU = new Set([
  'public', 'private', 'protected', 'static', 'final', 'class', 'record', 'interface', 'void', 'new', 'return',
  'if', 'else', 'for', 'while', 'do', 'try', 'catch', 'finally', 'throw', 'throws', 'import', 'package', 'int',
  'long', 'double', 'boolean', 'char', 'byte', 'var', 'null', 'true', 'false', 'continue', 'break', 'this',
]);

function escapa(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const PATRO =
  /(\/\/[^\n]*)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])')|(\b\d+(?:\.\d+)?[LDF]?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|(@[A-Za-z]+)/g;

export function ressalta(codi: string): string {
  let sortida = '';
  let ultim = 0;
  for (const m of codi.matchAll(PATRO)) {
    const i = m.index ?? 0;
    sortida += escapa(codi.slice(ultim, i));
    const [tot, comentari, cadena, caracter, numero, paraula, anotacio] = m;
    if (comentari) sortida += `<span class="tk-com">${escapa(comentari)}</span>`;
    else if (cadena || caracter) sortida += `<span class="tk-str">${escapa(tot)}</span>`;
    else if (numero) sortida += `<span class="tk-num">${escapa(numero)}</span>`;
    else if (anotacio) sortida += `<span class="tk-ann">${escapa(anotacio)}</span>`;
    else if (paraula && CLAU.has(paraula)) sortida += `<span class="tk-kw">${paraula}</span>`;
    else if (paraula && /^[A-Z]/.test(paraula)) sortida += `<span class="tk-tipus">${paraula}</span>`;
    else sortida += escapa(tot);
    ultim = i + tot.length;
  }
  return sortida + escapa(codi.slice(ultim));
}
