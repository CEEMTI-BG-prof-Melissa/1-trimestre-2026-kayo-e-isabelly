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

// =====================================
// PROFESSORES CADASTRADOS
// =====================================

const CHAVE_PROFESSORES = "professoresEscolares";

let PROFESSORES = carregarProfessores();

function carregarProfessores() {
    const dados = localStorage.getItem(CHAVE_PROFESSORES);

    if (!dados) {
        return [];
    }

    try {
        const professores = JSON.parse(dados);

        if (!Array.isArray(professores)) {
            return [];
        }

        return professores.filter(
            nome => typeof nome === "string"
        );

    } catch (erro) {
        console.error("Erro ao carregar professores:", erro);
        return [];
    }
}

function salvarProfessores() {
    localStorage.setItem(
        CHAVE_PROFESSORES,
        JSON.stringify(PROFESSORES)
    );
}

const SALAS = [
    "Sala 01",
    "Sala 02",
    "Sala 03",
    "Sala 04",
    "Sala 05",
    "Sala 06",
    "Sala 07",
    "Sala 08",
    "Sala 09",
    "Sala 10",
    "Sala 11",
    "Sala 12",
    "Sala 13",
    "Lied 01",
    "Lied 01",
    "Laboratório de Biologia",
    "Laboratório Analises Clinicas"
];
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

    renderizarCadastroProfessores();

    atualizarDisponibilidade();
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
// EXPORTAR HORÁRIOS PARA EXCEL
// =====================================

document.getElementById("btnExportar").addEventListener("click", function() {
    if (!administradorLogado) return;

    if (typeof XLSX === "undefined") {
        alert("Não foi possível carregar a biblioteca de planilhas. Verifique sua conexão com a internet.");
        return;
    }

    // Cria uma nova planilha
    const planilha = XLSX.utils.book_new();

    // Cria uma aba para cada turma
    TURMAS.forEach(turma => {
        const dados = [];

        // Cabeçalho: horários e dias da semana
        dados.push(["Aula / Horário", ...DIAS]);

        // Uma linha para cada aula
        HORARIOS.forEach((horario, numeroAula) => {
            const linha = [
                `${numeroAula + 1}ª aula\n${horario}`
            ];

            // Preenche as colunas de segunda a sexta
            DIAS.forEach((dia, numeroDia) => {
                const aula = obterAula(
                    turma,
                    numeroDia,
                    numeroAula
                );

                if (aula) {
                    linha.push(
                        `${aula.materia}\n` +
                        `Professor: ${aula.professor}\n` +
                        `Sala: ${aula.sala}`
                    );
                } else {
                    linha.push("Disponível");
                }
            });

            dados.push(linha);
        });

        // Converte os dados em uma planilha
        const folha = XLSX.utils.aoa_to_sheet(dados);

        // Ajusta a largura das colunas
        folha["!cols"] = [
            { wch: 22 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 }
        ];

        // Ajusta a altura das linhas para caberem as informações
        folha["!rows"] = dados.map((linha, indice) => ({
            hpt: indice === 0 ? 25 : 55
        }));

        // Limita o nome da aba a 31 caracteres
        const nomeAba = turma
            .replace(/[\\/?*[\]:]/g, "")
            .substring(0, 31);

        XLSX.utils.book_append_sheet(
            planilha,
            folha,
            nomeAba
        );
    });

    // Gera e baixa o arquivo Excel
    XLSX.writeFile(
        planilha,
        "horarios-escolares.xlsx"
    );
});

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
// DISPONIBILIDADE DE PROFESSORES E SALAS
// =====================================

function atualizarDisponibilidade() {

    const { turma, dia, aula } = celulaSelecionada;

    const professoresOcupados = new Set();
    const salasOcupadas = new Set();

    // Verifica todas as turmas no mesmo dia e horário
    TURMAS.forEach(outraTurma => {

        const aulaAtual = obterAula(
            outraTurma,
            dia,
            aula
        );

        if (!aulaAtual) return;

        // Ignora a própria célula selecionada,
        // permitindo editar uma aula já cadastrada
        if (outraTurma === turma) return;

        professoresOcupados.add(
            normalizarTexto(aulaAtual.professor)
        );

        salasOcupadas.add(
            normalizarTexto(aulaAtual.sala)
        );
    });

    // Filtra os professores que não estão ocupados
    const professoresDisponiveis = PROFESSORES.filter(
        professor => !professoresOcupados.has(
            normalizarTexto(professor)
        )
    );

    // Filtra as salas que não estão ocupadas
    const salasDisponiveis = SALAS.filter(
        sala => !salasOcupadas.has(
            normalizarTexto(sala)
        )
    );

    // Atualiza o título do painel
    document.getElementById(
        "tituloDisponibilidade"
    ).textContent =
        `${DIAS[dia]} | ${aula + 1}ª aula | ${HORARIOS[aula]}`;

// Atualiza as listas de disponibilidade
preencherLista(
    "listaProfessores",
    professoresDisponiveis,
    "Nenhum professor disponível."
);

preencherLista(
    "listaSalas",
    salasDisponiveis,
    "Nenhuma sala vazia."
);

// Atualiza os contadores
document.getElementById("contadorProfessores").textContent =
    professoresDisponiveis.length;

document.getElementById("contadorSalas").textContent =
    salasDisponiveis.length;
}


