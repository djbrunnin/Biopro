const parametros =
    new URLSearchParams(
        window.location.search
    );


const cliente =
    parametros.get("cliente") ||
    "cliente-001";


let CONFIG =
    null;


/* ================================
   ELEMENTOS
   ================================ */

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

const mensagem =
    document.getElementById("mensagem");

const linksEditor =
    document.getElementById(
        "linksEditor"
    );

const servicosEditor =
    document.getElementById(
        "servicosEditor"
    );


/* ================================
   CARREGAR CONFIG
   ================================ */

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

    } catch (erro) {

        console.error(
            erro
        );

        mostrarMensagem(
            "Não foi possível carregar o cliente."
        );
    }
}


/* ================================
   EXTRAIR CONFIG
   ================================ */

function extrairConfiguracao(
    texto
) {

    const inicio =
        texto.indexOf(
            "const BIOPRO_CONFIG ="
        );

    if (
        inicio === -1
    ) {
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


/* ================================
   PREENCHER EDITOR
   ================================ */

function preencherEditor() {

    nome.value =
        CONFIG.perfil?.nome ||
        "";

    descricao.value =
        CONFIG.perfil?.descricao ||
        "";

    tema.value =
        CONFIG.tema ||
        "botanic";

    endereco.value =
        CONFIG.localizacao?.endereco ||
        "";

    mapa.value =
        CONFIG.localizacao?.mapa ||
        "";


    preencherLinks();

    preencherServicos();

    preencherComponentes();
}


/* ================================
   LINKS
   ================================ */

function preencherLinks() {

    linksEditor.innerHTML =
        "";

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
        function () {

            item.remove();

        };


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
        "Ícone: whatsapp, instagram...";

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


/* ================================
   ADICIONAR LINK
   ================================ */

document
    .getElementById(
        "adicionarLink"
    )
    .addEventListener(
        "click",
        function () {

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


/* ================================
   SERVIÇOS
   ================================ */

function preencherServicos() {

    servicosEditor.innerHTML =
        "";

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
        function () {

            item.remove();

        };


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
        "Nome do serviço";

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


/* ================================
   ADICIONAR SERVIÇO
   ================================ */

document
    .getElementById(
        "adicionarServico"
    )
    .addEventListener(
        "click",
        function () {

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


/* ================================
   COMPONENTES
   ================================ */

function preencherComponentes() {

    const componentes =
        CONFIG.componentes || {};


    document.getElementById(
        "compPerfil"
    ).checked =
        componentes.perfil !== false;


    document.getElementById(
        "compLinks"
    ).checked =
        componentes.links !== false;


    document.getElementById(
        "compDestaque"
    ).checked =
        componentes.destaque !== false;


    document.getElementById(
        "compServicos"
    ).checked =
        componentes.servicos !== false;


    document.getElementById(
        "compPortfolio"
    ).checked =
        componentes.portfolio !== false;


    document.getElementById(
        "compLocalizacao"
    ).checked =
        componentes.localizacao !== false;


    document.getElementById(
        "compRedes"
    ).checked =
        componentes.redes !== false;


    document.getElementById(
        "compRodape"
    ).checked =
        componentes.rodape !== false;
}


/* ================================
   COLETAR LINKS
   ================================ */

function coletarLinks() {

    const itens =
        linksEditor.querySelectorAll(
            ".editor-item"
        );

    const resultado = [];


    itens.forEach(
        item => {

            const inputs =
                item.querySelectorAll(
                    "input"
                );

            resultado.push({

                nome:
                    inputs[0]?.value || "",

                url:
                    inputs[1]?.value || "",

                icone:
                    inputs[2]?.value || "",

                ativo:
                    true

            });

        }
    );


    return resultado;
}


/* ================================
   COLETAR SERVIÇOS
   ================================ */

function coletarServicos() {

    const itens =
        servicosEditor.querySelectorAll(
            ".editor-item"
        );

    const resultado = [];


    itens.forEach(
        item => {

            const nome =
                item.querySelector(
                    "input"
                );

            const descricao =
                item.querySelector(
                    "textarea"
                );


            resultado.push({

                nome:
                    nome?.value || "",

                descricao:
                    descricao?.value || "",

                ativo:
                    true

            });

        }
    );


    return resultado;
}


/* ================================
   ATUALIZAR CONFIG
   ================================ */

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


    CONFIG.componentes =
        CONFIG.componentes || {};


    CONFIG.componentes.perfil =
        document.getElementById(
            "compPerfil"
        ).checked;


    CONFIG.componentes.links =
        document.getElementById(
            "compLinks"
        ).checked;


    CONFIG.componentes.destaque =
        document.getElementById(
            "compDestaque"
        ).checked;


    CONFIG.componentes.servicos =
        document.getElementById(
            "compServicos"
        ).checked;


    CONFIG.componentes.portfolio =
        document.getElementById(
            "compPortfolio"
        ).checked;


    CONFIG.componentes.localizacao =
        document.getElementById(
            "compLocalizacao"
        ).checked;


    CONFIG.componentes.redes =
        document.getElementById(
            "compRedes"
        ).checked;


    CONFIG.componentes.rodape =
        document.getElementById(
            "compRodape"
        ).checked;
}


/* ================================
   VISUALIZAR
   ================================ */

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


/* ================================
   SALVAR
   ================================ */

document
    .getElementById(
        "salvar"
    )
    .addEventListener(
        "click",
        function () {

            atualizarConfiguracao();

            console.log(
                CONFIG
            );

            mostrarMensagem(
                "Configuração atualizada na memória. Salvamento permanente será conectado na próxima etapa."
            );

        }
    );


/* ================================
   MENSAGEM
   ================================ */

function mostrarMensagem(
    texto
) {

    mensagem.textContent =
        texto;
}


/* ================================
   INICIAR
   ================================ */

carregarConfiguracao();