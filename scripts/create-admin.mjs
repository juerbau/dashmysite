import { auth } from "../lib/auth/auth.js";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { authPool } from "../lib/database/authPool.js";


async function askPassword() {
    let hidden = false;

    const output = new Writable({
        write(chunk, encoding, callback) {
            if (!hidden) {
                process.stdout.write(chunk);
            }

            callback();
        },
    });

    const rl = createInterface({
        input: process.stdin,
        output,
        terminal: true,
    });

    try {
        process.stdout.write("Admin-Passwort: ");
        hidden = true;

        return await rl.question("");
    } finally {
        rl.close();
        process.stdout.write("\n");
    }
}


async function main() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    try {
        const email = (await rl.question("Admin-E-Mail: ")).trim();

        const password = await askPassword();

        if (!email || !password) {
            throw new Error("E-Mail und Passwort dürfen nicht leer sein.");
        }

        const user = await auth.api.createUser({
            body: {
                name: "DashMySite Admin",
                email,
                password,
                role: "admin",
            },
        });

        console.log("Admin-Konto erfolgreich angelegt!");
        console.log("Benutzer-ID:", user.user.id);

    } finally {
        rl.close();
    }
}

main()
    .catch((error) => {
        console.error("Einrichtung fehlgeschlagen:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await authPool.end();
    });