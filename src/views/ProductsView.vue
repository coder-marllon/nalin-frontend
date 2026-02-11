<template>
  <div class="page">
    <div class="card">
      <h1>Produtos</h1>

      <div class="filters">
        <input v-model="codigo" placeholder="Código" />

        <!-- SELECT em vez de INPUT -->
        <select v-model="departamento" class="select-departamento">
          <option value="">Todos os departamentos</option>
          <option v-for="dept in listaDepartamentos" :key="dept" :value="dept">
            {{ dept }}
          </option>
        </select>

        <input v-model="descricao" placeholder="Descrição" />
        <button class="btn primary" @click="buscarProdutos">Buscar</button>
        <button class="btn danger" @click="logout">Sair</button>
      </div>
    </div>

    <div class="card table-card">
      <table>
        <thead>
          <tr>
            <!-- Cabeçalho com ordenação para Código -->
            <th @click="ordenarPor('codigo')" class="sortable-header">
              Código
              <span v-if="ordenacao.coluna === 'codigo'" class="sort-icon">
                {{ ordenacao.direcao === 'asc' ? '↑' : '↓' }}
              </span>
              <span v-else class="sort-icon-placeholder">↕</span>
            </th>

            <!-- Cabeçalho com ordenação para Descrição -->
            <th @click="ordenarPor('descricao')" class="sortable-header">
              Descrição
              <span v-if="ordenacao.coluna === 'descricao'" class="sort-icon">
                {{ ordenacao.direcao === 'asc' ? '↑' : '↓' }}
              </span>
              <span v-else class="sort-icon-placeholder">↕</span>
            </th>

            <!-- Cabeçalho com ordenação para Departamento -->
            <th @click="ordenarPor('departamento')" class="sortable-header">
              Departamento
              <span v-if="ordenacao.coluna === 'departamento'" class="sort-icon">
                {{ ordenacao.direcao === 'asc' ? '↑' : '↓' }}
              </span>
              <span v-else class="sort-icon-placeholder">↕</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Agora usa produtosOrdenadosFiltrados -->
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
      departamento: "", // Agora bindado com o select
      descricao: "",
      listaDepartamentos: [], // Nova lista para o dropdown

      // Controle de ordenação
      ordenacao: {
        coluna: 'codigo', // 'codigo', 'descricao', 'departamento'
        direcao: 'asc'    // 'asc' (crescente) ou 'desc' (decrescente)
      }
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

        // Modificação: agora compara igualdade (select) em vez de "includes"
        const filtroDepartamento =
          !depFiltro || p.departamento.toLowerCase() === depFiltro;

        const filtroDescricao =
          !descFiltro || p.descricao.toLowerCase().includes(descFiltro);

        return filtroCodigo && filtroDepartamento && filtroDescricao;
      });
    },

    // Nova computed property para produtos filtrados E ordenados
    produtosOrdenadosFiltrados() {
      // Pega os produtos já filtrados
      const filtrados = this.produtosFiltrados;

      // Ordena conforme configuração atual
      return [...filtrados].sort((a, b) => {
        let valorA, valorB;

        // Obtém os valores baseado na coluna selecionada
        switch (this.ordenacao.coluna) {
          case 'codigo':
            valorA = a.codigo;
            valorB = b.codigo;
            break;
          case 'descricao':
            valorA = a.descricao.toLowerCase();
            valorB = b.descricao.toLowerCase();
            break;
          case 'departamento':
            valorA = a.departamento.toLowerCase();
            valorB = b.departamento.toLowerCase();
            break;
          default:
            return 0;
        }

        // Comparação com base na direção
        if (valorA < valorB) {
          return this.ordenacao.direcao === 'asc' ? -1 : 1;
        }
        if (valorA > valorB) {
          return this.ordenacao.direcao === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
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
          }));
          // Removido: .sort((a, b) => a.codigo - b.codigo);
          // Agora a ordenação é feita pela computed property

        // Extrai departamentos únicos
        this.extrairDepartamentosUnicos();

      } catch (err) {
        console.error(err);
        alert("Erro ao buscar produtos");
      }
    },

    extrairDepartamentosUnicos() {
      const todosDepartamentos = this.produtos
        .map(p => p.departamento)
        .filter(dept => dept && dept.trim() !== "");

      this.listaDepartamentos = [...new Set(todosDepartamentos)].sort();
    },

    // Método para ordenar ao clicar nos cabeçalhos
    ordenarPor(coluna) {
      if (this.ordenacao.coluna === coluna) {
        // Se clicar na mesma coluna, inverte a direção
        this.ordenacao.direcao = this.ordenacao.direcao === 'asc' ? 'desc' : 'asc';
      } else {
        // Se clicar em coluna diferente, define como ascendente
        this.ordenacao.coluna = coluna;
        this.ordenacao.direcao = 'asc';
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
  background: #fa021b;
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
  color: #e71b36;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.select-departamento {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  width: 200px; /* Ligeiramente maior que os inputs */
  background-color: white;
  cursor: pointer;
}

/* Estilo para os options */
.select-departamento option {
  padding: 8px;
}

/* Para manter o layout consistente */
.filters input,
.filters select {
  height: 40px; /* mesma altura */
  box-sizing: border-box;
}

/* Adicione hover e focus para o select */
.select-departamento:hover {
  border-color: #4cafef;
}

.select-departamento:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

/* ===== ESTILOS PARA ORDENAÇÃO ===== */

/* Cabeçalhos clicáveis */
.sortable-header {
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-right: 30px !important; /* Espaço para o ícone */
  transition: background-color 0.2s;
}

.sortable-header:hover {
  background-color: rgba(250, 2, 27, 0.9) !important;
}

/* Ícones de ordenação */
.sort-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  color: white;
  font-size: 14px;
}

.sort-icon-placeholder {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* Para mobile */
@media (max-width: 768px) {
  .sort-icon,
  .sort-icon-placeholder {
    font-size: 10px;
    right: 5px;
  }

  .sortable-header {
    padding-right: 25px !important;
  }

  .filters {
    flex-direction: column;
  }

  .filters input,
  .filters select {
    width: 100%;
  }
}
</style>
