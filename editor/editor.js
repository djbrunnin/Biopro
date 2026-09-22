const parametros =
    new URLSearchParams(
        window.location.search
    );


const cliente =
    parametros.get("cliente") ||
    "cliente-001";


let CONFIG = null;


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


/* ==================================
   CARREGAR CLIENTE
   ================================== */

async function carregarConfiguracao() {

    try {

        const resposta =
            await fetch(
                `../clientes/${cliente}/config.js`
            );

        if (!resposta.ok) {
            throw new Error(
                "Cliente não encontrado."
            );
        }

        const texto =
            await resposta.text();

        CONFIG =
            extrairConfiguracao(
                texto
            );

        if (!CONFIG) {
            throw new Error(
                "Configuração inválida."
            );
        }

        preencherEditor();

        atualizarPreview();

    } catch (erro) {

        console.error(
            erro
        );

        mostrarMensagem(
            "Erro ao carregar cliente."
        );

    }

}


/* ==================================
   EXTRAIR CONFIG
   ================================== */

function extrairConfiguracao(
    texto
) {

    const inicio =
        texto.indexOf(
            "const BIOPRO_CONFIG ="
        );

    if (inicio === -1) {
        return null;
    }

    const codigo =
        texto.substring(
            inicio
        );

    const expressao =
        codigo
            .replace(
                "const BIOPRO_CONFIG =",
                ""
            )
            .trim()
            .replace(
                /;$/,
                ""
            );

    try {

        return Function(
            `"use strict";
             return (${expressao});`
        )();

    } catch (erro) {

        console.error(
            erro
        );

        return null;
    }

}


/* ==================================
   PREENCHER
   ================================== */

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


/* ==================================
   LINKS
   ================================== */

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
        document.createElement(
            "div"
        );

    item.className =
        "editor-item";


    const header =
        document.createElement(
            "div"
        );

    header.className =
        "editor-item-header";


    const titulo =
        document.createElement(
            "strong"
        );

    titulo.textContent =
        `Link ${index + 1}`;


    const remover =
        document.createElement(
            "button"
        );

    remover.className =
        "remover";

    remover.type =
        "button";

    remover.textContent =
        "Remover";


    remover.onclick =
        () => item.remove();


    header.appendChild(
        titulo
    );

    header.appendChild(
        remover
    );


    const nomeInput =
        document.createElement(
            "input"
        );

    nomeInput.placeholder =
        "Nome do botão";

    nomeInput.value =
        link.nome || "";


    const urlInput =
        document.createElement(
            "input"
        );

    urlInput.placeholder =
        "URL";

    urlInput.value =
        link.url || "";


    const iconeInput =
        document.createElement(
            "input"
        );

    iconeInput.placeholder =
        "Ícone";

    iconeInput.value =
        link.icone || "";


    item.appendChild(
        header
    );

    item.appendChild(
        nomeInput
    );

    item.appendChild(
        urlInput
    );

    item.appendChild(
        iconeInput
    );


    linksEditor.appendChild(
        item
    );

}


/* ==================================
   NOVO LINK
   ================================== */

document
    .getElementById(
        "adicionarLink"
    )
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


/* ==================================
   SERVIÇOS
   ================================== */

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
        document.createElement(
            "div"
        );

    item.className =
        "editor-item";


    const header =
        document.createElement(
            "div"
        );

    header.className =
        "editor-item-header";


    const titulo =
        document.createElement(
            "strong"
        );

    titulo.textContent =
        `Serviço ${index + 1}`;


    const remover =
        document.createElement(
            "button"
        );

    remover.className =
        "remover";

    remover.type =
        "button";

    remover.textContent =
        "Remover";


    remover.onclick =
        () => item.remove();


    header.appendChild(
        titulo
    );

    header.appendChild(
        remover
    );


    const nomeInput =
        document.createElement(
            "input"
        );

    nomeInput.placeholder =
        "Nome";

    nomeInput.value =
        servico.nome || "";


    const descricaoInput =
        document.createElement(
            "textarea"
        );

    descricaoInput.placeholder =
        "Descrição";

    descricaoInput.value =
        servico.descricao || "";


    item.appendChild(
        header
    );

    item.appendChild(
        nomeInput
    );

    item.appendChild(
        descricaoInput
    );


    servicosEditor.appendChild(
        item
    );

}


/* ==================================
   NOVO SERVIÇO
   ================================== */

document
    .getElementById(
        "adicionarServico"
    )
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


/* ==================================
   PORTFÓLIO
   ================================== */

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
        document.createElement(
            "div"
        );

    item.className =
        "editor-item";


    const header =
        document.createElement(
            "div"
        );

    header.className =
        "editor-item-header";


    const titulo =
        document.createElement(
            "strong"
        );

    titulo.textContent =
        `Foto ${index + 1}`;


    const remover =
        document.createElement(
            "button"
        );

    remover.className =
        "remover";

    remover.type =
        "button";

    remover.textContent =
        "Remover";


    remover.onclick =
        () => item.remove();


    header.appendChild(
        titulo
    );

    header.appendChild(
        remover
    );


    const input =
        document.createElement(
            "input"
        );

    input.placeholder =
        "Caminho da imagem";

    input.value =
        foto || "";


    item.appendChild(
        header
    );

    item.appendChild(
        input
    );


    portfolioEditor.appendChild(
        item
    );

}


