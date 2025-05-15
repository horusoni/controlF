const host = 'https://control-f.vercel.app'

window.onload = async () => {
    loadResume()
    
    const loginPage = '/login/index.html'

    const token = localStorage.getItem("token");
    if (!token) return location.href = loginPage;

    try {
        const resposta = await axios.get(host+'/verifica-sessao', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!resposta.data.login) {
            location.href = loginPage;
        }

    } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        location.href = loginPage;
    }

    iniciarAplicacao()

};

async function iniciarAplicacao() {
    let painelCont = document.querySelector('.painelCont')
   
    const token = localStorage.getItem("token")
    const resposta = await axios.get(host+'/buscar-dados', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
   // console.log(resposta)
    const dados = await resposta.data[0];
    const userName = await resposta.data[1][0].nome

    identify(userName) //lista o nome do usuario

    let receitaTot = [];
    let despesaTot = [];
    
    let receitaSoma = 0;
    let despesaSoma = 0;
    
    for (let i = 0; i < dados.length; i++) {
        if (dados[i].movimento === "receita") {
            receitaTot.push(dados[i].valor);
            receitaSoma += parseFloat(dados[i].valor); 
    
            painelCont.innerHTML += `
            <div class="movimentsCont">
                <div>${dados[i].titulo}</div>
                <div>${dados[i].data.toString().slice(0, 10)}</div>
                <div class="green">+R$${dados[i].valor} > </div>
                <div class="actionCont">
                    <button id=${dados[i].id} class="del">DELETAR</button>
                </div>
            </div>`;
        } else {
            despesaTot.push(dados[i].valor);
            despesaSoma += parseFloat(dados[i].valor);
    
            painelCont.innerHTML += `
            <div class="movimentsCont">
                <div>${dados[i].titulo}</div>
                <div>${dados[i].data.toString().slice(0, 10)}</div>
                <div class="red">- R$${dados[i].valor} < </div>
                <div class="actionCont">
                    <button id=${dados[i].id} class="del">DELETAR </button>
                </div>
            </div>`;
        }
    }
    
    //func calcula no final da operacao
    calcTotal(receitaSoma, despesaSoma)
    colorTot()
    }

    document.addEventListener('click', (e) => {
        
        if (e.target.id === "adicionar") {
            if(document.getElementById('titulo').value === '' || document.getElementById('movimento').value === '' || document.getElementById('valor').value === ''){
                alert('Preencha todos os campos.')
            }else{
                sendDb();
                
                setTimeout(() => {
                    location.reload()
                }, 200);
            } 
        }

        if(e.target.classList[0] === 'del'){
            let id = e.target.id
            let randomNum = Math.floor(Math.random() * 9000) + 1000;
          
            const codeInput = prompt(`DIGITE O CÓDIGO PARA EXCLUIR:\n\n${randomNum}`)
         
            if(parseInt(codeInput) === randomNum){
                deletar(id)
            }else(
                alert('CODIGO INCORRETO')
            )
            
        }
        
        if(e.target.id === "logout"){
            logout()
        }

        if(e.target.id === "resumoPag"){
            closeMenu()
            e.preventDefault()
            resumeOpen()
        }
        if(e.target.id === "relatorioPage"){
            closeMenu()
            e.preventDefault()
            resumeClose()
        }

        if(e.target.classList[0] === "searchBtn"){
         search()
        }
    
    
});

document.getElementById("titleSearch").addEventListener("keyup", (e) => {
    search()
})

const sendDb = async () => {
    const dados = {
        titulo: document.getElementById('titulo').value,
        movimento: document.getElementById('movimento').value,
        data: new Date().toISOString().slice(0, 10),
        valor: document.getElementById('valor').value
    };

    try {
        const token = localStorage.getItem("token");
        const resposta = await axios.post(host+'/dados', dados, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        );
        console.log('Resposta do servidor:', resposta.data);
        console.log('Dados enviados com sucesso!');
    } catch (erro) {
        console.error('Erro ao enviar dados:', erro);
        console.log('Erro ao enviar dados');
    }
    
};

const logout = () => {
    localStorage.removeItem("token"); // Remove o token salvo
    localStorage.removeItem('visible') //remove a function de carregar relatorio
    localStorage.removeItem('despesaTot')
    localStorage.removeItem('receitaTot')
    location.href = '/login/index.html'; // Redireciona para login
    }

const deletar = async (id) => {
    
    let dados = {id: id}

    const token = localStorage.getItem('token')
    const resposta = await axios.post(host+'/delete', dados, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if(resposta.data.delete){
        location.reload()
    }
}

const user = async () =>{
    const token = localStorage.getItem("token")
    const resposta = await axios.get(host+'/user',{
        headers:{
                Authorization: `Bearer ${token}`
        }
    })

    console.log(resposta)
    console.log('?')
}
    
const identify = (userName) => {
    document.getElementById('hiUser').innerText = `Olá ${userName}`
}

const colorTot = ()=> {
    let textTotal = document.querySelector('.total')
 
    if(parseInt(textTotal.textContent.slice(2)) < 0){
        textTotal.classList.add('red')
    }else if(parseInt(textTotal.textContent.slice(2)) === 0){
        textTotal.classList.add('blue')      
    }else{
        textTotal.classList.add('green')
    }

}

const calcTotal = (receitaSoma, despesaSoma) => {
    // Seleciona os elementos
    const resAtual = document.querySelector('#resAtual');
    const resEntr = document.querySelector('#resEntr');
    const resDesp = document.querySelector('#resDesp');
    const total = document.querySelector('.total');
    const totalDesp = document.querySelector('.totalDesp');
    const totalEntr = document.querySelector('.totalEntr');

    // Verifica se os valores são números válidos
    if (isNaN(receitaSoma) || isNaN(despesaSoma)) {
        console.warn('Valores inválidos para receita ou despesa. Resetando para 0.');
        receitaSoma = 0;
        despesaSoma = 0;
    }

    // Salva os valores no localStorage
    localStorage.setItem("receitaTot", receitaSoma);
    localStorage.setItem("despesaTot", despesaSoma);

    // Recupera os valores e calcula total
    const receitaTot = parseFloat(localStorage.getItem("receitaTot"));
    const despesaTot = parseFloat(localStorage.getItem("despesaTot"));
    const totalAtual = receitaTot - despesaTot;

    // Renderiza nos elementos principais
    total.innerText = `R$ ${totalAtual.toFixed(2)}`;
    totalEntr.innerText = `R$ ${receitaTot.toFixed(2)}`;
    totalDesp.innerText = `R$ ${despesaTot.toFixed(2)}`;

    // Renderiza no resumo
    resAtual.innerText = `R$ ${totalAtual.toFixed(2)}`;
    resEntr.innerText = `R$ ${receitaTot.toFixed(2)}`;
    resDesp.innerText = `R$ ${despesaTot.toFixed(2)}`;

  
}


const resumeOpen = () => {
    localStorage.setItem("visible", 'true');
    document.querySelector('.resumoCont').classList.remove('hidden');
    animarResumo(0,"inherit")
  
};

const resumeClose = () => {
    localStorage.setItem("visible", 'false');
    document.querySelector('.resumoCont').classList.add('hidden');
    animarResumo(500,"none")
 
};

const loadResume = () =>{
    let visible = localStorage.getItem('visible');

    // Se ainda não estiver definido (primeira vez), mostra e define como "false"
    if (visible === null) {
        document.querySelector('.resumoCont').classList.remove('hidden');
        localStorage.setItem('visible', 'false');
        animarResumo(0,"block")
    } else if (visible === 'true') {
        document.querySelector('.resumoCont').classList.remove('hidden');
        animarResumo(0,"block")
    } else {
        document.querySelector('.resumoCont').classList.add('hidden');
      animarResumo(500,"none")
    }
}
const animarResumo = (time, value) =>{
   setTimeout(() => {
    document.querySelector('.resumoCont').style.display = value
   }, time);
}


let originMovimentsCont = [];
setTimeout(() => {
    let movimentsCont = document.querySelectorAll(".movimentsCont");

    for (let i = 0; i < movimentsCont.length; i++) {
        // Armazena uma cópia (clone) dos elementos para uso posterior
        originMovimentsCont.push(movimentsCont[i].cloneNode(true));
    }

    // Exibe todos inicialmente
    const painelCont = document.querySelector(".painelCont");
    painelCont.innerHTML = "";
    for (let i = 0; i < originMovimentsCont.length; i++) {
        painelCont.appendChild(originMovimentsCont[i].cloneNode(true));
    }
}, 500);

const search = () => {
    let titleSearch = document.getElementById("titleSearch").value.toLowerCase();
    let painelCont = document.querySelector(".painelCont");

    painelCont.innerHTML = ""; // Limpa resultados anteriores

    // Se o campo estiver vazio, mostra todos os itens
    if (titleSearch.trim() === "") {
        for (let i = 0; i < originMovimentsCont.length; i++) {
            painelCont.appendChild(originMovimentsCont[i].cloneNode(true));
        }
        return;
    }

    // Senão, busca os que combinam
    let found = false;
    for (let i = 0; i < originMovimentsCont.length; i++) {
        if (originMovimentsCont[i].textContent.toLowerCase().includes(titleSearch)) {
            painelCont.appendChild(originMovimentsCont[i].cloneNode(true));
            found = true;
        }
    }

    if (!found) {
        painelCont.innerHTML = '<p class="searchNot">Nenhum resultado encontrado.</p>';
    }
};

