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
    {x:52, y:62, n:"Ponte do Yaruga", d:"31 de agosto de 1267", t:"Lutam ao lado da rainha Meve; Geralt é sagrado cavaleiro.", ev:"ponte-yaruga"},
    {p:"toussaint", d:"Inverno de 1267–1268", t:"A neve nas montanhas prende a Hansa em Toussaint.", ev:"toussaint-hansa"},
    {x:62, y:78, n:"Castelo de Stygga", d:"Março de 1268", t:"O ataque ao esconderijo de Vilgefortz.", ev:"stygga"},
    {x:71, y:55, n:"Rívia", d:"Junho de 1268", t:"O pogrom.", ev:"pogrom"}
  ]},
  {id:"ciri", n:"A fuga de Ciri", cor:"#26476B", sub:"De Thanedd à Torre da Andorinha e de volta (1267–1268)", pontos:[
    {p:"thanedd", d:"1º de julho de 1267", t:"Foge pela Torre da Gaivota durante o golpe.", ev:"thanedd"},
    {p:"korath", d:"Julho de 1267", t:"Reaparece no deserto de Korath e quase morre de sede.", ev:"thanedd"},
    {x:64, y:67, n:"Geso e Ebbing", d:"Julho–setembro de 1267", t:"Vive com os Ratos sob o nome de Falka.", ev:"ratos"},
    {x:59, y:71, n:"Pântanos de Pereplut", d:"27 de setembro de 1267", t:"Ferida, é acolhida pelo eremita Vysogota.", ev:"vysogota"},
    {x:57, y:64, n:"Tarn Mira", d:"Novembro de 1267", t:"Entra na Torre da Andorinha e deixa o mundo.", ev:"tor-zireael"},
    {x:62, y:78, n:"Castelo de Stygga", d:"Março de 1268", t:"Volta para enfrentar Bonhart e Vilgefortz.", ev:"stygga"},
    {x:71, y:55, n:"Rívia", d:"Junho de 1268", t:"Leva Geralt e Yennefer para longe.", ev:"pogrom"}
  ]},
  {id:"jogos", n:"Geralt nos jogos", cor:"#3A4150", sub:"De Kaer Morhen a Toussaint (1270–1276)", jogo:true, pontos:[
    {p:"kaer-morhen", d:"1270", t:"Volta sem memória; a Salamandra ataca a fortaleza.", ev:"tw1"},
    {p:"vizima", d:"1270", t:"A perseguição à Salamandra e a Ordem da Rosa Flamejante.", ev:"tw1"},
    {x:55, y:33, n:"Flotsam", d:"1271", t:"Acusado de matar Foltest, Geralt persegue o regicida.", ev:"tw2"},
    {x:66, y:40, n:"Vergen", d:"1271", t:"Ao lado de Roche ou de Iorveth, no cerco de Henselt.", ev:"tw2"},
    {x:74, y:42, n:"Loc Muinne", d:"1271", t:"A cúpula dos reis e o confronto com Letho.", ev:"tw2"},
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
