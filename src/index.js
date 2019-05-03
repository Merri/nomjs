import htmlToDom from './htmlToDom.json'

// typeof is fastest way to check if a function but older IEs don't support it for that and Chrome had a bug
const isFunction = (
    typeof function() {} === 'function' && typeof /./ !== 'function'
        ? func => typeof func === 'function'
        : func => Object.prototype.toString.call(func) === '[object Function]'
)

function addNode(parent, node) {
    if (isFunction(node)) node = node.call(parent)
    if (node instanceof Node) parent.appendChild(node)
    else if (typeof node === 'string') parent.appendChild(document.createTextNode(node))
    else if (Array.isArray(node)) parent.appendChild(fragment(node))
    else if (node != null && node !== false && node !== true) parent.appendChild(document.createTextNode(String(node)))
}

// applies properties to object or DOM node, adds render method to elements and returns the object
function updateProps(obj, props) {
    // we need to have an object of some sort
    if (obj == null) return obj
    // see if it is a DOM element without a render method
    if (obj instanceof Node && obj.nodeType !== 11 && !obj.render) {
        Object.defineProperty(obj, 'render', {
            value: function() {
                updateProps(obj, props)
                // call render of all the children
                let child = obj.firstChild
                while (child) {
                    if (isFunction(child.render)) child.render()
                    child = child.nextSibling
                }
            }
        })
    }
    const nodesToRemove = []
    // apply each property
    for (let prop in props) {
        if (!props.hasOwnProperty(prop)) continue
        const objProp = htmlToDom[prop] || prop
        let value = (
            prop !== 'children' && prop.slice(0, 2) !== 'on' && isFunction(props[prop])
                ? props[prop].call(obj, obj[objProp])
                : props[prop]
        )
        // special case for dealing with children
        if (prop === 'children' && obj.childNodes) {
            let node = true
            let nodeIndex = 0
            let ref
            if (typeof value === 'function') {
                ref = value
                value = value.call(obj)
                if (value == null || value === true || value === false) {
                    while (obj.firstChild) {
                        obj.removeChild(obj.firstChild)
                    }
                }
            }
            // shallow flatten to a one dimensional array, eg. [[a], [b, [c]]] -> [a, b, [c]]
            const nodes = Array.isArray(value) ? Array.prototype.concat.apply([], value) : [value]
            // the following will reorganize nodes and update text nodes in order
            let existingNode = obj.firstChild
            while (existingNode) {
                // do we need to figure out a new node or string to work with?
                if (node === true) {
                    if (nodeIndex < nodes.length) while (
                        (node = nodes[nodeIndex++]) &&
                        nodeIndex < nodes.length &&
                        (node == null || node === true || node === false)
                    );
                    else node = null
                }
                if (node != null) {
                    ref = node.$ref || null
                    if (isFunction(node)) {
                        ref = node
                        node = node.call(obj)
                        // undefined and null are ignored
                        if (node == null || node === true || node === false) {
                            ref = null
                            // request next node/string
                            node = true
                            continue
                        }
                    }
                    if (Array.isArray(node)) {
                        nodes.splice(nodeIndex, 0, ...node)
                        // request next node/string
                        node = true
                        continue
                    } else if (node instanceof Node && node.nodeType === 11) {
                        // diffing forces us to add fragment's children to our nodes list manually
                        node.normalize()
                        if (ref != null) {
                            let childNode = node.firstChild
                            while (childNode) {
                                childNode.$ref = ref
                                childNode = childNode.nextSibling
                            }
                        }
                        nodes.splice(nodeIndex, 0, ...Array.prototype.slice.call(node.childNodes, 0))
                        // request next node/string
                        node = true
                        continue
                    } else if (!(node instanceof Node || typeof node === 'string')) {
                        node = String(node)
                    }
                    // see if a string needs to be updated or added
                    if (typeof node === 'string') {
                        if (existingNode.nodeType === 3) {
                            if (existingNode.nodeValue !== node) existingNode.nodeValue = node
                            existingNode = existingNode.nextSibling
                        } else if (existingNode.$ref !== ref) {
                            obj.insertBefore(document.createTextNode(node), existingNode)
                        } else {
                            obj.replaceChild(document.createTextNode(node), existingNode)
                        }
                        // request next node/string
                        node = true
                        continue
                    }
                }
                if (existingNode.$ref === ref) {
                    // created by same function
                    if (node == null) {
                        nodesToRemove.push(existingNode)
                        existingNode = existingNode.nextSibling
                    } else {
                        // order has changed so move another node here
                        if (existingNode !== node) obj.insertBefore(node, existingNode)
                        // in any other case we can just go ahead and compare the next node
                        else existingNode = existingNode.nextSibling
                        // request next node/string
                        node = true
                    }
                } else if (isFunction(existingNode.render)) {
                    // controlled by NomJS
                    if (node == null) {
                        nodesToRemove.push(existingNode)
                        existingNode = existingNode.nextSibling
                    } else {
                        // order has changed so move another node here
                        if (existingNode !== node) obj.insertBefore(node, existingNode)
                        // in any other case we can just go ahead and compare the next node
                        else existingNode = existingNode.nextSibling
                        // request next node/string
                        node = true
                    }
                } else {
                    // ignore this element, it does not interest us
                    existingNode = existingNode.nextSibling
                }
            }
            // remove the nodes that are no longer with us
            while (nodesToRemove.length) { obj.removeChild(nodesToRemove.pop()) }
            // create a fragment to host multiple nodes, otherwise use the parent node
            const parent = (nodes.length - nodeIndex > 0) ? document.createDocumentFragment() : obj
            // add nodes that are missing
            while (nodes.length >= nodeIndex) {
                addNode(parent, node)
                node = nodes[nodeIndex++]
            }
            // see if there is a fragment to be added to the main node object
            if (parent !== obj && parent.childNodes.length) obj.appendChild(parent)
            // skip functions
        } else if (isFunction(obj[objProp]));
        // apply subproperties like style if value is an object
        else if (typeof value === 'object') {
            if (obj[objProp] != null) {
                for (let item in value) {
                    if (value.hasOwnProperty(item) && obj[objProp][item] !== value[item]) {
                        obj[objProp][item] = value[item]
                    }
                }
            }
        }
        // simply set the property
        else if (obj[objProp] !== value) {
            obj[objProp] = value
        }
    }
    // and we're done
    return obj
}

