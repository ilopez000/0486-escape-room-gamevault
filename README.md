# GameVault · Save corrupted · escape room de repàs del MP 0486

Escape room en línia per repassar les **sessions 1 a 5** del mòdul **0486 Accés a dades** (DAM2) i practicar amb
fragments de codi Java. Fet amb **Astro**. Tot el joc funciona al navegador de l'alumne.

## La història

El servidor de partides desades de **GameVault** s'ha corromput: un glitch, el **BUG·0x00**, s'està menjant el
catàleg, les còpies de seguretat i les hores jugades. L'alumnat fa de debugger i supera cinc nivells, un per sessió. A
cada nivell primer **desbloqueja el manual** (la teoria, amb el codi dels exemples de classe explicat fragment a
fragment) i després supera els **reptes**. Cada nivell dona un cartutx amb una lletra; amb els cinc s'escriu la
contrasenya (**BYTES**) i s'arriba al **boss final**.

## Els nivells

| Nivell | Sessió | Reptes |
|---|---|---|
| 1 · Pantalla d'inici | 1 · Entorn, GameVault i el record `Joc` | Preguntes (volàtil/persistent, record) · completar `Joc.java` |
| 2 · Path i Files | 2 · `java.nio.file` | Toca el disc o només la ruta? · endevina la sortida de 5 fragments |
| 3 · L'explorador | 3 · Recórrer la carpeta de dades | Completar el recorregut amb `Files.walk` · el mètode de `Files` per a cada necessitat |
| 4 · Els fluxos | 4 · Bytes, caràcters i try-with-resources | Bytes o caràcters · caça els 3 bugs d'un programa · ordena la còpia de bytes (amb línies trampa) |
| 5 · CSV i accés aleatori | 5 · OpenCSV i `RandomAccessFile` | Què passa amb cada línia del CSV brut · completar el `seek` · seqüencial o aleatori |
| Boss · BUG·0x00 | Repàs | Contrasenya BYTES + 5 preguntes, algunes amb codi |

El codi és el dels exemples del repositori `ilopez000/0486-acces-a-dades` (paquets `model`, `sessio2` i `sessio5`).

## Tipus de repte

- **Completar codi**: un fitxer Java amb forats; a cada forat es tria la peça bona d'un desplegable.
- **Endevina la sortida**: un fragment de codi i quatre respostes possibles.
- **Caça el bug**: el programa sencer, línia a línia, i cal marcar les que tenen error.
- **Ordena el codi**: les línies desordenades, amb alguna línia trampa que no hi ha de ser.
- També classificar, aparellar i preguntes de resposta única.

Cada repte val **100 XP**; cada comprovació amb errors en treu 10 i cada pista 30. Cada error treu un 4% de vida (sense
«game over»). A partir del segon intent fallit surt l'explicació dels errors. Al final hi ha un informe amb rang,
insígnies, detall per nivell i una llista de comprovació, que es pot desar en PDF.

## Com s'executa al teu ordinador

Cal **Node.js 22 o superior**. Doble clic a `executa-escape-room.bat` (o `npm install` i `npm run dev`). S'obre a
`http://localhost:4323`. Mentre es juga, la finestra negra ha de quedar oberta.

## Com canviar el contingut

Tot el text, el codi i les respostes són a **`src/data/joc.ts`**. Als reptes de completar, cada `[[n]]` del codi és un
forat i `buits[n]` en diu les opcions i la resposta correcta.

## Publicació

Preparat per a **Cloudflare Pages**: repositori connectat, `npm run build`, carpeta `dist`, Node 22 (fitxer
`.node-version`). Cada canvi pujat al repositori es torna a publicar sol.

---

Ignacio López Aylagas · Prat FP · MP 0486 Accés a dades · curs 2026-27
