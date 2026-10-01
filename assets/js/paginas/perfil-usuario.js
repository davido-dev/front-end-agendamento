<<<<<<< HEAD
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
=======
const form = document.querySelector("form");
const telefoneInput = document.querySelector("#telefone");

// Carregar usuário

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  window.location.href = "login.html";
}

document.querySelector("#nome").value = usuario.nome;
document.querySelector("#cpf").value = usuario.cpf;
document.querySelector("#email").value = usuario.email;
document.querySelector("#telefone").value = usuario.telefone;

// Salvar alterações

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = document.querySelector("#nome").value;
  const email = document.querySelector("#email").value;
  const telefone = document.querySelector("#telefone").value;
  const senha = document.querySelector("#senha").value;
  const confirmarSenha = document.querySelector("#confirmarSenha").value;

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  const usuarioAtualizado = {
>>>>>>> 5cbecb0 (01-10-26)
    nome: nome,
    email: email,
    telefone: telefone,
  };

<<<<<<< HEAD
  if (senha !== '') {
    dadosAtualizados.senha = senha;
=======
  // Só envia a senha caso o usuário tenha digitado uma nova
  if (senha !== "") {
    usuarioAtualizado.senha = senha;
>>>>>>> 5cbecb0 (01-10-26)
  }

  try {
    const resposta = await fetch(`http://localhost:3000/api/usuarios/${usuario.id_usuario}`, {
<<<<<<< HEAD
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosAtualizados),
=======
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioAtualizado),
>>>>>>> 5cbecb0 (01-10-26)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro);
      return;
    }

<<<<<<< HEAD
    localStorage.setItem('usuario', JSON.stringify(dados));

    alert('Dados atualizados com sucesso!');

    document.querySelector('#senha').value = '';
    document.querySelector('#confirmeSenha').value = '';
  } catch (erro) {
    alert('Erro ao conectar com o servidor');
  }
});
=======
    // Atualiza os dados salvos no navegador
    const usuarioSalvo = {
      ...usuario,
      ...usuarioAtualizado,
    };

    localStorage.setItem("usuario", JSON.stringify(usuarioSalvo));

    alert("Perfil atualizado com sucesso!");

  } catch (erro) {
    console.error(erro);
    alert("Erro ao atualizar o perfil.");
  }
});

// Máscara do telefone

telefoneInput.addEventListener("input", function () {

  let telefone = telefoneInput.value;

  telefone = telefone.replace(/\D/g, "");

  telefone = telefone.replace(/(\d{2})(\d)/, "($1) $2");

  telefone = telefone.replace(/(\d{5})(\d)/, "$1-$2");

  telefoneInput.value = telefone;

});
>>>>>>> 5cbecb0 (01-10-26)
