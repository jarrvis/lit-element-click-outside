# lit-element-click-outside

## What is it?

`lit-element-click-outside` is a  `@clickOutside` decorator that allows you to call component method as the user clicks outside of the host component. Obviously it's very easy. Why then import it as external library? First, because it does not make sense write this boilerplate code in each project. Second, because decorator solution is elegant and convenient.

## Installing

In your Lit Element project, add `lit-element-click-outside` to your package.json:

```
npm i lit-element-click-outside
```

## How to use it?

It's very simple: you just need to anotate your method with `@clickOutside` and it will be called when user clicks outside of component area.

```javascript
import { LitElement, html, property, customElement } from 'lit-element';
import { clickOutside } from 'lit-element-click-outside';

@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
  @property() name = 'World';

  @clickOutside()
  someMethod() {
    console.log(
      "someMethod was called because user just clicked outside of SimpleGreeting"
    );
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
```

## Options

You may pass some optional parameters to decorator (or util function):

```javascript
@clickOutside({
    exclude: 'button .exclude-click-outside-class'
})
```

| Property name   | Type   | Default   | Description                                                                                                                                    |
| --------------- | ------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `triggerEvents` | string | `'click'` | A comma-separated list of events to cause the trigger                                                                                          |
| `exclude`       | string |           | A comma-separated string of DOM element queries to exclude when clicking outside of the element. Example: `[exclude]="'button .btn-primary'"`. |
