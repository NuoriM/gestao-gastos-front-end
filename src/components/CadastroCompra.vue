<template>
  <Dialog
    v-bind="{ visible }"
    :draggable="false"
    :header="produto.idProduto > 0 ? 'Editar Compra' : 'Cadastrar Compra'"
    :style="{ width: '50rem', position: 'relative', overflow: 'hidden' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    modal
    :focusOnShow="false"
  >
    <template #closebutton>
      <Button
        icon="pi pi-times"
        text
        severity="secondary"
        @click="$emit('visibleEmit', false)"
        rounded
      ></Button>
    </template>
    <OverlayCarregando :visible="isEnviando" />
    <Form
      ref="formProdutoRef"
      v-slot="$form"
      :resolver="resolver"
      :initialValues="produto"
      @submit="cadastrarCompra"
    >
      <!-- Informações Gerais -->
      <h5 class="mb-3">Informações Gerais</h5>
      <div class="row mb-3">
        <div class="col-md-6">
          <FloatLabel variant="in" class="required">
            <InputText
              id="nome-compra-input"
              name="nome"
              :fluid="true"
              variant="filled"
            />
            <label for="nome-compra-input">Nome</label>
          </FloatLabel>
          <Message
            v-if="$form.nome?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.nome.error?.message }}
          </Message>
        </div>
        <div class="col-md-6">
          <FloatLabel variant="in" class="required">
            <Select
              id="categoria-compra-input"
              name="idCategoria"
              placeholder="Selecione uma categoria"
              :options="categorias"
              optionLabel="descricao"
              optionValue="codigo"
              :fluid="true"
              variant="filled"
            />
            <label for="categoria-compra-input">Categoria</label>
          </FloatLabel>
          <Message
            v-if="$form.idCategoria?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.idCategoria.error?.message }}
          </Message>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <FloatLabel variant="in" class="required">
            <DatePicker
              id="data-compra-input"
              name="dataRealizacao"
              date-format="dd/mm/yy"
              :fluid="true"
              variant="filled"
            />
            <label for="data-compra-input">Data da realização da compra</label>
          </FloatLabel>
          <Message
            v-if="$form.dataRealizacao?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.dataRealizacao.error?.message }}
          </Message>
        </div>
        <div class="col-md-6">
          <FloatLabel variant="in" class="required">
            <InputText
              id="loja-ou-fornecedor-input"
              name="lojaOuFornecedor"
              :fluid="true"
              variant="filled"
            />
            <label for="loja-ou-fornecedor-input">Loja ou Fornecedor</label>
          </FloatLabel>
          <Message
            v-if="$form.lojaOuFornecedor?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.lojaOuFornecedor.error?.message }}
          </Message>
        </div>
      </div>

      <!-- Detalhes Financeiros -->
      <h5 class="mb-3">Detalhes Financeiros</h5>
      <div class="row mb-3">
        <div class="col-md">
          <FloatLabel variant="in" class="required">
            <InputNumber
              id="valorTotal-compra-input"
              name="valorTotal"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              :fluid="true"
              variant="filled"
              @update:modelValue="listarParcelamento($form)"
            />
            <label for="valorTotal-compra-input">Valor Total Parcelado</label>
          </FloatLabel>
          <Message
            v-if="$form.valorTotal?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.valorTotal.error?.message }}
          </Message>
        </div>
      </div>

      <!-- Forma de Pagamento -->
      <h5 class="mb-3">Forma de Pagamento</h5>
      <div class="row mb-3">
        <div class="col-md-12">
          <FloatLabel variant="in" class="required">
            <Select
              id="forma-pagamento-input"
              name="formaPagamento"
              placeholder="Selecione a forma de pagamento"
              :options="formasPagamento"
              optionLabel="label"
              optionValue="value"
              :fluid="true"
              variant="filled"
            />
            <label for="forma-pagamento-input">Forma de Pagamento</label>
          </FloatLabel>
          <Message
            v-if="$form.formaPagamento?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.formaPagamento.error?.message }}
          </Message>
        </div>
      </div>

      <!-- Detalhes do Cartão (condicional) -->
      <div v-show="$form.formaPagamento?.value == 'CREDITO'" class="card p-3 mb-3">
        <h6 class="mb-3">Detalhes do Cartão</h6>
        <div class="row mb-3">
          <div class="col-md-6">
            <FloatLabel variant="in" class="required">
              <InputNumber
                id="parcelas-input"
                name="qtdParcelas"
                :fluid="true"
                variant="filled"
                @update:modelValue="listarParcelamento($form)"
              />
              <label for="parcelas-input">Quantidade de Parcelas</label>
            </FloatLabel>
            <Message
              v-if="$form.qtdParcelas?.invalid"
              class="mt-1"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.qtdParcelas.error?.message }}
            </Message>
          </div>
          <div class="col-md-6">
            <DataTable
              :value="listaParcelas"
              scrollable
              stripedRows
              size="small"
              scrollHeight="200px"
              tableStyle="min-height: 10rem"
            >
              <Column field="numero">
                <template #header>
                  <strong>
                    <small>Parcela</small>
                  </strong>
                </template>
                <template #body="{ data }">
                  <small>
                    {{ data.numero }}
                  </small>
                </template>
              </Column>
              <Column field="valor">
                <template #header>
                  <strong>
                    <small>Valor</small>
                  </strong>
                </template>
                <template #body="{ data }">
                  <small>
                    {{ formatCurrency(data.valor) }}
                  </small>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <!-- Observações e Comprovante -->
      <h5 class="mb-3">Observações e Comprovante</h5>
      <div class="row mb-3">
        <div class="col-md-12">
          <FloatLabel variant="in" class="optional">
            <Textarea name="observacao" :fluid="true" variant="filled" rows="4" />
            <label for="observacao-input">Observações</label>
          </FloatLabel>
          <Message
            v-if="$form.observacao?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.observacao.error?.message }}
          </Message>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-12">
          <FileUpload
            mode="basic"
            url="/api/upload"
            accept=".pdf, image/*"
            :maxFileSize="1000000"
            @upload="onUpload"
            :auto="true"
            chooseLabel="Anexar Comprovante"
            class="w-100"
          />
          <Message
            v-if="$form.comprovante?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.comprovante.error?.message }}
          </Message>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          @click="$emit('visibleEmit', false)"
          variant="outlined"
        />
        <Button label="Salvar" icon="pi pi-check" type="submit" />
      </div>
    </Form>
  </Dialog>
