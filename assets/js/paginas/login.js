<<<<<<< HEAD
const form = document.querySelector('form');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const senha = document.querySelector('#senha').value;
=======
const form = document.querySelector("form");

// Login do usuário

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const senha = document.querySelector("#senha").value;
>>>>>>> 5cbecb0 (01-10-26)

  const usuario = {
    email: email,
    senha: senha,
  };

  try {
<<<<<<< HEAD
    const resposta = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
=======
    const resposta = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
>>>>>>> 5cbecb0 (01-10-26)
      },
      body: JSON.stringify(usuario),
    });

<<<<<<< HEAD
    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.mensagem);
      return;
    }

    localStorage.setItem('usuario', JSON.stringify(dados))

    alert('Login realizado!');
  } catch (erro) {
    alert('Erro ao conectar com o servidor');
=======
    console.log(resposta)

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro);
      return;
    }

    // Salva o usuário logado no navegador
    localStorage.setItem("usuario", JSON.stringify(dados.usuario));

    alert(dados.mensagem);

    // Redireciona para a página inicial
    window.location.href = "index.html";

  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar com o servidor.");
>>>>>>> 5cbecb0 (01-10-26)
  }
});
