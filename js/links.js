/* ========================================
   BIOPRO
   LINKS.JS
   SISTEMA DE LINKS
   ======================================== */


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


                /* Classe */

                link.className =
                    "bio-link";


                /* Endereço */

                link.href =
                    linkConfig.url || "#";


                /* Nome */

                link.textContent =
                    linkConfig.nome ||
                    "Link";


                /* Links externos */

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


                /* Ícone */

                if (
                    linkConfig.icone
                ) {

                    link.dataset.icon =
                        linkConfig.icone;

                }


                resultado.push(link);

            }
        );


    return resultado;

}