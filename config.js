var config = {
  development: {
    mongoDatabase: {
      host: 'ds133428.mlab.com',
      port: 33428,
      db: 'veritas_db',
      username: 'tedma4',
      password: 'tm671216'
    },
    redisDatabase: {
      host: 'barreleye.redistogo.com',
      port: 10221,
      db: '',
      username: 'redistogo',
      password: '8489770cceb6990c72230ddd19efe3c2'
    },
    server: {
      port: 80
    }
  },
  production: {
    mongoDatabase: {
      host: 'ds133428.mlab.com',
      port: 33428,
      db: 'veritas_db',
      username: 'tedma4',
      password: 'tm671216'
    },
    redisDatabase: {
      host: 'barreleye.redistogo.com',
      port: 10221,
      db: '',
      username: 'redistogo',
      password: '8489770cceb6990c72230ddd19efe3c2'
    },
    server: {
      port: 8080
    }
  }
};
module.exports = config;