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


function obterUrlSegura(valor) {
    if (typeof valor !== "string") {
        return null;
    }

    const url = valor.trim();
    if (!url || /[\u0000-\u001f\u007f]/.test(url) || url.startsWith("\\")) {
        return null;
    }

    if (url.startsWith("#")) {
        return url;
    }

    if (url.startsWith("//")) {
        return null;
    }

    const protocolo = url.match(/^([a-z][a-z\d+.-]*):/i);
    if (
        protocolo &&
        !["http", "https", "mailto", "tel"].includes(
            protocolo[1].toLowerCase()
        )
    ) {
        return null;
    }

    return url;
}


/* ========================================
   RENDERIZAR LINKS
   ======================================== */

function renderizarLinks(lista) {

    const resultado = [];


    (Array.isArray(lista) ? lista : [])
        .filter(
            link =>
                link &&
                link.ativo !== false &&
                obterUrlSegura(link.url)
        )
        .forEach(
            linkConfig => {

                const link =
                    document.createElement("a");


                link.className =
                    "bio-link";


                link.href = obterUrlSegura(linkConfig.url);


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

                if (/^https?:/i.test(link.href)) {

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