// Normaliza letras maiúsculas, minúsculas e espaços
function normalizarTexto(texto) {
    return texto
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}


// Preenche uma lista HTML
function preencherLista(id, itens, mensagemVazia) {

    const lista = document.getElementById(id);

    lista.innerHTML = "";

    if (itens.length === 0) {

        const item = document.createElement("li");

        item.textContent = mensagemVazia;
        item.className = "indisponivel";

        lista.appendChild(item);

        return;
    }

    itens.forEach(nome => {

        const item = document.createElement("li");

        item.textContent = nome;

        lista.appendChild(item);
    });
}
// =====================================
// CADASTRO E EXCLUSÃO DE PROFESSORES
// =====================================

const formProfessor = document.getElementById("formProfessor");

const nomeProfessorInput = document.getElementById("nomeProfessor");

const listaCadastroProfessores = document.getElementById(
    "listaCadastroProfessores"
);

const mensagemProfessor = document.getElementById(
    "mensagemProfessor"
);

const totalProfessores = document.getElementById(
    "totalProfessores"
);


// Cadastra um professor
formProfessor.addEventListener("submit", function(event) {
    event.preventDefault();

    if (!administradorLogado) {
        mostrarMensagemProfessor(
            "Entre como gerenciador para cadastrar professores.",
            "erro"
        );

        return;
    }

    const nome = nomeProfessorInput.value.trim();

    if (!nome) {
        mostrarMensagemProfessor(
            "Digite o nome do professor.",
            "erro"
        );

        return;
    }

    // Impede nomes duplicados
    const jaExiste = PROFESSORES.some(
        professor =>
            normalizarTexto(professor) === normalizarTexto(nome)
    );

    if (jaExiste) {
        mostrarMensagemProfessor(
            "Este professor já está cadastrado.",
            "erro"
        );

        return;
    }

    PROFESSORES.push(nome);

    PROFESSORES.sort((a, b) =>
        a.localeCompare(b, "pt-BR")
    );

    salvarProfessores();

    formProfessor.reset();

    renderizarCadastroProfessores();
    atualizarDisponibilidade();

    mostrarMensagemProfessor(
        "Professor cadastrado com sucesso!",
        "sucesso"
    );
});


// Exibe todos os professores cadastrados
function renderizarCadastroProfessores() {
    if (!listaCadastroProfessores) return;

    listaCadastroProfessores.innerHTML = "";

    totalProfessores.textContent = PROFESSORES.length;

    if (PROFESSORES.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 2;
        celula.className = "sem-professores";
        celula.textContent = "Nenhum professor cadastrado.";

        linha.appendChild(celula);
        listaCadastroProfessores.appendChild(linha);

        return;
    }

    PROFESSORES.forEach(professor => {
        const linha = document.createElement("tr");

        const celulaNome = document.createElement("td");
        celulaNome.textContent = professor;

        const celulaAcoes = document.createElement("td");

        const botaoExcluir = document.createElement("button");

        botaoExcluir.type = "button";
        botaoExcluir.className = "botao-excluir";
        botaoExcluir.textContent = "Excluir";

        botaoExcluir.addEventListener("click", function() {
            excluirProfessor(professor);
        });

        celulaAcoes.appendChild(botaoExcluir);

        linha.appendChild(celulaNome);
        linha.appendChild(celulaAcoes);

        listaCadastroProfessores.appendChild(linha);
    });
}


// Exclui um professor do cadastro
function excluirProfessor(nome) {
    if (!administradorLogado) return;

    const possuiAulas = verificarAulasDoProfessor(nome);

    if (possuiAulas) {
        mostrarMensagemProfessor(
            "Este professor possui aulas cadastradas. " +
            "Remova ou substitua essas aulas antes de excluí-lo.",
            "erro"
        );

        return;
    }

    const confirmar = confirm(
        `Deseja realmente excluir o professor ${nome}?`
    );

    if (!confirmar) return;

    PROFESSORES = PROFESSORES.filter(
        professor =>
            normalizarTexto(professor) !== normalizarTexto(nome)
    );

    salvarProfessores();

    renderizarCadastroProfessores();
    atualizarDisponibilidade();

    mostrarMensagemProfessor(
        "Professor excluído com sucesso.",
        "sucesso"
    );
}


// Verifica se o professor está em alguma aula
function verificarAulasDoProfessor(nome) {
    for (const turma of TURMAS) {
        for (let dia = 0; dia < 5; dia++) {
            for (let aula = 0; aula < HORARIOS.length; aula++) {

                const aulaAtual = obterAula(turma, dia, aula);

                if (
                    aulaAtual &&
                    normalizarTexto(aulaAtual.professor) ===
                    normalizarTexto(nome)
                ) {
                    return true;
                }
            }
        }
    }

    return false;
}


// Exibe mensagens do cadastro
function mostrarMensagemProfessor(texto, tipo) {
    mensagemProfessor.textContent = texto;
    mensagemProfessor.className = `mensagem ${tipo}`;
}
// =====================================
// INICIALIZAÇÃO
// =====================================


mostrarPublico();
