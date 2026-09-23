const form = document.querySelector('form');

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.querySelector('#email').value;
  const senha = document.querySelector('#senha').value;

  const usuario = {
    email: email,
    senha: senha,
  };

  try {
    const resposta = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro);
      return;
    }

    localStorage.setItem('usuario', JSON.stringify(dados.usuario))

    alert('Login realizado!');
  } catch (erro) {
    alert('Erro ao conectar com o servidor');
  }
});
