let resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(renderizarMensagens).catch(retornarErro);
let usuarios = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then(renderizarUsuarios);
let nome = "";
const tempo = Math.random() * (5000 - 300) + 300;

function retornarErro(erro){
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
};

function retornarErroNome(erro){
    console.log("Status code: " + erro.response.status);
	console.log("Mensagem de erro: " + erro.response.data);
    window.location.reload();
};

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
        } else if (resposta.data[i].type == "private_message" && (resposta.data[i].to == nome.name || resposta.data[i].from == nome.name)){
            filha.classList.add("private")
            name.innerHTML += ` reservadamente para <strong>${resposta.data[i].to}</strong>:`
        } else {
            name.innerHTML += ` para <strong>${resposta.data[i].to}</strong>:`
        }
    }

    const ultimaMensagem = document.querySelector(".conteudo :nth-child("+((resposta.data).length)+")");
    ultimaMensagem.scrollIntoView();
};

function mudarPagina(){
    
};

function digitandoNome(){
    const input = document.querySelector(".inicial input");
    if (input.value != ""){
        nome = 
            {
                name: input.value
            }

        axios.post("https://mock-api.driven.com.br/api/v6/uol/participants" , nome).catch(retornarErroNome);
        axios.get('https://mock-api.driven.com.br/api/v6/uol/participants', nome).then(renderizarUsuarios);
        setTimeout(carregarPagina(), tempo);
    }
};

function perdeuConexao(erro){
    if (erro == 400){
        window.location.reload();
    }
};

function menuLateral(){
    const menu = document.querySelector(".menu");
    menu.classList.remove("escondida");
    setTimeout(function(){menu.classList.add("visivel");}, 10);
};

function renderizarUsuarios(resposta){
    const menuLateral = document.querySelector(".menulateral");
    let usuarioEscolhido = document.querySelector(".selecionado :nth-child(2)");
    let visibilidadeEscolhida = document.querySelector(".selecionadoVisibilidade :nth-child(2)");
    if (usuarioEscolhido == null){ 
        menuLateral.innerHTML = `
        <p><strong>Escolha um contato para enviar mensagem:</strong></p>
        <div data-identifier="participant" class="usuarios escolhido" onclick="selecionarUsuario(this)">
            <div class="icone"><ion-icon name="people"></ion-icon> </div>
            <div class="nomeUsuarios">Todos</div>
            <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
        </div>`
        usuarioEscolhido = document.querySelector(".usuarios");
        usuarioEscolhido.classList.add("selecionado")
    } else {
        menuLateral.innerHTML = `
        <p><strong>Escolha um contato para enviar mensagem:</strong></p>
        <div class="usuarios" onclick="selecionarUsuario(this)">
            <div class="icone"><ion-icon name="people"></ion-icon> </div>
            <div class="nomeUsuarios">Todos</div>
            <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
        </div>`
    }

    for (let i = 1; i < (resposta.data).length; i++){
        if (usuarioEscolhido != null && usuarioEscolhido.innerHTML == resposta.data[i].name){
            menuLateral.innerHTML += `
            <div data-identifier="participant" class="usuarios selecionado" onclick="selecionarUsuario(this)">
                <div class="icone"><ion-icon name="person-circle-outline"></ion-icon> </div>
                <div class="nomeUsuarios">${resposta.data[i].name}</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>`
            usuarioEscolhido = null;
        } else if ((i == (resposta.data).length - 1) && (usuarioEscolhido != null)){
            usuarioEscolhido = null;
            const todos = document.querySelector(".usuarios");
            todos.classList.add("selecionado");
        } else {
            menuLateral.innerHTML += `
            <div data-identifier="participant" class="usuarios" onclick="selecionarUsuario(this)">
                <div class="icone"><ion-icon name="person-circle-outline"></ion-icon> </div>
                <div class="nomeUsuarios">${resposta.data[i].name}</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>`
        }
    }
      
    if (visibilidadeEscolhida == null){
        menuLateral.innerHTML += `
        <p><strong>Escolha a visibilidade:</strong></p>
        <div class="visibilidade selecionadoVisibilidade" onclick="selecionarVisibilidade(this)">
            <div class="icone"><ion-icon name="lock-open"></ion-icon> </div>
            <div class="nomeUsuarios">Público</div>
            <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
        </div>
        <div class="visibilidade" onclick="selecionarVisibilidade(this)">
            <div class="icone"><ion-icon name="lock-closed"></ion-icon> </div>
            <div class="nomeUsuarios">Reservadamente</div>
            <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
        </div>`
    } else {
        if (visibilidadeEscolhida.innerHTML == "Público"){
            menuLateral.innerHTML += `
            <p><strong>Escolha a visibilidade:</strong></p>
            <div data-identifier="visibility" class="visibilidade selecionadoVisibilidade" onclick="selecionarVisibilidade(this)">
                <div class="icone"><ion-icon name="lock-open"></ion-icon> </div>
                <div class="nomeUsuarios">Público</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>
            <div data-identifier="visibility" class="visibilidade" onclick="selecionarVisibilidade(this)">
                <div class="icone"><ion-icon name="lock-closed"></ion-icon> </div>
                <div class="nomeUsuarios">Reservadamente</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>`
        } else {
            menuLateral.innerHTML += `
            <p><strong>Escolha a visibilidade:</strong></p>
            <div data-identifier="visibility" class="visibilidade" onclick="selecionarVisibilidade(this)">
                <div class="icone"><ion-icon name="lock-open"></ion-icon> </div>
                <div class="nomeUsuarios">Público</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>
            <div data-identifier="visibility" class="visibilidade  selecionadoVisibilidade" onclick="selecionarVisibilidade(this)">
                <div class="icone"><ion-icon name="lock-closed"></ion-icon> </div>
                <div class="nomeUsuarios">Reservadamente</div>
                <ion-icon class="escolhido" name="checkmark-outline"></ion-icon>
            </div>`
        }
    }
};

