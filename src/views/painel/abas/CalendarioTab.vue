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
    :produto="produto"
    :codigoCalendarioSelecionado="codigoCalendarioSelecionado"
    @visibleEmit="visibleCadastroCompraListnerMethod"
    @obterComprasPorCalendarioEmit="obterComprasPorCalendario"
  />
</template>
<script lang="ts">
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { FormasPagamentoEnum } from '@/core/enums/formas-pagamento.enum'
import { useCalendarioStore } from '@/stores/calendario.store'
import { nextTick } from 'vue'
import CadastroCompra from '@/components/CadastroCompra.vue'
import CalendarioCompras from '@/components/CalendarioCompras.vue'
import CadastroCalendario from '@/components/CadastroCalendario.vue'

export default {
  components: {
    CadastroCompra,
    CalendarioCompras,
    CadastroCalendario,
  },
  setup() {
    const calendarioStore = useCalendarioStore()

    return { calendarioStore }
  },
  data() {
    return {
      carregando: true,
      visibleCadastroCompra: false,
      visibleCadastroCalendario: false,
      events: [],
      mappedEvents: [],
      calendarios: [] as any,
      codigoCalendarioSelecionado: -1,
      produto: {
        idProduto: 0,
        nome: '',
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
        eventClick: (data: any) => {
          const evento = this.events.find((event: any) => event.idCompra == data.event.id) as any
          if (evento) {
            this.produto = {
              idProduto: evento.idCompra,
              nome: evento.nome,
              idCategoria: evento.categoria?.idCategoria || 0,
              idCalendario: evento.idCalendario || this.codigoCalendarioSelecionado,
              valorTotal: evento.valorTotal,
              dataRealizacao: evento.dataRealizacao,
              formaPagamento: evento.formaPagamento,
              qtdParcelas: evento.qtdParcelas,
              lojaOuFornecedor: evento.lojaOuFornecedor,
              observacao: evento.observacao,
            }
            this.visibleCadastroCompra = true
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
      this.resetarProduto()
      this.produto.dataRealizacao = info.date
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
      try {
        const response = await this.calendarioStore.listarComprasPorCalendario(
          this.codigoCalendarioSelecionado,
        )
        this.events = response.data
        this.mappedEvents = response.data.map((compra: any) => ({
          id: compra.idCompra,
          title: compra.nome,
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

    visibleCadastroCompraListnerMethod(visible: boolean) {
      this.visibleCadastroCompra = visible

      if (!visible) {
        this.resetarProduto()
      }
    },
    visibleCadastroCalendarioListnerMethod(visible: boolean) {
      this.visibleCadastroCalendario = visible
    },

    resetarProduto() {
      this.produto = {
        idProduto: 0,
        nome: '',
        idCategoria: 0,
        idCalendario: null,
        valorTotal: 0.0,
        dataRealizacao: null,
        formaPagamento: FormasPagamentoEnum.DINHEIRO,
        qtdParcelas: 1,
        lojaOuFornecedor: '',
        observacao: '',
      }
    }
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
