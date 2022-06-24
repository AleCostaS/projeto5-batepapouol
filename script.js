const resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(renderizarMensagens).catch(retornarErro);

function retornarErro(erro){
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
}

function renderizarMensagens(resposta){
    const ul = document.querySelector(".conteudo");
    ul.innerHTML += '<div></div><div></div><div></div>'
    let filha;
    let name;

    for (let i = 1; i < (resposta.data).length; i++){
        ul.innerHTML += 
        `<div class="mensagem">
            <span class="time">(${resposta.data[i].time})</span>
            <span class="name"><strong>${resposta.data[i].from}</strong></span>
            <span class="message">${resposta.data[i].text}</span>
        </div>`
        
        i+=3;
        filha = document.querySelector(".conteudo :nth-child("+i+")")
        name = document.querySelector(".conteudo :nth-child("+i+") .name")
        i-=3;
        
        if (resposta.data[i].type == "status"){
            filha.classList.add("system")
        } else if (resposta.data[i].type == "private_message"){
            name.innerHTML += ` reservadamente para ${resposta.data[i].to}:`
        } else {
            name.innerHTML += ` para ${resposta.data[i].to}:`
        }
    }

    const ultimaMensagem = document.querySelector(".conteudo :nth-child("+((resposta.data).length)+")");
    ultimaMensagem.scrollIntoView();
}

function mudarPagina(){
    const inicial = document.querySelector(".inicial");
    inicial.classList.add("escondida");
}

function digitandoNome(){
    const input = document.querySelector(".inicial input");
    if (input.value != ""){
        let nome = 
            {
                name: input.value
            }

        const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants" , nome).then(mudarPagina).catch(retornarErro);
        setInterval(manterConexao(nome), 5000);
    }
}

function manterConexao(nome){
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome).catch(perdeuConexao);
}

function perdeuConexao(erro){
    if (erro == 400){
        window.location.reload
    }
}

function menuLateral(){
    const menu = document.querySelector(".menu");
    menu.classList.add("visivel");
    const menuLateral = document.querySelector(".menulateral")
    menuLateral.innerHTML += `
    <p><strong>Escolha um contato para enviar mensagem:</strong></p>
    <div class="usuarios">
        <div class="icone"><ion-icon name="people" onclick="menuLateral()"></ion-icon> </div>
        <div class="nomeUsuarios">Todos</div>
    </div>
    `
}