<template>
	<div class="app">
		<RouterView />
	</div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<style lang="scss" scoped>
.app {
	min-height: 100vh;
	background: var(--bg-primary);
}
</style>
