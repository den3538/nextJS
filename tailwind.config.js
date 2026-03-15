/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        container: "var(--max-container)",
        "9xl": "var(--max-9xl)",
      },
      colors: {
        whish: "var(--color-whish)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-card-foreground)",
        popover: "var(--color-popover)",
        "popover-foreground": "var(--color-popover-foreground)",
        success: "var(--color-success)",
        accent: "var(--color-accent)",
        "accent-foreground": "var(--color-accent-foreground)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        destructive: "var(--color-destructive)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        border: "var(--color-border)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        "3xl": "var(--radius-3xl)",
        "4xl": "var(--radius-4xl)",
      },
    },
  },
  plugins: [],
};
