const parametros =
    new URLSearchParams(
        window.location.search
    );

const cliente =
    parametros.get("cliente") ||
    "cliente-001";

let CONFIG = null;

let PUBLICADO = true;

const nomesComponentes = {
    perfil: "Perfil",
    links: "Links",
    destaque: "Destaque",
    servicos: "Serviços",
    portfolio: "Portfólio",
    localizacao: "Localização",
    redes: "Redes sociais",
    rodape: "Rodapé"
};


/* =========================================
   ELEMENTOS
========================================= */

const nome =
    document.getElementById("nome");

const descricao =
    document.getElementById("descricao");

const tema =
    document.getElementById("tema");

const endereco =
    document.getElementById("endereco");

const mapa =
    document.getElementById("mapa");

const linksEditor =
    document.getElementById("linksEditor");

const servicosEditor =
    document.getElementById("servicosEditor");

const portfolioEditor =
    document.getElementById("portfolioEditor");

const ordemEditor =
    document.getElementById("ordemEditor");

const mensagem =
    document.getElementById("mensagem");

const preview =
    document.getElementById("preview");

const logoUpload =
    document.getElementById("logoUpload");

const logoStatus =
    document.getElementById("logoStatus");


/* =========================================
   VERIFICAR LOGIN
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

    return true;
}

/* =========================================
   UPLOAD DO LOGO
========================================= */

logoUpload.addEventListener(
    "change",
    async function () {

        const arquivo =
            this.files[0];

        if (!arquivo) return;


        const logado =
            await verificarLogin();

        if (!logado) return;


        if (!arquivo.type.startsWith("image/")) {

            logoStatus.textContent =
                "Selecione uma imagem.";

            return;

        }


        logoStatus.textContent =
            "Enviando logo...";


        try {

            const extensao =
                arquivo.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            const caminho =
                `${cliente}/logo-${Date.now()}.${extensao}`;


            const {
                error: uploadError
            } = await supabaseClient
                .storage
                .from("biopro-assets")
                .upload(
                    caminho,
                    arquivo,
                    {
                        upsert: true,
                        contentType:
                            arquivo.type
                    }
                );


            if (uploadError) {
                throw uploadError;
            }


            const {
                data
            } = supabaseClient
                .storage
                .from("biopro-assets")
                .getPublicUrl(
                    caminho
                );


            CONFIG.perfil =
                CONFIG.perfil || {};


            CONFIG.perfil.logo =
                data.publicUrl;


            logoStatus.textContent =
                "✅ Logo enviada. Clique em salvar.";


        } catch (erro) {

            console.error(erro);

            logoStatus.textContent =
                "❌ Erro ao enviar logo: " +
                erro.message;

        }

    }
);

/* =========================================
   CARREGAR CONFIGURAÇÃO DO SUPABASE
========================================= */

async function carregarConfiguracao() {

    const logado =
        await verificarLogin();

    if (!logado) return;

    try {

        mostrarMensagem(
            "Carregando cliente..."
        );


        const {
            data,
            error
        } = await supabaseClient
            .from("clients")
            .select(
                "id, slug, name, config, published"
            )
            .eq("slug", cliente)
            .maybeSingle();


        if (error) {
            throw error;
        }


        if (!data) {

            mostrarMensagem(
                "Cliente não encontrado no Supabase."
            );

            return;
        }


        CONFIG =
            data.config || {};

        PUBLICADO =
            data.published === true;


        CONFIG.id =
            CONFIG.id || data.slug;


        preencherEditor();

        atualizarPreview();

        mostrarMensagem(
            "Cliente carregado."
        );


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao carregar cliente."
        );

    }

}


/* =========================================
   PREENCHER EDITOR
========================================= */

function preencherEditor() {

    nome.value =
        CONFIG.perfil?.nome || "";

    descricao.value =
        CONFIG.perfil?.descricao || "";

    tema.value =
        CONFIG.tema || "botanic";

    endereco.value =
        CONFIG.localizacao?.endereco || "";

    mapa.value =
        CONFIG.localizacao?.mapa || "";


    preencherLinks();

    preencherServicos();

    preencherPortfolio();

    preencherComponentes();

    preencherOrdem();

}


