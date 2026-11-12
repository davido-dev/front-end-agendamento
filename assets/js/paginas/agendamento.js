const API = 'http://localhost:3000/api';

// Elementos do HTML
const selectPet = document.querySelector('#pet');
const selectServico = document.querySelector('#servico');
const selectProfissional = document.querySelector('#profissional');
const dataAgendamento = document.querySelector('#data-agendamento');
const listaHorarios = document.querySelector('#lista-horarios');
const mensagemHorarios = document.querySelector('#mensagem-horarios');
const mensagemData = document.querySelector('#mensagem-data');

const resumoPet = document.querySelector('#resumo-pet');
const resumoServico = document.querySelector('#resumo-servico');
const resumoProfissional = document.querySelector('#resumo-profissional');
const resumoData = document.querySelector('#resumo-data');
const resumoHorario = document.querySelector('#resumo-horario');
const btnAgendar = document.querySelector('#btn-agendar');

// Dados carregados da API
let servicos = [];
let profissionais = [];
let horarioSelecionado = '';

// ==========================================
// CARREGAR PETS DO USUÁRIO LOGADO
// ==========================================

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

    selectPet.disabled = pets.length === 0;

    if (pets.length === 0) {
      selectPet.innerHTML = '';
      selectPet.add(new Option('Nenhum pet cadastrado', ''));
    }
  } catch (erro) {
    console.error('Erro ao carregar pets:', erro);

    selectPet.innerHTML = '';
    selectPet.add(new Option('Erro ao carregar pets', ''));
    selectPet.disabled = true;
  }
}

// ==========================================
// CARREGAR SERVIÇOS
// ==========================================

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

    selectServico.innerHTML = '';
    selectServico.add(new Option('Erro ao carregar serviços', ''));
    selectServico.disabled = true;
  }
}

// ==========================================
// CARREGAR PROFISSIONAIS
// ==========================================

async function carregarProfissionais() {
  try {
    const resposta = await fetch(`${API}/profissionais`);

    if (!resposta.ok) {
      throw new Error('Erro ao buscar profissionais.');
    }

    profissionais = await resposta.json();
  } catch (erro) {
    console.error('Erro ao carregar profissionais:', erro);
    profissionais = [];
  }
}

// ==========================================
// FILTRAR PROFISSIONAIS PELA ESPECIALIDADE
// ==========================================

