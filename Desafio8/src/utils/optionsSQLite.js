'use strict';

const path = require("path");

const optionsSQLite = {
  client: "better-sqlite3",
  connection: { filename: path.resolve(__dirname, "../DB/ecommerce.db3") },
  useNullAsDefault: true,
};

module.exports = { optionsSQLite };