</template>
<script lang="ts" setup>
import { FormasPagamentoEnum } from '@/core/enums/formas-pagamento.enum'
import { compraSchema } from '@/core/schemas/compra/compra.schema'
import { useCategoriaStore } from '@/stores/categoria.store'
import { useCompraStore } from '@/stores/compra.store'
import { useCalendarioStore } from '@/stores/calendario.store'
import { useParcelaStore } from '@/stores/parcela.store'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import OverlayCarregando from './OverlayCarregando.vue'
import Dialog from 'primevue/dialog'
import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import Message from 'primevue/message'
const props = defineProps<{
  visible: boolean
  codigoCalendarioSelecionado: number
  produto: any
}>()

const emit = defineEmits<{
  visibleEmit: [value: boolean]
  obterComprasPorCalendarioEmit: []
}>()

const compraStore = useCompraStore()
const parcelaStore = useParcelaStore()
const calendarioStore = useCalendarioStore()
const toast = useToast()
const categorias = ref([])
const formasPagamento = ref([
  { label: 'Cartão de Crédito', value: FormasPagamentoEnum.CARTAO_CREDITO },
  { label: 'Cartão de Débito', value: FormasPagamentoEnum.CARTAO_DEBITO },
  { label: 'Dinheiro', value: FormasPagamentoEnum.DINHEIRO },
  { label: 'Pix', value: FormasPagamentoEnum.PIX },
  { label: 'Boleto', value: FormasPagamentoEnum.BOLETO },
])
const listaParcelas = ref([
  {
    numero: '--',
    valor: '--',
  },
])

const isEnviando = ref(false)
const resolver = zodResolver(compraSchema)

const cadastrarCompra = async (event: any) => {
  isEnviando.value = true

  if (event.valid) {
    try {
      event.values.idCalendario = props.codigoCalendarioSelecionado
      console.log('event.values', event.values)

      let data
      if (props.produto.idProduto > 0) {
        data = await (compraStore as any).editar(props.produto.idProduto, event.values)
      } else {
        data = await compraStore.cadastrar(event.values)
      }

      console.log('data', data)
      if (data.status !== 200) {
        console.error('Erro ao salvar compra:', data)
        isEnviando.value = false
        return
      }

      emit('obterComprasPorCalendarioEmit')
      emit('visibleEmit', false)
    } catch (error) {
      console.error('Erro ao salvar compra:', error)
      toast.add({ severity: 'error', summary: 'Erro ao salvar compra', detail: (error as any).message, life: 3000 })
    } finally {
      isEnviando.value = false
    }
  } else {
    isEnviando.value = false
  }
}

const carregarCategoriasPorCodigoCalendario = async () => {
  try {
    const response = await calendarioStore.listarCategoriasPorCodigoCalendarioDropdown(
      props.codigoCalendarioSelecionado,
    )

    categorias.value = response.data
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
    toast.add({ severity: 'error', summary: 'Erro ao carregar categorias', detail: (error as any).message, life: 3000 })
  }
}

const listarParcelamento = async (form: any) => {
  const formaPagamento = form.formaPagamento.value || form.formaPagamento
  const valorTotal = form.valorTotal.value || form.valorTotal
  const qtdParcelas = form.qtdParcelas.value || form.qtdParcelas

  if (formaPagamento === FormasPagamentoEnum.CARTAO_CREDITO && valorTotal > 0 && qtdParcelas > 0) {
    try {
      const response = await parcelaStore.calcularParcelamento({
        valorTotal,
        qtdParcelas,
      })
      const { valorParcela } = response.data
      listaParcelas.value = []
      for (let i = 1; i <= qtdParcelas; i++) {
        listaParcelas.value.push({ numero: i.toString(), valor: valorParcela })
      }
    } catch (error) {
      console.error('Erro ao calcular parcelamento:', error)
      toast.add({ severity: 'error', summary: 'Erro ao calcular parcelamento', detail: (error as any).message, life: 3000 })
    }
  }
}

const submitForm = () => {
  // TODO: Implementar o submit do formulário (ref e etc)
}

const onUpload = (event: any) => {
  console.log('Arquivo enviado com sucesso!')
  toast.add({ severity: 'success', summary: 'Arquivo enviado com sucesso', detail: 'Arquivo enviado com sucesso', life: 3000 })
}

const formatCurrency = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      listarParcelamento(props.produto)
      carregarCategoriasPorCodigoCalendario()
    }
  },
)
</script>