function atualizarProfissionais() {
  const idServico = selectServico.value;

  // Limpa o profissional e o horário selecionado
  selectProfissional.innerHTML = '';
  selectProfissional.add(new Option('Selecione um profissional', ''));
  selectProfissional.disabled = true;

  limparHorarioSelecionado();

  listaHorarios.innerHTML = '';
  mensagemHorarios.textContent = 'Selecione um serviço, um profissional e uma data.';

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

// ==========================================
// CONVERTER HORÁRIOS
// ==========================================

function formatarHora(minutos) {
  const horas = Math.floor(minutos / 60);
  const restante = minutos % 60;

  return String(horas).padStart(2, '0') + ':' + String(restante).padStart(2, '0');
}

function converterHoraParaMinutos(hora) {
  const partes = hora.split(':');
  const horas = Number(partes[0]);
  const minutos = Number(partes[1]);

  return horas * 60 + minutos;
}

// ==========================================
// LIMPAR HORÁRIO SELECIONADO
// ==========================================

function limparHorarioSelecionado() {
  horarioSelecionado = '';

  // Atualiza o campo oculto, caso exista no HTML
  const campoHora = document.querySelector('#hora_inicio');

  if (campoHora) {
    campoHora.value = '';
    atualizarResumo();
  }
}

// ==========================================
// CONSULTAR A API E RENDERIZAR HORÁRIOS
// ==========================================

async function renderizarHorarios() {
  listaHorarios.innerHTML = '';
  limparHorarioSelecionado();
  atualizarResumo();

  const idProfissional = selectProfissional.value;
  const data = dataAgendamento.value;
  const idServico = selectServico.value;

  if (!idServico || !idProfissional || !data) {
    mensagemHorarios.textContent = 'Selecione o serviço, o profissional e a data.';
    return;
  }

  const servico = servicos.find(function (item) {
    return Number(item.id_servico) === Number(idServico);
  });

  const duracao = Number(servico?.duracao_minutos);

  if (!duracao || duracao <= 0) {
    mensagemHorarios.textContent = 'Não foi possível identificar a duração do serviço.';
    return;
  }

  mensagemHorarios.textContent = 'Consultando horários disponíveis...';

  try {
    const resposta = await fetch(`${API}/agendamentos/profissional/${idProfissional}/data/${data}`);

    if (!resposta.ok) {
      throw new Error('Erro ao consultar agendamentos.');
    }

    const agendamentos = await resposta.json();

    // Identifica os horários ocupados pelo profissional
    const ocupados = agendamentos
      .filter(function (agendamento) {
        const status = String(agendamento.status || '').toUpperCase();

        return !['CANCELADO', 'CANCELADA', 'CANCELADO'.toLowerCase()].includes(status);
      })
      .map(function (agendamento) {
        const inicio = converterHoraParaMinutos(agendamento.hora_inicio);

        const servicoAgendado = servicos.find(function (item) {
          return Number(item.id_servico) === Number(agendamento.id_servico);
        });

        const duracaoAgendada = Number(
          agendamento.servico?.duracao_minutos ?? servicoAgendado?.duracao_minutos ?? 60,
        );

        return {
          inicio: inicio,
          fim: inicio + duracaoAgendada,
        };
      });

    let quantidadeDisponivel = 0;

    // Gera opções das 08h às 18h
    // O serviço precisa terminar até as 18h
    for (let inicio = 8 * 60; inicio + duracao <= 18 * 60; inicio += 60) {
      const fim = inicio + duracao;

      // Verifica se existe sobreposição com outro agendamento
      const conflito = ocupados.some(function (agendamento) {
        return inicio < agendamento.fim && fim > agendamento.inicio;
      });

      const horarioInicio = formatarHora(inicio);
      const horarioFim = formatarHora(fim);
      const horario = `${horarioInicio} - ${horarioFim}`;

      const linha = document.createElement('tr');

      const colunaHorario = document.createElement('td');
      colunaHorario.textContent = horario;

      const colunaStatus = document.createElement('td');
      colunaStatus.textContent = conflito ? 'Ocupado' : 'Disponível';

      const colunaAcao = document.createElement('td');

      if (conflito) {
        colunaAcao.textContent = '-';
      } else {
        const botao = document.createElement('button');

        botao.type = 'button';
        botao.className = 'horario';
        botao.dataset.horario = horarioInicio;
        botao.textContent = 'Selecionar';

        colunaAcao.appendChild(botao);
        quantidadeDisponivel++;
      }

      linha.appendChild(colunaHorario);
      linha.appendChild(colunaStatus);
      linha.appendChild(colunaAcao);

      listaHorarios.appendChild(linha);
    }

    mensagemHorarios.textContent =
      quantidadeDisponivel > 0
        ? 'Selecione um horário disponível.'
        : 'Não há horários disponíveis para esta data.';
  } catch (erro) {
    console.error('Erro ao carregar horários:', erro);

    listaHorarios.innerHTML = '';

    mensagemHorarios.textContent = 'Não foi possível consultar os horários. Tente novamente.';
  }
}

// Atualizar resumo e verificar se pode confirmar
function atualizarResumo() {
  resumoPet.textContent = selectPet.value
    ? selectPet.selectedOptions[0].textContent
    : 'Não selecionado';

  resumoServico.textContent = selectServico.value
    ? selectServico.selectedOptions[0].textContent
    : 'Não selecionado';

  resumoProfissional.textContent = selectProfissional.value
    ? selectProfissional.selectedOptions[0].textContent
    : 'Não selecionado';

  resumoData.textContent = dataAgendamento.value
    ? dataAgendamento.value.split('-').reverse().join('/')
    : 'Não selecionada';

  resumoHorario.textContent = horarioSelecionado || 'Não selecionado';

  // Só permite confirmar quando todos os dados estiverem preenchidos
  btnAgendar.disabled = !(
    selectPet.value &&
    selectServico.value &&
    selectProfissional.value &&
    dataAgendamento.value &&
    horarioSelecionado
  );
}

async function criarAgendamento(event) {
  event.preventDefault();

  const usuarioSalvo = localStorage.getItem('usuario');

  if (!usuarioSalvo) {
    alert('Você precisa estar logado para realizar um agendamento.');
    return;
  }

  const usuario = JSON.parse(usuarioSalvo);

  const dadosAgendamento = {
    data: dataAgendamento.value,
    hora_inicio: horarioSelecionado,
    status: 'AGENDADO',
    observacoes: document.querySelector('#observacoes').value,
    id_usuario: usuario.id_usuario,
    id_profissional: selectProfissional.value,
    id_servico: selectServico.value,
    id_pet: selectPet.value,
  };

  if (
    !dadosAgendamento.data ||
    !dadosAgendamento.hora_inicio ||
    !dadosAgendamento.id_usuario ||
    !dadosAgendamento.id_profissional ||
    !dadosAgendamento.id_servico ||
    !dadosAgendamento.id_pet
  ) {
    alert('Preencha todos os campos obrigatórios e selecione um horário.');
    return;
  }

  btnAgendar.disabled = true;
  btnAgendar.textContent = 'Agendando...';

  try {
    const resposta = await fetch(`${API}/agendamentos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosAgendamento),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || 'Erro ao criar agendamento.');
    }

    // Pega o id do agendamento recém-criado
    const idAgendamento = resultado.id_agendamento;

    // Redireciona para a tela de pagamento, levando o id na URL
    window.location.href = `pagamento.html?id_agendamento=${idAgendamento}`;
  } catch (erro) {
    console.error('Erro ao criar agendamento:', erro);
    alert(erro.message || 'Não foi possível realizar o agendamento.');

    btnAgendar.disabled = false;
    btnAgendar.textContent = 'Confirmar agendamento';
  }
}

listaHorarios.addEventListener('click', function (event) {
  const botao = event.target.closest('button.horario');

  if (!botao) {
    return;
  }

  // Guarda o horário selecionado
  horarioSelecionado = botao.dataset.horario;

  // Preenche o campo oculto do formulário
  document.querySelector('#hora_inicio').value = horarioSelecionado;

  // Remove a seleção anterior
  listaHorarios.querySelectorAll('.horario').forEach(function (botaoHorario) {
    botaoHorario.classList.remove('selecionado');
    botaoHorario.textContent = 'Selecionar';
  });

  // Marca visualmente o horário escolhido
  botao.classList.add('selecionado');
  botao.textContent = 'Selecionado';

  // Atualiza o resumo e libera a confirmação, se os outros campos estiverem preenchidos
  atualizarResumo();

  mensagemHorarios.textContent = `Horário selecionado: ${horarioSelecionado}`;
});

selectPet.addEventListener('change', atualizarResumo);

selectServico.addEventListener('change', function () {
  atualizarProfissionais();
  atualizarResumo();
  renderizarHorarios();
});

selectProfissional.addEventListener('change', function () {
  atualizarResumo();
  renderizarHorarios();
});

dataAgendamento.addEventListener('change', function () {
  atualizarResumo();
  renderizarHorarios();
});

document.querySelector('#form-agendamento').addEventListener('submit', criarAgendamento);

// ==========================================
// INICIALIZAR PÁGINA
// ==========================================

async function inicializarPagina() {
  selectProfissional.disabled = true;

  await Promise.all([carregarPets(), carregarServicos(), carregarProfissionais()]);

  atualizarProfissionais();
  await renderizarHorarios();
  atualizarResumo();
}

inicializarPagina();
