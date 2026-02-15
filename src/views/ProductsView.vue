<template>
  <div class="page">

    <!-- 🔴 HEADER SUPERIOR -->
    <div class="header">
      <h1 class="titulo">Produtos</h1>
      <button class="btn danger" @click="logout">Sair</button>
    </div>

    <!-- 🔎 FILTROS -->
    <div class="card filtros-card">
      <div class="filters">
        <input v-model="codigo" placeholder="Código" />

        <select v-model="departamento" class="select-departamento">
          <option value="">Todos os departamentos</option>
          <option v-for="dept in listaDepartamentos" :key="dept" :value="dept">
            {{ dept }}
          </option>
        </select>

        <input v-model="descricao" placeholder="Descrição" />

        <button class="btn primary" @click="buscarProdutos">Buscar</button>
      </div>
    </div>

    <!-- 📋 TABELA -->
    <div class="card table-card fade-up">
      <table>
        <thead>
          <tr>
            <th @click="ordenarPor('codigo')" class="sortable-header">
              Código
              <span v-if="ordenacao.coluna === 'codigo'">
                {{ ordenacao.direcao === 'asc' ? '↑' : '↓' }}
              </span>
            </th>

            <th @click="ordenarPor('descricao')" class="sortable-header">
              Descrição
              <span v-if="ordenacao.coluna === 'descricao'">
                {{ ordenacao.direcao === 'asc' ? '↑' : '↓' }}
              </span>
            </th>

            <th @click="ordenarPor('departamento')" class="sortable-header">
              Departamento
              <span v-if="ordenacao.coluna === 'departamento'">
                {{ ordenacao.direcao === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in produtosOrdenadosFiltrados" :key="p.codigo">
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
      listaDepartamentos: [],

      ordenacao: {
        coluna: "codigo",
        direcao: "asc",
      },
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
          !depFiltro || p.departamento.toLowerCase() === depFiltro;

        const filtroDescricao =
          !descFiltro || p.descricao.toLowerCase().includes(descFiltro);

        return filtroCodigo && filtroDepartamento && filtroDescricao;
      });
    },

    produtosOrdenadosFiltrados() {
      const filtrados = this.produtosFiltrados;

      return [...filtrados].sort((a, b) => {
        let valorA = a[this.ordenacao.coluna];
        let valorB = b[this.ordenacao.coluna];

        if (typeof valorA === "string") valorA = valorA.toLowerCase();
        if (typeof valorB === "string") valorB = valorB.toLowerCase();

        if (valorA < valorB) return this.ordenacao.direcao === "asc" ? -1 : 1;
        if (valorA > valorB) return this.ordenacao.direcao === "asc" ? 1 : -1;
        return 0;
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

        this.produtos = lista.map((p) => ({
          codigo: Number(p.codigo),
          descricao: p.descricao || "Sem descrição",
          departamento: p.departamento || "Sem departamento",
        }));

        this.extrairDepartamentosUnicos();
      } catch (err) {
        console.error(err);
        alert("Erro ao buscar produtos");
      }
    },

    extrairDepartamentosUnicos() {
      const todos = this.produtos.map((p) => p.departamento);
      this.listaDepartamentos = [...new Set(todos)].sort();
    },

    ordenarPor(coluna) {
      if (this.ordenacao.coluna === coluna) {
        this.ordenacao.direcao =
          this.ordenacao.direcao === "asc" ? "desc" : "asc";
      } else {
        this.ordenacao.coluna = coluna;
        this.ordenacao.direcao = "asc";
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

/* FUNDO DA PÁGINA */
.page {
  padding: 40px;
  background: #f5f7fb;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

/* CARDS */
.card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  margin-bottom: 25px;
}

h1 {
  margin-bottom: 20px;
  color: #d90429;
}

/* FILTROS */
.filters {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

/* Inputs padrão */
.filters input,
.filters select {
  height: 42px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fafafa;
  transition: 0.2s;
  font-size: 14px;
}

.filters input:focus,
.filters select:focus {
  outline: none;
  border: 1px solid #d90429;
  background: white;
  box-shadow: 0 0 0 3px rgba(217,4,41,0.15);
}

/* SELECT maior */
.select-departamento {
  min-width: 240px;
  width: 100%;
  max-width: 280px;
  cursor: pointer;
}

/* BOTÕES */
.btn {
  padding: 11px 22px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}

/* Botão buscar */
.primary {
  background: linear-gradient(90deg,#d90429,#ff2e2e);
  color: white;
  box-shadow: 0 6px 14px rgba(0,0,0,0.15);
}

.primary:hover {
  transform: translateY(-2px);
}

/* Botão sair */
.danger {
  background: #5e5e5e;
  color: white;
}

.danger:hover {
  background: #444;
}

/* TABELA PROFISSIONAL */
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

/* Cabeçalho */
thead {
  background: #d90429;
  color: white;
  font-size: 15px;
}

/* Células */
th, td {
  padding: 14px 16px;
  vertical-align: middle;
}

/* ALINHAMENTO DAS COLUNAS */

/* Código centralizado */
th:nth-child(1),
td:nth-child(1) {
  width: 120px;
  text-align: center;
}

/* Descrição centralizada */
th:nth-child(2),
td:nth-child(2) {
  width: auto;
  text-align: center;
}

/* Departamento centralizado */
th:nth-child(3),
td:nth-child(3) {
  width: 180px;
  text-align: center;
}

/* Linhas alternadas */
tbody tr:nth-child(even) {
  background: #f7f9fc;
}

/* Hover */
tbody tr:hover {
  background: #eef3ff;
}

/* BADGE DEPARTAMENTO */
.badge {
  background: #ffe5e9;
  color: #d90429;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* ORDENAÇÃO */
.sortable-header {
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-right: 30px !important;
}

.sortable-header:hover {
  background-color: rgba(255,255,255,0.15);
}

.sort-icon,
.sort-icon-placeholder {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.sort-icon-placeholder {
  opacity: 0.5;
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filters input,
  .filters select {
    width: 100%;
  }
}

/* HEADER SUPERIOR */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.titulo {
  margin: 0;
  color: #d90429;
}

</style>
