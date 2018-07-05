/**
 *  使用AES加密算法加密，解密
 */
import crypto from 'crypto'

let key = 'COS';

export const aesEncrypt = (data) => {
    const cipher = crypto.createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

export const aesDecrypt = (encrypted) => {
    const decipher = crypto.createDecipher('aes192', key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// var data = `{
//   cosName:"川迪科技",
//   imagePath:"",
//   mobile:"15122744176",
//   ret:1,
//   rongCloudToken:"1WKuWoXF5I5yMhzGnlwLvJuXHjD7Q/y85URMPVq58wUNSjAL7MIU7W3+XEPUSG0snh6j3n7jKT4XBoNb8IwqYQ==",
//   userBirthdy:"1994-10-20",
//   userName:"李小伟",
//   userRole:"一般员工",
//   userSex:"1",
//   userStaffID:"145",
//   userType:"Staff"
// }`;
// var data = ``;

// var encrypted = aesEncrypt(data, key);
// var decrypted = aesDecrypt(encrypted, key);

// console.log('Plain text: ' + data);
// console.log('Encrypted text: ' + encrypted);
// console.log('Decrypted text: ' + decrypted);
