# CRUD de Comentários com Node.js e Vanilla JS

Um sistema de comentários completo, inspirado em plataformas como o YouTube, construído com um backend Node.js/Express e um front-end em Vanilla JS. Este projeto demonstra a implementação de um CRUD completo via API REST.

## ✨ Features

- API RESTful com endpoints para Criar e Ler comentários.
- Front-end desacoplado que consome a API via `fetch`.
- Renderização dinâmica do HTML no lado do cliente.
- "Banco de dados" em memória para prototipagem rápida.

## 💻 Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)

## 🔧 Como Rodar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/bieltris/crud-comentarios-portfolio.git
    cd crud-comentarios-portfolio
    ```
2.  **Instale as dependências do backend:**
    ```bash
    cd backend
    npm install
    ```
3.  **Inicie o servidor da API:**
    ```bash
    node server.js
    ```
    O servidor estará rodando em `http://localhost:3000`.

4.  **Abra o front-end:**
    Acesse `http://localhost:3000` no seu navegador. O servidor Express já está configurado para servir o `index.html` da pasta `frontend`.