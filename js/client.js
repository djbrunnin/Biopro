/* ========================================
   BIOPRO
   CLIENT.JS
   CARREGAMENTO DO CLIENTE VIA SUPABASE
   ======================================== */

function aguardarSupabase() {

    return new Promise(
        function (resolve) {

            if (
                window.supabaseClient
            ) {
                resolve(
                    window.supabaseClient
                );

                return;
            }


            const intervalo =
                setInterval(
                    function () {

                        if (
                            window.supabaseClient
                        ) {

                            clearInterval(
                                intervalo
                            );

                            resolve(
                                window.supabaseClient
                            );
                        }

                    },
                    50
                );

        }
    );
}
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
            "================================"
        );

        console.log(
            "BIOPRO - CLIENTE:",
            cliente
        );
		
		const supabase =
			await aguardarSupabase();

        console.log(
            "Buscando configuração no Supabase..."
        );


        const {
            data,
            error
        } = await supabaseClient
            .from("clients")
            .select("id, slug, config, published")
            .eq("slug", cliente)
            .eq("published", true)
            .maybeSingle();


        if (error) {

            console.error(
                "Erro Supabase:",
                error
            );

            throw error;
        }


        if (!data) {

            throw new Error(
                `Cliente "${cliente}" não encontrado ou não está publicado.`
            );
        }


        console.log(
            "Cliente encontrado no Supabase:",
            data
        );


        let config =
            data.config;


        /*
         * Caso o campo config venha como texto
         * em vez de JSON/JSONB.
         */

        if (
            typeof config === "string"
        ) {

            try {

                config =
                    JSON.parse(config);

            } catch (erro) {

                throw new Error(
                    "O campo config do Supabase contém JSON inválido."
                );

            }
        }


        if (
            !config ||
            typeof config !== "object"
        ) {

            throw new Error(
                "A configuração do cliente está vazia ou inválida."
            );
        }


        console.log(
            "CONFIGURAÇÃO RECEBIDA:",
            config
        );


        console.log(
            "LOGO RECEBIDA:",
            config.perfil?.logo
        );


        /*
         * Configuração oficial do cliente.
         */

        window.BIOPRO_CONFIG =
            config;


        console.log(
            "Configuração aplicada ao BIOPRO."
        );


        iniciarBioPro();


    } catch (erro) {

        console.error(
            "================================"
        );

        console.error(
            "ERRO AO CARREGAR CLIENTE"
        );

        console.error(
            erro
        );

        console.error(
            "================================"
        );


        mostrarErroCliente(
            erro
        );

    }

}


/* ========================================
   INICIAR BIOPRO
   ======================================== */

function iniciarBioPro() {

    if (
        !window.BIOPRO_CONFIG
    ) {

        mostrarErroCliente(
            new Error(
                "BIOPRO_CONFIG não encontrada."
            )
        );

        return;
    }


    console.log(
        "Iniciando aplicação BioPro..."
    );


    if (
        typeof iniciarAplicacao ===
        "function"
    ) {

        iniciarAplicacao();

    } else {

        mostrarErroCliente(
            new Error(
                "iniciarAplicacao() não encontrada."
            )
        );

    }

}


/* ========================================
   ERRO
   ======================================== */

function mostrarErroCliente(
    erro
) {

    const app =
        document.getElementById("app");

    if (!app) {
        return;
    }


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
                Erro ao carregar cliente
            </h2>

            <p style="
                margin-bottom:15px;
            ">
                Não foi possível carregar a configuração
                deste cliente pelo Supabase.
            </p>

            <pre style="
                white-space:pre-wrap;
                background:#f5f5f5;
                padding:15px;
                border-radius:10px;
                font-size:13px;
                overflow:auto;
            ">${erro?.message || erro}</pre>

        </div>
    `;

}


/* ========================================
   PREVIEW DO EDITOR
   ======================================== */

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


        console.log(
            "Configuração recebida do editor."
        );


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