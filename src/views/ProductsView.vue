<template>
  <!-- Container da página -->
  <div class="page">

    <!-- Card dos filtros -->
    <div class="card">
      <h1>Produtos</h1>

      <!-- Área dos filtros -->
      <div class="filters">
        <!-- v-model liga os inputs com variáveis do data() -->
        <input v-model="codigo" placeholder="Código" />
        <input v-model="departamento" placeholder="Departamento" />
        <input v-model="descricao" placeholder="Descrição" />

        <!-- Botão que chama a API novamente -->
        <button class="btn primary" @click="buscarProdutos">Buscar</button>

        <!-- Botão sair -->
        <button class="btn danger" @click="logout">Sair</button>
      </div>
    </div>

    <!-- Card da tabela -->
    <div class="card table-card">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Departamento</th>
          </tr>
        </thead>

        <tbody>
          <!-- Percorre a lista filtrada -->
          <tr v-for="p in produtosFiltrados" :key="p.codigo">
            <td>{{ p.codigo }}</td>
            <td>{{ p.descricao }}</td>
            <td>
              <!-- badge azul bonitinho -->
              <span class="badge">{{ p.departamento }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
// axios configurado
import api from "../services/api";

export default {
  // Variáveis reativas da tela
  data() {
    return {
      produtos: [],     // lista que vem da API
      codigo: "",       // filtro digitado pelo usuário
      departamento: "", // filtro digitado pelo usuário
      descricao: "",    // filtro digitado pelo usuário
    };
  },

  // Computed = recalcula automaticamente quando algo muda
  computed: {
    produtosFiltrados() {
      return this.produtos.filter((p) => {

        // remove espaços extras e padroniza letras minúsculas
        const codigoFiltro = this.codigo.trim();
        const depFiltro = this.departamento.trim().toLowerCase();
        const descFiltro = this.descricao.trim().toLowerCase();

        // Verifica se código contém o que foi digitado
        const filtroCodigo =
          !codigoFiltro || p.codigo.toString().includes(codigoFiltro);

        // Verifica departamento
        const filtroDepartamento =
          !depFiltro || p.departamento.toLowerCase().includes(depFiltro);

        // Verifica descrição
        const filtroDescricao =
          !descFiltro || p.descricao.toLowerCase().includes(descFiltro);

        // Só aparece na tabela se passar em TODOS filtros
        return filtroCodigo && filtroDepartamento && filtroDescricao;
      });
    },
  },

  methods: {
    // Busca produtos na API
    async buscarProdutos() {
      try {
        // pega token salvo no login
        const token = localStorage.getItem("token");

        // chama endpoint protegido
        const res = await api.get("/produtos/listar", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // pega lista da resposta (usa ? para evitar erro se vier null)
        const lista = res.data?.data ?? [];

        // trata e organiza dados recebidos
        this.produtos = lista
          .map((p) => ({
            codigo: Number(p.codigo),
            descricao: p.descricao || "Sem descrição",
            departamento: p.departamento || "Sem departamento",
          }))
          // ordena por código
          .sort((a, b) => a.codigo - b.codigo);

      } catch (err) {
        console.error(err);
        alert("Erro ao buscar produtos");
      }
    },

    // Logout limpa token e volta para login
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
  },

  // Executa automaticamente quando a tela abre
  mounted() {
    this.buscarProdutos();
  },
};
</script>

<style scoped>
/* Fundo da página */
.page {
  padding: 40px;
  background: #f5f7fb;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
}

/* Cartões brancos */
.card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 5px 18px rgba(0,0,0,0.08);
  margin-bottom: 25px;
}

h1 {
  margin-bottom: 20px;
}

/* Área dos filtros */
.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Inputs */
input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 180px;
}

/* Botões base */
.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

/* Botão buscar */
.primary {
  background: #4cafef;
  color: white;
}

.primary:hover {
  background: #3498db;
}

/* Botão sair */
.danger {
  background: #ff5c5c;
  color: white;
}

.danger:hover {
  background: #e04848;
}

/* Tabela */
table {
  width: 100%;
  border-collapse: collapse;
}

/* Cabeçalho azul */
thead {
  background: #4cafef;
  color: white;
}

th, td {
  padding: 12px;
  text-align: left;
}

/* Linhas alternadas */
tbody tr:nth-child(even) {
  background: #f2f6fb;
}

/* Hover da linha */
tbody tr:hover {
  background: #eaf2ff;
}

/* Badge azul do departamento */
.badge {
  background: #eef4ff;
  color: #3b6edc;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}
</style>
