const jwt = require('jsonwebtoken');

const data = {
  id: 10
}

const token = jwt.sign(data, 'superSecureSecret123');
console.log(`Token: ${ token }`);

const decoded = jwt.verify(token, 'superSecureSecret123');
console.log(`Decoded: ${ JSON.stringify(decoded, undefined, 2) }`);
