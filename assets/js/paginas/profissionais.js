const apiUrl = 'http://localhost:3000/api';

const formCadastro = document.querySelector('#form-cadastro');
const usuario = document.querySelector('#usuario');
const status = document.querySelector('#status');

const listaEspecialidades = document.querySelector('#lista-especialidades');
const tabelaProfissionais = document.querySelector('#tabela-profissionais');

const modalEdicao = document.querySelector('#modal-edicao');
const formEdicao = document.querySelector('#form-edicao');
const btnCancelar = document.querySelector('#btn-cancelar');

const editarId = document.querySelector('#editar-id');
const editarUsuario = document.querySelector('#editar-usuario');
const editarStatus = document.querySelector('#editar-status');
const editarListaEspecialidades = document.querySelector('#editar-lista-especialidades');

// Carregar usuários disponíveis para seleção
async function carregarUsuarios() {
  try {
    const resposta = await fetch(`${apiUrl}/usuarios`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar usuários.');
    }

    const usuarios = await resposta.json();

    const profissionais = usuarios.filter((usuarioItem) => usuarioItem.tipo === 'PROFISSIONAL');

    usuario.innerHTML = '<option value="">Selecione o profissional</option>';
    editarUsuario.innerHTML = '<option value="">Selecione o profissional</option>';

    profissionais.forEach((usuarioItem) => {
      const option = document.createElement('option');

      option.value = usuarioItem.id_usuario;
      option.textContent = usuarioItem.nome;
      usuario.appendChild(option);

      const optionEdicao = document.createElement('option');

      optionEdicao.value = usuarioItem.id_usuario;
      optionEdicao.textContent = usuarioItem.nome;
      editarUsuario.appendChild(optionEdicao);
    });
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível carregar os usuários.');
  }
}

// Criar as checkboxes de especialidades
function criarCheckboxes(container, especialidades, selecionadas = []) {
  container.innerHTML = '';

  if (especialidades.length === 0) {
    container.innerHTML = '<p>Nenhuma especialidade cadastrada.</p>';
    return;
  }

  especialidades.forEach((especialidade) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');

    checkbox.type = 'checkbox';
    checkbox.name = 'id_especialidades';
    checkbox.value = especialidade.id_especialidade;

    checkbox.checked = selecionadas.some(
      (id) => Number(id) === Number(especialidade.id_especialidade),
    );

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(especialidade.nome));

    container.appendChild(label);
  });
}

// Carregar todas as especialidades
async function carregarEspecialidades() {
  try {
    const resposta = await fetch(`${apiUrl}/especialidades`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar especialidades.');
    }

    const especialidades = await resposta.json();

    criarCheckboxes(listaEspecialidades, especialidades);
    criarCheckboxes(editarListaEspecialidades, especialidades);
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível carregar as especialidades.');
  }
}

// Obter IDs das especialidades selecionadas
function obterEspecialidadesSelecionadas(container) {
  return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map((checkbox) =>
    Number(checkbox.value),
  );
}

