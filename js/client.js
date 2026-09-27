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

window.addEventListener(
    "message",
    function (evento) {

        if (
            evento.origin !==
            window.location.origin
        ) {
            return;
        }


        if (
            !evento.data ||
            evento.data.tipo !==
            "BIOPRO_PREVIEW"
        ) {
            return;
        }


        if (
            !evento.data.config
        ) {
            return;
        }


        window.BIOPRO_CONFIG =
            evento.data.config;


        if (
            typeof iniciarAplicacao ===
            "function"
        ) {

            iniciarAplicacao();

        }

    }
);
