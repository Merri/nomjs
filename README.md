<img alt="NomJS" src="http://merri.net/github-nomjs_720x225.png" height="225" width="720" />

Nom.js is a DOM library that supports React JSX syntax.

## Project targets:

- Small size
- Be performant
- Have compact easy-to-understand syntax
- Embrace native DOM: synchronize updates without Virtual DOM

## Methods

Nom exposes three methods: `h`, `fragment` and `mount`.

Short explanations:

- `h` is like `React.createElement`, but returns native DOM nodes.
- `fragment` accepts DOM nodes, strings etc. and returns a fragment.
- `mount` takes DOM nodes or a fragment and mounts them for constant updates.

This allows to do small browser-only apps easily:

```jsx
/** @jsx h */
import { h, mount } from '@merri/nomjs'

const colors = ['blue', 'red', 'gray', 'orange']

// this short example does evil mutation of `color` variable
function Component({ color }) {
    return (
        <div style={() => ({ backgroundColor: color })}>
            <p>Hello World!</p>
            <button onclick={() => color = colors[(colors.indexOf(color) + 1) % colors.length]}>
                Change color
            </button>
        </div>
    )
}

document.body.appendChild(
    mount(<Component color="black" />)
)
```