// Listar profissionais cadastrados
async function carregarProfissionais() {
  try {
    const resposta = await fetch(`${apiUrl}/profissionais`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar profissionais.');
    }

    const profissionais = await resposta.json();

    tabelaProfissionais.innerHTML = '';

    profissionais.forEach((profissional) => {
      const linha = document.createElement('tr');

      const nomeUsuario = profissional.usuario?.nome || 'Não informado';
      const emailUsuario = profissional.usuario?.email || 'Não informado';

      const nomesEspecialidades = profissional.especialidades?.length
        ? profissional.especialidades.map((especialidade) => especialidade.nome).join(', ')
        : 'Nenhuma especialidade';

      linha.innerHTML = `
        <td>${profissional.id_profissional}</td>
        <td>${nomeUsuario}</td>
        <td>${emailUsuario}</td>
        <td>${nomesEspecialidades}</td>
        <td>${profissional.status}</td>
        <td>
          <button
            type="button"
            class="btn-editar"
            data-id="${profissional.id_profissional}"
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

// Cadastrar profissional
formCadastro.addEventListener('submit', async (event) => {
  event.preventDefault();

  const idUsuario = Number(usuario.value);
  const idEspecialidades = obterEspecialidadesSelecionadas(listaEspecialidades);
  const statusProfissional = status.value;

  if (!idUsuario) {
    alert('Selecione um usuário.');
    return;
  }

  const profissional = {
    id_usuario: idUsuario,
    id_especialidades: idEspecialidades,
    status: statusProfissional,
  };

  try {
    const resposta = await fetch(`${apiUrl}/profissionais`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profissional),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || 'Erro ao cadastrar profissional.');
    }

    alert('Profissional cadastrado com sucesso!');

    formCadastro.reset();

    await carregarProfissionais();
  } catch (erro) {
    console.error(erro);
    alert(erro.message || 'Não foi possível cadastrar o profissional.');
  }
});

// Ações da tabela
tabelaProfissionais.addEventListener('click', (event) => {
  const botao = event.target;

  if (botao.classList.contains('btn-editar')) {
    editarProfissional(botao.dataset.id);
  }

  if (botao.classList.contains('btn-excluir')) {
    excluirProfissional(botao.dataset.id);
  }
});

// Buscar dados e abrir modal de edição
async function editarProfissional(idProfissional) {
  try {
    const resposta = await fetch(`${apiUrl}/profissionais/${idProfissional}`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar profissional.');
    }

    const profissional = await resposta.json();

    editarId.value = profissional.id_profissional;

    // O controller atual não permite alterar o usuário vinculado.
    editarUsuario.value = profissional.id_usuario;
    editarUsuario.disabled = true;

    editarStatus.value = profissional.status;

    const idsEspecialidades =
      profissional.especialidades?.map((especialidade) => especialidade.id_especialidade) || [];

    // Recria as checkboxes marcando as especialidades atuais.
    const respostaEspecialidades = await fetch(`${apiUrl}/especialidades`);

    if (!respostaEspecialidades.ok) {
      throw new Error('Erro ao carregar especialidades para edição.');
    }

    const especialidades = await respostaEspecialidades.json();

    criarCheckboxes(editarListaEspecialidades, especialidades, idsEspecialidades);

    modalEdicao.style.display = 'flex';
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível carregar os dados para edição.');
  }
}

// Atualizar status e especialidades
formEdicao.addEventListener('submit', async (event) => {
  event.preventDefault();

  const idProfissional = editarId.value;

  const profissionalAtualizado = {
    status: editarStatus.value,
    id_especialidades: obterEspecialidadesSelecionadas(editarListaEspecialidades),
  };

  try {
    const resposta = await fetch(`${apiUrl}/profissionais/${idProfissional}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profissionalAtualizado),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || 'Erro ao atualizar profissional.');
    }

    alert('Profissional atualizado com sucesso!');

    fecharModal();
    await carregarProfissionais();
  } catch (erro) {
    console.error(erro);
    alert(erro.message || 'Não foi possível atualizar o profissional.');
  }
});

// Fechar modal
function fecharModal() {
  modalEdicao.style.display = 'none';
  editarUsuario.disabled = false;
  formEdicao.reset();
}

btnCancelar.addEventListener('click', fecharModal);

modalEdicao.addEventListener('click', (event) => {
  if (event.target === modalEdicao) {
    fecharModal();
  }
});

// Excluir profissional
async function excluirProfissional(idProfissional) {
  const confirmar = confirm('Deseja realmente excluir este profissional?');

  if (!confirmar) {
    return;
  }

  try {
    const resposta = await fetch(`${apiUrl}/profissionais/${idProfissional}`, {
      method: 'DELETE',
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.erro || 'Erro ao excluir profissional.');
    }

    alert('Profissional excluído com sucesso!');

    await carregarProfissionais();
  } catch (erro) {
    console.error(erro);
    alert(erro.message || 'Não foi possível excluir o profissional.');
  }
}

// Inicialização da página
async function inicializarPagina() {
  await carregarUsuarios();
  await carregarEspecialidades();
  await carregarProfissionais();
}

inicializarPagina();
