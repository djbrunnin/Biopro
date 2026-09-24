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
            principal:
                "Arial, sans-serif"
        },

        estilo: {
            raio: "16px",
            sombra:
                "0 8px 25px rgba(0,0,0,0.06)"
        }

    },


    luxury: {

        nome: "Luxury",

        cores: {
            background: "#f4f1eb",
            surface: "#ffffff",
            primary: "#302d2a",
            primaryDark: "#1f1d1b",
            secondary: "#b99a5b",
            text: "#292623",
            textLight: "#746e68",
            border: "#ddd6ca"
        },

        fontes: {
            principal:
                "Georgia, serif"
        },

        estilo: {
            raio: "12px",
            sombra:
                "0 10px 30px rgba(0,0,0,0.08)"
        }

    },


    romantic: {

        nome: "Romantic",

        cores: {
            background: "#faf4f3",
            surface: "#ffffff",
            primary: "#9b7375",
            primaryDark: "#7d595c",
            secondary: "#c9a3a5",
            text: "#443637",
            textLight: "#806f70",
            border: "#eadbdc"
        },

        fontes: {
            principal:
                "Georgia, serif"
        },

        estilo: {
            raio: "20px",
            sombra:
                "0 8px 25px rgba(120,80,80,0.08)"
        }

    },


    barber: {

        nome: "Barber",

        cores: {
            background: "#eeeeeb",
            surface: "#ffffff",
            primary: "#252525",
            primaryDark: "#111111",
            secondary: "#9a7b4f",
            text: "#222222",
            textLight: "#686868",
            border: "#d8d8d4"
        },

        fontes: {
            principal:
                "Arial, sans-serif"
        },

        estilo: {
            raio: "8px",
            sombra:
                "0 8px 20px rgba(0,0,0,0.08)"
        }

    }

};


/* ========================================
   APLICAR TEMA
   ======================================== */

function aplicarTemaCompleto(nomeTema) {

    const tema =
        BIOPRO_THEMES[nomeTema] ||
        BIOPRO_THEMES.botanic;

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

    root.style.setProperty(
        "--radius-medium",
        tema.estilo.raio
    );

    root.style.setProperty(
        "--shadow-soft",
        tema.estilo.sombra
    );


    document.body.dataset.theme =
        nomeTema || "botanic";
}