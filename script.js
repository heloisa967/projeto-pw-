// script.js - parte da loja (catalogo e carrinho)

var produtos = pegar("produtos");   // vem do dados.js (o mesmo que o admin mexe)
var carrinho = JSON.parse(localStorage.getItem("bt_carrinho") || "[]");   // lista com os ids dos produtos escolhidos

// procura um produto pelo id
function acharProduto(id) {
  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].id == id) {
      return produtos[i];
    }
  }
  return null;   // nao achou (ex: o produto foi excluido no admin)
}

// mostra os produtos na tela
function mostrarProdutos() {
  var html = "";
  for (var i = 0; i < produtos.length; i++) {
    var p = produtos[i];
    html += '<div class="card">';
    html += '  <div class="celular" style="background:' + p.cor_hex + '"></div>';
    html += '  <h3>' + p.modelo + '</h3>';
    html += '  <p>' + p.cor + ' - ' + p.memoria + '</p>';
    html += '  <p class="preco">R$ ' + p.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) + '</p>';
    html += '  <button onclick="comprar(' + p.id + ')">Adicionar ao carrinho</button>';
    html += '</div>';
  }
  if (produtos.length == 0) {
    html = "<p>Nenhum produto cadastrado.</p>";
  }
  document.getElementById("produtos").innerHTML = html;
}

// adiciona um produto no carrinho
function comprar(id) {
  carrinho.push(id);
  salvarCarrinho();
  mostrarCarrinho();
}

// tira um item do carrinho (pela posicao dele na lista)
function remover(posicao) {
  carrinho.splice(posicao, 1);
  salvarCarrinho();
  mostrarCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  mostrarCarrinho();
}

function finalizar() {
  alert("Pedido realizado com sucesso! Obrigado pela compra.");
  limparCarrinho();
}

function salvarCarrinho() {
  localStorage.setItem("bt_carrinho", JSON.stringify(carrinho));
}

// mostra o carrinho na tela e calcula o total
function mostrarCarrinho() {
  var html = "";
  var total = 0;
  var quantidade = 0;

  for (var i = 0; i < carrinho.length; i++) {
    var p = acharProduto(carrinho[i]);
    if (p == null) {
      continue;   // produto nao existe mais, pula
    }
    total = total + p.valor;
    quantidade++;
    html += '<div class="linha">';
    html += '  <span>' + p.modelo + ' (' + p.cor + ', ' + p.memoria + ')</span>';
    html += '  <span>R$ ' + p.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) + ' ';
    html += '  <button class="pequeno vermelho" onclick="remover(' + i + ')">Remover</button></span>';
    html += '</div>';
  }

  if (quantidade == 0) {
    html = "<p>Seu carrinho está vazio.</p>";
  } else {
    html += '<p class="total">Total: R$ ' + total.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) + '</p>';
    html += '<button onclick="finalizar()">Finalizar pedido</button> ';
    html += '<button class="cinza" onclick="limparCarrinho()">Limpar carrinho</button>';
  }

  document.getElementById("area-carrinho").innerHTML = html;
  document.getElementById("qtd").innerHTML = quantidade;
}

// roda quando a pagina abre
mostrarProdutos();
mostrarCarrinho();