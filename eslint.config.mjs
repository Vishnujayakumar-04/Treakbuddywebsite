import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

// Avoid circular JSON issues by not trying to spread the full next config arrays
// Next.js recommended flat config approach for simple core web vitals
const eslintConfig = [
    // Ignore build output
    { ignores: [".next/**", "out/**", "node_modules/**"] },
    ...compat.config({
        extends: ["next/core-web-vitals", "next/typescript"]
    }),
];

export default eslintConfig;
