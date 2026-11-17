function configurarLogout() {
  const btnSair = document.querySelector('#btn-sair');

  if (!btnSair) {
    return;
  }

  btnSair.addEventListener('click', (evento) => {
    evento.preventDefault();

    alert("oi")

    localStorage.removeItem('usuario');

    window.location.href = 'login.html';
  });
}

document.addEventListener('DOMContentLoaded', configurarLogout);
