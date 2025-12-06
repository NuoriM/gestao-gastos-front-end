<template>
  <Dialog
    modal
    v-bind="{ visible }"
    :draggable="false"
    :header="idCompra !== null ? 'Editar Compra' : 'Cadastrar Compra'"
    :style="{ width: '50rem', position: 'relative', overflow: 'hidden' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :focusOnShow="false"
    :dismissableMask="true"
    @update:visible="$emit('visibleEmit', $event)"
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

    <!-- Skeleton de carregamento -->
    <CadastroCompraSkeleton v-if="isCarregando" />

    <!-- Formulário real -->
    <Form
      v-else
      v-slot="$form"
      :resolver="resolver"
      :initialValues="compra"
      :key="formKey"
      @submit="cadastrarCompra"
    >
      <!-- Informações Gerais -->
      <h5 class="mb-3">Informações Gerais</h5>
      <div class="row mb-3">
        <div class="col-md-6">
          <FloatLabel variant="in" class="required">
            <InputText id="nome-compra-input" name="nome" :fluid="true" variant="filled" />
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
            <label for="valorTotal-compra-input">Valor Total</label>
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
      <DetalhesCartao
        :forma-pagamento="$form.formaPagamento"
        :lista-parcelas="listaParcelas"
        :form-context="$form"
        :codigo-calendario="props.codigoCalendarioSelecionado"
        @atualizar-parcelamento="listarParcelamento"
      />

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
import { useCompraStore } from '@/stores/compra.store'
import { useCalendarioStore } from '@/stores/calendario.store'
import { useParcelaStore } from '@/stores/parcela.store'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import OverlayCarregando from './OverlayCarregando.vue'
import CadastroCompraSkeleton from './CadastroCompraSkeleton.vue'
import Dialog from 'primevue/dialog'
import { ref, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import Message from 'primevue/message'
import type { ICompra, ICompraFormulario, ICompraResponse } from '@/core/dtos/compra.dto'
import type { ICategoria } from '@/core/dtos/categoria.dto'
import type { ICartao } from '@/core/dtos/cartao.dto'
const props = defineProps<{
  visible: boolean
  codigoCalendarioSelecionado?: number
  idCompra?: number
  dataClicada?: Date
}>()

const emit = defineEmits<{
  visibleEmit: [value: boolean]
  obterComprasPorCalendarioEmit: []
}>()

const compraStore = useCompraStore()
const parcelaStore = useParcelaStore()
const calendarioStore = useCalendarioStore()

const toast = useToast()
const compra = ref<ICompraFormulario>({
  idCompra: props.idCompra,
  idCategoria: undefined,
  idCartao: undefined,
  nome: '',
  valorTotal: 0,
  formaPagamento: FormasPagamentoEnum.DINHEIRO,
  qtdParcelas: 1,
  dataRealizacao: props.dataClicada,
  lojaOuFornecedor: '',
  observacao: '',
})

const categorias = ref<ICategoria[]>([])
const formasPagamento = ref([
  { label: 'Cartão de Crédito', value: FormasPagamentoEnum.CARTAO_CREDITO },
  { label: 'Cartão de Débito', value: FormasPagamentoEnum.CARTAO_DEBITO },
  { label: 'Dinheiro', value: FormasPagamentoEnum.DINHEIRO },
  { label: 'Pix', value: FormasPagamentoEnum.PIX },
  { label: 'Boleto', value: FormasPagamentoEnum.BOLETO },
])

const listaParcelas = ref([{ numero: 1, valor: 0 }])

const isEnviando = ref(false)
const isCarregando = ref(false)
const resolver = zodResolver(compraSchema)
const formKey = ref(0)

const cadastrarCompra = async (event: any) => {
  isEnviando.value = true

  if (event.valid) {
    try {
      event.values.idCalendario = props.codigoCalendarioSelecionado!

      let data
      if (props.idCompra) {
        data = await compraStore.editar(props.codigoCalendarioSelecionado!, props.idCompra, event.values)
      } else {
        data = await compraStore.cadastrar(event.values)
      }

      if (data.status !== 200) {
        console.error('Erro ao salvar compra:', data)
        isEnviando.value = false
        return
      }

      emit('obterComprasPorCalendarioEmit')
      emit('visibleEmit', false)
    } catch (error) {
      console.error('Erro ao salvar compra:', error)
      toast.add({
        severity: 'error',
        summary: 'Erro ao salvar compra',
        detail: (error as Error).message,
        life: 3000,
      })
    } finally {
      isEnviando.value = false
    }
  } else {
    isEnviando.value = false
  }
}

const carregarCategoriasPorCodigoCalendario = async () => {
  if (!props.codigoCalendarioSelecionado) {
    isCarregando.value = false
    return
  }

  try {
    const response = await calendarioStore.listarCategoriasPorCodigoCalendarioDropdown(
      props.codigoCalendarioSelecionado,
    )

    categorias.value = response.data
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
    toast.add({
      severity: 'error',
      summary: 'Erro ao carregar categorias',
      detail: (error as Error).message,
      life: 3000,
    })
  } finally {
    isCarregando.value = false
  }
}

const carregarDadosCompra = async () => {
  if (!props.idCompra || !props.codigoCalendarioSelecionado) {
    compra.value = {
      idCompra: undefined,
      nome: '',
      idCategoria: undefined,
      idCartao: undefined,
      valorTotal: 0,
      formaPagamento: FormasPagamentoEnum.DINHEIRO,
      qtdParcelas: 1,
      dataRealizacao: props.dataClicada,
      lojaOuFornecedor: '',
      observacao: '',
    }
    formKey.value++
    return
  }

  try {
    const response = await compraStore.obterPorCodigo(
      props.codigoCalendarioSelecionado,
      props.idCompra,
    )

    const compraData: ICompraResponse = response.data

    compra.value = {
      ...compraData,
      idCategoria: compraData.categoria?.idCategoria,
      idCartao: compraData.cartao?.idCartao,
      formaPagamento: compraData.formaPagamento as FormasPagamentoEnum,
      dataRealizacao: compraData.dataRealizacao
        ? new Date(compraData.dataRealizacao)
        : props.dataClicada,
      observacao: compraData.observacao || '',
    }

    console.log(compra.value)

    listarParcelamento(compra.value)
    formKey.value++
  } catch (error) {
    console.error('Erro ao carregar compra:', error)
    toast.add({
      severity: 'error',
      summary: 'Erro ao carregar compra',
      detail: (error as Error).message,
      life: 3000,
    })
  } finally {
    isCarregando.value = false
  }
}

const listarParcelamento = async (form: any) => {
  const forma = form?.formaPagamento?.value ?? form?.formaPagamento
  const valorTotal = form?.valorTotal?.value ?? form?.valorTotal ?? 0
  const qtdParcelas = form?.qtdParcelas?.value ?? form?.qtdParcelas ?? 0

  if (forma === FormasPagamentoEnum.CARTAO_CREDITO && valorTotal > 0 && qtdParcelas > 0) {
    try {
      const response = await parcelaStore.calcularParcelamento({
        valorTotal,
        qtdParcelas,
      })
      const { valorParcela } = response.data
      listaParcelas.value = []
      for (let i = 1; i <= qtdParcelas; i++) {
        listaParcelas.value.push({ numero: i, valor: valorParcela })
      }
    } catch (error) {
      console.error('Erro ao calcular parcelamento:', error)
      toast.add({
        severity: 'error',
        summary: 'Erro ao calcular parcelamento',
        detail: (error as Error).message,
        life: 3000,
      })
    }
  }
}

const onUpload = (event: any) => {
  console.log('Arquivo enviado com sucesso!')
  toast.add({
    severity: 'success',
    summary: 'Arquivo enviado com sucesso',
    detail: 'Arquivo enviado com sucesso',
    life: 3000,
  })
}

watch(
  [() => props.visible, () => props.idCompra],
  async ([visible, idCompra]) => {
    if (visible) {
      isCarregando.value = true
      await carregarCategoriasPorCodigoCalendario()
      await carregarDadosCompra()
      isCarregando.value = false
    } else {
      listaParcelas.value = [{ numero: 1, valor: 0 }]
      isCarregando.value = false
    }
  },
  { immediate: true },
)
</script>