/* =========================================
   LINKS
========================================= */

function preencherLinks() {

    linksEditor.innerHTML = "";

    const links =
        CONFIG.links || [];

    links.forEach(
        (link, index) => {

            criarEditorLink(
                link,
                index
            );

        }
    );

}


function criarEditorLink(
    link,
    index
) {

    const item =
        document.createElement("div");

    item.className =
        "editor-item";


    const header =
        document.createElement("div");

    header.className =
        "editor-item-header";


    const titulo =
        document.createElement("strong");

    titulo.textContent =
        `Link ${index + 1}`;


    const remover =
        document.createElement("button");

    remover.className =
        "remover";

    remover.type =
        "button";

    remover.textContent =
        "Remover";


    remover.onclick =
        () => item.remove();


    header.appendChild(titulo);

    header.appendChild(remover);


    const nomeInput =
        document.createElement("input");

    nomeInput.placeholder =
        "Nome do botão";

    nomeInput.value =
        link.nome || "";


    const urlInput =
        document.createElement("input");

    urlInput.placeholder =
        "URL";

    urlInput.value =
        link.url || "";


    const iconeInput =
        document.createElement("input");

    iconeInput.placeholder =
        "Ícone";

    iconeInput.value =
        link.icone || "";


    item.appendChild(header);

    item.appendChild(nomeInput);

    item.appendChild(urlInput);

    item.appendChild(iconeInput);

    linksEditor.appendChild(item);

}


document
    .getElementById("adicionarLink")
    .addEventListener(
        "click",
        () => {

            criarEditorLink(
                {
                    nome: "",
                    url: "",
                    icone: "",
                    ativo: true
                },
                linksEditor.children.length
            );

        }
    );


/* =========================================
   SERVIÇOS
========================================= */

function preencherServicos() {

    servicosEditor.innerHTML = "";

    const servicos =
        CONFIG.servicos || [];

    servicos.forEach(
        (servico, index) => {

            criarEditorServico(
                servico,
                index
            );

        }
    );

}


function criarEditorServico(
    servico,
    index
) {

    const item =
        document.createElement("div");

    item.className =
        "editor-item";


    const header =
        document.createElement("div");

    header.className =
        "editor-item-header";


    const titulo =
        document.createElement("strong");

    titulo.textContent =
        `Serviço ${index + 1}`;


    const remover =
        document.createElement("button");

    remover.className =
        "remover";

    remover.type =
        "button";

    remover.textContent =
        "Remover";


    remover.onclick =
        () => item.remove();


    header.appendChild(titulo);

    header.appendChild(remover);


    const nomeInput =
        document.createElement("input");

    nomeInput.placeholder =
        "Nome";

    nomeInput.value =
        servico.nome || "";


    const descricaoInput =
        document.createElement("textarea");

    descricaoInput.placeholder =
        "Descrição";

    descricaoInput.value =
        servico.descricao || "";


    item.appendChild(header);

    item.appendChild(nomeInput);

    item.appendChild(descricaoInput);

    servicosEditor.appendChild(item);

}


document
    .getElementById("adicionarServico")
    .addEventListener(
        "click",
        () => {

            criarEditorServico(
                {
                    nome: "",
                    descricao: "",
                    ativo: true
                },
                servicosEditor.children.length
            );

        }
    );


/* =========================================
   PORTFÓLIO
========================================= */

function preencherPortfolio() {

    portfolioEditor.innerHTML = "";

    const fotos =
        CONFIG.portfolio || [];

    fotos.forEach(
        (foto, index) => {

            criarEditorFoto(
                foto,
                index
            );

        }
    );

}


