import { RESPONSIBLE as R, type LegalDoc } from "./types";

const UPDATED = "22 d'octubre de 2026";

export const avisoLegal: LegalDoc = {
  title: "Avís legal",
  updated: UPDATED,
  intro: `En compliment de la Llei 34/2002, d'11 de juliol, de serveis de la societat de la informació i de comerç electrònic (LSSI-CE), s'informa de les dades identificatives del titular d'aquest lloc web.`,
  sections: [
    {
      heading: "Titular",
      paragraphs: [
        `${R.name}, amb CIF ${R.cif} i domicili social a ${R.address}, inscrita a ${R.registry}. Opera sota la marca comercial ${R.brand}, amb showroom a ${R.showroom}.`,
        `Contacte: ${R.email} · ${R.phone}.`,
      ],
    },
    {
      heading: "Objecte",
      paragraphs: [
        `Aquest lloc web (${R.site}) té per objecte donar a conèixer l'activitat de ${R.brand}: exposició i venda de vehicles, importació de vehicles sota encàrrec i compra de vehicles a particulars, així com facilitar el contacte amb l'equip.`,
        `La informació sobre els vehicles publicats (preu, quilometratge, equipament, disponibilitat) té caràcter orientatiu i no constitueix oferta contractual. Les condicions definitives es fixen al contracte de compravenda corresponent.`,
      ],
    },
    {
      heading: "Condicions d'ús",
      paragraphs: [`L'accés i la navegació pel lloc atribueixen la condició d'usuari i impliquen l'acceptació d'aquest avís legal. L'usuari es compromet a fer un ús adequat dels continguts i a no emprar-los per a activitats il·lícites, ni per danyar o sobrecarregar els sistemes.`],
    },
    {
      heading: "Propietat intel·lectual i industrial",
      paragraphs: [`Els textos, imatges, renders, models 3D, logotips i altres continguts del lloc són titularitat de ${R.name} o s'usen amb autorització dels seus titulars. Queda prohibida la seva reproducció, distribució o transformació sense autorització expressa. Les marques dels fabricants dels vehicles pertanyen als seus titulars respectius i se citen únicament amb finalitats descriptives.`],
    },
    {
      heading: "Responsabilitat",
      paragraphs: [`${R.name} procura que la informació del lloc sigui exacta i estigui actualitzada, però no garanteix l'absència d'errors ni la disponibilitat permanent del servei. No es fa responsable dels continguts de llocs de tercers enllaçats.`],
    },
    {
      heading: "Legislació aplicable",
      paragraphs: [`Aquest avís legal es regeix per la legislació espanyola. Per a qualsevol controvèrsia seran competents els jutjats i tribunals de Lleida, llevat que la normativa de consumidors estableixi un altre fur.`],
    },
  ],
};

