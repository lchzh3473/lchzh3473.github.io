'use strict';
const Utils = {
	/**@this {HTMLElement} */
	copyText() {
		const _this = this;
		const isHTMLElement = _this instanceof HTMLElement;
		const isHTMLInputElement = _this instanceof HTMLInputElement;
		const isHTMLTextAreaElement = _this instanceof HTMLTextAreaElement;
		let data = '';
		if (isHTMLInputElement || isHTMLTextAreaElement) {
			_this.focus();
			_this.select();
			data = _this.value;
		} else if (isHTMLElement) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(_this);
			selection.removeAllRanges();
			selection.addRange(range);
			data = _this.textContent;
		} else return Promise.reject();
		if (navigator.clipboard) return navigator.clipboard.writeText(data);
		return Promise[document.execCommand('copy') ? 'resolve' : 'reject']();
	},
	/**@this {HTMLElement} */
	setText(str = '') {
		const _this = this;
		const isHTMLElement = _this instanceof HTMLElement;
		const isHTMLInputElement = _this instanceof HTMLInputElement;
		const isHTMLTextAreaElement = _this instanceof HTMLTextAreaElement;
		if (isHTMLInputElement || isHTMLTextAreaElement)(_this.value) = str;
		else if (isHTMLElement)(_this.textContent) = str;
		else return Promise.reject();
		return Promise.resolve();
	}
}