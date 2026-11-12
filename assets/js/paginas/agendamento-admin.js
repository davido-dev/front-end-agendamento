const API = 'http://localhost:3000/api';

// Elementos HTML
const filtroProfissional = document.querySelector('#filtro-profissional');
const filtroData = document.querySelector('#filtro-data');
const filtroStatus = document.querySelector('#filtro-status');
const tabelaAgendamentos = document.querySelector('#tabela-agendamentos');
const listaAgendamentos = document.querySelector('#lista-agendamentos');
const mensagemAgendamentos = document.querySelector('#mensagem-agendamentos');

// Elementos do modal
const modalEdicao = document.querySelector('#modal-edicao');
const btnFecharModal = document.querySelector('#btn-fechar-modal');
const btnCancelar = document.querySelector('#btn-cancelar');
const formEdicao = document.querySelector('#form-edicao');
const inputIdAgendamento = document.querySelector('#id-agendamento');
const selectStatusModal = document.querySelector('#status-agendamento');

let agendamentosFiltrados = []; // guarda a última lista renderizada

// Dados carregados da API
let profissionais = [];
let agendamentos = [];

// Inicialização
document.addEventListener('DOMContentLoaded', iniciarPagina);

async function iniciarPagina() {
  await carregarProfissionais();
}

// Carrega a lista de profissionais
async function carregarProfissionais() {
  try {
    const resposta = await fetch(`${API}/profissionais`);

    if (!resposta.ok) {
      throw new Error('Erro ao carregar profissionais.');
    }

    profissionais = await resposta.json();

    profissionais.forEach((profissional) => {
      const option = document.createElement('option');

      option.value = profissional.id_profissional;
      option.textContent =
        profissional.usuario?.nome ??
        profissional.Usuario?.nome ??
        `Profissional ${profissional.id_profissional}`;

      filtroProfissional.appendChild(option);
    });
  } catch (erro) {
    console.error('Erro ao carregar profissionais:', erro);
    mensagemAgendamentos.textContent = 'Não foi possível carregar a lista de profissionais.';
  }
}

// Quando o profissional é alterado
filtroProfissional.addEventListener('change', async () => {
  const idProfissional = filtroProfissional.value;

  agendamentos = [];
  listaAgendamentos.innerHTML = '';
  tabelaAgendamentos.hidden = true;

  filtroData.value = '';
  filtroStatus.value = '';
  filtroStatus.disabled = true;

  if (!idProfissional) {
    mensagemAgendamentos.textContent = 'Selecione um profissional para consultar os agendamentos.';
    return;
  }

  mensagemAgendamentos.textContent = 'Carregando agendamentos...';

  await carregarAgendamentos(idProfissional);
});

// Carrega os agendamentos do profissional
async function carregarAgendamentos(idProfissional) {
  try {
    const resposta = await fetch(`${API}/agendamentos/profissional/${idProfissional}`);

    if (!resposta.ok) {
      throw new Error('Erro ao carregar agendamentos.');
    }

    agendamentos = await resposta.json();

    console.log(agendamentos);

    filtroStatus.disabled = false;

    renderizarAgendamentos();
  } catch (erro) {
    console.error('Erro ao carregar agendamentos:', erro);

    agendamentos = [];
    listaAgendamentos.innerHTML = '';
    tabelaAgendamentos.hidden = true;

    mensagemAgendamentos.textContent =
      'Não foi possível carregar os agendamentos deste profissional.';
  }
}

// Atualiza a renderização quando os filtros mudam
filtroStatus.addEventListener('change', renderizarAgendamentos);
filtroData.addEventListener('change', renderizarAgendamentos);

