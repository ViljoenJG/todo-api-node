const { SHA256 } = require('crypto-js');

let data = {
  id: 4
}

let token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'someSecureSecret').toString()
}

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

let resultHash = SHA256(JSON.stringify(token.data) + 'someSecureSecret').toString();

if (resultHash === token.hash) {
  console.log('Data was not changed.')
} else {
  console.log('Warning: Data was changed.')
}
