// =====================================
// CONFIGURAÇÕES DO SISTEMA
// =====================================

const USUARIO_ADMIN = "teresinha";
const SENHA_ADMIN = "CEEMTIBG";

const DIAS = [
    "Segunda", "Terça", "Quarta", "Quinta", "Sexta"
];

const HORARIOS = [
    "07:30 - 08:20", "08:20 - 09:10", "09:30 - 10:20", "10:20 - 11:10", "11:10 - 12:00", "13:20 - 14:10", "14:10 - 15:00", "15:20 - 16:10", "16:10 - 17:00"

];

const TURMAS = ["1°|01-EMI ANC", "1°|02-EMI ANC", "1°|01-EMI IPI", "1°|02-EMI IPI", "1°|01-EMI RDC", "2°|01-EMI MCN", "2°|01-EMI ANC", "2°|02-EMI ANC", "2°|01-EMI AIPI", "2°|02-EMI AIPI", "2°|02-EMI MSI", "3°|01-EMI ESP", "3°|01-EMI ANC", "3°|01-EMI IPI", "3°|02-EMI IPI", "3°|01-EMI MSI"];

const CHAVE_STORAGE = "horariosEscolares";

// =====================================
// ELEMENTOS HTML
// =====================================

const areaPublica = document.getElementById("areaPublica");
const areaLogin = document.getElementById("areaLogin");
const areaGerenciador = document.getElementById("areaGerenciador");

const tabelaPublica = document.getElementById("tabelaPublica");
const tabelaGerenciador = document.getElementById("tabelaGerenciador");

const filtroTurma = document.getElementById("filtroTurma");
const turmaGerenciador = document.getElementById("turmaGerenciador");

const diaGerenciador = document.getElementById("diaGerenciador");
const aulaGerenciador = document.getElementById("aulaGerenciador");

const formLogin = document.getElementById("formLogin");
const formAula = document.getElementById("formAula");

const mensagemLogin = document.getElementById("mensagemLogin");
const mensagemEditor = document.getElementById("mensagemEditor");

const tituloEditor = document.getElementById("tituloEditor");

const materiaInput = document.getElementById("materia");
const professorInput = document.getElementById("professor");
const salaInput = document.getElementById("sala");

// =====================================
// DADOS E ESTADO DO SISTEMA
// =====================================

let horarios = carregarHorarios();

let administradorLogado = false;

let celulaSelecionada = {
    turma: "1°|01-EMI ANC",
    dia: 0,
    aula: 0
};

// =====================================
// CRIAR E CARREGAR DADOS
// =====================================

function criarHorariosVazios() {
    const dados = {};

    TURMAS.forEach(turma => {
        dados[turma] = {};

        for (let dia = 0; dia < 5; dia++) {
            dados[turma][dia] = {};

            for (let aula = 0; aula < HORARIOS.length; aula++) {
                dados[turma][dia][aula] = null;
            }
        }
    });

    return dados;
}

function carregarHorarios() {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);

    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);

            if (
                dados &&
                typeof dados === "object" &&
                !Array.isArray(dados)
            ) {
                const vazios = criarHorariosVazios();

                TURMAS.forEach(turma => {
                    if (dados[turma]) {
                        vazios[turma] = dados[turma];
                    }
                });

                return vazios;
            }
        } catch (erro) {
            console.error("Erro ao carregar horários:", erro);
        }
    }

    return criarHorariosVazios();
}

function salvarHorarios() {
    localStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify(horarios)
    );
}

// =====================================
// NAVEGAÇÃO ENTRE AS ÁREAS
// =====================================

function mostrarPublico() {
    areaPublica.classList.remove("escondido");
    areaLogin.classList.add("escondido");
    areaGerenciador.classList.add("escondido");

    renderizarPublico();
}

function mostrarLogin() {
    areaPublica.classList.add("escondido");
    areaLogin.classList.remove("escondido");
    areaGerenciador.classList.add("escondido");

    mensagemLogin.textContent = "";
}

function mostrarGerenciador() {
    areaPublica.classList.add("escondido");
    areaLogin.classList.add("escondido");
    areaGerenciador.classList.remove("escondido");

    renderizarGerenciador();
}

document.getElementById("btnPublico").addEventListener(
    "click",
    mostrarPublico
);

document.getElementById("btnLogin").addEventListener(
    "click",
    mostrarLogin
);

document.getElementById("voltarPublico").addEventListener(
    "click",
    mostrarPublico
);

// =====================================
// LOGIN DO GERENCIADOR
// =====================================

