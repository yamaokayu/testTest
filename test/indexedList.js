import {IndexedList} from 'indexedList';
import assert from 'assert';
import chai from 'chai';
import curl from 'curl';
const expect = chai.expect;
chai.should();

console.log('curl.get');
curl.get('http://0.0.0.0:8000', {}, (err, response, body) =>{
    if (err) {
        console.log('failed');
    } else {
        console.log('ok');
    }
});

function constructorTest() {
    it('indexedList constructor()', done => {
        // system test, normal, boundary
        const indexedList1 = new IndexedList([], key => key);
        assert.strictEqual(indexedList1._list.length, 0);

        const indexedList2 = new IndexedList([0], key => key);
        assert.strictEqual(indexedList2._list.length, 1);
        assert.strictEqual(indexedList2._list[0], 0);

        const indexedList3 = new IndexedList([3, 2, 1], key => key);
        assert.strictEqual(indexedList3._list.length, 3);
        expect(indexedList3._index).to.deep.keys({'0': 0, '1': 1, '2': 2});
        expect(indexedList3._list).to.deep.equal([3, 2, 1]);

        const indexedList4 = new IndexedList([0, 'a', ''], key => '!' + key);
        assert.strictEqual(indexedList4._index['!0'], 0);
        assert.strictEqual(indexedList4._list[indexedList4._index['!0']], 0);
        assert.strictEqual(indexedList4._index['!1'], 1);
        assert.strictEqual(indexedList4._list[indexedList4._index['!1']], 'a');
        assert.strictEqual(indexedList4._index['!2'], 2);
        assert.strictEqual(indexedList4._list[indexedList4._index['!2']], '');

        // error case
        expect(() => new IndexedList(undefined, key => key)).to.throw();
        expect(() => new IndexedList([], undefined)).to.throw();

        done();
    });
}

function resetTest() {
    it('indexedList reset()', done => {
        // system test, normal, boundary
        const indexedList1 = new IndexedList([3, 2, 1], key => key);
        indexedList1.reset();
        indexedList1._list.should.be.empty;
        indexedList1._index.should.be.empty;

        const indexedList2 = new IndexedList([], key => key);
        indexedList2.reset();
        assert.strictEqual(indexedList2._list.length, 0);
        indexedList2._list.should.be.empty;
        indexedList2._index.should.be.empty;

        done();
    });
}

function getIndexedListItemTest() {
    it('indexedList getIndexedListItem()', done => {
        // system test, normal, boundary
        const indexedList1 = new IndexedList([0, 1, 2, {k: 'v'}], key => key);
        assert.strictEqual(indexedList1.getIndexedListItem(0), 0);
        indexedList1.setIndexedListItem(0, 1);
        assert.strictEqual(indexedList1.getIndexedListItem(0), 1);
        indexedList1.setIndexedListItem(1, 2);
        indexedList1.setIndexedListItem(2, '3');
        expect(indexedList1.getIndexedListItem(3)).to.be.deep.equal({k: 'v'});
        assert.strictEqual(indexedList1.getIndexedListItem(0), 1);
        assert.strictEqual(indexedList1.getIndexedListItem(1), 2);
        assert.strictEqual(indexedList1.getIndexedListItem(2), '3');
        indexedList1.setIndexedListItem(0, undefined);
        assert.strictEqual(indexedList1.getIndexedListItem(0), undefined);
        indexedList1.setIndexedListItem(0, null);
        assert.strictEqual(indexedList1.getIndexedListItem(0), null);

        // error case
        const indexedList2 = new IndexedList([0, 1, 2], key => key);
        expect(() => indexedList2.getIndexedListItem(3)).to.throw();
        expect(() => indexedList2.setIndexedListItem(3, 1)).to.throw();

        expect(() => indexedList2.getIndexedListItem('00')).to.throw();
        expect(() => indexedList2.setIndexedListItem('00', 1)).to.throw();

        expect(() => indexedList2.getIndexedListItem(undefined)).to.throw();
        expect(() => indexedList2.setIndexedListItem(undefined, 1)).to.throw();

        done();
    });
}

