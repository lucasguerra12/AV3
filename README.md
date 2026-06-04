# ✈️ Aerocode - Gestão de Produção Aeroespacial (AV3)

**Desenvolvido por:** Lucas Fernando Guerra  
**RA:** 1461392421010  
**Turma:** 4DSM  
**Disciplina:** Técnicas de Programação I  
**Professor:** Eng. Dr. Gerson Penha  

---

## 📋 Sobre o Projeto
O **Aerocode** é uma aplicação web completa (SPA - Single Page Application) projetada para simular um sistema crítico de gestão aeroespacial. O projeto abrange desde o controle de inventário de peças e credenciamento de equipe até a linha de produção, realização de testes de qualidade e emissão de laudos técnicos.

Para a **Avaliação 3 (AV3)**, o sistema foi evoluído de uma arquitetura mockada para um ecossistema real integrado com banco de dados relacional e um servidor backend dedicado, com foco na implementação de **Telemetria e Testes de Estresse de Rede**.

---

## 🚀 Funcionalidades Principais
- **Dashboard Operacional:** Visão geral da frota, peças em trânsito e alertas críticos.
- **Gestão de Frota (CRUD):** Registro, edição e exclusão de aeronaves.
- **Linha de Montagem:** Controle de etapas de produção e alocação de engenheiros/operadores.
- **Controle de Qualidade:** Agendamento e aprovação/reprovação de testes técnicos (Elétricos, Hidráulicos, etc).
- **Logística e Inventário (CRUD):** Recepção de lotes e vinculação de componentes às aeronaves.
- **Relatórios de Entrega:** Geração de laudo técnico exportável em formato `.txt`.
- **Relatório de Qualidade (AV3):** Testes de carga simulando requisições concorrentes de usuários, gerando gráficos de métricas vitais.

---

## 🛠️ Tecnologias Utilizadas
**Front-end:**
- React.js (v19) com TypeScript
- Vite (Build Tool)
- Tailwind CSS (Estilização)
- Recharts (Geração de gráficos de desempenho)
- React Router DOM (Navegação SPA)

**Back-end:**
- Node.js
- Express (API REST)
- Prisma ORM
- MySQL (Banco de Dados Relacional)

---

## 📊 Metodologia e Métricas de Qualidade (Exigência AV3)

Para atender aos requisitos do sistema crítico aeroespacial, foi implementada uma rota analítica dedicada no back-end (`/api/teste-desempenho`) que realiza consultas massivas interligadas no banco de dados. As métricas foram obtidas e escalonadas da seguinte forma:

1. **Escalonamento Concorrente:** Através do método `Promise.all` no Front-end, o sistema dispara múltiplos acessos simultâneos simulando **1, 5 e 10 usuários**.
2. **Tempo de Processamento:** Medido isoladamente no Back-end utilizando a API nativa `performance.now()`, abrangendo estritamente o tempo de consulta e cálculo do servidor (antes da resposta ser devolvida à rede).
3. **Tempo de Resposta Total:** Cronometrado no Front-end, abrange o ciclo de vida integral (saída da requisição no navegador até o recebimento completo do JSON).
4. **Latência de Rede:** Calculada matematicamente pela fórmula: `(Tempo de Resposta Total - Tempo de Processamento Interno) / 2`. 
5. **Plataformas Homologadas:** O ecossistema baseado em Node.js garante execução unificada e compatibilidade com **Windows 10+** e distribuições Linux (**Ubuntu 24.04.03+**).

---

## 🕵️‍♂️ Sistema Anti-Clone (Easter Eggs)
Para atestar a autoria exclusiva do sistema e evitar cópias, foram inseridas 3 verificações de segurança:
1. **Console Signature:** Pressionando `F12` e abrindo o Console, uma assinatura de desenvolvimento é exibida nativamente.
2. **Keylogger Secreto:** Em qualquer tela do sistema, se o usuário digitar a palavra secreta `av3lucas` no