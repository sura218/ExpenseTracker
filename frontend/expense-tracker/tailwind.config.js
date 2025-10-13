/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enables `.dark` class variant
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui"],
        roboto: "Roboto",
        mono: ["var(--font-geist-mono)", "monospace"],
      },

      colors: {
        mycolor: "#ecf2f5",
        bgcolor: "#F9F9F9",
        background: "#ffffff",
        foreground: "#374151", // slate-700
        card: "#f0fdf4", // green-50
        "card-foreground": "#374151",
        popover: "#ffffff",
        "popover-foreground": "#374151",
        primary: "#15803d", // green-700
        "primary-foreground": "#ffffff",
        secondary: "#84cc16", // lime-500
        "secondary-foreground": "#374151",
        muted: "#f0fdf4", // green-50
        "muted-foreground": "#374151",
        accent: "#84cc16", // lime-500
        "accent-foreground": "#374151",
        destructive: "#ea580c", // orange-600
        "destructive-foreground": "#ffffff",
        foreground: "#374151",
        border: "#d1d5db", // gray-300
        input: "#f0fdf4", // green-50
        ring: "rgba(21, 128, 61, 0.3)", // green-700 / 30%
        "chart-1": "#84cc16", // lime-500
        "chart-2": "#15803d", // green-700
        "chart-3": "#ea580c", // orange-600
        "chart-4": "#4b5563", // gray-600
        "chart-5": "#f97316", // orange-500
        sidebar: "#f0fdf4", // green-50
        "sidebar-foreground": "#374151",
        "sidebar-primary": "#15803d",
        "sidebar-primary-foreground": "#ffffff",
        "sidebar-accent": "#84cc16",
        "sidebar-accent-foreground": "#374151",
        "sidebar-border": "#d1d5db",
        "sidebar-ring": "rgba(21, 128, 61, 0.3)",
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(236, 72, 153, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(236, 72, 153, 0.6)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