// Aplica os filtros e renderiza os agendamentos
function renderizarAgendamentos() {
  const statusSelecionado = filtroStatus.value;
  const dataSelecionada = filtroData.value;

  agendamentosFiltrados = agendamentos.filter((agendamento) => {
    const correspondeStatus = !statusSelecionado || agendamento.status === statusSelecionado;

    // Considera a data no formato YYYY-MM-DD retornado pela API
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
    const linha = document.createElement('tr');
    linha.dataset.id = agendamento.id_agendamento;

    const servico = agendamento.servico ?? agendamento.Servico ?? {};

    const cliente = agendamento.usuario ?? agendamento.Usuario ?? {};

    const pet = agendamento.pet ?? agendamento.Pet ?? {};

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
    linha.appendChild(criarCelula(cliente.nome ?? '-'));
    linha.appendChild(criarCelula(pet.nome ?? '-'));
    linha.appendChild(
      criarCelula(
        valor.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      ),
    );

    const celulaStatus = document.createElement('td');
    const etiquetaStatus = document.createElement('span');

    etiquetaStatus.classList.add('status');

    if (classeStatus[status]) {
      etiquetaStatus.classList.add(classeStatus[status]);
    }

    etiquetaStatus.textContent = status || '-';

    celulaStatus.appendChild(etiquetaStatus);
    linha.appendChild(celulaStatus);

    listaAgendamentos.appendChild(linha);
  });

  tabelaAgendamentos.hidden = false;
  mensagemAgendamentos.textContent = `${agendamentosFiltrados.length} agendamento(s) encontrado(s).`;
}

// Abre o modal ao clicar numa linha
listaAgendamentos.addEventListener('click', (evento) => {
  const linha = evento.target.closest('tr');
  if (!linha) return;

  const idAgendamento = linha.dataset.id;
  const agendamento = agendamentosFiltrados.find((a) => String(a.id_agendamento) === idAgendamento);

  if (agendamento) abrirModal(agendamento);
});

function abrirModal(agendamento) {
  const servico = agendamento.servico ?? agendamento.Servico ?? {};
  const cliente = agendamento.usuario ?? agendamento.Usuario ?? {};
  const pet = agendamento.pet ?? agendamento.Pet ?? {};
  const valor = Number(servico.valor ?? agendamento.valor ?? 0);

  const data = String(agendamento.data ?? '').slice(0, 10);
  const dataFormatada = data ? data.split('-').reverse().join('/') : '-';

  document.querySelector('#modal-data').textContent = dataFormatada;
  document.querySelector('#modal-horario').textContent = String(
    agendamento.hora_inicio ?? '-',
  ).slice(0, 5);
  document.querySelector('#modal-servico').textContent = servico.nome ?? '-';
  document.querySelector('#modal-cliente').textContent = cliente.nome ?? '-';
  document.querySelector('#modal-pet').textContent = pet.nome ?? '-';
  document.querySelector('#modal-valor').textContent = valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  document.querySelector('#modal-observacoes').textContent = agendamento.observacoes ?? '-';

  inputIdAgendamento.value = agendamento.id_agendamento;
  selectStatusModal.value = agendamento.status;

  modalEdicao.hidden = false;
}

function fecharModal() {
  modalEdicao.hidden = true;
  formEdicao.reset();
}

btnFecharModal.addEventListener('click', fecharModal);
btnCancelar.addEventListener('click', fecharModal);

// Salvar alteração de status
formEdicao.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = inputIdAgendamento.value;
  const novoStatus = selectStatusModal.value;
  const btnSalvar = document.querySelector('#btn-salvar');

  btnSalvar.disabled = true;

  try {
    const resposta = await fetch(`${API}/agendamentos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus }),
    });

    if (!resposta.ok) throw new Error('Erro ao atualizar agendamento.');

    // Atualiza localmente e re-renderiza sem nova requisição
    const agendamento = agendamentos.find((a) => String(a.id_agendamento) === id);
    if (agendamento) agendamento.status = novoStatus;

    alert("Agendamento atualizado com sucesso!")

    renderizarAgendamentos();
    fecharModal();
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível salvar a alteração.');
  } finally {
    btnSalvar.disabled = false;
  }
});
