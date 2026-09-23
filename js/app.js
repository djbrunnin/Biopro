/* ========================================
   BIOPRO
   APP.JS
   MOTOR PRINCIPAL
   ======================================== */

function iniciarAplicacao() {

    const app =
        document.getElementById("app");

    if (!app) {
        console.error(
            "Elemento #app não encontrado."
        );
        return;
    }

    try {

        console.log(
            "=== BIOPRO INICIANDO ==="
        );

        console.log(
            "Configuração:",
            window.BIOPRO_CONFIG
        );

        if (
            typeof BIOPRO_CONFIG ===
            "undefined"
        ) {
            throw new Error(
                "BIOPRO_CONFIG não encontrada."
            );
        }

        console.log(
            "Tema:",
            BIOPRO_CONFIG.tema
        );

        aplicarTema(
            BIOPRO_CONFIG.tema
        );

        console.log(
            "Tema aplicado."
        );

        app.innerHTML = "";

        const ordem =
            BIOPRO_CONFIG.ordem || [];

        console.log(
            "Ordem dos componentes:",
            ordem
        );

        ordem.forEach(
            componente => {

                console.log(
                    "Renderizando:",
                    componente
                );

                if (
                    !componenteAtivo(
                        componente
                    )
                ) {
                    console.log(
                        "Componente desativado:",
                        componente
                    );

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

        atualizarTitulo();

        console.log(
            "=== BIOPRO CARREGADO ==="
        );

    } catch (erro) {

        console.error(
            "ERRO NO BIOPRO:",
            erro
        );

        app.innerHTML = `
            <div style="
                max-width:500px;
                margin:40px auto;
                padding:25px;
                font-family:Arial,sans-serif;
                background:#fff;
                border:1px solid #ddd;
                border-radius:16px;
                color:#333;
            ">

                <h2 style="
                    margin-bottom:15px;
                    color:#b33;
                ">
                    Erro ao carregar BioPro
                </h2>

                <p style="
                    margin-bottom:15px;
                ">
                    O sistema encontrou um erro ao montar a página.
                </p>

                <pre style="
                    white-space:pre-wrap;
                    background:#f5f5f5;
                    padding:15px;
                    border-radius:10px;
                    font-size:13px;
                    overflow:auto;
                ">${erro.message}</pre>

            </div>
        `;
    }
}


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


function atualizarTitulo() {

    const nome =
        BIOPRO_CONFIG.perfil?.nome;

    if (nome) {

        document.title =
            `${nome} | BioPro`;
    }
}