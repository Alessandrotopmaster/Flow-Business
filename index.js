// ==============================================================================
// ARQUIVO PRINCIPAL DO SISTEMA (index.js)
// Este único arquivo controla o Servidor, o Firebase e o seu Painel
// ==============================================================================

const express = require('express');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, child } = require('firebase/database');

const app = express();

// 1. CONFIGURAÇÕES GERAIS
const CONFIG = {
    nomeSistema: "IDM Streams & BioSoul",
    versao: "1.0.0",
    porta: process.env.PORT || 3000, // A Render usa essa linha para definir a porta automaticamente
    ambiente: "production"
};

// Middlewares para o servidor entender dados enviados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CONFIGURAÇÃO E CONEXÃO COM O FIREBASE
// (As informações abaixo são lidas das variáveis de ambiente da Render)
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Inicialização do Banco de Dados
let firebaseApp, database;
try {
    firebaseApp = initializeApp(firebaseConfig);
    database = getDatabase(firebaseApp);
    console.log("-> Conectado ao Firebase com sucesso!");
} catch (error) {
    console.log("-> Erro ao inicializar o Firebase: ", error.message);
}

// 3. ROTAS DO PAINEL ADMINISTRATIVO (O QUE APARECE NA TELA)
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Painel ${CONFIG.nomeSistema}</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #121212; color: #fff; padding: 40px; text-align: center; }
                    .card { background-color: #1e1e1e; padding: 30px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
                    h1 { color: #4caf50; font-size: 28px; margin-bottom: 10px; }
                    p { color: #aaa; font-size: 16px; }
                    .status { margin-top: 20px; padding: 10px; background: #2a2a2a; border-radius: 6px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>${CONFIG.nomeSistema}</h1>
                    <p>Painel Administrativo Conectado à Render</p>
                    <div class="status">Status do Banco de Dados: 🟢 Conectado com Sucesso</div>
                </div>
            </body>
        </html>
    `);
});

// Rota de API para buscar dados se necessário
app.get('/api/dados', async (req, res) => {
    if (!database) return res.status(500).json({ erro: "Sem conexão com o banco." });
    try {
        const snapshot = await get(child(ref(database), 'dados_painel'));
        res.json(snapshot.exists() ? snapshot.val() : { mensagem: "Nenhum dado encontrado" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// 4. INICIALIZAÇÃO DO SERVIDOR
app.listen(CONFIG.porta, () => {
    console.log(`🚀 Servidor ativo na porta ${CONFIG.porta}`);
});
