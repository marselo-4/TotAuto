document.getElementById('enlaceCoordenadas').addEventListener('click', function(event) {
    event.preventDefault(); // Evita que el enlace se comporte normalmente

    // Reemplaza las coordenadas con las que desees
    var latitud = 41.6510;
    var longitud = 1.143882;

    // Redirige a las coordenadas usando el protocolo de Google Maps
    window.location.href = "https://www.google.com/maps?q=" + latitud + "," + longitud;
});