import { RESPONSIBLE as R, type LegalDoc } from "./types";

const UPDATED = "22 de octubre de 2026";

export const avisoLegal: LegalDoc = {
  title: "Aviso legal",
  updated: UPDATED,
  intro: `En cumplimiento de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se informa de los datos identificativos del titular de este sitio web.`,
  sections: [
    {
      heading: "Titular",
      paragraphs: [
        `${R.name}, con CIF ${R.cif} y domicilio social en ${R.address}, inscrita en ${R.registry}. Opera bajo la marca comercial ${R.brand}, con showroom en ${R.showroom}.`,
        `Contacto: ${R.email} · ${R.phone}.`,
      ],
    },
    {
      heading: "Objeto",
      paragraphs: [
        `Este sitio web (${R.site}) tiene por objeto dar a conocer la actividad de ${R.brand}: exposición y venta de vehículos, importación de vehículos bajo encargo y compra de vehículos a particulares, así como facilitar el contacto con el equipo.`,
        `La información sobre los vehículos publicados (precio, kilometraje, equipamiento, disponibilidad) tiene carácter orientativo y no constituye oferta contractual. Las condiciones definitivas se fijan en el contrato de compraventa correspondiente.`,
      ],
    },
    {
      heading: "Condiciones de uso",
      paragraphs: [
        `El acceso y la navegación por el sitio atribuyen la condición de usuario e implican la aceptación de este aviso legal. El usuario se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para actividades ilícitas, ni para dañar o sobrecargar los sistemas.`,
      ],
    },
    {
      heading: "Propiedad intelectual e industrial",
      paragraphs: [
        `Los textos, imágenes, renders, modelos 3D, logotipos y demás contenidos del sitio son titularidad de ${R.name} o se usan con autorización de sus titulares. Queda prohibida su reproducción, distribución o transformación sin autorización expresa. Las marcas de los fabricantes de los vehículos pertenecen a sus respectivos titulares y se citan únicamente con fines descriptivos.`,
      ],
    },
    {
      heading: "Responsabilidad",
      paragraphs: [
        `${R.name} procura que la información del sitio sea exacta y esté actualizada, pero no garantiza la ausencia de errores ni la disponibilidad permanente del servicio. No se hace responsable de los contenidos de sitios de terceros enlazados.`,
      ],
    },
    {
      heading: "Legislación aplicable",
      paragraphs: [`Este aviso legal se rige por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales de Lleida, salvo que la normativa de consumidores establezca otro fuero.`],
    },
  ],
};

export const privacidad: LegalDoc = {
  title: "Política de privacidad",
  updated: UPDATED,
  intro: `Esta política explica cómo ${R.name} trata los datos personales de quienes usan ${R.site} o contactan con ${R.brand}, conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).`,
  sections: [
    {
      heading: "Responsable del tratamiento",
      paragraphs: [`${R.name} · CIF ${R.cif} · ${R.address} · ${R.email} · ${R.phone}.`],
    },
    {
      heading: "Qué datos tratamos y de dónde proceden",
      paragraphs: [`Los datos que nos facilitas en los formularios y canales de contacto de la web (nombre, teléfono, email, mensaje y, en su caso, datos del vehículo que buscas o que quieres vender), y los que nos das por WhatsApp, teléfono o email.`],
    },
    {
      heading: "Para qué los usamos y con qué base legal",
      paragraphs: [],
      list: [
        `Atender tu consulta o solicitud (información sobre un vehículo, encargo de importación, tasación, cita) — base: medidas precontractuales a petición tuya (art. 6.1.b RGPD).`,
        `Avisarte de la fecha de inauguración del showroom y enviarte la invitación si te apuntas a la lista de espera (nombre, email y, si lo das, teléfono) — base: tu consentimiento (art. 6.1.a RGPD), que puedes retirar cuando quieras escribiendo a info@totauto.net.`,
        `Gestionar la relación comercial y, en su caso, el contrato de compraventa — base: ejecución del contrato (art. 6.1.b) y obligaciones legales (art. 6.1.c).`,
        `Mantener el contacto comercial sobre vehículos o servicios similares a los que te interesaron — base: interés legítimo (art. 6.1.f); puedes oponerte en cualquier momento.`,
        `Analítica de uso de la web mediante cookies, solo si las aceptas — base: tu consentimiento (art. 6.1.a).`,
      ],
    },
    {
      heading: "A quién comunicamos tus datos",
      paragraphs: [`No vendemos ni cedemos tus datos. Los tratan por cuenta nuestra, como encargados, los proveedores que necesitamos para operar: alojamiento web (Vercel Inc.), base de datos (Supabase Inc.), envío de correo (Resend) y CRM (HubSpot Inc.). Algunos están fuera del Espacio Económico Europeo; las transferencias se amparan en cláusulas contractuales tipo o en el Marco de Privacidad de Datos UE-EE. UU. En la compraventa de un vehículo, los datos necesarios se comunican a gestorías, DGT, entidades financieras y aseguradoras.`],
    },
    {
      heading: "Cuánto tiempo los conservamos",
      paragraphs: [`Las consultas, mientras las atendemos y durante un máximo de dos años desde el último contacto. Los datos de una compraventa, durante los plazos de prescripción fiscal y mercantil (seis años). Los datos de analítica, según la política de cookies.`],
    },
    {
      heading: "Tus derechos",
      paragraphs: [`Puedes acceder a tus datos, rectificarlos, suprimirlos, oponerte al tratamiento, limitarlo o pedir su portabilidad, y retirar el consentimiento cuando lo hayas dado, escribiendo a ${R.email} con una copia de tu documento de identidad. Si consideras que no hemos atendido correctamente tus derechos, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).`],
    },
    {
      heading: "Seguridad",
      paragraphs: [`Aplicamos medidas técnicas y organizativas adecuadas: conexiones cifradas, control de acceso a la base de datos y acceso restringido al panel de gestión.`],
    },
  ],
};

export const cookies: LegalDoc = {
  title: "Política de cookies",
  updated: UPDATED,
  intro: `Una cookie es un pequeño archivo que el sitio guarda en tu navegador. Aquí te explicamos cuáles usa ${R.site} y cómo controlarlas.`,
  sections: [
    {
      heading: "Cookies necesarias",
      paragraphs: [`Imprescindibles para que la web funcione. No requieren consentimiento.`],
      list: [
        `NEXT_LOCALE — recuerda el idioma elegido (castellano o catalán). Duración: 1 año.`,
        `ta_consent — guarda tu decisión sobre las cookies. Duración: 1 año.`,
        `Cookies de sesión del panel de gestión (sb-*) — solo para el equipo de ${R.brand} que accede al panel.`,
      ],
    },
    {
      heading: "Cookies de analítica (solo con tu consentimiento)",
      paragraphs: [`Usamos Google Analytics 4 (Google Ireland Ltd.) para saber qué páginas se visitan y cómo mejorar la web. Mientras no aceptes, Google Analytics funciona en modo sin cookies y no te identifica.`],
      list: [`_ga, _ga_* — distinguen usuarios y sesiones. Duración: hasta 2 años.`],
    },
    {
      heading: "Cómo gestionar las cookies",
      paragraphs: [
        `Al entrar por primera vez puedes aceptar o rechazar las cookies de analítica. Puedes cambiar tu decisión en cualquier momento desde el enlace «Cookies» del pie de página.`,
        `También puedes borrar o bloquear las cookies desde la configuración de tu navegador; si bloqueas las necesarias, algunas funciones pueden dejar de funcionar.`,
      ],
    },
  ],
};
