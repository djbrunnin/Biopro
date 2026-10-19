let usuarioAtual = null;
let clientesCarregados = [];


/* =========================================
   ELEMENTOS
========================================= */

const lista =
    document.getElementById("lista");

const mensagem =
    document.getElementById("mensagem");

const modalFundo =
    document.getElementById("modalFundo");

const novoNome =
    document.getElementById("novoNome");

const novoDescricao =
    document.getElementById("novoDescricao");

const novoWhatsApp =
    document.getElementById("novoWhatsApp");

const novoInstagram =
    document.getElementById("novoInstagram");

const novoEndereco =
    document.getElementById("novoEndereco");

const novoMapa =
    document.getElementById("novoMapa");

const buscaClientes =
    document.getElementById("buscaClientes");

const filtroPublicacao =
    document.getElementById("filtroPublicacao");

const resumoClientes =
    document.getElementById("resumoClientes");


/* =========================================
   MENSAGEM
========================================= */

function mostrarMensagem(texto) {

    mensagem.textContent =
        texto;

}


/* =========================================
   LOGIN
========================================= */

async function verificarLogin() {

    if (typeof supabaseClient === "undefined") {
        mostrarMensagem("Não foi possível conectar ao Supabase. Recarregue a página.");
        return false;
    }

    let sessaoResultado;
    try {
        sessaoResultado = await supabaseClient.auth.getSession();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Não foi possível verificar sua sessão. Tente novamente.");
        return false;
    }

    const { data, error } = sessaoResultado;


    if (error) {

        console.error(error);

        window.location.href =
            "./login.html";

        return false;

    }


    if (!data.session) {

        window.location.href =
            "./login.html";

        return false;

    }


    usuarioAtual =
        data.session.user;


    return true;

}


/* =========================================
   CARREGAR CLIENTES
========================================= */

async function carregarClientes() {

    const logado =
        await verificarLogin();

    if (!logado) return;


    mostrarMensagem(
        "Carregando clientes..."
    );


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("clients")
            .select(
                "id, slug, name, config, published, updated_at"
            )
            .eq(
                "owner_id",
                usuarioAtual.id
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


        if (error) {
            throw error;
        }


        renderizarClientes(
            data || []
        );


        mostrarMensagem("");

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao carregar clientes."
        );

    }

}


/* =========================================
   RENDERIZAR
========================================= */

function renderizarClientes(
    clientes
) {

    clientesCarregados = clientes;

    atualizarListaFiltrada();

}


