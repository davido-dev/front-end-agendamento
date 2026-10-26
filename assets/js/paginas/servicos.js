const form = document.querySelector('form');
const tabelaServicos = document.querySelector('#tabela-servicos');

const modalEdicao = document.querySelector('#modal-edicao');
const formEdicao = document.querySelector('#form-edicao');
const btnCancelar = document.querySelector('#btn-cancelar');

async function carregarServicos() {
  try {
    const resposta = await fetch('http://localhost:3000/api/servicos');

    if (!resposta.ok) {
      throw new Error('Erro ao buscar serviços.');
    }

    const servicos = await resposta.json();

    tabelaServicos.innerHTML = '';

    servicos.forEach(function (servico) {
      const linha = document.createElement('tr');

      linha.innerHTML = `
        <td>${servico.id_servico}</td>
        <td>${servico.nome}</td>
        <td>${servico.descricao}</td>
        <td>${servico.duracao_minutos} min</td>
        <td>R$ ${Number(servico.valor).toFixed(2).replace('.', ',')}</td>
        <td>${servico.status}</td>
        <td>
          <button
            type="button"
            class="btn-editar"
            data-id="${servico.id_servico}"
          >
            Editar
          </button>

          <button
            type="button"
            class="btn-excluir"
            data-id="${servico.id_servico}"
          >
            Excluir
          </button>
        </td>
      `;

      tabelaServicos.appendChild(linha);
    });
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível carregar os serviços.');
  }
}

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const nome = document.querySelector('#nome').value;
  const descricao = document.querySelector('#descricao').value;
  const duracao_minutos = document.querySelector('#duracao_minutos').value;
  const valor = document.querySelector('#valor').value;
  const status = document.querySelector('#status').value;

  const servico = {
    nome: nome,
    descricao: descricao,
    duracao_minutos: duracao_minutos,
    valor: valor,
    status: status,
  };

  try {
    const resposta = await fetch('http://localhost:3000/api/servicos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(servico),
    });

    if (!resposta.ok) {
      throw new Error('Erro ao cadastrar serviço.');
    }

    alert(`${nome} cadastrado com sucesso!`);

    form.reset();

    carregarServicos();
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível cadastrar o serviço.');
  }
});

tabelaServicos.addEventListener('click', function (event) {
  const botao = event.target;

  if (botao.classList.contains('btn-editar')) {
    editarServico(botao);
  }

  if (botao.classList.contains('btn-excluir')) {
    excluirServico(botao);
  }
});

function editarServico(botao) {
  const linha = botao.closest('tr');

  const id = linha.children[0].textContent;
  const nome = linha.children[1].textContent;
  const descricao = linha.children[2].textContent;
  const duracao = linha.children[3].textContent.replace(' min', '');
  const valor = linha.children[4].textContent.replace('R$ ', '').replace(',', '.');
  const status = linha.children[5].textContent;

  document.querySelector('#editar-id').value = id;
  document.querySelector('#editar-nome').value = nome;
  document.querySelector('#editar-descricao').value = descricao;
  document.querySelector('#editar-duracao_minutos').value = duracao;
  document.querySelector('#editar-valor').value = valor;
  document.querySelector('#editar-status').value = status;

  modalEdicao.style.display = 'flex';
}

formEdicao.addEventListener('submit', async function (event) {
  event.preventDefault();

  const id = document.querySelector('#editar-id').value;
  const nome = document.querySelector('#editar-nome').value;
  const descricao = document.querySelector('#editar-descricao').value;
  const duracao_minutos = document.querySelector('#editar-duracao_minutos').value;
  const valor = document.querySelector('#editar-valor').value;
  const status = document.querySelector('#editar-status').value;

  const servico = {
    nome: nome,
    descricao: descricao,
    duracao_minutos: duracao_minutos,
    valor: valor,
    status: status,
  };

  try {
    const resposta = await fetch(`http://localhost:3000/api/servicos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(servico),
    });

    if (!resposta.ok) {
      throw new Error('Erro ao atualizar serviço.');
    }

    alert(`${nome} atualizado com sucesso!`);

    modalEdicao.style.display = 'none';

    carregarServicos();
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível atualizar o serviço.');
  }
});

btnCancelar.addEventListener('click', function () {
  modalEdicao.style.display = 'none';
});

modalEdicao.addEventListener('click', function (event) {
  if (event.target === modalEdicao) {
    modalEdicao.style.display = 'none';
  }
});

async function excluirServico(botao) {
  const id = botao.dataset.id;

  const confirmar = confirm('Deseja realmente excluir este serviço?');

  if (!confirmar) {
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:3000/api/servicos/${id}`, {
      method: 'DELETE',
    });

    if (!resposta.ok) {
      throw new Error('Erro ao excluir serviço.');
    }

    alert('Serviço excluído com sucesso!');

    carregarServicos();
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível excluir o serviço.');
  }
}

carregarServicos();
