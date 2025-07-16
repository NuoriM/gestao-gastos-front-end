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
              @click="adicionarNovaCategoria"
              size="small"
            />
          </div>
          <DataTable
            scrollable
            v-model:selection="categoriasSelecionadas"
            :value="categorias"
            paginator
            stripedRows
            :rows="5"
            :loading="isLoading"
            :rowsPerPageOptions="[5, 10, 20, 50]"
          >
            <template #empty>
              <div class="text-center p-4">
                <i class="pi pi-info-circle text-2xl text-success" />
                <p class="mt-2 text-900 font-medium">Nenhuma categoria encontrada</p>
                <small class="d-block text-600"
                  >Clique no bot o <i class="pi pi-plus"></i> para adicionar uma nova
                  categoria.</small
                >
              </div>
            </template>
            <Column
              field="idCategoria"
              header="Código"
              style="width: 10%"
              headerStyle="text-align: center"
            ></Column>
            <Column
              field="nome"
              header="Nome"
              style="width: 50%"
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
  <Dialog
    v-model:visible="visible"
    :draggable="false"
    modal
    :header="categoria.idCategoria ? 'Editar Categoria' : 'Nova Categoria'"
    :style="{ width: '50rem', position: 'relative', overflow: 'hidden' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <OverlayCarregando :visible="isEnviando" />
    <Form
      ref="formCategoriaRef"
      v-slot="$form"
      :resolver="resolver"
      :initialValues="categoria"
      @submit="submitForm"
    >
      <div class="row mb-3">
        <div class="col-md-6">
          <FloatLabel variant="in" class="required">
            <InputText id="nome-categoria-input" name="nome" :fluid="true" variant="filled" />
            <label for="nome-categoria-input">Nome</label>
          </FloatLabel>

          <Message
            v-if="$form.nome?.invalid"
            class="mb-1 mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.nome.error?.message }}
          </Message>
        </div>
        <div class="col-md-6">
          <InputGroup>
            <InputGroupAddon> # </InputGroupAddon>
            <InputText
              id="corHex"
              name="corHex"
              :fluid="true"
              v-model="categoria.corHex"
              variant="filled"
            />
            <InputGroupAddon>
              <ColorPicker v-model="categoria.corHex" inputId="corHex" format="hex"
            /></InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div class="row">
        <div class="col-md">
          <FloatLabel variant="in" class="optional">
            <Textarea
              ref="descricaoRef"
              name="descricao"
              @input="handleDescricaoInput"
              :fluid="true"
              variant="filled"
              rows="4"
              :maxlength="descricaoMax"
            />
            <label for="descricao-input">Descrição</label>
          </FloatLabel>
          <Message
            v-if="$form.descricao?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.descricao.error?.message }}
          </Message>
          <Knob
            v-model="qtdCaracteres"
            :strokeWidth="30"
            :valueColor="knobColor"
            :size="20"
            :max="descricaoMax"
            readonly
            style="margin-top: -2rem; margin-left: 0.5rem; z-index: 1; position: relative"
          />
        </div>
      </div>
    </Form>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" @click="visible = false" variant="outlined" />
      <Button
        :label="categoria.idCategoria ? 'Atualizar' : 'Cadastrar'"
        icon="pi pi-check"
        @click="() => ($refs.formCategoriaRef as any)?.submit()"
        variant="success"
      />
    </template>
  </Dialog>
</template>
<script lang="ts">
import { categoriaSchema } from '@/core/schemas/categoria/categoria.schema'
import { useCategoriaStore } from '@/stores/categoria.store'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import FloatLabel from 'primevue/floatlabel'

export default {
  setup() {
    const categoriaStore = useCategoriaStore()

    return { categoriaStore }
  },

  data() {
    return {
      categoriasSelecionadas: null,
      isEnviando: false,
      isLoading: true,
      visible: false,
      corHEX: '',
      descricaoMax: 280,
      categoria: {
        idCategoria: 0,
        nome: '',
        descricao: '',
        corHex: 'ff0000',
      },
      qtdCaracteres: 0,
      categorias: [],
      resolver: zodResolver(categoriaSchema),
    }
  },

  mounted() {
    this.listarCategorias()
  },

  methods: {
    adicionarNovaCategoria() {
      this.categoria = {
        idCategoria: 0,
        nome: '',
        descricao: '',
        corHex: 'ff0000',
      }
      this.visible = true
    },

    abrirModalEditar(categoria: any) {
      this.categoria = categoria
      this.visible = true
    },

    async submitForm(event: any) {
      this.isEnviando = true

      if (event.valid) {
        const formData = event.values
        if (this.categoria.idCategoria) {
          formData.idCategoria = this.categoria.idCategoria
        }
        formData.corHex = this.categoria.corHex

        try {
          const response = this.categoria.idCategoria
            ? await this.categoriaStore.editar(formData)
            : await this.categoriaStore.cadastrar(formData)

          this.visible = false
          this.refresh()
        } catch (error) {
          console.error('Erro ao cadastrar/alterar categoria:', error)
        }

        this.isEnviando = false
      }

      this.isEnviando = false
    },

    async removerCategoria(id: number) {
      await this.categoriaStore.remover(id)
      this.refresh()
    },

    async listarCategorias() {
      this.isLoading = true
      const response = await this.categoriaStore.listarPaginado()
      this.isLoading = false
      this.categorias = response.data.content
    },

    refresh() {
      this.listarCategorias()
    },

    handleDescricaoInput(event: Event) {
      const target = event.target as HTMLTextAreaElement
      if (this.descricaoMax - target.value.length < 0) return
      this.qtdCaracteres = target.value.length
    },
  },

  computed: {
    knobColor() {
      if (
        this.qtdCaracteres > this.descricaoMax - 50 &&
        this.qtdCaracteres <= this.descricaoMax - 10
      )
        return 'orange'
      if (this.qtdCaracteres > this.descricaoMax - 10) return 'red'
      return 'MediumTurquoise' // ou 'green' ou cor padrão
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
