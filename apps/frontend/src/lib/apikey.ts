import crypto from "crypto";
import { server } from "./env/server";

const IV_LENGTH = 12; // AES-GCM recommended IV length
const ENCRYPTION_KEY = Buffer.from(server.ENCRYPTION_KEY!, 'hex');

export async function generateApiKey() {
    return crypto.randomBytes(32).toString("hex"); // 256-bit API key
}

export async function encryptApiKey(plainTextKey: string) {
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(plainTextKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}.${authTag.toString('hex')}.${encrypted}`;
}

export async function decryptApiKey(encryptedKey: string) {
    const [ivHex, tagHex, encryptedHex] = encryptedKey.split('.');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(tagHex, 'hex');
    const encrypted = encryptedHex;

    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
