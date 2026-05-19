# GOODWE — Simulador de Sessão de Recarga
**Sprint 1 — DSA**

---

## Descrição do Projeto

Este projeto simula uma sessão completa de recarga de veículo elétrico em um eletroposto GOODWE. O sistema permite ao usuário preencher os dados do veículo e da sessão, acompanhar o carregamento em tempo real, e receber um relatório detalhado ao final, incluindo o custo calculado com base em regras de tarifação dinâmica.

O projeto é composto por três arquivos principais:

| Arquivo | Função |
|---|---|
| `index.html` | Formulário de início de sessão |
| `recarga.html` | Tela de monitoramento e relatório final |
| `script.js` | Toda a lógica de simulação, validação e tarifação |
| `style.css` | Estilização das duas páginas |

---

## Como Executar

1. Faça o download ou clone os arquivos do projeto
2. Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge)
3. Preencha o formulário com os dados da sessão
4. Clique em **"Iniciar sessão de recarga"**
5. Na tela seguinte, clique em **"Iniciar"** para começar a simulação
6. Acompanhe o progresso e aguarde a conclusão — ou clique em **"Finalizar sessão"** manualmente

> Não é necessário instalar nenhuma dependência ou servidor. O projeto roda direto no navegador.

---

## Estrutura de Pastas

```
/
├── index.html          ← Formulário de início
├── recarga.html        ← Tela de recarga em andamento
├── script.js           ← Lógica principal
├── style.css           ← Estilos
└── images/
    ├── Logo_Completa.png
    ├── Banner_inicio_de_sessao.png
    └── veiculo_recarga.png
```

---

## Lógica do Sistema

### 1. Coleta e Validação de Dados (index.html + script.js)

O usuário preenche seis campos no formulário:

- **Nome** — identificação do usuário
- **Tipo de usuário** — Comum, Assinante GOODWE+ ou Corporativo
- **Capacidade da bateria** — em kWh (ex: 60 kWh)
- **Bateria inicial** — percentual atual da bateria (ex: 30%)
- **Bateria desejada** — percentual alvo de carga (ex: 80%)
- **Origem da energia** — Fotovoltaica ou Rede elétrica

Ao submeter o formulário, o JavaScript executa uma **validação campo a campo** usando um `for...of` sobre uma lista de regras. Cada regra define o campo, o valor esperado e a mensagem de erro correspondente:

```js
const regras = [
    { campo: "nome", teste: (v) => v && v.length >= 2, msg: "..." },
    { campo: "tipo_usuario", teste: (v) => ["comum", "assinante", "corporativo"].includes(v), msg: "..." },
    // ...
];

for (const regra of regras) {
    if (!regra.teste(regra.valor)) erros.push(regra.msg);
}
```

Se houver erros, eles são exibidos na tela com outro `for...of` que cria elementos HTML dinamicamente. Nenhum redirecionamento ocorre até que todos os campos estejam válidos.

Os dados validados são salvos no `sessionStorage` e o usuário é redirecionado para `recarga.html`.

---

### 2. Simulação da Recarga (recarga.html + script.js)

Na tela de recarga, o JavaScript recupera os dados salvos e inicia a simulação quando o usuário clica em **"Iniciar"**.

A recarga é simulada por um `setInterval` que dispara a cada 1 segundo e incrementa a bateria em 5 pontos percentuais por ciclo. A cada ciclo:

- A porcentagem da bateria é atualizada na tela
- A barra de progresso avança
- O tempo decorrido é incrementado
- A energia entregue (em kWh) é recalculada
- O custo estimado é atualizado em tempo real

O loop termina automaticamente quando a bateria atinge o valor desejado, ou manualmente pelo botão **"Finalizar sessão"**.

#### Cálculo da energia entregue (kWh)

```
Energia carregada (%) = Bateria atual − Bateria inicial
Energia em kWh = Energia carregada (%) × (Capacidade da bateria / 100)
```

Exemplo: bateria foi de 30% para 80% em uma bateria de 60 kWh:
```
(80 − 30) × (60 / 100) = 50 × 0,6 = 30 kWh
```

#### Previsão de término

Ao iniciar a sessão, um `for` simula os passos restantes de carga para estimar quantos segundos faltam e calcula o horário previsto de conclusão:

```js
for (let pct = bateriaSimulada; pct < bateriaDesejada; pct += passosPorSegundo) {
    segundosRestantes++;
}
```

