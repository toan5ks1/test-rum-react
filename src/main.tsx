import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

import { BrowserRouter as Router } from "react-router-dom"
import { initializeDatadog } from "./lib/datadog"

// Initialize Datadog RUM for error tracking only
initializeDatadog()

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>,
)