formLogin.addEventListener("submit", function(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;

    if (
        usuario === USUARIO_ADMIN &&
        senha === SENHA_ADMIN
    ) {
        administradorLogado = true;

        mensagemLogin.textContent = "Login realizado com sucesso!";
        mensagemLogin.className = "mensagem sucesso";

        formLogin.reset();

        mostrarGerenciador();
    } else {
        mensagemLogin.textContent = "Usuário ou senha incorretos.";
        mensagemLogin.className = "mensagem erro";
    }
});

document.getElementById("btnSair").addEventListener(
    "click",
    function() {
        administradorLogado = false;
        mostrarPublico();
    }
);

// =====================================
// FUNÇÕES DA GRADE
// =====================================

function obterAula(turma, dia, aula) {
    return horarios[turma]?.[dia]?.[aula] || null;
}

function criarCelula(aula, turma, dia, numeroAula, modo) {
    const td = document.createElement("td");

    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "celula";

    if (aula) {
        td.classList.add("preenchido");

        const materia = document.createElement("strong");
        materia.textContent = aula.materia;

        const professor = document.createElement("span");
        professor.textContent = aula.professor;

        const sala = document.createElement("small");
        sala.textContent = aula.sala;

        botao.append(materia, professor, sala);

        botao.title =
            `${aula.materia} | ${aula.professor} | ${aula.sala}`;

    } else {
        td.classList.add("disponivel");

        const vazio = document.createElement("span");
        vazio.className = "horario-vazio";
        vazio.textContent = "Disponível";

        botao.appendChild(vazio);
    }

    if (modo === "gerenciador") {
        botao.addEventListener("click", function() {
            selecionarCelula(turma, dia, numeroAula);
        });

        if (
            celulaSelecionada.turma === turma &&
            celulaSelecionada.dia === dia &&
            celulaSelecionada.aula === numeroAula
        ) {
            td.classList.add("selecionado");
        }
    }

    td.appendChild(botao);

    return td;
}

function criarCabecalho(tabela) {
    const thead = document.createElement("thead");
    const linha = document.createElement("tr");

    const thHorario = document.createElement("th");
    thHorario.textContent = "Aula";
    linha.appendChild(thHorario);

    DIAS.forEach(dia => {
        const th = document.createElement("th");
        th.textContent = dia;
        linha.appendChild(th);
    });

    thead.appendChild(linha);
    tabela.appendChild(thead);
}

function renderizarGrade(tabela, turma, modo) {
    tabela.innerHTML = "";

    criarCabecalho(tabela);

    const tbody = document.createElement("tbody");

    HORARIOS.forEach((horario, numeroAula) => {
        const linha = document.createElement("tr");

        const th = document.createElement("th");

        th.innerHTML = `
            ${numeroAula + 1}ª aula
            <br>
            <small>${horario}</small>
        `;

        linha.appendChild(th);

        DIAS.forEach((dia, numeroDia) => {
            const aula = obterAula(
                turma,
                numeroDia,
                numeroAula
            );

            const celula = criarCelula(
                aula,
                turma,
                numeroDia,
                numeroAula,
                modo
            );

            linha.appendChild(celula);
        });

        tbody.appendChild(linha);
    });

    tabela.appendChild(tbody);
}

// =====================================
// VISUALIZAÇÃO PÚBLICA
// =====================================

function renderizarPublico() {
    const turma = filtroTurma.value;

    renderizarGrade(
        tabelaPublica,
        turma,
        "publico"
    );
}

filtroTurma.addEventListener("change", renderizarPublico);

// =====================================
// PAINEL DO GERENCIADOR
// =====================================

function renderizarGerenciador() {
    const turma = turmaGerenciador.value;

    renderizarGrade(
        tabelaGerenciador,
        turma,
        "gerenciador"
    );
}

turmaGerenciador.addEventListener(
    "change",
    function() {
        celulaSelecionada.turma = turmaGerenciador.value;

        renderizarGerenciador();
        carregarEditor();
    }
);

diaGerenciador.addEventListener(
    "change",
    function() {
        celulaSelecionada.dia = Number(diaGerenciador.value);

        renderizarGerenciador();
        carregarEditor();
    }
);

aulaGerenciador.addEventListener(
    "change",
    function() {
        celulaSelecionada.aula = Number(aulaGerenciador.value);

        renderizarGerenciador();
        carregarEditor();
    }
);

// =====================================
// SELECIONAR CÉLULA PARA EDITAR
// =====================================

function selecionarCelula(turma, dia, aula) {
    if (!administradorLogado) {
        mostrarLogin();
        return;
    }

    celulaSelecionada = {
        turma: turma,
        dia: dia,
        aula: aula
    };

    turmaGerenciador.value = turma;
    diaGerenciador.value = dia;
    aulaGerenciador.value = aula;

    renderizarGerenciador();
    carregarEditor();
}

