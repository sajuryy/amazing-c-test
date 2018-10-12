const jwt = require('jsonwebtoken');

module.exports = function () {

  const token = jwt.sign({ smth: 'smth' }, 'secret').toString();

  return token;
};
