/* ========================================
   BIOPRO
   APP.JS
   MOTOR PRINCIPAL
   ======================================== */


/* ========================================
   INICIAR BIOPRO
   ======================================== */

function iniciarAplicacao() {

    /* ================================
       VERIFICAR CONFIGURAÇÃO
       ================================ */

    if (
        typeof BIOPRO_CONFIG ===
        "undefined"
    ) {

        console.error(
            "Configuração do BioPro não encontrada."
        );

        return;

    }


    /* ================================
       LOCAL DA APLICAÇÃO
       ================================ */

    const app =
        document.getElementById("app");


    if (!app) {

        console.error(
            "Elemento #app não encontrado."
        );

        return;

    }


    /* ================================
       LIMPAR APLICAÇÃO
       ================================ */

    app.innerHTML = "";


    /* ================================
       APLICAR TEMA
       ================================ */

    aplicarTema(
        BIOPRO_CONFIG.tema
    );


    /* ================================
       ORDEM DOS COMPONENTES
       ================================ */

    const ordem =
        BIOPRO_CONFIG.ordem || [];


    /* ================================
       RENDERIZAR
       ================================ */

    ordem.forEach(
        componente => {

            if (
                !componenteAtivo(
                    componente
                )
            ) {

                return;

            }


            const elemento =
                renderizarComponente(
                    componente,
                    BIOPRO_CONFIG
                );


            if (elemento) {

                app.appendChild(
                    elemento
                );

            }

        }
    );


    /* ================================
       TÍTULO
       ================================ */

    atualizarTitulo();

}


/* ========================================
   VERIFICAR COMPONENTE
   ======================================== */

function componenteAtivo(nome) {

    if (
        !BIOPRO_CONFIG.componentes
    ) {

        return false;

    }


    return (
        BIOPRO_CONFIG
            .componentes[nome]
        === true
    );

}


/* ========================================
   APLICAR TEMA
   ======================================== */

function aplicarTema(tema) {

    if (
        typeof aplicarTemaCompleto ===
        "function"
    ) {

        aplicarTemaCompleto(
            tema || "botanic"
        );

        return;

    }


    document.body.dataset.theme =
        tema || "botanic";

}


/* ========================================
   TÍTULO
   ======================================== */

function atualizarTitulo() {

    const nome =
        BIOPRO_CONFIG.perfil?.nome;


    if (nome) {

        document.title =
            `${nome} | BioPro`;

    }

}