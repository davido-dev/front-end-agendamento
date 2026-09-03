const form = document.querySelector('form')
const cpfInput = document.querySelector('#cpf')
const telefone = document.querySelector('#telefone')

form.addEventListener('submit', function(event) {
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

})
