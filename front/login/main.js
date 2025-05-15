const host = 'http://192.168.1.10:8081'

document.addEventListener('click',(e)=>{
    if(e.target.id === 'cadastrar'){
        enviarCad()
    }
    if(e.target.id === "login"){
        enviarLogin()
    }
})

//envia a verificacao de login
const enviarLogin = async ()=>{
    const dados = {
        user: document.querySelector('.email').value,
        pass: document.querySelector('.senha').value
    }
    console.log(dados)

    try{
        const resposta = await axios.post(host+'/login', dados, {
            withCredentials: true
        });
        
       console.log(resposta.data)
        redirectVerify(resposta)
       
    }
    catch(error){
        console.log(error)
    }
}

//envia os dados para cadastro
const enviarCad = async () => {
    const dados = {
        nome: document.querySelector('.nomeCad').value,
        email: document.querySelector('.emailCad').value,
        passOne: document.querySelector('.passOneCad').value,
        passTwo : document.querySelector('.passTwoCad').value
    }

    try {
        const resposta = await axios.post(host+'/cad', dados, {
            withCredentials: true
        });
        
       
        await span(resposta)
        
    }
    catch(error){

    }
  
}

const span = async (res)=>{
    const alertar = document.querySelector('.alertar');
   
    
    if (!res.data.cad) {
        alertar.innerText = res.data.erro || "Erro desconhecido.";
        alertar.style.color = "red";
       
    } else {
       
        alertar.innerText = "Estamos te redirecionando...";
        alertar.style.color = "green";
        document.querySelector('.winCont').classList.remove('hidden')
        setTimeout(() => {
            location.reload()
        }, 1500);
    }
}


//verifica o login e redireciona para as paginas
const redirectVerify = (res) => {
    if (res.data.login) {
        localStorage.setItem("token", res.data.token);
        location.href = "/front/painel/index.html";


    }else{
        const alertar = document.querySelector('.alertarLogin');
        alertar.innerHTML = "Usuário ou senha incorretos.";
    }
}
