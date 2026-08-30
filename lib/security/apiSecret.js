import crypto from "node:crypto";

export function hashApiSecret(secret) {
    return crypto
        .createHash("sha256")
        .update(secret)
        .digest("hex");
}

export function verifyApiSecret(secret, storedHash) {
    const providedHash = hashApiSecret(secret);

    const providedBuffer = Buffer.from(providedHash, "hex");
    const storedBuffer = Buffer.from(storedHash, "hex");

    if (providedBuffer.length !== storedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        providedBuffer,
        storedBuffer
    );
}