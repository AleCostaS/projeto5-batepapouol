const resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
let mensagens = [];
let nomeValido = false;

resposta.then(processaResposta);

function processaResposta(){
    mensagens = resposta.data;
    renderizarMensagens();
}

//resposta.catch(tratarErro);

function nomeErro(erro){
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
    if (erro.response.status == 400){
        alert("o nome já foi usado, por favor digite outro nome");
    } else if (erro.response.status == 200){
        nomeValido = true;
    }
}

function renderizarMensagens(){
    const ul = document.querySelector(".conteudo");

    for (let i = 0; i < mensagens.length; i++){
        ul.innerHTML += `<li class="mensagem">
            <span class="time">${mensagens[i].time}</span>
            <span class="name">${mensagens[i].to}</span>
            <span class="message">${mensagens[i].text}</span>
        </li>`
    }
}

function enviarMensagem(){

}

function nome(){
    const input = document.querySelector(".inicial input");
    if (input.value != ""){
        const nome = `{
            name: "${input.value}"
          }`

        const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants" , nome);

        requisicao.catch(nomeErro);
        
        if(nomeValido){
            const inicial = document.querySelector(".inicial");
            inicial.classList.add("escondida");
        }
    }
}