import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // <<< NEW IMPORT


const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Importação das rotas.
import commentRoutes from './src/routes/commentRoutes.js'

// Ativação das rotas.
app.use('/api', commentRoutes);



app.listen(PORT, () => {
    console.log(`Servidor da API de comentários rodando em http://localhost:${PORT}`);
});