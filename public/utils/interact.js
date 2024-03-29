export class Interact {
  /** @param {HTMLElement} element */
  constructor(element) {
    this.element = element;
    /** @type {any[]} */
    this.callbacks = [];
  }
  /**
   * @typedef {object} MouseCallbacks
   * @property {(ev:MouseEvent)=>void} [mousedownCallback]
   * @property {(ev:MouseEvent)=>void} [mousemoveCallback]
   * @property {(ev:MouseEvent)=>void} [mouseupCallback]
   * @property {(ev:MouseEvent)=>void} [mouseoutCallback]
   * @param {MouseCallbacks} param0
   */
  setMouseEvent({
    mousedownCallback = function() {},
    mousemoveCallback = function() {},
    mouseupCallback = function() {},
    mouseoutCallback = function() {}
  }) {
    /** @type {(ev:MouseEvent)=>void} */
    const mousedown = evt => {
      evt.preventDefault();
      mousedownCallback(evt);
    };
    // 踩坑：对move和up进行preventDefault会影响input元素交互
    /** @type {(ev:MouseEvent)=>void} */
    const mousemove = evt => {
      // 踩坑：新版浏览器按下鼠标即使不移动也会定期触发mousemove事件
      if (!evt.movementX && !evt.movementY) return;
      mousemoveCallback(evt);
    };
    /** @type {(ev:MouseEvent)=>void} */
    const mouseup = evt => {
      mouseupCallback(evt);
    };
    /** @type {(ev:MouseEvent)=>void} */
    const mouseout = evt => {
      mouseoutCallback(evt);
    };
    this.element.addEventListener('mousedown', mousedown);
    self.addEventListener('mousemove', mousemove);
    self.addEventListener('mouseup', mouseup);
    this.element.addEventListener('mouseout', mouseout);
    return this.callbacks.push({ mousedown, mousemove, mouseup, mouseout });
  }
  /** @param {number} id */
  clearMouseEvent(id) {
    const { mousedown, mousemove, mouseup, mouseout } = this.callbacks[id - 1];
    this.element.removeEventListener('mousedown', mousedown);
    self.removeEventListener('mousemove', mousemove);
    self.removeEventListener('mouseup', mouseup);
    this.element.removeEventListener('mouseout', mouseout);
    this.callbacks[id - 1] = null;
  }
  /**
   * @typedef {object} TouchCallbacks
   * @property {(ev:TouchEvent)=>void} [touchstartCallback]
   * @property {(ev:TouchEvent)=>void} [touchmoveCallback]
   * @property {(ev:TouchEvent)=>void} [touchendCallback]
   * @property {(ev:TouchEvent)=>void} [touchcancelCallback]
   * @param {TouchCallbacks} param0
   */
  setTouchEvent({
    touchstartCallback = function() {},
    touchmoveCallback = function() {},
    touchendCallback = function() {},
    touchcancelCallback = function() {}
  }) {
    const passive = { passive: false }; // warning
    /** @type {(ev:TouchEvent)=>void} */
    const touchstart = evt => {
      evt.preventDefault();
      touchstartCallback(evt);
    };
    /** @type {(ev:TouchEvent)=>void} */
    const touchmove = evt => {
      evt.preventDefault();
      touchmoveCallback(evt);
    };
    /** @type {(ev:TouchEvent)=>void} */
    const touchend = evt => {
      evt.preventDefault();
      touchendCallback(evt);
    };
    /** @type {(ev:TouchEvent)=>void} */
    const touchcancel = evt => {
      evt.preventDefault();
      touchcancelCallback(evt);
    };
    this.element.addEventListener('touchstart', touchstart, passive);
    this.element.addEventListener('touchmove', touchmove, passive);
    this.element.addEventListener('touchend', touchend);
    this.element.addEventListener('touchcancel', touchcancel);
    return this.callbacks.push({ touchstart, touchmove, touchend, touchcancel });
  }
  /** @param {number} id */
  clearTouchEvent(id) {
    const { touchstart, touchmove, touchend, touchcancel } = this.callbacks[id - 1];
    this.element.removeEventListener('touchstart', touchstart);
    this.element.removeEventListener('touchmove', touchmove);
    this.element.removeEventListener('touchend', touchend);
    this.element.removeEventListener('touchcancel', touchcancel);
    this.callbacks[id - 1] = null;
  }
  /**
   * @typedef {object} KeyboardCallbacks
   * @property {(ev:KeyboardEvent)=>void} [keydownCallback]
   * @property {(ev:KeyboardEvent)=>void} [keyupCallback]
   * @param {KeyboardCallbacks} param0
   */
  setKeyboardEvent({
    keydownCallback = function() {},
    keyupCallback = function() {}
  }) {
    const isInput = () => {
      const elem = document.activeElement;
      if (elem instanceof HTMLTextAreaElement) return true;
      if (elem instanceof HTMLInputElement) {
        const type = elem.getAttribute('type') || '';
        if (/^(button|checkbox|image|radio|reset|submit)$/.test(type)) return false;
        return true;
      }
      if (elem.contentEditable === 'true') return true;
      return false;
    };
    /** @type {(ev:KeyboardEvent)=>void} */
    const keydown = evt => {
      if (isInput()) return;
      evt.preventDefault();
      keydownCallback(evt);
    };
    /** @type {(ev:KeyboardEvent)=>void} */
    const keyup = evt => {
      if (isInput()) return;
      evt.preventDefault();
      keyupCallback(evt);
    };
    self.addEventListener('keydown', keydown);
    self.addEventListener('keyup', keyup);
    return this.callbacks.push({ keydown, keyup });
  }
  /** @param {number} id */
  clearKeyboardEvent(id) {
    const { keydown, keyup } = this.callbacks[id - 1];
    self.removeEventListener('keydown', keydown);
    self.removeEventListener('keyup', keyup);
    this.callbacks[id - 1] = null;
  }
}
export class InteractProxy {
  /** @param {HTMLElement} element */
  constructor(element) {
    this.interact = new Interact(element);
    this.mouseEvent = null;
    this.touchEvent = null;
    this.keyboardEvent = null;
    this.mouseEventId = 0;
    this.touchEventId = 0;
    this.keyboardEventId = 0;
  }
  /** @param {MouseCallbacks} callbacks */
  setMouseEvent(callbacks) {
    this.mouseEvent = callbacks;
  }
  /** @param {TouchCallbacks} callbacks */
  setTouchEvent(callbacks) {
    this.touchEvent = callbacks;
  }
  /** @param {KeyboardCallbacks} callbacks */
  setKeyboardEvent(callbacks) {
    this.keyboardEvent = callbacks;
  }
  activate() {
    if (this.mouseEvent) this.mouseEventId = this.interact.setMouseEvent(this.mouseEvent);
    if (this.touchEvent) this.touchEventId = this.interact.setTouchEvent(this.touchEvent);
    if (this.keyboardEvent) this.keyboardEventId = this.interact.setKeyboardEvent(this.keyboardEvent);
  }
  deactive() {
    if (this.mouseEventId) this.interact.clearMouseEvent(this.mouseEventId);
    if (this.touchEventId) this.interact.clearTouchEvent(this.touchEventId);
    if (this.keyboardEventId) this.interact.clearKeyboardEvent(this.keyboardEventId);
  }
}
