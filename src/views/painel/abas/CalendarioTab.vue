<template>
  <div class="container my-4">
    <div class="row">
      <div class="col-md">
        <div class="card shadow border-0 rounded py-4 px-5">
          <!-- Skeleton de carregamento -->
          <div v-if="carregando">
            <!-- Skeleton do seletor de calendário -->
            <div class="row mb-3">
              <div class="col-md mb-sm-2 mb-2">
                <Skeleton height="38px" width="100%" />
              </div>
              <div class="col-md-4 col-sm-12 text-end">
                <Skeleton height="38px" width="140px" class="ms-auto" />
              </div>
            </div>

            <!-- Skeleton do header do calendário -->
            <div class="card mb-3">
              <div class="card-body py-2">
                <div class="row align-items-center">
                  <div class="col-md-4">
                    <div class="d-flex gap-2">
                      <Skeleton height="32px" width="32px" shape="circle" />
                      <Skeleton height="32px" width="32px" shape="circle" />
                      <Skeleton height="32px" width="60px" />
                    </div>
                  </div>
                  <div class="col-md-4 text-center">
                    <Skeleton height="20px" width="150px" class="mx-auto" />
                  </div>
                  <div class="col-md-4 text-end">
                    <div class="d-flex gap-1 justify-content-end">
                      <Skeleton height="32px" width="60px" />
                      <Skeleton height="32px" width="60px" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Skeleton do calendário -->
            <div class="card">
              <div class="card-body p-0">
                <!-- Header dos dias da semana -->
                <div class="row g-0 border-bottom">
                  <div class="col" v-for="i in 7" :key="i">
                    <div class="p-2 text-center">
                      <Skeleton height="16px" width="30px" class="mx-auto" />
                    </div>
                  </div>
                </div>
                <!-- Semanas do calendário -->
                <div v-for="week in 6" :key="week" class="row g-0 border-bottom">
                  <div class="col" v-for="day in 7" :key="day">
                    <div class="p-2" style="height: 80px">
                      <Skeleton height="16px" width="20px" class="mb-1" />
                      <Skeleton height="12px" width="100%" class="mb-1" />
                      <Skeleton height="12px" width="80%" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Calendário real -->
          <CalendarioCompras
            v-else-if="calendarios.length > 0"
            :codigoCompraSelecionada="idCompra"
            :calendarios="calendarios"
            :opcoes-do-calendario="opcoesDoCalendario"
            v-model:codigo-calendario-selecionado="codigoCalendarioSelecionado"
            @visibleCadastroCalendario="visibleCadastroCalendarioListnerMethod"
          />

          <!-- Estado vazio -->
          <div v-else class="text-center py-5">
            <i class="pi pi-calendar text-muted" style="font-size: 3rem"></i>
            <h5 class="text-muted mt-3">Nenhum calendário encontrado</h5>
            <p class="text-muted">
              Crie seu primeiro calendário para começar a organizar suas compras.
            </p>
            <Button
              label="Criar Calendário"
              icon="pi pi-plus"
              variant="success"
              @click="visibleCadastroCalendario = true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <CadastroCalendario
    v-bind:visible="visibleCadastroCalendario"
    @visibleEmit="visibleCadastroCalendarioListnerMethod"
    @atualizarCalendariosEmit="obterCalendarios"
  />
  <CadastroCompra
    v-bind:visible="visibleCadastroCompra"
    :idCompra="idCompra ?? undefined"
    :dataClicada="dataClicada ?? undefined"
    :codigoCalendarioSelecionado="codigoCalendarioSelecionado ?? undefined"
    :codigoCompraSelecionada="idCompra ?? undefined"
    @visibleEmit="visibleCadastroCompraListnerMethod"
    @obterComprasPorCalendarioEmit="obterComprasPorCalendario"
  />
</template>
<script lang="ts">
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useCalendarioStore } from '@/stores/calendario.store'
import { nextTick } from 'vue'
import CadastroCompra from '@/components/CadastroCompra.vue'
import CalendarioCompras from '@/components/CalendarioCompras.vue'
import CadastroCalendario from '@/components/CadastroCalendario.vue'
import { useCompraStore } from '@/stores/compra.store'

