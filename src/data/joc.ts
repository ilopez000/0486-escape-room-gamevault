// =====================================================================
//  GAMEVAULT · SAVE CORRUPTED · Escape room de repàs de les sessions 1-5 del MP 0486
//  Tot el contingut del joc és aquí: narrativa, teoria i proves.
//  Per canviar una pregunta o afegir-ne una, només cal tocar aquest fitxer.
// =====================================================================

export type Categoria = string;

/** Classificar cada element en una de les categories (IT / OT / Frontera...). */
export interface ProvaClassificar {
  tipus: 'classificar';
  titol: string;
  enunciat: string;
  categories: Categoria[];
  elements: { text: string; correcta: Categoria; perque: string }[];
  /** Els elements són fragments de codi (es pinten en lletra monoespaiada). */
  codi?: boolean;
  pista: string;
}

/** Marcar totes les targetes que compleixen una condició. */
export interface ProvaSeleccionar {
  tipus: 'seleccionar';
  titol: string;
  enunciat: string;
  /** Text que surt a la targeta quan està marcada. */
  etiqueta: string;
  missatgeOk: string;
  /** Les targetes són línies d'un mateix programa (caça d'errors). */
  codi?: boolean;
  elements: { text: string; sector: string; correcta: boolean; perque: string }[];
  pista: string;
}

/** Relacionar cada fila amb una opció de cada columna (desplegables). */
export interface ProvaAparellar {
  tipus: 'aparellar';
  titol: string;
  enunciat: string;
  columnes: { nom: string; opcions: string[] }[];
  files: { text: string; correctes: string[]; perque: string }[];
  /** El text de cada fila és codi o dades (lletra monoespaiada). */
  codi?: boolean;
  pista: string;
}

/** Construir una cadena en l'ordre correcte triant blocs. */
export interface ProvaSequencia {
  tipus: 'sequencia';
  titol: string;
  enunciat: string;
  /** Rètols dels dos extrems de la cadena. */
  inici: string;
  final: string;
  missatgeOk: string;
  /** Els blocs són línies de codi. */
  codi?: boolean;
  ordre: string[];
  intrusos: { text: string; perque: string }[];
  pista: string;
}

/** Preguntes de resposta única, una darrere l'altra. */
export interface ProvaQuiz {
  tipus: 'quiz';
  titol: string;
  enunciat: string;
  preguntes: { pregunta: string; codi?: string; opcions: string[]; correcta: number; perque: string }[];
  pista: string;
}

/** Completar un fragment de codi: cada [[n]] del codi és un desplegable. */
export interface ProvaCompletar {
  tipus: 'completar';
  titol: string;
  enunciat: string;
  fitxer: string;
  codi: string;
  buits: { opcions: string[]; correcta: string; perque: string }[];
  pista: string;
}

export type Prova = ProvaClassificar | ProvaSeleccionar | ProvaAparellar | ProvaSequencia | ProvaQuiz | ProvaCompletar;

export interface Sala {
  id: number;
  codi: string;
  nom: string;
  lloc: string;
  icona: string;
  /** Missatge de la unitat que obre la sala (ambientació). */
  transmissio: string[];
  /** Fitxes de teoria. «codi» es pinta ressaltat; «linies» fa una taula fragment → explicació. */
  teoria: { titol: string; html: string; codi?: string; linies?: { codi: string; explica: string }[] }[];
  ideaClau: string;
  proves: Prova[];
  fragment: { posicio: number; lletra: string };
  missatgeFinal: string;
}

export const CLAU_MESTRA = 'BYTES';

export const INTRO = {
  titol: 'GAMEVAULT · SAVE CORRUPTED',
  subtitol: 'Mode repàs · sessions 1 a 5',
  transmissio: [
    'ERROR 0x00 · El servidor de partides desades de GameVault s\'ha corromput.',
    'Un glitch, el BUG·0x00, s\'està menjant els fitxers: el catàleg, les còpies de seguretat i les hores jugades.',
    'Per aturar-lo cal un debugger que domini tot el que hem vist: l\'entorn, Path i Files, l\'explorador de carpetes, els fluxos, el CSV i l\'accés aleatori.',
    'Superaràs cinc nivells. Cada un et dona un cartutx amb una lletra de la contrasenya del nivell final.',
    'Al final t\'espera el BUG·0x00. Prem START.',
  ],
};

