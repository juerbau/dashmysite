function required(name) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

export const databaseConfig = {
    host: required("DB_HOST"),
    port: Number(required("DB_PORT")),
    database: required("DB_NAME"),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
};