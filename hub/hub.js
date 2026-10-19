const hubCards = document.getElementById("hubCards");
const hubStatus = document.getElementById("hubStatus");
const hubSearch = document.getElementById("hubSearch");
let empresasHub = [];

function urlImagemSegura(valor) {
    if (typeof valor !== "string" || !valor.trim()) return "";
    try {
        const url = new URL(valor, new URL("../", window.location.href));
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
        return "";
    }
}

function obterImagemHub(config) {
    const escolha = config?.hub?.imagem;
    const portfolio = Array.isArray(config?.portfolio) ? config.portfolio : [];
    const alternativas = {
        logo: config?.perfil?.logo,
        destaque: config?.destaque?.imagem,
        portfolio: portfolio[0]
    };
    const selecionada = urlImagemSegura(alternativas[escolha]);
    if (selecionada) return { url: selecionada, modo: escolha === "logo" ? "logo" : "foto" };

    for (const [valor, modo] of [
        [alternativas.logo, "logo"],
        [alternativas.destaque, "foto"],
        [portfolio[0], "foto"]
    ]) {
        const url = urlImagemSegura(valor);
        if (url) return { url, modo };
    }
    return null;
}

function urlPaginaEmpresa(slug) {
    const url = new URL("../", window.location.href);
    url.searchParams.set("cliente", slug);
    return url.href;
}

function criarCartaoEmpresa(empresa) {
    const config = empresa.config && typeof empresa.config === "object" && !Array.isArray(empresa.config) ? empresa.config : {};
    const nomeCandidato = config.perfil?.nome || empresa.name;
    const nome = typeof nomeCandidato === "string" && nomeCandidato.trim() ? nomeCandidato.trim() : "Empresa BioPro";
    const descricaoHub = typeof config.hub?.descricao === "string" ? config.hub.descricao.trim() : "";
    const descricaoPerfil = typeof config.perfil?.descricao === "string" ? config.perfil.descricao.trim() : "";
    const descricao = descricaoHub || descricaoPerfil || "Conheça os serviços desta empresa.";
    const pagina = urlPaginaEmpresa(empresa.slug);
    const cartao = document.createElement("article");
    cartao.className = "hub-card";

    const imagemLink = document.createElement("a");
    imagemLink.className = "hub-card-image-link";
    imagemLink.href = pagina;
    imagemLink.setAttribute("aria-label", `Abrir página de ${nome}`);
    const quadroImagem = document.createElement("div");
    quadroImagem.className = "hub-card-image";
    const imagem = obterImagemHub(config);
    if (imagem) {
        quadroImagem.dataset.modo = imagem.modo;
        const img = document.createElement("img");
        img.src = imagem.url;
        img.alt = `Imagem de ${nome}`;
        img.loading = "lazy";
        img.decoding = "async";
        quadroImagem.appendChild(img);
    } else {
        quadroImagem.classList.add("hub-card-placeholder");
        quadroImagem.textContent = nome.trim().slice(0, 1).toUpperCase();
        quadroImagem.setAttribute("aria-hidden", "true");
    }
    imagemLink.appendChild(quadroImagem);

    const conteudo = document.createElement("div");
    conteudo.className = "hub-card-content";
    const titulo = document.createElement("h2");
    const tituloLink = document.createElement("a");
    tituloLink.href = pagina;
    tituloLink.textContent = nome;
    titulo.appendChild(tituloLink);
    const texto = document.createElement("p");
    texto.textContent = descricao;
    const chamada = document.createElement("a");
    chamada.className = "hub-card-cta";
    chamada.href = pagina;
    chamada.textContent = "Conhecer empresa";
    chamada.setAttribute("aria-label", `Conhecer ${nome}`);
    conteudo.append(titulo, texto, chamada);
    cartao.append(imagemLink, conteudo);
    return cartao;
}

function renderizarEmpresas() {
    const termo = hubSearch.value.trim().toLocaleLowerCase("pt-BR");
    const filtradas = empresasHub.filter(empresa => {
        const config = empresa.config || {};
        const nome = String(config.perfil?.nome || empresa.name || "");
        const descricao = String(config.hub?.descricao || config.perfil?.descricao || "");
        return `${nome} ${descricao}`.toLocaleLowerCase("pt-BR").includes(termo);
    });

    hubCards.replaceChildren(...filtradas.map(criarCartaoEmpresa));
    hubStatus.textContent = filtradas.length
        ? `${filtradas.length} ${filtradas.length === 1 ? "empresa encontrada" : "empresas encontradas"}.`
        : empresasHub.length
            ? "Nenhuma empresa corresponde à busca."
            : "Ainda não há empresas publicadas no Hub.";
}

async function carregarEmpresasHub() {
    try {
        const { data, error } = await supabaseClient
            .from("clients")
            .select("slug, name, config")
            .eq("published", true)
            .order("name", { ascending: true })
            .limit(200);
        if (error) throw error;

        empresasHub = (data || []).filter(empresa =>
            empresa?.slug && empresa.config?.hub?.mostrar !== false
        );
        renderizarEmpresas();
    } catch (erro) {
        console.error("Não foi possível carregar o Hub BioPro:", erro);
        hubStatus.textContent = "Não foi possível carregar as empresas agora. Tente novamente mais tarde.";
    }
}

hubSearch.addEventListener("input", renderizarEmpresas);
carregarEmpresasHub();
