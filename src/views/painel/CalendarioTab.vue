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
    header="Criar Compra"
    :style="{ width: '40rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <Form
      ref="formProdutoRef"
      v-slot="$form"
      :resolver="resolver"
      :initialValues="produto"
      @submit="criarCompra"
    >
      <div class="mb-3">
        <FloatLabel variant="in" class="required">
          <InputText id="descricao-compra-input" name="descricao" :fluid="true" variant="filled" />
          <label for="descricao-compra-input" class="form-label">Descricao</label>
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
      <div class="mb-3">
        <FloatLabel variant="in" class="required">
          <Dropdown
            id="categoria-compra-input"
            name="idCategoria"
            placeholder="Selecione uma categoria"
            :options="categorias"
            :fluid="true"
            variant="filled"
          />
          <label for="categoria-compra-input" class="form-label">Categoria</label>
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
      <div class="mb-3">
        <FloatLabel variant="in" class="required">
          <InputNumber
            id="valorTotalParcelado-compra-input"
            name="valorTotalParcelado"
            mode="currency"
            currency="BRL"
            locale="pt-BR"
            :fluid="true"
            variant="filled"
          />
          <label for="valorTotalParcelado-compra-input" class="form-label"
            >Valor Total Parcelado</label
          >
        </FloatLabel>
        <Message
          v-if="$form.valorTotalParcelado?.invalid"
          class="mt-1"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.valorTotalParcelado.error?.message }}
        </Message>
      </div>
      <div class="mb-3">
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
          <label for="valorTotalAVista-compra-input" class="form-label">Valor Total a Vista</label>
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
      <div class="mb-3">
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
          <label for="forma-pagamento-input" class="form-label">Forma de Pagamento</label>
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
      <div v-if="$form.formaPagamento?.value === 1" class="mb-3 ml-3 me-3">
        <!-- CARTÃO -->
        <div class="mb-3">
          <FloatLabel variant="in" class="required">
            <InputNumber id="parcelas-input" name="qtdParcelas" :fluid="true" variant="filled" />
            <label for="parcelas-input" class="form-label">Quantidade de Parcelas</label>
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
        <div class="mb-3">
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
            <label for="taxa-juros-input" class="form-label">Taxa de Juros</label>
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
        <div class="mb-3">
          <FloatLabel variant="in">
            <InputNumber
              id="valor-parcela-input"
              name="valorParcela"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              :fluid="true"
              variant="filled"
            />
            <label for="valor-parcela-input" class="form-label">Valor da Parcela</label>
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
        <div class="mb-3">
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
            <label for="juros-totais-input" class="form-label">Juros Totais</label>
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
        <div class="mb-3">
          <!-- TODO: Incluir data de vencimento -->
          <FloatLabel variant="in" class="required">
            <DatePicker
              id="data-vencimento-primeira-parcela-input"
              name="dataVencimentoPrimeiraParcela"
              date-format="dd/mm/yy"
              :fluid="true"
              variant="filled"
            />
            <label for="data-vencimento-primeira-parcela-input" class="form-label">
              Data de Vencimento da Primeira Parcela
            </label>
          </FloatLabel>
          <Message
            v-if="$form.dataVencimentoPrimeiraParcela?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.dataVencimentoPrimeiraParcela.error?.message }}
          </Message>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md">
          <FloatLabel variant="in" class="required">
            <DatePicker
              id="data-compra-input"
              name="dataCompra"
              date-format="dd/mm/yy"
              :fluid="true"
              variant="filled"
            />
            <label for="data-compra-input" class="form-label">Data da Compra</label>
          </FloatLabel>
          <Message
            v-if="$form.dataCompra?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.dataCompra.error?.message }}
          </Message>
        </div>
      </div>
      <div class="mb-3">
        <FloatLabel variant="in" class="required">
          <InputText
            id="loja-ou-fornecedor-input"
            name="lojaOuFornecedor"
            :fluid="true"
            variant="filled"
          />
          <label for="loja-ou-fornecedor-input" class="form-label">Loja ou Fornecedor</label>
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

      <div class="mb-3">
        <FloatLabel variant="in" class="optional">
          <Textarea name="observacao" :fluid="true" variant="filled" />
          <label for="observacao-input" class="form-label">Observações</label>
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

      <div class="mb-3">
        <FileUpload
          mode="basic"
          url="/api/upload"
          accept=".pdf, image/*"
          :maxFileSize="1000000"
          @upload="onUpload"
          :auto="true"
          chooseLabel="Anexar Comprovante"
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
    </Form>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" @click="visible = false" class="p-button-text" />
      <Button label="Salvar" icon="pi pi-check" @click="submitForm" />
    </template>
  </Dialog>
