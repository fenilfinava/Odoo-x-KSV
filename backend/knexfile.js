const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'data', 'vendorbridge.sqlite3')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'src', 'db', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'db', 'seeds')
    }
  }
};
