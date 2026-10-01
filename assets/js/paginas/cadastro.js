<<<<<<< HEAD
const form = document.querySelector('form')
const cpfInput = document.querySelector('#cpf')
const telefone = document.querySelector('#telefone')

form.addEventListener('submit',async function(event) {
    event.preventDefault();

    const nome = document.querySelector('#nome').value
    const cpf = document.querySelector('#cpf').value
    const email = document.querySelector('#email').value
    const senha = document.querySelector('#senha').value
    const confirmeSenha = document.querySelector('#confirmeSenha').value
    const telefone = document.querySelector('#telefone').value

    if (senha != confirmeSenha) {
      alert("As senhas não são iguais")
      return;
    }

    const usuario = {
      nome: nome,
      cpf: cpf,
      email: email,
      senha: senha,
      telefone: telefone
    }

    try {
      const resposta = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
      })

      if (!resposta.ok) {
        throw  new Error('Erro ao cadastrar usuário!')
      }

      alert('Usuário cadastrado com sucesso!')

      window.location.href = 'login.html'
    } catch (erro) {
      alert('Erro ao cadastrar usuário')
    }

})
=======
const form = document.querySelector('form');
const cpfInput = document.querySelector('#cpf');
const telefoneInput = document.querySelector('#telefone');

// Cadastar usuário

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const nome = document.querySelector('#nome').value;
  const cpf = document.querySelector('#cpf').value;
  const email = document.querySelector('#email').value;
  const senha = document.querySelector('#senha').value;
  const confirmeSenha = document.querySelector('#confirmeSenha').value;
  const telefone = document.querySelector('#telefone').value;

  if (senha !== confirmeSenha) {
    alert('As senhas não coincidem.');

    return;
  }

  const usuario = {
    nome: nome,
    cpf: cpf,
    email: email,
    senha: senha,
    telefone: telefone,
  };

  try {
    const resposta = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });

    if (!resposta.ok) {
      throw new Error('Erro ao cadastrar usuário.');
    }

    alert(`${nome} cadastrado com sucesso!`);


    window.location.href = 'login.html';
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível cadastrar o usuário.');
  }

});

// Máscaras de inputs

cpfInput.addEventListener('input', function () {
  let cpf = cpfInput.value;

  cpf = cpf.replace(/\D/g, '');

  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  cpfInput.value = cpf;
});

telefoneInput.addEventListener('input', function () {
  let telefone = telefoneInput.value;

  telefone = telefone.replace(/\D/g, '');

  telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');

  telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');

  telefoneInput.value = telefone;
});
>>>>>>> 5cbecb0 (01-10-26)
