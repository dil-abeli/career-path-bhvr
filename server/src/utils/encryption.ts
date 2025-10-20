import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ENCRYPTION_KEY =
	process.env.ENCRYPTION_KEY || "dev-encryption-key-32-characters!";
const ALGORITHM = "aes-256-cbc";

function ensureKeyLength(key: string): Buffer {
	const buffer = Buffer.from(key, "utf-8");
	if (buffer.length === 32) return buffer;
	const result = Buffer.alloc(32);
	buffer.copy(result, 0, 0, Math.min(buffer.length, 32));
	return result;
}

export interface EncryptedData {
	encryptedText: string;
	iv: string;
}

export function encrypt(text: string): EncryptedData {
	const iv = randomBytes(16);
	const key = ensureKeyLength(ENCRYPTION_KEY);
	const cipher = createCipheriv(ALGORITHM, key, iv);
	let encrypted = cipher.update(text, "utf-8", "hex");
	encrypted += cipher.final("hex");

	return {
		encryptedText: encrypted,
		iv: iv.toString("hex"),
	};
}

export function decrypt(encryptedText: string, ivHex: string): string {
	const key = ensureKeyLength(ENCRYPTION_KEY);
	const iv = Buffer.from(ivHex, "hex");
	const decipher = createDecipheriv(ALGORITHM, key, iv);
	let decrypted = decipher.update(encryptedText, "hex", "utf-8");
	decrypted += decipher.final("utf-8");
	return decrypted;
}

