<img alt="NomJS" src="http://merri.net/github-nomjs_720x225.png" height="225" width="720" />

[![Version](https://img.shields.io/npm/v/@merri/nomjs.svg)](https://www.npmjs.com/package/@merri/nomjs)
[![gzip size](https://img.badgesize.io/https://unpkg.com/@merri/nomjs@latest/lib/umd/nom.js?compression=gzip)](https://unpkg.com/@merri/nomjs@latest/lib/umd/nom.js)
[![Build Status](https://travis-ci.org/Merri/nomjs.svg)](https://travis-ci.org/Merri/nomjs)

Nom.js is a DOM library that works with JSX syntax (not compatible with React components).

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
        <div style={() => ({ backgroundColor: color, padding: '6px' })}>
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

## Get it

```
npm install --save @merri/nomjs
yarn add @merri/nomjs
```

Please note this lib is still in alpha so there will probably be large changes to how things work.
