# ✈️ AeroCode - Sistema de Gestão de Produção de Aeronaves (AV3)

Este repositório contém a **terceira versão (AV3)** do sistema AeroCode. Diferente das versões anteriores (CLI e Frontend estático), esta é uma aplicação **Full-Stack** completa, integrando uma interface moderna em React com um backend robusto em Node.js, persistência de dados em MySQL e relatórios de métricas de qualidade.

---

## 🚀 Tecnologias Utilizadas

### Frontend
* **React** (com TypeScript)
* **React Router Dom** (Navegação SPA)
* **CSS Modules** (Estilização)
* **Axios/Fetch** (Consumo de API)

### Backend
* **Node.js** & **Express**
* **TypeScript**
* **Prisma ORM** (Gerenciamento de Banco de Dados)
* **MySQL** (Banco de Dados Relacional)

### Qualidade e Testes
* **k6** (Testes de Carga e Performance)
* **Middleware de Métricas** (Monitoramento de tempo de processamento)

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

1.  [Node.js](https://nodejs.org/) (Versão 16 ou superior)
2.  [MySQL](https://www.mysql.com/) (Servidor rodando)
3.  [k6](https://k6.io/) (Opcional, apenas para rodar os testes de carga)

---

## mw🛠️ Configuração e Instalação

O projeto está dividido em duas pastas principais: `backend` e `frontend`. Siga os passos abaixo para colocar tudo a rodar.

### 1. Configuração do Backend (Servidor e Banco de Dados)

1.  Acesse a pasta do backend:
    ```bash
    cd backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` dentro da pasta `backend` e adicione a string de conexão com o seu MySQL (ajuste usuário, senha e nome do banco):
    ```env
    DATABASE_URL="mysql://root:sua_senha@localhost:3306/aerocode_db"
    PORT=3001
    ```

4.  Execute as migrações do Prisma para criar as tabelas no banco:
    ```bash
    npx prisma migrate dev --name init
    ```

5.  Inicie o servidor:
    ```bash
    npm run dev
    ```
    *O backend estará rodando em `http://localhost:3001`.*

---

### 2. Configuração do Frontend (Interface)

1.  Abra um novo terminal e acesse a pasta do frontend:
    ```bash
    cd frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie a aplicação React:
    ```bash
    npm start
    ```
    *O frontend abrirá automaticamente no seu navegador em `http://localhost:3000`.*

---

## 👤 Primeiro Acesso (Login)

O sistema possui uma lógica de **criação automática do primeiro administrador**:

1.  Abra a aplicação no navegador.
2.  Na tela de Login, insira um e-mail e senha que deseja utilizar como **Administrador**.
3.  Como o banco de dados está vazio inicialmente, o sistema detectará isso e criará este usuário automaticamente com nível de permissão `ADMINISTRADOR`.
4.  Nos próximos acessos, utilize essas mesmas credenciais.

---

## 📊 Funcionalidades Principais

* **Dashboard:** Visão geral de aeronaves em produção, peças e status.
* **Gestão de Aeronaves:** Criação de novas aeronaves (Comercial/Militar).
* **Controle de Etapas:** Lógica sequencial (uma etapa só inicia se a anterior finalizou).
* **Gestão de Funcionários:** RBAC (Admin, Engenheiro, Operador).
* **Relatórios:** Geração de relatório final da aeronave em formato texto.
* **Métricas de Performance:** Monitoramento de latência e tempo de resposta integrado.

---

## 📈 Testes de Carga (Relatório de Qualidade)

Para atender aos requisitos da AV3 sobre métricas de qualidade (Latência, Tempo de Resposta, Throughput), foi incluído um script de teste utilizando a ferramenta **k6**.

**Para rodar o teste de carga:**

1.  Certifique-se de que o **Backend** esteja rodando.
2.  No terminal (na raiz do projeto), execute:
    ```bash
    k6 run teste_carga.js
    ```

**Cenários testados automaticamente:**
1.  **1 Usuário** (30 segundos)
2.  Escalonamento para **5 Usuários** (30 segundos)
3.  Escalonamento para **10 Usuários** (30 segundos)

*Os resultados aparecerão no terminal, indicando tempos de requisição (http_req_duration) e sucesso das conexões.*

---

## 📂 Estrutura do Projeto

```bash
/
├── backend/             # API Node.js + Prisma
│   ├── prisma/          # Schemas e Migrations do DB
│   └── src/
│       ├── controllers/ # Lógica de negócio
│       ├── middleware/  # Medição de tempo de processamento
│       └── routes.ts    # Rotas da API
├── frontend/            # Aplicação React
│   └── src/
│       ├── components/  # Componentes reutilizáveis
│       ├── models/      # Interfaces TypeScript
│       ├── pages/       # Telas (Dashboard, Login, Detalhes)
│       └── services/    # Comunicação com o Backend
└── teste_carga.js       # Script K6 para métricas de qualidade
````

-----

**Desenvolvido para a disciplina de Desenvolvimento de Software - AV3.**

```
```
