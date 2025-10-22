<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
                    <i
                      class="pi pi-shopping-cart text-success d-block mb-1"
                      style="font-size: 1.5rem"
                    ></i>
                    <small class="text-muted d-block">Compras</small>
                    <h6 class="mb-0 text-success">0</h6>
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
              </div>
            </div>
            <!-- Cards de Resumo -->
            <div class="row mb-4 d-none d-md-flex">
              <div class="col-md-3 mb-3">
                <div class="text-center p-3 border rounded">
                  <i class="pi pi-wallet text-primary" style="font-size: 2.5rem"></i>
                  <h4 class="mt-2 mb-1 text-primary">R$ 0,00</h4>
                  <p class="text-muted mb-0">Total Gasto</p>
                </div>
              </div>

              <div class="col-md-3 mb-3">
                <div class="text-center p-3 border rounded">
                  <i class="pi pi-shopping-cart text-success" style="font-size: 2.5rem"></i>
                  <h4 class="mt-2 mb-1 text-success">0</h4>
                  <p class="text-muted mb-0">Total de Compras</p>
                </div>
              </div>

              <div class="col-md-3 mb-3">
                <div class="text-center p-3 border rounded">
                  <i class="pi pi-calendar text-info" style="font-size: 2.5rem"></i>
                  <h4 class="mt-2 mb-1 text-info">R$ 0,00</h4>
                  <p class="text-muted mb-0">Gasto Este Mês</p>
                </div>
              </div>

              <div class="col-md-3 mb-3">
                <div class="text-center p-3 border rounded">
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
            </div>

            <!-- Gráficos e Análises -->
            <div class="row mb-4">
              <div class="col-12 col-md-6 mb-3">
                <div class="p-4 border rounded">
                  <h5 class="mb-3">
                    <i class="pi pi-chart-pie me-2"></i>
                    Gastos por Categoria
                  </h5>
                  <div v-if="0 === 0" class="text-center text-muted">
                    <i class="pi pi-info-circle me-2"></i>
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
            </div>

            <!-- Análise de Economia -->
            <div class="row mb-4">
              <div class="col-12 col-md-4 mb-3">
                <div class="p-4 border rounded text-center">
                  <h5 class="mb-3">
                    <i class="pi pi-target me-2"></i>
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
                <div class="p-4 border rounded text-center">
                  <h5 class="mb-3">
                    <i class="pi pi-arrow-up me-2"></i>
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
                <div class="p-4 border rounded text-center">
                  <h5 class="mb-3">
                    <i class="pi pi-calculator me-2"></i>
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

            <!-- Seção de Análise Financeira Avançada -->
            <div class="row mb-4">
              <div class="col-12 mb-3">
                <div class="py-4 px-5 border rounded">
                  <h5 class="mb-3">
                    <i class="pi pi-chart-pie me-2"></i>
                    Análise Detalhada dos Gastos
                  </h5>
                  <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[15rem]" />



                </div>
              </div>
            </div>

            <!-- Cards de Ações e Resumo -->
            <div class="row">
              <div class="col-12 col-md-6 mb-3">
                <div class="p-4 border rounded">
                  <h5 class="mb-3">
                    <i class="pi pi-calendar-plus me-2"></i>
                    Ações Rápidas
                  </h5>
                  <div class="d-grid gap-2">
                    <Button
                      label="Nova Compra"
                      icon="pi pi-plus"
                      variant="success"
                      @click="$router.push('/calendario')"
                      class="mb-2"
                    />
                    <Button
                      label="Gerenciar Categorias"
                      icon="pi pi-tag"
                      variant="outlined"
                      @click="$router.push('/categorias')"
                      class="mb-2"
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

              <div class="col-12 col-md-6 mb-3">
                <div class="p-4 border rounded">
                  <h5 class="mb-3">
                    <i class="pi pi-chart-pie me-2"></i>
                    Resumo do Mês
                  </h5>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Compras realizadas:</span>
                    <strong>0</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Valor gasto:</span>
                    <strong class="text-success">R$ 0,00</strong>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span>Média por compra:</span>
                    <strong>R$ 0,00</strong>
                  </div>
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
  .container {
    padding-left: 10px;
    padding-right: 10px;
  }

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
  .col-6 {
    padding-left: 2px;
    padding-right: 2px;
  }

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
