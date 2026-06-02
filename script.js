const itemInput = document.querySelector('#itemInput');
const quantityInput = document.querySelector('#quantityInput');
const unitSelect = document.querySelector('#unitSelect');
const addButton = document.querySelector('#addButton');
const clearButton = document.querySelector('#clearButton');
const togglePurchasedButton = document.querySelector('#togglePurchasedButton');
const totalCount = document.querySelector('#totalCount');
const remainingCount = document.querySelector('#remainingCount');
const shoppingList = document.querySelector('#shoppingList');

const STORAGE_KEY = 'lista-de-compras-2026';
let itens = [];
let showPurchased = true;

function carregarItens() {
  const dados = localStorage.getItem(STORAGE_KEY);
  itens = dados ? JSON.parse(dados) : [];
}

function salvarItens() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
}

function criarItemElement(item) {
  const li = document.createElement('li');
  const text = document.createElement('span');
  text.textContent = `${item.quantidade} ${item.unidade} • ${item.nome}`;
  text.className = item.comprado ? 'purchased' : '';

  const actions = document.createElement('div');
  actions.className = 'list-item-actions';

  const toggleButton = document.createElement('button');
  toggleButton.textContent = item.comprado ? 'Desmarcar' : 'Comprar';
  toggleButton.className = 'action-button purchase';
  toggleButton.addEventListener('click', () => {
    item.comprado = !item.comprado;
    salvarItens();
    renderizarLista();
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Excluir';
  deleteButton.className = 'action-button delete';
  deleteButton.addEventListener('click', () => {
    itens = itens.filter((current) => current.id !== item.id);
    salvarItens();
    renderizarLista();
  });

  actions.append(toggleButton, deleteButton);
  li.append(text, actions);
  li.dataset.comprado = item.comprado;

  return li;
}

function atualizarResumo() {
  const total = itens.length;
  const pendentes = itens.filter((item) => !item.comprado).length;
  totalCount.textContent = `Total de itens: ${total}`;
  remainingCount.textContent = `A comprar: ${pendentes}`;
}

function renderizarLista() {
  shoppingList.innerHTML = '';

  const itensVisiveis = showPurchased ? itens : itens.filter((item) => !item.comprado);

  if (itensVisiveis.length === 0) {
    const placeholder = document.createElement('p');
    placeholder.textContent = 'Nenhum item na lista. Adicione algo para começar.';
    placeholder.style.color = '#6b7280';
    placeholder.style.padding = '18px';
    shoppingList.appendChild(placeholder);
  } else {
    itensVisiveis.forEach((item) => shoppingList.appendChild(criarItemElement(item)));
  }

  atualizarResumo();
}

function adicionarItem() {
  const nome = itemInput.value.trim();
  if (!nome) return;

  const quantidade = parseFloat(quantityInput.value) || 1;
  const unidade = unitSelect.value || 'unidade';

  itens.push({
    id: Date.now(),
    nome,
    quantidade,
    unidade,
    comprado: false,
  });

  itemInput.value = '';
  quantityInput.value = '1';
  unitSelect.value = 'unidade';
  itemInput.focus();

  salvarItens();
  renderizarLista();
}

addButton.addEventListener('click', adicionarItem);
[itemInput, quantityInput, unitSelect].forEach((input) => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      adicionarItem();
    }
  });
});

clearButton.addEventListener('click', () => {
  if (!confirm('Deseja realmente limpar toda a lista?')) return;
  itens = [];
  salvarItens();
  renderizarLista();
});

function atualizarTextoBotao() {
  togglePurchasedButton.textContent = showPurchased ? 'Ocultar itens comprados' : 'Mostrar itens comprados';
}

togglePurchasedButton.addEventListener('click', () => {
  showPurchased = !showPurchased;
  atualizarTextoBotao();
  renderizarLista();
});

carregarItens();
atualizarTextoBotao();
renderizarLista();
