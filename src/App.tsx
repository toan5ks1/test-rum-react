import { SiteHeader } from "@/components/site-header"
import { useRoutes } from "react-router-dom"
import { TailwindIndicator } from "./components/tailwind-indicator"
import Home from "./pages/home"
import SearchPage from "./pages/search"
import ConsoleTestPage from "./pages/console-test"
import TraceTestPage from "./pages/trace-test"

const routes = [
	{ path: "/", element: <Home /> },
	{ path: "/search", element: <SearchPage /> },
	{ path: "/console-test", element: <ConsoleTestPage /> },
	{ path: "/trace-test", element: <TraceTestPage /> },
]

function App() {
	const children = useRoutes(routes)

	return (
		<>
			<div className="relative flex min-h-screen flex-col">
				<SiteHeader />
				<div className="flex-1">{children}</div>
			</div>
			<TailwindIndicator />
		</>
	)
}

export default App