export const SALES: Sala[] = [
  // ------------------------------------------------------------------ NIVELL 1
  {
    id: 1,
    codi: 'NIVELL 1',
    nom: 'Pantalla d\'inici',
    lloc: 'Sessió 1 · L\'entorn i GameVault',
    icona: '▶',
    transmissio: [
      'Primer nivell: el joc no arrenca si no saps on viuen les dades ni com és un Joc per dins.',
      'Repassa el rebost de les dades i el record Joc.',
    ],
    teoria: [
      {
        titol: 'Dades volàtils i dades persistents',
        html: '<p>El programa és el cuiner, la <strong>RAM és el taulell</strong> (ràpid, però es neteja en tancar) i l\'<strong>emmagatzematge és el rebost</strong>. Tot el que viu en variables desapareix quan acaba el programa: si volem que les dades sobrevisquin, cal <strong>persistir-les</strong>.</p><p>Els cinc rebosts del curs: <strong>fitxers</strong> (CSV, JSON, XML, binaris) · <strong>BD relacionals</strong> amb JDBC · <strong>ORM</strong> (JPA i Hibernate) · <strong>objecte-relacionals i BDOO</strong> · <strong>NoSQL documental</strong> (MongoDB).</p>',
      },
      {
        titol: 'El record Joc',
        html: '<p>Un <code>record</code> és una classe per guardar dades immutables. Java genera sol el constructor, els accessors (<code>titol()</code>, <code>nota()</code>…), <code>equals</code>, <code>hashCode</code> i <code>toString</code>. Nosaltres només hi afegim les <strong>validacions</strong>, al constructor compacte.</p>',
        codi: `public record Joc(int id, String titol, String plataforma, String estudi,
                  LocalDate dataSortida, double horesJugades, double nota) {
    public Joc {
        if (titol == null || titol.isBlank()) {
            throw new IllegalArgumentException("el títol no pot ser buit");
        }
        if (nota < 0 || nota > 10) {
            throw new IllegalArgumentException("la nota ha d'anar de 0 a 10: " + nota);
        }
    }
}`,
        linies: [
          { codi: 'public record Joc(...)', explica: 'Declara el record: la llista de components és alhora els camps i els paràmetres del constructor.' },
          { codi: 'public Joc {', explica: 'Constructor compacte: sense parèntesis ni assignacions; Java assigna els camps sol en acabar.' },
          { codi: 'titol.isBlank()', explica: 'Cert si el text és buit o només té espais.' },
          { codi: 'throw new IllegalArgumentException(...)', explica: 'Si les dades no són vàlides, l\'objecte no es crea.' },
        ],
      },
      {
        titol: 'L\'entorn de treball',
        html: '<ul><li><strong>JDK 21</strong> (Eclipse Temurin): <code>java -version</code> ha de dir 21.</li><li><strong>IntelliJ IDEA</strong> amb un projecte <strong>Maven</strong> (groupId <code>cat.pratfp</code>, artifactId <code>gamevault</code>).</li><li><strong>Git</strong> i <strong>GitHub</strong>: tot el codi es lliura al repositori, amb commits repartits.</li><li>La carpeta <code>dades/</code> va a l\'arrel, <strong>al costat del <code>pom.xml</code></strong>: els exemples hi treballen amb rutes relatives.</li></ul>',
        codi: `<properties>
    <maven.compiler.release>21</maven.compiler.release>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>`,
      },
    ],
    ideaClau: 'El que viu en variables desapareix en tancar el programa. Persistir és guardar les dades en un rebost que sobrevisqui: el primer són els fitxers.',
    proves: [
      {
        tipus: 'quiz',
        titol: 'Repte 1A · Pantalla de càrrega',
        enunciat: 'Quatre preguntes per arrencar la partida.',
        preguntes: [
          {
            pregunta: 'Crees un Joc amb 42 hores jugades i tanques el programa. On són aquelles hores quan el tornes a obrir?',
            opcions: ['Enlloc: vivien a la memòria i eren volàtils', 'Al fitxer catalog.csv', 'A la memòria cau de Java', 'A IntelliJ'],
            correcta: 0,
            perque: 'Si no les persistim, les dades desapareixen en acabar l\'execució.',
          },
          {
            pregunta: 'Quin d\'aquests NO és un dels rebosts de dades que farem servir al curs?',
            opcions: ['La memòria RAM', 'Fitxers CSV, JSON i XML', 'Bases de dades relacionals', 'MongoDB'],
            correcta: 0,
            perque: 'La RAM és el taulell: volàtil.',
          },
          {
            pregunta: 'Què passa en executar aquesta línia?',
            codi: 'Joc j = new Joc(1, "Gris", "PC", "Nomada Studio",\n                 LocalDate.of(2018, 12, 13), 4.0, 11.0);',
            opcions: [
              'Llança IllegalArgumentException: la nota ha d\'anar de 0 a 10',
              'Crea el joc amb nota 10',
              'No compila',
              'Crea el joc amb nota 11.0',
            ],
            correcta: 0,
            perque: 'El constructor compacte valida la nota abans de crear l\'objecte.',
          },
          {
            pregunta: 'Què NO genera Java sol en un record?',
            opcions: ['Les validacions de les dades', 'El constructor', 'Els accessors com titol()', 'equals, hashCode i toString'],
            correcta: 0,
            perque: 'Les validacions les escrivim nosaltres al constructor compacte.',
          },
        ],
        pista: 'Volàtil = memòria. El constructor compacte comprova la nota de 0 a 10.',
      },
      {
        tipus: 'completar',
        titol: 'Repte 1B · Repara el record',
        enunciat: 'El BUG·0x00 ha esborrat quatre peces de Joc.java. Tria la que va a cada forat.',
        fitxer: 'model/Joc.java',
        codi: `public [[0]] Joc(int id, String titol, String plataforma, String estudi,
                  LocalDate dataSortida, double horesJugades, double nota) {
    public [[1]] {
        if (titol == null || titol.[[2]]()) {
            throw new [[3]]("el títol no pot ser buit");
        }
        if (nota < 0 || nota > 10) {
            throw new IllegalArgumentException("la nota ha d'anar de 0 a 10: " + nota);
        }
    }
}`,
        buits: [
          { opcions: ['class', 'record', 'interface', 'enum'], correcta: 'record', perque: 'Joc és un record: immutable i amb el codi repetitiu generat.' },
          { opcions: ['Joc', 'Joc()', 'record', 'this'], correcta: 'Joc', perque: 'El constructor compacte s\'escriu només amb el nom, sense parèntesis.' },
          { opcions: ['isBlank', 'isNull', 'length', 'trim'], correcta: 'isBlank', perque: 'isBlank() és cert si el text és buit o només té espais.' },
          { opcions: ['IllegalArgumentException', 'IOException', 'NullPointerException', 'FileNotFoundException'], correcta: 'IllegalArgumentException', perque: 'És l\'excepció per a un argument no vàlid.' },
        ],
        pista: 'Un record es declara amb la paraula record. El constructor compacte no porta parèntesis.',
      },
    ],
    fragment: { posicio: 5, lletra: 'S' },
    missatgeFinal: 'Partida arrencada. Primer cartutx recuperat.',
  },

  // ------------------------------------------------------------------ NIVELL 2
  {
    id: 2,
    codi: 'NIVELL 2',
    nom: 'Path i Files',
    lloc: 'Sessió 2 · El sistema de fitxers',
    icona: '⌂',
    transmissio: [
      'El BUG·0x00 ha barrejat les rutes de la carpeta de dades.',
      'Recorda: una cosa és l\'adreça i una altra és el fitxer.',
    ],
    teoria: [
      {
        titol: 'Un Path és una adreça, no el fitxer',
        html: '<p>Crear o manipular un <code>Path</code> <strong>no toca el disc</strong>: només treballa amb el text de la ruta. Per saber si el fitxer existeix, cal preguntar-ho a <code>Files</code>.</p>',
        codi: `Path cataleg = Path.of("dades", "catalog.csv");
cataleg.toAbsolutePath();   // ruta completa des de l'arrel
cataleg.getFileName();      // catalog.csv
cataleg.getParent();        // dades
Path copia = Path.of("dades").resolve("backup").resolve("catalog.csv");
Files.exists(cataleg);      // aquí sí que es mira el disc`,
        linies: [
          { codi: 'Path.of("dades", "catalog.csv")', explica: 'Construeix la ruta per trams; Java hi posa el separador correcte (\\ o /).' },
          { codi: 'resolve("backup")', explica: 'Enganxa un tram nou al final de la ruta.' },
          { codi: 'Files.exists(cataleg)', explica: 'Pregunta al disc si el fitxer hi és: retorna true o false.' },
        ],
      },
      {
        titol: 'Files pregunta i actua',
        html: '<ul><li>Preguntes: <code>Files.isRegularFile</code>, <code>isDirectory</code>, <code>isReadable</code>, <code>size</code> (bytes) i <code>readAttributes</code> (dates de creació i modificació).</li><li><code>createDirectories</code> crea la carpeta i les que faltin, i <strong>no falla si ja hi és</strong>. <code>createDirectory</code> (sense «s») és estricte: <strong>llança FileAlreadyExistsException</strong>.</li><li><code>writeString</code> crea un fitxer de text (o el sobreescriu).</li></ul>',
      },
      {
        titol: 'Copiar, moure i esborrar',
        html: '<ul><li><code>Files.copy(origen, desti)</code> falla si el destí ja existeix, llevat que hi afegim <code>StandardCopyOption.REPLACE_EXISTING</code>.</li><li><code>Files.move</code> el treu de l\'origen i el posa al destí.</li><li><code>Files.deleteIfExists</code> retorna <strong>true</strong> si l\'ha esborrat i <strong>false</strong> si no hi era. No llança excepció.</li></ul>',
        codi: `Files.copy(cataleg, copia, StandardCopyOption.REPLACE_EXISTING);
Files.move(origen, desti, StandardCopyOption.REPLACE_EXISTING);
boolean esborrat = Files.deleteIfExists(desti);`,
      },
    ],
    ideaClau: 'Path és l\'adreça; Files és qui va al disc. Si una instrucció no passa per Files, no ha tocat cap fitxer.',
    proves: [
      {
        tipus: 'classificar',
        titol: 'Repte 2A · Toca el disc?',
        enunciat: 'Classifica cada instrucció: només treballa amb la ruta, o va al disc?',
        categories: ['Només la ruta', 'Toca el disc'],
        codi: true,
        elements: [
          { text: 'Path.of("dades", "catalog.csv")', correcta: 'Només la ruta', perque: 'Crear un Path no toca el disc.' },
          { text: 'ruta.resolve("backup")', correcta: 'Només la ruta', perque: 'Enganxa text a la ruta.' },
          { text: 'ruta.getFileName()', correcta: 'Només la ruta', perque: 'Retorna l\'últim tram de la ruta.' },
          { text: 'ruta.getParent()', correcta: 'Només la ruta', perque: 'Retorna la ruta sense l\'últim tram.' },
          { text: 'ruta.toAbsolutePath()', correcta: 'Només la ruta', perque: 'Completa la ruta amb la carpeta de treball, sense mirar si existeix.' },
          { text: 'Files.exists(ruta)', correcta: 'Toca el disc', perque: 'Pregunta al sistema de fitxers.' },
          { text: 'Files.size(ruta)', correcta: 'Toca el disc', perque: 'Llegeix la mida real del fitxer.' },
          { text: 'Files.createDirectories(ruta)', correcta: 'Toca el disc', perque: 'Crea carpetes.' },
          { text: 'Files.copy(origen, desti)', correcta: 'Toca el disc', perque: 'Llegeix i escriu fitxers.' },
          { text: 'Files.deleteIfExists(ruta)', correcta: 'Toca el disc', perque: 'Esborra el fitxer si hi és.' },
        ],
        pista: 'Tot el que comença per Files va al disc. Tot el que es fa sobre un Path només canvia el text de la ruta.',
      },
      {
        tipus: 'quiz',
        titol: 'Repte 2B · Què surt per pantalla?',
        enunciat: 'Llegeix cada fragment i endevina què passa en executar-lo. Suposa que dades/catalog.csv existeix.',
        preguntes: [
          {
            pregunta: 'Què imprimeix?',
            codi: 'Path cataleg = Path.of("dades", "catalog.csv");\nSystem.out.println(cataleg.getParent());',
            opcions: ['dades', 'catalog.csv', 'dades/catalog.csv', 'null'],
            correcta: 0,
            perque: 'getParent() treu l\'últim tram.',
          },
          {
            pregunta: 'Què imprimeix?',
            codi: 'Path p = Path.of("dades").resolve("backup").resolve("catalog.csv");\nSystem.out.println(p.getFileName());',
            opcions: ['catalog.csv', 'backup', 'dades', 'dades/backup/catalog.csv'],
            correcta: 0,
            perque: 'getFileName() retorna l\'últim tram.',
          },
          {
            pregunta: 'Què passa?',
            codi: 'Files.createDirectories(Path.of("dades", "import"));\nFiles.createDirectory(Path.of("dades", "import"));',
            opcions: [
              'La segona línia llança FileAlreadyExistsException',
              'Les dues línies funcionen sense problemes',
              'La primera línia llança una excepció',
              'Es crea la carpeta import dues vegades',
            ],
            correcta: 0,
            perque: 'createDirectory (sense «s») falla si la carpeta ja existeix.',
          },
          {
            pregunta: 'El fitxer desti existeix. Què imprimeix?',
            codi: 'System.out.println(Files.deleteIfExists(desti));\nSystem.out.println(Files.deleteIfExists(desti));',
            opcions: ['true i després false', 'true i després true', 'false i després false', 'true i després una excepció'],
            correcta: 0,
            perque: 'El primer cop l\'esborra; el segon ja no hi és i retorna false.',
          },
          {
            pregunta: 'El fitxer copia ja existeix. Què passa?',
            codi: 'Files.copy(cataleg, copia);',
            opcions: [
              'Llança FileAlreadyExistsException perquè falta REPLACE_EXISTING',
              'Sobreescriu la còpia',
              'Afegeix el contingut al final de la còpia',
              'No fa res i retorna false',
            ],
            correcta: 0,
            perque: 'Per sobreescriure cal StandardCopyOption.REPLACE_EXISTING.',
          },
        ],
        pista: 'getParent treu el final, getFileName es queda el final. Les versions sense «s» o sense REPLACE_EXISTING són estrictes.',
      },
    ],
    fragment: { posicio: 2, lletra: 'Y' },
    missatgeFinal: 'Rutes restaurades. Segon cartutx recuperat.',
  },

  // ------------------------------------------------------------------ NIVELL 3
  {
    id: 3,
    codi: 'NIVELL 3',
    nom: 'L\'explorador',
    lloc: 'Sessió 3 · Recórrer la carpeta de dades',
    icona: '⧉',
    transmissio: [
      'El BUG·0x00 s\'ha amagat en alguna subcarpeta de dades/.',
      'Necessites l\'explorador de l\'AA1: recórrer, filtrar i sumar mides.',
    ],
    teoria: [
      {
        titol: 'Files.list contra Files.walk',
        html: '<p><code>Files.list(carpeta)</code> retorna <strong>només el primer nivell</strong>: no entra a les subcarpetes.</p><p><code>Files.walk(carpeta)</code> recorre <strong>tot l\'arbre</strong>, carpeta per carpeta, fins al final. Inclou també les carpetes: si només vols fitxers, cal filtrar-los.</p>',
      },
      {
        titol: 'El Stream s\'ha de tancar',
        html: '<p>Tots dos retornen un <code>Stream&lt;Path&gt;</code> que <strong>deixa la carpeta oberta</strong> mentre el recorres. Per això van dins d\'un <strong>try-with-resources</strong>, que el tanca sol en acabar.</p>',
        codi: `List<Path> fitxers;
try (Stream<Path> arbre = Files.walk(dades)) {
    fitxers = arbre.filter(Files::isRegularFile)
                   .sorted()
                   .toList();
}
long total = 0;
for (Path f : fitxers) {
    total += Files.size(f);
}`,
        linies: [
          { codi: 'try (Stream<Path> arbre = ...)', explica: 'El recurs declarat al parèntesi es tanca sol en sortir del bloc.' },
          { codi: '.filter(Files::isRegularFile)', explica: 'Es queda només amb els fitxers normals; descarta les carpetes.' },
          { codi: '.sorted().toList()', explica: 'Ordena les rutes i les guarda en una llista.' },
          { codi: 'total += Files.size(f)', explica: 'Suma la mida en bytes de cada fitxer.' },
        ],
      },
      {
        titol: 'La caixa d\'eines de Files',
        html: '<ul><li><code>createDirectories</code> per preparar import, export i backup.</li><li><code>copy</code> + <code>REPLACE_EXISTING</code> per a còpies de seguretat amb data al nom.</li><li><code>move</code> per treure un fitxer d\'una carpeta i posar-lo en una altra.</li><li><code>deleteIfExists</code> per esborrar sense que peti.</li><li><code>readAttributes</code> per a les dates de creació i modificació.</li><li><code>writeString</code> per escriure un text en un fitxer.</li></ul>',
      },
    ],
    ideaClau: 'list mira un nivell, walk mira tot l\'arbre. Els dos deixen la carpeta oberta: sempre dins d\'un try-with-resources.',
    proves: [
      {
        tipus: 'completar',
        titol: 'Repte 3A · Escaneja l\'arbre',
        enunciat: 'Aquest programa ha de recórrer TOTA la carpeta dades/ (subcarpetes incloses), quedar-se només amb els fitxers i sumar-ne la mida. Completa els forats.',
        fitxer: 'sessio2/Ex5Recorre.java',
        codi: `Path dades = Path.of("dades");
List<Path> fitxers;
[[0]] (Stream<Path> arbre = Files.[[1]](dades)) {
    fitxers = arbre.filter(Files::[[2]])
                   .sorted()
                   .toList();
}
long total = 0;
for (Path f : fitxers) {
    total += Files.[[3]](f);
}
System.out.printf("Total: %d fitxers, %d bytes%n", fitxers.[[4]](), total);`,
        buits: [
          { opcions: ['try', 'if', 'while', 'synchronized'], correcta: 'try', perque: 'try-with-resources tanca el Stream en acabar.' },
          { opcions: ['list', 'walk', 'lines', 'readAllLines'], correcta: 'walk', perque: 'walk entra a totes les subcarpetes; list només al primer nivell.' },
          { opcions: ['isRegularFile', 'isDirectory', 'exists', 'isHidden'], correcta: 'isRegularFile', perque: 'Només volem fitxers, no carpetes.' },
          { opcions: ['size', 'length', 'getSize', 'count'], correcta: 'size', perque: 'Files.size retorna la mida en bytes.' },
          { opcions: ['size', 'length', 'count', 'total'], correcta: 'size', perque: 'Una List diu quants elements té amb size().' },
        ],
        pista: 'Tot l\'arbre → walk. Només fitxers → isRegularFile. Mida d\'un fitxer i d\'una llista → size.',
      },
      {
        tipus: 'aparellar',
        titol: 'Repte 3B · L\'eina per a cada missió',
        enunciat: 'Tria el mètode de Files que resol cada necessitat de l\'explorador.',
        columnes: [
          {
            nom: 'Mètode',
            opcions: [
              'Files.list',
              'Files.walk',
              'Files.createDirectories',
              'Files.copy amb REPLACE_EXISTING',
              'Files.move',
              'Files.deleteIfExists',
              'Files.readAttributes',
              'Files.writeString',
              'new File(ruta).delete()',
            ],
          },
        ],
        files: [
          { text: 'Veure què hi ha a dades/ sense entrar a les subcarpetes', correctes: ['Files.list'], perque: 'list només mira el primer nivell.' },
          { text: 'Recórrer totes les subcarpetes de dades/', correctes: ['Files.walk'], perque: 'walk recorre l\'arbre sencer.' },
          { text: 'Preparar import, export i backup encara que ja existeixin', correctes: ['Files.createDirectories'], perque: 'No falla si ja hi són.' },
          { text: 'Fer una còpia de seguretat, sobreescrivint-la si ja hi és', correctes: ['Files.copy amb REPLACE_EXISTING'], perque: 'Sense l\'opció, falla si el destí existeix.' },
          { text: 'Treure un fitxer d\'import i deixar-lo a backup', correctes: ['Files.move'], perque: 'Desapareix de l\'origen i apareix al destí.' },
          { text: 'Esborrar un fitxer sense que el programa peti si no hi és', correctes: ['Files.deleteIfExists'], perque: 'Retorna false si no hi era.' },
          { text: 'Saber la data de creació i d\'última modificació', correctes: ['Files.readAttributes'], perque: 'Llegeix tots els atributs bàsics de cop.' },
          { text: 'Crear un fitxer amb una línia de text', correctes: ['Files.writeString'], perque: 'Escriu un String al fitxer.' },
        ],
        pista: 'L\'opció que fa servir la classe File antiga no és la resposta de cap fila: treballem amb java.nio.',
      },
    ],
    fragment: { posicio: 4, lletra: 'E' },
    missatgeFinal: 'BUG·0x00 localitzat a l\'arbre de carpetes. Tercer cartutx recuperat.',
  },

  // ------------------------------------------------------------------ NIVELL 4
  {
    id: 4,
    codi: 'NIVELL 4',
    nom: 'Els fluxos',
    lloc: 'Sessió 4 · Bytes, caràcters i try-with-resources',
    icona: '≋',
    transmissio: [
      'El BUG·0x00 s\'ha colat dins dels fluxos de lectura i escriptura.',
      'Si un flux no es tanca o es llegeix malament, les dades es perden. Caça els errors.',
    ],
    teoria: [
      {
        titol: 'Bytes o caràcters?',
        html: '<ul><li><strong>Fluxos de bytes</strong> (<code>InputStream</code>, <code>OutputStream</code> i derivats): serveixen per a <strong>qualsevol fitxer</strong> (imatges, zips, binaris). <code>DataOutputStream</code> i <code>DataInputStream</code> guarden tipus primitius (<code>writeInt</code>, <code>writeDouble</code>, <code>writeUTF</code>).</li><li><strong>Fluxos de caràcters</strong> (<code>Reader</code>, <code>Writer</code> i derivats): per a <strong>text</strong>, amb una <strong>codificació</strong> (UTF-8).</li><li>Els <code>Buffered…</code> afegeixen una memòria intermèdia: llegeixen i escriuen a blocs, molt més ràpid.</li></ul>',
      },
      {
        titol: 'Llegir text línia a línia',
        html: '<p><code>readLine()</code> retorna <strong>null</strong> quan arriba al final del fitxer. La primera línia del catàleg és la capçalera.</p>',
        codi: `try (BufferedReader lector = Files.newBufferedReader(cataleg, StandardCharsets.UTF_8)) {
    String linia;
    while ((linia = lector.readLine()) != null) {
        String[] camps = linia.split(";");
        System.out.println(camps[1]);
    }
}`,
        linies: [
          { codi: 'Files.newBufferedReader(..., UTF_8)', explica: 'Obre el fitxer per llegir text amb la codificació explícita.' },
          { codi: '(linia = lector.readLine()) != null', explica: 'Llegeix una línia i comprova que no s\'ha arribat al final.' },
          { codi: 'linia.split(";")', explica: 'Separa els camps pel punt i coma del catàleg.' },
        ],
      },
      {
        titol: 'try-with-resources, APPEND i bytes',
        html: '<p>Tot el que es declara al parèntesi del <code>try</code> <strong>es tanca sol</strong>, també si hi ha una excepció. Sense tancar, les dades poden quedar a mig escriure.</p><p>Per afegir al final d\'un fitxer: <code>StandardOpenOption.CREATE, StandardOpenOption.APPEND</code>. Per copiar bytes, <code>read(buffer)</code> retorna quants bytes ha llegit, i <strong>-1</strong> al final.</p>',
        codi: `while ((llegits = in.read(buffer)) != -1) {
    out.write(buffer, 0, llegits);
}`,
      },
    ],
    ideaClau: 'Bytes per a qualsevol fitxer, caràcters per al text. readLine() acaba amb null, read() acaba amb -1, i tot es tanca amb try-with-resources.',
    proves: [
      {
        tipus: 'classificar',
        titol: 'Repte 4A · Separa els fluxos',
        enunciat: 'Cada classe és un flux de bytes o de caràcters?',
        categories: ['Bytes', 'Caràcters'],
        codi: true,
        elements: [
          { text: 'InputStream', correcta: 'Bytes', perque: 'Classe base de lectura de bytes.' },
          { text: 'OutputStream', correcta: 'Bytes', perque: 'Classe base d\'escriptura de bytes.' },
          { text: 'BufferedInputStream', correcta: 'Bytes', perque: 'InputStream amb memòria intermèdia.' },
          { text: 'DataOutputStream', correcta: 'Bytes', perque: 'Escriu primitius en binari.' },
          { text: 'DataInputStream', correcta: 'Bytes', perque: 'Llegeix primitius en binari.' },
          { text: 'Reader', correcta: 'Caràcters', perque: 'Classe base de lectura de text.' },
          { text: 'Writer', correcta: 'Caràcters', perque: 'Classe base d\'escriptura de text.' },
          { text: 'BufferedReader', correcta: 'Caràcters', perque: 'Llegeix text línia a línia.' },
          { text: 'BufferedWriter', correcta: 'Caràcters', perque: 'Escriu text amb newLine().' },
          { text: 'FileReader', correcta: 'Caràcters', perque: 'Reader sobre un fitxer.' },
        ],
        pista: 'Els noms acabats en Stream són de bytes. Els acabats en Reader o Writer són de caràcters.',
      },
      {
        tipus: 'seleccionar',
        titol: 'Repte 4B · Caça el bug',
        enunciat: 'Aquest codi ha de llegir catalog.csv (separat per ;), mostrar els títols i deixar una línia al log, que potser encara no existeix. Marca les TRES línies que tenen error.',
        etiqueta: '✖ BUG',
        missatgeOk: 'Bugs eliminats: != null, split(";") i el log dins d\'un try-with-resources amb CREATE.',
        codi: true,
        elements: [
          { text: 'try (BufferedReader lector = Files.newBufferedReader(cataleg, UTF_8)) {', sector: '01', correcta: false, perque: 'Correcte: el lector es tanca sol.' },
          { text: '    String linia = lector.readLine();      // saltem la capçalera', sector: '02', correcta: false, perque: 'Correcte: llegeix i descarta la primera línia.' },
          { text: '    while ((linia = lector.readLine()) != "") {', sector: '03', correcta: true, perque: 'readLine() retorna null al final, no "": ha de ser != null.' },
          { text: '        String[] camps = linia.split(",");', sector: '04', correcta: true, perque: 'El catàleg es separa amb punt i coma: split(";").' },
          { text: '        System.out.println(camps[1]);', sector: '05', correcta: false, perque: 'Correcte: el camp 1 és el títol.' },
          { text: '    }', sector: '06', correcta: false, perque: 'Tanca el while.' },
          { text: '}', sector: '07', correcta: false, perque: 'Tanca el try.' },
          { text: 'BufferedWriter log = Files.newBufferedWriter(fitxerLog, APPEND);', sector: '08', correcta: true, perque: 'No es tanca mai (cal try-with-resources) i, sense CREATE, falla si el log no existeix.' },
          { text: 'log.write("catàleg llegit");', sector: '09', correcta: false, perque: 'L\'error és com s\'obre el log, no aquesta línia.' },
          { text: 'log.newLine();', sector: '10', correcta: false, perque: 'Correcte: afegeix el salt de línia.' },
        ],
        pista: 'Fixa\'t en què retorna readLine() al final, en el separador del catàleg i en qui tanca el log.',
      },
      {
        tipus: 'sequencia',
        titol: 'Repte 4C · Munta la còpia de bytes',
        enunciat: 'Ordena les línies per copiar un fitxer byte a byte amb un buffer. Hi ha dues línies trampa.',
        inici: '▼ INICI',
        final: '▲ FINAL',
        missatgeOk: 'Còpia muntada: llegir al buffer fins a -1 i escriure només els bytes llegits.',
        codi: true,
        ordre: [
          'byte[] buffer = new byte[8 * 1024];',
          'try (InputStream in = Files.newInputStream(origen);',
          '     OutputStream out = Files.newOutputStream(copia)) {',
          '    int llegits;',
          '    while ((llegits = in.read(buffer)) != -1) {',
          '        out.write(buffer, 0, llegits);',
          '    }   // fi del while',
          '}   // fi del try',
        ],
        intrusos: [
          { text: '        out.write(buffer);', perque: 'A l\'última volta el buffer no és ple: escriuria bytes brossa. Cal write(buffer, 0, llegits).' },
          { text: '    while (in.read(buffer) != null) {', perque: 'read() retorna un int: al final val -1, mai null.' },
        ],
        pista: 'Primer el buffer, després el try amb els dos fluxos, la variable llegits, el while amb -1 i l\'escriptura dels bytes llegits.',
      },
    ],
    fragment: { posicio: 1, lletra: 'B' },
    missatgeFinal: 'Fluxos nets: el BUG·0x00 ja no pot colar-se a les lectures. Quart cartutx recuperat.',
  },

  // ------------------------------------------------------------------ NIVELL 5
  {
    id: 5,
    codi: 'NIVELL 5',
    nom: 'CSV i accés aleatori',
    lloc: 'Sessió 5 · OpenCSV i RandomAccessFile',
    icona: '⇥',
    transmissio: [
      'Últim nivell abans del boss. El BUG·0x00 ha embrutat el catàleg CSV i ha mogut les hores jugades del fitxer binari.',
      'Cal saber quines línies es poden salvar i saltar directament al registre bo.',
    ],
    teoria: [
      {
        titol: 'Llegir CSV amb OpenCSV',
        html: '<p>Un <code>split(";")</code> es trenca si un títol porta un punt i coma. OpenCSV entén les <strong>cometes</strong>: <code>"Baldur\'s Gate 3; Deluxe"</code> és un sol camp.</p>',
        codi: `CSVParser parser = new CSVParserBuilder().withSeparator(';').withQuoteChar('"').build();
try (Reader r = Files.newBufferedReader(p, StandardCharsets.UTF_8);
     CSVReader csv = new CSVReaderBuilder(r).withCSVParser(parser).withSkipLines(1).build()) {
    String[] c;
    while ((c = csv.readNext()) != null) {
        // c[0]..c[6] són els camps de la línia
    }
}`,
        linies: [
          { codi: 'withSeparator(\';\')', explica: 'El catàleg separa els camps amb punt i coma.' },
          { codi: 'withQuoteChar(\'"\')', explica: 'El text entre cometes es llegeix com un sol camp, encara que porti ;.' },
          { codi: 'withSkipLines(1)', explica: 'Salta la capçalera.' },
          { codi: 'csv.readNext() != null', explica: 'Retorna un array de camps per línia i null al final.' },
        ],
      },
      {
        titol: 'Un CSV brut no ha de fer petar el programa',
        html: '<p>Cada línia es tracta dins d\'un <code>try/catch</code> propi: si falla, es <strong>descarta i s\'informa</strong>, i es continua amb la següent.</p><ul><li>Menys de 7 camps → <strong>incompleta</strong>.</li><li><code>LocalDate.parse</code> falla → <strong>DateTimeParseException</strong> (data mal formada).</li><li><code>Double.parseDouble</code> falla → <strong>NumberFormatException</strong>.</li><li>El record rebutja la nota o les hores → <strong>IllegalArgumentException</strong>.</li></ul>',
      },
      {
        titol: 'RandomAccessFile: registres de mida fixa',
        html: '<p>Si tots els registres pesen el mateix, es pot <strong>saltar directament</strong> a qualsevol amb <code>seek(posició)</code>, sense llegir els anteriors. Cada registre: <strong>id</strong> (int, 4 bytes) + <strong>títol de 40 caràcters</strong> (40 × 2 = 80 bytes) + <strong>hores</strong> (double, 8 bytes) = <strong>92 bytes</strong>. El títol s\'omple o es talla fins a 40 caràcters perquè tots pesin igual.</p>',
        codi: `static final int LONG_TITOL = 40;
static final int MIDA_REGISTRE = Integer.BYTES + LONG_TITOL * Character.BYTES + Double.BYTES; // 92

try (RandomAccessFile raf = new RandomAccessFile(fitxer.toFile(), "rw")) {
    long posicioHores = 2L * MIDA_REGISTRE + Integer.BYTES + LONG_TITOL * Character.BYTES;
    raf.seek(posicioHores);
    raf.writeDouble(12.5 + 3.0);
}`,
        linies: [
          { codi: 'Character.BYTES', explica: 'Un char de Java ocupa 2 bytes: 40 caràcters són 80 bytes.' },
          { codi: '"rw"', explica: 'Mode lectura i escriptura (amb "r" només es pot llegir).' },
          { codi: '2L * MIDA_REGISTRE + ...', explica: 'Salta dos registres sencers (el 0 i l\'1) i, dins del tercer, l\'id i el títol.' },
          { codi: 'raf.seek(...)', explica: 'Mou el punter a aquella posició; la següent lectura o escriptura comença allà.' },
        ],
      },
    ],
    ideaClau: 'OpenCSV entén les cometes i cada línia bruta es descarta sense aturar el programa. Amb registres de mida fixa, seek(i × mida) porta directament al registre i.',
    proves: [
      {
        tipus: 'aparellar',
        titol: 'Repte 5A · Neteja el CSV brut',
        codi: true,
        enunciat: 'Aquestes són línies del catàleg brut de l\'AA2. Què li passa a cadascuna quan la llegim amb OpenCSV i creem el Joc?',
        columnes: [
          {
            nom: 'Resultat',
            opcions: [
              'Vàlida',
              'Descartada: incompleta',
              'Descartada: data mal formada',
              'Descartada: número invàlid',
              'Descartada: el record la rebutja',
            ],
          },
        ],
        files: [
          { text: '1;Hollow Knight;PC;Team Cherry;2017-02-24;42.5;9.5', correctes: ['Vàlida'], perque: 'Tots els camps són correctes.' },
          { text: '2;Celeste;PC;Maddy Makes Games;2018-01-25;15.0;12.0', correctes: ['Descartada: el record la rebutja'], perque: 'Nota 12: el constructor compacte llança IllegalArgumentException.' },
          { text: '3;Gris;PC', correctes: ['Descartada: incompleta'], perque: 'Només té 3 camps.' },
          { text: '4;Hades;PC;Supergiant Games;25-09-2020;30.0;9.0', correctes: ['Descartada: data mal formada'], perque: 'LocalDate.parse espera aaaa-mm-dd.' },
          { text: '5;"Baldur\'s Gate 3; Deluxe";PC;Larian Studios;2023-08-03;120.0;9.8', correctes: ['Vàlida'], perque: 'Les cometes fan que el ; del títol no separi camps.' },
          { text: '6;Metroid Dread;Switch;MercurySteam;2021-10-08;-5.0;9.0', correctes: ['Descartada: el record la rebutja'], perque: 'Hores negatives: IllegalArgumentException.' },
          { text: '7;Celeste;PC;Maddy Makes Games;2018-01-25;quinze;9.0', correctes: ['Descartada: número invàlid'], perque: 'Double.parseDouble("quinze") llança NumberFormatException.' },
        ],
        pista: 'Compta els camps, mira el format de la data, comprova que els números ho siguin i recorda les regles del record: nota de 0 a 10 i hores no negatives.',
      },
      {
        tipus: 'completar',
        titol: 'Repte 5B · Salta al registre bo',
        enunciat: 'El BUG·0x00 s\'ha menjat 3 hores del registre 2 (el tercer). Completa el codi per saltar-hi directament i corregir-les.',
        fitxer: 'sessio5/Ex5AccesAleatori.java',
        codi: `static final int LONG_TITOL = 40;
static final int MIDA_REGISTRE = Integer.BYTES + LONG_TITOL * [[0]] + Double.BYTES;
// cada registre ocupa [[1]] bytes

try (RandomAccessFile raf = new RandomAccessFile(fitxer.toFile(), [[2]])) {
    long posicio = 2L * MIDA_REGISTRE + Integer.BYTES + LONG_TITOL * Character.BYTES;
    raf.[[3]](posicio);
    raf.[[4]](12.5 + 3.0);
}`,
        buits: [
          { opcions: ['Character.BYTES', 'Byte.BYTES', 'Integer.BYTES', 'Double.BYTES'], correcta: 'Character.BYTES', perque: 'El títol són 40 chars de 2 bytes.' },
          { opcions: ['52', '84', '92', '100'], correcta: '92', perque: '4 + 80 + 8 = 92.' },
          { opcions: ['"r"', '"rw"', '"w"', '"a"'], correcta: '"rw"', perque: 'Per escriure cal "rw".' },
          { opcions: ['seek', 'skip', 'goTo', 'position'], correcta: 'seek', perque: 'seek mou el punter a la posició.' },
          { opcions: ['writeDouble', 'writeChars', 'writeInt', 'write'], correcta: 'writeDouble', perque: 'Les hores són un double.' },
        ],
        pista: 'int 4 bytes, char 2 bytes, double 8 bytes. Per escriure cal el mode de lectura i escriptura.',
      },
      {
        tipus: 'quiz',
        titol: 'Repte 5C · Seqüencial o aleatori?',
        enunciat: 'Tres preguntes ràpides sobre l\'accés aleatori.',
        preguntes: [
          {
            pregunta: 'Un fitxer té 50.000 registres de 92 bytes i vols llegir el 40.000. Què és millor?',
            opcions: [
              'Accés aleatori: seek(39999L * 92) i llegir un sol registre',
              'Llegir-lo tot amb readLine fins arribar-hi',
              'Copiar el fitxer i buscar a la còpia',
              'Passar-lo a CSV i fer split',
            ],
            correcta: 0,
            perque: 'Amb mida fixa, la posició es calcula i no cal llegir els anteriors.',
          },
          {
            pregunta: 'Què imprimeix?',
            codi: 'raf.seek(3L * 92);\nSystem.out.println(raf.getFilePointer());',
            opcions: ['276', '3', '92', '95'],
            correcta: 0,
            perque: '3 × 92 = 276: el punter és a l\'inici del registre 3.',
          },
          {
            pregunta: 'Per què el títol s\'omple fins a 40 caràcters encara que sigui més curt?',
            opcions: [
              'Perquè tots els registres pesin igual i es pugui calcular on és cadascun',
              'Perquè queda més bonic en imprimir-lo',
              'Perquè writeChars només accepta textos de 40 caràcters',
              'Per estalviar espai al disc',
            ],
            correcta: 0,
            perque: 'Sense mida fixa, seek(i × mida) no funcionaria.',
          },
        ],
        pista: 'Multiplica la posició per la mida del registre.',
      },
    ],
    fragment: { posicio: 3, lletra: 'T' },
    missatgeFinal: 'Catàleg net i hores restaurades. Tens els cinc cartutxos: el BUG·0x00 t\'espera.',
  },
];

