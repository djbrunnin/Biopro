async function obterCliente() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const cliente =
        parametros.get("cliente");

    if (
        cliente &&
        /^[a-zA-Z0-9_-]+$/.test(cliente)
    ) {
        return cliente;
    }

    return "cliente-001";
}


async function carregarCliente() {

    if (
        new URLSearchParams(window.location.search).get("preview") === "1"
    ) {
        return;
    }

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

            await carregarTemaPersonalizado(data.config.tema);

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


async function carregarTemaPersonalizado(chave) {
    if (
        typeof chave !== "string" ||
        !/^[a-z][a-zA-Z0-9]{0,39}$/.test(chave) ||
        typeof BIOPRO_THEMES === "undefined" ||
        BIOPRO_THEMES[chave]
    ) {
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from("biopro_themes")
            .select("theme_key, theme")
            .eq("theme_key", chave)
            .eq("is_active", true)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (data?.theme_key === chave && data.theme && typeof data.theme === "object") {
            BIOPRO_THEMES[chave] = data.theme;
        }
    } catch (erro) {
        console.warn("Não foi possível carregar o tema personalizado:", erro.message);
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

        const app = document.getElementById("app");
        if (app) {
            app.textContent = "Página de cliente não encontrada.";
        }

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

window.addEventListener(
    "message",
    function (evento) {

        if (
            evento.origin !==
                window.location.origin ||
            window.parent === window ||
            evento.source !== window.parent ||
            new URLSearchParams(window.location.search).get("preview") !== "1"
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
            !evento.data.config ||
            typeof evento.data.config !== "object" ||
            Array.isArray(evento.data.config)
        ) {
            return;
        }

        const temaCustomizado = evento.data.temaCustomizado;
        if (
            temaCustomizado &&
            temaCustomizado.key === evento.data.config.tema &&
            /^[a-z][a-zA-Z0-9]{0,39}$/.test(temaCustomizado.key) &&
            temaCustomizado.dados &&
            typeof temaCustomizado.dados === "object" &&
            typeof BIOPRO_THEMES !== "undefined"
        ) {
            BIOPRO_THEMES[temaCustomizado.key] = temaCustomizado.dados;
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
