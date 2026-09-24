/* ========================================
   BIOPRO
   LINKS.JS
   SISTEMA DE LINKS
   ======================================== */


/* ========================================
   ÍCONES
   ======================================== */

const BIOPRO_ICONS = {

    whatsapp: "◉",

    instagram: "◎",

    facebook: "f",

    tiktok: "♪",

    servicos: "✦",

    mapa: "⌖",

    telefone: "☎",

    site: "⌂",

    agenda: "▣",

    contato: "✉"

};


/* ========================================
   RENDERIZAR LINKS
   ======================================== */

function renderizarLinks(lista) {

    const resultado = [];


    lista
        .filter(
            link =>
                link &&
                link.ativo !== false
        )
        .forEach(
            linkConfig => {

                const link =
                    document.createElement("a");


                link.className =
                    "bio-link";


                link.href =
                    linkConfig.url || "#";


                /* =========================
                   ÍCONE
                   ========================= */

                if (linkConfig.icone) {

                    const icone =
                        document.createElement("span");

                    icone.className =
                        "bio-link-icon";

                    icone.textContent =
                        BIOPRO_ICONS[
                            linkConfig.icone
                        ] || "•";

                    link.appendChild(icone);

                }


                /* =========================
                   TEXTO
                   ========================= */

                const texto =
                    document.createElement("span");

                texto.className =
                    "bio-link-text";

                texto.textContent =
                    linkConfig.nome ||
                    "Link";

                link.appendChild(texto);


                /* =========================
                   LINK EXTERNO
                   ========================= */

                if (
                    linkConfig.url &&
                    linkConfig.url !== "#" &&
                    !linkConfig.url
                        .startsWith("#")
                ) {

                    link.target =
                        "_blank";

                    link.rel =
                        "noopener noreferrer";

                }


                resultado.push(link);

            }
        );


    return resultado;

}