export const privacidad: LegalDoc = {
  title: "Política de privacitat",
  updated: UPDATED,
  intro: `Aquesta política explica com ${R.name} tracta les dades personals de qui fa servir ${R.site} o contacta amb ${R.brand}, d'acord amb el Reglament (UE) 2016/679 (RGPD) i la Llei Orgànica 3/2018 (LOPDGDD).`,
  sections: [
    { heading: "Responsable del tractament", paragraphs: [`${R.name} · CIF ${R.cif} · ${R.address} · ${R.email} · ${R.phone}.`] },
    {
      heading: "Quines dades tractem i d'on procedeixen",
      paragraphs: [`Les dades que ens facilites als formularis i canals de contacte del web (nom, telèfon, email, missatge i, si escau, dades del vehicle que busques o que vols vendre), i les que ens dónes per WhatsApp, telèfon o email.`],
    },
    {
      heading: "Per a què les fem servir i amb quina base legal",
      paragraphs: [],
      list: [
        `Atendre la teva consulta o sol·licitud (informació sobre un vehicle, encàrrec d'importació, taxació, cita) — base: mesures precontractuals a petició teva (art. 6.1.b RGPD).`,
        `Gestionar la relació comercial i, si escau, el contracte de compravenda — base: execució del contracte (art. 6.1.b) i obligacions legals (art. 6.1.c).`,
        `Mantenir el contacte comercial sobre vehicles o serveis similars als que et van interessar — base: interès legítim (art. 6.1.f); t'hi pots oposar en qualsevol moment.`,
        `Analítica d'ús del web mitjançant galetes, només si les acceptes — base: el teu consentiment (art. 6.1.a).`,
      ],
    },
    {
      heading: "A qui comuniquem les teves dades",
      paragraphs: [`No venem ni cedim les teves dades. Les tracten per compte nostre, com a encarregats, els proveïdors que necessitem per operar: allotjament web (Vercel Inc.), base de dades (Supabase Inc.), enviament de correu (Resend) i CRM (HubSpot Inc.). Alguns són fora de l'Espai Econòmic Europeu; les transferències s'emparen en clàusules contractuals tipus o en el Marc de Privacitat de Dades UE-EUA. En la compravenda d'un vehicle, les dades necessàries es comuniquen a gestories, DGT, entitats financeres i asseguradores.`],
    },
    {
      heading: "Quant de temps les conservem",
      paragraphs: [`Les consultes, mentre les atenem i durant un màxim de dos anys des de l'últim contacte. Les dades d'una compravenda, durant els terminis de prescripció fiscal i mercantil (sis anys). Les dades d'analítica, segons la política de galetes.`],
    },
    {
      heading: "Els teus drets",
      paragraphs: [`Pots accedir a les teves dades, rectificar-les, suprimir-les, oposar-te al tractament, limitar-lo o demanar-ne la portabilitat, i retirar el consentiment quan l'hagis donat, escrivint a ${R.email} amb una còpia del teu document d'identitat. Si consideres que no hem atès correctament els teus drets, pots reclamar davant l'Agència Espanyola de Protecció de Dades (aepd.es).`],
    },
    { heading: "Seguretat", paragraphs: [`Apliquem mesures tècniques i organitzatives adequades: connexions xifrades, control d'accés a la base de dades i accés restringit al panell de gestió.`] },
  ],
};

export const cookies: LegalDoc = {
  title: "Política de galetes",
  updated: UPDATED,
  intro: `Una galeta (cookie) és un petit fitxer que el lloc desa al teu navegador. Aquí t'expliquem quines fa servir ${R.site} i com controlar-les.`,
  sections: [
    {
      heading: "Galetes necessàries",
      paragraphs: [`Imprescindibles perquè el web funcioni. No requereixen consentiment.`],
      list: [
        `NEXT_LOCALE — recorda l'idioma triat (castellà o català). Durada: 1 any.`,
        `ta_consent — desa la teva decisió sobre les galetes. Durada: 1 any.`,
        `Galetes de sessió del panell de gestió (sb-*) — només per a l'equip de ${R.brand} que accedeix al panell.`,
      ],
    },
    {
      heading: "Galetes d'analítica (només amb el teu consentiment)",
      paragraphs: [`Fem servir Google Analytics 4 (Google Ireland Ltd.) per saber quines pàgines es visiten i com millorar el web. Mentre no acceptis, Google Analytics funciona en mode sense galetes i no t'identifica.`],
      list: [`_ga, _ga_* — distingeixen usuaris i sessions. Durada: fins a 2 anys.`],
    },
    {
      heading: "Com gestionar les galetes",
      paragraphs: [
        `En entrar per primera vegada pots acceptar o rebutjar les galetes d'analítica. Pots canviar la decisió en qualsevol moment des de l'enllaç «Galetes» del peu de pàgina.`,
        `També pots esborrar o bloquejar les galetes des de la configuració del navegador; si bloqueges les necessàries, algunes funcions poden deixar de funcionar.`,
      ],
    },
  ],
};
