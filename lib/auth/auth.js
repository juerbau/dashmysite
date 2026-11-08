import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { authPool } from "../database/authPool.js";

export const auth = betterAuth({
    database: authPool,

    emailAndPassword: {
        enabled: true,
        disableSignUp: true,
    },

    plugins: [
        admin(),
    ],
});