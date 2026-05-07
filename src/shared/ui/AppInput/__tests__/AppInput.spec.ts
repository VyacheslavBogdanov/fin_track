import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import AppInput from '../AppInput.vue';

describe('AppInput', () => {
	it('двусторонняя связь через v-model: input → model', async () => {
		const wrapper = mount(AppInput, { props: { modelValue: '' } });
		await wrapper.find('input').setValue('hello');
		expect(wrapper.emitted('update:modelValue')).toEqual([['hello']]);
	});

	it('двусторонняя связь: model → input', async () => {
		const wrapper = mount(AppInput, { props: { modelValue: 'initial' } });
		expect((wrapper.find('input').element as HTMLInputElement).value).toBe('initial');
		await wrapper.setProps({ modelValue: 'changed' });
		await nextTick();
		expect((wrapper.find('input').element as HTMLInputElement).value).toBe('changed');
	});

	it('label связан с input через for/id', () => {
		const wrapper = mount(AppInput, { props: { label: 'Email' } });
		const labelFor = wrapper.find('label').attributes('for');
		const inputId = wrapper.find('input').attributes('id');
		expect(labelFor).toBeTruthy();
		expect(labelFor).toBe(inputId);
	});

	it('error: рендерит сообщение, ставит aria-invalid, aria-describedby ссылается на error', () => {
		const wrapper = mount(AppInput, { props: { error: 'Невалидный email' } });
		expect(wrapper.find('.app-input__error').text()).toBe('Невалидный email');
		expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
		const errorEl = wrapper.find('.app-input__error');
		expect(wrapper.find('input').attributes('aria-describedby')).toBe(errorEl.attributes('id'));
	});

	it('hint показывается, когда error пустой', () => {
		const wrapper = mount(AppInput, { props: { hint: 'Используйте корпоративный email' } });
		expect(wrapper.find('.app-input__hint').exists()).toBe(true);
		expect(wrapper.find('.app-input__error').exists()).toBe(false);
	});

	it('передаёт type на <input>', () => {
		const wrapper = mount(AppInput, { props: { type: 'password' } });
		expect(wrapper.find('input').attributes('type')).toBe('password');
	});
});