export default {
  components: {
    CadastroCompra,
    CalendarioCompras,
    CadastroCalendario,
  },
  setup() {
    const calendarioStore = useCalendarioStore()
    const compraStore = useCompraStore()

    return { calendarioStore, compraStore }
  },
  data() {
    return {
      carregando: true,
      dataClicada: null,
      visibleCadastroCompra: false,
      visibleCadastroCalendario: false,
      idCompra: null,
      events: [],
      mappedEvents: [] as Array<{
        title: string
        start: Date | string
        end: Date | string
        [key: string]: any
      }>,
      calendarios: [] as any,
      codigoCalendarioSelecionado: null as number | null,
      // produto: {
      //   idProduto: 0,
      //   idCartao: null,
      //   idCategoria: 0,
      //   idCalendario: null,
      //   nome: '',
      //   valorTotal: 0.0,
      //   dataRealizacao: null,
      //   formaPagamento: FormasPagamentoEnum.DINHEIRO,
      //   qtdParcelas: 1,
      //   lojaOuFornecedor: '',
      //   observacao: '',
      // },
    }
  },
  async mounted() {
    await this.obterCalendarios()
  },
  computed: {
    opcoesDoCalendario() {
      return {
        plugins: [dayGridPlugin, interactionPlugin],
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: false, // Desabilita o header padrão
        height: 'auto',
        editable: true,
        dateClick: this.dateClick,
        eventClick: async (data: any) => {
          if (data) {
            this.idCompra = data.event.extendedProps.idCompra;
            this.visibleCadastroCompra = true;
          }
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
      this.idCompra = null
      this.dataClicada = info.date
      this.visibleCadastroCompra = true
    },
    async obterCalendarios() {
      try {
        this.carregando = true
        const response = await this.calendarioStore.listarCalendarios()
        this.calendarios = response.data

        if (this.calendarios.length > 0) {
          this.codigoCalendarioSelecionado = this.calendarios[0].codigo
          await nextTick()
        }
      } catch (error) {
        console.error('Erro ao obter calendários:', error)
      } finally {
        this.carregando = false
      }
    },

    async obterComprasPorCalendario() {
      if (this.codigoCalendarioSelecionado === null) {
        return
      }
      try {
        const response = await this.calendarioStore.listarComprasPorCalendario(
          this.codigoCalendarioSelecionado,
        )

        this.events = response.data
        this.mappedEvents = response.data.map((compra: any) => ({
          id: compra.idCompra,
          title: compra.nome,
          color: '#' + compra.corHexCategoria,
          start: compra.dataRealizacao,
          // FullCalendar trata 'end' de allDay como exclusivo; somamos +1 dia para incluir a data de vencimento
          end: (() => {
            const d = new Date(compra.dataVencimento)
            d.setDate(d.getDate() + 1)
            return d
          })(),
          allDay: true,
          extendedProps: { ...compra },
        }))
      } catch (error) {
        console.error('Erro ao obter compras por calendário:', error)
      }
    },

    visibleCadastroCompraListnerMethod(visible: boolean) {
      this.visibleCadastroCompra = visible

      if (!visible) {
        // this.resetarProduto()
      }
    },
    visibleCadastroCalendarioListnerMethod(visible: boolean) {
      this.visibleCadastroCalendario = visible
    },

    // resetarProduto() {
    //   this.produto = {
    //     idProduto: 0,
    //     idCartao: null,
    //     idCategoria: 0,
    //     idCalendario: null,
    //     nome: '',
    //     valorTotal: 0.0,
    //     dataRealizacao: null,
    //     formaPagamento: FormasPagamentoEnum.DINHEIRO,
    //     qtdParcelas: 1,
    //     lojaOuFornecedor: '',
    //     observacao: '',
    //   }
    // },
  },
}
</script>

<style scoped>
/* Estado vazio */
.text-center {
  color: #6c757d;
}

.text-center i {
  opacity: 0.5;
}

/* Responsividade do skeleton */
@media (max-width: 768px) {
  .ms-auto {
    margin-left: 0 !important;
    margin-top: 0.5rem;
  }
}
</style>
