function barra_busqueda() {
    const query = document.getElementById('InsertarTextoBarra').value.trim().toLowerCase();
    const Contenido = [
        {nombre: "Ronal R69", enlace: "ronal_r69.html"},
        {nombre: "Ronal R70", enlace: "ronal_r70.html"},
        {nombre: "Ronal R66", enlace: "../catalogo/llantas/ronal_r66.html"}
    ];

    const Resultado = document.getElementById('Realizar_Busqueda');
    Resultado.innerHTML = '';
    Resultado.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    Resultado.style.padding = '10px';
    Resultado.style.borderRadius = '10px';

    const Contenido_Existente = Contenido.filter(item => item.nombre.toLowerCase().includes(query));

    if (query !== '' && Contenido_Existente.length === 0) {
        Resultado.innerHTML = 'No existe este contenido';
    } else if (query !== '') {

        const Lista_Resultados = document.createElement('ul');
        Lista_Resultados.style.listStyleType = 'none';
        Lista_Resultados.style.padding = '0';

        Contenido_Existente.forEach(item => {
            const Listado = document.createElement('li');
            Listado.style.marginBottom = '5px';
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