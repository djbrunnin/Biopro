const arquivoTema = document.getElementById("arquivoTema");
const conteudoTema = document.getElementById("conteudoTema");
const errosTema = document.getElementById("errosTema");
const mensagemTema = document.getElementById("mensagemTema");
const salvarTemaBotao = document.getElementById("salvarTema");
const previewTema = document.getElementById("previewTema");
const temasSalvos = document.getElementById("temasSalvos");

let usuarioTemas = null;
let temaValidado = null;
let previewPronta = false;

previewTema.addEventListener("load", () => {
    previewPronta = true;
    atualizarPreviewTema();
});

previewTema.src = "../?preview=1";


async function iniciarGerenciadorTemas() {
    let sessao;
    try {
        sessao = await supabaseClient.auth.getSession();
    } catch (erro) {
        console.error("Erro ao verificar sessão:", erro);
        mensagemTema.textContent = "Não foi possível verificar sua sessão. Recarregue a página.";
        temasSalvos.textContent = "Entre no gerenciador para ver os temas salvos.";
        return;
    }

    const { data, error } = sessao;

    if (error || !data.session) {
        window.location.href = "./login.html";
        return;
    }

    usuarioTemas = data.session.user;
    salvarTemaBotao.disabled = !temaValidado;
    await carregarTemasSalvos();
}


arquivoTema.addEventListener("change", async () => {
    const arquivo = arquivoTema.files?.[0];
    if (!arquivo) return;

    if (arquivo.size > 30 * 1024) {
        mostrarErros(["O arquivo deve ter no máximo 30 KB."]);
        return;
    }

    try {
        conteudoTema.value = await arquivo.text();
        validarTemaAtual();
    } catch (erro) {
        console.error(erro);
        mostrarErros(["Não foi possível ler o arquivo selecionado."]);
    }
});


conteudoTema.addEventListener("input", () => {
    temaValidado = null;
    salvarTemaBotao.disabled = true;
    errosTema.replaceChildren();
    mensagemTema.textContent = "JSON alterado. Valide novamente para atualizar a prévia.";
});


document.getElementById("validarTema").addEventListener("click", validarTemaAtual);
salvarTemaBotao.addEventListener("click", salvarTema);


function mostrarErros(erros) {
    temaValidado = null;
    salvarTemaBotao.disabled = true;
    errosTema.replaceChildren();
    erros.forEach(erro => {
        const item = document.createElement("li");
        item.textContent = erro;
        errosTema.appendChild(item);
    });
    mensagemTema.textContent = "Corrija os itens indicados e valide novamente.";
}


function validarTemaAtual() {
    let valor;
    try {
        valor = JSON.parse(conteudoTema.value);
    } catch {
        mostrarErros(["O conteúdo não é um JSON válido."]);
        return;
    }

    const resultado = validarTemaImportado(valor);
    if (!resultado.valido) {
        mostrarErros(resultado.erros);
        return;
    }

    temaValidado = resultado.tema;
    errosTema.replaceChildren();
    salvarTemaBotao.disabled = !usuarioTemas;
    mensagemTema.textContent = `Tema “${temaValidado.dados.nome}” validado. Confira a prévia antes de salvar.`;
    atualizarPreviewTema();
}


function criarConfigPreview(tema) {
    return {
        tema: tema.key,
        marca: { mostrarBioPro: false },
        perfil: {
            nome: tema.dados.nome,
            descricao: "Uma prévia da identidade visual aplicada a uma página BioPro.",
            logo: ""
        },
        links: [
            { nome: "Agendar atendimento", icone: "whatsapp", url: "https://example.com", ativo: true },
            { nome: "Conheça nossos serviços", icone: "servicos", url: "https://example.com", ativo: true }
        ],
        destaque: { imagem: "", alt: "" },
        servicos: [
            { nome: "Serviço principal", descricao: "Uma descrição curta para apresentar o serviço.", ativo: true }
        ],
        portfolio: [],
        localizacao: { ativo: true, endereco: "Seu endereço ou região de atendimento", mapa: "" },
        redes: {},
        componentes: {
            perfil: true,
            links: true,
            destaque: false,
            servicos: true,
            portfolio: false,
            localizacao: true,
            redes: false,
            rodape: false
        },
        ordem: ["perfil", "links", "servicos", "localizacao"]
    };
}


function atualizarPreviewTema() {
    if (!previewPronta || !temaValidado || !previewTema.contentWindow) return;

    previewTema.contentWindow.postMessage(
        {
            tipo: "BIOPRO_PREVIEW",
            config: criarConfigPreview(temaValidado),
            temaCustomizado: {
                key: temaValidado.key,
                dados: temaValidado.dados
            }
        },
        window.location.origin
    );
}


async function salvarTema() {
    if (!temaValidado || !usuarioTemas) return;

    salvarTemaBotao.disabled = true;
    salvarTemaBotao.textContent = "Salvando...";
    mensagemTema.textContent = "Salvando tema no Supabase...";

    try {
        const { error } = await supabaseClient
            .from("biopro_themes")
            .insert({
                theme_key: temaValidado.key,
                name: temaValidado.dados.nome,
                theme: temaValidado.dados,
                owner_id: usuarioTemas.id,
                is_active: true
            });

        if (error) {
            if (error.code === "23505") {
                throw new Error("Esse identificador já está cadastrado. Altere o campo key no JSON.");
            }
            throw error;
        }

        mensagemTema.textContent = "Tema salvo. Ele já está disponível no editor e nas páginas dos clientes.";
        await carregarTemasSalvos();
        temaValidado = null;
        salvarTemaBotao.disabled = true;
    } catch (erro) {
        console.error("Erro ao salvar tema:", erro);
        mensagemTema.textContent = erro.message || "Não foi possível salvar. Confira a tabela e as políticas do Supabase.";
        salvarTemaBotao.disabled = false;
    } finally {
        salvarTemaBotao.textContent = "Salvar tema";
    }
}


async function carregarTemasSalvos() {
    temasSalvos.textContent = "Carregando temas...";

    const { data, error } = await supabaseClient
        .from("biopro_themes")
        .select("theme_key, name, created_at")
        .eq("owner_id", usuarioTemas.id)
        .order("name", { ascending: true });

    if (error) {
        console.error("Erro ao carregar temas:", error);
        temasSalvos.textContent = "Aplique a migração SQL do BioPro Themes no Supabase para carregar e salvar temas.";
        return;
    }

    if (!data?.length) {
        temasSalvos.textContent = "Você ainda não salvou temas personalizados.";
        return;
    }

    temasSalvos.replaceChildren();
    data.forEach(tema => {
        const item = document.createElement("div");
        item.className = "tema-salvo";

        const nome = document.createElement("strong");
        nome.textContent = tema.name;

        const chave = document.createElement("code");
        chave.textContent = tema.theme_key;

        item.append(nome, chave);
        temasSalvos.appendChild(item);
    });
}


iniciarGerenciadorTemas();
