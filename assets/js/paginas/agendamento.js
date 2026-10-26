const API = 'http://localhost:3000/api';

const selectPet = document.querySelector('#pet');
const selectServico = document.querySelector('#servico');
const selectProfissional = document.querySelector('#profissional');
const dataAgendamento = document.querySelector('#data-agendamento');
const listaHorarios = document.querySelector('#lista-horarios');
const mensagemHorarios = document.querySelector('#mensagem-horarios');
const mensagemData = document.querySelector('#mensagem-data');

// Dados da API
let servicos = [];
let profissionais = [];

// Carregar pets do usuário logado
async function carregarPets() {
  try {
    const usuarioSalvo = localStorage.getItem('usuario');

    if (!usuarioSalvo) {
      throw new Error('Usuário não encontrado.');
    }

    const usuario = JSON.parse(usuarioSalvo);

    const resposta = await fetch(`${API}/pets/usuario/${usuario.id_usuario}`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar pets.');
    }

    const pets = await resposta.json();

    selectPet.innerHTML = '';
    selectPet.add(new Option('Selecione o pet', ''));

    pets.forEach(function (pet) {
      selectPet.add(new Option(pet.nome, pet.id_pet));
    });

    if (pets.length === 0) {
      selectPet.innerHTML = '';
      selectPet.add(new Option('Nenhum pet cadastrado', ''));
      selectPet.disabled = true;
    }
  } catch (erro) {
    console.error('Erro ao carregar pets:', erro);

    selectPet.innerHTML = '';
    selectPet.add(new Option('Erro ao carregar pets', ''));
    selectPet.disabled = true;
  }
}

// Carregar serviços
async function carregarServicos() {
  try {
    const resposta = await fetch(`${API}/servicos`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar serviços.');
    }

    servicos = await resposta.json();

    selectServico.innerHTML = '';
    selectServico.add(new Option('Selecione o serviço', ''));

    servicos.forEach(function (servico) {
      selectServico.add(new Option(servico.nome, servico.id_servico));
    });
  } catch (erro) {
    console.error('Erro ao carregar serviços:', erro);
  }
}

// Carregar profissionais
async function carregarProfissionais() {
  try {
    const resposta = await fetch(`${API}/profissionais`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar profissionais.');
    }

    profissionais = await resposta.json();
  } catch (erro) {
    console.error('Erro ao carregar profissionais:', erro);
  }
}

// Filtrar profissionais pela especialidade do serviço
function atualizarProfissionais() {
  const idServico = selectServico.value;

  selectProfissional.innerHTML = '';
  selectProfissional.add(new Option('Selecione um profissional', ''));
  selectProfissional.disabled = true;

  const servico = servicos.find(function (item) {
    return Number(item.id_servico) === Number(idServico);
  });

  if (!servico || !servico.id_especialidade) {
    return;
  }

  const profissionaisFiltrados = profissionais.filter(function (profissional) {
    return (
      profissional.status === 'ATIVO' &&
      profissional.especialidades?.some(function (especialidade) {
        return Number(especialidade.id_especialidade) === Number(servico.id_especialidade);
      })
    );
  });

  if (profissionaisFiltrados.length === 0) {
    selectProfissional.innerHTML = '';
    selectProfissional.add(new Option('Nenhum profissional disponível', ''));
    return;
  }

  profissionaisFiltrados.forEach(function (profissional) {
    selectProfissional.add(new Option(profissional.usuario.nome, profissional.id_profissional));
  });

  selectProfissional.disabled = false;
}

function renderizarHorarios() {
  const listaHorarios = document.querySelector('#lista-horarios');
  const mensagemHorarios = document.querySelector('#mensagem-horarios');

  listaHorarios.innerHTML = '';

  mensagemHorarios.textContent = 'Selecione um horário disponível.';

  for (let hora = 8; hora < 18; hora++) {
    const horarioInicio = `${String(hora).padStart(2, '0')}:00`;
    const horarioFim = `${String(hora + 1).padStart(2, '0')}:00`;

    const horario = `${horarioInicio} - ${horarioFim}`;

    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td>${horario}</td>
      <td>Disponível</td>
      <td>
        <button
          type="button"
          class="horario"
          data-horario="${horarioInicio}"
        >
          Selecionar
        </button>
      </td>
    `;

    listaHorarios.appendChild(linha);
  }

  console.log('Horários renderizados:', listaHorarios.children.length);
}

// Eventos
selectServico.addEventListener('change', atualizarProfissionais);

// Inicializar página
async function inicializarPagina() {
  selectProfissional.disabled = true;

  await Promise.all(
    [carregarPets(), carregarServicos(), carregarProfissionais()],
    renderizarHorarios(),
  );
}

inicializarPagina();
