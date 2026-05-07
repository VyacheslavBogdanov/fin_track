<template>
	<div class="app-card">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
@use '@/app/styles/breakpoints' as *;

.app-card {
	background: var(--bg-card);
	border: 1px solid var(--border-color);
	border-radius: var(--radius-md);
	box-shadow: var(--shadow-sm);
	padding: var(--space-4);

	@include tablet-up {
		padding: var(--space-6);
	}
}
</style>