#### Botões de controle

| Botão | Comportamento |
|---|---|
| Iniciar | Inicia ou retoma a recarga |
| Pausar | Pausa o intervalo de simulação |
| Finalizar sessão | Encerra e exibe o relatório |

---

### 3. Sistema de Tarifação (script.js)

A tarifa é calculada no momento em que a página de recarga carrega, com base no **horário atual**, no **tipo de usuário** e na **origem da energia**.

#### Faixas horárias

A função `calcularFaixaTarifaria(hora)` usa estrutura `if/else` para determinar o multiplicador:

| Faixa | Horário | Multiplicador |
|---|---|---|
| Pico | 06h–09h e 17h–21h | ×1,50 (+50%) |
| Normal | 09h–17h | ×1,00 |
| Noturno | 21h–06h | ×0,80 (−20%) |

#### Descontos por tipo de usuário

| Tipo | Desconto |
|---|---|
| Comum | 0% |
| Assinante GOODWE+ | 15% |
| Corporativo | 10% |

#### Desconto por origem da energia

| Origem | Desconto adicional |
|---|---|
| Rede elétrica | 0% |
| Fotovoltaica | 5% |

#### Fórmula do custo final

```
Tarifa com pico   = Tarifa base × Multiplicador horário
Desconto total    = Desconto usuário + Desconto energia
Tarifa efetiva    = Tarifa com pico × (1 − Desconto total)
Custo da sessão   = kWh carregados × Tarifa efetiva
```

Exemplo: usuário Assinante, horário de pico, energia fotovoltaica, 30 kWh carregados:
```
Tarifa com pico  = R$ 1,80 × 1,50 = R$ 2,70/kWh
Desconto total   = 15% + 5% = 20%
Tarifa efetiva   = R$ 2,70 × (1 − 0,20) = R$ 2,16/kWh
Custo da sessão  = 30 kWh × R$ 2,16 = R$ 64,80
```

---

### 4. Relatório Final

Ao concluir a recarga, o sistema exibe um relatório completo no console com:

- Dados do usuário e do veículo
- Horário de início e fim
- Tempo total da sessão
- Energia consumida em kWh
- Faixa tarifária aplicada
- Desconto aplicado
- **Custo total da sessão**

O relatório também é salvo no `localStorage` do navegador, permitindo que o histórico de sessões persista entre visitas. Cada entrada do histórico é registrada e exibida no console do navegador ao final da sessão.

---

## Estruturas de Programação Utilizadas

### Condicionais

```js
// if/else — determina a faixa tarifária
if ((hora >= 6 && hora < 9) || (hora >= 17 && hora < 21)) {
    faixa = "pico";
} else if (hora >= 9 && hora < 17) {
    faixa = "normal";
} else {
    faixa = "noturno";
}

// switch — rótulo do tipo de usuário
switch (tipoUsuario) {
    case "assinante":   label = "Assinante GOODWE+"; break;
    case "corporativo": label = "Corporativo";       break;
    default:            label = "Comum";
}
```

### Estruturas de repetição

```js
// for...of — valida cada campo do formulário
for (const regra of regras) {
    if (!regra.teste(regra.valor)) erros.push(regra.msg);
}

// for clássico — estima o tempo restante de carga
for (let pct = bateriaAtual; pct < bateriaDesejada; pct += 5) {
    segundosRestantes++;
}

// while — constrói a animação de pontos do status
while (i < pontosAnimacao) {
    pontos += ".";
    i++;
}

// setInterval — loop temporal da simulação de recarga
carregando = setInterval(() => {
    energiaInicial = Math.min(energiaInicial + 5, bateriaDesejada);
    // atualiza tela...
}, 1000);
```

---

## Armazenamento de Dados

| Mecanismo | Uso |
|---|---|
| `sessionStorage` | Transfere os dados do formulário entre as duas páginas. Limpo ao voltar ao início. |
| `localStorage` | Persiste o histórico de todas as sessões realizadas no navegador. |

---

## Tecnologias Utilizadas

- **HTML** — estrutura semântica das páginas
- **CSS** — estilização com variáveis CSS, grid layout e responsividade
- **JavaScript** — toda a lógica de simulação, validação e tarifação
- **Lucide Icons** — biblioteca de ícones via CDN
- **Google Fonts** — tipografia

---

*DSA Sprint 1.*
