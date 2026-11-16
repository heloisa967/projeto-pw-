// dados.js
// Aqui ficam os dados do site (produtos, clientes e funcionarios).
// Como o GitHub Pages nao tem banco de dados, eu guardo tudo no localStorage do navegador.

var dadosIniciais = {
  produtos: [
    { id: 1, modelo: "iPhone 18 Pro", valor: 11999, memoria: "1 TB", cor: "magenta", cor_hex: "#d6338a" },
    { id: 2, modelo: "iPhone 19 Pro Max", valor: 16999, memoria: "2 TB", cor: "rosa bebê", cor_hex: "#f4b6cf" },
    { id: 3, modelo: "iPhone 20", valor: 12999, memoria: "512 GB", cor: "azul celeste", cor_hex: "#7cc4f2" }
  ],
  clientes: [
    { id: 12, nome: "Bruna", email: "princesabruninha@teste.com", cep: "96405-778", cpf: "123.456.789-10" },
    { id: 13, nome: "Jonath", email: "jondivo@teste.com", cep: "96405-888", cpf: "133.486.739-18" },
    { id: 14, nome: "Viktor", email: "viktordabicicletinha@teste.com", cep: "96885-978", cpf: "166.756.999-20" }
  ],
  funcionarios: [
    { id: 4, nome: "Lucas", funcao: "Atendente do suporte", codigo_cracha: 8989 },
    { id: 5, nome: "Thiago", funcao: "Cuidar do estoque e atualizar o site", codigo_cracha: 2222 },
    { id: 6, nome: "Luis", funcao: "Cuidar do financeiro", codigo_cracha: 1313 }
  ]
};

// pega a lista salva no navegador
// se ainda nao tem nada salvo (primeira vez), usa os dados iniciais
function pegar(nome) {
  var texto = localStorage.getItem("bt_" + nome);
  if (texto != null) {
    return JSON.parse(texto);   // transforma o texto de volta em lista
  }
  guardar(nome, dadosIniciais[nome]);
  return dadosIniciais[nome];
}

// salva a lista no navegador (o localStorage so guarda texto, por isso o JSON.stringify)
function guardar(nome, lista) {
  localStorage.setItem("bt_" + nome, JSON.stringify(lista));
}