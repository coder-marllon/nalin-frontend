<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Nalin</h1>
      <p>Login do Sistema</p>

      <input v-model="login" placeholder="Usuário" />
      <input v-model="senha" type="password" placeholder="Senha" />

      <button @click="fazerLogin">Entrar</button>

      <span v-if="erro" class="erro">{{ erro }}</span>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      login: "",
      senha: "",
      erro: "",
    };
  },

  methods: {
    async fazerLogin() {
      try {
        this.erro = "";

        const res = await api.get("/login", {
          params: {
            ds_login: this.login,
            ds_senha: this.senha,
          },
        });

        const token = res.data.data[0].token;

        localStorage.setItem("token", token);

        this.$router.push("/produtos");
      } catch {
  this.erro = "Usuário ou senha inválidos";
}
    },
  },
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  background: linear-gradient(135deg, #4cafef, #3b6edc);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 15px;
  width: 320px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

h1 {
  margin-bottom: 5px;
  color: #3b6edc;
}

p {
  margin-bottom: 25px;
  color: #888;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 12px;
  background: #4cafef;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #3498db;
}

.erro {
  display: block;
  margin-top: 15px;
  color: red;
  font-size: 14px;
}
</style>
