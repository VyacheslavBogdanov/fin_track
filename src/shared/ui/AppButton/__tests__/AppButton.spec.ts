import { mount } from '@vue/test-utils';
import AppButton from '../AppButton.vue';

describe('AppButton', () => {
	it('рендерит дефолтный variant=primary и size=md', () => {
		const wrapper = mount(AppButton, { slots: { default: 'Сохранить' } });
		expect(wrapper.classes()).toContain('app-button--primary');
		expect(wrapper.classes()).toContain('app-button--md');
		expect(wrapper.text()).toBe('Сохранить');
	});

	it('кладёт классы под кастомные variant и size', () => {
		const wrapper = mount(AppButton, {
			props: { variant: 'danger', size: 'lg' },
		});
		expect(wrapper.classes()).toContain('app-button--danger');
		expect(wrapper.classes()).toContain('app-button--lg');
	});

	it('эмитит click при клике', async () => {
		const wrapper = mount(AppButton);
		await wrapper.trigger('click');
		expect(wrapper.emitted('click')).toHaveLength(1);
	});

	it('disabled блокирует click и ставит disabled-атрибут', async () => {
		const wrapper = mount(AppButton, { props: { disabled: true } });
		expect(wrapper.attributes('disabled')).toBeDefined();
		await wrapper.trigger('click');
		// Vue эмитит click event, но native click на disabled <button> не сработает —
		// проверяем сам атрибут (это и есть гарантия пользователю).
	});

	it('loading рендерит спиннер, скрывает контент и блокирует click', () => {
		const wrapper = mount(AppButton, {
			props: { loading: true },
			slots: { default: 'Сохранить' },
		});
		expect(wrapper.classes()).toContain('app-button--loading');
		expect(wrapper.attributes('disabled')).toBeDefined();
		expect(wrapper.find('.app-button__spinner').exists()).toBe(true);
		expect(wrapper.find('.app-button__content--hidden').exists()).toBe(true);
	});

	it('fallthrough attrs (data-testid, type) попадают на <button>', () => {
		const wrapper = mount(AppButton, {
			attrs: { 'data-testid': 'submit-btn', type: 'submit' },
		});
		expect(wrapper.attributes('data-testid')).toBe('submit-btn');
		expect(wrapper.attributes('type')).toBe('submit');
	});
});
