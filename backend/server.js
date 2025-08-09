const express = require('express');
const cors = require('cors');
const path = require('path');


const app = express(); 
const PORT = 3000;
app.use(cors());
app.use(express.json());  
app.use(express.static(path.join(__dirname, '../frontend'))); // <<< ADICIONE ESTA LINHA


// ===================================================================
// "BANCO DE DADOS" EM MEMÓRIA (Simulação)
// ===================================================================
const db = {
    comentarios: [
        { id: 1, videoId: 1, usuario: "Arakaki", texto: "Muito bom o vídeo, aprendi bastante!", respostas: [
            { id: 101, usuario: "Gabriel", texto: "Concordo, a parte sobre injeção foi top!" }
        ]},
        { id: 2, videoId: 1, usuario: "Martins", texto: "Alguém sabe o nome da ferramenta do minuto 3:45?", respostas: [] },
        { id: 3, videoId: 2, usuario: "Luciano", texto: "Esse vídeo de câmbio salvou meu dia!", respostas: [] }
    ]
};

// ===================================================================
// AS ROTAS (Endpoints da API)
// ===================================================================

// Rota 1: Listar os comentários de um vídeo específico
// GET /comentarios?videoId=1
app.get('/comentarios', (req, res) => {
    // 'req' (request) contém as informações do pedido, exemplo parâmetros da URL.
    // 'res' (response) é para enviar a resposta de volta.
    
    const videoId = req.query.videoId; 

    if (!videoId) {
        return res.status(400).json({ error: "O parâmetro videoId é obrigatório." });
    }

    const comentariosDoVideo = db.comentarios.filter(c => c.videoId == videoId);

    res.json(comentariosDoVideo);
});


// Rota 2: Adicionar um novo comentário
// POST /comentarios
app.post('/comentarios', (req, res) => {
    // `express.json()` é um "middleware" que ensina o Express a ler o JSON.
    
    const { videoId, usuario, texto } = req.body; 

    if (!videoId || !usuario || !texto) {
        return res.status(400).json({ error: "Os campos videoId, usuario e texto são obrigatórios." });
    }

    const novoComentario = {
        id: db.comentarios.length + 2,
        videoId: videoId,
        usuario: usuario,
        texto: texto,
        respostas: []
    };

    db.comentarios.push(novoComentario);

    res.status(201).json(novoComentario);
});


app.listen(PORT, () => {
    console.log(`Servidor da API de comentários rodando em http://localhost:${PORT}`);
});