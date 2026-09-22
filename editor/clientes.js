let usuarioAtual = null;


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

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


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
                "id, slug, name, published, updated_at"
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

    lista.innerHTML = "";


    if (!clientes.length) {

        const vazio =
            document.createElement("div");

        vazio.className =
            "vazio";

        vazio.textContent =
            "Nenhum cliente cadastrado.";

        lista.appendChild(vazio);

        return;

    }


    clientes.forEach(
        cliente => {

            lista.appendChild(
                criarCardCliente(
                    cliente
                )
            );

        }
    );

}


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

    visualizar.textContent =
        "Visualizar";


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


    acoes.appendChild(
        editar
    );

    acoes.appendChild(
        visualizar
    );

    acoes.appendChild(
        publicar
    );


    card.appendChild(
        topo
    );

    card.appendChild(
        acoes
    );


    return card;

}


/* =========================================
   PUBLICAR / DESPUBLICAR
========================================= */

async function alterarPublicacao(
    cliente
) {

    const novoEstado =
        !cliente.published;


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

async function gerarProximoSlug() {

    const {
        data,
        error
    } = await supabaseClient
        .from("clients")
        .select("slug");


    if (error) {
        throw error;
    }


    let maiorNumero = 0;


    (data || []).forEach(
        cliente => {

            const resultado =
                cliente.slug.match(
                    /^cliente-(\d+)$/
                );


            if (resultado) {

                const numero =
                    Number(
                        resultado[1]
                    );


                if (
                    numero >
                    maiorNumero
                ) {

                    maiorNumero =
                        numero;

                }

            }

        }
    );


    const proximo =
        maiorNumero + 1;


    return (
        "cliente-" +
        String(proximo).padStart(
            3,
            "0"
        )
    );

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

        const slug =
            await gerarProximoSlug();


        const config = {

            id: slug,

            tema: "botanic",

            marca: {
                mostrarBioPro: true
            },

            perfil: {

                nome: nome,

                descricao:
                    "Beleza, cuidado e autoestima em cada detalhe.",

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

                    url:
                        "",

                    ativo:
                        true

                },

                {

                    nome:
                        "Instagram",

                    icone:
                        "instagram",

                    url:
                        "",

                    ativo:
                        true

                }

            ],

            servicos: [],

            portfolio: [],

            localizacao: {

                ativo: true,

                endereco: "",

                mapa: ""

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

                localizacao: true,

                redes: true,

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


        const {
            data,
            error
        } = await supabaseClient
            .from("clients")
            .insert({

                owner_id:
                    usuarioAtual.id,

                slug:
                    slug,

                name:
                    nome,

                config:
                    config,

                published:
                    false

            })
            .select()
            .single();


        if (error) {
            throw error;
        }


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