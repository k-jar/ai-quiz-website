import crypto from 'crypto';

const generateSecret = () => {
    return crypto.randomBytes(64).toString('hex');
}

const secret = generateSecret();
console.log("JWT secret:", secret);