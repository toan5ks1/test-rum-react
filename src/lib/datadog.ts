import { datadogRum } from "@datadog/browser-rum"
import { reactPlugin } from "@datadog/browser-rum-react"
import { getDatadogConfig, datadogEnvironments } from "../config/datadog"

// Datadog RUM configuration
export const initializeDatadog = () => {
	// Only initialize if we haven't already and we're in a browser environment
	if (typeof window === "undefined" || datadogRum.getInitConfiguration()) {
		return
	}

	const config = getDatadogConfig()
	const envConfig =
		datadogEnvironments[config.env as keyof typeof datadogEnvironments] ||
		datadogEnvironments.development

	datadogRum.init({
		applicationId: config.applicationId,
		clientToken: config.clientToken,
		site: config.site as any, // Type assertion for site compatibility
		service: config.service,
		env: config.env,

		// Specify a version number to identify the deployed version of your application in Datadog
		version: config.version,

		// Session configuration
		sessionSampleRate: config.sessionSampleRate,
		sessionReplaySampleRate: config.sessionReplaySampleRate,
		defaultPrivacyLevel: "mask",

		// Tracking configuration from environment
		trackUserInteractions: envConfig.trackUserInteractions,
		trackResources: envConfig.trackResources,
		trackLongTasks: envConfig.trackLongTasks,

		// React router integration - try without automatic router tracking
		plugins: [reactPlugin()],

		// Distributed tracing configuration
		allowedTracingUrls: [
			window.location.origin,
			// Add your API endpoints here for trace header injection
			"https://jsonplaceholder.typicode.com", // Test API
			"https://httpbin.org", // HTTP testing service
			"https://api.github.com", // GitHub API for testing
			/.*/, // Allow all URLs for testing (remove in production)
		],

		// Enable distributed tracing
		enableDistributedTracing: true,

		// Trace sampling (100% for testing)
		traceSampleRate: 100,

		// Force immediate transmission for debugging
		beforeSend: (event: any) => {
			console.log("📤 Datadog event being sent:", event)
			return true
		},
	})

	// Set user information if available (optional)
	// datadogRum.setUser({
	//   id: 'user-id',
	//   name: 'user-name',
	//   email: 'user@example.com'
	// });

	// Start the initial view manually for React Router
	datadogRum.startView("home")

	console.log(
		`Datadog RUM initialized successfully for ${config.env} environment`,
	)

	// Force session start and test event
	setTimeout(() => {
		console.log("🧪 Testing Datadog RUM after initialization...")
		const testResult = datadogRum.addAction("initialization_test", {
			test: true,
			timestamp: Date.now(),
		})
		console.log("Test action result:", testResult)

		// Check session info
		console.log("Session info:", {
			sessionId: (window as any).DD_RUM?.getInternalContext?.()?.session_id,
			isActive: (window as any).DD_RUM?.getInitConfiguration?.() !== undefined,
		})
	}, 1000)
}

// Helper function to add custom attributes
export const addDatadogAttribute = (key: string, value: any) => {
	datadogRum.setGlobalContextProperty(key, value)
}

// Helper function to add custom action
export const addDatadogAction = (name: string, context?: object) => {
	datadogRum.addAction(name, context)
}

// Helper function to add custom error
export const addDatadogError = (error: Error, context?: object) => {
	datadogRum.addError(error, context)
}

// Helper function to manually start a view (for debugging)
export const startView = (name: string) => {
	datadogRum.startView(name)
}

// Helper function to check if events are being captured
export const debugDatadog = () => {
	console.log("🔍 Datadog Debug Info:")
	console.log("- Initialized:", !!datadogRum.getInitConfiguration())
	console.log("- Configuration:", datadogRum.getInitConfiguration())

	// Trigger test events
	datadogRum.addAction("debug_test_action", { timestamp: Date.now() })
	datadogRum.addError(new Error("Debug test error"), { debug: true })
	datadogRum.setGlobalContextProperty("debug_test", true)

	console.log("✅ Debug events triggered")
}