function getChildren(children, child) {
    if (typeof child === 'string') {
        children.push(child)
    } else if (child instanceof Node) {
        if (child.nodeType !== 11) {
            children.push(child)
        } else {
            for (let el = child.firstChild; el !== null; el = el.nextSibling) {
                children.push(el)
            }
        }
    } else if (isFunction(child)) {
        children.push(child)
    } else if (Array.isArray(child)) {
        child.reduce(getChildren, children)
    } else if (child != null && child !== true && child !== false) {
        children.push(String(child))
    }
    return children
}

export function h(element, props, ...childs) {
    props = { ...props }
    props.children = getChildren([], props.children)
    childs.reduce(getChildren, props.children)
    if (props.children.length === 0) delete props.children
    if (isFunction(element)) {
        element = element(props)
        if (isFunction(element)) return element
    } else if (typeof element === 'string') {
        element = document.createElement(element)
    }
    // assign new properties and add Nom's rendering capabilities to the element
    return updateProps(element, props)
}

export function fragment(...nodes) {
    const frag = this instanceof Node ? this : document.createDocumentFragment()
    let nodeIndex = 0
    // flatten
    nodes = Array.prototype.concat.apply([], nodes)
    // nodes isn't really containing nodes yet, but we make them be ones
    while (nodes.length > nodeIndex) {
        const node = nodes[nodeIndex++]
        addNode(frag, node)
    }
    return frag
}

export function Fragment(props) {
    if (isFunction(props.map)) {
        const createElement = props.children && props.children[0]
        if (!isFunction(createElement)) throw new Error('children must be function when using Fragment map')
        return memoMap(
            isFunction(props.if) ? (() => (props.if() ? props.map() : [])) : props.map,
            createElement
        )
    } else if (isFunction(props.if)) {
        return () => (props.if() ? props.children : null)
    } else {
        return fragment(props.children)
    }
}

// takes a fragment or nodes, mounts them for automatic render, returns a fragment with unmount method
export function mount(frag) {
    const mountedNodes = []
    const originalNodes = []
    let nodeIndex = 0
    // make sure we work with a fragment; support skipping a call to fragment()
    if (!(frag instanceof Node && frag.nodeType === 11)) frag = fragment.apply(null, arguments)
    // get to know our original children
    while (frag.childNodes.length > nodeIndex) {
        const node = frag.childNodes[nodeIndex++]
        // remember all original childNodes of the fragment so we can restore them to fragment on unmount
        originalNodes.push(node)
        // gather additional reference of Nom rendered element
        if (isFunction(node.render)) mountedNodes.push(node)
    }
    // ends rendering and removes all original children from the document and returns the fragment
    frag.unmount = function() {
        // stop render execution by clearing all active mounts
        mountedNodes.length = 0
        // restore all nodes back to the original fragment
        while (originalNodes.length) frag.appendChild(originalNodes.shift())
        // return the fragment
        return frag
    }
    // takes care of keeping the nodes up-to-date
    function render() {
        let index = mountedNodes.length

        while (index) {
            const node = mountedNodes[--index]
            // has the node been removed?
            if (!node.parentElement) mountedNodes.splice(index, 1)
            // are we responsible for the render?
            else if (!isFunction(node.parentElement.render)) node.render()
        }
        // keep rendering as long as there is something we can be responsible of
        if (mountedNodes.length) requestAnimationFrame(render)
    }
    // initial render call
    requestAnimationFrame(render)
    return frag
}

export function memoMap(result, create) {
    const cache = new Map()
    return () => {
        const results = result()
        const items = !Array.isArray(results) ? [results] : results
        const indexCache = new Map()
        Array.from(cache.keys()).forEach(key => {
            if (!items.includes(key)) {
                cache.delete(key)
            }
        })
        const memo = items.reduce(
            (memo, item) => {
                const index = ~~indexCache.get(item)
                if (cache.has(item)) {
                    const nodes = cache.get(item)
                    if (index < nodes.length) {
                        memo.push(nodes[index])
                    } else {
                        const node = create(item)
                        nodes.push(node)
                        memo.push(node)
                    }
                } else {
                    const node = create(item)
                    cache.set(item, [node])
                    memo.push(node)
                }
                indexCache.set(item, index + 1)
                return memo
            },
            []
        )
        indexCache.clear()
        return memo
    }
}