/* ==================================
   NOVA FOTO
   ================================== */

document
    .getElementById(
        "adicionarFoto"
    )
    .addEventListener(
        "click",
        () => {

            criarEditorFoto(
                "",
                portfolioEditor.children.length
            );

        }
    );


/* ==================================
   COMPONENTES
   ================================== */

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
        nome => {

            const chave =
                nome
                    .charAt(0)
                    .toLowerCase() +
                nome.slice(1);

            const elemento =
                document.getElementById(
                    "comp" + nome
                );

            if (elemento) {

                elemento.checked =
                    componentes[chave] !== false;

            }

        }
    );

}


/* ==================================
   ORDEM
   ================================== */

function preencherOrdem() {

    ordemEditor.innerHTML = "";

    const ordem =
        CONFIG.ordem ||
        Object.keys(
            nomesComponentes
        );


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
        document.createElement(
            "div"
        );

    item.className =
        "ordem-item";

    item.dataset.componente =
        componente;


    const nome =
        document.createElement(
            "span"
        );

    nome.className =
        "ordem-nome";

    nome.textContent =
        nomesComponentes[
            componente
        ] || componente;


    const botoes =
        document.createElement(
            "div"
        );

    botoes.className =
        "ordem-botoes";


    const cima =
        document.createElement(
            "button"
        );

    cima.type =
        "button";

    cima.textContent =
        "↑";


    cima.onclick =
        () => moverOrdem(
            item,
            -1
        );


    const baixo =
        document.createElement(
            "button"
        );

    baixo.type =
        "button";

    baixo.textContent =
        "↓";


    baixo.onclick =
        () => moverOrdem(
            item,
            1
        );


    botoes.appendChild(
        cima
    );

    botoes.appendChild(
        baixo
    );


    item.appendChild(
        nome
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


/* ==================================
   COLETAR ORDEM
   ================================== */

function coletarOrdem() {

    return [
        ...ordemEditor.children
    ].map(
        item =>
            item.dataset.componente
    );

}


/* ==================================
   ATUALIZAR CONFIG
   ================================== */

function atualizarConfiguracao() {

    CONFIG.perfil =
        CONFIG.perfil || {};

    CONFIG.perfil.nome =
        nome.value;

    CONFIG.perfil.descricao =
        descricao.value;


    CONFIG.tema =
        tema.value;


    CONFIG.localizacao =
        CONFIG.localizacao || {};

    CONFIG.localizacao.endereco =
        endereco.value;

    CONFIG.localizacao.mapa =
        mapa.value;


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


    atualizarPreview();

}


/* ==================================
   COLETAR SERVIÇOS
   ================================== */

function coletarServicos() {

    return [
        ...servicosEditor.children
    ].map(
        item => {

            const inputs =
                item.querySelectorAll(
                    "input, textarea"
                );

            return {

                nome:
                    inputs[0]?.value || "",

                descricao:
                    inputs[1]?.value || "",

                ativo:
                    true

            };

        }
    );

}


/* ==================================
   COLETAR LINKS
   ================================== */

function coletarLinks() {

    return [
        ...linksEditor.children
    ].map(
        item => {

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

                ativo:
                    true

            };

        }
    );

}


/* ==================================
   COLETAR PORTFÓLIO
   ================================== */

function coletarPortfolio() {

    return [
        ...portfolioEditor.children
    ]
        .map(
            item => {

                const input =
                    item.querySelector(
                        "input"
                    );

                return input?.value || "";

            }
        )
        .filter(
            foto => foto
        );

}


/* ==================================
   PREVIEW
   ================================== */

function atualizarPreview() {

    if (!CONFIG) {
        return;
    }


    const url =
        `../?cliente=${encodeURIComponent(
            cliente
        )}`;


    preview.src =
        url;

}


/* ==================================
   VISUALIZAR
   ================================== */

function visualizar() {

    window.open(
        `../?cliente=${cliente}`,
        "_blank"
    );

}


document
    .getElementById(
        "visualizar"
    )
    .addEventListener(
        "click",
        visualizar
    );


document
    .getElementById(
        "visualizarTopo"
    )
    .addEventListener(
        "click",
        visualizar
    );


/* ==================================
   PREPARAR
   ================================== */

document
    .getElementById(
        "salvar"
    )
    .addEventListener(
        "click",
        () => {

            atualizarConfiguracao();

            console.log(
                CONFIG
            );

            mostrarMensagem(
                "Configuração atualizada. O salvamento permanente será conectado na próxima etapa."
            );

        }
    );


/* ==================================
   MENSAGEM
   ================================== */

function mostrarMensagem(
    texto
) {

    mensagem.textContent =
        texto;

}


/* ==================================
   INICIAR
   ================================== */

carregarConfiguracao();