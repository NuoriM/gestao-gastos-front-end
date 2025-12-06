<template>
  <Dialog
    v-bind="{ visible }"
    :header="idCategoria ? 'Editar Categoria' : 'Nova Categoria'"
    :style="{ width: '50rem', position: 'relative', overflow: 'hidden' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :draggable="false"
    :dismissableMask="true"
    @update:visible="$emit('visibleEmit', $event)"
    modal
    :focusOnShow="false"
  >
    <template #closebutton>
      <Button icon="pi pi-times" text severity="secondary" @click="cancelar" rounded></Button>
    </template>
    <OverlayCarregando :visible="isEnviando" />
    <Form
      ref="formCategoriaRef"
      v-slot="$form"
      :resolver="resolver"
      :initialValues="dadosCategoria"
      @submit="submitForm"
    >
      <div class="row mb-3">
        <div class="col-md-12">
          <FloatLabel variant="in" class="required">
            <Select
              name="idCalendario"
              :options="calendarios"
              optionLabel="descricao"
              optionValue="codigo"
              fluid
            />
            <label for="calendario-input">Calendário</label>
          </FloatLabel>

          <Message
            v-if="$form.idCalendario?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.idCalendario.error?.message }}
          </Message>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <FloatLabel variant="in" class="required">
            <InputText id="nome-categoria-input" name="nome" :fluid="true" variant="filled" />
            <label for="nome-categoria-input">Nome</label>
          </FloatLabel>

          <Message
            v-if="$form.nome?.invalid"
            class="mb-1 mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.nome.error?.message }}
          </Message>
        </div>
        <div class="col-md-6">
          <InputGroup>
            <InputGroupAddon> # </InputGroupAddon>
            <InputText
              id="corHex"
              name="corHex"
              :fluid="true"
              v-model="dadosCategoria.corHex"
              variant="filled"
            />
            <InputGroupAddon>
              <ColorPicker v-model="dadosCategoria.corHex" inputId="corHex" format="hex"
            /></InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div class="row">
        <div class="col-md">
          <FloatLabel variant="in" class="optional">
            <Textarea
              ref="descricaoRef"
              name="descricao"
              @input="handleDescricaoInput"
              :fluid="true"
              variant="filled"
              rows="4"
              :maxlength="descricaoMax"
            />
            <label for="descricao-input">Descrição</label>
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
          <Knob
            v-model="qtdCaracteres"
            :strokeWidth="30"
            :valueColor="knobColor"
            :size="20"
            :max="descricaoMax"
            readonly
            style="margin-top: -2rem; margin-left: 0.5rem; z-index: 1; position: relative"
          />
        </div>
      </div>
    </Form>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" @click="cancelar" variant="outlined" />
      <Button
        :label="props.idCategoria ? 'Atualizar' : 'Cadastrar'"
        icon="pi pi-check"
        @click="() => ($refs.formCategoriaRef as any)?.submit()"
        variant="success"
      />
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCalendarioStore } from '@/stores/calendario.store';
import { categoriaSchema } from '@/core/schemas/categoria/categoria.schema';
import { zodResolver } from '@primevue/forms/resolvers/zod';

const calendarioStore = useCalendarioStore()
const resolver = zodResolver(categoriaSchema)

const isEnviando = ref(false)

const dadosCategoria = ref({
  nome: '',
  descricao: '',
  corHex: 'ff0000',
  idCalendario: 0,
})

const descricaoMax = ref(280)
const qtdCaracteres = ref(0)

const props = defineProps<{
  visible: boolean
  idCategoria: number | null
  idCalendario: number
}>()

const emit = defineEmits<{
  visibleEmit: [value: boolean],
  atualizarCategoriaEmit: []
}>()

const calendarios = ref([])

const obterCalendarios = async () => {
  const response = await calendarioStore.listarCalendarios()
  calendarios.value = response.data
}

const obterCategoriaPorCodigo = async () => {
  const response = await calendarioStore.obterCategoriaPorCodigo(props.idCalendario, props.idCategoria!)
  dadosCategoria.value = response.data
}

watch(
  () => props.visible,
  (newVal: boolean) => {
    if (newVal) {
      obterCalendarios()
      if (props.idCategoria !== null) {
        obterCategoriaPorCodigo()
      }
    }
  },
)

const submitForm = async (event: any) => {
  isEnviando.value = true
  if (event.valid) {
    // const formData = event.values
    // if (props.idCategoria) {
    //   formData.idCategoria = props.idCategoria
    // }
  }
}

const knobColor = computed(() => {
  if (qtdCaracteres.value > descricaoMax.value - 50 && qtdCaracteres.value <= descricaoMax.value - 10) return 'orange'
  if (qtdCaracteres.value > descricaoMax.value - 10) return 'red'
  return 'MediumTurquoise'
})

const handleDescricaoInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  if (descricaoMax.value - target.value.length < 0) return
  qtdCaracteres.value = target.value.length
}

const cancelar = () => {
  qtdCaracteres.value = 0
  emit('visibleEmit', false)
}

</script>
<!-- <script lang="ts">
import { categoriaSchema } from '@/core/schemas/categoria/categoria.schema'
// import { useCategoriaStore } from '@/stores/categoria.store'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useCalendarioStore } from '@/stores/calendario.store'

export default {
  setup() {
    const calendarioStore = useCalendarioStore()
    // const categoriaStore = useCategoriaStore()

    return { calendarioStore }
  },
  data() {
    return {
      descricaoMax: 280,
      qtdCaracteres: 0,
      calendarios: [],
      isEnviando: false,
      resolver: zodResolver(categoriaSchema),
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    categoria: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async submitForm(event: any) {
      this.isEnviando = true

      if (event.valid) {
        const formData = event.values
        if (this.categoria.idCategoria) {
          formData.idCategoria = this.categoria.idCategoria
        }
        formData.corHex = this.categoria.corHex

        try {
          // await this.categoria.idCategoria
          //   ? await this.calendarioStore.editarCategoria(, formData)
          //   : await this.calendarioStore.cadastrarCategoria(, formData)

          this.$emit('visibleEmit', false)
          this.$emit('atualizarCategoriaEmit')
        } catch (error) {
          console.error('Erro ao cadastrar/alterar categoria:', error)
        }

        this.isEnviando = false
      }

      this.isEnviando = false
    },
    cancelar() {
      this.qtdCaracteres = 0
      this.$emit('visibleEmit', false)
    },

    handleDescricaoInput(event: Event) {
      const target = event.target as HTMLTextAreaElement
      if (this.descricaoMax - target.value.length < 0) return
      this.qtdCaracteres = target.value.length
    },

    async obterCalendarios() {
      try {
        const response = await this.calendarioStore.listarCalendarios()
        this.calendarios = response.data
      } catch (error) {
        console.error('Erro ao obter calendários:', error)
      }
    },
  },
  emits: ['visibleEmit', 'atualizarCategoriaEmit'],
  watch: {
    visible(newVal) {
      if (newVal) {
        this.obterCalendarios()
      }
    },
  },
  computed: {
    knobColor() {
      if (
        this.qtdCaracteres > this.descricaoMax - 50 &&
        this.qtdCaracteres <= this.descricaoMax - 10
      )
        return 'orange'
      if (this.qtdCaracteres > this.descricaoMax - 10) return 'red'
      return 'MediumTurquoise' // ou 'green' ou cor padrão
    },
  },
}
</script> -->
