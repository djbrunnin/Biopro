/* ========================================
   BIOPRO
   CLIENT.JS
   SELEÇÃO DE CLIENTE
   ======================================== */


/*
   Define qual cliente será carregado.

   Exemplos:

   ?cliente=cliente-001

   ?cliente=cliente-002
*/

function obterCliente() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const cliente =
        parametros.get("cliente");


    if (
        cliente &&
        /^[a-zA-Z0-9-_]+$/.test(cliente)
    ) {

        return cliente;

    }


    return "cliente-001";
}


/* ========================================
   CARREGAR CONFIGURAÇÃO
   ======================================== */

function carregarCliente() {

    const cliente =
        obterCliente();


    const script =
        document.createElement(
            "script"
        );


    script.src =
        `clientes/${cliente}/config.js`;


    script.onload =
        function () {

            iniciarBioPro();

        };


    script.onerror =
        function () {

            console.error(
                "Cliente não encontrado:",
                cliente
            );

        };


    document.body.appendChild(
        script
    );

}


/* ========================================
   INICIALIZAÇÃO
   ======================================== */

function iniciarBioPro() {

    if (
        typeof BIOPRO_CONFIG ===
        "undefined"
    ) {

        console.error(
            "Configuração do cliente não encontrada."
        );

        return;

    }


    if (
        typeof iniciarAplicacao ===
        "function"
    ) {

        iniciarAplicacao();

    }

}