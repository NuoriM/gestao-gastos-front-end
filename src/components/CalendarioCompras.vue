<template>
  <div class="row mb-3">
    <div class="col-md mb-sm-2 mb-2">
      <Select
        :model-value="codigoCalendarioSelecionado"
        @update:model-value="$emit('update:codigoCalendarioSelecionado', $event)"
        :options="calendarios"
        optionLabel="descricao"
        optionValue="codigo"
        fluid
      />
    </div>

    <div class="col-md-4 col-sm-12 text-end">
      <Button
        label="Criar Calendário"
        icon="pi pi-plus"
        variant="success"
        fluid
        @click="$emit('visibleCadastroCalendario', true)"
      ></Button>
    </div>
  </div>

  <!-- Header Customizado do Calendário -->
  <div class="card mb-3">
    <div class="card-body py-2">
      <div class="row align-items-center">
        <!-- Navegação -->
        <div class="col-md-4">
          <div class="d-flex gap-2">
            <Button
              icon="pi pi-chevron-left"
              size="small"
              text
              rounded
              @click="navegarAnterior"
              v-tooltip.top="'Mês Anterior'"
            />
            <Button
              icon="pi pi-chevron-right"
              size="small"
              text
              rounded
              @click="navegarProximo"
              v-tooltip.top="'Próximo Mês'"
            />
            <Button
              label="Hoje"
              size="small"
              text
              @click="irParaHoje"
              v-tooltip.top="'Ir para Hoje'"
            />
          </div>
        </div>

        <!-- Título do Mês/Ano -->
        <div class="col-md-4 text-center">
          <h6 class="mb-0 text-muted">{{ tituloAtual }}</h6>
        </div>

        <!-- Botões de Visualização -->
        <div class="col-md-4 text-end">
          <div class="btn-group gap-1" role="group">
            <Button
              :label="visualizacaoAtual === 'dayGridMonth' ? 'Mês' : ''"
              :icon="visualizacaoAtual === 'dayGridMonth' ? '' : 'pi pi-calendar'"
              size="small"
              :variant="visualizacaoAtual === 'dayGridMonth' ? 'filled' : 'outlined'"
              @click="alterarVisualizacao('dayGridMonth')"
              v-tooltip.top="'Visualização Mensal'"
            />
            <Button
              :label="visualizacaoAtual === 'dayGridWeek' ? 'Semana' : ''"
              :icon="visualizacaoAtual === 'dayGridWeek' ? '' : 'pi pi-calendar-times'"
              size="small"
              :variant="visualizacaoAtual === 'dayGridWeek' ? 'filled' : 'outlined'"
              @click="alterarVisualizacao('dayGridWeek')"
              v-tooltip.top="'Visualização Semanal'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <FullCalendar :options="opcoesDoCalendario" ref="calendarRef"> </FullCalendar>

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
</template>
<script lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import moment from 'moment'
import type { PropType } from 'vue'
import { useCompraStore } from '@/stores/compra.store'
import type { ICompra } from '@/core/dtos/compra.dto'

export default {
  setup() {
    const compraStore = useCompraStore()
    return { compraStore }
  },
  components: {
    FullCalendar,
  },
  props: {
    calendarios: {
      type: Array,
      required: true,
    },
    opcoesDoCalendario: {
      type: Object,
      required: true,
    },
    codigoCalendarioSelecionado: {
      type: Number as PropType<number | null>,
      required: false,
      default: null,
    },
    codigoCompraSelecionada: {
      type: Number as PropType<number | null>,
      required: false,
      default: null,
    },
  },
  emits: [
    'update:codigoCalendarioSelecionado',
    'visibleCadastroCalendario',
    'navegarCalendario',
    'alterarVisualizacao',
  ],
  data() {
    return {
      compraSelecionada: null as ICompra | null,

      visualizacaoAtual: 'dayGridMonth',
      dataAtual: moment().toDate(),
    }
  },
  mounted() {
    // Aguarda o calendário ser montado para sincronizar o estado inicial
    this.$nextTick(() => {
      // this.obterCompraCalendario()
      this.atualizarDataAtual()
    })
  },
  computed: {
    tituloAtual() {
      const meses = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ]
      return `${meses[this.dataAtual.getMonth()]} ${this.dataAtual.getFullYear()}`
    },
  },
  methods: {
    async obterCompraCalendario() {
      if (this.codigoCompraSelecionada === null || this.codigoCalendarioSelecionado === null) {
        return
      }
      try {
        const response = await this.compraStore.obterPorCodigo(
          this.codigoCalendarioSelecionado,
          this.codigoCompraSelecionada,
        )

        this.compraSelecionada = response.data as ICompra
      } catch (error) {
        console.error('Erro ao obter compra:', error);
        this.compraSelecionada = null
      }
      

    },
    navegarAnterior() {
      const calendar = this.$refs.calendarRef as any
      if (calendar && calendar.getApi) {
        calendar.getApi().prev()
        this.atualizarDataAtual()
      }
    },
    navegarProximo() {
      const calendar = this.$refs.calendarRef as any
      if (calendar && calendar.getApi) {
        calendar.getApi().next()
        this.atualizarDataAtual()
      }
    },
    irParaHoje() {
      const calendar = this.$refs.calendarRef as any
      if (calendar && calendar.getApi) {
        calendar.getApi().today()
        this.atualizarDataAtual()
      }
    },
    alterarVisualizacao(novaVisualizacao: string) {
      const calendar = this.$refs.calendarRef as any
      if (calendar && calendar.getApi) {
        calendar.getApi().changeView(novaVisualizacao)
        this.visualizacaoAtual = novaVisualizacao
      }
    },
    atualizarDataAtual() {
      const calendar = this.$refs.calendarRef as any
      if (calendar && calendar.getApi) {
        const view = calendar.getApi().view

        this.dataAtual = view.currentStart
        this.visualizacaoAtual = view.type
      }
    },
  },
  watch: {
    codigoCompraSelecionada() {
      this.obterCompraCalendario()
    },
  },
}
</script>

<style scoped>
/* Estilos para o header customizado do calendário */
.card {
  border: 1px solid #e9ecef;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-body {
  padding: 0.75rem 1rem;
}

.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.btn-group .btn:last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

/* Título menor e mais elegante */
h6 {
  font-size: 1rem;
  font-weight: 500;
  color: #6c757d;
}

/* Botões menores e mais compactos */
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

/* Espaçamento entre botões */
.gap-2 > * + * {
  margin-left: 0.5rem;
}

/* Responsividade para mobile */
@media (max-width: 768px) {
  .col-md-4 {
    margin-bottom: 0.5rem;
  }

  .text-end {
    text-align: left !important;
  }

  .btn-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .btn-group .btn {
    flex: 1;
    min-width: 0;
  }
}
</style>
