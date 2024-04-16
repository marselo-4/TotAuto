
function barra_busqueda() {
    const query = document.getElementById('InsertarTextoBarra').value.trim().toLowerCase();
    const Contenido = [
        {nombre: "Ronal R66", enlace: "../catalogo/llantas/ronal_r66.html"},
        {nombre: "Ronal R66 JBBT", enlace: "../catalogo/llantas/ronal_r66-jbbt.html"},
        {nombre: "Ronal R68 HG", enlace: "../catalogo/llantas/ronal_r68-hg.html"},
        {nombre: "Ronal R68 JB", enlace: "../catalogo/llantas/ronal_r68-jb.html"},
        {nombre: "Ronal R69 JMB", enlace: "../catalogo/llantas/ronal_R69_jmb.html"},
        {nombre: "Ronal R69 MCR JBRR", enlace: "../catalogo/llantas/ronal_r69_mcr_jbrr.html"},
        {nombre: "Ronal R69 MG", enlace: "../catalogo/llantas/ronal_r69_mg.html"},
        {nombre: "Ronal R69 PS", enlace: "../catalogo/llantas/ronal_r69_ps.html"},
        {nombre: "Ronal R70 Blue JBWT", enlace: "../catalogo/llantas/ronal_r70_blue_jbwt.html"},
        {nombre: "Ronal R70 Blue OG", enlace: "../catalogo/llantas/ronal_r70_blueog.html"},
        {nombre: "Ronal R70 Blue PS", enlace: "../catalogo/llantas/ronal_r70_blueps.html"},
        {nombre: "Ronal R71 JBCM", enlace: "../catalogo/llantas/ronal_r71-jbcm.html"},
        {nombre: "Ronal R71 OGMFC", enlace: "../catalogo/llantas/ronal_r71-ogmfc.html"},
        {nombre: "Ronal R71 PS", enlace: "../catalogo/llantas/ronal_r71-ps.html"},
        {nombre: "Evus DD220R", enlace: "../catalogo/multimedia/evus_dd220r.html"},
        {nombre: "Evus DD503A", enlace: "../catalogo/multimedia/evus_dd503a.html"},
        {nombre: "Evus DD575A", enlace: "../catalogo/multimedia/evus_dd575a.html"},
        {nombre: "Evus UD122A", enlace: "../catalogo/multimedia/evus_ud122a.html"},
        {nombre: "Kermes Pro IV", enlace: "../catalogo/detectores-de-radar/kermes_pro_iv.html"},
        {nombre: "WFP DSP", enlace: "../catalogo/detectores-de-radar/wfp_dsp.html"},
        {nombre: "WFP Eclipse DSP", enlace: "../catalogo/detectores-de-radar/wfp_eclipse_dsp.html"},
    ];
  
    const Resultado = document.getElementById('resultadoBusqueda');
    Resultado.innerHTML = '';
    Resultado.style.width = '230px';
    Resultado.style.position = 'fixed';
    Resultado.style.transform = 'translateY(10%)';
    Resultado.style.right = '60px';
    Resultado.style.borderBottomLeftRadius = '10px';
    Resultado.style.borderBottomRightRadius = '10px';
    Resultado.style.color = 'white';
    Resultado.style.overflow = 'auto';
    Resultado.style.backgroundColor = 'black';
    Resultado.style.padding = '20px';
    Resultado.style.borderRadius = '10px';
    Resultado.style.zIndex = '50';

    
    document.addEventListener('click', function(event) {
        if (!Resultado.contains(event.target)) {
            Resultado.innerHTML = '';
        }
    });

    const Contenido_Existente = Contenido.filter(item => item.nombre.toLowerCase().includes(query));
  
    if (query !== '' && Contenido_Existente.length === 0) {
        noexiste();
    } else if (query !== '') {
  
        const Lista_Resultados = document.createElement('ul');
        Lista_Resultados.style.listStyleType = 'none';
        Lista_Resultados.style.padding = '0';
        Lista_Resultados.style.scrollBehavior = 'initial';
        Lista_Resultados.style.scrollSnapAlign = 'center';
        Lista_Resultados.style.maxHeight = '300px';
        Lista_Resultados.style.overflow = 'auto';
  
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