
function enviandoForm() {
  let timerInterval;
  Swal.fire({
    title: "Enviando Mensaje!",
    html: "Nuestro equipo te contactará en breves.",
    timer: 3000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const timer = Swal.getPopup().querySelector("b");
      timerInterval = setInterval(() => {
        timer.textContent = `${Swal.getTimerLeft()}`;
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("Ha acabado el temporizador SwAl");
    }
  });
}

function errorform() {
    Swal.fire({
        icon: "error",
        title: "Ha ocurrido un problema",
        text: "Revisa que hayas completado los campos necesarios!",
      });
}