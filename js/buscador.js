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