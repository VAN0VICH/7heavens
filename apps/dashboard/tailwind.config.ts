import type { Config } from "tailwindcss";
import baseConfig from "@7heavens/tailwind-config/web";

export default {
	content: ["./app/**/*.{ts,tsx}", "../../packages/ui/src/*.{ts,tsx}"],
	presets: [baseConfig],
	theme: {
		extend: {
			fontFamily: {
				display: ["Freeman", "sans-serif"],
				body: ["Roboto", "sans-serif"],
				roboto: ["Roboto", "sans-serif"],
				freeman: ["Freeman", "sans-serif"],
			},
		},
	},
} satisfies Config;
