
// ==================================
// CONECTA ESCOLA
// ==================================

// Elementos do HTML

const formulario = document.getElementById("formAtividade");

const lista = document.getElementById("listaAtividades");

const mensagem = document.getElementById("mensagem");

const totalPendentes = document.getElementById("totalPendentes");

const totalConcluidas = document.getElementById("totalConcluidas");

const totalAtividades = document.getElementById("totalAtividades");

const botoesFiltro = document.querySelectorAll(".filtro");


// Verifica se os elementos existem

if (!formulario || !lista) {
    console.error("Erro: formulário ou lista não encontrados no HTML.");
}


// ==================================
// CARREGAR DADOS SALVOS
// ==================================

let atividades = [];

try {

    atividades = JSON.parse(
        localStorage.getItem("atividadesEscolares")
    ) || [];

} catch (erro) {

    atividades = [];

}

let filtroAtual = "todas";


// ==================================
// SALVAR ATIVIDADES
// ==================================

function salvarAtividades() {

    localStorage.setItem(
        "atividadesEscolares",
        JSON.stringify(atividades)
    );

}


// ==================================
// CADASTRAR ATIVIDADE
// ==================================

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();

    const materia = document.getElementById("materia").value;

    const tipo = document.getElementById("tipo").value;

    const data = document.getElementById("data").value;

    const descricao = document.getElementById("descricao").value.trim();


    if (!nome || !materia || !tipo || !data) {

        mensagem.textContent = "Preencha os campos obrigatórios!";

        return;

    }


    // Criar nova atividade

    const novaAtividade = {

        id: Date.now().toString(),

        nome: nome,

        materia: materia,

        tipo: tipo,

        data: data,

        descricao: descricao,

        concluida: false

    };


    // Adicionar à lista

    atividades.push(novaAtividade);


    // Salvar no navegador

    salvarAtividades();


    // Atualizar a tela

    atualizarTela();


    // Limpar formulário

    formulario.reset();


    mensagem.textContent = "Atividade cadastrada com sucesso!";

});


// ==================================
// EXIBIR ATIVIDADES
// ==================================

function mostrarAtividades() {

    lista.innerHTML = "";


    // Aplicar filtros

    const filtradas = atividades.filter(function(item) {

        if (filtroAtual === "pendente") {
            return item.concluida === false;
        }

        if (filtroAtual === "concluida") {
            return item.concluida === true;
        }

        return true;

    });


    // Verificar lista vazia

    if (filtradas.length === 0) {

        const aviso = document.createElement("p");

        aviso.className = "vazio";

        aviso.textContent = "Nenhuma atividade cadastrada.";

        lista.appendChild(aviso);

        return;

    }


    // Mostrar cada atividade

    filtradas.forEach(function(item) {

        const card = document.createElement("article");

        card.className = "atividade";


        const titulo = document.createElement("h3");

        titulo.textContent = item.nome;


        const materia = document.createElement("p");

        materia.textContent = "Matéria: " + item.materia;


        const tipo = document.createElement("p");

        tipo.textContent = "Tipo: " + item.tipo;


        const data = document.createElement("p");

        const partes = item.data.split("-");

        data.textContent = "Entrega: " +
            partes[2] + "/" + partes[1] + "/" + partes[0];


        const status = document.createElement("p");

        status.textContent = item.concluida
            ? "Status: Concluída"
            : "Status: Pendente";


        card.appendChild(titulo);

        card.appendChild(materia);

        card.appendChild(tipo);

        card.appendChild(data);


        if (item.descricao) {

            const descricao = document.createElement("p");

            descricao.textContent = "Descrição: " + item.descricao;

            card.appendChild(descricao);

        }

        card.appendChild(status);


        // Botão concluir

        const concluir = document.createElement("button");

        concluir.type = "button";

        concluir.textContent = item.concluida
            ? "Reabrir atividade"
            : "Concluir atividade";


        concluir.addEventListener("click", function() {

            item.concluida = !item.concluida;

            salvarAtividades();

            atualizarTela();

        });


        // Botão excluir

        const excluir = document.createElement("button");

        excluir.type = "button";

        excluir.textContent = "Excluir";

        excluir.style.marginLeft = "10px";


        excluir.addEventListener("click", function() {

            atividades = atividades.filter(function(atividade) {

                return atividade.id !== item.id;

            });

            salvarAtividades();

            atualizarTela();

        });


        card.appendChild(concluir);

        card.appendChild(excluir);


        // Adicionar à tela

        lista.appendChild(card);

    });

}


// ==================================
// ATUALIZAR CONTADORES
// ==================================

function atualizarResumo() {

    const pendentes = atividades.filter(
        item => !item.concluida
    ).length;

    const concluidas = atividades.filter(
        item => item.concluida
    ).length;


    totalPendentes.textContent = pendentes;

    totalConcluidas.textContent = concluidas;

    totalAtividades.textContent = atividades.length;

}


// ==================================
// FILTROS
// ==================================

botoesFiltro.forEach(function(botao) {

    botao.addEventListener("click", function() {

        filtroAtual = botao.dataset.filtro;

        botoesFiltro.forEach(function(item) {

            item.classList.remove("ativo");

        });

        botao.classList.add("ativo");

        mostrarAtividades();

    });

});


// ==================================
// ATUALIZAR SITE
// ==================================

function atualizarTela() {

    mostrarAtividades();

    atualizarResumo();

}


// ==================================
// INICIAR
// ==================================

atualizarTela();
