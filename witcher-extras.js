// Dados escritos à mão para as partes do app que não vêm da wiki:
// ordem de leitura e cortes de spoiler, rotas e domínios do mapa, árvores extras e fichas do bestiário.
window.WITCHER_EXTRAS = {

// Ordem recomendada. "fim" é o ponto da cronologia (campo s dos eventos) até onde a obra conta a história;
// "eventos" lista eventos que só aquela obra revela, fora da sequência.
leitura: [
  {id:"o-ultimo-desejo", n:"O Último Desejo", tipo:"livro", fim:1253.5},
  {id:"a-espada-do-destino", n:"A Espada do Destino", tipo:"livro", fim:1263.3},
  {id:"o-sangue-dos-elfos", n:"O Sangue dos Elfos", tipo:"livro", fim:1267.25},
  {id:"tempo-do-desprezo", n:"Tempo do Desprezo", tipo:"livro", fim:1267.55},
  {id:"batismo-de-fogo", n:"Batismo de Fogo", tipo:"livro", fim:1267.67},
  {id:"a-torre-da-andorinha", n:"A Torre da Andorinha", tipo:"livro", fim:1267.9},
  {id:"a-senhora-do-lago", n:"A Senhora do Lago", tipo:"livro", fim:1268.99, final:true},
  {id:"season-of-storms", n:"Season of Storms", tipo:"livro", eventos:["season-storms"], nota:"Pode ser lido a qualquer momento depois dos contos."},
  {id:"thronebreaker", n:"Thronebreaker", tipo:"jogo", eventos:["thronebreaker"], nota:"Jogo derivado, independente da trilogia."},
  {id:"the-witcher-jogo", n:"The Witcher", tipo:"jogo", fim:1270.99},
  {id:"the-witcher-2", n:"The Witcher 2", tipo:"jogo", fim:1271.99},
  {id:"the-witcher-3", n:"The Witcher 3 e expansões", tipo:"jogo", fim:1276.99, final:true}
],

// Eventos da era do bruxo que são pano de fundo, sem obra própria.
semObra: ["prova-geralt", "roegner-duny", "guerras-ebbing", "fiona-morre"],

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

// Árvores da aba Linhagem. "sangue" usa a árvore de witcher-tempo.js.
arvores: [
  {id:"sangue", n:"Sangue Antigo", titulo:"A linhagem do Sangue Antigo", sub:"Oito gerações, de Lara Dorren a Ciri. O gene élfico atravessa Redania, Temeria e Cintra até se manifestar por inteiro."},
  {id:"cintra", n:"Cintra e Skellige", titulo:"A casa real de Cintra", sub:"Da corte de Dagorad à Leoa de Cintra e sua neta, com os laços que levam a Skellige.", geracoes:[
    {gen:"I", p:{n:"Dagorad", r:"rei de Cintra, neto de Fiona"}, sp:{n:"Adalia, a Vidente", r:"viúva de Ragbard de Ellander"}},
    {gen:"II", p:{id:"calanthe", n:"Calanthe", r:"a Leoa de Cintra"}, sp:{n:"Roegner de Ebbing", r:"primeiro marido"}, side:"Viúva, casa-se com Eist Tuirseach, de Skellige, que se torna rei consorte de Cintra. Crach an Craite, jarl de Skellige e parente de Eist, trata Ciri como sobrinha.", note:"Morre ao se lançar da torre durante o Massacre de Cintra, em 1263."},
    {gen:"III", p:{id:"pavetta", n:"Pavetta", r:"uma Fonte"}, sp:{id:"emhyr", n:"Duny", r:"o Ouriço de Erlenwald"}, note:"Conquistada pela Lei da Surpresa; o casal desaparece no Abismo de Sedna."},
    {gen:"IV", p:{id:"ciri", n:"Cirilla", r:"a Leãozinha de Cintra"}, side:"Nos jogos, os filhos de Crach, Hjalmar e Cerys, disputam a coroa de Skellige."}
  ]},
  {id:"nilfgaard", n:"Nilfgaard", titulo:"A casa var Emreis", sub:"Do imperador deposto ao filho que recuperou o trono, e à filha que ele perseguiu.", geracoes:[
    {gen:"I", p:{n:"Fergus var Emreis", r:"imperador deposto pelo Usurpador"}, note:"Um feiticeiro a serviço do Usurpador amaldiçoa o jovem herdeiro com a forma de ouriço."},
    {gen:"II", p:{id:"emhyr", n:"Emhyr var Emreis", r:"Duny; recupera o trono c. 1257"}, sp:{id:"pavetta", n:"Pavetta", r:"princesa de Cintra"}, side:"Na Paz de Cintra (1268), casa-se com uma sósia de Ciri criada em Toussaint para o papel."},
    {gen:"III", p:{id:"ciri", n:"Cirilla", r:"herdeira de Cintra"}, note:"Emhyr queria casar com ela para cumprir a profecia; em Stygga, desiste e a deixa partir."}
  ]}
],

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
  "basilisco": [["Classe nos jogos", "Dracônido"], ["Óleo indicado", "Óleo contra dracônidos"]],
  "wyvern": [["Classe nos jogos", "Dracônido"], ["Óleo indicado", "Óleo contra dracônidos"]],
  "doppler": [["Classe", "Metamorfo inteligente; não é caçado como monstro"]],
  "polifemo": [["Classe", "Relicto (só nos livros)"]]
}
};
