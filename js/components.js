/* ========================================
   BIOPRO
   COMPONENTS.JS
   COMPONENTES DA PÁGINA
   ======================================== */


/* ========================================
   CRIAR ELEMENTO
   ======================================== */

function criarElemento(
    tag,
    classes = []
) {

    const elemento =
        document.createElement(tag);

    classes.forEach(classe => {

        elemento.classList.add(classe);

    });

    return elemento;

}


/* ========================================
   PERFIL
   ======================================== */

function renderPerfil(config) {

    const section =
        criarElemento(
            "section",
            ["bio-profile"]
        );


    /* ====================================
       LOGO
       ==================================== */

    if (
        config.perfil &&
        config.perfil.logo
    ) {

        const img =
            document.createElement("img");

        img.src =
            config.perfil.logo;

        img.alt =
            `Logo de ${
                config.perfil.nome ||
                "cliente"
            }`;

        img.className =
            "bio-logo";

        img.loading = "eager";

        section.appendChild(img);

    }


    /* ====================================
       NOME
       ==================================== */

    const nome =
        document.createElement("h1");

    nome.textContent =
        config.perfil?.nome || "";

    section.appendChild(nome);


    /* ====================================
       DESCRIÇÃO
       ==================================== */

    if (
        config.perfil?.descricao
    ) {

        const descricao =
            document.createElement("p");

        descricao.textContent =
            config.perfil.descricao;

        section.appendChild(
            descricao
        );

    }


    return section;
}

/* ========================================
   LINKS
   ======================================== */

function renderLinks(config) {

    const section =
        criarElemento(
            "section",
            ["bio-links"]
        );

    if (
        typeof renderizarLinks !==
        "function"
    ) {

        return section;

    }

    const links =
        renderizarLinks(
            config.links || []
        );

    links.forEach(link => {

        section.appendChild(link);

    });

    return section;

}


/* ========================================
   IMAGEM DE DESTAQUE
   ======================================== */


function renderDestaque(config) {

    if (
        !config.destaque ||
        !config.destaque.imagem
    ) {

        return null;

    }


    const section =
        criarElemento(
            "section",
            ["bio-highlight"]
        );


    const img =
        document.createElement("img");


    img.src =
        config.destaque.imagem;


    img.alt =
        config.destaque.alt ||
        "Imagem de destaque";


    img.loading =
        "lazy";


    img.onerror = function () {

        section.style.display =
            "none";

    };


    section.appendChild(img);


    return section;
}

/* ========================================
   SERVIÇOS
   ======================================== */

function renderServicos(config) {

    const section =
        criarElemento(
            "section",
            ["bio-services"]
        );

    const titulo =
        document.createElement("h2");

    titulo.textContent =
        "Serviços";

    section.appendChild(titulo);


    const servicos =
        config.servicos || [];


    servicos
        .filter(
            servico =>
                servico.ativo !== false
        )
        .forEach(servico => {

            const item =
                criarElemento(
                    "article",
                    ["service-item"]
                );


            const nome =
                document.createElement("h3");

            nome.textContent =
                servico.nome || "";

            item.appendChild(nome);


            if (servico.descricao) {

                const descricao =
                    document.createElement("p");

                descricao.textContent =
                    servico.descricao;

                item.appendChild(
                    descricao
                );

            }


            section.appendChild(item);

        });


    return section;

}


/* ========================================
   PORTFÓLIO
   ======================================== */

function renderPortfolio(config) {

    const fotos =
        config.portfolio || [];


    if (!fotos.length) {

        return null;

    }


    const section =
        criarElemento(
            "section",
            ["bio-portfolio"]
        );


    const titulo =
        document.createElement("h2");

    titulo.textContent =
        "Portfólio";

    section.appendChild(titulo);


    const gallery =
        criarElemento(
            "div",
            ["portfolio-grid"]
        );


    fotos.forEach(
        (foto, index) => {

            if (!foto) {
                return;
            }


            const img =
                document.createElement("img");


            img.src =
                foto;


            img.alt =
                `Foto do portfólio ${
                    index + 1
                }`;


            img.loading =
                "lazy";


            img.onerror =
                function () {

                    this.style.display =
                        "none";

                };


            gallery.appendChild(img);

        }
    );


    if (!gallery.children.length) {

        return null;

    }


    section.appendChild(
        gallery
    );


    return section;
}


/* ========================================
   LOCALIZAÇÃO
   ======================================== */

function renderLocalizacao(config) {

    if (
        !config.localizacao ||
        !config.localizacao.ativo
    ) {

        return null;

    }


    const section =
        criarElemento(
            "section",
            ["bio-location"]
        );


    const titulo =
        document.createElement("h2");

    titulo.textContent =
        "Localização";

    section.appendChild(titulo);


    if (
        config.localizacao.endereco
    ) {

        const endereco =
            document.createElement("p");

        endereco.textContent =
            config.localizacao.endereco;

        section.appendChild(endereco);

    }


    if (
        config.localizacao.mapa
    ) {

        const link =
            document.createElement("a");

        link.href =
            config.localizacao.mapa;

        link.target =
            "_blank";

        link.rel =
            "noopener noreferrer";

        link.textContent =
            "Ver localização";

        section.appendChild(link);

    }


    return section;

}


/* ========================================
   REDES SOCIAIS
   ======================================== */

function renderRedes(config) {

    const section =
        criarElemento(
            "section",
            ["bio-social"]
        );


    const redes =
        config.redes || {};


    Object.entries(redes)
        .forEach(
            ([nome, url]) => {

                if (
                    !url ||
                    url === "#"
                ) {

                    return;

                }


                const link =
                    document.createElement("a");

                link.href =
                    url;

                link.target =
                    "_blank";

                link.rel =
                    "noopener noreferrer";

                link.textContent =
                    nome;


                section.appendChild(link);

            }
        );


    return section;

}


/* ========================================
   RODAPÉ
   ======================================== */

function renderRodape() {

    const footer =
        document.createElement(
            "footer"
        );

    footer.className =
        "bio-footer";


    const texto =
        document.createElement(
            "span"
        );


    if (
        BIOPRO_CONFIG.marca &&
        BIOPRO_CONFIG.marca.mostrarBioPro
    ) {

        texto.textContent =
            "Criado por by BioPro (62)99193-8647";

    } else {

        texto.textContent =
            "";

    }


    footer.appendChild(
        texto
    );


    return footer;
}

/* ========================================
   CONTROLADOR DE COMPONENTES
   ======================================== */

function renderizarComponente(
    nome,
    config
) {

    switch (nome) {

        case "perfil":

            return renderPerfil(
                config
            );


        case "links":

            return renderLinks(
                config
            );


        case "destaque":

            return renderDestaque(
                config
            );


        case "servicos":

            return renderServicos(
                config
            );


        case "portfolio":

            return renderPortfolio(
                config
            );


        case "localizacao":

            return renderLocalizacao(
                config
            );


        case "redes":

            return renderRedes(
                config
            );


        case "rodape":

            return renderRodape();


        default:

            console.warn(
                `Componente não encontrado: ${nome}`
            );

            return null;

    }

}