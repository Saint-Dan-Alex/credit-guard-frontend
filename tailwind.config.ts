import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "#02040a",
                foreground: "#f8fafc",
                primary: {
                    DEFAULT: "#1E40AF",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#F97316",
                    foreground: "#ffffff",
                },
                accent: {
                    DEFAULT: "#22C55E",
                    foreground: "#ffffff",
                },
                card: {
                    DEFAULT: "rgba(255, 255, 255, 0.05)",
                    foreground: "#f8fafc",
                },
                border: "rgba(255, 255, 255, 0.1)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "premium-gradient": "linear-gradient(135deg, #1E40AF 0%, #7c3aed 100%)",
            },
        },
    },
    plugins: [],
};
export default config;
