let resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(renderizarMensagens).catch(retornarErro);
let usuarios = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then(renderizarUsuarios);
let nome = "";

function retornarErro(erro){
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
}

function renderizarMensagens(resposta){
    const ul = document.querySelector(".conteudo");
    ul.innerHTML = '<div></div><div></div><div></div>'
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
            filha.classList.add("private")
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
        nome = 
            {
                name: input.value
            }

        axios.post("https://mock-api.driven.com.br/api/v6/uol/participants" , nome).then(mudarPagina).catch(retornarErro);
        axios.get('https://mock-api.driven.com.br/api/v6/uol/participants', nome).then(renderizarUsuarios);
        return nome;
    }
}

function perdeuConexao(erro){
    if (erro == 400){
        window.location.reload
    }
}

function menuLateral(){
    const menu = document.querySelector(".menu");
    menu.classList.add("visivel");
}

function renderizarUsuarios(resposta){
    const menuLateral = document.querySelector(".menulateral")
    menuLateral.innerHTML = `
    <p><strong>Escolha um contato para enviar mensagem:</strong></p>
    <div class="usuarios">
        <div class="icone"><ion-icon name="people"></ion-icon> </div>
        <div class="nomeUsuarios selecionado">Todos</div>
        <div class="escolhido"><ion-icon class name="checkmark-outline"></ion-icon></div>
    </div>
    `

    for (let i = 1; i < (resposta.data).length; i++){
        menuLateral.innerHTML += `
        <div class="usuarios">
            <div class="icone"><ion-icon name="person-circle-outline"></ion-icon> </div>
            <div class="nomeUsuarios">${resposta.data[i].name}</div>
        </div>
        `
    }

    menuLateral.innerHTML += `
    <p><strong>Escolha a visibilidade:</strong></p>
    <div class="usuarios">
        <div class="icone"><ion-icon name="lock-open"></ion-icon> </div>
        <div class="nomeUsuarios">Público</div>
    </div>
    <div class="usuarios">
        <div class="icone"><ion-icon name="lock-closed"></ion-icon> </div>
        <div class="nomeUsuarios">Reservadamente</div>
    </div>
    `
}

function atualizarStatus(nome){ 
    if (nome != ""){
         axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome).catch(perdeuConexao); 
    }
}

setInterval(atualizarStatus(nome) , 5000);

function atualizandoUsuarios(){ 
    usuarios = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then(renderizarUsuarios);
}

setInterval( atualizandoUsuarios, 10000);

function voltar(){
    const menu = document.querySelector(".menu");
    menu.classList.remove("visivel");
    menu.classList.add("invisivel");
    setTimeout(function() { menu.classList.remove("invisivel"); }, 1000);
}
