const resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');


resposta.then(renderizarMensagens);

resposta.catch(retornarErro);

function retornarErro(erro){
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
}

function renderizarMensagens(resoposta){
    const ul = document.querySelector(".conteudo");

    for (let i = 0; i < (resoposta.data).length; i++){
        ul.innerHTML += 
        `<li class="mensagem">
            <span class="time">${resoposta.data[i].time}</span>
            <span class="name">${resoposta.data[i].to}</span>
            <span class="message">${resoposta.data[i].text}</span>
        </li>`

        i++;
        let filha = document.querySelector(".conteudo :nth-child("+i+")")
        console.log(filha)
        i--;
        
        if (resoposta.data[i].type == "status"){
            filha.classList.add("system")
        } else if (resoposta.data[i].type == "private_message"){
            filha.classList.add("private")
        }
    }
}

function mudarPagina(){
    const inicial = document.querySelector(".inicial");
    inicial.classList.add("escondida");
}

function nome(){
    const input = document.querySelector(".inicial input");
    if (input.value != ""){
        const nome = 
            {
                name: input.value
            }

        const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants" , nome).then(mudarPagina).catch(retornarErro);
    }
}