function getByKeyTest() {
    it('indexedList getByKey()', done => {
        // system test, normal, boundary
        const indexedList1 = new IndexedList([0, 1, [100], {k: 'v'}], key => key);
        assert.strictEqual(indexedList1.getByKey(0), 0);
        assert.strictEqual(indexedList1.getByKey(1), 1);
        expect(indexedList1.getByKey(2)).to.be.deep.equal([100]);
        expect(indexedList1.getByKey(3)).to.be.deep.equal({k: 'v'});

        // error case
        const indexedList2 = new IndexedList([0, 1, 2], key => key);
        expect(() => indexedList2.getByKey(3)).to.throw();
        expect(() => indexedList2.getByKey(3, 1)).to.throw();
        expect(() => indexedList2.getByKey('00')).to.throw();
        expect(() => indexedList2.getByKey(undefined)).to.throw();
        expect(() => indexedList2.getByKey(null)).to.throw();

        done();
    });
}

function getByIndexTest() {
    it('indexedList getByIndex()', done => {
        // system test, normal, boundary
        const indexedList1 = new IndexedList([10, 1, 2, {k: 'v'}], key => key);

        expect(indexedList1.getByIndex(0)).to.equal(10);
        expect(indexedList1.getByIndex(1)).to.equal(1);
        expect(indexedList1.getByIndex(2)).to.equal(2);
        expect(indexedList1.getByIndex(3)).to.be.deep.equal({k: 'v'});

        // error case
        const indexedList2 = new IndexedList([0, 1, 2], key => key);
        expect(() => indexedList2.getByIndex(-1)).to.throw();
        expect(() => indexedList2.getByIndex(0)).to.not.throw();
        expect(() => indexedList2.getByIndex(2)).to.not.throw();
        expect(() => indexedList2.getByIndex(3)).to.throw();
        expect(() => indexedList2.getByIndex(undefined)).to.throw();
        expect(() => indexedList2.getByIndex(null)).to.throw();
        expect(() => indexedList2.getByIndex({})).to.throw();

        done();
    });
}

function countTest() {
    it('indexedList count()', done => {
        // system test, normal, boundary
        const indexedList1 = new IndexedList([], key => key);
        expect(indexedList1.count()).to.equal(0);

        const indexedList2 = new IndexedList([1], key => key);
        expect(indexedList2.count()).to.equal(1);

        const indexedList3 = new IndexedList([{}, {}, {}], key => key);
        expect(indexedList3.count()).to.equal(3);

        const indexedList4 = new IndexedList([undefined, undefined], key => key);
        expect(indexedList4.count()).to.equal(2);

        const indexedList5 = new IndexedList([null, null], key => key);
        expect(indexedList5.count()).to.equal(2);

        done();
    });
}

function isReadOnlyTest() {
    it('indexedList values()', done => {
        // system test, normal, boundary
        const indexedList1 = new IndexedList([], key => key);
        assert.strictEqual(indexedList1.isReadOnly(), false);

        done();
    });
}

function keysTest() {
    it('indexedList count()', done => {
        // system test, normal, boundary
        const indexedList1 = new IndexedList([], key => key);
        expect(indexedList1.keys()).to.have.lengthOf(0);

        const indexedList2 = new IndexedList([1], key => key);
        expect(indexedList2.keys()).to.deep.equal(['0']);

        done();
    });
}

function valuesTest() {
    it('indexedList values()', done => {
        // system test, normal, boundary
        const indexedList1 = new IndexedList([], key => key);
        expect(indexedList1.values()).to.deep.equals([]);

        const indexedList2 = new IndexedList([1, 2, {a: 10}], key => key);
        expect(indexedList2.values()).to.deep.equals([1, 2, {a: 10}]);

        done();
    });
}

describe('indexedList()', () => {
    // Testing to all public methods in class
    constructorTest();
    resetTest();
    getIndexedListItemTest();
    getByKeyTest();
    getByIndexTest();
    countTest();
    isReadOnlyTest();
    keysTest();
    valuesTest();
    // ...
});