function normalizarTextoBusca(valor) {
    return String(valor || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .trim();
}


function atualizarListaFiltrada() {

    const termo = normalizarTextoBusca(buscaClientes.value);
    const situacao = filtroPublicacao.value;
    const filtrados = clientesCarregados.filter(cliente => {
        const correspondeBusca = !termo || normalizarTextoBusca(
            `${cliente.name || ""} ${cliente.slug || ""}`
        ).includes(termo);

        const correspondeSituacao = situacao === "todos" ||
            (situacao === "publicado" && cliente.published) ||
            (situacao === "rascunho" && !cliente.published);

        return correspondeBusca && correspondeSituacao;
    });

    lista.innerHTML = "";


    if (!clientesCarregados.length) {

        const vazio =
            document.createElement("div");

        vazio.className =
            "vazio";

        vazio.textContent =
            "Nenhum cliente cadastrado.";

        lista.appendChild(vazio);
        resumoClientes.textContent = "";

        return;

    }


    resumoClientes.textContent =
        `Exibindo ${filtrados.length} de ${clientesCarregados.length} clientes.`;


    if (!filtrados.length) {
        const vazio = document.createElement("div");
        vazio.className = "vazio";
        vazio.textContent = "Nenhum cliente corresponde à busca ou ao filtro.";
        lista.appendChild(vazio);
        return;
    }


    filtrados.forEach(
        cliente => {

            lista.appendChild(
                criarCardCliente(
                    cliente
                )
            );

        }
    );

}


buscaClientes.addEventListener("input", atualizarListaFiltrada);
filtroPublicacao.addEventListener("change", atualizarListaFiltrada);


/* =========================================
   CARD
========================================= */

function criarCardCliente(
    cliente
) {

    const card =
        document.createElement("article");

    card.className =
        "cliente";


    const topo =
        document.createElement("div");

    topo.className =
        "cliente-topo";


    const informacoes =
        document.createElement("div");


    const titulo =
        document.createElement("h3");

    titulo.textContent =
        cliente.name ||
        "Cliente";


    const slug =
        document.createElement("div");

    slug.className =
        "slug";

    slug.textContent =
        cliente.slug;


    informacoes.appendChild(
        titulo
    );

    informacoes.appendChild(
        slug
    );


    const status =
        document.createElement("span");

    status.className =
        cliente.published
            ? "status publicado"
            : "status rascunho";

    status.textContent =
        cliente.published
            ? "Publicado"
            : "Rascunho";


    topo.appendChild(
        informacoes
    );

    topo.appendChild(
        status
    );


    const acoes =
        document.createElement("div");

    acoes.className =
        "acoes";


    const editar =
        document.createElement("a");

    editar.className =
        "editar";

    editar.href =
        `./?cliente=${encodeURIComponent(
            cliente.slug
        )}`;

    editar.textContent =
        "Editar";


    const visualizar =
        document.createElement("a");

    visualizar.href =
        `../?cliente=${encodeURIComponent(
            cliente.slug
        )}`;

    visualizar.target =
        "_blank";

    visualizar.rel =
        "noopener noreferrer";

    visualizar.textContent =
        "Visualizar";

    if (cliente.published) {
        const urlPublica = new URL("../", window.location.href);
        urlPublica.searchParams.set("cliente", cliente.slug);
        const qrUrl = new URL("https://api.qrserver.com/v1/create-qr-code/");
        qrUrl.searchParams.set("size", "600x600");
        qrUrl.searchParams.set("format", "png");
        qrUrl.searchParams.set("data", urlPublica.href);

        const qr = document.createElement("a");
        qr.href = qrUrl.href;
        qr.target = "_blank";
        qr.rel = "noopener noreferrer";
        qr.textContent = "QR Code";
        qr.title = "Abrir o QR Code em alta resolução para salvar ou imprimir";
        acoes.appendChild(qr);
    }


    const publicar =
        document.createElement("button");

    publicar.type =
        "button";

    publicar.textContent =
        cliente.published
            ? "Despublicar"
            : "Publicar";


    publicar.onclick =
        () =>
            alterarPublicacao(
                cliente
            );


    const duplicar =
        document.createElement("button");

    duplicar.type =
        "button";

    duplicar.textContent =
        "Duplicar";

    duplicar.onclick =
        () => duplicarCliente(cliente, duplicar);


    acoes.appendChild(
        editar
    );

    acoes.appendChild(
        visualizar
    );

    acoes.appendChild(
        publicar
    );

    acoes.appendChild(
        duplicar
    );


    card.appendChild(
        topo
    );

    card.appendChild(
        acoes
    );


    return card;

}


async function duplicarCliente(cliente, botao) {
    botao.disabled = true;
    botao.textContent = "Duplicando...";
    mostrarMensagem(`Duplicando ${cliente.name || "cliente"}...`);

    try {
        const { data, error } = await supabaseClient
            .from("clients")
            .select("config")
            .eq("id", cliente.id)
            .eq("owner_id", usuarioAtual.id)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error("Não foi possível carregar a configuração do cliente.");
        }

        const nomeCopia = `${cliente.name || "Cliente"} (cópia)`;
        const configCopia = JSON.parse(JSON.stringify(
            data.config && typeof data.config === "object" && !Array.isArray(data.config)
                ? data.config
                : {}
        ));

        if (
            !configCopia.perfil ||
            typeof configCopia.perfil !== "object" ||
            Array.isArray(configCopia.perfil)
        ) {
            configCopia.perfil = {};
        }
        configCopia.perfil.nome = nomeCopia;

        await inserirClienteComSlug(nomeCopia, configCopia, false);

        buscaClientes.value = nomeCopia;
        filtroPublicacao.value = "todos";
        await carregarClientes();
        mostrarMensagem("Cópia criada como rascunho. Revise os dados antes de publicar.");
    } catch (erro) {
        console.error(erro);
        mostrarMensagem(erro.message || "Não foi possível duplicar o cliente.");
    } finally {
        botao.disabled = false;
        botao.textContent = "Duplicar";
    }
}


