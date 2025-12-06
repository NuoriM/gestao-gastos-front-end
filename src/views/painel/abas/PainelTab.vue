<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCategoriaStore } from '@/stores/categoria.store'
import { useCalendarioStore } from '@/stores/calendario.store'
import Chart from 'primevue/chart'

const categoriaStore = useCategoriaStore()
const calendarioStore = useCalendarioStore()

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'],
    datasets: [
      {
        type: 'bar',
        label: 'Dataset 1',
        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data: [50, 25, 12, 48, 90, 76, 42],
      },
      {
        type: 'bar',
        label: 'Dataset 2',
        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: [21, 84, 24, 75, 37, 65, 34],
      },
      {
        type: 'bar',
        label: 'Dataset 3',
        backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
        data: [41, 52, 24, 74, 23, 21, 32],
      },
    ],
  }
}
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  }
}

const carregando = ref(false)

// Meta mensal e Safe-to-Spend (cálculo simples, sem dados reais ainda)
const metaMensal = ref<number | null>(null) // quando null/0, mostrar CTA para definir meta
const gastoDoMes = ref(0)
const debitosAteFimDoMes = ref(0)

const hoje = new Date()
const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)
const diasRestantes = computed(() => Math.max(1, ultimoDiaMes.getDate() - hoje.getDate() + 1))

const restanteDoMes = computed(() => {
  const meta = metaMensal.value ?? 0
  return Math.max(0, meta - gastoDoMes.value - debitosAteFimDoMes.value)
})

const safeToSpendHoje = computed(() => {
  return Math.max(0, Math.floor(restanteDoMes.value / diasRestantes.value))
})

const statusSafe = computed(() => {
  if (!metaMensal.value || metaMensal.value <= 0) return 'secondary'
  const ratio = restanteDoMes.value / (metaMensal.value || 1)
  if (ratio >= 0.6) return 'success'
  if (ratio >= 0.3) return 'warning'
  return 'danger'
})

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}
</script>

