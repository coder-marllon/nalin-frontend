<template>
  <!-- Página inteira do login -->
  <div class="login-page">

    <!-- Card central branco -->
    <div class="login-card">
      <h1>Nalin</h1>
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
/* Fundo azul degradê ocupando a tela toda */
.login-page {
  height: 100vh;
  background: linear-gradient(135deg, #c21f2d, #7a0404);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;
}

/* Cartão branco do login */
.login-card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  width: 320px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

/* Título Nalin */
h1 {
  margin-bottom: 5px;
  /* color: #3b6edc; */
  color: rgb(224, 2, 2);
}

/* Subtítulo */
p {
  margin-bottom: 25px;
  color: #888;
}

/* Inputs */
input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

/* Botão entrar */
button {
  width: 100%;
  padding: 12px;
  background: red;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

/* Efeito hover do botão */
button:hover {
  background: #8B0000;
}

/* Mensagem de erro */
.erro {
  display: block;
  margin-top: 15px;
  color: red;
  font-size: 14px;
}
</style>
