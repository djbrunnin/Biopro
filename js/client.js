async function obterCliente() {

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


async function carregarCliente() {

    try {

        const cliente =
            await obterCliente();


        console.log(
            "Carregando cliente:",
            cliente
        );


        // Busca no Supabase

        const {
            data,
            error
        } = await supabaseClient
            .from("clients")
            .select("config")
            .eq("slug", cliente)
            .eq("published", true)
            .maybeSingle();


        if (error) {
            throw error;
        }


        if (
            data &&
            data.config
        ) {

            console.log(
                "Cliente carregado do Supabase."
            );


            window.BIOPRO_CONFIG =
                data.config;


            iniciarBioPro();

            return;
        }


        // Fallback para o config.js antigo

        console.warn(
            "Cliente não encontrado no Supabase. Usando configuração antiga."
        );


        carregarConfigAntiga(cliente);


    } catch (erro) {

        console.error(
            "Erro ao carregar cliente:",
            erro
        );


        carregarConfigAntiga(
            await obterCliente()
        );

    }

}


function carregarConfigAntiga(cliente) {

    const script =
        document.createElement("script");

    script.src =
        `clientes/${cliente}/config.js`;


    script.onload = function () {

        iniciarBioPro();

    };


    script.onerror = function () {

        console.error(
            "Cliente não encontrado:",
            cliente
        );

    };


    document
        .body
        .appendChild(script);

}


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