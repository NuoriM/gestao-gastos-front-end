<template>
  <div v-show="mostrarDetalhes" class="card p-3 mb-3">
    <h6 class="mb-3">Detalhes do Cartão</h6>
    <div class="row mb-3">
      <div class="col-md-12">
        <FloatLabel variant="in" :class="{ required: !temCartoes }">
          <Select
            id="cartoes-input"
            name="idCartao"
            :fluid="true"
            variant="filled"
            size="small"
            :options="cartoes"
            optionLabel="descricao"
            optionValue="codigo"
          />
          <label for="cartoes-input"
            >Cartões {{ !temCartoes ? '(obrigatório cadastrar)' : '' }}</label
          >
        </FloatLabel>
        <Message
          v-if="formContext.idCartao?.invalid"
          class="mt-1"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ formContext.idCartao.error?.message }}
        </Message>
      </div>
    </div>

    <!-- Botão para adicionar novo cartão (só aparece se já houver cartões) -->
    <div v-if="temCartoes && !mostrarFormCadastro" class="row mb-3">
      <div class="col-md-12">
        <Button
          label="Adicionar Novo Cartão"
          icon="pi pi-plus"
          @click="mostrarFormCadastro = true"
          variant="outlined"
          size="small"
          :text="true"
          class="p-0"
        />
      </div>
    </div>

    <!-- Formulário de cadastro -->
    <div
      v-if="mostrarFormCadastro || !temCartoes"
      class="card p-3 mb-3"
      :class="{ 'border-warning': !temCartoes, 'border-info': temCartoes }"
    >
      <div class="row mb-3">
        <div class="col-md-12 d-flex justify-content-between align-items-center">
          <h6 class="mb-0">
            {{ !temCartoes ? 'Cadastre um Cartão' : 'Novo Cartão' }}
          </h6>
          <Button
            v-if="temCartoes"
            icon="pi pi-times"
            @click="fecharFormularioCartao()"
            variant="text"
            size="small"
            text
            rounded
            class="p-0"
            severity="secondary"
          />
        </div>
      </div>
      <div v-if="!temCartoes" class="mb-3">
        <small class="text-muted">
          <i class="pi pi-info-circle me-1"></i>
          É necessário cadastrar pelo menos um cartão para continuar.
        </small>
      </div>
      <div class="row mb-3">
        <div class="col-md-12">
          <FloatLabel variant="in" :class="{ required: !temCartoes }">
            <InputText
              id="nome-cartao-input"
              name="nomeCartao"
              :fluid="true"
              variant="filled"
              size="small"
            />
            <label for="nome-cartao-input">Nome do Cartão</label>
          </FloatLabel>
          <Message
            v-if="formContext.nomeCartao?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ formContext.nomeCartao.error?.message }}
          </Message>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <FloatLabel variant="in" :class="{ required: !temCartoes }">
            <InputNumber
              id="dia-vencimento-fatura-input"
              name="diaVencimentoFatura"
              :fluid="true"
              variant="filled"
              size="small"
              mode="decimal"
            />
            <label for="dia-vencimento-fatura-input">Dia Vencimento Fatura</label>
          </FloatLabel>
          <Message
            v-if="formContext.diaVencimentoFatura?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ formContext.diaVencimentoFatura.error?.message }}
          </Message>
        </div>
        <div class="col-md-6">
          <FloatLabel variant="in" :class="{ required: !temCartoes }">
            <InputNumber
              id="dia-fechamento-fatura-input"
              name="diaFechamentoFatura"
              :fluid="true"
              variant="filled"
              size="small"
              mode="decimal"
            />
            <label for="dia-fechamento-fatura-input">Dia Fechamento Fatura</label>
          </FloatLabel>
          <Message
            v-if="formContext.diaFechamentoFatura?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ formContext.diaFechamentoFatura.error?.message }}
          </Message>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-12">
          <Button
            label="Adicionar Cartão"
            icon="pi pi-plus"
            @click="cadastrarCartao()"
            :variant="!temCartoes ? 'filled' : 'outlined'"
            size="small"
            fluid
          />
        </div>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-md-6">
        <FloatLabel variant="in" class="required">
          <InputNumber
            id="parcelas-input"
            name="qtdParcelas"
            :fluid="true"
            variant="filled"
            size="small"
            @update:modelValue="$emit('atualizarParcelamento', formContext)"
          />
          <label for="parcelas-input">Quantidade de Parcelas</label>
        </FloatLabel>
        <Message
          v-if="formContext.qtdParcelas?.invalid"
          class="mt-1"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ formContext.qtdParcelas.error?.message }}
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
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useCalendarioStore } from '@/stores/calendario.store'

