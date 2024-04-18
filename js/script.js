
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


function comprar() {
  Swal.fire({
    title: "<b>No Disponible</b>",
    icon: "info",
    html: `
    Si quieres <b>comprar</b> algun producto 
    <a href="../../contacto.html">contáctanos</a>
    `,
    showCloseButton: true,
  });
}

function noexiste() {
  let timerInterval;
  Swal.fire({
    icon: "error",
    title: "No se han encontrado resultados",
    timer: 2000,
    timerProgressBar: false,
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


/* Google Analytics */
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-36F6LNKQBD');