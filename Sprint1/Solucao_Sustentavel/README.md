# ChargeGrid Intelligence

## Gestão inteligente e sustentável de recarga veicular comercial

Projeto desenvolvido para o **EV Challenge 2026 — FIAP + GoodWe**, na disciplina **Soluções em Energias Renováveis e Sustentáveis**.

O **ChargeGrid Intelligence** é uma proposta de plataforma para gestão de recarga de veículos elétricos em ambientes comerciais, conectando mobilidade elétrica, energia solar, armazenamento em bateria, controle de demanda, tarifação e inteligência operacional.

A proposta parte do ecossistema GoodWe/FIAP e busca transformar a recarga veicular em uma operação mais eficiente, sustentável e comercialmente viável.

---

## Integrantes

| Nome | RM |
|---|---|
| Tiago | RM: |
| Caio | RM: |
| Davi | RM: |
| Lourenço | RM: |
| Gustavo | RM: |

---

## Contexto do projeto

A GoodWe atua no setor de energia inteligente, com soluções relacionadas a inversores fotovoltaicos, armazenamento de energia, monitoramento energético, carregadores veiculares e gestão de energia.

No contexto do Challenge, o desafio envolve a expansão da lógica de recarga de veículos elétricos do ambiente residencial para o ambiente comercial. Essa mudança aumenta a complexidade do sistema, pois ambientes comerciais possuem múltiplos usuários, maior demanda energética, necessidade de cobrança, controle operacional e integração com fontes renováveis.

O carregador de referência estudado é o **GoodWe HCA G2**, especialmente o modelo **GW7K-HCA-20**, presente no contexto da FIAP. Ele é um carregador AC de 7 kW, monitorável pelo SEMS+ e relacionado ao ecossistema energético GoodWe.

Entretanto, no cenário analisado, o HCA G2 não deve ser tratado como um eletroposto comercial completo, pois não possui billing nativo, não possui OCPP no modelo atual e a API EV Charger não será disponibilizada aos alunos. Por isso, o ChargeGrid é proposto como uma camada complementar de inteligência, operação e simulação sobre os dados e limitações disponíveis.

---

## Problema central

A expansão da recarga de veículos elétricos para ambientes comerciais cria um problema central:

> Como gerenciar eletropostos comerciais de forma eficiente, sustentável, transparente e viável, considerando demanda energética, geração solar, bateria, cobrança, usuários e operação?

Em ambientes como shoppings, estacionamentos, mercados, empresas e centros comerciais, a recarga elétrica não pode depender apenas do carregador físico. É necessário coordenar energia, usuários, tarifas, fila, disponibilidade e dados operacionais.

Os principais problemas identificados são:

- sobrecarga energética em horários de pico;
- baixa eficiência no uso da energia renovável disponível;
- falta de integração entre equipamentos e plataformas;
- dificuldade de cobrança e monetização;
- experiência ruim para o usuário final;
- baixa previsibilidade de demanda, fila e falhas;
- riscos de segurança, pagamento e confiabilidade.

---

## Solução proposta

O **ChargeGrid Intelligence** propõe uma plataforma de orquestração de recarga comercial baseada em dados, regras de operação e sustentabilidade energética.

A solução busca conectar:

- carregadores EV;
- dados do SEMS+;
- geração solar;
- bateria estacionária;
- rede elétrica;
- usuários;
- tarifação;
- dashboard do gestor;
- recomendações inteligentes;
- simulações técnicas para cenários comerciais.

A proposta não depende de prometer integração real imediata com recursos indisponíveis. O projeto segue a lógica do **possível versus ideal**: usar dados reais quando disponíveis, simular com rigor quando necessário e documentar como a solução poderia evoluir em um cenário produtivo.

---

## Como o sistema funcionaria

O funcionamento conceitual pode ser organizado em camadas:

```text
Camada física
Carregador HCA G2, smart meter, inversor, bateria, rede elétrica e sistema fotovoltaico

↓
Camada de dados
SEMS+, registros de sessão, potência, energia consumida, duração, status e dados da planta

↓
Camada ChargeGrid
Backend ou simulador com sessões, usuários, tarifas, filas, regras e indicadores

↓
Motor de decisão
Classificação energética, controle de demanda, fila, tarifa e recomendações

↓
Interfaces
PWA ou app para usuário final, dashboard para gestor e relatórios operacionais
