// Datadog configuration for different environments
export interface DatadogConfig {
	applicationId: string
	clientToken: string
	site: string
	service: string
	env: string
	version: string
	sessionSampleRate: number
	sessionReplaySampleRate: number
}

// Default configuration (can be overridden by environment variables)
export const getDatadogConfig = (): DatadogConfig => {
	const config: DatadogConfig = {
		applicationId:
			import.meta.env.VITE_DATADOG_APPLICATION_ID ||
			"22053378-bd08-477d-b261-6069a6d6b1bb",
		clientToken:
			import.meta.env.VITE_DATADOG_CLIENT_TOKEN ||
			"pub4eb6a440f1f5ab8dbee356507e4fe974",
		site: import.meta.env.VITE_DATADOG_SITE || "us5.datadoghq.com",
		service: import.meta.env.VITE_DATADOG_SERVICE || "vite-app",
		env:
			import.meta.env.VITE_DATADOG_ENV || import.meta.env.MODE || "development",
		version: import.meta.env.VITE_APP_VERSION || "1.0.0",
		sessionSampleRate:
			Number(import.meta.env.VITE_DATADOG_SESSION_SAMPLE_RATE) ||
			getDefaultSampleRate(),
		sessionReplaySampleRate:
			Number(import.meta.env.VITE_DATADOG_SESSION_REPLAY_SAMPLE_RATE) ||
			getDefaultReplaySampleRate(),
	}

	return config
}

// Environment-specific default sample rates
const getDefaultSampleRate = (): number => {
	switch (import.meta.env.MODE) {
		case "production":
			return 100
		case "staging":
			return 100
		case "development":
		default:
			return 100
	}
}

const getDefaultReplaySampleRate = (): number => {
	switch (import.meta.env.MODE) {
		case "production":
			return 20
		case "staging":
			return 50
		case "development":
		default:
			return 20
	}
}

// Environment-specific configuration
export const datadogEnvironments = {
	development: {
		sessionSampleRate: 100,
		sessionReplaySampleRate: 100, // Higher rate for development
		trackUserInteractions: true,
		trackResources: true,
		trackLongTasks: true,
	},
	staging: {
		sessionSampleRate: 100,
		sessionReplaySampleRate: 50,
		trackUserInteractions: true,
		trackResources: true,
		trackLongTasks: true,
	},
	production: {
		sessionSampleRate: 100,
		sessionReplaySampleRate: 20,
		trackUserInteractions: true,
		trackResources: true,
		trackLongTasks: true,
	},
}