function carregarEditor() {
    const { turma, dia, aula } = celulaSelecionada;

    const aulaAtual = obterAula(turma, dia, aula);

    tituloEditor.textContent =
        `${turma} | ${DIAS[dia]} | ${aula + 1}ª aula`;

    materiaInput.value = aulaAtual?.materia || "";
    professorInput.value = aulaAtual?.professor || "";
    salaInput.value = aulaAtual?.sala || "";

    mensagemEditor.textContent = "";
    mensagemEditor.className = "mensagem";
}

// =====================================
// VERIFICAÇÃO DE CONFLITOS
// =====================================

function verificarConflito(novaAula) {
    const { turma, dia, aula } = celulaSelecionada;

    for (const outraTurma of TURMAS) {
        for (let outroDia = 0; outroDia < 5; outroDia++) {
            for (
                let outraAula = 0;
                outraAula < HORARIOS.length;
                outraAula++
            ) {

                if (
                    outraTurma === turma &&
                    outroDia === dia &&
                    outraAula === aula
                ) {
                    continue;
                }

                const aulaExistente = obterAula(
                    outraTurma,
                    outroDia,
                    outraAula
                );

                if (!aulaExistente) {
                    continue;
                }

                const mesmoHorario =
                    outroDia === dia &&
                    outraAula === aula;

                if (!mesmoHorario) {
                    continue;
                }

                const mesmoProfessor =
                    aulaExistente.professor.toLowerCase() ===
                    novaAula.professor.toLowerCase();

                const mesmaSala =
                    aulaExistente.sala.toLowerCase() ===
                    novaAula.sala.toLowerCase();

                if (mesmoProfessor) {
                    return `Conflito: o professor ${novaAula.professor}
                    já está em outra turma nesse horário.`;
                }

                if (mesmaSala) {
                    return `Conflito: a sala ${novaAula.sala}
                    já está ocupada nesse horário.`;
                }
            }
        }
    }

    return null;
}

// =====================================
// SALVAR AULA
// =====================================

formAula.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!administradorLogado) {
        mostrarLogin();
        return;
    }

    const materia = materiaInput.value.trim();
    const professor = professorInput.value.trim();
    const sala = salaInput.value.trim();

    if (!materia || !professor || !sala) {
        mostrarMensagem("Preencha todos os campos.", "erro");
        return;
    }

    const novaAula = {
        materia,
        professor,
        sala
    };

    const conflito = verificarConflito(novaAula);

    if (conflito) {
        mostrarMensagem(conflito, "erro");
        return;
    }

    const { turma, dia, aula } = celulaSelecionada;

    horarios[turma][dia][aula] = novaAula;

    salvarHorarios();

    renderizarGerenciador();

    mostrarMensagem("Aula salva com sucesso!", "sucesso");
});

function mostrarMensagem(texto, tipo) {
    mensagemEditor.textContent = texto;
    mensagemEditor.className = `mensagem ${tipo}`;
}

// =====================================
// LIMPAR UMA CÉLULA
// =====================================

document.getElementById("btnLimpar").addEventListener(
    "click",
    function() {
        if (!administradorLogado) return;

        const { turma, dia, aula } = celulaSelecionada;

        horarios[turma][dia][aula] = null;

        salvarHorarios();

        formAula.reset();

        renderizarGerenciador();
        carregarEditor();

        mostrarMensagem("Horário limpo com sucesso!", "sucesso");
    }
);

// =====================================
// EXPORTAR HORÁRIOS
// =====================================

document.getElementById("btnExportar").addEventListener(
    "click",
    function() {
        if (!administradorLogado) return;

        const arquivo = new Blob(
            [JSON.stringify(horarios, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(arquivo);

        const link = document.createElement("a");

        link.href = url;
        link.download = "horarios-escolares.json";

        link.click();

        URL.revokeObjectURL(url);
    }
);

// =====================================
// APAGAR TODOS OS HORÁRIOS
// =====================================

document.getElementById("btnLimparTudo").addEventListener(
    "click",
    function() {
        if (!administradorLogado) return;

        const confirmar = confirm(
            "Tem certeza que deseja apagar todos os horários?"
        );

        if (!confirmar) return;

        horarios = criarHorariosVazios();

        salvarHorarios();

        renderizarGerenciador();
        carregarEditor();

        mostrarMensagem(
            "Todos os horários foram apagados.",
            "sucesso"
        );
    }
);

// =====================================
// INICIALIZAÇÃO
// =====================================

mostrarPublico();
