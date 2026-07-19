# Smoke Air — Loja e Biblioteca de Jogos

Projeto full-stack (Single Page Application) inspirado na Steam. O sistema contempla um catálogo completo de jogos, sistema de autenticação, perfil de usuário e uma biblioteca interativa para gerenciar os jogos adquiridos.

## 💻 Tecnologias Utilizadas

*   **Front-end:** React 18, TypeScript, Vite, React Router, Axios.
*   **Back-end:** Java 17, Spring Boot 3.3 (Web, Security, Data JPA), JWT para autenticação.
*   **Banco de Dados:** PostgreSQL / MySQL (com H2 em memória para testes rápidos).

## ✨ Funcionalidades Implementadas

*   **Catálogo e Navegação:** Vitrine de jogos com sistema de busca, filtros por categoria e prateleira de destaques.
*   **Autenticação e Segurança:** Login, cadastro e recuperação de senha com JWT (Access e Refresh tokens), além de persistência de sessão.
*   **Gestão de Usuário:** Painel de perfil para edição de dados e alteração de credenciais.
*   **Biblioteca e Interação:** Página de detalhes do jogo (galeria, avaliações, compra simulada e lista de desejos) e biblioteca pessoal com simulação de "tempo de jogo".
*   **API Robusta:** CRUD completo de jogos, sistema de avaliações com recálculo de notas e tratamento de erros padronizado.

---

## 🚀 Como Executar o Projeto Localmente

Para testar a aplicação, você precisará iniciar o back-end (API) e o front-end separadamente.

### 1. Inicializando a API (Back-end)

Você pode rodar a API rapidamente utilizando o banco de dados em memória (H2), ideal para testes sem necessidade de configuração prévia:

```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=dev'
```

*A API estará disponível em `http://localhost:8080` (Documentação Swagger: `http://localhost:8080/swagger-ui.html`).*

> **Nota:** Ao rodar no modo `dev`, o banco de dados é populado automaticamente com categorias, jogos de exemplo e um usuário de teste:
> *   **Login:** `demo`
> *   **Senha:** `Demo@123`

*(Opcional) Para rodar com um banco de dados real (MySQL/PostgreSQL), configure as variáveis `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` e `JWT_SECRET` no seu ambiente e execute apenas `./gradlew bootRun`.*

### 2. Inicializando a Interface (Front-end)

Em um novo terminal, instale as dependências e inicie o servidor de desenvolvimento:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Acesse a aplicação no seu navegador através de `http://localhost:5173`.