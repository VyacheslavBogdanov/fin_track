<script setup lang="ts">
// [Собес: CSS → CSS Grid grid-template-areas + responsive перестроение]
// [Собес: CSS → semantic HTML (header/aside/main/footer)]

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AppHeader } from '@/widgets/Header';
import { AppSidebar } from '@/widgets/Sidebar';

const route = useRoute();
const isPublic = computed(() => Boolean(route.meta.requiresGuest));
const isSidebarOpen = ref(false);
</script>

<template>
	<div :class="['default-layout', isPublic ? 'default-layout--public' : 'default-layout--app']">
		<template v-if="!isPublic">
			<AppHeader
				class="default-layout__header"
				@toggle-sidebar="isSidebarOpen = !isSidebarOpen"
			/>
			<AppSidebar v-model:open="isSidebarOpen" class="default-layout__sidebar" />
		</template>
		<main class="default-layout__main">
			<slot />
		</main>
		<footer v-if="!isPublic" class="default-layout__footer">
			© 2026 FinTrack — портфельный проект
		</footer>
	</div>
</template>

<style lang="scss" scoped>
@use '@/app/styles/breakpoints' as *;

.default-layout {
	min-height: 100vh;
	background: var(--bg-primary);

	&--public {
		display: grid;
		grid-template: 'main' 1fr / 1fr;
	}

	&--app {
		display: grid;
		grid-template-areas: 'header' 'main' 'footer';
		grid-template-rows: auto 1fr auto;

		@include desktop-up {
			grid-template-areas:
				'header header'
				'sidebar main'
				'sidebar footer';
			grid-template-columns: 280px 1fr;
		}
	}

	&__header {
		grid-area: header;
	}

	&__sidebar {
		grid-area: sidebar;
	}

	&__main {
		grid-area: main;
		padding: var(--space-4);

		@include tablet-up {
			padding: var(--space-6);
		}
	}

	&__footer {
		grid-area: footer;
		padding: var(--space-4);
		border-top: 1px solid var(--border-color);
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		text-align: center;
	}
}
</style>