const cartoes = ref([])
const mostrarFormCadastro = ref(false)
const calendarioStore = useCalendarioStore()

const props = defineProps<{
  formaPagamento: any
  listaParcelas: Array<{ numero: string; valor: number }>
  formContext: any
  codigoCalendario: number
}>()

defineEmits<{
  atualizarParcelamento: [form: any]
}>()

const temCartoes = computed(() => {
  return cartoes.value && cartoes.value.length > 0
})

onMounted(async () => {
  await obterCartoes()
})

// Limpar erros quando o usuário começar a preencher os campos
watch(
  () => props.formContext.nomeCartao?.value,
  (newValue) => {
    if (newValue && props.formContext.nomeCartao?.invalid) {
      props.formContext.nomeCartao.invalid = false
      props.formContext.nomeCartao.error = null
    }
  },
)

watch(
  () => props.formContext.diaVencimentoFatura?.value,
  (newValue) => {
    if (newValue && props.formContext.diaVencimentoFatura?.invalid) {
      props.formContext.diaVencimentoFatura.invalid = false
      props.formContext.diaVencimentoFatura.error = null
    }
  },
)

watch(
  () => props.formContext.diaFechamentoFatura?.value,
  (newValue) => {
    if (newValue && props.formContext.diaFechamentoFatura?.invalid) {
      props.formContext.diaFechamentoFatura.invalid = false
      props.formContext.diaFechamentoFatura.error = null
    }
  },
)

const obterCartoes = async () => {
  const response = await calendarioStore.listarDropDown(props.codigoCalendario)
  cartoes.value = response.data || []
  // Se não houver cartões, mostrar o formulário automaticamente
  if (cartoes.value.length === 0) {
    mostrarFormCadastro.value = true
  }
}

const fecharFormularioCartao = () => {
  mostrarFormCadastro.value = false

  if (props.formContext.nomeCartao) {
    props.formContext.nomeCartao.value = ''
  }
  if (props.formContext.diaVencimentoFatura) {
    props.formContext.diaVencimentoFatura.value = null
  }
  if (props.formContext.diaFechamentoFatura) {
    props.formContext.diaFechamentoFatura.value = null
  }
}

const cadastrarCartao = async () => {
  // Validar campos obrigatórios antes de chamar o backend
  const nome = props.formContext.nomeCartao?.value?.trim()
  const diaVencimento = props.formContext.diaVencimentoFatura?.value
  const diaFechamento = props.formContext.diaFechamentoFatura?.value

  if (!nome || !diaVencimento || !diaFechamento) {
    // Simular validação do Zod para mostrar erros
    if (!nome) {
      props.formContext.nomeCartao.invalid = true
      props.formContext.nomeCartao.error = { message: 'O nome do cartão é obrigatório.' }
    }
    if (!diaVencimento) {
      props.formContext.diaVencimentoFatura.invalid = true
      props.formContext.diaVencimentoFatura.error = {
        message: 'O dia de vencimento é obrigatório.',
      }
    }
    if (!diaFechamento) {
      props.formContext.diaFechamentoFatura.invalid = true
      props.formContext.diaFechamentoFatura.error = {
        message: 'O dia de fechamento é obrigatório.',
      }
    }
    return
  }

  const response = await calendarioStore.cadastrarCartao(props.codigoCalendario, {
    nome,
    diaVencimentoFatura: diaVencimento,
    diaFechamentoFatura: diaFechamento,
  })
  if (response.status !== 200) {
    console.error('Erro ao cadastrar cartão:', response)
    return
  }
  const tinhaCartoesAntes = cartoes.value.length > 0
  await obterCartoes()
  // Se já havia cartões antes, fechar o formulário após cadastrar
  if (tinhaCartoesAntes) {
    fecharFormularioCartao()
  }
}

const mostrarDetalhes = computed(() => {
  return props.formaPagamento?.value === 'CREDITO' || props.formaPagamento === 'CREDITO'
})

const formatCurrency = (valor: number) => {
  if (valor === null || valor === undefined || isNaN(valor)) {
    return 'R$ 0,00'
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}
</script>
