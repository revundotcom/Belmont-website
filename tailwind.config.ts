import type { Config } from "tailwindcss";

/**
 * The Bellmont palette, straight from the brand guidelines (slide 08).
 * Ratio to aim for on any page: 50% Bell Blue · 25% Canvas/Brown · 15% Seafoam/Teal · 10% Plum/Grey/Gold.
 *  - Text is Brown, never black.
 *  - Plum marks the one thing to act on (a button, a link).
 *  - Gold is for rules and ornament, Grey for hairlines; neither is text on Canvas.
 *  - Seafoam text sits on Bell Blue only at 24px and up.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2.5rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        bell: { DEFAULT: "#2F5D66", 600: "#2A535B", 700: "#244850" },
        plum: { DEFAULT: "#71333D", 600: "#622C35", 700: "#53252D" },
        gold: "#B39764",
        canvas: { DEFAULT: "#F1E8DD", soft: "#F7F2EC" },
        seafoam: "#B5C6C9",
        teal: "#1A3338",
        grey: "#B5AE9D",
        brown: { DEFAULT: "#322B23", muted: "#5E554A" },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        eyebrow: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.14em", fontWeight: "600" }],
        display: ["4rem", { lineHeight: "4.25rem", letterSpacing: "-0.01em" }],
        h1: ["2.75rem", { lineHeight: "3.125rem" }],
        h2: ["2rem", { lineHeight: "2.375rem" }],
        h3: ["1.5rem", { lineHeight: "1.875rem" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        body: ["1rem", { lineHeight: "1.625rem" }],
      },
      borderRadius: {
        arch: "999px 999px 0 0",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "rise-in": { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "rise-in": "rise-in 320ms cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [],
};

export default config;
