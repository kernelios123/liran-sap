
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				nature: {
					'leaf': '#4CAF50',
					'moss': '#8BC34A',
					'forest': '#2E7D32',
					'sky': '#81D4FA',
					'stone': '#A1887F',
					'bark': '#795548',
					'sand': '#D7CCC8',
					'water': '#29B6F6',
					'sage': '#A8B9A7',
					'beige': '#F5F0E3',
					'cream': '#FFF9F0',
					'brown': '#8C6E5D',
					'parchment': '#F2ECD8',  // New color for parchment-like background
					'softgreen': '#E2E8DF',  // New complementary color for sidebar
					'softpurple': '#E5DEFF', // Alternative complementary color
					'softblue': '#D3E4FD'    // Alternative complementary color
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'leaf-sway': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'button-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(140, 110, 93, 0.2)' 
					},
					'50%': { 
						boxShadow: '0 0 15px rgba(140, 110, 93, 0.4)' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'leaf-sway': 'leaf-sway 6s ease-in-out infinite',
				'fade-in': 'fade-in 0.5s ease-out',
				'button-glow': 'button-glow 2s ease-in-out infinite'
			},
			fontFamily: {
				heading: ['Cormorant Garamond', 'serif'],
				body: ['Lato', 'sans-serif'],
				journal: ['Cormorant Garamond', 'serif']
			},
			backgroundImage: {
				'leaf-pattern': "url('/leaf-pattern.svg')",
				'parchment-leaves': "url('/lovable-uploads/01cbe06a-85f9-488f-b061-ccf3b867ba31.png')",
				'sage-gradient': 'linear-gradient(to right bottom, #A8B9A7, #d1dbd0)',
				'cream-gradient': 'linear-gradient(to right bottom, #FFF9F0, #F5F0E3)'
			},
			boxShadow: {
				'soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
				'glow': '0 0 15px rgba(140, 110, 93, 0.3)'
			},
			spacing: {
				'18': '4.5rem',
				'22': '5.5rem',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
