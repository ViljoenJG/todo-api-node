const { SHA256 } = require('crypto-js');
const bcrypt = require('bcryptjs');

// let data = {
//   id: 4
// }
//
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'someSecureSecret').toString()
// }
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'someSecureSecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed.')
// } else {
//   console.log('Warning: Data was changed.')
// }

let password = 'someSecureSecret';

bcrypt.genSalt(11, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

// let hashed = '$2a$10$5cGYHvySrGInhlGqW4Nu1eBn6wjLTW2//CsThRnvQAWPIrfJO5cXO';
// bcrypt.compare(password, hashed, (err, res) => console.log(res));
