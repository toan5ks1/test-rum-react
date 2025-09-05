import { Button } from "./ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card"

export function ConsoleTest() {
	const testConsoleLog = () => {
		console.log(
			"🟢 TEST: console.log() - User clicked button at",
			new Date().toISOString(),
		)
		console.log("🟢 TEST: console.log() with object:", {
			userId: "12345",
			action: "button_click",
			sensitiveData: "credit_card_1234567890",
		})
	}

	const testConsoleInfo = () => {
		console.info("🔵 TEST: console.info() - API response received")
		console.info("🔵 TEST: console.info() with data:", {
			endpoint: "/api/users",
			responseTime: "150ms",
			userEmail: "test@example.com",
		})
	}

	const testConsoleWarn = () => {
		console.warn("🟡 TEST: console.warn() - Deprecated API usage")
		console.warn("🟡 TEST: console.warn() with context:", {
			feature: "old_payment_api",
			replacement: "new_payment_api_v2",
			userToken: "secret_token_abc123",
		})
	}

	const testConsoleError = () => {
		console.error("🔴 TEST: console.error() - Payment processing failed")
		console.error("🔴 TEST: console.error() with error object:", {
			error: "PAYMENT_FAILED",
			userId: "user_67890",
			amount: 99.99,
			cardNumber: "4111-1111-1111-1111",
		})
	}

	const testConsoleDebug = () => {
		console.debug("🟣 TEST: console.debug() - Debug information")
		console.debug("🟣 TEST: console.debug() with debug data:", {
			debugLevel: "verbose",
			sessionId: "session_xyz789",
			internalData: "sensitive_debug_info",
		})
	}

	const testConsoleTrace = () => {
		console.trace("🔍 TEST: console.trace() - Stack trace test")
	}

	const testAllAtOnce = () => {
		console.log("=== BATCH TEST START ===")
		testConsoleLog()
		testConsoleInfo()
		testConsoleWarn()
		testConsoleError()
		testConsoleDebug()
		testConsoleTrace()
		console.log("=== BATCH TEST END ===")
	}

	const testWithSensitiveData = () => {
		const sensitiveUserData = {
			email: "john.doe@company.com",
			ssn: "123-45-6789",
			creditCard: "4111-1111-1111-1111",
			apiKey: "sk_live_abc123xyz789",
			password: "mySecretPassword123",
		}

		console.log("🚨 SENSITIVE DATA TEST:", sensitiveUserData)
		console.info("🚨 SENSITIVE INFO:", { userToken: "bearer_token_secret" })
		console.warn("🚨 SENSITIVE WARN:", {
			databaseUrl: "postgres://user:pass@db.com",
		})
		console.error("🚨 SENSITIVE ERROR:", { errorDetails: sensitiveUserData })
	}

	return (
		<Card className="w-full max-w-2xl">
			<CardHeader>
				<CardTitle>Console Capture Test</CardTitle>
				<CardDescription>
					Test which console methods are captured by Datadog RUM. Check your
					Datadog dashboard after clicking these buttons.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Individual Console Tests */}
				<div className="grid grid-cols-2 gap-2 md:grid-cols-3">
					<Button onClick={testConsoleLog} variant="outline" size="sm">
						console.log()
					</Button>
					<Button onClick={testConsoleInfo} variant="outline" size="sm">
						console.info()
					</Button>
					<Button onClick={testConsoleWarn} variant="outline" size="sm">
						console.warn()
					</Button>
					<Button onClick={testConsoleError} variant="outline" size="sm">
						console.error()
					</Button>
					<Button onClick={testConsoleDebug} variant="outline" size="sm">
						console.debug()
					</Button>
					<Button onClick={testConsoleTrace} variant="outline" size="sm">
						console.trace()
					</Button>
				</div>

				{/* Batch Tests */}
				<div className="space-y-2">
					<Button onClick={testAllAtOnce} className="w-full">
						🧪 Test All Console Methods
					</Button>
					<Button
						onClick={testWithSensitiveData}
						variant="destructive"
						className="w-full"
					>
						⚠️ Test with Sensitive Data
					</Button>
				</div>

				{/* Instructions */}
				<div className="rounded bg-muted p-4 text-sm">
					<h4 className="mb-2 font-semibold">Testing Instructions:</h4>
					<ol className="list-inside list-decimal space-y-1">
						<li>Click the buttons above to trigger console messages</li>
						<li>
							Open your browser's Developer Tools → Console to see the messages
						</li>
						<li>Wait 2-5 minutes for data to appear in Datadog</li>
						<li>
							Check Datadog RUM Explorer → Errors for captured console messages
						</li>
						<li>
							Check Datadog Log Explorer (if you have log collection enabled)
						</li>
					</ol>
				</div>

				{/* Current Time Display */}
				<div className="rounded bg-blue-50 p-2 text-xs text-blue-700">
					<strong>Test Timestamp:</strong> {new Date().toISOString()}
				</div>
			</CardContent>
		</Card>
	)
}


