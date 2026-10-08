const form = document.querySelector('form');

const usuario = document.querySelector('#usuario');
const especialidade = document.querySelector('#especialidade');
const status = document.querySelector('#status');

const tabelaProfissionais = document.querySelector('#tabela-profissionais');

const modalEdicao = document.querySelector('#modal-edicao');
const formEdicao = document.querySelector('#form-edicao');
const btnCancelar = document.querySelector('#btn-cancelar');

const editarUsuario = document.querySelector('#editar-usuario');
const editarEspecialidade = document.querySelector('#editar-especialidade');
const editarStatus = document.querySelector('#editar-status');

async function carregarUsuarios() {
  try {
    const resposta = await fetch('http://localhost:3000/api/profissionais');

    if (!resposta.ok) {
      throw new Error('Erro ao buscar usuários.');
    }

    const profissionais = await resposta.json();

    usuario.innerHTML = `
      <option value="">Selecione o usuário</option>
    `;

    editarUsuario.innerHTML = `
      <option value="">Selecione o usuário</option>
    `;

    profissionais.forEach(function (profissional) {
      const option = document.createElement('option');

      option.value = profissional.Usuario.id_usuario;
      option.textContent = profissional.Usuario.nome;

      usuario.appendChild(option);

      const optionEdicao = document.createElement('option');

      optionEdicao.value = profissional.Usuario.id_usuario;
      optionEdicao.textContent = profissional.Usuario.nome;

      editarUsuario.appendChild(optionEdicao);
    });
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível carregar os usuários.');
  }
}

async function carregarEspecialidades() {
  try {
    const resposta = await fetch('http://localhost:3000/api/especialidades');

    if (!resposta.ok) {
      throw new Error('Erro ao buscar especialidades.');
    }

    const especialidades = await resposta.json();

    especialidade.innerHTML = `
      <option value="">Selecione a especialidade</option>
    `;

    editarEspecialidade.innerHTML = `
      <option value="">Selecione a especialidade</option>
    `;

    especialidades.forEach(function (especialidadeItem) {
      const option = document.createElement('option');

      option.value = especialidadeItem.id_especialidade;
      option.textContent = especialidadeItem.nome;

      especialidade.appendChild(option);

      const optionEdicao = document.createElement('option');

      optionEdicao.value = especialidadeItem.id_especialidade;
      optionEdicao.textContent = especialidadeItem.nome;

      editarEspecialidade.appendChild(optionEdicao);
    });
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível carregar as especialidades.');
  }
}

async function carregarProfissionais() {
  try {
    const resposta = await fetch('http://localhost:3000/api/profissionais');

    if (!resposta.ok) {
      throw new Error('Erro ao buscar profissionais.');
    }

    const profissionais = await resposta.json();

    tabelaProfissionais.innerHTML = '';

    profissionais.forEach(function (profissional) {
      const linha = document.createElement('tr');

      const nomeUsuario = profissional.Usuario.nome;
      const nomeEspecialidade = profissional.Especialidade.nome;

      linha.innerHTML = `
        <td>${profissional.id_profissional}</td>

        <td>${nomeUsuario}</td>

        <td>${nomeEspecialidade}</td>

        <td>${profissional.status}</td>

        <td>
          <button
            type="button"
            class="btn-editar"
            data-id="${profissional.id_profissional}"
            data-usuario="${profissional.id_usuario}"
            data-especialidade="${profissional.id_especialidade}"
            data-status="${profissional.status}"
          >
            Editar
          </button>

          <button
            type="button"
            class="btn-excluir"
            data-id="${profissional.id_profissional}"
          >
            Excluir
          </button>
        </td>
      `;

      tabelaProfissionais.appendChild(linha);
    });
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível carregar os profissionais.');
  }
}

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const idUsuario = usuario.value;
  const idEspecialidade = especialidade.value;
  const statusProfissional = status.value;

  const profissional = {
    id_usuario: idUsuario,
    id_especialidade: idEspecialidade,
    status: statusProfissional,
  };

  try {
    const resposta = await fetch('http://localhost:3000/api/profissionais', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profissional),
    });

    console.log(resposta)

    if (!resposta.ok) {
      throw new Error('Erro ao cadastrar profissional.');
    }

    alert('Profissional cadastrado com sucesso!');

    form.reset();

    carregarProfissionais();
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível cadastrar o profissional.');
  }
});

tabelaProfissionais.addEventListener('click', function (event) {
  const botao = event.target;

  if (botao.classList.contains('btn-editar')) {
    editarProfissional(botao);
  }

  if (botao.classList.contains('btn-excluir')) {
    excluirProfissional(botao);
  }
});

function editarProfissional(botao) {
  const idProfissional = botao.dataset.id;
  const idUsuario = botao.dataset.usuario;
  const idEspecialidade = botao.dataset.especialidade;
  const statusProfissional = botao.dataset.status;

  document.querySelector('#editar-id').value = idProfissional;

  editarUsuario.value = idUsuario;
  editarEspecialidade.value = idEspecialidade;
  editarStatus.value = statusProfissional;

  modalEdicao.style.display = 'flex';

  formEdicao.onsubmit = async function (event) {
    event.preventDefault();

    const novoIdUsuario = editarUsuario.value;

    const usuario = {
      id_usuario: novoIdUsuario,
    };

    try {
      const resposta = await fetch(`http://localhost:3000/api/usuarios/${idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });

      if (!resposta.ok) {
        throw new Error('Erro ao atualizar usuário.');
      }

      alert('Profissional atualizado com sucesso!');

      modalEdicao.style.display = 'none';

      carregarProfissionais();
    } catch (erro) {
      console.error(erro);
      alert('Não foi possível atualizar o usuário.');
    }
  };
}

btnCancelar.addEventListener('click', function () {
  modalEdicao.style.display = 'none';
});

modalEdicao.addEventListener('click', function (event) {
  if (event.target === modalEdicao) {
    modalEdicao.style.display = 'none';
  }
});

async function excluirProfissional(botao) {
  const idProfissional = botao.dataset.id;

  const confirmar = confirm('Deseja realmente excluir este profissional?');

  if (!confirmar) {
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:3000/api/profissionais/${idProfissional}`, {
      method: 'DELETE',
    });

    if (!resposta.ok) {
      throw new Error('Erro ao excluir profissional.');
    }

    alert('Profissional excluído com sucesso!');

    carregarProfissionais();
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível excluir o profissional.');
  }
}

carregarUsuarios();
carregarEspecialidades();
carregarProfissionais();
