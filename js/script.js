
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
    title: "No Disponible",
    icon: "info",
    html: `
      Si quieres <b>comprar</b> algun producto 
      <a href="contacto.html">contáctanos</a>,
    `,
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

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2000,
  delay: 200,
  reset: true
});

sr.reveal('.parte1',{});

function barra_busqueda() {
  const query = document.getElementById('InsertarTextoBarra').value.trim().toLowerCase();
  const Contenido = [
      {nombre: "Ronal R69", enlace: "../catalogo/llantas/ronal_r69.html"},
      {nombre: "Ronal R70", enlace: "../catalogo/llantas/ronal_r70.html"},
      {nombre: "Ronal R66", enlace: "../catalogo/llantas/ronal_r66.html"}
  ];

  const Resultado = document.getElementById('resultadoBusqueda');
  Resultado.innerHTML = '';
  Resultado.style.position = 'fixed';
  Resultado.style.top = '3.2%';
  Resultado.style.right = '10px';
  Resultado.style.transform = 'translateY(-50%)';
  Resultado.style.backgroundColor = 'black';
  Resultado.style.width = '235px';
  Resultado.style.padding = '20px';
  Resultado.style.borderBottomLeftRadius = '10px';
  Resultado.style.borderBottomRightRadius = '10px';
  Resultado.style.color = 'white';
  Resultado.style.overflow = 'auto';
  // Resultado.style.backgroundColor = 'rgba(0, 0, 0)';
  // Resultado.style.width = '200px';
  // Resultado.style.padding = '10px';
  // Resultado.style.borderRadius = '10px';

  const Contenido_Existente = Contenido.filter(item => item.nombre.toLowerCase().includes(query));

  if (query !== '' && Contenido_Existente.length === 0) {
      noexiste();
  } else if (query !== '') {

      const Lista_Resultados = document.createElement('ul');
      Lista_Resultados.style.listStyleType = 'none';
      Lista_Resultados.style.padding = '0';
      Lista_Resultados.style.marginTop = '50%';

      Contenido_Existente.forEach(item => {
          const Listado = document.createElement('li');
          Listado.style.marginTop = '20px';
          const EnlaceHTML = document.createElement('a');
          EnlaceHTML.href = item.enlace;
          EnlaceHTML.textContent = item.nombre;
          EnlaceHTML.style.color = 'white';
          EnlaceHTML.style.textDecoration = 'none';
          Listado.appendChild(EnlaceHTML);
          Lista_Resultados.appendChild(Listado);
      });
      Resultado.appendChild(Lista_Resultados);
  }
}

function Enter(event) {
  if (event.key === "Enter") {
      barra_busqueda();
  }
}