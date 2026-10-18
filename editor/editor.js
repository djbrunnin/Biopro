const parametros =
    new URLSearchParams(
        window.location.search
    );

const cliente =
    parametros.get("cliente") ||
    "cliente-001";

let CONFIG = null;
let usuarioAtualId = null;
let previewInicializado = false;

let PUBLICADO = true;

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


/* =========================================
   ELEMENTOS
========================================= */

const nome =
    document.getElementById("nome");

const descricao =
    document.getElementById("descricao");

const logoImagemInput =
    document.getElementById("logoImagem");

const logoPreview =
    document.getElementById("logoPreview");

const logoStatus =
    document.getElementById("logoStatus");

const destaqueImagemInput =
    document.getElementById("destaqueImagem");

const destaquePreview =
    document.getElementById("destaquePreview");

const destaqueStatus =
    document.getElementById("destaqueStatus");

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


/* =========================================
   VERIFICAR LOGIN
========================================= */

async function verificarLogin() {

    if (typeof supabaseClient === "undefined") {
        mostrarMensagem("Não foi possível conectar ao Supabase. Recarregue a página.");
        return false;
    }

    let sessaoResultado;
    try {
        sessaoResultado = await supabaseClient.auth.getSession();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem("Não foi possível verificar sua sessão. Tente novamente.");
        return false;
    }

    const { data, error } = sessaoResultado;

    if (error) {

        console.error(error);

        window.location.href =
            "./login.html";

        return false;
    }

    if (!data.session) {

        window.location.href =
            "./login.html";

        return false;
    }

    usuarioAtualId = data.session.user.id;

    return true;
}


/* =========================================
   CARREGAR CONFIGURAÇÃO DO SUPABASE
========================================= */

async function carregarConfiguracao() {

    const logado =
        await verificarLogin();

    if (!logado) return;

    try {

        mostrarMensagem(
            "Carregando cliente..."
        );


        const {
            data,
            error
        } = await supabaseClient
            .from("clients")
            .select(
                "id, slug, name, config, published"
            )
            .eq("slug", cliente)
            .eq("owner_id", usuarioAtualId)
            .maybeSingle();


        if (error) {
            throw error;
        }


        if (!data) {

            mostrarMensagem(
                "Cliente não encontrado no Supabase."
            );

            return;
        }


        CONFIG =
            data.config || {};

        await carregarTemasPersonalizados();

        PUBLICADO =
            data.published === true;


        CONFIG.id =
            CONFIG.id || data.slug;


        preencherEditor();

        atualizarPreview();

        mostrarMensagem(
            "Cliente carregado."
        );


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao carregar cliente."
        );

    }

}


/* =========================================
   PREENCHER EDITOR
========================================= */

function preencherEditor() {

    nome.value =
        CONFIG.perfil?.nome || "";

    descricao.value =
        CONFIG.perfil?.descricao || "";

    tema.value =
        CONFIG.tema || "botanic";

    preencherLogo();
    preencherDestaque();

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


async function carregarTemasPersonalizados() {
    const { data, error } = await supabaseClient
        .from("biopro_themes")
        .select("theme_key, name, theme")
        .eq("is_active", true)
        .order("name", { ascending: true });

    if (error) {
        console.warn("Temas personalizados indisponíveis:", error.message);
        preservarTemaSelecionado(CONFIG.tema);
        return;
    }

    data?.forEach(item => {
        if (
            !/^[a-z][a-zA-Z0-9]{0,39}$/.test(item.theme_key || "") ||
            !item.theme ||
            typeof item.theme !== "object"
        ) {
            return;
        }

        BIOPRO_THEMES[item.theme_key] = item.theme;

        if (!Array.from(tema.options).some(opcao => opcao.value === item.theme_key)) {
            const opcao = document.createElement("option");
            opcao.value = item.theme_key;
            opcao.textContent = item.name;
            tema.appendChild(opcao);
        }
    });

    preservarTemaSelecionado(CONFIG.tema);
}


function preservarTemaSelecionado(chave) {
    if (!chave || Array.from(tema.options).some(opcao => opcao.value === chave)) {
        return;
    }

    const opcao = document.createElement("option");
    opcao.value = chave;
    opcao.textContent = `${chave} (tema indisponível)`;
    tema.appendChild(opcao);
}


function preencherLogo() {
    CONFIG.perfil = CONFIG.perfil || {};
    const imagem = CONFIG.perfil.logo || "";

    logoPreview.hidden = !imagem;
    if (imagem) {
        logoPreview.src = imagem;
    } else {
        logoPreview.removeAttribute("src");
    }

    logoStatus.textContent = imagem ? "Logo atual do cliente." : "";
}


function preencherDestaque() {
    CONFIG.destaque = CONFIG.destaque || {};
    const imagem = CONFIG.destaque.imagem || "";

    destaquePreview.hidden = !imagem;
    if (imagem) {
        destaquePreview.src = imagem;
    } else {
        destaquePreview.removeAttribute("src");
    }

    destaqueStatus.textContent = imagem ? "Imagem atual do cliente." : "";
}


function extensaoImagem(file) {
    const tiposPermitidos = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp"
    };

    return tiposPermitidos[file.type] || null;
}