/** Combat final: s'hi arriba després d'introduir la contrasenya. */
export const PROVA_FINAL: ProvaQuiz = {
  tipus: 'quiz',
  titol: 'BOSS FINAL · BUG·0x00',
  enunciat: 'Cinc atacs. Cada resposta correcta li treu vida al BUG·0x00.',
  preguntes: [
    {
      pregunta: 'Què garanteix un try-with-resources?',
      opcions: [
        'Que el recurs es tanca sol en acabar el bloc, també si hi ha una excepció',
        'Que el codi no llançarà mai cap excepció',
        'Que el fitxer existeix abans d\'obrir-lo',
        'Que el fitxer s\'escriu en UTF-8',
      ],
      correcta: 0,
      perque: 'Tanca el que es declara al parèntesi, passi el que passi.',
    },
    {
      pregunta: 'Què retorna in.read(buffer) quan arriba al final del fitxer?',
      codi: 'int llegits = in.read(buffer);',
      opcions: ['-1', 'null', '0', 'Llança EOFException'],
      correcta: 0,
      perque: 'read() retorna el nombre de bytes llegits, i -1 al final. readLine() és qui retorna null.',
    },
    {
      pregunta: 'Què fa aquesta instrucció?',
      codi: 'Path copia = Path.of("dades").resolve("backup").resolve("catalog.csv");',
      opcions: [
        'Només construeix la ruta dades/backup/catalog.csv; no toca el disc',
        'Crea la carpeta backup',
        'Copia catalog.csv a backup',
        'Comprova que el fitxer existeix',
      ],
      correcta: 0,
      perque: 'Un Path és només una adreça.',
    },
    {
      pregunta: 'Per què el lector d\'OpenCSV es configura amb withSkipLines(1)?',
      opcions: ['Per saltar la capçalera del CSV', 'Per llegir les línies d\'una en una', 'Per descartar les línies brutes', 'Per saltar el separador'],
      correcta: 0,
      perque: 'La primera línia és id;titol;plataforma…',
    },
    {
      pregunta: 'Quants bytes ocupa un registre amb un int, 40 chars i un double?',
      codi: 'Integer.BYTES + 40 * Character.BYTES + Double.BYTES',
      opcions: ['92', '52', '88', '100'],
      correcta: 0,
      perque: '4 + 80 + 8 = 92.',
    },
  ],
  pista: 'Repassa la idea clau de cada nivell: try-with-resources, -1 i null, Path és una adreça, capçalera del CSV i 4 + 80 + 8.',
};

