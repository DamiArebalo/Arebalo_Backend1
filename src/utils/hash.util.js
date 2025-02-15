import { genSaltSync, hashSync, compareSync } from 'bcrypt';

function createHashUtil(password) {
    const salt = genSaltSync(10);
    const hashpassword = hashSync(password, salt);
    return hashpassword;
    
}

function verifyHashUtil(password, hashpassword) {
    const verify = compareSync(password, hashpassword);
    return verify;
}

export { createHashUtil, verifyHashUtil};

