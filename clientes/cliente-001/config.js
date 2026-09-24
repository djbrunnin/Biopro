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

	marca: {
		mostrarBioPro: true
	},


    /* ====================================
       PERFIL
       ==================================== */

    perfil: {

        nome: "Casa Botanic Hair",

        descricao:
            "Beleza, cuidado e autoestima em cada detalhe. Especialista em loiros",

        logo:
            "clientes/cliente-001/assets/logo/logo.png"

    },


    /* ====================================
       DESTAQUE
       ==================================== */

	destaque: {

		imagem:
			"clientes/cliente-001/assets/fotos/destaque.png",

		alt:
			"Trabalho realizado pelo salão"

	},


    /* ====================================
       LINKS
       ==================================== */

    links: [

        {
            nome: "Agendar pelo WhatsApp",

            icone: "whatsapp",

            url: "https://wa.me/62995739222",

            ativo: true
        },

        {
            nome: "Instagram",

            icone: "instagram",

            url: "https://www.instagram.com/casa.botanic.hair/",

            ativo: true
        },

        {
            nome: "Conheça nossos serviços",

            icone: "servicos",

            url: "https://www.instagram.com/casa.botanic.hair/",

            ativo: true
        }

    ],


    /* ====================================
       SERVIÇOS
       ==================================== */

    servicos: [

        {
            nome: "Luzes",

            descricao:
                "Loiros e Manutenção.",

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
		
		"clientes/cliente-001/assets/fotos/foto-04.jpg",
		
		"clientes/cliente-001/assets/fotos/foto-05.jpg",
		
		"clientes/cliente-001/assets/fotos/foto-06.jpg",

        "clientes/cliente-001/assets/fotos/foto-03.jpg"

    ],


    /* ====================================
       LOCALIZAÇÃO
       ==================================== */

    localizacao: {

        ativo: true,

        endereco:
            "R. Wilson Cordeiro da Silva Porangatu - GO, 76550-000",

        mapa:
            "https://maps.app.goo.gl/hhXuzrpK5iUTY5zw6"

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