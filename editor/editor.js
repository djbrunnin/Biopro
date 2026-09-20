/* ========================================
   BIOPRO
   EDITOR.JS
   ======================================== */


/* ========================================
   OBTER CLIENTE
   ======================================== */

const parametros =
    new URLSearchParams(
        window.location.search
    );


const cliente =
    parametros.get("cliente") ||
    "cliente-001";


/* ========================================
   ELEMENTOS
   ======================================== */

const nome =
    document.getElementById("nome");


const descricao =
    document.getElementById("descricao");


const tema =
    document.getElementById("tema");


const whatsapp =
    document.getElementById("whatsapp");


const instagram =
    document.getElementById("instagram");


const endereco =
    document.getElementById("endereco");


const mapa =
    document.getElementById("mapa");


const mensagem =
    document.getElementById("mensagem");


/* ========================================
   CARREGAR CONFIGURAÇÃO
   ======================================== */

async function carregarConfiguracao() {

    try {

        const resposta =
            await fetch(
                `../clientes/${cliente}/config.js`
            );


        const texto =
            await resposta.text();


        const dados =
            extrairConfiguracao(
                texto
            );


        preencherEditor(
            dados
        );


    } catch (erro) {

        console.error(
            erro
        );

        mostrarMensagem(
            "Não foi possível carregar o cliente."
        );

    }

}


/* ========================================
   EXTRAIR CONFIGURAÇÃO
   ======================================== */

function extrairConfiguracao(texto) {

    const inicio =
        texto.indexOf(
            "const BIOPRO_CONFIG ="
        );


    if (
        inicio === -1
    ) {

        return null;

    }


    /*
       Esta primeira versão usa
       avaliação controlada do objeto
       existente.
    */

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
            .replace(/;$/, "");


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


/* ========================================
   PREENCHER EDITOR
   ======================================== */

function preencherEditor(
    config
) {

    if (!config) {
        return;
    }


    nome.value =
        config.perfil?.nome ||
        "";


    descricao.value =
        config.perfil?.descricao ||
        "";


    tema.value =
        config.tema ||
        "botanic";


    whatsapp.value =
        encontrarLink(
            config,
            "whatsapp"
        );


    instagram.value =
        config.redes?.instagram ||
        "";


    endereco.value =
        config.localizacao?.endereco ||
        "";


    mapa.value =
        config.localizacao?.mapa ||
        "";

}


/* ========================================
   ENCONTRAR LINK
   ======================================== */

function encontrarLink(
    config,
    tipo
) {

    const links =
        config.links || [];


    const link =
        links.find(
            item =>
                item.icone === tipo
        );


    return link?.url || "";

}


/* ========================================
   MOSTRAR MENSAGEM
   ======================================== */

function mostrarMensagem(
    texto
) {

    mensagem.textContent =
        texto;

}


/* ========================================
   VISUALIZAR
   ======================================== */

document
    .getElementById("visualizar")
    .addEventListener(
        "click",
        () => {

            window.open(
                `../?cliente=${cliente}`,
                "_blank"
            );

        }
    );


/* ========================================
   SALVAR
   ======================================== */

document
    .getElementById("salvar")
    .addEventListener(
        "click",
        () => {

            mostrarMensagem(
                "Configuração preparada."
            );

        }
    );


/* ========================================
   INICIAR
   ======================================== */

carregarConfiguracao();