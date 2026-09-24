const form = document.querySelector('form');

const usuarioSalvo = localStorage.getItem('usuario');

if (!usuarioSalvo) {
  alert('Usuário não está logado.');
  window.location.href = 'login.html';
}

const usuario = JSON.parse(usuarioSalvo);

document.querySelector('#nome').value = usuario.nome;
document.querySelector('#cpf').value = usuario.cpf;
document.querySelector('#email').value = usuario.email;
document.querySelector('#telefone').value = usuario.telefone || '';

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const nome = document.querySelector('#nome').value;
  const email = document.querySelector('#email').value;
  const telefone = document.querySelector('#telefone').value;
  const senha = document.querySelector('#senha').value;
  const confirmeSenha = document.querySelector('#confirmeSenha').value;

  if (senha !== confirmeSenha) {
    alert('As senhas não são iguais');
    return;
  }

  const dadosAtualizados = {
    nome: nome,
    email: email,
    telefone: telefone,
  };

  if (senha !== '') {
    dadosAtualizados.senha = senha;
  }

  try {
    const resposta = await fetch(`http://localhost:3000/api/usuarios/${usuario.id_usuario}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosAtualizados),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro);
      return;
    }

    localStorage.setItem('usuario', JSON.stringify(dados));

    alert('Dados atualizados com sucesso!');

    document.querySelector('#senha').value = '';
    document.querySelector('#confirmeSenha').value = '';
  } catch (erro) {
    alert('Erro ao conectar com o servidor');
  }
});
