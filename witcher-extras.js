// Dados escritos à mão para as partes do app que não vêm da wiki:
// ordem de leitura e cortes de spoiler, rotas e domínios do mapa, árvores extras e fichas do bestiário.
window.WITCHER_EXTRAS = {

// Ordem recomendada. "fim" é o ponto da cronologia (campo s dos eventos) até onde a obra conta a história;
// "eventos" lista eventos que só aquela obra revela, fora da sequência; "partes" são contos que podem ser marcados
// um a um (cada um com os eventos que conta); "eras" são eras inteiras que só abrem com aquele item.
// "ano" é o ano de publicação; "cron" a posição na ordem cronológica da história; "verbete" quando o id não é um verbete.
leitura: [
  {id:"o-ultimo-desejo", n:"O Último Desejo", tipo:"livro", fim:1253.5, ano:1993, cron:1, editora:"WMF Martins Fontes",
    sinopse:"Contos que apresentam Geralt: enquanto se recupera num templo, o bruxo relembra contratos, dilemas e o encontro que mudaria sua vida.",
    partes:[{n:"O Bruxo", eventos:["estrige"]}, {n:"Um Grão de Verdade", eventos:[]}, {n:"O Mal Menor", eventos:[]}, {n:"Uma Questão de Preço", eventos:["questao-preco"]}, {n:"O Fim do Mundo", eventos:["borda-mundo"]}, {n:"O Último Desejo", eventos:["ultimo-desejo"]}]},
  {id:"a-espada-do-destino", n:"A Espada do Destino", tipo:"livro", fim:1263.3, ano:1992, cron:3, editora:"WMF Martins Fontes",
    sinopse:"Mais contos: Geralt e Yennefer se aproximam e se afastam, e o destino insiste em pôr no caminho do bruxo uma menina de Cintra.",
    partes:[{n:"O Limite do Possível", eventos:["limite-possivel"]}, {n:"Um Fragmento de Gelo", eventos:[]}, {n:"O Fogo Eterno", eventos:[]}, {n:"Um Pouco de Sacrifício", eventos:[]}, {n:"A Espada do Destino", eventos:["brokilon"]}, {n:"Algo Mais", eventos:["algo-mais","marnadal","massacre-cintra"]}]},
  {id:"o-sangue-dos-elfos", n:"O Sangue dos Elfos", tipo:"livro", fim:1267.25, ano:1994, cron:4, editora:"WMF Martins Fontes",
    sinopse:"Primeiro romance da saga: depois de uma guerra, Geralt esconde uma menina especial entre bruxos e feiticeiras, enquanto reis e espiões tramam."},
  {id:"tempo-do-desprezo", n:"Tempo do Desprezo", tipo:"livro", fim:1267.55, ano:1995, cron:5, editora:"WMF Martins Fontes",
    sinopse:"Uma reunião de magos numa ilha vira ponto de virada para todos, e o Norte entra numa nova guerra."},
  {id:"batismo-de-fogo", n:"Batismo de Fogo", tipo:"livro", fim:1267.67, eventos:["regis-nasce"], ano:1996, cron:7, editora:"WMF Martins Fontes",
    sinopse:"Ferido, Geralt parte para o sul com companheiros improváveis, atravessando um país em guerra."},
  {id:"a-torre-da-andorinha", n:"A Torre da Andorinha", tipo:"livro", fim:1267.9, ano:1997, cron:8, editora:"WMF Martins Fontes",
    sinopse:"Contada em parte por quem a viveu, a história de Ciri ganha um caminho próprio, longe de Geralt."},
  {id:"a-senhora-do-lago", n:"A Senhora do Lago", tipo:"livro", fim:1268.99, final:true, ano:1999, cron:9, editora:"WMF Martins Fontes",
    sinopse:"O último livro da saga reúne os fios da história e a conta, séculos depois, como lenda."},
  {id:"o-fim", n:"O fim e a lenda", tipo:"livro", eras:["fim"], ano:1999, cron:10, verbete:"a-senhora-do-lago", extra:true,
    sinopse:"Corte opcional: a era IX da Linha do Tempo (o que vem séculos depois), contada no epílogo de A Senhora do Lago.",
    nota:"Marque quando quiser ver o futuro distante do mundo."},
  {id:"season-of-storms", n:"Season of Storms", tipo:"livro", eventos:["season-storms"], ano:2013, cron:2, editora:"Sem edição brasileira confirmada",
    sinopse:"Romance avulso: Geralt perde as espadas num pequeno reino costeiro e se mete em intrigas de magos e da corte.", nota:"Pode ser lido a qualquer momento depois dos contos."},
  {id:"thronebreaker", n:"Thronebreaker", tipo:"jogo", eventos:["thronebreaker"], ano:2018, cron:6,
    sinopse:"Jogo derivado: uma rainha do Norte enfrenta a invasão do seu reino.", nota:"Independente da trilogia."},
  {id:"the-witcher-jogo", n:"The Witcher", tipo:"jogo", fim:1270.99, ano:2007, cron:11,
    sinopse:"Geralt volta, sem memória, e precisa descobrir quem atacou Kaer Morhen."},
  {id:"the-witcher-2", n:"The Witcher 2", tipo:"jogo", fim:1271.99, ano:2011, cron:12,
    sinopse:"Acusado de um crime que não cometeu, Geralt persegue o verdadeiro culpado pelos reinos do Norte."},
  {id:"the-witcher-3", n:"The Witcher 3: Wild Hunt", tipo:"jogo", fim:1276.99, final:true, ano:2015, cron:13,
    sinopse:"Geralt procura alguém muito importante para ele, num Norte em guerra e perseguido por uma ameaça de outro mundo."},
  {id:"hearts-of-stone", n:"Hearts of Stone", tipo:"jogo", eventos:["coracoes"], ano:2015, cron:14, verbete:"the-witcher-3", expansao:true,
    sinopse:"Expansão: um contrato aparentemente simples prende Geralt a um pacto perigoso."},
  {id:"blood-and-wine", n:"Blood and Wine", tipo:"jogo", eventos:["sangue-vinho"], ano:2016, cron:15, verbete:"the-witcher-3", expansao:true,
    sinopse:"Expansão: Geralt é chamado a um ducado de contos de fada para caçar uma fera."}
],

// Eventos da era do bruxo que são pano de fundo, sem obra própria.
semObra: ["prova-geralt", "roegner-duny", "guerras-ebbing", "fiona-morre", "geralt-cacada"],
// Campos da ficha que, nesses verbetes, entregam a história (recolhidos como spoiler até o fim da saga).
fichaSpoiler: {
  "regis": ["Raça"], "borch": ["Raça"], "cahir": ["Afiliação"], "francesca": ["Título"],
  "geada-branca": ["Jogos"], "conclave": ["Fim"], "thanedd": ["Golpe"], "vilgefortz": ["Afiliação", "Aliados"]
},
// Outros nomes para a busca (nomes em inglês dos jogos) de verbetes que não vêm de nota da wiki.
apelidos: {
  "damas-da-floresta": ["Crones", "Ladies of the Wood", "Senhoras do Bosque"],
  "the-witcher-3": ["Wild Hunt", "Hearts of Stone", "Blood and Wine", "Corações de Pedra", "Sangue e Vinho"],
  "o-dimm": ["Man of Glass", "Master Mirror"],
  "cacada-selvagem": ["Wild Hunt", "Dearg Ruadhri"]
},

// Rotas desenhadas sobre o mapa. Cada ponto usa um lugar do mapa (p) ou coordenadas próprias (x, y em %).
rotas: [
  {id:"hansa", n:"A jornada da Hansa", cor:"#8C2A1B", sub:"Geralt e seus companheiros, de Brokilon a Rívia (1267–1268)", pontos:[
    {p:"brokilon", d:"Julho–agosto de 1267", t:"Geralt se recupera entre as dríades e parte com Jaskier e Milva.", ev:"brokilon-hansa"},
    {p:"brugge", d:"Agosto de 1267", t:"Pela zona de guerra de Brugge e Sodden, o grupo cresce: Zoltan, Regis, Cahir e Angoulême.", ev:"brokilon-hansa"},
    {p:"ponte-yaruga", d:"31 de agosto de 1267", t:"Lutam ao lado da rainha Meve; Geralt é sagrado cavaleiro.", ev:"ponte-yaruga"},
    {p:"toussaint", d:"Inverno de 1267–1268", t:"A neve nas montanhas prende a Hansa em Toussaint.", ev:"toussaint-hansa"},
    {p:"stygga", d:"Março de 1268", t:"O ataque ao esconderijo de Vilgefortz.", ev:"stygga"},
    {p:"rivia", d:"Junho de 1268", t:"O pogrom.", ev:"pogrom"}
  ]},
  {id:"ciri", n:"A fuga de Ciri", cor:"#26476B", sub:"De Thanedd à Torre da Andorinha e de volta (1267–1268)", pontos:[
    {p:"thanedd", d:"1º de julho de 1267", t:"Foge pela Torre da Gaivota durante o golpe.", ev:"thanedd"},
    {p:"korath", d:"Julho de 1267", t:"Reaparece no deserto de Korath e quase morre de sede.", ev:"thanedd"},
    {p:"ebbing", d:"Julho–setembro de 1267", t:"Vive com os Ratos sob o nome de Falka.", ev:"ratos"},
    {p:"pereplut", d:"27 de setembro de 1267", t:"Ferida, é acolhida pelo eremita Vysogota.", ev:"vysogota"},
    {p:"tarn-mira", d:"Novembro de 1267", t:"Entra na Torre da Andorinha e deixa o mundo.", ev:"tor-zireael"},
    {p:"stygga", d:"Março de 1268", t:"Volta para enfrentar Bonhart e Vilgefortz.", ev:"stygga"},
    {p:"rivia", d:"Junho de 1268", t:"Leva Geralt e Yennefer para longe.", ev:"pogrom"}
  ]},
  {id:"jogos", n:"Geralt nos jogos", cor:"#3A4150", sub:"De Kaer Morhen a Toussaint (1270–1276)", jogo:true, pontos:[
    {p:"kaer-morhen", d:"1270", t:"Volta sem memória; a Salamandra ataca a fortaleza.", ev:"tw1"},
    {p:"vizima", d:"1270", t:"A perseguição à Salamandra e a Ordem da Rosa Flamejante.", ev:"tw1"},
    {p:"flotsam", d:"1271", t:"Acusado de matar Foltest, Geralt persegue o regicida.", ev:"tw2"},
    {p:"vergen", d:"1271", t:"Ao lado de Roche ou de Iorveth, no cerco de Henselt.", ev:"tw2"},
    {p:"loc-muinne", d:"1271", t:"A cúpula dos reis e o confronto com Letho.", ev:"tw2"},
    {p:"velen", d:"1272", t:"A busca por Ciri começa nos pântanos devastados.", ev:"tw3"},
    {p:"novigrad", d:"1272", t:"Caça às bruxas, Dijkstra e o resgate de Jaskier.", ev:"tw3"},
    {p:"skellige", d:"1272", t:"Pistas de Ciri nas ilhas.", ev:"tw3"},
    {p:"kaer-morhen", d:"1272", t:"A batalha contra a Caçada Selvagem.", ev:"batalha-km"},
    {p:"toussaint", d:"1275–1276", t:"A Besta de Beauclair e o reencontro com Regis.", ev:"sangue-vinho"}
  ]}
],

// Quem controla cada lugar ao longo do tempo (aproximado). Fora das faixas, o lugar segue com seu governo próprio.
dominios: [
  {p:"cintra", faixas:[{de:1263, ate:9999, txt:"Ocupada por Nilfgaard", k:"nilf"}]},
  {p:"sodden", faixas:[{de:1263, ate:1263.2, txt:"Invadida por Nilfgaard", k:"nilf"}, {de:1267.6, ate:1268.3, txt:"Zona de guerra", k:"guerra"}]},
  {p:"brugge", faixas:[{de:1267.6, ate:1268.3, txt:"Ocupada por Nilfgaard", k:"nilf"}]},
  {p:"lyria", faixas:[{de:1267.5, ate:1268, txt:"Invadida por Nilfgaard; Meve resiste", k:"nilf"}]},
  {p:"aedirn", faixas:[{de:1267.5, ate:1267.6, txt:"Invadida por Nilfgaard", k:"nilf"}, {de:1267.6, ate:9999, txt:"Parte anexada por Kaedwen", k:"kaedwen"}]},
  {p:"dol-blathanna", faixas:[{de:1267.55, ate:9999, txt:"Devolvida aos elfos de Francesca", k:"elfos"}]},
  {p:"temeria", faixas:[{de:1271.5, ate:1272.9, txt:"Ocupada por Nilfgaard", k:"nilf"}]},
  {p:"vizima", faixas:[{de:1271.5, ate:1272.9, txt:"Ocupada por Nilfgaard", k:"nilf"}]},
  {p:"velen", faixas:[{de:1271.5, ate:1272.9, txt:"Terra de ninguém na guerra", k:"guerra"}]}
],
dominioTipos: {
  nilf: {label:"Nilfgaard", cor:"#8C2A1B"},
  guerra: {label:"Zona de guerra", cor:"#8A5E10"},
  kaedwen: {label:"Kaedwen", cor:"#26476B"},
  elfos: {label:"Elfos", cor:"#3F5E2A"}
},

// Desenho esquemático do mapa (coordenadas de 0 a 100, as mesmas dos lugares): mar, ilhas, rios e montanhas.
desenho: {
  mar: "0,0 58,0 54,3 46,9 36,12 29,16 25,22 26,27 22,31 16,34 11,38 12,44 14,50 16,56 19,62 17,70 20,78 24,88 22,100 0,100",
  ilhas: ["19,18 23,17 24,21 20,23", "5,44 8,42 10,45 7,47", "9,49 12,48 12,52 9,53", "4,51 6,50 7,53 5,54"],
  rios: [
    {n:"Pontar", pts:"27,29 33,30 40,30 46,31 53,33 60,33 67,31 76,29"},
    {n:"Yaruga", pts:"22,64 28,62 35,62 44,63 52,62 60,60 68,57 76,57 84,59"}
  ],
  montes: ["80,22 92,22 92,36 84,40 80,32", "48,66 64,66 66,71 50,71", "49,44 55,44 56,50 49,50", "70,10 82,10 82,18 72,18"]
},
// Nível de cada nome: 1 sempre aparece; 2 a partir de zoom 1,5; 3 a partir de zoom 2. Sem nível = 1.
nivel: {
  "vengerberg": 2, "tretogor": 2, "rinde": 2, "gors-velen": 2, "lan-exeter": 2, "ban-ard": 2, "blaviken": 2, "flotsam": 2, "vergen": 2,
  "loc-muinne": 2, "shaerrawedd": 2, "maribor": 2, "ellander": 2, "cidaris": 2, "brenna": 2, "rivia": 2, "beauclair": 2, "stygga": 2,
  "ebbing": 2, "metinna": 2, "nazair": 2, "hengfors": 2, "oxenfurt": 2,
  "marnadal": 3, "ponte-yaruga": 3, "tarn-mira": 3, "pereplut": 3
},
// Visão própria das ilhas de Skellige (esquemática).
skellige: {
  ilhas: [
    {id:"ard-skellig", n:"Ard Skellig", e:"ard-skellig", x:47, y:48, forma:"30,36 44,28 60,30 68,40 66,56 56,66 40,66 30,58 26,46"},
    {id:"undvik", n:"Undvik", e:"undvik", x:20, y:18, forma:"10,12 24,8 32,14 28,26 14,26"},
    {id:"an-skellig", n:"An Skellig", e:"an-skellig", x:52, y:13, forma:"42,8 58,6 64,14 54,20 44,18"},
    {id:"hindarsfjall", n:"Hindarsfjall", e:"hindarsfjall", x:82, y:26, forma:"76,20 86,18 90,26 84,32 76,30"},
    {id:"spikeroog", n:"Spikeroog", e:"spikeroog", x:17, y:72, forma:"8,66 22,62 28,72 20,80 10,78"},
    {id:"faroe", n:"Faroe", e:"faroe", x:79, y:78, forma:"70,72 84,68 92,76 84,86 72,84"}
  ],
  lugares: [
    {id:"kaer-trolde", n:"Kaer Trolde", e:"kaer-trolde", x:63, y:44, d:"Fortaleza do clã an Craite."}
  ]
},

// Árvores da aba Linhagem, desenhadas como diagrama.
// pessoas: g = geração (linha), x = posição horizontal (0–100), e = verbete.
// unioes: [a, b, tipo]; filhos: [[pais...], filho, tipo]. Tipos: casamento, segundo, amor, parente, contestado, destino, jogos.
// Modo sem spoilers: "rOculto" substitui "r" até ler a obra "revela"; "oculta" esconde a pessoa (e suas linhas) até ler a obra;
// "revela" na árvore inteira a esconde até ler a obra.
arvores: [
  {id:"sangue", n:"Sangue Antigo", titulo:"A linhagem do Sangue Antigo", sub:"De Lara Dorren a Ciri: o gene élfico atravessa Redânia, Temeria e Cintra até se manifestar por inteiro.",
    pessoas:[
      {id:"lara", n:"Lara Dorren", r:"elfa, Aen Saevherne", g:0, x:40, e:"lara-dorren"},
      {id:"cregennan", n:"Cregennan de Lod", r:"mago humano", g:0, x:62},
      {id:"riannon", n:"Riannon", r:"criada pela rainha Cerro", g:1, x:40},
      {id:"goidemar", n:"Goidemar", r:"rei da Temeria", g:1, x:62},
      {id:"falka", n:"Falka", r:"a rebelde de Redânia", g:1, x:86, e:"falka", oculta:"tempo-do-desprezo"},
      {id:"coram", n:"Coram II", r:"rei de Cintra", g:2, x:12},
      {id:"fiona", n:"Fiona", r:"morre em Cleves aos 93 anos", g:2, x:33},
      {id:"adela", n:"Adela", r:"morta na peste de Vizima", g:2, x:55},
      {id:"amavet", n:"Amavet", r:"assassinado", g:2, x:77},
      {id:"corbett", n:"Corbett", r:"rei de Cintra", g:3, x:22},
      {id:"elen", n:"Elen de Kaedwen", r:"rainha de Cintra", g:3, x:44},
      {id:"muriel", n:"Muriel", r:"filha de Amavet", g:3, x:70},
      {id:"crispin", n:"Crispin", r:"filho de Amavet", g:3, x:90},
      {id:"dagorad", n:"Dagorad", r:"rei de Cintra aos 12 anos", g:4, x:22},
      {id:"adalia", n:"Adalia", r:"a Vidente", g:4, x:44},
      {id:"roegner", n:"Roegner de Ebbing", r:"1º marido", g:5, x:11},
      {id:"calanthe", n:"Calanthe", r:"a Leoa de Cintra", g:5, x:33, e:"calanthe"},
      {id:"eist", n:"Eist Tuirseach", r:"2º marido, de Skellige", g:5, x:55, e:"eist"},
      {id:"pavetta", n:"Pavetta", r:"uma Fonte", g:6, x:33, e:"pavetta"},
      {id:"duny", n:"Duny", r:"Emhyr var Emreis", rOculto:"o Ouriço de Erlenwald", revela:"a-senhora-do-lago", g:6, x:55, e:"emhyr"},
      {id:"geralt", n:"Geralt de Rívia", r:"pai pelo destino", g:6, x:77, e:"geralt"},
      {id:"yennefer", n:"Yennefer", r:"mãe adotiva", g:6, x:95, e:"yennefer"},
      {id:"ciri", n:"Cirilla (Ciri)", r:"Zireael, a Leãozinha", g:7, x:55, e:"ciri", destaque:true}
    ],
    unioes:[["lara","cregennan","amor"], ["riannon","goidemar","casamento"], ["coram","fiona","casamento"], ["corbett","elen","casamento"], ["dagorad","adalia","casamento"],
      ["roegner","calanthe","casamento"], ["calanthe","eist","segundo"], ["pavetta","duny","casamento"], ["geralt","yennefer","amor"]],
    filhos:[[["lara","cregennan"],"riannon"], [["riannon","goidemar"],"fiona"], [["riannon","goidemar"],"adela"], [["riannon","goidemar"],"amavet"], [["falka"],"fiona","contestado"],
      [["amavet"],"muriel"], [["amavet"],"crispin"], [["coram","fiona"],"corbett"], [["corbett","elen"],"dagorad"], [["dagorad","adalia"],"calanthe"],
      [["roegner","calanthe"],"pavetta"], [["pavetta","duny"],"ciri"], [["geralt","yennefer"],"ciri","destino"]],
    notas:["Riannon, prisioneira de Falka no castelo de Houtborg, dá à luz os trigêmeos Fiona, Adela e Amavet.",
      "Filiação contestada: o documento obtido por Codringher em Tempo do Desprezo afirma que Fiona era, na verdade, filha secreta de Falka, o que faria de Ciri herdeira do \"sangue maculado\" da profecia.",
      "O nome de Ciri homenageia as ancestrais da linhagem: Fiona, Elen e Riannon."]},
  {id:"cintra", n:"Cintra e Skellige", titulo:"A casa real de Cintra", sub:"Da corte de Dagorad à Leoa de Cintra e sua neta, com os laços que levam a Skellige.",
    pessoas:[
      {id:"dagorad", n:"Dagorad", r:"rei de Cintra, neto de Fiona", g:0, x:30},
      {id:"adalia", n:"Adalia", r:"a Vidente", g:0, x:52},
      {id:"roegner", n:"Roegner de Ebbing", r:"1º marido", g:1, x:13},
      {id:"calanthe", n:"Calanthe", r:"a Leoa de Cintra", g:1, x:35, e:"calanthe"},
      {id:"eist", n:"Eist Tuirseach", r:"2º marido, rei consorte", g:1, x:57, e:"eist"},
      {id:"crach", n:"Crach an Craite", r:"jarl de Skellige, parente de Eist", g:1, x:83, e:"crach-an-craite"},
      {id:"pavetta", n:"Pavetta", r:"uma Fonte", g:2, x:35, e:"pavetta"},
      {id:"duny", n:"Duny", r:"o Ouriço de Erlenwald", g:2, x:57, e:"emhyr"},
      {id:"hjalmar", n:"Hjalmar", r:"filho de Crach (jogos)", g:2, x:76},
      {id:"cerys", n:"Cerys", r:"filha de Crach (jogos)", g:2, x:94},
      {id:"ciri", n:"Cirilla (Ciri)", r:"a Leãozinha de Cintra", g:3, x:46, e:"ciri", destaque:true}
    ],
    unioes:[["dagorad","adalia","casamento"], ["roegner","calanthe","casamento"], ["calanthe","eist","segundo"], ["eist","crach","parente"], ["pavetta","duny","casamento"]],
    filhos:[[["dagorad","adalia"],"calanthe"], [["roegner","calanthe"],"pavetta"], [["pavetta","duny"],"ciri"], [["crach"],"hjalmar","jogos"], [["crach"],"cerys","jogos"]],
    notas:["Calanthe morre ao se lançar da torre durante o Massacre de Cintra, em 1263; Eist cai na Batalha de Marnadal.",
      "Pavetta é conquistada por Duny pela Lei da Surpresa; o casal desaparece no Abismo de Sedna.",
      "Crach an Craite trata Ciri como sobrinha. Nos jogos, seus filhos Hjalmar e Cerys disputam a coroa de Skellige."]},
  {id:"nilfgaard", n:"Nilfgaard", titulo:"A casa var Emreis", revela:"a-senhora-do-lago", sub:"Do imperador deposto ao filho que recuperou o trono, e à filha que ele perseguiu.",
    pessoas:[
      {id:"fergus", n:"Fergus var Emreis", r:"imperador deposto pelo Usurpador", g:0, x:45},
      {id:"pavetta", n:"Pavetta", r:"princesa de Cintra", g:1, x:22, e:"pavetta"},
      {id:"emhyr", n:"Emhyr var Emreis", r:"Duny; recupera o trono c. 1257", g:1, x:45, e:"emhyr"},
      {id:"falsa", n:"A falsa Cirilla", r:"sósia criada em Toussaint", g:1, x:72},
      {id:"ciri", n:"Cirilla (Ciri)", r:"herdeira de Cintra", g:2, x:34, e:"ciri", destaque:true}
    ],
    unioes:[["pavetta","emhyr","casamento"], ["emhyr","falsa","segundo"]],
    filhos:[[["fergus"],"emhyr"], [["pavetta","emhyr"],"ciri"]],
    notas:["Um feiticeiro a serviço do Usurpador amaldiçoa o jovem herdeiro com a forma de ouriço durante o dia.",
      "Emhyr queria casar com a própria filha para cumprir a profecia; em Stygga, desiste e a deixa partir.",
      "Na Paz de Cintra (1268), casa-se com uma sósia de Ciri criada em Toussaint para o papel."]}
],
// Laços principais da aba Relações: [a, b, tipo, explicação, mudança (opcional)]. Os nomes vêm dos verbetes.
// O layout é automático (modelo de forças), então dá para acrescentar laços sem posicionar ninguém.
relacoes: {
  tipos: {
    familia: {label:"Família", color:"#8A5E10", peso:4}, amor: {label:"Amor", color:"#A0375A", peso:4}, mentor: {label:"Mentor", color:"#22696B", peso:3},
    aliado: {label:"Aliado", color:"#3F5E2A", peso:2}, inimigo: {label:"Inimigo", color:"#8C2A1B", peso:3}, complexo: {label:"Complexo", color:"#4A4E57", peso:2}
  },
  nomes: {"lara-dorren":"Lara Dorren", "crach-an-craite":"Crach", "codringher-e-fenn":"Codringher e Fenn", "stefan-skellen":"Skellen", "vattier-de-rideaux":"Vattier",
    "tissaia-de-vries":"Tissaia", "fringilla-vigo":"Fringilla", "sheala-de-tancarville":"Sheala", "assire-var-anahid":"Assire", "auberon-muircetach":"Auberon",
    "olgierd-von-everec":"Olgierd", "anna-henrietta":"Anna Henrietta", "vernon-roche":"Roche", "vizimir-ii":"Vizimir II", "o-dimm":"O'Dimm", "philippa":"Filippa",
    "regis":"Regis", "dijkstra":"Dijkstra", "borch":"Borch", "eredin":"Eredin", "triss":"Triss", "francesca":"Francesca", "zoltan":"Zoltan", "eist":"Eist", "radovid":"Radovid", "jacques-de-aldersberg":"Jacques"},
  lacos: [
    ["geralt","ciri","familia","Pai adotivo, ligado a ela pela Lei da Surpresa"],
    ["geralt","yennefer","amor","Amantes ligados pelo último desejo","Começa com um desejo feito ao djinn em Rinde; termina com ela se esgotando para salvá-lo no pogrom de Rívia."],
    ["yennefer","ciri","familia","Mãe adotiva e mestra de magia","Da desconfiança no templo de Melitele ao amor de mãe e filha."],
    ["ciri","calanthe","familia","Neta e avó"],
    ["ciri","emhyr","familia","Filha e pai; ele planejou se casar com ela","Passa anos caçando Ciri para cumprir a profecia; em Stygga, desiste e a deixa partir."],
    ["ciri","pavetta","familia","Filha e mãe"],
    ["emhyr","pavetta","amor","Marido e mulher; ele era Duny, o Ouriço"],
    ["calanthe","pavetta","familia","Mãe e filha"],
    ["calanthe","eist","amor","Segundo marido de Calanthe, rei consorte de Cintra"],
    ["eist","crach-an-craite","familia","Parentes; Crach é jarl de Skellige"],
    ["crach-an-craite","ciri","aliado","Trata Ciri como sobrinha"],
    ["lara-dorren","ciri","familia","Ancestral que leva o Sangue Antigo à linhagem"],
    ["lara-dorren","avallach","amor","Avallac'h amou Lara Dorren"],
    ["radovid","vizimir-ii","familia","Filho de Vizimir II"],
    ["geralt","jaskier","aliado","Amigos inseparáveis"],
    ["geralt","vesemir","mentor","Mestre em Kaer Morhen"],
    ["ciri","vesemir","mentor","Treinou Ciri como bruxa"],
    ["vesemir","eskel","mentor","Mestre em Kaer Morhen"],
    ["vesemir","lambert","mentor","Mestre em Kaer Morhen"],
    ["geralt","eskel","aliado","Amigos de infância em Kaer Morhen"],
    ["geralt","lambert","aliado","Bruxos do Lobo; Lambert é o mais novo e o mais ácido"],
    ["geralt","coen","aliado","Bruxo do Grifo que passa um inverno em Kaer Morhen; morre em Brenna"],
    ["yennefer","tissaia-de-vries","mentor","Mestra de Yennefer em Aretusa"],
    ["triss","yennefer","complexo","Amigas e rivais pelo amor de Geralt"],
    ["geralt","triss","amor","Amizade e romance passageiro"],
    ["ciri","triss","aliado","Como uma irmã mais velha"],
    ["ciri","nenneke","mentor","Acolhe Ciri no templo de Melitele, em Ellander"],
    ["geralt","nenneke","aliado","Sacerdotisa de Melitele que cuida de Geralt"],
    ["ciri","jarre","complexo","Amigo do templo, apaixonado por ela"],
    ["ciri","vysogota","mentor","Eremita que cuida de Ciri ferida e ouve sua história"],
    ["ciri","falka","complexo","Ciri usa o nome de Falka entre os Ratos; talvez seja sua descendente"],
    ["geralt","regis","aliado","Companheiro da Hansa"],
    ["geralt","milva","aliado","Guia e companheira da Hansa"],
    ["geralt","cahir","aliado","De inimigo a companheiro","Começa como o cavaleiro do elmo alado que Geralt despreza; termina morrendo ao lado da Hansa em Stygga."],
    ["geralt","angouleme","aliado","A mais jovem da Hansa; morre em Stygga"],
    ["geralt","zoltan","aliado","Amigo anão que guia a companhia pela zona de guerra"],
    ["ciri","cahir","complexo","O cavaleiro do elmo alado dos seus pesadelos","De terror de infância, em Cintra, a alguém que dá a vida tentando salvá-la."],
    ["ciri","eredin","inimigo","O rei da Caçada a persegue"],
    ["ciri","avallach","complexo","Guia e manipulador"],
    ["ciri","auberon-muircetach","complexo","Em Tir ná Lia, quer gerar com ela um filho do Sangue Antigo"],
    ["eredin","auberon-muircetach","inimigo","Nos jogos, suspeito de envenenar o rei"],
    ["eredin","avallach","complexo","Facções rivais dos Aen Elle"],
    ["ciri","vilgefortz","inimigo","Queria o poder do sangue dela"],
    ["geralt","vilgefortz","inimigo","Derrotou Geralt em Thanedd; morto por ele em Stygga"],
    ["yennefer","vilgefortz","inimigo","Prisioneira dele"],
    ["emhyr","vilgefortz","complexo","Aliança traída"],
    ["rience","vilgefortz","aliado","Agente a serviço de Vilgefortz"],
    ["rience","geralt","inimigo","Caça quem sabe de Ciri; morre em Thanedd"],
    ["codringher-e-fenn","geralt","aliado","Investigadores contratados por Geralt"],
    ["ciri","bonhart","inimigo","Seu algoz; morto por ela"],
    ["ciri","stefan-skellen","inimigo","O Coruja caça Ciri, com planos próprios"],
    ["emhyr","stefan-skellen","complexo","Agente imperial que conspira contra o imperador"],
    ["emhyr","vattier-de-rideaux","aliado","Chefe da inteligência imperial"],
    ["emhyr","francesca","aliado","Recebe de Emhyr o Vale das Flores"],
    ["emhyr","geralt","complexo","Geralt quebra a maldição de Duny; nos jogos, Emhyr o contrata","Do banquete de noivado em Cintra ao encontro em Stygga, onde Emhyr poupa a todos."],
    ["calanthe","geralt","complexo","Tenta enganá-lo para não entregar Ciri"],
    ["yennefer","philippa","complexo","A Loja das Feiticeiras"],
    ["philippa","francesca","aliado","Fundadoras da Loja"],
    ["philippa","sheala-de-tancarville","aliado","Membros da Loja"],
    ["philippa","fringilla-vigo","aliado","A Loja une magas do Norte e do Império"],
    ["fringilla-vigo","assire-var-anahid","aliado","Magas nilfgaardianas e amigas"],
    ["fringilla-vigo","geralt","amor","Romance no inverno em Toussaint"],
    ["philippa","dijkstra","complexo","Aliados e rivais na corte de Redânia","Governam juntos durante a menoridade de Radovid; depois, cada um segue seu jogo."],
    ["dijkstra","vizimir-ii","aliado","Chefe da espionagem do rei; Vizimir é assassinado em 1267"],
    ["dijkstra","radovid","complexo","Serve ao jovem rei; nos jogos, conspira para matá-lo"],
    ["philippa","radovid","inimigo","Nos jogos, Radovid a cega e a persegue"],
    ["geralt","dijkstra","complexo","Interrogador e, nos jogos, contratante"],
    ["foltest","geralt","aliado","Contrata Geralt para salvar a filha amaldiçoada"],
    ["letho","foltest","inimigo","Letho mata Foltest em The Witcher 2"],
    ["letho","geralt","complexo","Bruxo da Víbora que deixa Geralt levar a culpa pelo regicídio"],
    ["iorveth","geralt","complexo","Líder Scoia'tael; aliado possível em The Witcher 2"],
    ["vernon-roche","geralt","aliado","Comandante dos Listras Azuis; aliado nos jogos"],
    ["vernon-roche","iorveth","inimigo","Rivais em Flotsam"],
    ["vernon-roche","foltest","aliado","Leal ao rei"],
    ["saskia","philippa","complexo","Filippa a manipula em The Witcher 2"],
    ["o-dimm","geralt","complexo","O pacto do Homem dos Espelhos (Hearts of Stone)"],
    ["o-dimm","olgierd-von-everec","complexo","O pacto que tornou Olgierd imortal"],
    ["anna-henrietta","geralt","aliado","Contrata Geralt para caçar a Besta de Beauclair"],
    ["anna-henrietta","jaskier","amor","Romance com Jaskier"],
    ["borch","geralt","aliado","Companheiro de caçada que se revela um dragão dourado"],
    ["jaskier","yennefer","complexo","Antipatia mútua, sempre em volta de Geralt"],
    ["meve","geralt","aliado","Sagra Geralt cavaleiro na Ponte do Yaruga"],
    ["eithne","ciri","complexo","A rainha das dríades tenta transformá-la em dríade"],
    ["eithne","geralt","aliado","Abriga Geralt em Brokilon"]
  ],
  grupos: {
    hansa: {label:"A Hansa", membros:["geralt","jaskier","milva","cahir","regis","angouleme"]},
    lobos: {label:"Kaer Morhen", membros:["geralt","vesemir","eskel","lambert","coen","ciri"]},
    loja: {label:"Loja das Feiticeiras", membros:["philippa","francesca","sheala-de-tancarville","fringilla-vigo","assire-var-anahid","triss","yennefer"]},
    nilfgaard: {label:"Nilfgaard", membros:["emhyr","vattier-de-rideaux","stefan-skellen","cahir","fringilla-vigo","assire-var-anahid"]}
  }
},
// Grandes divergências entre os livros de Sapkowski e os jogos (aba Livros × Jogos).
// verbetes e eventos: ids ligados; jogo: onde a versão dos jogos aparece.
divergencias: [
  {id:"destino-geralt", tema:"O destino de Geralt e Yennefer", jogo:"The Witcher (jogo)",
    livros:"No pogrom de Rívia, Geralt é ferido por um forcado e Yennefer se esgota tentando curá-lo. Ciri leva os dois num barco para a Ilha das Maçãs, e o livro deixa em aberto se morrem ou entram na lenda.",
    jogos:"Os dois sobrevivem. Geralt cavalga com a Caçada Selvagem para libertar Yennefer e reaparece em 1270, sem memória, no primeiro jogo.",
    verbetes:["geralt","yennefer","pogrom-de-rivia"], eventos:["pogrom","geralt-cacada","tw1"]},
  {id:"cacada", tema:"A Caçada Selvagem", jogo:"The Witcher 3",
    livros:"Uma aparição de cavaleiros espectrais no céu, presságio de desgraça, ligada aos elfos Aen Elle: Eredin comanda os cavaleiros que Ciri encontra em Tir ná Lia.",
    jogos:"Um exército élfico de outro mundo sob Eredin, o Rei da Caçada, que atravessa mundos e persegue Ciri pelo Sangue Antigo. É o antagonista principal de The Witcher 3.",
    verbetes:["cacada-selvagem","eredin","aen-elle"], eventos:["tir-na-lia","tw3","batalha-km"]},
  {id:"frio-branco", tema:"O Frio Branco", jogo:"The Witcher 3",
    livros:"A era de gelo da profecia de Ithlinne, prevista para um futuro distante, milênios depois da saga. Ninguém pode detê-la.",
    jogos:"Uma ameaça cósmica que consome mundos e já ronda o dos Aen Elle. No clímax de The Witcher 3, Ciri entra na esfera do Frio e o enfrenta.",
    verbetes:["geada-branca","profecia-ithlinne"], eventos:["geada-ciri","geada-branca"]},
  {id:"ciri", tema:"O que acontece com Ciri", jogo:"The Witcher 3",
    livros:"Depois do pogrom, Ciri parte para outros mundos e tempos. Na moldura da saga, ela visita uma era de cavaleiros arturianos, onde conhece Galahad.",
    jogos:"Ciri volta ao Continente em 1272, caçada pela Caçada Selvagem. Conforme as escolhas do jogador, termina como imperatriz de Nilfgaard, como bruxa ou com um destino trágico.",
    verbetes:["ciri","nimue"], eventos:["futuro-asfalto","tw3","geada-ciri"]},
  {id:"vesemir", tema:"Vesemir e Kaer Morhen", jogo:"The Witcher 3",
    livros:"Vesemir é o mestre de Kaer Morhen que treina Ciri no inverno de 1263–1264 e segue vivo quando a saga termina.",
    jogos:"Kaer Morhen é atacada pela Salamandra no primeiro jogo, e Vesemir morre defendendo Ciri na Batalha de Kaer Morhen, em The Witcher 3.",
    verbetes:["vesemir","kaer-morhen","batalha-de-kaer-morhen"], eventos:["kaer-morhen-ciri","tw1","batalha-km"]},
  {id:"regis", tema:"A morte de Regis", jogo:"Blood and Wine",
    livros:"O vampiro Regis morre no ataque a Stygga, destruído por Vilgefortz.",
    jogos:"Em Blood and Wine, revela-se que ele se regenerou ao longo dos anos com a ajuda do vampiro Dettlaff, e volta a acompanhar Geralt.",
    verbetes:["regis","batalha-de-stygga","vampiros"], eventos:["stygga","sangue-vinho"]},
  {id:"triss", tema:"Triss Merigold", jogo:"The Witcher 3",
    livros:"Amiga de Yennefer e protetora de Ciri em Kaer Morhen. Teve um romance breve com Geralt e é uma personagem secundária.",
    jogos:"Uma das protagonistas: companheira de Geralt nos dois primeiros jogos, enquanto ele está sem memória, e uma das duas grandes opções românticas de The Witcher 3.",
    verbetes:["triss","yennefer"], eventos:["kaer-morhen-ciri","tw1","tw2"]},
  {id:"escolas", tema:"As escolas de bruxos e as mutações", jogo:"The Witcher 2",
    livros:"Só aparecem as escolas do Lobo, do Grifo e do Gato. A ideia de que bruxos não sentem nada é tratada como superstição: Geralt sente, só aprendeu a esconder.",
    jogos:"Escolas com sedes, armaduras e estilos próprios (Víbora, Urso, Manticora), e textos do jogo que afirmam que as mutações apagam as emoções.",
    verbetes:["escolas","mutacoes-dos-bruxos","letho","escrito-witcher-mutations-an-introduction-to-research"], eventos:["tw2"]},
  {id:"cronologia", tema:"As datas", jogo:"The Witcher (jogo)",
    livros:"Sapkowski dá poucas datas explícitas; a cronologia da saga (Thanedd em 1267, a Paz de Cintra em 1268) é reconstruída a partir de pistas.",
    jogos:"Os jogos fixam anos: o primeiro jogo em 1270, The Witcher 2 em 1271, The Witcher 3 em 1272 e Blood and Wine em 1275–1276.",
    verbetes:["the-witcher-jogo","the-witcher-2","the-witcher-3"], eventos:["tw1","tw2","tw3","sangue-vinho"]},
  {id:"nomes", tema:"Os nomes", jogo:"The Witcher (jogo)",
    livros:"A tradução brasileira dos livros usa Jaskier, Filippa, o Ouriço e a Leoa de Cintra.",
    jogos:"Os jogos usam os nomes da versão inglesa: Dandelion, Philippa, Urcheon.",
    verbetes:["jaskier","philippa","emhyr"], eventos:[]}
],
// Estilo de cada tipo de ligação na árvore.
lacos: {
  casamento: {label:"Casamento", cor:"#8A5E10", traco:""},
  segundo: {label:"Segundo casamento", cor:"#8A5E10", traco:"6 4"},
  amor: {label:"Amor", cor:"#A0375A", traco:""},
  parente: {label:"Parentesco", cor:"#4A4E57", traco:"2 4"},
  contestado: {label:"Filiação contestada", cor:"#8C2A1B", traco:"2 4"},
  destino: {label:"Pais pelo destino", cor:"#22696B", traco:"6 4"},
  jogos: {label:"Só nos jogos", cor:"#3A4150", traco:"6 4"}
},

// Ficha das criaturas. A classe e o óleo seguem o sistema de The Witcher 3.
fichas: {
  "necrofagos": [["Classe nos jogos", "Necrófago"], ["Óleo indicado", "Óleo contra necrófagos"]],
  "afogador": [["Classe nos jogos", "Necrófago"], ["Óleo indicado", "Óleo contra necrófagos"]],
  "vampiros": [["Classe nos jogos", "Vampiro"], ["Óleo indicado", "Óleo contra vampiros"]],
  "estrige": [["Classe nos jogos", "Amaldiçoado"], ["Óleo indicado", "Óleo contra amaldiçoados"]],
  "lobisomem": [["Classe nos jogos", "Amaldiçoado"], ["Óleo indicado", "Óleo contra amaldiçoados"]],
  "leshen": [["Classe nos jogos", "Relicto"], ["Óleo indicado", "Óleo contra relictos"]],
  "kikimora": [["Classe nos jogos", "Insectoide"], ["Óleo indicado", "Óleo contra insectoides"]],
  "grifo": [["Classe nos jogos", "Híbrido"], ["Óleo indicado", "Óleo contra híbridos"]],
  "dragoes": [["Classe nos jogos", "Dracônido"], ["Óleo indicado", "Óleo contra dracônidos"]],
  "basilisco": [["Classe nos jogos", "Dracônido"], ["Óleo indicado", "Óleo contra dracônidos"], ["Onde vive", "Cavernas, ruínas e lugares úmidos"], ["Fama", "A lenda diz que petrifica com o olhar; os caçadores de Toussaint escreveram tratados inteiros sobre ele"]],
  "wyvern": [["Classe nos jogos", "Dracônido"], ["Óleo indicado", "Óleo contra dracônidos"], ["Aparência", "Parente menor dos dragões: duas patas, asas e cauda longa"], ["Caça", "Ataca do alto, mergulhando sobre a presa"]],
  "doppler": [["Classe", "Metamorfo inteligente; não é caçado como monstro"], ["Poder", "Copia a aparência, a voz e até as memórias de quem imita"], ["O mais famoso", "Dudu, que vive como mercador em Novigrad no conto \"O Fogo Eterno\""]],
  "polifemo": [["Classe", "Relicto (só nos livros)"]]
}
};
