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
        } else if (resposta.data[i].type == "private_message" && resposta.data[i].to == nome){
            filha.classList.add("private")
            name.innerHTML += ` reservadamente para <strong>${resposta.data[i].to}</strong>:`
        } else {
            name.innerHTML += ` para <strong>${resposta.data[i].to}</strong>:`
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
    let usuarioEscolhido = document.querySelector(".selecionado :nth-child(2)");
    
    menuLateral.innerHTML = `
    <p><strong>Escolha um contato para enviar mensagem:</strong></p>
    <div class="usuarios selecionado" onclick="selecionarUsuario(this)">
        <div class="icone"><ion-icon name="people"></ion-icon> </div>
        <div class="nomeUsuarios">Todos</div>
        <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
    </div>
    `

    for (let i = 1; i < (resposta.data).length; i++){
        menuLateral.innerHTML += `
        <div class="usuarios" onclick="selecionarUsuario(this)">
            <div class="icone"><ion-icon name="person-circle-outline"></ion-icon> </div>
            <div class="nomeUsuarios">${resposta.data[i].name}</div>
            <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
        </div>
        `
    }

    menuLateral.innerHTML += `
    <p><strong>Escolha a visibilidade:</strong></p>
    <div class="visibilidade selecionadoVisibilidade">
        <div class="icone"><ion-icon name="lock-open"></ion-icon> </div>
        <div class="nomeUsuarios">Público</div>
        <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
    </div>
    <div class="visibilidade">
        <div class="icone"><ion-icon name="lock-closed"></ion-icon> </div>
        <div class="nomeUsuarios">Reservadamente</div>
        <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
    </div>`
}

function atualizarStatus(){ 
    if (nome != ""){
         axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome).catch(perdeuConexao); 
    }
}

setInterval(atualizarStatus , 5000);

function atualizandoUsuarios(){
    usuarios = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then(renderizarUsuarios);
}

setInterval(atualizandoUsuarios, 2000);

function atualizandoMensagens(){
    resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(renderizarMensagens).catch(retornarErro);
}

setInterval(atualizandoMensagens, 3000);

function voltar(){
    const menu = document.querySelector(".menu");
    menu.classList.remove("visivel");
    menu.classList.add("invisivel");
    setTimeout(function() { menu.classList.remove("invisivel"); }, 1000);
}

function selecionarUsuario(elemento){
    const selecionado = document.querySelector(".selecionado");
    selecionado.classList.remove("selecionado");
    elemento.classList.add("selecionado");
}
