# Datadog RUM Integration

This document explains the Datadog RUM (Real User Monitoring) integration implemented in this project.

## Overview

Datadog RUM has been integrated to provide comprehensive monitoring of user interactions, performance metrics, and error tracking in your React/Vite application.

## Configuration

### Files Structure

```
src/
├── lib/
│   └── datadog.ts          # Main Datadog initialization and helper functions
├── config/
│   └── datadog.ts          # Environment-specific configuration
└── components/
    └── datadog-test.tsx    # Test component for Datadog features
```

### Environment Variables

You can customize the Datadog configuration using environment variables:

```bash
# .env.local (create this file)
VITE_DATADOG_APPLICATION_ID=your-app-id
VITE_DATADOG_CLIENT_TOKEN=your-client-token
VITE_DATADOG_SITE=us5.datadoghq.com
VITE_DATADOG_SERVICE=your-service-name
VITE_DATADOG_ENV=development
VITE_APP_VERSION=1.0.0
VITE_DATADOG_SESSION_SAMPLE_RATE=100
VITE_DATADOG_SESSION_REPLAY_SAMPLE_RATE=20
```

## Features Enabled

### Automatic Tracking

- **Page Views**: Automatically tracked with React Router integration
- **User Interactions**: Clicks, form submissions, and other user actions
- **Resources**: API calls, images, stylesheets, and scripts
- **Long Tasks**: JavaScript tasks that block the main thread
- **Console Logs**: Console messages and errors

### Privacy Protection

- **Default Privacy Level**: `mask-user-input` - masks all user inputs by default
- **Configurable**: Can be adjusted per environment

### Session Replay

- **Development**: 100% sample rate for full debugging capability
- **Staging**: 50% sample rate for testing
- **Production**: 20% sample rate for performance balance

## Usage

### Basic Usage

The integration is automatically initialized when your app starts. No additional setup required for basic monitoring.

### Custom Tracking

```typescript
import {
	addDatadogAction,
	addDatadogAttribute,
	addDatadogError,
} from "@/lib/datadog"

// Track custom user actions
addDatadogAction("button_click", {
	buttonType: "primary",
	section: "header",
})

// Add custom attributes to all future events
addDatadogAttribute("user_tier", "premium")
addDatadogAttribute("feature_flags", ["new_ui", "beta_feature"])

// Track custom errors with context
try {
	// Some operation
} catch (error) {
	addDatadogError(error as Error, {
		component: "PaymentForm",
		operation: "process_payment",
	})
}
```

### User Identification

Uncomment and customize the user identification in `src/lib/datadog.ts`:

```typescript
datadogRum.setUser({
	id: "user-123",
	name: "John Doe",
	email: "john@example.com",
	plan: "premium",
})
```

## Testing

A test component (`DatadogTest`) has been added to the home page with buttons to test various Datadog features:

1. **Track Custom Action**: Tests custom action tracking
2. **Add Custom Attributes**: Tests custom attribute addition
3. **Test Error Tracking**: Tests error tracking functionality
4. **Test Console Logs**: Tests console log capture

## Environment-Specific Configuration

### Development

- High sample rates for comprehensive debugging
- All tracking features enabled
- Verbose console logging

### Staging

- Moderate sample rates for testing
- All tracking features enabled
- Error tracking optimized

### Production

- Optimized sample rates for performance
- All tracking features enabled
- Error tracking and user monitoring focused

## Monitoring Dashboard

Access your Datadog RUM dashboard at:

- **US5**: https://us5.datadoghq.com/rum/explorer
- **Other regions**: Replace `us5` with your region

### Key Metrics to Monitor

1. **Page Load Performance**

   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Core Web Vitals

2. **User Interactions**

   - Click events
   - Form submissions
   - Navigation patterns

3. **Errors**

   - JavaScript errors
   - Network failures
   - Console errors

4. **Performance**
   - Resource loading times
   - Long tasks
   - Memory usage

## Troubleshooting

### Common Issues

1. **Datadog not initializing**

   - Check browser console for errors
   - Verify application ID and client token
   - Ensure the service is properly configured

2. **Missing data in dashboard**

   - Check sample rates (may be set too low)
   - Verify environment configuration
   - Check network connectivity to Datadog

3. **Performance impact**
   - Adjust sample rates for production
   - Review enabled tracking features
   - Consider privacy level settings

### Debug Mode

Enable debug mode in development by adding to your configuration:

```typescript
// In development environment
if (import.meta.env.DEV) {
	window.DD_RUM && window.DD_RUM.setGlobalProperty("debug", true)
}
```

## Security Considerations

- Client tokens are safe to expose in frontend code
- Sensitive user data is masked by default
- Review and adjust privacy levels as needed
- Consider GDPR compliance requirements

## Performance Impact

- Minimal impact on application performance
- Asynchronous data collection
- Configurable sample rates to balance monitoring vs. performance
- Resource loading is optimized and non-blocking