async function enviarImagemParaStorage(file, categoria) {
    const extensao = extensaoImagem(file);
    if (!extensao) {
        throw new Error("Escolha uma imagem JPG, PNG ou WebP.");
    }

    if (file.size > 10 * 1024 * 1024) {
        throw new Error("A imagem deve ter no máximo 10 MB.");
    }

    if (!(await verificarLogin())) {
        throw new Error("Entre novamente para enviar imagens.");
    }

    const pasta = categoria === "logo" ? "logo" : "fotos";
    const caminho = `${cliente}/${pasta}/${categoria}-${crypto.randomUUID()}.${extensao}`;
    const armazenamento = supabaseClient.storage.from("biopro-assets");
    const { data, error } = await armazenamento.upload(caminho, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false
    });

    if (error) {
        throw error;
    }

    const { data: urlData } = armazenamento.getPublicUrl(data.path);
    return urlData.publicUrl;
}


async function processarUploadImagem(file, categoria, input, status, aoConcluir) {
    input.disabled = true;
    status.textContent = "Enviando imagem para o Supabase...";

    try {
        const url = await enviarImagemParaStorage(file, categoria);
        aoConcluir(url);
        atualizarPreviewDoEditor();
        status.textContent = "Imagem enviada e prévia atualizada.";
    } catch (erro) {
        console.error("Falha ao enviar imagem:", erro);
        status.textContent =
            erro.message || "Não foi possível enviar a imagem. Confira as permissões do Storage.";
    } finally {
        input.disabled = false;
        input.value = "";
    }
}


logoImagemInput.addEventListener("change", evento => {
    const file = evento.target.files?.[0];
    if (!file) return;

    processarUploadImagem(
        file,
        "logo",
        logoImagemInput,
        logoStatus,
        url => {
            CONFIG.perfil = CONFIG.perfil || {};
            CONFIG.perfil.logo = url;
            logoPreview.src = url;
            logoPreview.hidden = false;
        }
    );
});


destaqueImagemInput.addEventListener("change", evento => {
    const file = evento.target.files?.[0];
    if (!file) return;

    processarUploadImagem(
        file,
        "destaque",
        destaqueImagemInput,
        destaqueStatus,
        url => {
            CONFIG.destaque = CONFIG.destaque || {};
            CONFIG.destaque.imagem = url;
            destaquePreview.src = url;
            destaquePreview.hidden = false;
        }
    );
});


/* =========================================
   LINKS
========================================= */

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
        document.createElement("div");

    item.className =
        "editor-item";


    const header =
        document.createElement("div");

    header.className =
        "editor-item-header";


    const titulo =
        document.createElement("strong");

    titulo.textContent =
        `Link ${index + 1}`;


    const remover =
        document.createElement("button");

    remover.className =
        "remover";

    remover.type =
        "button";

    remover.textContent =
        "Remover";


    remover.onclick =
        () => item.remove();


    header.appendChild(titulo);

    header.appendChild(remover);


    const nomeInput =
        document.createElement("input");

    nomeInput.placeholder =
        "Nome do botão";

    nomeInput.value =
        link.nome || "";


    const urlInput =
        document.createElement("input");

    urlInput.placeholder =
        "URL";

    urlInput.value =
        link.url || "";


    const iconeInput =
        document.createElement("input");

    iconeInput.placeholder =
        "Ícone";

    iconeInput.value =
        link.icone || "";


    item.appendChild(header);

    item.appendChild(nomeInput);

    item.appendChild(urlInput);

    item.appendChild(iconeInput);

    linksEditor.appendChild(item);

}


document
    .getElementById("adicionarLink")
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


