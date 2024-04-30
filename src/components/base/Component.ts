export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
    }
    
    // Показать элемент
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // Скрыть элемент
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Установить текстовое содержимое
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }
    
    // Установить изображение с альтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}