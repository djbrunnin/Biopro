/* ========================================
   BIOPRO
   THEMES.JS
   SISTEMA DE TEMAS
   ======================================== */

const BIOPRO_THEMES = {

    botanic: {
        nome: "Botanic",

        cores: {
            background: "#f8f6f0",
            surface: "#ffffff",
            primary: "#66796b",
            primaryDark: "#4f6255",
            secondary: "#c8a96b",
            text: "#26352d",
            textLight: "#68736c",
            border: "#e5e0d5"
        },

        fontes: {
            principal: "Arial, sans-serif"
        }
    },


    luxury: {
        nome: "Luxury",

        cores: {
            background: "#f5f2ed",
            surface: "#ffffff",
            primary: "#302d2a",
            primaryDark: "#1f1d1b",
            secondary: "#b99a5b",
            text: "#292623",
            textLight: "#746e68",
            border: "#ded8cf"
        },

        fontes: {
            principal: "Georgia, serif"
        }
    }

};


/* ========================================
   APLICAR TEMA
   ======================================== */

function aplicarTemaCompleto(nomeTema) {

    const tema =
        BIOPRO_THEMES[nomeTema] ||
        BIOPRO_THEMES.luxury;

    const root =
        document.documentElement;


    root.style.setProperty(
        "--color-background",
        tema.cores.background
    );

    root.style.setProperty(
        "--color-surface",
        tema.cores.surface
    );

    root.style.setProperty(
        "--color-primary",
        tema.cores.primary
    );

    root.style.setProperty(
        "--color-primary-dark",
        tema.cores.primaryDark
    );

    root.style.setProperty(
        "--color-secondary",
        tema.cores.secondary
    );

    root.style.setProperty(
        "--color-text",
        tema.cores.text
    );

    root.style.setProperty(
        "--color-text-light",
        tema.cores.textLight
    );

    root.style.setProperty(
        "--color-border",
        tema.cores.border
    );

    root.style.setProperty(
        "--font-main",
        tema.fontes.principal
    );


    document.body.dataset.theme =
        nomeTema || "botanic";
}