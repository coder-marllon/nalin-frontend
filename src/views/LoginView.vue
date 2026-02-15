<template>
  <!-- Página inteira do login -->
  <div class="login-page">

    <!-- Card central branco -->
    <div class="login-card">
      <h1 class="logo">NALIN</h1>
      <p>Login do Sistema</p>

      <!-- v-model liga o input com a variável "login" do data() -->
      <input v-model="login" placeholder="Usuário" />

      <!-- Campo senha ligado com variável "senha" -->
      <input v-model="senha" type="password" placeholder="Senha" />

      <!-- Ao clicar chama o método fazerLogin -->
      <button @click="fazerLogin">Entrar</button>

      <!-- Só aparece se existir erro -->
      <span v-if="erro" class="erro">{{ erro }}</span>
    </div>
  </div>
</template>

<script>
// Importa nosso axios configurado (services/api.js)
import api from "../services/api";

export default {
  // Aqui ficam as variáveis reativas da tela
  data() {
    return {
      login: "", // guarda o que o usuário digita no input login
      senha: "", // guarda a senha digitada
      erro: "",  // mensagem de erro caso login falhe
    };
  },

  // Métodos da tela
  methods: {
    // Função chamada ao clicar no botão Entrar
    async fazerLogin() {
      try {
        // limpa erro antigo antes de tentar logar novamente
        this.erro = "";

        // Faz requisição GET para API
        // Envia login e senha como parâmetros na URL
        const res = await api.get("/login", {
          params: {
            ds_login: this.login,
            ds_senha: this.senha,
          },
        });

        // Pega o token que vem da API
        const token = res.data.data[0].token;

        // Salva token no navegador (fica logado)
        localStorage.setItem("token", token);

        // Redireciona para página de produtos
        this.$router.push("/produtos");

      } catch {
        // Se der erro na requisição (login errado)
        this.erro = "Usuário ou senha inválidos";
      }
    },
  },
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Poppins:wght@300;400;600&display=swap');


/* 🔴 Fundo moderno */
.login-page {
  height: 100vh;
  background: linear-gradient(120deg, #7a0404, #c21f2d, #ff3b3b);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Segoe UI", Arial, sans-serif;
}

/* 🧊 Card com efeito vidro */
.login-card {
  backdrop-filter: blur(12px);
  background:white;
  padding: 45px;
  border-radius: 18px;
  width: 340px;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  animation: fadeUp 0.6s ease;
  border: 1px solid #eee;
  animation: subirFade 0.8s ease-out;
}

/* ✨ Animação de entrada */
@keyframes subirFade {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Logo */
.logo {
  font-family: 'Montserrat', sans-serif;
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 5px;

  background: linear-gradient(90deg,#ff2e2e,#d90429);
  -webkit-background-clip: text;
  background-clip: text;          /* 👈 adiciona esta linha */
  -webkit-text-fill-color: transparent;
}

p {
  margin-bottom: 30px;
  color: #777;
  font-size: 14px;
}

/* Inputs modernos */
input {
  width: 100%;
  padding: 14px;
  margin-bottom: 18px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fafafa;
  font-size: 14px;
  transition: 0.3s;
}

input:focus {
  outline: none;
  border: 1px solid #d90429;
  background: white;
  box-shadow: 0 0 0 3px rgba(217,4,41,0.15);
}

/* 🔥 Botão premium */
button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg,#d90429,#ff2e2e);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: 0.25s;
  box-shadow: 0 8px 18px rgba(0,0,0,0.15);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.2);
}

button:active {
  transform: translateY(0);
}

/* ❌ erro estilizado */
.erro {
  display: block;
  margin-top: 18px;
  background: #ffe5e5;
  color: #c21f2d;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
}

</style>
