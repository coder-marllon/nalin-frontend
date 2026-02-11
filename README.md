# nalin-frontend

# 🚀 Desafio de Estágio Nalin — Frontend (Vue.js)

Este projeto foi desenvolvido como solução para o desafio técnico de estágio da **Lojas Nalin**.

A aplicação consiste em uma interface em **Vue 3** que realiza autenticação via API e apresenta uma tela de listagem de produtos com filtros.

---

## 🧰 Tecnologias Utilizadas

* Vue 3
* Vite
* Vue Router
* Axios
* JavaScript
* HTML + CSS

---

## ✨ Funcionalidades

### 🔐 Login

* Autenticação consumindo a API fornecida
* Armazenamento do token JWT no `localStorage`
* Redirecionamento automático após login

### 📦 Listagem de Produtos

* Consumo da API protegida com Bearer Token
* Exibição em tabela
* Filtros por:

  * Código
  * Departamento
  * Descrição
* Ordenação automática por código
* Logout com limpeza de sessão

---

## 📁 Estrutura do Projeto

```
src/
 ├── router/
 │   └── index.js
 ├── services/
 │   └── api.js
 ├── views/
 │   ├── LoginView.vue
 │   └── ProductsView.vue
 ├── App.vue
 └── main.js
```

---

## 🔑 Credenciais da API

Utilize as credenciais fornecidas no desafio:

```
Login: ESTAGIONALIN
Senha: 3ST@G10N@L1N
```

---

## ▶️ Como Executar o Projeto

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/nalin-frontend.git
```

### 2️⃣ Acessar a pasta

```bash
cd nalin-frontend
```

### 3️⃣ Instalar dependências

```bash
npm install
```

### 4️⃣ Rodar o projeto

```bash
npm run dev
```

O projeto estará disponível em:

```
http://localhost:5173
```

---

## 🔐 Fluxo da Aplicação

1. Usuário acessa tela de login
2. Credenciais são enviadas para API
3. Token JWT é armazenado no navegador
4. Usuário é redirecionado para listagem de produtos
5. Requisições usam Bearer Token automaticamente

---

## 📌 Observações

Este projeto foi desenvolvido exclusivamente para fins de avaliação técnica.

---

## 👨‍💻 Autor

Desenvolvido por **Marllon Lima** 💙
=======
# desafio-nalin
Desafio de Desenvolvimento - Estágio Nalin
>>>>>>> 6aaf9da (feat: Desafio em Frontend Vue)
