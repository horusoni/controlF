// app.js
import express from 'express';
import cors from 'cors';
import { authMiddleware } from './routers/auth.js';

import { verifyData, login, verifySession, insertItens, sendData, deletarLinha } from './routers/loginCheck.js';

const port = 8081;
const app = express();

app.use(express.json());

app.use(cors({
    origin: 'https://control-f.netlify.app', // ajuste futuramente 
    credentials: true
}));

// Rotas


app.get('/verifica-sessao', verifySession);
app.post('/cad', verifyData);
app.post('/login', login);


app.get('/buscar-dados', authMiddleware, (req, res) => {
    sendData(req,res)
});
app.post('/dados', authMiddleware, (req, res) => {
    insertItens(req,res)
});

app.post('/delete', authMiddleware , (req,res) => {
    deletarLinha(req,res)
})

app.get('/teste', (req,res)=>{
    res.send('ok')
})



app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
