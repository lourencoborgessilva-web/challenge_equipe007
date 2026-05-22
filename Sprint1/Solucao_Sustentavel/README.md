# ChargeGrid Intelligence

## Gestão inteligente e sustentável de recarga veicular comercial

Projeto desenvolvido para o **EV Challenge 2026 — FIAP + GoodWe**, na disciplina **Soluções em Energias Renováveis e Sustentáveis**.

O **ChargeGrid Intelligence** é uma proposta de plataforma para gestão de recarga de veículos elétricos em ambientes comerciais, conectando mobilidade elétrica, energia solar, armazenamento em bateria, controle de demanda, tarifação e inteligência operacional.

A proposta parte do ecossistema GoodWe/FIAP e busca transformar a recarga veicular em uma operação mais eficiente, sustentável e comercialmente viável.

---

## Integrantes

| Nome | RM |
|---|---|
| Tiago Pimentel Muniz| RM: 574148|
| Caio César Portela França | RM: 573127|
| Davi Teodoro Novais | RM: 571022|
| Lourenço Borges da Silva | RM: 569515|
| Gustavo Curis de Francisco | RM: 569704|

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
```

---

## Sustentabilidade aplicada

A sustentabilidade do projeto não se limita ao fato de o veículo ser elétrico. A proposta considera a gestão inteligente da energia usada na recarga.

O sistema poderá utilizar dados de geração fotovoltaica, consumo do local e estado da bateria para:

- recomendar horários de recarga com maior disponibilidade solar;
- incentivar o uso da recarga em períodos de menor impacto energético;
- aplicar tarifas sustentáveis ou descontos em horários favoráveis;
- reduzir potência em momentos críticos;
- evitar sobrecarga da rede elétrica;
- preservar reserva mínima da bateria estacionária;
- gerar indicadores de sustentabilidade para o gestor.

Exemplo:

Se houver alta geração solar durante determinado período do dia, o sistema pode recomendar esse horário ao usuário ou aplicar uma tarifa mais vantajosa. Se o local estiver em horário de pico, o sistema pode limitar novas sessões, colocar usuários em fila ou sugerir horários alternativos.

Essa abordagem melhora o aproveitamento da energia renovável, reduz dependência da rede em momentos críticos e aumenta a eficiência operacional do eletroposto.

---

## Principais módulos da solução

### 1. Arquitetura com camadas e adapters

O sistema é pensado em camadas para evitar dependência direta de uma tecnologia específica. A arquitetura separa infraestrutura física, dados, backend/simulador, regras, interfaces e integrações futuras.

Adapters podem representar integrações com:

- SEMS+;
- MODBUS;
- API EV futura;
- OCPP futuro;
- gateways de pagamento;
- bases simuladas.

Essa estrutura permite evolução gradual do projeto.

---

### 2. Orquestrador de demanda

O orquestrador analisa a condição energética do local e classifica o estado do sistema em:

- **favorável**: há margem para liberar novas recargas;
- **alerta**: o local está próximo do limite;
- **crítico**: novas recargas devem ser bloqueadas ou pausadas.

Com base nisso, o sistema pode liberar, limitar, reduzir potência, colocar em fila ou bloquear sessões.

---

### 3. Gestão sustentável de energia

A camada sustentável usa dados de energia solar, bateria e consumo local para melhorar o uso dos recursos disponíveis.

Ela pode:

- recomendar horários de recarga;
- aplicar tarifa sustentável;
- priorizar energia solar quando disponível;
- usar bateria dentro de limites seguros;
- reduzir potência em horários críticos;
- sugerir horários alternativos.

---

### 4. Tarifação e pagamento

Como o HCA G2 não possui billing nativo, o ChargeGrid propõe uma camada externa ou simulada de tarifação.

Essa camada pode calcular:

- valor por kWh;
- taxa por tempo;
- tarifa de pico;
- tarifa ponderada;
- taxa de ociosidade;
- valor estimado da sessão;
- comprovante.

O objetivo é tornar a recarga comercial mais transparente e viável.

---

### 5. Interface do usuário e dashboard do gestor

Para o usuário final, a interface deve mostrar:

- disponibilidade;
- preço;
- tempo estimado;
- status da sessão;
- energia consumida;
- custo estimado;
- posição na fila;
- comprovante.

Para o gestor, o dashboard deve mostrar:

- sessões realizadas;
- kWh consumidos;
- receita estimada;
- horários de pico;
- uso de energia solar;
- taxa de ocupação;
- falhas;
- alertas operacionais.

---

### 6. IA e decisão inteligente

A inteligência artificial será tratada como apoio à decisão, não como controle absoluto do sistema.

A IA pode ajudar a:

- prever horários de pico;
- estimar demanda futura;
- recomendar tarifas;
- sugerir horários de recarga;
- identificar risco de fila;
- apoiar manutenção preditiva;
- gerar relatórios inteligentes.

---

### 7. Segurança e confiabilidade

O sistema deve considerar segurança desde sua concepção.

Pontos importantes:

- autenticação de usuários;
- perfis de acesso;
- logs;
- validação de QR Code;
- proteção contra cobrança duplicada;
- separação entre dados pessoais, financeiros e operacionais;
- tratamento de falhas;
- confiabilidade do dashboard;
- controle de permissões.

---
## Viabilidade de negócio

O ChargeGrid pode gerar valor para diferentes atores:

### Estabelecimento comercial

- atrai clientes com serviço de recarga;
- melhora imagem sustentável;
- acompanha uso dos carregadores;
- visualiza receita estimada;
- reduz risco de sobrecarga.

### Usuário final

- entende preço antes da recarga;
- acompanha status da sessão;
- recebe comprovante;
- tem mais previsibilidade;
- pode ser orientado a carregar em horários mais sustentáveis.

### Operador ou gestor

- acompanha demanda;
- identifica horários de pico;
- analisa falhas;
- planeja expansão;
- melhora eficiência operacional.

### GoodWe/ecossistema energético

- fortalece a integração entre carregadores, energia solar, bateria, SEMS+ e gestão inteligente;
- amplia a possibilidade de uso comercial das soluções;
- conecta hardware energético a uma camada digital de valor.

---

## Tecnologias e conceitos envolvidos

- GoodWe HCA G2;
- SEMS+;
- SolarGo;
- smart meter;
- bateria estacionária;
- geração fotovoltaica;
- carregamento AC;
- kW e kWh;
- controle de demanda;
- MODBUS;
- RS-485;
- OCPP como referência futura;
- QR Code/PWA;
- dashboard;
- tarifação dinâmica;
- IA preditiva;
- segurança e LGPD;
- simulação técnica.

---

## Limitações conhecidas

O projeto reconhece limitações importantes:

- o HCA G2 atual não possui OCPP;
- o HCA G2 não possui billing nativo;
- RFID é autorização local, não solução completa de pagamento;
- a API EV Charger não será disponibilizada aos alunos;
- o acesso ao SEMS+ tende a ser principalmente visual;
- dados comerciais reais podem não estar disponíveis;
- parte da solução precisará ser simulada.

---

## Próximos passos

Para as próximas etapas, o grupo pretende evoluir a proposta para uma prova de conceito funcional.

Possíveis entregas futuras:

- protótipo de interface do usuário;
- dashboard do gestor;
- simulador de sessões de recarga;
- motor de regras para estados favorável, alerta e crítico;
- cálculo de tarifa;
- fila de espera;
- indicadores de sustentabilidade;
- recomendação de horário de recarga;
- estruturação do projeto em Kanban;
- documentação técnica no GitHub.

---

## Pitch do projeto

Vídeo pitch: https://youtu.be/_VgbLmDxla0?si=Y-TmWlP31L-JqOF1

---

## Conclusão

O ChargeGrid Intelligence propõe uma camada inteligente para gestão sustentável de eletropostos comerciais. A solução busca conectar mobilidade elétrica, energia solar, bateria, controle de demanda, tarifação e dados operacionais.

A proposta é relevante porque o avanço da mobilidade elétrica exige mais do que carregadores instalados. É necessário gerenciar energia, usuários, cobrança, experiência e sustentabilidade de forma integrada.

Com isso, o projeto contribui para uma visão mais eficiente e sustentável da recarga veicular em ambientes comerciais, alinhada ao ecossistema GoodWe e ao EV Challenge 2026.
