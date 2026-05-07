<script setup lang="ts">
interface Props {
	size?: 'sm' | 'md' | 'lg';
}
withDefaults(defineProps<Props>(), { size: 'md' });
</script>

<template>
	<span class="app-spinner" :class="`app-spinner--${size}`" role="status" aria-label="Загрузка">
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-dasharray="40 60"
			/>
		</svg>
	</span>
</template>

<style lang="scss" scoped>
.app-spinner {
	display: inline-flex;
	color: currentColor;

	svg {
		width: 100%;
		height: 100%;
		animation: app-spinner-rotate 0.8s linear infinite;
	}

	&--sm {
		width: 16px;
		height: 16px;
	}

	&--md {
		width: 24px;
		height: 24px;
	}

	&--lg {
		width: 32px;
		height: 32px;
	}
}

@keyframes app-spinner-rotate {
	to {
		transform: rotate(360deg);
	}
}

@media (prefers-reduced-motion: reduce) {
	.app-spinner svg {
		animation: none;
	}
}
</style>