</template>
<script lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      visible: false,
      categorias: [],
      formasPagamento: [
        { label: 'Cartão de Crédito', value: 1 },
        { label: 'Cartão de Débito', value: 2 },
        { label: 'Dinheiro', value: 3 },
        { label: 'Pix', value: 4 },
        { label: 'Boleto', value: 5 },
      ],
      produto: {
        idProduto: 0,
        descricao: '',
        idCategoria: 0,
        valorTotalParcelado: 0.0,
        valorTotalAVista: null,
        dataCompra: null,
        formaPagamento: 0,
        qtdParcelas: 1,
        taxaJuros: 0.0,
        valorParcela: 0.0,
        jurosTotais: 0.0,
        dataVencimentoPrimeiraParcela: null,
        lojaOuFornecedor: '',
        observacao: '',
      },
      resolver: zodResolver(
        z.object({
          descricao: z
            .string({ required_error: 'A descricao da compra é obrigatório.' })
            .nonempty({ message: 'A descricao da compra é obrigatório.' })
            .max(100, { message: 'A descricao da compra não pode ter mais de 100 caracteres.' })
            .min(3, { message: 'A descricao da compra deve ter pelo menos 3 caracteres.' }),
          idCategoria: z
            .number({ required_error: 'A categoria da compra é obrigatória.' })
            .refine((value) => value > 0, {
              message: 'A categoria da compra deve ser selecionada.',
            }),
          valorTotalParcelado: z
            .number({ required_error: 'O valor total da compra é obrigatório.' })
            .nonnegative({ message: 'O valor total da compra não pode ser negativo.' })
            .refine((value) => value > 0, {
              message: 'O valor total da compra deve ser maior que zero.',
            }),
          valorTotalAVista: z
            .number({ required_error: 'O valor total a vista é obrigatório.' })
            .nullable(),
          formaPagamento: z
            .number({ required_error: 'A forma de pagamento é obrigatória.' })
            .refine((value) => value > 0, {
              message: 'A forma de pagamento deve ser selecionada.',
            }),
          qtdParcelas: z
            .number({ required_error: 'A quantidade de parcelas é obrigatória.' })
            .refine((value) => value > 0, {
              message: 'A quantidade de parcelas deve ser maior que zero.',
            })
            .nullable(),
          taxaJuros: z.number({ required_error: 'A taxa de juros é obrigatória.' }),
          valorParcela: z
            .number({ required_error: 'O valor da parcela é obrigatório.' })
            .nonnegative({ message: 'O valor da parcela não pode ser negativo.' })
            .refine((value) => value > 0, {
              message: 'O valor da parcela deve ser maior que zero.',
            }),
          jurosTotais: z.number({ required_error: 'Os juros totais são obrigatórios.' }),
          dataVencimentoPrimeiraParcela: z
            .date({
              required_error: 'A data de vencimento da primeira parcela é obrigatória.',
            })
            .nullable()
            .refine((date) => date !== null, {
              message:
                'A data de vencimento da primeira parcela deve ser futura e não pode ser vazia.',
            }),
          dataCompra: z.date({ required_error: 'A data de compra é obrigatória.' }),
          lojaOuFornecedor: z
            .string({ required_error: 'O nome da loja ou fornecedor é obrigatório.' })
            .nonempty({ message: 'O nome da loja ou fornecedor é obrigatório.' })
            .max(100, {
              message: 'O nome da loja ou fornecedor não pode ter mais de 100 caracteres.',
            })
            .min(2, { message: 'O nome da loja ou fornecedor deve ter pelo menos 2 caracteres.' }),
          observacao: z
            .string()
            .max(500, { message: 'A observação não pode ter mais de 500 caracteres.' })
            .optional(),
        }),
      ),
    }
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
        // events: [
        //   {
        //     id: '1',
        //     title: 'Evento 1',
        //     start: '2025-10-01',
        //     end: '2025-10-02',
        //     description: 'Descrição do Evento 1',
        //   },
        //   {
        //     id: '2',
        //     title: 'Evento 2',
        //     start: '2025-10-05',
        //     description: 'Descrição do Evento 2',
        //   },
        //   {
        //     id: '3',
        //     title: 'Evento 3',
        //     start: '2025-10-10',
        //     end: '2025-10-12',
        //     description: 'Descrição do Evento 3',
        //   },
        // ],
      }
    },
  },
  methods: {
    dateClick(info: any) {
      this.produto.dataCompra = info.date
      this.visible = true
    },
    async criarCompra(event: any) {
      if (event.valid) {
        this.visible = false
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
