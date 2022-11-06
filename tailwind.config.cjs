/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    plugins: [require("@tailwindcss/forms")],
    theme: {
        extend: {
            keyframes: {
                enterFromRight: {
                    "0%": {
                        transform: "translateX(200px)",
                        opacity: "0",
                    },
                    "100%": {
                        transform: "translateX(0px)",
                        opacity: "1",
                    },
                },
                enterFromLeft: {
                    "0%": {
                        transform: "translateX(-200px)",
                        opacity: "0",
                    },
                    "100%": {
                        transform: "translateX(0px)",
                        opacity: "1",
                    },
                },
                exitToRight: {
                    "0%": {
                        transform: "translateX(0px)",
                        opacity: "1",
                    },
                    "100%": {
                        transform: "translateX(200px)",
                        opacity: "0",
                    },
                },
                exitToLeft: {
                    "0%": {
                        transform: "translateX(0px)",
                        opacity: "1",
                    },
                    "100%": {
                        transform: "translateX(-200px)",
                        opacity: "0",
                    },
                },
                scaleIn: {
                    "0%": {
                        transform: "rotateX(-30deg) scale(0.9)",
                        opacity: "0",
                    },
                    "100%": {
                        transform: "rotateX(0deg) scale(1)",
                        opacity: "1",
                    },
                },
                scaleOut: {
                    "0%": {
                        transform: "rotateX(0deg) scale(1)",
                        opacity: "1",
                    },
                    "100%": {
                        transform: "rotateX(-10deg) scale(0.95)",
                        opacity: "0",
                    },
                },
                fadeIn: {
                    "0%": {
                        opacity: "0",
                    },
                    "100%": {
                        opacity: "1",
                    },
                },
                fadeOut: {
                    "0%": {
                        opacity: "1",
                    },
                    "100%": {
                        opacity: "0",
                    },
                },
                slideDown: {
                    "0%": {
                        height: 0,
                    },
                    "100%": {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                slideUp: {
                    "0%": {
                        height: "var(--radix-accordion-content-height)",
                    },
                    "100%": {
                        height: 0,
                    },
                },
                slideDownAndFade: {
                    "0%": {
                        opacity: 0,
                        transform: "translateY(-2px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateY(0px)",
                    },
                },
                slideUpAndFade: {
                    "0%": {
                        opacity: 1,
                        transform: "translateY(px)",
                    },
                    "100%": {
                        opacity: 0,
                        transform: "translateY(-2px)",
                    },
                },
            },
            animation: {
                enterFromLeft: "enterFromLeft 0.25s ease",
                enterFromRight: "enterFromRight 0.25s ease",
                exitToLeft: "exitToLeft 0.25s ease",
                exitToRight: "exitToRight 0.25s ease",
                fadeIn: "fadeIn 0.2s ease",
                fadeOut: "fadeOut 0.2s ease",
                scaleIn: "scaleIn 0.2s ease",
                scaleOut: "scaleOut 0.2s ease",
                slideDown: "slideDown 0.3s cubic-bezier(0.87, 0, 0.13, 1)",
                slideUp: "slideUp 0.3s cubic-bezier(0.87, 0, 0.13, 1)",
                slideDownAndFade: "slideDownAndFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                slideUpAndFade: "slideUpAndFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            },
        },
    },
};
