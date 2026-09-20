/* ========================================
   BIOPRO
   APP.JS
   MOTOR PRINCIPAL
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Verifica se a configuração do cliente existe
    if (typeof BIOPRO_CONFIG === "undefined") {

        console.error(
            "Configuração do BioPro não encontrada."
        );

        return;
    }

    // Local onde a página será montada
    const app = document.getElementById("app");

    if (!app) {

        console.error(
            "Elemento #app não encontrado."
        );

        return;
    }

    // Aplica o tema escolhido pelo cliente
    aplicarTema(
        BIOPRO_CONFIG.tema
    );

    // Obtém a ordem dos componentes
    const ordem =
        BIOPRO_CONFIG.ordem || [];

    // Percorre os componentes
    ordem.forEach(componente => {

        // Verifica se o componente está ativo
        if (!componenteAtivo(componente)) {
            return;
        }

        // Cria o componente
        const elemento =
            renderizarComponente(
                componente,
                BIOPRO_CONFIG
            );

        // Adiciona na página
        if (elemento) {

            app.appendChild(elemento);

        }

    });

    // Atualiza o título da página
    atualizarTitulo();

});


/* ========================================
   VERIFICAR COMPONENTE
   ======================================== */

function componenteAtivo(nome) {

    if (!BIOPRO_CONFIG.componentes) {
        return false;
    }

    return (
        BIOPRO_CONFIG.componentes[nome]
        === true
    );

}


/* ========================================
   APLICAR TEMA
   ======================================== */

function aplicarTema(tema) {

    document.body.dataset.theme =
        tema || "botanic";

}


/* ========================================
   ATUALIZAR TÍTULO
   ======================================== */

function atualizarTitulo() {

    const nome =
        BIOPRO_CONFIG.perfil?.nome;

    if (nome) {

        document.title =
            `${nome} | BioPro`;

    }

}