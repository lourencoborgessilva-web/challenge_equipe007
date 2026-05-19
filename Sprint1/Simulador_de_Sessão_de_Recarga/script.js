// ============================================================
//  GOODWE — Simulador de Sessão de Recarga
//  Sprint 1 — DSA
// ============================================================


// ============================================================
//  Utilitários
// ============================================================

function atualizarTexto(id, valor) {
    const el = document.getElementById(id);
    if (el) el.innerText = valor;
}

function atualizarHTML(id, icone, texto) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<i data-lucide="${icone}"></i> ${texto}`;
    lucide.createIcons();
}

function chamarBotao(idBotao, evento, funcao) {
    const botao = document.getElementById(idBotao);
    if (botao) botao.addEventListener(evento, funcao);
}

function pegarHorarioAtual() {
    const agora = new Date();
    const horas    = String(agora.getHours()).padStart(2, "0");
    const minutos  = String(agora.getMinutes()).padStart(2, "0");
    const segundos = String(agora.getSeconds()).padStart(2, "0");
    return `${horas}:${minutos}:${segundos}`;
}


// ============================================================
//  Regras de tarifação
// ============================================================

/*
    Horários de pico:    06h–09h  e  17h–21h  → tarifa 1.5×
    Horários normais:    09h–17h              → tarifa 1.0×
    Horário noturno:     21h–06h              → tarifa 0.8×

    Descontos por tipo de usuário:
        assinante   → 15%
        corporativo → 10%
        comum       → 0%

    Desconto por origem de energia fotovoltaica: 5% adicional
*/

const TARIFA_BASE = 1.80; // R$/kWh

const MULTIPLICADORES_HORARIO = {
    pico:    1.50,
    normal:  1.00,
    noturno: 0.80,
};

const DESCONTOS_USUARIO = {
    assinante:   0.15,
    corporativo: 0.10,
    comum:       0.00,
};

const DESCONTO_FOTOVOLTAICA = 0.05;


/**
 * Determina a faixa tarifária com base na hora atual.
 * Usa estrutura if/else encadeada para cobrir todos os intervalos.
 * @returns {{ faixa: string, label: string, multiplicador: number }}
 */
function calcularFaixaTarifaria(hora) {
    let faixa, label, multiplicador;

    if ((hora >= 6 && hora < 9) || (hora >= 17 && hora < 21)) {
        faixa         = "pico";
        label         = "Horário de pico (+50%)";
        multiplicador = MULTIPLICADORES_HORARIO.pico;
    } else if (hora >= 9 && hora < 17) {
        faixa         = "normal";
        label         = "Horário normal";
        multiplicador = MULTIPLICADORES_HORARIO.normal;
    } else {
        faixa         = "noturno";
        label         = "Horário noturno (−20%)";
        multiplicador = MULTIPLICADORES_HORARIO.noturno;
    }

    return { faixa, label, multiplicador };
}


/**
 * Calcula a tarifa efetiva por kWh considerando:
 *  - faixa horária
 *  - tipo de usuário
 *  - origem da energia
 */
function calcularTarifaEfetiva(hora, tipoUsuario, origemEnergia) {
    const { multiplicador, label, faixa } = calcularFaixaTarifaria(hora);

    const descontoUsuario = DESCONTOS_USUARIO[tipoUsuario] ?? 0;
    const descontoEnergia = origemEnergia === "fotovoltaica" ? DESCONTO_FOTOVOLTAICA : 0;

    // Aplica multiplicador de pico ANTES dos descontos
    const tarifaComPico = TARIFA_BASE * multiplicador;

    // Descontos cumulativos
    const descontoTotal = descontoUsuario + descontoEnergia;
    const tarifaFinal   = tarifaComPico * (1 - descontoTotal);

    return { tarifaFinal, descontoTotal, label, faixa };
}


// ============================================================
//  Validações com estruturas de repetição (while / for)
// ============================================================

/**
 * Valida se todos os campos obrigatórios do formulário estão
 * preenchidos corretamente. Usa um for...of para iterar sobre
 * a lista de campos e acumular mensagens de erro.
 * @returns {{ valido: boolean, erros: string[] }}
 */
function validarCamposFormulario(dados) {
    const erros = [];

    // Campos obrigatórios e suas regras
    const regras = [
        {
            campo: "nome",
            valor: dados.nome,
            teste: (v) => v && v.length >= 2,
            msg:   "Nome deve ter ao menos 2 caracteres.",
        },
        {
            campo: "tipo_usuario",
            valor: dados.tipo_usuario,
            teste: (v) => ["comum", "assinante", "corporativo"].includes(v),
            msg:   "Selecione um tipo de usuário válido.",
        },
        {
            campo: "capacidade_bateria",
            valor: dados.capacidade_bateria,
            teste: (v) => v > 0 && v <= 200,
            msg:   "Capacidade da bateria deve estar entre 1 e 200 kWh.",
        },
        {
            campo: "bateria_inicial",
            valor: dados.bateria_inicial,
            teste: (v) => v >= 0 && v <= 100,
            msg:   "Bateria inicial deve estar entre 0% e 100%.",
        },
        {
            campo: "bateria_desejada",
            valor: dados.bateria_desejada,
            teste: (v) => v > 0 && v <= 100,
            msg:   "Bateria desejada deve estar entre 1% e 100%.",
        },
        {
            campo: "origem_energia",
            valor: dados.origem_energia,
            teste: (v) => ["fotovoltaica", "rede"].includes(v),
            msg:   "Selecione uma origem de energia válida.",
        },
    ];

    // Itera sobre todas as regras usando for...of
    for (const regra of regras) {
        if (!regra.teste(regra.valor)) {
            erros.push(regra.msg);
        }
    }

    // Validação cruzada: bateria inicial < bateria desejada
    if (dados.bateria_inicial >= dados.bateria_desejada) {
        erros.push("A bateria inicial deve ser menor que a bateria desejada.");
    }

    return { valido: erros.length === 0, erros };
}


/**
 * Exibe erros de validação no formulário.
 * Usa for...of para criar um elemento de alerta por erro.
 */
function exibirErrosValidacao(erros) {
    // Remove alertas anteriores
    const anteriores = document.querySelectorAll(".erro-validacao");
    for (const el of anteriores) {
        el.remove();
    }

    const form = document.getElementById("form-recarga");
    if (!form) return;

    const container = document.createElement("div");
    container.className = "erro-validacao";
    container.style.cssText = `
        background: #FEF2F2;
        border: 1px solid rgba(239,68,68,0.3);
        border-radius: 14px;
        padding: 16px 20px;
        margin-bottom: 8px;
        color: #DC2626;
        font-size: 13px;
        font-weight: 600;
    `;

    // Cria um item de lista para cada erro com for...of
    const lista = document.createElement("ul");
    lista.style.cssText = "margin: 6px 0 0; padding-left: 18px;";

    for (const msg of erros) {
        const item = document.createElement("li");
        item.textContent = msg;
        lista.appendChild(item);
    }

    container.innerHTML = "<strong>Corrija os campos abaixo:</strong>";
    container.appendChild(lista);

    const botao = form.querySelector(".botao-principal");
    if (botao) form.insertBefore(container, botao);
}


// ============================================================
//  Página de índice — salva dados do formulário
// ============================================================

const formRecarga = document.getElementById("form-recarga");

if (formRecarga) {
    formRecarga.addEventListener("submit", function (e) {
        e.preventDefault();

        const dadosSessao = {
            nome:               document.getElementById("nome").value.trim(),
            tipo_usuario:       document.getElementById("tipo_usuario").value,
            capacidade_bateria: parseFloat(document.getElementById("capacidade_bateria").value),
            bateria_inicial:    parseFloat(document.getElementById("bateria_inicial").value),
            bateria_desejada:   parseFloat(document.getElementById("bateria_desejada").value),
            origem_energia:     document.getElementById("origem_energia").value,
        };

        // Validação completa via for...of
        const { valido, erros } = validarCamposFormulario(dadosSessao);

        if (!valido) {
            exibirErrosValidacao(erros);
            return;
        }

        sessionStorage.setItem("dadosSessao", JSON.stringify(dadosSessao));
        window.location.href = "recarga.html";
    });
}


// ============================================================
//  Página de recarga — simulação
// ============================================================

if (document.getElementById("porcentagem-bateria")) {

    // --- Carrega dados salvos pelo formulário ---
    const dadosSessao = JSON.parse(sessionStorage.getItem("dadosSessao")) || null;

    // Dados do usuário
    const nomeUsuario       = dadosSessao?.nome               || "Usuário";
    const tipoUsuario       = dadosSessao?.tipo_usuario       || "comum";
    const capacidadeBateria = dadosSessao?.capacidade_bateria || 60;
    const bateriaDesejada   = dadosSessao?.bateria_desejada   || 100;
    const origemEnergia     = dadosSessao?.origem_energia     || "rede";

    // Bateria inicial
    let energiaInicial = dadosSessao
        ? dadosSessao.bateria_inicial
        : Math.floor(Math.random() * 26);


    // --------------------------------------------------------
    //  Calcula tarifa com base no horário de início
    // --------------------------------------------------------

    const horaAtual = new Date().getHours();
    const {
        tarifaFinal,
        descontoTotal,
        label: labelTarifa,
        faixa: faixaTarifa,
    } = calcularTarifaEfetiva(horaAtual, tipoUsuario, origemEnergia);


    // --------------------------------------------------------
    //  Preenche campos estáticos do relatório
    // --------------------------------------------------------

    atualizarTexto("relatorio-nome", nomeUsuario);

    // Switch para rótulo do tipo de usuário
    switch (tipoUsuario) {
        case "assinante":
            atualizarTexto("relatorio-tipo-usuario", "Assinante GOODWE+");
            break;
        case "corporativo":
            atualizarTexto("relatorio-tipo-usuario", "Corporativo");
            break;
        default:
            atualizarTexto("relatorio-tipo-usuario", "Comum");
    }

    atualizarTexto("relatorio-capacidade-bateria", capacidadeBateria + " kWh");
    atualizarTexto("relatorio-bateria-desejada",   bateriaDesejada + "%");
    atualizarTexto("relatorio-origem-energia",
        origemEnergia === "fotovoltaica" ? "Energia fotovoltaica" : "Rede elétrica");

    atualizarTexto("relatorio-bateria-inicial", energiaInicial + "%");
    atualizarTexto("porcentagem-bateria",        energiaInicial + "%");

    // Exibe tarifa calculada (com horário de pico aplicado)
    atualizarTexto("tarifa-base",   `R$ ${tarifaFinal.toFixed(2)}/kWh`);
    atualizarTexto("tipo-tarifa",    labelTarifa);

    // Exibe desconto total de forma legível
    if (descontoTotal > 0) {
        atualizarTexto("desconto-cobranca", `-${(descontoTotal * 100).toFixed(0)}%`);
    } else if (faixaTarifa === "pico") {
        atualizarTexto("desconto-cobranca", "Nenhum (horário de pico)");
    } else {
        atualizarTexto("desconto-cobranca", "R$ 0,00");
    }


    // --------------------------------------------------------
    //  Variáveis de controle da sessão
    // --------------------------------------------------------

    let carregando         = null;
    let animacaoCarregando = null;
    let pontosAnimacao     = 0;
    let tempoDeRecarga     = 0;
    let horarioInicioSessao = "";
    let horarioFimSessao    = "";
    let bateriaInicialSessao = energiaInicial;


    // --------------------------------------------------------
    //  Funções auxiliares
    // --------------------------------------------------------

    function carregandoNull() {
        clearInterval(carregando);
        clearInterval(animacaoCarregando);
        carregando = null;
    }

    function animarCarregando() {
        clearInterval(animacaoCarregando);
        animacaoCarregando = setInterval(() => {
            pontosAnimacao = (pontosAnimacao % 3) + 1;

            // Usa while para construir a string de pontos
            let pontos = "";
            let i = 0;
            while (i < pontosAnimacao) {
                pontos += ".";
                i++;
            }

            // Preenche espaços restantes com &nbsp;
            let espacos = "";
            let j = pontosAnimacao;
            while (j < 3) {
                espacos += "\u00A0";
                j++;
            }

            const el = document.getElementById("status-carregamento");
            if (el) {
                el.innerHTML = `<i data-lucide="battery-charging"></i> Carregando${pontos}${espacos}`;
                lucide.createIcons();
            }
        }, 700);
    }

    function atualizarBarraProgresso() {
        const barra = document.getElementById("barra-progresso");
        if (barra) {
            barra.style.width      = energiaInicial + "%";
            barra.style.transition = "width 1s ease";
        }
    }

    function atualizarkWh() {
        const energiaCarregada = energiaInicial - bateriaInicialSessao;
        const kWhCarregados    = energiaCarregada * (capacidadeBateria / 100);
        atualizarHTML("energia-entregue", "zap", `${kWhCarregados.toFixed(2)} kWh`);
    }

    function atualizarTempo() {
        tempoDeRecarga += 1;
        const horas    = String(Math.floor(tempoDeRecarga / 3600)).padStart(2, "0");
        const minutos  = String(Math.floor((tempoDeRecarga % 3600) / 60)).padStart(2, "0");
        const segundos = String(tempoDeRecarga % 60).padStart(2, "0");
        const tempoFormatado = `${horas}:${minutos}:${segundos}`;
        atualizarTexto("tempo-decorrido",       tempoFormatado);
        atualizarTexto("relatorio-tempo-total", tempoFormatado);
    }

    function custoPelaRecarga() {
        const energiaCarregada = energiaInicial - bateriaInicialSessao;
        const kWhCarregados    = energiaCarregada * (capacidadeBateria / 100);
        const custoTotal       = kWhCarregados * tarifaFinal;
        atualizarTexto("custo-estimado",    `R$ ${custoTotal.toFixed(2)}`);
        atualizarTexto("total-cobranca",    `R$ ${custoTotal.toFixed(2)}`);
        atualizarTexto("subtotal-cobranca", `R$ ${custoTotal.toFixed(2)}`);
    }

    /**
     * Calcula a previsão de término da sessão.
     * Usa um loop for para simular os passos de carga restantes
     * e estimar quantos segundos faltam.
     */
    function calcularPrevisaoTermino() {
        const passosPorSegundo = 5; // igual ao incremento no setInterval
        let bateriaSimulada    = energiaInicial;
        let segundosRestantes  = 0;

        // Simula os passos restantes com for
        for (
            let pct = bateriaSimulada;
            pct < bateriaDesejada;
            pct = Math.min(pct + passosPorSegundo, bateriaDesejada)
        ) {
            segundosRestantes++;
            if (pct + passosPorSegundo >= bateriaDesejada) break;
        }

        const agora       = new Date();
        const previsao    = new Date(agora.getTime() + segundosRestantes * 1000);
        const hh          = String(previsao.getHours()).padStart(2, "0");
        const mm          = String(previsao.getMinutes()).padStart(2, "0");
        const ss          = String(previsao.getSeconds()).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    }


    // --------------------------------------------------------
    //  Iniciar recarga
    // --------------------------------------------------------

    function iniciarRecarga() {
        if (carregando) return;

        // Registra horário de início apenas uma vez
        if (horarioInicioSessao === "") {
            horarioInicioSessao = pegarHorarioAtual();
            atualizarTexto("horario-inicio",    horarioInicioSessao);
            atualizarTexto("relatorio-inicio",  horarioInicioSessao);

            // Calcula previsão de término ao iniciar
            atualizarTexto("horario-fim", calcularPrevisaoTermino());
        }

        animarCarregando();

        carregando = setInterval(() => {
            if (energiaInicial < bateriaDesejada) {
                energiaInicial = Math.min(energiaInicial + 5, bateriaDesejada);

                atualizarHTML("btn-continuar-sessao", "play",  "Carregando");
                atualizarHTML("btn-pausar-sessao",    "pause", "Pausar");
                atualizarTexto("porcentagem-bateria", energiaInicial + "%");

                atualizarkWh();
                atualizarTempo();
                atualizarBarraProgresso();
                custoPelaRecarga();

            } else {
                carregandoNull();
                finalizarRecarga();
            }
        }, 1000);
    }

    chamarBotao("btn-continuar-sessao", "click", iniciarRecarga);


    // --------------------------------------------------------
    //  Pausar / retomar
    // --------------------------------------------------------

    function pararRecarga() {
        if (carregando) {
            carregandoNull();
            atualizarHTML("btn-pausar-sessao",    "pause", "Pausado");
            atualizarHTML("btn-continuar-sessao", "play",  "Continuar");
        } else {
            iniciarRecarga();
        }
    }

    chamarBotao("btn-pausar-sessao", "click", pararRecarga);


    // --------------------------------------------------------
    //  Finalizar recarga
    // --------------------------------------------------------

    function finalizarRecarga() {
        if (energiaInicial < bateriaDesejada) {
            console.warn("A recarga ainda não foi concluída.");
            return;
        }

        horarioFimSessao = pegarHorarioAtual();
        atualizarTexto("horario-fim",           horarioFimSessao);
        atualizarTexto("relatorio-fim",         horarioFimSessao);
        atualizarTexto("relatorio-bateria-final", energiaInicial + "%");
        atualizarTexto("relatorio-status",      "Concluída");

        const elEnergiaEntregue = document.getElementById("energia-entregue");
        if (elEnergiaEntregue) {
            atualizarTexto("relatorio-energia-consumida", elEnergiaEntregue.innerText);
        }

        // Mostra relatório e esconde botões de sessão
        const relatorio = document.getElementById("relatorio-sessao");
        if (relatorio) relatorio.removeAttribute("hidden");

        const btnContinuar = document.getElementById("btn-continuar-sessao");
        const btnPausar    = document.getElementById("btn-pausar-sessao");
        if (btnContinuar) btnContinuar.style.display = "none";
        if (btnPausar)    btnPausar.style.display    = "none";

        carregandoNull();
        atualizarHTML("status-carregamento", "check-circle", "Recarga completa");


        // ── Salva no histórico (localStorage) ────────────────

        const relatorioSessao = {
            nome:             nomeUsuario,
            tipoUsuario,
            capacidadeBateria,
            bateriaInicial:   bateriaInicialSessao + "%",
            bateriaFinal:     energiaInicial + "%",
            tempoTotal:       document.getElementById("relatorio-tempo-total")?.innerText,
            energiaConsumida: document.getElementById("energia-entregue")?.innerText,
            custoTotal:       document.getElementById("total-cobranca")?.innerText,
            horarioInicio:    horarioInicioSessao,
            horarioFim:       horarioFimSessao,
            faixaTarifa:      labelTarifa,
            tarifaUsada:      `R$ ${tarifaFinal.toFixed(2)}/kWh`,
            origemEnergia,
            data:             new Date().toLocaleDateString("pt-BR"),
        };

        const historicoRecargas = JSON.parse(localStorage.getItem("historicoRecargas")) || [];
        historicoRecargas.push(relatorioSessao);
        localStorage.setItem("historicoRecargas", JSON.stringify(historicoRecargas));


        // ── Exibe histórico no console ────────────────────────

        console.clear();
        console.log("%c GOODWE — Histórico de Recargas", "font-size:16px;font-weight:bold;color:#E60012");
        console.log(`%c${historicoRecargas.length} sessão(ões) registrada(s)\n`, "color:#6B7280");

        // For...of para iterar sobre o histórico completo
        for (const [i, sessao] of historicoRecargas.entries()) {
            console.groupCollapsed(
                `%c Sessão #${i + 1} — ${sessao.nome || "Usuário"}  |  ${sessao.data || ""}`,
                "font-weight:bold;color:#111827"
            );
            const campos = [
                ["Usuário",          sessao.nome],
                ["Tipo",             sessao.tipoUsuario],
                ["Capacidade",       sessao.capacidadeBateria + " kWh"],
                ["Bateria inicial",  sessao.bateriaInicial],
                ["Bateria final",    sessao.bateriaFinal],
                ["Energia entregue", sessao.energiaConsumida],
                ["Tempo total",      sessao.tempoTotal],
                ["Início",           sessao.horarioInicio],
                ["Fim",              sessao.horarioFim],
                ["Faixa tarifária",  sessao.faixaTarifa],
                ["Tarifa aplicada",  sessao.tarifaUsada],
                ["Origem da energia",sessao.origemEnergia],
            ];

            // For...of nos campos do relatório
            for (const [label, valor] of campos) {
                console.log(`%c${label}`, "color:#6B7280;font-weight:bold", valor);
            }

            console.log("%cCusto total", "color:#E60012;font-weight:bold", sessao.custoTotal);
            console.groupEnd();
        }

        console.log("\n%c Objeto completo do histórico:", "color:#6B7280");
        console.table(historicoRecargas);
    }

    chamarBotao("btn-finalizar-sessao", "click", finalizarRecarga);


    // --------------------------------------------------------
    //  Reiniciar sessão (botão "Voltar ao início")
    // --------------------------------------------------------

    function reiniciarSessao() {
        sessionStorage.removeItem("dadosSessao");
        window.location.href = "index.html";
    }

    chamarBotao("btn-voltar-inicio", "click", reiniciarSessao);


    // --------------------------------------------------------
    //  Estado inicial da barra de progresso
    // --------------------------------------------------------

    atualizarBarraProgresso();

} // fim do bloco da página de recarga