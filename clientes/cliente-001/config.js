/* ========================================
   BIOPRO
   CLIENTE 001
   CONFIGURAÇÃO
   ======================================== */

const BIOPRO_CONFIG = {

    /* ====================================
       IDENTIFICAÇÃO
       ==================================== */

    id: "cliente-001",

    tema: "botanic",


    /* ====================================
       PERFIL
       ==================================== */

    perfil: {

        nome: "Nome do Salão",

        descricao:
            "Beleza, cuidado e autoestima em cada detalhe.",

        logo:
            "clientes/cliente-001/assets/logo/logo.png"

    },


    /* ====================================
       DESTAQUE
       ==================================== */

    destaque: {

        imagem:
            "clientes/cliente-001/assets/fotos/destaque.jpg"

    },


    /* ====================================
       LINKS
       ==================================== */

    links: [

        {
            nome: "Agendar pelo WhatsApp",

            icone: "whatsapp",

            url: "https://wa.me/",

            ativo: true
        },

        {
            nome: "Instagram",

            icone: "instagram",

            url: "#",

            ativo: true
        },

        {
            nome: "Conheça nossos serviços",

            icone: "servicos",

            url: "#servicos",

            ativo: true
        }

    ],


    /* ====================================
       SERVIÇOS
       ==================================== */

    servicos: [

        {
            nome: "Corte",

            descricao:
                "Corte personalizado.",

            ativo: true
        },

        {
            nome: "Coloração",

            descricao:
                "Coloração e transformação.",

            ativo: true
        },

        {
            nome: "Tratamentos",

            descricao:
                "Cuidados para seus cabelos.",

            ativo: true
        }

    ],


    /* ====================================
       PORTFÓLIO
       ==================================== */

    portfolio: [

        "clientes/cliente-001/assets/fotos/foto-01.jpg",

        "clientes/cliente-001/assets/fotos/foto-02.jpg",

        "clientes/cliente-001/assets/fotos/foto-03.jpg"

    ],


    /* ====================================
       LOCALIZAÇÃO
       ==================================== */

    localizacao: {

        ativo: true,

        endereco:
            "Endereço do estabelecimento",

        mapa:
            "#"

    },


    /* ====================================
       REDES SOCIAIS
       ==================================== */

    redes: {

        instagram: "#",

        facebook: "#",

        tiktok: "#"

    },


    /* ====================================
       COMPONENTES ATIVOS
       ==================================== */

    componentes: {

        perfil: true,

        links: true,

        destaque: true,

        servicos: true,

        portfolio: true,

        localizacao: true,

        redes: true,

        rodape: true

    },


    /* ====================================
       ORDEM DOS COMPONENTES
       ==================================== */

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