function criarEditorFoto(
    foto,
    index
) {

    const item =
        document.createElement("div");

    item.className =
        "editor-item";


    const header =
        document.createElement("div");

    header.className =
        "editor-item-header";


    const titulo =
        document.createElement("strong");

    titulo.textContent =
        `Foto ${index + 1}`;


    const remover =
        document.createElement("button");

    remover.className =
        "remover";

    remover.type =
        "button";

    remover.textContent =
        "Remover";


    remover.onclick =
        () => item.remove();


    header.appendChild(titulo);

    header.appendChild(remover);


    const input =
        document.createElement("input");

    input.placeholder =
        "Caminho da imagem";

    input.value =
        foto || "";


    item.appendChild(header);

    item.appendChild(input);

    portfolioEditor.appendChild(item);

}


document
    .getElementById("adicionarFoto")
    .addEventListener(
        "click",
        () => {

            criarEditorFoto(
                "",
                portfolioEditor.children.length
            );

        }
    );


/* =========================================
   COMPONENTES
========================================= */

function preencherComponentes() {

    const componentes =
        CONFIG.componentes || {};


    const ids = [
        "Perfil",
        "Links",
        "Destaque",
        "Servicos",
        "Portfolio",
        "Localizacao",
        "Redes",
        "Rodape"
    ];


    ids.forEach(
        nomeComponente => {

            const chave =
                nomeComponente
                    .charAt(0)
                    .toLowerCase() +
                nomeComponente.slice(1);


            const elemento =
                document.getElementById(
                    "comp" +
                    nomeComponente
                );


            if (elemento) {

                elemento.checked =
                    componentes[chave] !== false;

            }

        }
    );

}


/* =========================================
   ORDEM
========================================= */

function preencherOrdem() {

    ordemEditor.innerHTML = "";

    const ordem =
        CONFIG.ordem ||
        Object.keys(nomesComponentes);


    ordem.forEach(
        componente => {

            criarItemOrdem(
                componente
            );

        }
    );

}


function criarItemOrdem(
    componente
) {

    const item =
        document.createElement("div");

    item.className =
        "ordem-item";

    item.dataset.componente =
        componente;


    const nomeElemento =
        document.createElement("span");

    nomeElemento.className =
        "ordem-nome";

    nomeElemento.textContent =
        nomesComponentes[componente] ||
        componente;


    const botoes =
        document.createElement("div");

    botoes.className =
        "ordem-botoes";


    const cima =
        document.createElement("button");

    cima.type =
        "button";

    cima.textContent =
        "↑";

    cima.onclick =
        () =>
            moverOrdem(
                item,
                -1
            );


    const baixo =
        document.createElement("button");

    baixo.type =
        "button";

    baixo.textContent =
        "↓";

    baixo.onclick =
        () =>
            moverOrdem(
                item,
                1
            );


    botoes.appendChild(cima);

    botoes.appendChild(baixo);


    item.appendChild(
        nomeElemento
    );

    item.appendChild(
        botoes
    );


    ordemEditor.appendChild(
        item
    );

}


function moverOrdem(
    item,
    direcao
) {

    if (direcao < 0) {

        const anterior =
            item.previousElementSibling;

        if (anterior) {

            ordemEditor.insertBefore(
                item,
                anterior
            );

        }

    } else {

        const proximo =
            item.nextElementSibling;

        if (proximo) {

            ordemEditor.insertBefore(
                proximo,
                item
            );

        }

    }

}


function coletarOrdem() {

    return [
        ...ordemEditor.children
    ].map(
        item =>
            item.dataset.componente
    );

}


/* =========================================
   COLETAR DADOS
========================================= */

function coletarLinks() {

    return [
        ...linksEditor.children
    ]
        .map(item => {

            const inputs =
                item.querySelectorAll(
                    "input"
                );


            return {

                nome:
                    inputs[0]?.value || "",

                url:
                    inputs[1]?.value || "",

                icone:
                    inputs[2]?.value || "",

                ativo: true

            };

        })
        .filter(
            link =>
                link.nome ||
                link.url
        );

}


