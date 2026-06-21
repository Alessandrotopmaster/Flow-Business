// configuracoes.js
module.exports = {
    plataforma: {
        nome: "Flow Business",
        porta: process.env.PORT || 3000,
        saqueMinimo: 30.00, // R$ 30 via Mercado Pago
        taxaFixaServicos: 0.05, // 5% de taxa retida primeiro pela plataforma
    },

    paletaCores: {
        primaria: "#2C5E43",   // Verde-sábio
        secundaria: "#0F2027", // Azul-profundo
        destaque: "#D4AF37",   // Dourado-suave
        fundo: "#F8F9FA",      // Branco/Cinzas
        texto: "#333333"
    },

    bioSoul: {
        responsabilidade: "Própria (Estoque, Entrega e Garantia sob controle direto da plataforma)",
        vertentes: [
            "Óleos Essenciais e Aromaterapia", "Sinergias e Bem-estar", "Linha Home / Difusores",
            "Produtos Naturais, Ervas e Chás (Nova)", 
            "Beleza e Cuidados: Cabelo, Pele, Unhas e Tinturas (Nova)"
        ]
    },

    idmStreams: {
        modulo: "Flow Business Studios",
        variacoesPorVideo: 4,
        categoriasMusica: ["Foco", "Relaxamento", "Energia", "Ambiental", "Corporativo"]
    },

    afiliadosParceiros: {
        responsabilidade: "Exclusiva do Marketplace (Compra, Entrega e Logística gerenciadas por terceiros)",
        plataformas: ["Mercado Livre", "Shopee", "Amazon"],
        bloqueioCancelamentoDias: 7
    },

    recompensas: {
        comissaoBase: 0.08,  // 8%
        comissaoTop: 0.15,   // 15%
        bonusMetaVendas: 0.02,
        ganhoPorMilViews: 1.50,
        tempoMinimoViewSegundos: 5,
        pontosPorIndicacao: 50,
        pontosPorRealGasto: 1,
        comissaoDivulgacaoServicos: 0.02 // 2% para quem divulgar recargas/pagamentos
    },

    integracaoGovBr: {
        descontoBioSoulBeneficiario: 0.20, // 20% de desconto automático
        multiplicadorPontosIncentivo: 1.5, // 50% mais pontos
        lgpdFinalidade: "Validação instantânea de elegibilidade social sem armazenamento de histórico ou dados bancários federais."
    },

    antiFraude: {
        limiteViewsPorIpMinuto: 10
    }
};
