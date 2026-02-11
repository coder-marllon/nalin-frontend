<template>
  <div class="page">
    <div class="card">
      <h1>Produtos</h1>

      <div class="filters">
        <input v-model="codigo" placeholder="Código" />
        <input v-model="departamento" placeholder="Departamento" />
        <input v-model="descricao" placeholder="Descrição" />

        <button class="btn primary" @click="buscarProdutos">Buscar</button>
        <button class="btn danger" @click="logout">Sair</button>
      </div>
    </div>

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
          <tr v-for="p in produtosFiltrados" :key="p.codigo">
            <td>{{ p.codigo }}</td>
            <td>{{ p.descricao }}</td>
            <td>
              <span class="badge">{{ p.departamento }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      produtos: [],
      codigo: "",
      departamento: "",
      descricao: "",
    };
  },

  computed: {
    produtosFiltrados() {
      return this.produtos.filter((p) => {
        const codigoFiltro = this.codigo.trim();
        const depFiltro = this.departamento.trim().toLowerCase();
        const descFiltro = this.descricao.trim().toLowerCase();

        const filtroCodigo =
          !codigoFiltro || p.codigo.toString().includes(codigoFiltro);

        const filtroDepartamento =
          !depFiltro || p.departamento.toLowerCase().includes(depFiltro);

        const filtroDescricao =
          !descFiltro || p.descricao.toLowerCase().includes(descFiltro);

        return filtroCodigo && filtroDepartamento && filtroDescricao;
      });
    },
  },

  methods: {
    async buscarProdutos() {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/produtos/listar", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const lista = res.data?.data ?? [];

        this.produtos = lista
          .map((p) => ({
            codigo: Number(p.codigo),
            descricao: p.descricao || "Sem descrição",
            departamento: p.departamento || "Sem departamento",
          }))
          .sort((a, b) => a.codigo - b.codigo);
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar produtos");
      }
    },

    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
  },

  mounted() {
    this.buscarProdutos();
  },
};
</script>

<style scoped>
.page {
  padding: 40px;
  background: #f5f7fb;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
}

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

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 180px;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

.primary {
  background: #4cafef;
  color: white;
}

.primary:hover {
  background: #3498db;
}

.danger {
  background: #ff5c5c;
  color: white;
}

.danger:hover {
  background: #e04848;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #4cafef;
  color: white;
}

th, td {
  padding: 12px;
  text-align: left;
}

tbody tr:nth-child(even) {
  background: #f2f6fb;
}

tbody tr:hover {
  background: #eaf2ff;
}

.badge {
  background: #eef4ff;
  color: #3b6edc;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}
</style>