function coletarServicos() {

    return [
        ...servicosEditor.children
    ]
        .map(item => {

            const inputs =
                item.querySelectorAll(
                    "input, textarea"
                );


            return {

                nome:
                    inputs[0]?.value || "",

                descricao:
                    inputs[1]?.value || "",

                ativo: true

            };

        })
        .filter(
            servico =>
                servico.nome ||
                servico.descricao
        );

}


function coletarPortfolio() {

    return [
        ...portfolioEditor.children
    ]
        .map(item => {

            const input =
                item.querySelector(
                    "input"
                );

            return input?.value || "";

        })
        .filter(
            foto => foto
        );

}


/* =========================================
   ATUALIZAR CONFIGURAÇÃO
========================================= */

function atualizarConfiguracao() {

    CONFIG.perfil =
        CONFIG.perfil || {};


    CONFIG.perfil.nome =
        nome.value.trim();


    CONFIG.perfil.descricao =
        descricao.value.trim();


    CONFIG.tema =
        tema.value;


    CONFIG.localizacao =
        CONFIG.localizacao || {};


    CONFIG.localizacao.endereco =
        endereco.value.trim();


    CONFIG.localizacao.mapa =
        mapa.value.trim();


    CONFIG.links =
        coletarLinks();


    CONFIG.servicos =
        coletarServicos();


    CONFIG.portfolio =
        coletarPortfolio();


    CONFIG.componentes =
        CONFIG.componentes || {};


    const mapaComponentes = {

        perfil: "compPerfil",

        links: "compLinks",

        destaque: "compDestaque",

        servicos: "compServicos",

        portfolio: "compPortfolio",

        localizacao: "compLocalizacao",

        redes: "compRedes",

        rodape: "compRodape"

    };


    Object.keys(
        mapaComponentes
    ).forEach(
        chave => {

            CONFIG.componentes[chave] =
                document.getElementById(
                    mapaComponentes[chave]
                ).checked;

        }
    );


    CONFIG.ordem =
        coletarOrdem();


    return CONFIG;

}


/* =========================================
   SALVAR NO SUPABASE
========================================= */

async function salvarConfiguracao() {

    const logado =
        await verificarLogin();

    if (!logado) return;


    atualizarConfiguracao();


    mostrarMensagem(
        "Salvando..."
    );


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("clients")
            .update({

                name:
                    CONFIG.perfil?.nome ||
                    "Cliente",

                config:
                    CONFIG,

                updated_at:
                    new Date().toISOString()

            })
            .eq(
                "slug",
                cliente
            )
            .select()
            .single();


        if (error) {
            throw error;
        }


        CONFIG =
            data.config;


        mostrarMensagem(
            "✅ Alterações salvas com sucesso!"
        );


        atualizarPreview();


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "❌ Erro ao salvar: " +
            erro.message
        );

    }

}


/* =========================================
   PRÉ-VISUALIZAÇÃO
========================================= */

function atualizarPreview() {

    if (!preview) return;


    preview.onload =
        function () {

            preview.contentWindow.postMessage(
                {
                    tipo:
                        "BIOPRO_PREVIEW",

                    config:
                        CONFIG
                },
                window.location.origin
            );

        };


    preview.src =
        `../?cliente=${encodeURIComponent(
            cliente
        )}&preview=${Date.now()}`;

}


function visualizar() {

    window.open(
        `../?cliente=${encodeURIComponent(
            cliente
        )}`,
        "_blank"
    );

}


/* =========================================
   BOTÕES
========================================= */

document
    .getElementById("visualizar")
    .addEventListener(
        "click",
        visualizar
    );


document
    .getElementById("visualizarTopo")
    .addEventListener(
        "click",
        visualizar
    );


document
    .getElementById("salvar")
    .addEventListener(
        "click",
        salvarConfiguracao
    );


/* =========================================
   MENSAGEM
========================================= */

function mostrarMensagem(
    texto
) {

    mensagem.textContent =
        texto;

}


/* =========================================
   INICIAR
========================================= */

carregarConfiguracao();