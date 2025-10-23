<template>
  <Dialog
    v-bind="{ visible }"
    :draggable="false"
    modal
    header="Cadastrar Calendario"
    :style="{ width: '50rem', position: 'relative', overflow: 'hidden' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :focusOnShow="false"
  >
    <template #closebutton>
      <Button
        icon="pi pi-times"
        text
        severity="secondary"
        @click="$emit('visibleEmit', false)"
        rounded
      ></Button>
    </template>
    <OverlayCarregando :visible="isEnviando" />
    <Form
      ref="formCalendarioRef"
      v-slot="$form"
      :resolver="resolver"
      :initialValues="dadosCalendario"
      @submit="cadastrarCalendario"
    >
      <div class="row mb-3">
        <div class="col-md-12">
          <FloatLabel variant="in" class="required">
            <InputText id="nome-calendario-input" name="nome" variant="filled" fluid />
            <label for="nome-calendario-input">Nome</label>
          </FloatLabel>
          <Message
            v-if="$form.nome?.invalid"
            class="mt-1"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.nome.error?.message }}
          </Message>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-12 d-flex align-items-center gap-2">
          <Checkbox binary inputId="criarCategoriaPadrao" name="criarCategoriaPadrao" />
          <label for="criarCategoriaPadrao">Criar Categorias Padrão</label>
        </div>
      </div>
      <div class="d-flex justify-content-end gap-2">
        <Button
          label="Cancelar"
          icon="pi pi-times"
          @click="$emit('visibleEmit', false)"
          variant="outlined"
        />
        <Button label="Criar" icon="pi pi-check" type="submit" />
      </div>
    </Form>
  </Dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { calendarioSchema } from '@/core/schemas/calendario/calendario.schema';
import { useCalendarioStore } from '@/stores/calendario.store';
import { nextTick } from 'vue';

const calendarioStore = useCalendarioStore()

defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  visibleEmit: [value: boolean],
  atualizarCalendariosEmit: []
}>()


const dadosCalendario = ref({
  nome: '',
  criarCategoriaPadrao: true,
})

const resolver = zodResolver(calendarioSchema)
const isEnviando = ref(false)

const cadastrarCalendario = async (event: any) => {
  isEnviando.value = true

  if (event.valid) {
    const response = await calendarioStore.cadastrar(event.values)
    if (response.status !== 200) {
      console.error('Erro ao cadastrar calendário:', response)
      return
    }
    await nextTick()
    emit('atualizarCalendariosEmit')
    emit('visibleEmit', false)
    isEnviando.value = false
  }
}

</script>
