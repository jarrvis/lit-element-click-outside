import { LitElement } from "lit-element";

declare interface ClickOutsideOptions {
  triggerEvents?: string;
  exclude?: string;
}

const ClickOutsideOptionsDefaults: ClickOutsideOptions = {
  triggerEvents: "click",
  exclude: ""
};

  
/**
 * Call this function as soon as the click outside of annotated method's host is done.
 * @example
```
@clickOutside()
callback() {
  // this will run when click outside of element (host component) is done.
}
```
 */
export function ClickOutside(
  opt: ClickOutsideOptions = ClickOutsideOptionsDefaults): any {
    return (proto: LitElement, methodName: string): any  => {

        const { connectedCallback, disconnectedCallback } = proto;
        proto.connectedCallback = function() {
            const method = this[methodName];
            registerClickOutside(proto, this, method, opt);
            return connectedCallback && connectedCallback.call(proto);
        }
        
        proto.disconnectedCallback = function() {
          const method = this[methodName];
          removeClickOutside(proto, this, method, opt);
          return disconnectedCallback && disconnectedCallback.call(this);
        };
  }
}

/**
 * Register callback function for HTMLElement to be executed when user clicks outside of element.
 * @example
```
<span 
    ref={spanEl => registerClickOutside(this, spanEl, () => this.test())}>
      Hello, World!
</span>;
```
 */
export function registerClickOutside(
  component: any,
  element: HTMLElement,
  callback: () => void,
  opt: ClickOutsideOptions = ClickOutsideOptionsDefaults
): void {
  const excludedNodes = getExcludedNodes(opt);
  getTriggerEvents(opt).forEach(triggerEvent => {
    window.addEventListener(
      triggerEvent,
      (e: Event) => {
        initClickOutside(e, component, element, callback, excludedNodes);
      },
      false
    );
  });
}

/**
 * Remove click outside callback function for HTMLElement.
 */
export function removeClickOutside(
  component: any,
  element: HTMLElement,
  callback: () => void,
  opt: ClickOutsideOptions = ClickOutsideOptionsDefaults
): void {
  getTriggerEvents(opt).forEach(triggerEvent => {
    window.removeEventListener(
      triggerEvent,
      (e: Event) => {
        initClickOutside(e, component, element, callback);
      },
      false
    );
  });
}

function initClickOutside(
  event: Event,
  component: any,
  element: HTMLElement,
  callback: () => void,
  excludedNodes?: Array<HTMLElement>
) {
  const target = event.target as HTMLElement;
  if (!element.contains(target) && !isExcluded(target, excludedNodes)) {
    callback.call(component);
  }
}

function getTriggerEvents(opt: ClickOutsideOptions): Array<string> {
  if (opt.triggerEvents) {
    return opt.triggerEvents.split(",").map(e => e.trim());
  }
  return ["click"];
}

function getExcludedNodes(opt: ClickOutsideOptions): Array<HTMLElement> {
  if (opt.exclude) {
    try {
      return Array.from(document.querySelectorAll(opt.exclude))
    } catch (err) {
      console.warn(
        `@clickOutside: Exclude: '${
          opt.exclude
        }' will not be evaluated. Check your exclude selector syntax.`,
        err
      );
    }
  }
  return;
}

function isExcluded(
  target: HTMLElement,
  excudedNodes?: Array<HTMLElement>
): boolean {
  if (target && excudedNodes) {
    for (let excludedNode of excudedNodes) {
      if (excludedNode.contains(target)) {
        return true;
      }
    }
  }

  return false;
}