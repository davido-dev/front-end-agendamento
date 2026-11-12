const API = 'http://localhost:3000/api';

// Elementos do HTML
const mensagemPagamento = document.querySelector('#mensagem-pagamento');
const resumoAgendamento = document.querySelector('#resumo-agendamento');
const formPagamento = document.querySelector('#form-pagamento');
const btnPagar = document.querySelector('#btn-pagar');
const confirmacaoPagamento = document.querySelector('#confirmacao-pagamento');

// Pega o id do agendamento pela URL (?id_agendamento=X)
const parametros = new URLSearchParams(window.location.search);
const idAgendamento = parametros.get('id_agendamento');

// Dados carregados da API
let agendamentoAtual = null;

// ==========================================
// CARREGAR DADOS DO AGENDAMENTO
// ==========================================

async function carregarAgendamento() {
  if (!idAgendamento) {
    mensagemPagamento.textContent = 'Nenhum agendamento informado.';
    return;
  }

  try {
    const resposta = await fetch(`${API}/agendamentos/${idAgendamento}`);

    if (!resposta.ok) {
      throw new Error('Erro ao carregar agendamento.');
    }

    agendamentoAtual = await resposta.json();

    exibirResumo(agendamentoAtual);
  } catch (erro) {
    console.error('Erro ao carregar agendamento:', erro);
    mensagemPagamento.textContent = 'Não foi possível carregar os dados do agendamento.';
  }
}

// ==========================================
// EXIBIR RESUMO DO AGENDAMENTO
// ==========================================

function exibirResumo(agendamento) {
  const servico = agendamento.servico ?? agendamento.Servico ?? {};
  const pet = agendamento.pet ?? agendamento.Pet ?? {};
  const profissional = agendamento.profissional ?? agendamento.Profissional ?? {};
  const nomeProfissional =
    profissional.usuario?.nome ?? profissional.Usuario?.nome ?? '-';

  const valor = Number(servico.valor ?? agendamento.valor ?? 0);

  const data = String(agendamento.data ?? '').slice(0, 10);
  const dataFormatada = data ? data.split('-').reverse().join('/') : '-';

  const horario = String(agendamento.hora_inicio ?? '-').slice(0, 5);

  document.querySelector('#resumo-servico').textContent = servico.nome ?? '-';
  document.querySelector('#resumo-pet').textContent = pet.nome ?? '-';
  document.querySelector('#resumo-profissional').textContent = nomeProfissional;
  document.querySelector('#resumo-data').textContent = dataFormatada;
  document.querySelector('#resumo-horario').textContent = horario;
  document.querySelector('#resumo-valor').textContent = valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  mensagemPagamento.hidden = true;
  resumoAgendamento.hidden = false;
  formPagamento.hidden = false;
}

// ==========================================
// CONFIRMAR PAGAMENTO
// ==========================================

async function confirmarPagamento(event) {
  event.preventDefault();

  const formaPagamento = formPagamento.querySelector(
    'input[name="forma_pagamento"]:checked',
  )?.value;

  if (!formaPagamento) {
    alert('Selecione uma forma de pagamento.');
    return;
  }

  if (!agendamentoAtual) {
    alert('Dados do agendamento não carregados.');
    return;
  }

  const servico = agendamentoAtual.servico ?? agendamentoAtual.Servico ?? {};
  const valor = Number(servico.valor ?? agendamentoAtual.valor ?? 0);

  const dadosPagamento = {
    valor,
    forma_pagamento: formaPagamento,
    status: 'PAGO',
    id_agendamento: Number(idAgendamento),
  };

  btnPagar.disabled = true;
  btnPagar.textContent = 'Processando...';

  try {
    const resposta = await fetch(`${API}/pagamentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosPagamento),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || 'Erro ao registrar pagamento.');
    }

    formPagamento.hidden = true;
    resumoAgendamento.hidden = true;
    confirmacaoPagamento.hidden = false;
  } catch (erro) {
    console.error('Erro ao confirmar pagamento:', erro);
    alert(erro.message || 'Não foi possível confirmar o pagamento.');

    btnPagar.disabled = false;
    btnPagar.textContent = 'Confirmar pagamento';
  }
}

formPagamento.addEventListener('submit', confirmarPagamento);

// ==========================================
// INICIALIZAR PÁGINA
// ==========================================

carregarAgendamento();