export const RANGS = [
  { minim: 90, nom: 'Llegenda del GameVault', text: 'Has esclafat el BUG·0x00 gairebé sense rebre danys. El RA1 et té por.' },
  { minim: 75, nom: 'Debugger sènior', text: 'Molt bona partida: domines els fitxers i els fluxos.' },
  { minim: 55, nom: 'Debugger', text: 'Boss derrotat. Repassa els nivells on vas perdre més vida.' },
  { minim: 0, nom: 'Becari/ària del codi', text: 'Has guanyat, però amb poca vida. Torna a jugar per pujar de rang abans de la PR1.' },
];

export const CHECKLIST = [
  'Sé explicar la diferència entre dades volàtils i persistents.',
  'Sé crear un record i validar les dades al constructor compacte.',
  'Sé construir rutes amb Path i crear, copiar, moure i esborrar fitxers amb Files.',
  'Sé recórrer una carpeta amb Files.list i Files.walk tancant el Stream.',
  'Sé triar entre fluxos de bytes i de caràcters i fer servir try-with-resources.',
  'Sé llegir i escriure un CSV amb OpenCSV i descartar les línies brutes.',
  'Sé calcular la posició d\'un registre de mida fixa i saltar-hi amb seek.',
];

/** Punts: cada repte dona 100 XP; cada error en treu i cada pista també. */
export const PUNTS = { pany: 100, error: 10, pista: 30, minimPany: 30, integritatError: 4 };
