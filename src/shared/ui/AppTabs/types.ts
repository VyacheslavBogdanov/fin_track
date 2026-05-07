import type { InjectionKey, Ref } from 'vue';

export interface TabEntry {
	id: string;
	label: string;
}

export interface TabsContext {
	activeId: Ref<string | undefined>;
	tablistId: string;
	register: (entry: TabEntry) => void;
	unregister: (id: string) => void;
}

export const TabsKey: InjectionKey<TabsContext> = Symbol('app-tabs');
