const {SHA256} = require ('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt  = require('bcrypt');

var passwod = '123abc!';

 bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(passwod , salt,(err,hash)=>{
        console.log(hash);
    });
 });

var hashedPasaword = '$2b$10$TXWwMnTFWM.VmRKBrBSHuuZ3nCiehQTGv54ysxCmYU.Dbe6IqgT3u';

bcrypt.compare(passwod,hashedPasaword,(err,res)=>{
    console.log(res);
    
});

// var data={
//     id : 10
// };

// var token = jwt.sign(data,'123abc');
// console.log(token);

// var decoded =  jwt.verify(token,'123abc');
// console.log(decoded);


// var message= 'I am user 1';

// var hash = SHA256(message).toString();

// console.log('message  :',message);
// console.log('hash :',hash);

// var data = {
//     id : 4
// };

// var token = {
//     data,
//     hash : SHA256(JSON.stringify(data)+'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString()

// var resHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();

// if(resHash === token.hash){
//     console.log('data was not changed');
    
// }else{
//     console.log('data was changed');
    
// }