/* =========================================
   PUBLICAR / DESPUBLICAR
========================================= */

async function alterarPublicacao(
    cliente
) {

    const novoEstado =
        !cliente.published;

    if (novoEstado) {
        const pendencias = itensObrigatoriosPendentes(cliente.config, cliente.name);
        if (pendencias.length) {
            mostrarMensagem(`Complete antes de publicar: ${pendencias.join(", ")}. Abra “Editar” para corrigir.`);
            return;
        }
    }


    mostrarMensagem(
        novoEstado
            ? "Publicando..."
            : "Despublicando..."
    );


    try {

        const {
            error
        } = await supabaseClient
            .from("clients")
            .update({
                published:
                    novoEstado,

                updated_at:
                    new Date().toISOString()
            })
            .eq(
                "id",
                cliente.id
            )
            .eq(
                "owner_id",
                usuarioAtual.id
            );


        if (error) {
            throw error;
        }


        await carregarClientes();


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao alterar publicação."
        );

    }

}


/* =========================================
   MODAL
========================================= */

document
    .getElementById("novoCliente")
    .addEventListener(
        "click",
        () => {

            novoNome.value = "";
            novoDescricao.value = "";
            novoWhatsApp.value = "";
            novoInstagram.value = "";
            novoEndereco.value = "";
            novoMapa.value = "";

            modalFundo.classList.add(
                "aberto"
            );

            novoNome.focus();

        }
    );


document
    .getElementById("cancelar")
    .addEventListener(
        "click",
        fecharModal
    );


modalFundo.addEventListener(
    "click",
    evento => {

        if (
            evento.target ===
            modalFundo
        ) {

            fecharModal();

        }

    }
);


function fecharModal() {

    modalFundo.classList.remove(
        "aberto"
    );

}


/* =========================================
   GERAR SLUG
========================================= */

function gerarSlug(nome) {
    return nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 36)
        .replace(/-+$/g, "") || "cliente";
}


function criarLinkWhatsApp(valor) {
    const informado = valor.trim();
    if (!informado) return "";

    let telefone = informado.replace(/\D/g, "");
    if (telefone.startsWith("0")) {
        telefone = telefone.slice(1);
    }

    if (telefone.length === 10 || telefone.length === 11) {
        telefone = `55${telefone}`;
    }

    if (!/^55\d{10,11}$/.test(telefone)) {
        throw new Error("Informe um telefone com DDD válido para o WhatsApp.");
    }

    return `https://wa.me/${telefone}`;
}


function criarLinkInstagram(valor) {
    const informado = valor.trim();
    if (!informado) return "";

    let usuario = informado.replace(/^@/, "");
    if (/^(www\.)?instagram\.com\//i.test(usuario)) {
        usuario = `https://${usuario}`;
    }

    if (/^https?:\/\//i.test(usuario)) {
        let url;
        try {
            url = new URL(usuario);
        } catch {
            throw new Error("Informe um usuário ou link válido do Instagram.");
        }
        const host = url.hostname.toLowerCase();
        if (!['instagram.com', 'www.instagram.com', 'm.instagram.com'].includes(host)) {
            throw new Error("Informe um usuário ou link válido do Instagram.");
        }
        usuario = url.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (!/^[A-Za-z0-9._]{1,30}$/.test(usuario)) {
        throw new Error("Informe um usuário ou link válido do Instagram.");
    }

    return `https://www.instagram.com/${usuario}/`;
}


function validarLinkMapa(valor) {
    const informado = valor.trim();
    if (!informado) return "";

    let url;
    try {
        url = new URL(informado);
    } catch {
        throw new Error("Informe um link válido para o mapa.");
    }

    if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error("O link do mapa deve começar com http:// ou https://.");
    }

    return url.href;
}