/* =========================================
   SERVIÇOS
========================================= */

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
        document.createElement("div");

    item.className =
        "editor-item";


    const header =
        document.createElement("div");

    header.className =
        "editor-item-header";


    const titulo =
        document.createElement("strong");

    titulo.textContent =
        `Serviço ${index + 1}`;


    const remover =
        document.createElement("button");

    remover.className =
        "remover";

    remover.type =
        "button";

    remover.textContent =
        "Remover";


    remover.onclick =
        () => item.remove();


    header.appendChild(titulo);

    header.appendChild(remover);


    const nomeInput =
        document.createElement("input");

    nomeInput.placeholder =
        "Nome";

    nomeInput.value =
        servico.nome || "";


    const descricaoInput =
        document.createElement("textarea");

    descricaoInput.placeholder =
        "Descrição";

    descricaoInput.value =
        servico.descricao || "";


    item.appendChild(header);

    item.appendChild(nomeInput);

    item.appendChild(descricaoInput);

    servicosEditor.appendChild(item);

}


document
    .getElementById("adicionarServico")
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


/* =========================================
   PORTFÓLIO
========================================= */

function preencherPortfolio() {

    portfolioEditor.innerHTML = "";

    const fotos =
        Array.isArray(CONFIG.portfolio) ? CONFIG.portfolio : [];

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
        document.createElement("div");

    item.className =
        "editor-item";

    item.dataset.imageUrl = foto || "";


    const header =
        document.createElement("div");

    header.className =
        "editor-item-header";


    const titulo =
        document.createElement("strong");

    titulo.textContent =
        `Foto ${index + 1}`;


    const remover =
        document.createElement("button");

    remover.className =
        "remover";

    remover.type =
        "button";

    remover.textContent =
        "Remover";


    remover.onclick =
        () => item.remove();


    header.appendChild(titulo);

    header.appendChild(remover);


    const input =
        document.createElement("input");

    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";

    const imagePreview = document.createElement("img");
    imagePreview.className = "editor-image-preview editor-image-preview-square";
    imagePreview.alt = `Prévia da foto ${index + 1} do portfólio`;
    imagePreview.hidden = !foto;
    if (foto) {
        imagePreview.src = foto;
    }

    const status = document.createElement("p");
    status.className = "upload-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.textContent = foto ? "Imagem atual do cliente." : "";

    input.addEventListener("change", evento => {
        const file = evento.target.files?.[0];
        if (!file) return;

        processarUploadImagem(
            file,
            "portfolio",
            input,
            status,
            url => {
                item.dataset.imageUrl = url;
                imagePreview.src = url;
                imagePreview.hidden = false;
            }
        );
    });


    item.appendChild(header);

    item.appendChild(input);

    item.appendChild(imagePreview);

    item.appendChild(status);

    portfolioEditor.appendChild(item);

}


document
    .getElementById("adicionarFoto")
    .addEventListener(
        "click",
        () => {

            criarEditorFoto(
                "",
                portfolioEditor.children.length
            );

        }
    );


/* =========================================
   COMPONENTES
========================================= */

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
        nomeComponente => {

            const chave =
                nomeComponente
                    .charAt(0)
                    .toLowerCase() +
                nomeComponente.slice(1);


            const elemento =
                document.getElementById(
                    "comp" +
                    nomeComponente
                );


            if (elemento) {

                elemento.checked =
                    componentes[chave] !== false;

            }

        }
    );

}


/* =========================================
   ORDEM
========================================= */

