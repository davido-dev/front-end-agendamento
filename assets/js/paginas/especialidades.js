const form = document.querySelector('form');
const tabelaEspecialidades = document.querySelector('#tabela-especialidades');

const modalEdicao = document.querySelector('#modal-edicao');
const formEdicao = document.querySelector('#form-edicao');
const btnCancelar = document.querySelector('#btn-cancelar');

async function carregarEspecialidades() {
  try {
    const resposta = await fetch('http://localhost:3000/api/especialidades');

    if (!resposta.ok) {
      throw new Error('Erro ao buscar especialidades.');
    }

    const especialidades = await resposta.json();

    tabelaEspecialidades.innerHTML = '';

    especialidades.forEach(function (especialidade) {
      const linha = document.createElement('tr');

      linha.innerHTML = `
        <td>${especialidade.id_especialidade}</td>

        <td>${especialidade.nome}</td>

        <td>
          <button
            type="button"
            class="btn-editar"
            data-id="${especialidade.id_especialidade}"
          >
            Editar
          </button>

          <button
            type="button"
            class="btn-excluir"
            data-id="${especialidade.id_especialidade}"
          >
            Excluir
          </button>
        </td>
      `;

      tabelaEspecialidades.appendChild(linha);
    });
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível carregar as especialidades.');
  }
}

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const nome = document.querySelector('#nome').value;

  const especialidade = {
    nome: nome,
  };

  try {
    const resposta = await fetch('http://localhost:3000/api/especialidades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(especialidade),
    });

    if (!resposta.ok) {
      throw new Error('Erro ao cadastrar especialidade.');
    }

    alert(`${nome} cadastrada com sucesso!`);

    form.reset();

    carregarEspecialidades();
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível cadastrar a especialidade.');
  }
});

tabelaEspecialidades.addEventListener('click', function (event) {
  const botao = event.target;

  if (botao.classList.contains('btn-editar')) {
    editarEspecialidade(botao);
  }

  if (botao.classList.contains('btn-excluir')) {
    excluirEspecialidade(botao);
  }
});

function editarEspecialidade(botao) {
  const linha = botao.closest('tr');

  const id = linha.children[0].textContent;
  const nome = linha.children[1].textContent;

  document.querySelector('#editar-id').value = id;
  document.querySelector('#editar-nome').value = nome;

  modalEdicao.style.display = 'flex';
}

formEdicao.addEventListener('submit', async function (event) {
  event.preventDefault();

  const id = document.querySelector('#editar-id').value;
  const nome = document.querySelector('#editar-nome').value;

  const especialidade = {
    nome: nome,
  };

  try {
    const resposta = await fetch(`http://localhost:3000/api/especialidades/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(especialidade),
    });

    if (!resposta.ok) {
      throw new Error('Erro ao atualizar especialidade.');
    }

    alert(`${nome} atualizada com sucesso!`);

    modalEdicao.style.display = 'none';

    carregarEspecialidades();
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível atualizar a especialidade.');
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

async function excluirEspecialidade(botao) {
  const id = botao.dataset.id;

  const confirmar = confirm('Deseja realmente excluir esta especialidade?');

  if (!confirmar) {
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:3000/api/especialidades/${id}`, {
      method: 'DELETE',
    });

    if (!resposta.ok) {
      throw new Error('Erro ao excluir especialidade.');
    }

    alert('Especialidade excluída com sucesso!');

    carregarEspecialidades();
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível excluir a especialidade.');
  }
}

carregarEspecialidades();
