import { saveUser, pushUser, insertLancers, pushDados, deleteDados, listName} from "../db/connect.mjs";
import jwt from 'jsonwebtoken';


const JWT_SECRET = 'chave-secreta-segura'; // guarde isso em variável de ambiente em produção

export async function verifyData(req, res) {
    const dados = req.body;
    const email = req.body.email
    const userDb = await pushUser(email);

    let userExistent = false

    for(let i = 0; i < userDb.length; i++){
        if(email === userDb[i].email){
            userExistent = true
            break
        }
    }
    if(userExistent){
        return res.json({ cad: false, erro: "Endereço email ja cadastrado."})
    }

    if (dados.passOne !== dados.passTwo) {
        return res.json({ cad: false, erro: "As senhas não coincidem." });
    }

    if (dados.passOne.length < 8) {
        return res.json({ cad: false, erro: "Senha muito curta." });
    }

    if (!dados.email.includes('@')) {
        return res.json({ cad: false, erro: "E-mail inválido." });
    }
  

    await saveUser(dados);
    res.json({ cad: true });
}


export async function login(req, res) {
    const email = req.body.user;
    const pass = req.body.pass;
    const userDb = await pushUser(email);

    for (let i = 0; i < userDb.length; i++) {
        if (email === userDb[i].email && pass === userDb[i].senha) {
            // Gerar o token
            const token = jwt.sign({
                id: userDb[i].id,
                email: userDb[i].email
            }, JWT_SECRET, { expiresIn: '1h' });

            return res.json({ login: true, token });
        }
    }

    return res.json({ login: false, erro: 'Credenciais inválidas' });
}



export async function verifySession(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.json({ login: false });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ login: true, user: decoded });
    } catch (err) {
        res.json({ login: false });
    }
}

export async function insertItens(req, res) {
    const dados = req.body
    const userId = req.userId
    insertLancers(userId,dados)

    res.json({ status: true });
}

export async function sendData(req,res) {
    const userId = req.userId
    let nome = await listName(userId)
    let lancamentos = await pushDados(userId)
    

    console.log(lancamentos)
    res.json([lancamentos, nome])
}

export async function deletarLinha(req, res){
    const id = req.body.id
    await deleteDados(id)
    
    res.json({delete: true})
    
}