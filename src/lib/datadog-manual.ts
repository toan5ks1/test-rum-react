// Manual Datadog RUM initialization for troubleshooting
import { datadogRum } from "@datadog/browser-rum"

export const initializeDatadogManual = () => {
	console.log("🔧 Starting manual Datadog initialization...")

	// Check if already initialized
	if (datadogRum.getInitConfiguration()) {
		console.log("⚠️ Datadog already initialized")
		return
	}

	try {
		// Manual initialization with minimal configuration
		datadogRum.init({
			applicationId: "22053378-bd08-477d-b261-6069a6d6b1bb",
			clientToken: "pub4eb6a440f1f5ab8dbee356507e4fe974",
			site: "us5.datadoghq.com",
			service: "vite-app-manual",
			env: "development",
			version: "1.0.0",

			// Ensure 100% sampling
			sessionSampleRate: 100,
			sessionReplaySampleRate: 100,

			// Minimal tracking
			trackUserInteractions: true,
			trackResources: false,
			trackLongTasks: false,

			// Debug configuration
			beforeSend: (event: any) => {
				console.log("📤 [MANUAL] Datadog event:", event.type, event)
				return true
			},
		})

		console.log("✅ Manual Datadog initialization complete")

		// Start a view immediately
		datadogRum.startView("manual_test")
		console.log("📄 Manual view started")

		// Test immediately
		setTimeout(() => {
			console.log("🧪 Testing manual Datadog...")

			const actionResult = datadogRum.addAction("manual_test_action", {
				test: true,
				manual: true,
				timestamp: Date.now(),
			})
			console.log("Manual action result:", actionResult)

			const errorResult = datadogRum.addError(new Error("Manual test error"), {
				test: true,
				manual: true,
			})
			console.log("Manual error result:", errorResult)
		}, 500)
	} catch (error) {
		console.error("❌ Manual Datadog initialization failed:", error)
	}
}

// Test function you can call from console
export const testManualDatadog = () => {
	console.log("🧪 Manual test function called")

	const action = datadogRum.addAction("console_test_action", {
		source: "manual_console",
		timestamp: Date.now(),
	})
	console.log("Console action result:", action)

	const error = datadogRum.addError(new Error("Console test error"), {
		source: "manual_console",
	})
	console.log("Console error result:", error)

	// Make it available globally for testing
	;(window as any).testDatadog = testManualDatadog

	return { action, error }
}

// Make test function globally available
;(window as any).testManualDatadog = testManualDatadog
