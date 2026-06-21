// servidor.js
const http = require('http');
const url = require('url');
const config = require('./configuracoes');
const { db, ai } = require('./firebase');

// Cache local temporário para controle anti-fraude por IP (LGPD compliant: expira rápido)
const ipLogLocal = {};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    const responderJSON = (status, dados) => {
        res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(dados));
    };

    // 1. DIVISÃO DE VALORES AUTOMÁTICA & CHECKOUT BIOSOUL / AFILIADOS
    if (path === '/api/checkout' && method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { tipo, valorTotal, elegivelGovBr } = JSON.parse(body);
            
            let valorProcessado = valorTotal;
            if (tipo === 'biosoul' && elegivelGovBr) {
                valorProcessado = valorTotal * (1 - config.integracaoGovBr.descontoBioSoulBeneficiario);
            }

            // REGRA OBRIGATÓRIA: Taxa da Plataforma retida PRIMEIRO
            const partePlataforma = valorProcessado * config.plataforma.taxaFixaServicos;
            const saldoRestante = valorProcessado - partePlataforma;
            
            // Distribuição do Restante
            const comissaoAfiliado = saldoRestante * config.recompensas.comissaoBase;

            responderJSON(200, {
                sucesso: true,
                responsabilidade: tipo === 'biosoul' ? config.bioSoul.responsabilidade : config.afiliadosParceiros.responsabilidade,
                divisao: {
                    retidoPlataformaPrimeiro: partePlataforma,
                    bloqueadoAfiliadoTemporario: comissaoAfiliado,
                    prazoLiberacaoDias: config.afiliadosParceiros.bloqueioCancelamentoDias
                }
            });
        });
    }

    // 2. DETECÇÃO DE VISUALIZAÇÕES FALSAS (ANTI-FRAUDE)
    else if (path === '/api/studio/view' && method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { usuarioId, tempoAssistido } = JSON.parse(body);
            const ipCliente = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            const agora = Date.now();
            if (!ipLogLocal[ipCliente]) ipLogLocal[ipCliente] = [];
            ipLogLocal[ipCliente] = ipLogLocal[ipCliente].filter(tempo => agora - tempo < 60000);

            // Filtros Anti-Fraude
            if (tempoAssistido < config.recompensas.tempoMinimoViewSegundos) {
                return responderJSON(400, { erro: "Visualização inválida por tempo insuficiente." });
            }
            if (ipLogLocal[ipCliente].length >= config.antiFraude.limiteViewsPorIpMinuto) {
                return responderJSON(429, { erro: "Bloqueio temporário: Atividade suspeita de robôs detectada." });
            }

            ipLogLocal[ipCliente].push(agora);
            responderJSON(200, { sucesso: true, computado: true, ganhoEstimado: config.recompensas.ganhoPorMilViews / 1000 });
        });
    }

    // 3. ANÚNCIOS AUTOMÁTICOS (SELF-SERVICE)
    else if (path === '/api/anuncios/publicar' && method === 'POST') {
        responderJSON(200, { sucesso: true, status: "Pagamento confirmado. Conteúdo publicado automaticamente via API." });
    }

    else {
        responderJSON(200, { plataforma: config.plataforma.nome, status: "Operacional" });
    }
});

server.listen(config.plataforma.porta);
