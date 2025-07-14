<script lang="ts">
export default {
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
	}
}
</script>
<template>
  <div class="overlay" v-if="visible">
    <ProgressSpinner
      style="width: 50px; height: 50px"
      strokeWidth="8"
      fill="transparent"
      animationDuration=".5s"
      aria-label="Custom ProgressSpinner"
    />
	<p>Processando, aguarde...</p>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(1.5px);
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 9999;
}
</style>
