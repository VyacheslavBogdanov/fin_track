import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import AppModal from '../AppModal.vue';

describe('AppModal', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('при modelValue=false диалог отсутствует в DOM', () => {
		mount(AppModal, { props: { modelValue: false }, attachTo: document.body });
		expect(document.querySelector('[role="dialog"]')).toBeNull();
	});

	it('при modelValue=true диалог появляется в body (Teleport)', async () => {
		const wrapper = mount(AppModal, {
			props: { modelValue: true, title: 'Подтверждение' },
			slots: { default: 'Точно удалить?' },
			attachTo: document.body,
		});
		await nextTick();
		const dialog = document.querySelector('[role="dialog"]');
		expect(dialog).not.toBeNull();
		expect(dialog?.getAttribute('aria-modal')).toBe('true');
		expect(dialog?.getAttribute('aria-labelledby')).toBeTruthy();
		expect(document.body.textContent).toContain('Подтверждение');
		expect(document.body.textContent).toContain('Точно удалить?');
		wrapper.unmount();
	});

	it('клик по backdrop эмитит update:modelValue=false', async () => {
		const wrapper = mount(AppModal, {
			props: { modelValue: true },
			attachTo: document.body,
		});
		await nextTick();
		const backdrop = document.querySelector('.app-modal__backdrop') as HTMLElement;
		expect(backdrop).not.toBeNull();
		// native click: event.target === backdrop, что даёт срабатывание @click.self
		backdrop.click();
		await nextTick();
		expect(wrapper.emitted('update:modelValue')?.some((e) => e[0] === false)).toBe(true);
		wrapper.unmount();
	});

	it('ESC закрывает модалку', async () => {
		const wrapper = mount(AppModal, {
			props: { modelValue: true },
			attachTo: document.body,
		});
		await nextTick();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		await nextTick();
		expect(wrapper.emitted('update:modelValue')?.some((e) => e[0] === false)).toBe(true);
		wrapper.unmount();
	});
});