function preencherOrdem() {

    ordemEditor.innerHTML = "";

    const ordem =
        CONFIG.ordem ||
        Object.keys(nomesComponentes);


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
        document.createElement("div");

    item.className =
        "ordem-item";

    item.dataset.componente =
        componente;


    const nomeElemento =
        document.createElement("span");

    nomeElemento.className =
        "ordem-nome";

    nomeElemento.textContent =
        nomesComponentes[componente] ||
        componente;


    const botoes =
        document.createElement("div");

    botoes.className =
        "ordem-botoes";


    const cima =
        document.createElement("button");

    cima.type =
        "button";

    cima.textContent =
        "↑";

    cima.onclick =
        () =>
            moverOrdem(
                item,
                -1
            );


    const baixo =
        document.createElement("button");

    baixo.type =
        "button";

    baixo.textContent =
        "↓";

    baixo.onclick =
        () =>
            moverOrdem(
                item,
                1
            );


    botoes.appendChild(cima);

    botoes.appendChild(baixo);


    item.appendChild(
        nomeElemento
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


function coletarOrdem() {

    return [
        ...ordemEditor.children
    ].map(
        item =>
            item.dataset.componente
    );

}


/* =========================================
   COLETAR DADOS
========================================= */

function coletarLinks() {

    return [
        ...linksEditor.children
    ]
        .map(item => {

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

                ativo: true

            };

        })
        .filter(
            link =>
                link.nome ||
                link.url
        );

}


function coletarServicos() {

    return [
        ...servicosEditor.children
    ]
        .map(item => {

            const inputs =
                item.querySelectorAll(
                    "input, textarea"
                );


            return {

                nome:
                    inputs[0]?.value || "",

                descricao:
                    inputs[1]?.value || "",

                ativo: true

            };

        })
        .filter(
            servico =>
                servico.nome ||
                servico.descricao
        );

}


function coletarPortfolio() {

    return [
        ...portfolioEditor.children
    ]
        .map(item => item.dataset.imageUrl || "")
        .filter(
            foto => foto
        );

}


/* =========================================
   ATUALIZAR CONFIGURAÇÃO
========================================= */

function atualizarConfiguracao() {

    CONFIG.perfil =
        CONFIG.perfil || {};


    CONFIG.perfil.nome =
        nome.value.trim();


    CONFIG.perfil.descricao =
        descricao.value.trim();


    CONFIG.tema =
        tema.value;


    CONFIG.localizacao =
        CONFIG.localizacao || {};


    CONFIG.localizacao.endereco =
        endereco.value.trim();


    CONFIG.localizacao.mapa =
        mapa.value.trim();


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


    return CONFIG;

}


/* =========================================
   SALVAR NO SUPABASE
========================================= */

async function salvarConfiguracao() {

    const logado =
        await verificarLogin();

    if (!logado) return;


    atualizarConfiguracao();


    mostrarMensagem(
        "Salvando..."
    );


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("clients")
            .update({

                name:
                    CONFIG.perfil?.nome ||
                    "Cliente",

                config:
                    CONFIG,

                updated_at:
                    new Date().toISOString()

            })
            .eq(
                "slug",
                cliente
            )
            .eq(
                "owner_id",
                usuarioAtualId
            )
            .select()
            .single();


        if (error) {
            throw error;
        }


        CONFIG =
            data.config;


        mostrarMensagem(
            "✅ Alterações salvas com sucesso!"
        );


        atualizarPreview();


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "❌ Erro ao salvar: " +
            erro.message
        );

    }

}


/* =========================================
   PRÉ-VISUALIZAÇÃO
========================================= */

function atualizarPreview() {

    if (!preview) return;

    if (!previewInicializado) {
        preview.onload = function () {
            previewInicializado = true;
            enviarConfiguracaoPreview();
        };

        preview.src =
            `../?cliente=${encodeURIComponent(cliente)}&preview=1`;
        return;
    }

    enviarConfiguracaoPreview();

}


function enviarConfiguracaoPreview() {
    if (!preview?.contentWindow || !CONFIG) return;

    preview.contentWindow.postMessage(
        {
            tipo: "BIOPRO_PREVIEW",
            config: CONFIG,
            temaCustomizado: BIOPRO_THEMES[CONFIG.tema]
                ? { key: CONFIG.tema, dados: BIOPRO_THEMES[CONFIG.tema] }
                : null
        },
        window.location.origin
    );

}


function atualizarPreviewDoEditor() {
    if (!CONFIG) return;

    atualizarConfiguracao();
    atualizarPreview();

}


function visualizar() {

    window.open(
        `../?cliente=${encodeURIComponent(
            cliente
        )}`,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================
   BOTÕES
========================================= */

document
    .getElementById("visualizar")
    .addEventListener(
        "click",
        visualizar
    );


document
    .getElementById("visualizarTopo")
    .addEventListener(
        "click",
        visualizar
    );


document
    .getElementById("salvar")
    .addEventListener(
        "click",
        salvarConfiguracao
    );


const painelEditor = document.querySelector(".editor-panel");
painelEditor.addEventListener("input", atualizarPreviewDoEditor);
painelEditor.addEventListener("change", atualizarPreviewDoEditor);
painelEditor.addEventListener("click", atualizarPreviewDoEditor);


/* =========================================
   MENSAGEM
========================================= */

function mostrarMensagem(
    texto
) {

    mensagem.textContent =
        texto;

}


/* =========================================
   INICIAR
========================================= */

carregarConfiguracao();
