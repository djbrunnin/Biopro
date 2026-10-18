const BIOPRO_THEME_KEYS_RESERVED = new Set([
    "botanic",
    "luxury",
    "romantic",
    "barber",
    "oceanGold",
    "climatizacaoEnergia"
]);

const BIOPRO_THEME_COLORS_REQUIRED = [
    "background",
    "surface",
    "primary",
    "primaryDark",
    "secondary",
    "text",
    "textLight",
    "border"
];

const BIOPRO_THEME_COLORS_OPTIONAL = [
    "accentGold",
    "highlightBackground",
    "highlightText"
];

const BIOPRO_THEME_FONTS_ALLOWED = new Set([
    "Arial, sans-serif",
    "Georgia, serif",
    "Verdana, sans-serif",
    "Tahoma, sans-serif",
    "Trebuchet MS, sans-serif",
    "system-ui, sans-serif"
]);

function bioproLuminancia(cor) {
    const canais = cor.slice(1).match(/.{2}/g).map(canal => {
        const valor = parseInt(canal, 16) / 255;
        return valor <= 0.04045
            ? valor / 12.92
            : ((valor + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * canais[0] + 0.7152 * canais[1] + 0.0722 * canais[2];
}


function bioproContraste(corA, corB) {
    const luminanciaA = bioproLuminancia(corA);
    const luminanciaB = bioproLuminancia(corB);
    const clara = Math.max(luminanciaA, luminanciaB);
    const escura = Math.min(luminanciaA, luminanciaB);
    return (clara + 0.05) / (escura + 0.05);
}


function validarTemaImportado(valor) {
    const erros = [];

    if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
        return { valido: false, erros: ["O JSON precisa ser um objeto."] };
    }

    const camposRaiz = ["key", "nome", "cores", "fontes", "estilo"];
    if (new Blob([JSON.stringify(valor)]).size > 30 * 1024) {
        erros.push("O JSON do tema deve ter no máximo 30 KB.");
    }

    const camposExtras = Object.keys(valor).filter(campo => !camposRaiz.includes(campo));
    if (camposExtras.length) {
        erros.push(`Campos não reconhecidos: ${camposExtras.join(", ")}.`);
    }

    if (typeof valor.key !== "string" || !/^[a-z][a-zA-Z0-9]{0,39}$/.test(valor.key)) {
        erros.push("key deve começar com letra minúscula e conter apenas letras e números (até 40 caracteres).");
    } else if (BIOPRO_THEME_KEYS_RESERVED.has(valor.key)) {
        erros.push("Esse identificador já pertence a um tema integrado ao sistema.");
    }

    if (typeof valor.nome !== "string" || !valor.nome.trim() || valor.nome.trim().length > 60) {
        erros.push("nome é obrigatório e deve ter até 60 caracteres.");
    }

    const cores = valor.cores;
    if (!cores || typeof cores !== "object" || Array.isArray(cores)) {
        erros.push("cores precisa ser um objeto.");
    } else {
        const permitidas = [...BIOPRO_THEME_COLORS_REQUIRED, ...BIOPRO_THEME_COLORS_OPTIONAL];
        const extras = Object.keys(cores).filter(cor => !permitidas.includes(cor));
        if (extras.length) {
            erros.push(`Cores não reconhecidas: ${extras.join(", ")}.`);
        }

        BIOPRO_THEME_COLORS_REQUIRED.forEach(cor => {
            if (typeof cores[cor] !== "string" || !/^#[\da-fA-F]{6}$/.test(cores[cor])) {
                erros.push(`cores.${cor} precisa ser uma cor hexadecimal de 6 dígitos.`);
            }
        });

        BIOPRO_THEME_COLORS_OPTIONAL.forEach(cor => {
            if (cores[cor] !== undefined &&
                (typeof cores[cor] !== "string" || !/^#[\da-fA-F]{6}$/.test(cores[cor]))) {
                erros.push(`cores.${cor} precisa ser uma cor hexadecimal de 6 dígitos.`);
            }
        });

        const paresContraste = [
            ["text", "background", "texto sobre o fundo"],
            ["text", "surface", "texto sobre os cartões"],
            ["textLight", "surface", "texto secundário sobre os cartões"],
            ["primary", "surface", "links sobre os cartões"],
            [
                "highlightText",
                "highlightBackground",
                "texto do destaque",
                cores.primary,
                "#FFFFFF"
            ]
        ];

        paresContraste.forEach(([frente, fundo, descricao, fallbackFrente, fallbackFundo]) => {
            const corFrente = cores[frente] || fallbackFrente;
            const corFundo = cores[fundo] || fallbackFundo;
            if (/^#[\da-fA-F]{6}$/.test(corFrente || "") &&
                /^#[\da-fA-F]{6}$/.test(corFundo || "") &&
                bioproContraste(corFrente, corFundo) < 4.5) {
                erros.push(`Contraste insuficiente para ${descricao}; ajuste as cores para pelo menos 4,5:1.`);
            }
        });
    }

    if (
        !valor.fontes ||
        typeof valor.fontes !== "object" ||
        Array.isArray(valor.fontes) ||
        !BIOPRO_THEME_FONTS_ALLOWED.has(valor.fontes.principal)
    ) {
        erros.push("fontes.principal deve usar uma das fontes seguras disponíveis no sistema.");
    }

    if (!valor.estilo || typeof valor.estilo !== "object" || Array.isArray(valor.estilo)) {
        erros.push("estilo precisa ser um objeto.");
    } else {
        if (typeof valor.estilo.raio !== "string" || !/^(\d+(\.\d+)?(px|rem|em))$/.test(valor.estilo.raio)) {
            erros.push("estilo.raio deve ser um comprimento CSS em px, rem ou em.");
        }

        const sombraSegura = /^none$|^0(?: -?\d+(?:\.\d+)?px){2,3} rgba\(\s*(?:25[0-5]|2[0-4]\d|1\d\d|\d?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1\d\d|\d?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1\d\d|\d?\d)\s*,\s*(?:0(?:\.\d+)?|1(?:\.0+)?)\)$/;
        if (typeof valor.estilo.sombra !== "string" || !sombraSegura.test(valor.estilo.sombra)) {
            erros.push("estilo.sombra deve ser none ou uma sombra rgba em formato simples, com canais RGB entre 0 e 255 e opacidade entre 0 e 1.");
        }
    }

    if (erros.length) {
        return { valido: false, erros };
    }

    const coresSeguras = {};
    [...BIOPRO_THEME_COLORS_REQUIRED, ...BIOPRO_THEME_COLORS_OPTIONAL].forEach(cor => {
        if (cores[cor] !== undefined) {
            coresSeguras[cor] = cores[cor].toUpperCase();
        }
    });

    return {
        valido: true,
        erros: [],
        tema: {
            key: valor.key,
            dados: {
                nome: valor.nome.trim(),
                cores: coresSeguras,
                fontes: { principal: valor.fontes.principal },
                estilo: {
                    raio: valor.estilo.raio,
                    sombra: valor.estilo.sombra
                }
            }
        }
    };
}
