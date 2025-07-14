<template>
  <div class="container my-4">
    <div class="row">
      <div class="col-md" style="height: 1vh">
        <div class="card shadow border-0 rounded p-4">
          <FullCalendar :options="calendarOptions">
            <template v-slot:eventContent="arg">
              <div class="event-content" @click="console.log(arg.event.id)">
                <strong>{{ arg.event.title }}</strong>
                <p>{{ arg.event.extendedProps.description }}</p>
              </div>
            </template>
          </FullCalendar>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    v-model:visible="visible"
    :draggable="false"
    modal
    header="Cadastrar Compra"
    :style="{ width: '50rem', position: 'relative', overflow: 'hidden' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
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
              id="descricao-compra-input"
              name="descricao"
              :fluid="true"
              variant="filled"
            />
            <label for="descricao-compra-input">Descrição</label>
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
        </div>
        <div class="col-md-6">
          <FloatLabel variant="in" class="required">
            <Dropdown
              id="categoria-compra-input"
              name="idCategoriaCompra"
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
            v-if="$form.idCategoriaCompra?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.idCategoriaCompra.error?.message }}
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
            <Dropdown
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
              <InputNumber id="parcelas-input" name="qtdParcelas" :fluid="true" variant="filled" />
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
            <FloatLabel variant="in" class="required">
              <DatePicker
                id="data-vencimento-primeira-parcela-input"
                name="dataPrimeiraParcela"
                date-format="dd/mm/yy"
                :fluid="true"
                variant="filled"
              />
              <label for="data-vencimento-primeira-parcela-input">
                Data de Vencimento da 1ª Parcela
              </label>
            </FloatLabel>
            <Message
              v-if="$form.dataPrimeiraParcela?.invalid"
              class="mt-1"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.dataPrimeiraParcela.error?.message }}
            </Message>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <FloatLabel variant="in">
              <InputNumber
                id="valor-parcela-input"
                name="valorParcela"
                mode="currency"
                currency="BRL"
                locale="pt-BR"
                :fluid="true"
                variant="filled"
                disabled
              />
              <label for="valor-parcela-input">Valor da Parcela</label>
            </FloatLabel>
            <Message
              v-if="$form.valorParcela?.invalid"
              class="mt-1"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.valorParcela.error?.message }}
            </Message>
          </div>
          <div class="col-md-6">
            <FloatLabel variant="in">
              <InputNumber
                id="taxa-juros-input"
                name="taxaJuros"
                mode="currency"
                currency="BRL"
                locale="pt-BR"
                :fluid="true"
                variant="filled"
                disabled
              />
              <label for="taxa-juros-input">Taxa de Juros</label>
            </FloatLabel>
            <Message
              v-if="$form.taxaJuros?.invalid"
              class="mt-1"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.taxaJuros.error?.message }}
            </Message>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-6">
            <FloatLabel variant="in">
              <InputNumber
                id="juros-totais-input"
                name="jurosTotais"
                mode="currency"
                currency="BRL"
                locale="pt-BR"
                :fluid="true"
                variant="filled"
                disabled
              />
              <label for="juros-totais-input">Juros Totais</label>
            </FloatLabel>
            <Message
              v-if="$form.jurosTotais?.invalid"
              class="mt-1"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.jurosTotais.error?.message }}
            </Message>
          </div>
          <div class="col-md-6">
            <FloatLabel variant="in" class="optional">
              <InputNumber
                id="valorTotalAVista-compra-input"
                name="valorTotalAVista"
                mode="currency"
                currency="BRL"
                locale="pt-BR"
                :fluid="true"
                variant="filled"
              />
              <label for="valorTotalAVista-compra-input">Valor Total à Vista</label>
            </FloatLabel>
            <Message
              v-if="$form.valorTotalAVista?.invalid"
              class="mt-1"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.valorTotalAVista.error?.message }}
            </Message>
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

      <!-- Botões -->
      <div class="d-flex justify-content-end gap-2">
        <Button label="Cancelar" icon="pi pi-times" @click="visible = false" variant="outlined" />
        <Button label="Salvar" icon="pi pi-check" @click="submitForm" />
      </div>
    </Form>
  </Dialog>
</template>
<script lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { useCompraStore } from '@/stores/compra'
import { FormasPagamentoEnum } from '@/core/enums/formas-pagamento.enum'
import { useCategoriaStore } from '@/stores/categoria'
import { compraSchema } from '@/core/schemas/compra/compra.schema'

export default {
  components: {
    FullCalendar,
  },
  setup() {
    const compraStore = useCompraStore()
    const categoriaStore = useCategoriaStore()

    return { compraStore, categoriaStore }
  },
  data() {
    return {
      visible: false,
      isEnviando: false,
      categorias: [],
      formasPagamento: [
        { label: 'Cartão de Crédito', value: FormasPagamentoEnum.CARTAO_CREDITO },
        { label: 'Cartão de Débito', value: FormasPagamentoEnum.CARTAO_DEBITO },
        { label: 'Dinheiro', value: FormasPagamentoEnum.DINHEIRO },
        { label: 'Pix', value: FormasPagamentoEnum.PIX },
        { label: 'Boleto', value: FormasPagamentoEnum.BOLETO },
      ],
      produto: {
        idProduto: 0,
        descricao: '',
        idCategoriaCompra: 0,
        valorTotal: 0.0,
        valorTotalAVista: null,
        dataRealizacao: null,
        formaPagamento: FormasPagamentoEnum.DINHEIRO,
        qtdParcelas: 1,
        taxaJuros: 0.0,
        valorParcela: 0.0,
        jurosTotais: 0.0,
        dataPrimeiraParcela: null,
        lojaOuFornecedor: '',
        observacao: '',
      },
      resolver: zodResolver(compraSchema),
    }
  },
  mounted() {
    this.carregarCategorias()
  },
  computed: {
    calendarOptions() {
      return {
        plugins: [dayGridPlugin, interactionPlugin],
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: {
          left: 'today',
          center: 'title',
          right: 'prev,next',
        },
        // customButtons: {
        //   meuBotao: {
        //     text: 'Meu Botão',
        //     click: () => {
        //       console.log('Meu Botão clicado!')
        //     },
        //   },
        // },
        buttonText: {
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
        },
        height: 'auto',
        editable: true,
        dateClick: this.dateClick,
        events: [],
      }
    },
  },
  methods: {
    dateClick(info: any) {
      this.produto.dataRealizacao = info.date
      this.visible = true
    },
    async cadastrarCompra(event: any) {
      this.isEnviando = true
      if (event.valid) {
        const data = await this.compraStore.cadastrar(event.values)
        if (data.status !== 200) {
          // TODO: Alertar o erro, ex: "Erro ao criar compra"
          console.error('Erro ao criar compra:', data)
          this.isEnviando = false
          return
        }
        this.visible = false
      }
      this.isEnviando = false
    },
    async carregarCategorias() {
      try {
        const response = await this.categoriaStore.listarDropDown()
        this.categorias = response.data
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
      }
    },
    submitForm() {
      ;(this.$refs.formProdutoRef as { submit: () => void })?.submit()
    },
    onUpload() {
      console.log('Arquivo enviado com sucesso!')
    },
  },
}
</script>