async function inserirClienteComSlug(nome, config, publicado = false) {
    const slugBase = gerarSlug(nome);

    for (let numero = 1; numero <= 100; numero++) {
        const slug = numero === 1
            ? slugBase
            : `${slugBase}-${numero}`;

        const { data: existente, error: erroBusca } = await supabaseClient
            .from("clients")
            .select("slug")
            .eq("slug", slug)
            .eq("owner_id", usuarioAtual.id)
            .limit(1);

        if (erroBusca) {
            throw erroBusca;
        }

        if (existente?.length) {
            continue;
        }

        config.id = slug;

        const resultado = await supabaseClient
            .from("clients")
            .insert({
                owner_id: usuarioAtual.id,
                slug,
                name: nome,
                config,
                published: publicado
            })
            .select()
            .single();

        if (!resultado.error) {
            return resultado.data;
        }

        // Outra criação pode ocupar o slug depois da consulta.
        if (resultado.error.code !== "23505") {
            throw resultado.error;
        }
    }

    throw new Error("Não foi possível encontrar um slug livre para este cliente.");
}


/* =========================================
   CRIAR CLIENTE
========================================= */

document
    .getElementById("criar")
    .addEventListener(
        "click",
        criarCliente
    );


async function criarCliente() {

    const nome =
        novoNome.value.trim();


    if (!nome) {

        alert(
            "Digite o nome do cliente."
        );

        return;

    }


    const botao =
        document.getElementById(
            "criar"
        );


    botao.disabled =
        true;

    botao.textContent =
        "Criando...";


    try {

        const descricao = novoDescricao.value.trim();
        const whatsapp = criarLinkWhatsApp(novoWhatsApp.value);
        const instagram = criarLinkInstagram(novoInstagram.value);
        const endereco = novoEndereco.value.trim();
        const mapa = validarLinkMapa(novoMapa.value);

        const config = {

            tema: "botanic",

            marca: {
                mostrarBioPro: true
            },

            perfil: {

                nome: nome,

                descricao,

                logo: ""

            },

            destaque: {

                imagem: "",

                alt: ""

            },

            links: [

                {

                    nome:
                        "Agendar pelo WhatsApp",

                    icone:
                        "whatsapp",

                    url: whatsapp,

                    ativo:
                        Boolean(whatsapp)

                },

                {

                    nome:
                        "Instagram",

                    icone:
                        "instagram",

                    url: instagram,

                    ativo:
                        Boolean(instagram)

                }

            ],

            servicos: [],

            portfolio: [],

            localizacao: {

                ativo: Boolean(endereco || mapa),

                endereco,

                mapa

            },

            redes: {

                instagram: "",

                facebook: "",

                tiktok: ""

            },

            componentes: {

                perfil: true,

                links: true,

                destaque: false,

                servicos: true,

                portfolio: false,

                localizacao: Boolean(endereco || mapa),

                redes: false,

                rodape: true

            },

            ordem: [

                "perfil",

                "links",

                "destaque",

                "servicos",

                "portfolio",

                "localizacao",

                "redes",

                "rodape"

            ]

        };


        const data = await inserirClienteComSlug(nome, config, false);


        fecharModal();


        window.location.href =
            `./?cliente=${encodeURIComponent(
                data.slug
            )}`;


    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao criar cliente: " +
            erro.message
        );


        botao.disabled =
            false;

        botao.textContent =
            "Criar cliente";

    }

}


/* =========================================
   SAIR
========================================= */

document
    .getElementById("sair")
    .addEventListener(
        "click",
        async () => {

            await supabaseClient.auth.signOut();

            window.location.href =
                "./login.html";

        }
    );


/* =========================================
   INICIAR
========================================= */

carregarClientes();
