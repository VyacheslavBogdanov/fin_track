import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import AppTabs from '../AppTabs.vue';
import AppTab from '../AppTab.vue';

const Harness = defineComponent({
	components: { AppTabs, AppTab },
	setup() {
		const active = ref<string>('overview');
		return { active };
	},
	template: `
		<AppTabs v-model="active">
			<AppTab id="overview" label="Обзор">overview-content</AppTab>
			<AppTab id="details" label="Детали">details-content</AppTab>
			<AppTab id="history" label="История">history-content</AppTab>
		</AppTabs>
	`,
});

describe('AppTabs', () => {
	it('рендерит tablist с правильными ARIA-атрибутами', async () => {
		const wrapper = mount(Harness);
		await nextTick();
		const tablist = wrapper.find('[role="tablist"]');
		expect(tablist.exists()).toBe(true);
		const tabs = wrapper.findAll('[role="tab"]');
		expect(tabs).toHaveLength(3);
		expect(tabs[0].attributes('aria-selected')).toBe('true');
		expect(tabs[1].attributes('aria-selected')).toBe('false');
	});

	it('рендерит только активный tabpanel', async () => {
		const wrapper = mount(Harness);
		await nextTick();
		const panels = wrapper.findAll('[role="tabpanel"]');
		expect(panels).toHaveLength(1);
		expect(panels[0].text()).toBe('overview-content');
	});

	it('click по табу переключает active', async () => {
		const wrapper = mount(Harness);
		await nextTick();
		const tabs = wrapper.findAll('[role="tab"]');
		await tabs[1].trigger('click');
		await nextTick();
		expect(tabs[1].attributes('aria-selected')).toBe('true');
		expect(wrapper.find('[role="tabpanel"]').text()).toBe('details-content');
	});

	it('ArrowRight циклит на следующий таб', async () => {
		const wrapper = mount(Harness, { attachTo: document.body });
		await nextTick();
		const tablist = wrapper.find('[role="tablist"]');
		await tablist.trigger('keydown', { key: 'ArrowRight' });
		await nextTick();
		expect(wrapper.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true');
		wrapper.unmount();
	});

	it('ArrowLeft с первого таба циклит на последний', async () => {
		const wrapper = mount(Harness, { attachTo: document.body });
		await nextTick();
		await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowLeft' });
		await nextTick();
		expect(wrapper.findAll('[role="tab"]')[2].attributes('aria-selected')).toBe('true');
		wrapper.unmount();
	});

	it('Home возвращает на первый, End — на последний', async () => {
		const wrapper = mount(Harness, { attachTo: document.body });
		await nextTick();
		const tabs = wrapper.findAll('[role="tab"]');
		await tabs[1].trigger('click');
		await nextTick();
		await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'End' });
		await nextTick();
		expect(wrapper.findAll('[role="tab"]')[2].attributes('aria-selected')).toBe('true');
		await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'Home' });
		await nextTick();
		expect(wrapper.findAll('[role="tab"]')[0].attributes('aria-selected')).toBe('true');
		wrapper.unmount();
	});

	it('AppTab без обёртки AppTabs кидает ошибку', () => {
		const Bad = defineComponent({
			components: { AppTab },
			render: () => h(AppTab, { id: 'x', label: 'X' }),
		});
		expect(() => mount(Bad)).toThrow(/<AppTabs>/);
	});
});
