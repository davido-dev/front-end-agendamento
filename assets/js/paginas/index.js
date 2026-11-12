const API = 'http://localhost:3000/api';

// Elementos do HTML
const saudacaoUsuario = document.querySelector('#saudacao-usuario');

const mensagemPets = document.querySelector('#mensagem-pets');
const listaPets = document.querySelector('#lista-pets');

const mensagemProximos = document.querySelector('#mensagem-proximos');
const listaProximos = document.querySelector('#lista-proximos');

const mensagemRecentes = document.querySelector('#mensagem-recentes');
const listaRecentes = document.querySelector('#lista-recentes');

const mensagemServicos = document.querySelector('#mensagem-servicos');
const listaServicos = document.querySelector('#lista-servicos');

// Usuário logado
const usuarioSalvo = localStorage.getItem('usuario');
const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

// ==========================================
// SAUDAÇÃO
// ==========================================

function exibirSaudacao() {
  saudacaoUsuario.textContent = usuario?.nome ? `Olá, ${usuario.nome}!` : 'Olá!';
}

// ==========================================
// PETS
// ==========================================

async function carregarPets() {
  if (!usuario) {
    mensagemPets.textContent = 'Faça login para ver seus pets.';
    return;
  }

  try {
    const resposta = await fetch(`${API}/pets/usuario/${usuario.id_usuario}`);

    if (!resposta.ok) {
      throw new Error('Erro ao carregar pets.');
    }

    const pets = await resposta.json();

    if (pets.length === 0) {
      mensagemPets.textContent = 'Você ainda não tem pets cadastrados.';
      return;
    }

    listaPets.innerHTML = '';

    pets.forEach((pet) => {
      const card = document.createElement('div');
      card.className = 'pet-card';

      const nome = document.createElement('p');
      nome.className = 'pet-nome';
      nome.textContent = pet.nome;

      const info = document.createElement('p');
      info.className = 'pet-info';
      info.textContent = `${pet.tipo} · ${pet.raca} · ${pet.idade} ano(s)`;

      card.appendChild(nome);
      card.appendChild(info);

      listaPets.appendChild(card);
    });

    mensagemPets.hidden = true;
    listaPets.hidden = false;
  } catch (erro) {
    console.error('Erro ao carregar pets:', erro);
    mensagemPets.textContent = 'Não foi possível carregar seus pets.';
  }
}

// ==========================================
// AGENDAMENTOS (próximos e recentes)
// ==========================================

function criarClasseStatus(status) {
  const classes = {
    AGENDADO: 'status-agendado',
    CANCELADO: 'status-cancelado',
    CONCLUÍDO: 'status-concluido',
  };

  return classes[status] ?? '';
}

function criarItemAgendamento(agendamento) {
  const servico = agendamento.servico ?? agendamento.Servico ?? {};
  const pet = agendamento.pet ?? agendamento.Pet ?? {};

  const data = String(agendamento.data ?? '').slice(0, 10);
  const dataFormatada = data ? data.split('-').reverse().join('/') : '-';
  const horario = String(agendamento.hora_inicio ?? '-').slice(0, 5);
  const status = agendamento.status ?? '';

  const item = document.createElement('li');
  item.className = 'item-agendamento';

  const infoPrincipal = document.createElement('div');
  infoPrincipal.className = 'info-principal';

  const titulo = document.createElement('strong');
  titulo.textContent = servico.nome ?? 'Serviço';

  const detalhe = document.createElement('span');
  detalhe.className = 'info-secundaria';
  detalhe.textContent = `${pet.nome ?? '-'} · ${dataFormatada} às ${horario}`;

  infoPrincipal.appendChild(titulo);
  infoPrincipal.appendChild(detalhe);

  const etiquetaStatus = document.createElement('span');
  etiquetaStatus.className = 'status';

  const classeStatus = criarClasseStatus(status);
  if (classeStatus) {
    etiquetaStatus.classList.add(classeStatus);
  }

  etiquetaStatus.textContent = status || '-';

  item.appendChild(infoPrincipal);
  item.appendChild(etiquetaStatus);

  return item;
}

async function carregarAgendamentos() {
  if (!usuario) {
    mensagemProximos.textContent = 'Faça login para ver seus agendamentos.';
    mensagemRecentes.textContent = 'Faça login para ver seus agendamentos.';
    return;
  }

  try {
    const resposta = await fetch(`${API}/agendamentos/usuario/${usuario.id_usuario}`);

    if (!resposta.ok) {
      throw new Error('Erro ao carregar agendamentos.');
    }

    const agendamentos = await resposta.json();

    const hoje = new Date().toISOString().slice(0, 10);

    const proximos = agendamentos
      .filter((agendamento) => String(agendamento.data ?? '').slice(0, 10) >= hoje)
      .sort((a, b) => String(a.data).localeCompare(String(b.data)))
      .slice(0, 3);

    const recentes = agendamentos
      .filter((agendamento) => String(agendamento.data ?? '').slice(0, 10) < hoje)
      .sort((a, b) => String(b.data).localeCompare(String(a.data)))
      .slice(0, 3);

    // Próximos
    if (proximos.length === 0) {
      mensagemProximos.textContent = 'Você não tem agendamentos futuros.';
    } else {
      listaProximos.innerHTML = '';
      proximos.forEach((agendamento) => {
        listaProximos.appendChild(criarItemAgendamento(agendamento));
      });

      mensagemProximos.hidden = true;
      listaProximos.hidden = false;
    }

    // Recentes
    if (recentes.length === 0) {
      mensagemRecentes.textContent = 'Você ainda não tem agendamentos anteriores.';
    } else {
      listaRecentes.innerHTML = '';
      recentes.forEach((agendamento) => {
        listaRecentes.appendChild(criarItemAgendamento(agendamento));
      });

      mensagemRecentes.hidden = true;
      listaRecentes.hidden = false;
    }
  } catch (erro) {
    console.error('Erro ao carregar agendamentos:', erro);

    mensagemProximos.textContent = 'Não foi possível carregar seus agendamentos.';
    mensagemRecentes.textContent = 'Não foi possível carregar seus agendamentos.';
  }
}

// ==========================================
// SERVIÇOS
// ==========================================

async function carregarServicos() {
  try {
    const resposta = await fetch(`${API}/servicos`);

    if (!resposta.ok) {
      throw new Error('Erro ao carregar serviços.');
    }

    const servicos = await resposta.json();

    if (servicos.length === 0) {
      mensagemServicos.textContent = 'Nenhum serviço disponível no momento.';
      return;
    }

    listaServicos.innerHTML = '';

    servicos.forEach((servico) => {
      const card = document.createElement('div');
      card.className = 'servico-card';

      const nome = document.createElement('p');
      nome.className = 'servico-nome';
      nome.textContent = servico.nome;

      const valor = document.createElement('p');
      valor.className = 'servico-valor';
      valor.textContent = Number(servico.valor ?? 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      card.appendChild(nome);
      card.appendChild(valor);

      listaServicos.appendChild(card);
    });

    mensagemServicos.hidden = true;
    listaServicos.hidden = false;
  } catch (erro) {
    console.error('Erro ao carregar serviços:', erro);
    mensagemServicos.textContent = 'Não foi possível carregar os serviços.';
  }
}

// ==========================================
// INICIALIZAR PÁGINA
// ==========================================

function inicializarPagina() {
  exibirSaudacao();
  carregarPets();
  carregarAgendamentos();
  carregarServicos();
}

inicializarPagina();
