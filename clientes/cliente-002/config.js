/* ========================================
   BIOPRO
   CLIENTE 002
   ======================================== */

const BIOPRO_CONFIG = {

    id: "cliente-002",

    tema: "luxury",


    marca: {

        mostrarBioPro: true

    },


    perfil: {

        nome: "Studio Elegance",

        descricao:
            "Beleza, sofisticação e cuidado em cada detalhe.",

        logo:
            "clientes/cliente-002/assets/logo/logo.png"

    },


    destaque: {

        imagem:
            "clientes/cliente-002/assets/fotos/destaque.jpg",

        alt:
            "Imagem de destaque do Studio Elegance"

    },


    links: [

        {

            nome:
                "Agendar atendimento",

            icone:
                "agenda",

            url:
                "#",

            ativo:
                true

        },

        {

            nome:
                "WhatsApp",

            icone:
                "whatsapp",

            url:
                "#",

            ativo:
                true

        },

        {

            nome:
                "Instagram",

            icone:
                "instagram",

            url:
                "#",

            ativo:
                true

        }

    ],


    servicos: [

        {

            nome:
                "Corte e finalização",

            descricao:
                "Atendimento personalizado.",

            ativo:
                true

        },

        {

            nome:
                "Coloração",

            descricao:
                "Técnicas personalizadas para cada cliente.",

            ativo:
                true

        },

        {

            nome:
                "Tratamentos",

            descricao:
                "Cuidados e recuperação dos fios.",

            ativo:
                true

        }

    ],


    portfolio: [],


    localizacao: {

        ativo:
            true,

        endereco:
            "Endereço do Studio Elegance",

        mapa:
            "#"

    },


    redes: {

        instagram:
            "#",

        facebook:
            "#",

        tiktok:
            "#"

    },


    componentes: {

        perfil:
            true,

        links:
            true,

        destaque:
            true,

        servicos:
            true,

        portfolio:
            true,

        localizacao:
            true,

        redes:
            true,

        rodape:
            true

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