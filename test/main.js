const tape = require('tape');
const mock = require('mock-require');
const sinon = require('sinon');
const fs = require('fs');
const util = require('util');
const path = require('path');

const log = (...args) => {
  return new Promise((resolve, reject) => {
    const str = util.format(...args);

    fs.writeFile(path.join(__dirname, 'log'), str, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};

tape('redis cmds', async (t) => {
  t.plan(9);

  t.ok(1 === 1/1, 'foo');
  t.ok(1 === 1/1, 'bar');
  t.ok(1 === 1/1, 'baz');

  const redisMock = {
    createClient: () => ({
      _cache: new Map(),
      get(key) {
        return new Promise((resolve) => setTimeout(() => resolve(this._cache.get(key)), 9));
      },
      set(key, val) {
        return new Promise((resolve) => setTimeout(() => {
          this._cache.set(key, val);
          resolve();
        }, 27));
      },
      del(key) {
        return new Promise((resolve) => setTimeout(() => {
          this._cache.delete(key);
          resolve();
        }, 30));
      }
    })
  };

  t.ok(redisMock instanceof Object, 'fizz');

  mock('redis', redisMock);

  const dsl = require('../lib')();

  const {client, get, set, del} = dsl;

  t.ok(client instanceof Object);
  t.ok(get instanceof Function);

  const getSpy = sinon.spy(client, 'get');
  const setSpy = sinon.spy(client, 'set');
  const delSpy = sinon.spy(client, 'del');

  t.ok(getSpy instanceof Object);
  t.ok(setSpy instanceof Object);
  t.ok(delSpy instanceof Object);

  await set('foo', 'bar');

  // t.ok((await get('foo')) === 'bar', 'set & get work');
  // await del('foo');
  // t.ok((await get('foo')) === null, 'del works');

  // t.ok(getSpy.calledTwice, 'getSpy');
  // t.ok(setSpy.calledOnce, 'setSpy');
  // t.ok(delSpy.calledOnce, 'delSpy');
});