<template>
  <div class="container my-4">
    <div class="row">
      <div class="col-md">
        <div class="card shadow border-0 rounded py-4 px-5">
          <!-- Skeleton de carregamento -->
          <div v-if="carregando">
            <div class="row mb-4">
              <div class="col-md-3 mb-3">
                <div class="text-center">
                  <Skeleton height="40px" width="100%" class="mb-2" />
                  <Skeleton height="20px" width="80%" class="mx-auto" />
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="text-center">
                  <Skeleton height="40px" width="100%" class="mb-2" />
                  <Skeleton height="20px" width="80%" class="mx-auto" />
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="text-center">
                  <Skeleton height="40px" width="100%" class="mb-2" />
                  <Skeleton height="20px" width="80%" class="mx-auto" />
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="text-center">
                  <Skeleton height="40px" width="100%" class="mb-2" />
                  <Skeleton height="20px" width="80%" class="mx-auto" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <Skeleton height="200px" width="100%" />
              </div>
              <div class="col-md-6">
                <Skeleton height="200px" width="100%" />
              </div>
            </div>
          </div>

          <!-- Conteúdo real -->
          <div v-else>
            <!-- Safe-to-Spend: evita duplicidade (informação nova e acionável) -->
            <div class="row mb-4">
              <div class="col-12">
                <div class="p-4 border rounded d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                  <div class="d-flex align-items-center gap-3">
                    <i class="pi pi-shield text-" :class="'text-' + statusSafe" style="font-size: 2rem"></i>
                    <div>
                      <h5 class="mb-1">Pode gastar hoje</h5>
                      <div class="d-flex align-items-center gap-2">
                        <h3 :class="
                          statusSafe === 'success' ? 'text-success' :
                          statusSafe === 'warning' ? 'text-warning' :
                          statusSafe === 'danger' ? 'text-danger' : 'text-muted'
                        " class="mb-0">
                          {{ formatarMoeda(safeToSpendHoje) }}
                        </h3>
                        <small class="text-muted">{{ diasRestantes }} dias restantes</small>
                      </div>
                      <small class="text-muted">Restante no mês: {{ formatarMoeda(restanteDoMes) }}</small>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <Button
                      v-if="!metaMensal || metaMensal <= 0"
                      label="Definir meta do mês"
                      icon="pi pi-cog"
                      @click="$router.push('/usuario')"
                    />
                    <div v-else class="d-flex align-items-center gap-2">
                      <span class="badge"
                        :class="
                          statusSafe === 'success' ? 'bg-success' :
                          statusSafe === 'warning' ? 'bg-warning text-dark' :
                          statusSafe === 'danger' ? 'bg-danger' : 'bg-secondary'
                        ">
                        {{ statusSafe === 'success' ? 'Confortável' : statusSafe === 'warning' ? 'Atenção' : statusSafe === 'danger' ? 'Crítico' : 'Sem meta' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 1. AÇÕES RÁPIDAS - Mais importante para interação imediata -->
            <div class="row mb-4">
              <div class="col-12">
                <div class="p-4 border rounded">
                  <h5 class="mb-3">
                    <i class="pi pi-calendar-plus me-2"></i>
                    Ações Rápidas
                  </h5>
                  <div class="d-grid gap-2 d-md-flex">
                    <Button
                      label="Nova Compra"
                      icon="pi pi-plus"
                      variant="success"
                      @click="$router.push('/calendario')"
                    />
                    <Button
                      label="Gerenciar Categorias"
                      icon="pi pi-tag"
                      variant="outlined"
                      @click="$router.push('/categorias')"
                    />
                    <Button
                      label="Ver Calendário"
                      icon="pi pi-calendar"
                      variant="outlined"
                      @click="$router.push('/calendario')"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. RESUMO FINANCEIRO PRINCIPAL - Visão geral dos gastos -->
            <!-- Cards Mobile - 2x2 Grid -->
            <div class="mb-4 d-block d-md-none">
              <div class="row g-3">
                <div class="col-6">
                  <div class="p-2 border rounded text-center">
                    <i class="pi pi-wallet text-primary d-block mb-1" style="font-size: 1.5rem"></i>
                    <small class="text-muted d-block">Total Gasto</small>
                    <h6 class="mb-0 text-primary">R$ 0,00</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-2 border rounded text-center">
                    <i class="pi pi-calendar text-info d-block mb-1" style="font-size: 1.5rem"></i>
                    <small class="text-muted d-block">Este Mês</small>
                    <h6 class="mb-0 text-info">R$ 0,00</h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-2 border rounded text-center">
                    <i
                      class="pi pi-chart-line d-block mb-1"
                      :class="0 >= 0 ? 'text-success' : 'text-danger'"
                      style="font-size: 1.5rem"
                    ></i>
                    <small class="text-muted d-block">{{ 0 >= 0 ? 'Economia' : 'Excesso' }}</small>
                    <h6 class="mb-0" :class="0 >= 0 ? 'text-success' : 'text-danger'">
                      R$ 0,00
                    </h6>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-2 border rounded text-center">
                    <i
                      class="pi pi-shopping-cart text-success d-block mb-1"
                      style="font-size: 1.5rem"
                    ></i>
                    <small class="text-muted d-block">Compras</small>
                    <h6 class="mb-0 text-success">0</h6>
                  </div>
                </div>
              </div>
            </div>
            <!-- Cards de Resumo Desktop -->
            <div class="row mb-4 d-none d-md-flex">
              <div class="col-md-3 mb-3">
                <div class="text-center h-100 align-content-center p-3 border rounded">
                  <i class="pi pi-wallet text-primary" style="font-size: 2.5rem"></i>
                  <h4 class="mt-2 mb-1 text-primary">R$ 0,00</h4>
                  <p class="text-muted mb-0">Total Gasto</p>
                </div>
              </div>

              <div class="col-md-3 mb-3">
                <div class="text-center h-100  align-content-center p-3 border rounded">
                  <i class="pi pi-calendar text-info" style="font-size: 2.5rem"></i>
                  <h4 class="mt-2 mb-1 text-info">R$ 0,00</h4>
                  <p class="text-muted mb-0">Gasto Este Mês</p>
                </div>
              </div>

              <div class="col-md-3 mb-3">
                <div class="text-center h-100  align-content-center p-3 border rounded">
                  <i
                    class="pi pi-chart-line"
                    :class="0 >= 0 ? 'text-success' : 'text-danger'"
                    style="font-size: 2.5rem"
                  ></i>
                  <h4 class="mt-2 mb-1" :class="0 >= 0 ? 'text-success' : 'text-danger'">
                    R$ 0,00
                  </h4>
                  <p class="text-muted mb-0">
                    {{ 0 >= 0 ? 'Economia' : 'Excesso' }}
                  </p>
                </div>
              </div>

              <div class="col-md-3 mb-3">
                <div class="text-center h-100 align-content-center p-3 border rounded">
                  <i class="pi pi-shopping-cart text-success" style="font-size: 2.5rem"></i>
                  <h4 class="mt-2 mb-1 text-success">0</h4>
                  <p class="text-muted mb-0">Total de Compras</p>
                </div>
              </div>
            </div>

            <!-- 3. ANÁLISE DE ECONOMIA - Controle de metas e comparações -->
            <div class="row mb-4">
              <div class="col-12 col-md-4 mb-3">
                <div class="p-4 border rounded text-center h-100 align-content-center">
                  <h5 class="mb-3">
                    <i class="pi pi-bullseye"></i>
                    Meta Mensal
                  </h5>
                  <h3 class="text-primary">R$ 0,00</h3>
                  <ProgressBar
                    :value="0 > 0 ? Math.min((0 / 0) * 100, 100) : 0"
                    :showValue="false"
                    :class="
                      0 > 0
                        ? 0 <= 0
                          ? 'p-progressbar-success'
                          : 'p-progressbar-danger'
                        : 'p-progressbar-secondary'
                    "
                    class="mt-2"
                  />
                  <small class="text-muted">
                    {{ 0 > 0 ? ((0 / 0) * 100).toFixed(1) + '% da meta' : 'Meta não definida' }}
                  </small>
                </div>
              </div>

              <div class="col-12 col-md-4 mb-3">
                <div class="p-4 border rounded text-center h-100 align-content-center">
                  <h5 class="mb-3">
                    <i class="pi pi-arrow-up"></i>
                    Comparação Mensal
                  </h5>
                  <h3 :class="0 <= 0 ? 'text-success' : 'text-danger'">
                    {{ 0 > 0 ? (((0 - 0) / 0) * 100).toFixed(1) + '%' : 'N/A' }}
                  </h3>
                  <p class="text-muted mb-0">vs mês anterior</p>
                  <small class="text-muted">
                    R$ 0,00 → R$ 0,00
                  </small>
                </div>
              </div>

              <div class="col-12 col-md-4 mb-3">
                <div class="p-4 border rounded text-center h-100 align-content-center">
                  <h5 class="mb-3">
                    <i class="pi pi-calculator"></i>
                    Média Diária
                  </h5>
                  <h3 class="text-info">
                    R$ 0,00
                  </h3>
                  <p class="text-muted mb-0">Gasto médio por dia</p>
                  <small class="text-muted"> 0 compras este mês </small>
                </div>
              </div>
            </div>

            <!-- 4. ANÁLISE DE GASTOS - Informações complementares -->
            <div class="row mb-4">
              <div class="col-12 col-md-12 col-lg-6 mb-3">
                <div class="p-4 border rounded h-100">
                  <h5 class="mb-4">
                    <i class="pi pi-chart-pie"></i>
                    Gastos por Categoria
                  </h5>
                  <div v-if="0 === 0" class="text-center text-muted">
                    <i class="pi pi-info-circle"></i>
                    Nenhum gasto este mês
                  </div>
                  <div v-else>
                    <div v-for="categoria in 0" :key="categoria + 1" class="mb-2">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="small">Categoria ##</span>
                        <span class="small fw-bold">R$ 0,00</span>
                      </div>
                      <ProgressBar :value="0" :showValue="false" style="height: 8px" />
                      <small class="text-muted">0% + {{ 1 }}%</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-12 col-lg-6 mb-3">
                <div class="py-4 px-5 border rounded h-100 align-content-center">
                  <h5 class="mb-3">
                    <i class="pi pi-chart-bar"></i>
                    Evolução dos Gastos
                  </h5>
                  <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[15rem]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-primary {
  color: #0d6efd !important;
}
.text-success {
  color: #198754 !important;
}
.text-info {
  color: #0dcaf0 !important;
}
.text-warning {
  color: #ffc107 !important;
}

/* Melhorias para mobile */
@media (max-width: 767.98px) {
  .card {
    margin-bottom: 1rem;
  }

  .p-4 {
    padding: 1rem !important;
  }

  .mb-4 {
    margin-bottom: 1.5rem !important;
  }

  h5 {
    font-size: 1.1rem;
  }

  h6 {
    font-size: 1rem;
  }

  .btn {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  /* Gráfico de barras responsivo */
  .d-flex.align-items-end {
    height: 150px !important;
  }

  /* Espaçamento entre elementos */
  .gap-2 {
    gap: 0.5rem !important;
  }
}

/* Melhorias para telas muito pequenas */
@media (max-width: 575.98px) {
  .p-2 {
    padding: 0.5rem !important;
  }

  h6 {
    font-size: 0.9rem;
  }

  small {
    font-size: 0.75rem;
  }
}
</style>
