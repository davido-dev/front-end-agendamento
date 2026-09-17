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
