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

tape('redis cmds', (t) => {
  t.plan(11);

  const redisMock = {
    createClient: () => ({
      _cache: {},
      get(key) {
        return new Promise((resolve) => setTimeout(() => resolve(key in this._cache ? this._cache[key] : null), 9));
      },
      set(key, val) {
        return new Promise((resolve) => setTimeout(() => {
          this._cache[key] = val;
          resolve();
        }, 27));
      },
      del(key) {
        return new Promise((resolve) => setTimeout(() => {
          delete this._cache[key];
          resolve();
        }, 30));
      }
    })
  };

  t.ok(redisMock instanceof Object, 'fizz');

  mock('redis', redisMock);

  const {client, get, set, del} = require('../src')();

  t.ok(client instanceof Object);
  t.ok(get instanceof Function);

  const getSpy = sinon.spy(client, 'get');
  const setSpy = sinon.spy(client, 'set');
  const delSpy = sinon.spy(client, 'del');

  t.ok(getSpy instanceof Object);
  t.ok(setSpy instanceof Object);
  t.ok(delSpy instanceof Object);

  set('foo', 'bar').then(() => {
    return get('foo');
  }).then((res) => {
    t.ok(res === 'bar', 'set & get work');
  }).then(() => {
    return del('foo');
  }).then(() => {
    return get('foo');
  }).then((res) => {
    t.ok(res === null, 'del works');
  }).then(() => {
    t.ok(getSpy.calledTwice, 'getSpy');
    t.ok(setSpy.calledOnce, 'setSpy');
    t.ok(delSpy.calledOnce, 'delSpy');
  }).then(() => {
    mock.stop('redis');
  });
});