function atualizarStatus(){ 
    if (nome != ""){
         axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nome).catch(perdeuConexao); 
    }
};

setInterval(atualizarStatus , 5000);

function atualizandoUsuarios(){
    usuarios = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants').then(renderizarUsuarios).catch(retornarErroNome);
};

setInterval(atualizandoUsuarios, 10000);

function atualizandoMensagens(){
    resposta = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages').then(renderizarMensagens).catch(retornarErro);
};

setInterval(atualizandoMensagens, 5000);

function inputPlaceholder(){
    const usuarioEscolhido = document.querySelector(".selecionado :nth-child(2)");
    const visibilidadeEscolhida = document.querySelector(".selecionadoVisibilidade :nth-child(2)");
    
    if (usuarioEscolhido != null && usuarioEscolhido.innerHTML != "Todos"){
        const input = document.querySelector(".digitar input");
        input.placeholder = "Escreva aqui...\n Enviando para "+ usuarioEscolhido.innerHTML;
        if (visibilidadeEscolhida.innerHTML != "Público"){
            input.placeholder += " (reservadamente)"
        }
    }
}

function voltar(){
    const menu = document.querySelector(".menu");
    menu.classList.remove("visivel");
    menu.classList.add("invisivel");
    setTimeout(escondendoMenuLateral, 1000);
};

function escondendoMenuLateral() { 
    const menu = document.querySelector(".menu");
    menu.classList.add("escondida");
    menu.classList.remove("invisivel");  
};

function selecionarUsuario(elemento){
    const selecionado = document.querySelector(".selecionado");
    selecionado.classList.remove("selecionado");
    elemento.classList.add("selecionado");
    inputPlaceholder();
};

function selecionarVisibilidade(elemento){
    const selecionado = document.querySelector(".selecionadoVisibilidade");
    selecionado.classList.remove("selecionadoVisibilidade");
    elemento.classList.add("selecionadoVisibilidade");
    inputPlaceholder();
};

function enviarMensagem(){
    let input = document.querySelector(".digitar input");
    let tipo = "message";
    if (input.value != ""){
        const usuarioEscolhido = document.querySelector(".selecionado :nth-child(2)");
        const visibilidadeEscolhida = document.querySelector(".selecionadoVisibilidade :nth-child(2)")
        if (visibilidadeEscolhida.innerHTML != "Público"){
            tipo = "private_message";
        } else {
            tipo = "message"
        }
        const mensagem =
        {
            from: nome.name,
            to: usuarioEscolhido.innerHTML,
	        text: input.value,
	        type: tipo
        }
        input.value = "";
        axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem).catch(atualizarPagina);
        
    }
};

function enviarEnter(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    if (charCode == '13'){
        enviarMensagem();
    }

};

function atualizarPagina(){
    window.location.reload();
};

function carregarPagina(){
    const inicial = document.querySelector(".inicial");
    inicial.classList.remove("nomeando");
    inicial.classList.add("carregando");
    setTimeout(function(){inicial.classList.add("escondida");}, tempo)
}