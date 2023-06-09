import { fileURLToPath } from 'url';
import { dirname } from 'path';

import bcrypt from "bcrypt";

export const createHash = async (password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

export const isValidPassword = async (user, password) => {
    const result = await bcrypt.compare(password, user.password);
    return result;
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;