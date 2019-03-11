const tape = require('tape');
const config = require('./config');
const {client, get, set, del} = require('../src')(config);

tape('testing redis cmds', async (t) => {
  t.plan(2);

  console.log('testing redis cmds');

  await set('foo', 'bar');
  const res1 = await get('foo');
  t.ok(res1 === 'bar', 'testing set & get work');

  await del('foo');
  const res2 = await get('foo');
  t.ok(res2 === null, 'testing del works');

  await client.quit();
});
