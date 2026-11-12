const API = 'http://localhost:3000/api';

// Elementos do HTML
const formCadastroPet = document.querySelector('#form-cadastro-pet');
const btnCadastrarPet = document.querySelector('#btn-cadastrar-pet');

// ==========================================
// CADASTRAR PET
// ==========================================

async function cadastrarPet(event) {
  event.preventDefault();

  const usuarioSalvo = localStorage.getItem('usuario');

  if (!usuarioSalvo) {
    alert('Você precisa estar logado para cadastrar um pet.');
    return;
  }

  const usuario = JSON.parse(usuarioSalvo);

  const dadosPet = {
    nome: document.querySelector('#nome').value.trim(),
    tipo: document.querySelector('#tipo').value,
    raca: document.querySelector('#raca').value.trim(),
    idade: Number(document.querySelector('#idade').value),
    id_usuario: usuario.id_usuario,
  };

  if (
    !dadosPet.nome ||
    !dadosPet.tipo ||
    !dadosPet.raca ||
    dadosPet.idade === '' ||
    Number.isNaN(dadosPet.idade) ||
    dadosPet.idade < 0
  ) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  btnCadastrarPet.disabled = true;
  btnCadastrarPet.textContent = 'Cadastrando...';

  try {
    const resposta = await fetch(`${API}/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosPet),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro || 'Erro ao cadastrar pet.');
    }

    alert('Pet cadastrado com sucesso!');

    window.location.href = 'index.html';
  } catch (erro) {
    console.error('Erro ao cadastrar pet:', erro);
    alert(erro.message || 'Não foi possível cadastrar o pet.');

    btnCadastrarPet.disabled = false;
    btnCadastrarPet.textContent = 'Cadastrar Pet';
  }
}

formCadastroPet.addEventListener('submit', cadastrarPet);
