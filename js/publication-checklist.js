function obterChecklistPublicacao(config, nomeCliente = "") {
    const perfil = config?.perfil || {};
    const links = Array.isArray(config?.links) ? config.links : [];
    const nome = typeof perfil.nome === "string"
        ? perfil.nome
        : (typeof nomeCliente === "string" ? nomeCliente : "");
    const descricao = typeof perfil.descricao === "string" ? perfil.descricao : "";
    const logo = typeof perfil.logo === "string" ? perfil.logo : "";
    const linksValidos = links.filter(link =>
        link && link.ativo !== false &&
        typeof link.nome === "string" && link.nome.trim() &&
        typeof link.url === "string" &&
        /^(https?:\/\/|mailto:|tel:)/i.test(link.url.trim())
    );

    return [
        { nome: "Nome do cliente", ok: Boolean(nome.trim()) },
        { nome: "Descrição do perfil", ok: Boolean(descricao.trim()) },
        { nome: "Logo", ok: Boolean(logo.trim()) },
        { nome: "Pelo menos um botão com texto e link válido", ok: linksValidos.length > 0 }
    ];
}

function itensObrigatoriosPendentes(config, nomeCliente = "") {
    return obterChecklistPublicacao(config, nomeCliente)
        .filter(item => !item.ok)
        .map(item => item.nome);
}
