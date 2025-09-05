export type SiteConfig = typeof siteConfig

export const siteConfig = {
	name: "Vite",
	description:
		"Beautifully designed components built with Radix UI and Tailwind CSS.",
	mainNav: [
		{
			title: "Home",
			href: "/",
		},
		{
			title: "Error Monitoring Test",
			href: "/search",
		},
		{
			title: "Console Capture Test",
			href: "/console-test",
		},
		{
			title: "Trace Test",
			href: "/trace-test",
		},
	],
	links: {
		youtube: "https://youtube.com/@m6io",
		github: "https://github.com/m6io/shadcn-vite-template",
		docs: "https://ui.shadcn.com",
	},
}
