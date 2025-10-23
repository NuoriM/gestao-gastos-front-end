<template>
  <div class="container my-4">
    <div class="row">
      <div class="col-md">
        <div class="card shadow border-0 rounded p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="m-0">Lista de Categorias</h5>
            <Button
              label="Nova Categoria"
              icon="pi pi-plus"
              variant="success"
              @click="abrirModalNovaCategoria"
              size="small"
            />
          </div>
          <!-- Skeleton de carregamento -->
          <div v-if="isLoading">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <Skeleton height="24px" width="150px" />
              <Skeleton height="32px" width="120px" />
            </div>
            
            <!-- Skeleton da tabela -->
            <div class="card">
              <div class="card-body p-0">
                <!-- Header da tabela -->
                <div class="row g-0 border-bottom bg-light">
                  <div class="col-2 p-3 text-center">
                    <Skeleton height="16px" width="60px" class="mx-auto" />
                  </div>
                  <div class="col-5 p-3 text-center">
                    <Skeleton height="16px" width="80px" class="mx-auto" />
                  </div>
                  <div class="col-2 p-3 text-center">
                    <Skeleton height="16px" width="40px" class="mx-auto" />
                  </div>
                  <div class="col-3 p-3 text-center">
                    <Skeleton height="16px" width="60px" class="mx-auto" />
                  </div>
                </div>
                
                <!-- Linhas da tabela -->
                <div v-for="i in 5" :key="i" class="row g-0 border-bottom">
                  <div class="col-2 p-3 text-center">
                    <Skeleton height="16px" width="30px" class="mx-auto" />
                  </div>
                  <div class="col-5 p-3 text-center">
                    <Skeleton height="16px" width="120px" class="mx-auto" />
                  </div>
                  <div class="col-2 p-3 text-center">
                    <Skeleton height="32px" width="32px" shape="circle" class="mx-auto" />
                  </div>
                  <div class="col-3 p-3 text-center">
                    <div class="d-flex justify-content-center gap-1">
                      <Skeleton height="24px" width="24px" shape="circle" />
                      <Skeleton height="24px" width="24px" shape="circle" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabela real -->
          <DataTable
            v-else
            scrollable
            :value="categorias"
            paginator
            stripedRows
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
          >
            <template #empty>
              <div class="text-center p-4">
                <i class="pi pi-info-circle text-2xl text-success" />
                <p class="mt-2 text-900 font-medium">Nenhuma categoria encontrada</p>
                <small class="d-block text-600"
                  >Clique no botão <i class="pi pi-plus"></i> para adicionar uma nova
                  categoria.</small
                >
              </div>
            </template>
            <Column
              field="nome"
              header="Nome"
              style="width: 25%"
              headerStyle="text-align: center"
            ></Column>
            <Column
              field="nomeCalendario"
              header="Calendário"
              style="width: 25%"
              headerStyle="text-align: center"
            ></Column>
            <Column field="corHex" header="Cor" style="width: 10%" headerStyle="text-align: center">
              <template #body="slotProps">
                <ColorPicker v-model="slotProps.data.corHex" disabled />
              </template>
            </Column>
            <Column style="width: 20%; text-align: end">
              <template #body="{ data }">
                <Button
                  type="button"
                  icon="pi pi-pencil"
                  text
                  size="small"
                  @click="abrirModalEditar(data)"
                />
                <Button
                  type="button"
                  icon="pi pi-trash"
                  text
                  size="small"
                  class="ms-1"
                  @click="removerCategoria(data.idCategoria)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
  <CadastroCategoria
    v-bind:visible="visible"
    :categoria="categoriaSelecionada"
    @visibleEmit="visibleCadastroCategoriaListnerMethod"
    @atualizarCategoriaEmit="listarCategorias"
  />
</template>
<script lang="ts">
import { useCategoriaStore } from '@/stores/categoria.store'

export default {
  setup() {
    const categoriaStore = useCategoriaStore()

    return { categoriaStore }
  },

  data() {
    return {
      categoriaSelecionada: {},
      isEnviando: false,
      isLoading: true,
      visible: false,
      corHEX: '',
      categorias: [],
    }
  },

  mounted() {
    this.listarCategorias()
  },

  methods: {
    abrirModalNovaCategoria() {
      this.categoriaSelecionada = {
        nome: '',
        descricao: '',
        corHex: 'ff0000',
      }
      this.visible = true
    },

    abrirModalEditar(categoria: any) {
      this.categoriaSelecionada = categoria
      this.visible = true
    },

    async removerCategoria(id: number) {
      await this.categoriaStore.remover(id)
      this.listarCategorias()
    },

    async listarCategorias() {
      this.isLoading = true
      const response = await this.categoriaStore.listarPaginado()
      this.isLoading = false
      this.categorias = response.data.content
    },

    visibleCadastroCategoriaListnerMethod(visible: boolean) {
      this.visible = visible
    },
  },
}
</script>
<style scoped lang="scss">
:root {
  --p-disabled-opacity: 1 !important;
}

:deep(.p-datatable-table) {
  .p-colorpicker {
    .p-colorpicker-preview.p-disabled {
      opacity: 1 !important;
    }
  }
}

:deep(.p-knob-text) {
  opacity: 0 !important;
}
</style>
