// admin.js - o CRUD das 3 entidades
// C = criar (Cadastrar) | R = ler (listar) | U = atualizar (Editar) | D = deletar (Excluir)
// As 3 entidades usam as mesmas funcoes, so muda o nome ("produtos", "clientes" ou "funcionarios").

// quais campos cada entidade tem (os mesmos nomes dos ids no admin.html)
var campos = {
  produtos: ["modelo", "valor", "memoria", "cor", "cor_hex"],
  clientes: ["nome", "email", "cpf", "cep"],
  funcionarios: ["nome", "funcao", "codigo_cracha"]
};

// guarda o id de quem estou editando (null = nao estou editando ninguem, entao vai cadastrar)
var editando = { produtos: null, clientes: null, funcionarios: null };


// ---------- READ: mostrar a tabela ----------
function listar(entidade) {
  var lista = pegar(entidade);
  var html = "";

  for (var i = 0; i < lista.length; i++) {
    var item = lista[i];
    html += "<tr>";
    html += "<td>" + item.id + "</td>";

    // uma coluna para cada campo
    for (var j = 0; j < campos[entidade].length; j++) {
      var campo = campos[entidade][j];
      if (campo == "cor_hex") {
        html += '<td><span class="bolinha" style="background:' + item[campo] + '"></span>' + item[campo] + "</td>";
      } else if (campo == "valor") {
        html += "<td>R$ " + item[campo].toLocaleString("pt-BR", { minimumFractionDigits: 2 }) + "</td>";
      } else {
        html += "<td>" + item[campo] + "</td>";
      }
    }

    html += '<td>';
    html += '<button class="pequeno" onclick="editar(\'' + entidade + '\', ' + item.id + ')">Editar</button> ';
    html += '<button class="pequeno vermelho" onclick="excluir(\'' + entidade + '\', ' + item.id + ')">Excluir</button>';
    html += '</td>';
    html += "</tr>";
  }

  if (lista.length == 0) {
    html = '<tr><td colspan="8">Nada cadastrado ainda.</td></tr>';
  }
  document.getElementById(entidade + "_lista").innerHTML = html;
}


// ---------- CREATE e UPDATE: o botao Cadastrar / Salvar alteracoes ----------
function salvar(entidade) {
  var lista = pegar(entidade);
  var novo = {};

  // le o que foi digitado em cada campo
  for (var i = 0; i < campos[entidade].length; i++) {
    var campo = campos[entidade][i];
    var valor = document.getElementById(entidade + "_" + campo).value.trim();
    if (valor == "") {
      alert("Preencha todos os campos!");
      return;   // para aqui, nao salva
    }
    novo[campo] = valor;
  }

  // validacoes simples
  if (entidade == "produtos") {
    novo.valor = Number(novo.valor);          // o valor precisa ser numero
    if (isNaN(novo.valor) || novo.valor <= 0) {
      alert("Digite um valor válido (maior que zero).");
      return;
    }
  }
  if (entidade == "clientes") {
    if (novo.email.indexOf("@") == -1) {
      alert("E-mail inválido.");
      return;
    }
  }
  if (entidade == "funcionarios") {
    novo.codigo_cracha = Number(novo.codigo_cracha);
    if (isNaN(novo.codigo_cracha)) {
      alert("O código do crachá precisa ser um número.");
      return;
    }
  }

  if (editando[entidade] == null) {
    // CREATE: cria um item novo com id novo
    novo.id = proximoId(lista);
    lista.push(novo);
  } else {
    // UPDATE: acha o item com o id que estou editando e troca pelos dados novos
    for (var k = 0; k < lista.length; k++) {
      if (lista[k].id == editando[entidade]) {
        novo.id = lista[k].id;   // mantem o mesmo id
        lista[k] = novo;
      }
    }
  }

  guardar(entidade, lista);
  limpar(entidade);
  listar(entidade);
}

// o proximo id e o maior id que existe + 1
function proximoId(lista) {
  var maior = 0;
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id > maior) {
      maior = lista[i].id;
    }
  }
  return maior + 1;
}


// ---------- UPDATE: botao Editar (coloca os dados no formulario) ----------
function editar(entidade, id) {
  var lista = pegar(entidade);

  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id == id) {
      // preenche os campos com os dados do item
      for (var j = 0; j < campos[entidade].length; j++) {
        var campo = campos[entidade][j];
        document.getElementById(entidade + "_" + campo).value = lista[i][campo];
      }
    }
  }

  editando[entidade] = id;
  document.getElementById(entidade + "_botao").innerHTML = "Salvar alterações";
  document.getElementById(entidade).scrollIntoView();   // sobe a pagina ate o formulario
}


// ---------- DELETE: botao Excluir ----------
function excluir(entidade, id) {
  if (confirm("Tem certeza que quer excluir?") == false) {
    return;
  }

  var lista = pegar(entidade);
  var nova = [];
  for (var i = 0; i < lista.length; i++) {
    if (lista[i].id != id) {     // guarda todo mundo, menos o que foi excluido
      nova.push(lista[i]);
    }
  }

  guardar(entidade, nova);
  listar(entidade);
}


// limpa o formulario e volta pro modo "Cadastrar"
function limpar(entidade) {
  for (var i = 0; i < campos[entidade].length; i++) {
    var campo = campos[entidade][i];
    document.getElementById(entidade + "_" + campo).value = "";
  }
  document.getElementById("produtos_cor_hex").value = "#1976d2";   // o campo de cor nao pode ficar vazio
  editando[entidade] = null;
  document.getElementById(entidade + "_botao").innerHTML = "Cadastrar";
}


// apaga as alteracoes e volta aos dados iniciais
function restaurar() {
  if (confirm("Voltar todos os dados ao original?")) {
    localStorage.removeItem("bt_produtos");
    localStorage.removeItem("bt_clientes");
    localStorage.removeItem("bt_funcionarios");
    listar("produtos");
    listar("clientes");
    listar("funcionarios");
  }
}


// quando a pagina abre, mostra as 3 tabelas
listar("produtos");
listar("clientes");
listar("funcionarios");