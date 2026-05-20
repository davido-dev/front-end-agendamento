const form = document.querySelector('form');
const cpfInput = document.querySelector('#cpf');
const telefoneInput = document.querySelector("#telefone");

// Cadastar usuário

form.addEventListener('submit', function (event) {
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

  alert(`${nome} cadastrado com sucesso!`)

  // redirecionar para login
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


telefoneInput.addEventListener("input", function () {

  let telefone = telefoneInput.value;

  telefone = telefone.replace(/\D/g, "");

  telefone = telefone.replace(/(\d{2})(\d)/, "($1) $2");

  telefone = telefone.replace(/(\d{5})(\d)/, "$1-$2");

  telefoneInput.value = telefone;

});
