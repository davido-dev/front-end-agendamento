const API = 'http://localhost:3000/api';

// Elementos do HTML
const filtroData = document.querySelector('#filtro-data');
const filtroStatus = document.querySelector('#filtro-status');
const tabelaAgendamentos = document.querySelector('#tabela-agendamentos');
const listaAgendamentos = document.querySelector('#lista-agendamentos');
const mensagemAgendamentos = document.querySelector('#mensagem-agendamentos');

// Usuário logado
const usuarioSalvo = localStorage.getItem('usuario');
const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

// Dados carregados da API
let agendamentos = [];

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', iniciarPagina);

async function iniciarPagina() {
  if (!usuario) {
    mensagemAgendamentos.textContent = 'Você precisa estar logado para ver seus agendamentos.';
    return;
  }

  await carregarAgendamentos();
}

// ==========================================
// CARREGAR AGENDAMENTOS DO USUÁRIO
// ==========================================

async function carregarAgendamentos() {
  mensagemAgendamentos.textContent = 'Carregando agendamentos...';

  try {
    const resposta = await fetch(`${API}/agendamentos/usuario/${usuario.id_usuario}`);

    if (!resposta.ok) {
      throw new Error('Erro ao carregar agendamentos.');
    }

    agendamentos = await resposta.json();

    renderizarAgendamentos();
  } catch (erro) {
    console.error('Erro ao carregar agendamentos:', erro);

    agendamentos = [];
    listaAgendamentos.innerHTML = '';
    tabelaAgendamentos.hidden = true;

    mensagemAgendamentos.textContent = 'Não foi possível carregar seus agendamentos.';
  }
}

// Atualiza a renderização quando os filtros mudam
filtroStatus.addEventListener('change', renderizarAgendamentos);
filtroData.addEventListener('change', renderizarAgendamentos);

// ==========================================
// APLICA OS FILTROS E RENDERIZA A TABELA
// ==========================================

function renderizarAgendamentos() {
  const statusSelecionado = filtroStatus.value;
  const dataSelecionada = filtroData.value;

  const agendamentosFiltrados = agendamentos.filter((agendamento) => {
    const correspondeStatus = !statusSelecionado || agendamento.status === statusSelecionado;

    const dataAgendamento = String(agendamento.data ?? '').slice(0, 10);
    const correspondeData = !dataSelecionada || dataAgendamento === dataSelecionada;

    return correspondeStatus && correspondeData;
  });

  listaAgendamentos.innerHTML = '';

  if (agendamentosFiltrados.length === 0) {
    tabelaAgendamentos.hidden = true;

    mensagemAgendamentos.textContent =
      'Nenhum agendamento encontrado para os filtros selecionados.';

    return;
  }

  agendamentosFiltrados.forEach((agendamento) => {
    listaAgendamentos.appendChild(criarLinhaAgendamento(agendamento));
  });

  tabelaAgendamentos.hidden = false;
  mensagemAgendamentos.textContent = `${agendamentosFiltrados.length} agendamento(s) encontrado(s).`;
}

// ==========================================
// CRIAR LINHA DA TABELA
// ==========================================

function criarLinhaAgendamento(agendamento) {
  const linha = document.createElement('tr');
  linha.dataset.id = agendamento.id_agendamento;

  const servico = agendamento.servico ?? agendamento.Servico ?? {};
  const profissional = agendamento.profissional ?? agendamento.Profissional ?? {};
  const pet = agendamento.pet ?? agendamento.Pet ?? {};

  const nomeProfissional = profissional.usuario?.nome ?? profissional.Usuario?.nome ?? '-';

  const valor = Number(servico.valor ?? agendamento.valor ?? 0);

  const data = String(agendamento.data ?? '').slice(0, 10);
  const dataFormatada = data ? data.split('-').reverse().join('/') : '-';

  const horario = String(agendamento.hora_inicio ?? '-').slice(0, 5);

  const status = agendamento.status ?? '';

  const classeStatus = {
    AGENDADO: 'status-agendado',
    CANCELADO: 'status-cancelado',
    CONCLUÍDO: 'status-concluido',
  };

  const criarCelula = (conteudo) => {
    const celula = document.createElement('td');
    celula.textContent = conteudo;
    return celula;
  };

  linha.appendChild(criarCelula(dataFormatada));
  linha.appendChild(criarCelula(horario));
  linha.appendChild(criarCelula(servico.nome ?? '-'));
  linha.appendChild(criarCelula(nomeProfissional));
  linha.appendChild(criarCelula(pet.nome ?? '-'));
  linha.appendChild(
    criarCelula(
      valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    ),
  );

  // Coluna de status
  const celulaStatus = document.createElement('td');
  const etiquetaStatus = document.createElement('span');

  etiquetaStatus.classList.add('status');

  if (classeStatus[status]) {
    etiquetaStatus.classList.add(classeStatus[status]);
  }

  etiquetaStatus.textContent = status || '-';

  celulaStatus.appendChild(etiquetaStatus);
  linha.appendChild(celulaStatus);

  // Coluna de ação
  const celulaAcao = document.createElement('td');

  if (status === 'AGENDADO') {
    const botaoCancelar = document.createElement('button');

    botaoCancelar.type = 'button';
    botaoCancelar.className = 'btn-cancelar-agendamento';
    botaoCancelar.textContent = 'Cancelar';
    botaoCancelar.dataset.id = agendamento.id_agendamento;

    celulaAcao.appendChild(botaoCancelar);
  } else {
    celulaAcao.textContent = '-';
    celulaAcao.classList.add('sem-acao');
  }

  linha.appendChild(celulaAcao);

  return linha;
}

// ==========================================
// CANCELAR AGENDAMENTO
// ==========================================

listaAgendamentos.addEventListener('click', async (evento) => {
  const botao = evento.target.closest('.btn-cancelar-agendamento');

  if (!botao) {
    return;
  }

  const idAgendamento = botao.dataset.id;

  const confirmou = confirm('Tem certeza que deseja cancelar este agendamento?');

  if (!confirmou) {
    return;
  }

  botao.disabled = true;
  botao.textContent = 'Cancelando...';

  try {
    const resposta = await fetch(`${API}/agendamentos/${idAgendamento}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'CANCELADO' }),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || 'Erro ao cancelar agendamento.');
    }

    // Atualiza o status localmente e re-renderiza sem nova requisição
    const agendamento = agendamentos.find((item) => String(item.id_agendamento) === idAgendamento);

    if (agendamento) {
      agendamento.status = 'CANCELADO';
    }

    renderizarAgendamentos();
  } catch (erro) {
    console.error('Erro ao cancelar agendamento:', erro);
    alert(erro.message || 'Não foi possível cancelar o agendamento.');

    botao.disabled = false;
    botao.textContent = 'Cancelar';
  }
});
