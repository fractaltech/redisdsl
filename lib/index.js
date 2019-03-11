"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var redis = require('redis');

var commands = ['append', 'auth', 'bgrewriteaof', 'bgsave', 'bitcount', 'bitfield', 'bitpop', 'bitpos', 'bitfield', 'bitop', 'bitpos', 'blpop', 'brpop', 'brpoplpush', 'bzpopmin', 'bzpopmax', 'client_kill', 'client_list', 'client_getname', 'client_pause', 'client_reply', 'client_setname', 'cluster_addslots', 'cluster_countfailurereports', 'cluster_countkeysinslot', 'cluster_delslots', 'cluster_failover', 'cluster_forget', 'cluster_getkeysinslot', 'cluster_info', 'cluster_keyslot', 'cluster_meet', 'cluster_nodes', 'cluster_replicate', 'cluster_reset', 'cluster_saveconfig', 'cluster setconfigepoch', 'cluster_setslot', 'cluster_slaves', 'cluster_replicas', 'cluster_slots', 'command', 'command_count', 'command_getkeys', 'command_info', 'config_get', 'config_rewrite', 'config_set', 'config_resetstat', 'dbsize', 'debug_object', 'debug_segfault', 'decr', 'decrby', 'del', 'discard', 'dump', 'echo', 'eval', 'evalsha', 'exec', 'exists', 'expire', 'expireat', 'exists', 'expire', 'expireat', 'flushall', 'flushdb', 'geoadd', 'geohash', 'geopos', 'geodist', 'georadius', 'georadiusbymember', 'get', 'getbit', 'getrange', 'getset', 'hdel', 'hexists', 'hget', 'hgetall', 'hincrby', 'hincrbyfloat', 'hkeys', 'hlen', 'hmget', 'hmset', 'hset', 'hsetnx', 'hstrlen', 'hvals', 'incr', 'incrby', 'incrbyfloat', 'info', 'keys', 'lastsave', 'lindex', 'linsert', 'llen', 'lpop', 'linsert', 'llen', 'lpop', 'lpush', 'lpushx', 'lrange', 'lrem', 'lset', 'ltrim', 'memory_doctor', 'memory_help', 'memory_mallocstats', 'memory_purge', 'memory_stats', 'memory_usage', 'mget', 'migrate', 'monitor', 'move', 'mset', 'msetnx', 'multi', 'object', 'persist', 'pexpire', 'pexpireat', 'pfadd', 'pfcount', 'pfmerge', 'ping', 'psetex', 'psubscribe', 'pubsub', 'pttl', 'publish', 'punsubscribe', 'quit', 'randomkey', 'readonly', 'readwrite', 'rename', 'renamenx', 'resotre', 'role', 'rpop', 'rpoplpush', 'rpush', 'rpushx', 'sadd', 'save', 'scard', 'script_debug', 'script_exists', 'script_flush', 'script_kill', 'script_load', 'sdiff', 'sdiffstore', 'select', 'set', 'setbit', 'setex', 'setnx', 'setrange', 'shutdown', 'sinter', 'sinterstore', 'sismember', 'slaveof', 'replicaof', 'slowlog', 'smembers', 'smove', 'sort', 'spop', 'srandmember', 'srem', 'strlen', 'subscribe', 'sunion', 'sunionstore', 'swapdb', 'sync', 'time', 'touch', 'ttl', 'type', 'unsubscribe', 'unlink', 'unwatch', 'wait', 'watch', 'zadd', 'zcard', 'zcount', 'zincrby', 'zinterstore', 'zlexcount', 'zpopmax', 'zpopmin', 'zrange', 'zrangebylex', 'zrevrangebylex', 'zrangebyscore', 'zrank', 'zrem', 'zremrangebylex', 'zremrangebyrank', 'zremrangebyscore', 'zrevrank', 'zscore', 'zunionstore', 'scan', 'sscan', 'hscan', 'zscan', 'xinfo', 'xadd', 'xtrim', 'xdel', 'xrange', 'xrevrange', 'xlen', 'xread', 'xgroup', 'xreadgroup', 'xack', 'xclaim', 'xpending'];

var dslFactory = function dslFactory() {
  var client = redis.createClient.apply(redis, arguments);
  return commands.reduce(function (dsl, cmd) {
    return _objectSpread({}, dsl, _defineProperty({}, cmd, function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return new Promise(function (resolve, reject) {
        client[cmd].apply(client, args.concat([function (err, res) {
          return err ? reject(err) : resolve(res);
        }]));
      });
    }));
  }, {
    client: client
  });
};

module.exports = dslFactory;