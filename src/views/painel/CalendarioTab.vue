<template>
  <div class="container my-4">
    <div class="row">
      <div class="col-md" style="height: 1vh">
        <div class="card shadow border-0 rounded p-4">
          <Select
            v-model="codigoCalendarioSelecionado"
            :options="calendarios"
            optionLabel="descricao"
            optionValue="codigo"
            fluid
            class="mb-3"
          />
          <FullCalendar :options="calendarOptions">
            <!-- <template v-slot:eventContent="arg">
              <div
                class="event-content"
                :style="{ backgroundColor: 'red' }"
                @click="console.log(arg.event.id)"
              >
                <strong>{{ arg.event.title }}</strong>
                <p>{{ arg.event.extendedProps.description }}</p>
              </div>
            </template> -->
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
              @update:modelValue="calcularParcelamento($form)"
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
              <InputNumber
                id="parcelas-input"
                name="qtdParcelas"
                :fluid="true"
                variant="filled"
                @update:modelValue="calcularParcelamento($form)"
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
import { useCompraStore } from '@/stores/compra.store'
import { FormasPagamentoEnum } from '@/core/enums/formas-pagamento.enum'
import { useCategoriaStore } from '@/stores/categoria.store'
import { compraSchema } from '@/core/schemas/compra/compra.schema'
import { useCalendarioStore } from '@/stores/calendario.store'
import { useParcelaStore } from '@/stores/parcela.store'

export default {
  components: {
    FullCalendar,
  },
  setup() {
    const compraStore = useCompraStore()
    const categoriaStore = useCategoriaStore()
    const calendarioStore = useCalendarioStore()
    const parcelaStore = useParcelaStore()

    return { compraStore, categoriaStore, calendarioStore, parcelaStore }
  },
  data() {
    return {
      visible: false,
      isEnviando: false,
      categorias: [],
      events: [],
      mappedEvents: [],
      calendarios: [] as any,
      codigoCalendarioSelecionado: -1,
      listaParcelas: [
        {
          numero: '--',
          valor: '--',
        },
      ] as any,
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
        idCategoria: 0,
        idCalendario: null,
        valorTotal: 0.0,
        dataRealizacao: null,
        formaPagamento: FormasPagamentoEnum.DINHEIRO,
        qtdParcelas: 1,
        // taxaJuros: 0.0,
        // valorParcela: 0.0,
        // jurosTotais: 0.0,
        // dataPrimeiraParcela: null,
        lojaOuFornecedor: '',
        observacao: '',
      },
      resolver: zodResolver(compraSchema),
    }
  },
  async mounted() {
    this.carregarCategorias()
    await this.obterCalendarios()
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
        //   meuDropdown: {
        //     text: 'Meu Dropdown',
        //     click: () => {
        //       console.log('Meu Dropdown selecionado!')
        //       // Logic for showing dropdown options can be implemented here
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
        eventClick: (data: any) => {
          // console.log(data.event.id)
          // const clickedEvent = this.events.find((event: any) => event.id == data.event.id);
          // console.log(clickedEvent);
          console.log(data)
        },
        events: this.mappedEvents,
      }
    },
  },
  watch: {
    codigoCalendarioSelecionado() {
      this.obterComprasPorCalendario()
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
        console.log(event.values, this.codigoCalendarioSelecionado)
        event.values.idCalendario = this.codigoCalendarioSelecionado
        const data = await this.compraStore.cadastrar(event.values)
        if (data.status !== 200) {
          // TODO: Alertar o erro, ex: "Erro ao criar compra"
          console.error('Erro ao criar compra:', data)
          this.isEnviando = false
          return
        }
        this.obterComprasPorCalendario()
        this.visible = false
      }
      this.isEnviando = false
    },
    async calcularParcelamento(form: any) {
      const formaPagamento = form.formaPagamento.value
      const valorTotal = form.valorTotal.value
      const qtdParcelas = form.qtdParcelas.value

      if (
        formaPagamento === FormasPagamentoEnum.CARTAO_CREDITO &&
        valorTotal > 0 &&
        qtdParcelas > 0
      ) {
        try {
          const response = await this.parcelaStore.calcularParcelamento({
            valorTotal,
            qtdParcelas,
          })

          const { valorParcela } = response.data

          this.listaParcelas = []
          for (let i = 1; i <= qtdParcelas; i++) {
            this.listaParcelas.push({
              numero: i,
              valor: valorParcela,
            })
          }
        } catch (error) {
          console.error('Erro ao calcular parcelamento:', error)
        }
      }
    },
    async obterCalendarios() {
      try {
        const response = await this.calendarioStore.listarCalendarios()
        this.calendarios = response.data
        this.codigoCalendarioSelecionado = this.calendarios[0].codigo
      } catch (error) {
        console.error('Erro ao obter calendários:', error)
      }
    },

    async obterComprasPorCalendario() {
      try {
        const response = await this.calendarioStore.listarPorCalendario(this.codigoCalendarioSelecionado)
        this.events = response.data
        this.mappedEvents = response.data.map((compra: any) => ({
          id: compra.idCompra,
          title: compra.descricao,
          start: compra.dataRealizacao,
          end: compra.dataUltimaParcela || compra.dataRealizacao,
          allDay: true,
          color: '#' + compra.categoria.corHex,
          extendedProps: {
            lojaOuFornecedor: compra.lojaOuFornecedor,
            formaPagamento: compra.formaPagamento,
            valorTotal: compra.valorTotal,
            observacao: compra.observacao,
            qtdParcelas: compra.qtdParcelas,
            dataPrimeiraParcela: compra.dataPrimeiraParcela,
          },
        }))
      } catch (error) {
        console.error('Erro ao obter compras por calendário:', error)
      }
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

    formatCurrency(valor: number) {
      if (!valor || isNaN(valor)) return 'R$ 0,00'
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(valor)
    },
  },
}
</script>
