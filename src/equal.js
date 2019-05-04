// optimized from https://github.com/descriptinc/fast-deep-equal/blob/b6ef7abb05daf91651bda3cf79a26c083de9e74d/index.js
const isArray = Array.isArray
const keyList = Object.keys
const hasProp = Object.prototype.hasOwnProperty

export function equal(a, b) {
    if (a === b) return true

    if (a && b && typeof a === 'object' && typeof b === 'object') {
        let i, key, keys, value

        if (isArray(a)) {
            if (!isArray(b)) return false
            if (a.length !== b.length) return false
            for (i = a.length; i-- !== 0;)
                if (!equal(a[i], b[i])) return false
            return true
        } else if (a instanceof Date) {
            if (!(b instanceof Date)) return false
            return a.getTime() === b.getTime()
        } else if (a instanceof RegExp) {
            if (!(b instanceof RegExp)) return false
            return a.toString() === b.toString()
        } else if (a instanceof Set) {
            if (!(b instanceof Set)) return false
            if (a.size !== b.size) return false
            keys = b.keys()
            for (value of a)
                if (!equal(value, keys.next().value)) return false

            return true
        } else if (a instanceof Map) {
            if (!(b instanceof Map)) return false
            if (a.size !== b.size) return false
            keys = b.entries()
            for (value of a)
                if (!equal(value, keys.next().value)) return false

            return true
        } else if (
            isArray(b) ||
            b instanceof Date ||
            b instanceof RegExp ||
            b instanceof Set ||
            b instanceof Map
        ) {
            return false
        }
        keys = keyList(a)

        if (keys.length !== keyList(b).length) return false

        for (i = keys.length; i-- !== 0;)
            if (!hasProp.call(b, keys[i])) return false

        for (i = keys.length; i-- !== 0;) {
            key = keys[i]
            if (!equal(a[key], b[key])) return false
        }

        return true
    }

    return a !== a && b !== b
}
