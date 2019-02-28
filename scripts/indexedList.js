/**
 * @name IndexedList
 * @class
 */
class IndexedList {
    /**
     * @param {Array.<Object|number|string>} items
     * @param {function(*):string} keySelector
     */
    constructor(items, keySelector) {
        if (!Array.isArray(items)) {
            throw new TypeError('Invalid param 1');
        }
        if (!keySelector) {
            throw new TypeError('Invalid param 2');
        }
        /** @type {Object.<string, *>} */
        this._index = {};
        /** @type {function(*):string} */
        this._keySelector = keySelector;
        /** @type {Array.<*>} */
        this._list = items;
        this._resetIndex();
    }

    reset() {
        this._list = [];
        this._resetIndex();
    }

    /**
     * @private
     */
    _resetIndex() {
        this._index = {};
        let index = 0;
        for (const item in this._list) {
            const key = this._keySelector(item);
            this._index[key] = index;
            ++index;
        }
    }

    /**
     * @desc C# getter: TValue this[TKey key]
     * @param {string} key
     * @returns {*}
     */
    getIndexedListItem(key) {
        if (!this._index.hasOwnProperty(key)) {
            throw new Error('KeyNotFoundException');
        }
        return this._list[this._index[key]];
    }
    /**
     * @desc C# setter: TValue this[TKey key]
     * @param {string} key
     * @param {*} value
     */
    setIndexedListItem(key, value) {
        if (!this._index.hasOwnProperty(key)) {
            throw new Error('KeyNotFoundException');
        }
        return (this._list[this._index[key]] = value);
    }

    /**
     * @param {string} key
     * @returns {*}
     */
    getByKey(key) {
        return this.getIndexedListItem(key);
    }

    /**
     * @param {number} index
     * @returns {*}
     */
    getByIndex(index) {
        if (typeof index !== 'number' || index < 0 || index >= this._list.length) {
            throw new Error('IndexNotFoundException');
        }
        return this._list[index];
    }

    /**
     * @returns {number}
     */
    count() {
        return this._list.length;
    }

    /**
     * @returns {boolean}
     */
    isReadOnly() {
        return false;
    }

    /**
     * @returns {string[]}
     */
    keys() {
        return Object.keys(this._index);
    }

    /**
     * @returns {Array<*>}
     */
    values() {
        return this._list;
    }

    /**
     * @param {*|string} itemOrKey
     * @param {*} value
     */
    add(itemOrKey, value) {
        if (arguments.length === 1) {
            const key = this._keySelector(itemOrKey);
            this.add(key, itemOrKey);
            return;
        }
        if (this.containsKey(itemOrKey)) {
            this._list[this._index[itemOrKey]] = value;
            return;
        }
        this._list.push(value);
        this._index[itemOrKey] = this._list.length - 1;
    }

    clear() {
        this._list = [];
        this._index = {};
    }

    /**
     * @param {*} item
     * @returns {boolean}
     */
    contains(item) {
        return this._list.indexOf(item) !== -1;
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    containsKey(key) {
        return this._index.hasOwnProperty(key);
    }
    /**
     * @param {Array.<*>} array
     * @param {number} arrayIndex
     */
    /* eslint-disable-next-line no-unused-vars */
    copyTo(array, arrayIndex) {
        throw new SyntaxError('NotImplemented');
    }

    /**
     * @param {string} key
     * @returns {*}
     */
    indexOf(key) {
        return this._index[key];
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
    remove(key) {
        if (this._index.hasOwnProperty(key)) {
            this.removeAt(key, this._index[key]);
        }
        return false;
    }

    /**
     * @param {string} key
     * @param {number} index
     */
    removeAt(key, index) {
        if (typeof key !== 'number' && index === undefined) {
            const item = this._list[key];
            const itemKey = this._keySelector(item);
            this.removeAt(key, itemKey);
        } else {
            this._list.splice(index, 1);
            const keys = this.keys();
            for (let i = 0; i < keys.length; ++i) {
                const oldIndex = this._index[i];
                if (oldIndex >= index) {
                    this._index[i] = oldIndex - 1;
                }
            }
            if (this.containsKey(key)) {
                delete this._index[key];
            }
        }
    }

    /**
     * @param {string} key
     * @param {function(boolean, *)} resultFunc
     * @param {*} defaultValue
     * @returns {boolean}
     */
    tryGetValue(key, resultFunc, defaultValue) {
        if (this.containsKey(key)) {
            resultFunc(true, this._list[this._index[key]]);
            return true;
        }
        resultFunc(false, defaultValue);
        return false;
    }

    /**
     * @param {string} key
     * @param {*} defaultValue
     * @returns {*}
     */
    getOrDefault(key, defaultValue) {
        if (this.containsKey(key)) {
            return this._list[this._index[key]];
        }
        return defaultValue;
    }

    /**
     * @returns {Array<*>}
     */
    getEnumerator(a) {
        return this._list;
    }
}

module.exports.IndexedList = IndexedList;
