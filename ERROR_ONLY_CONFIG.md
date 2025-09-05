# Datadog RUM - Error Tracking Only Configuration

## 🎯 **Current Setup: Error Tracking Only**

Your Datadog RUM is now configured to **only track errors** and minimize user behavior monitoring.

## ✅ **What's Enabled**

### **Error Tracking**

- ✅ JavaScript runtime errors (automatic)
- ✅ Network request errors (automatic)
- ✅ Custom error tracking with context
- ✅ Console errors and warnings
- ✅ Unhandled promise rejections

### **Minimal Session Data**

- ✅ Basic session information (for error correlation)
- ✅ Page views (manual only, for error context)
- ✅ User agent and browser info (for debugging)

## ❌ **What's Disabled**

### **User Monitoring Features**

- ❌ User click tracking (`trackUserInteractions: false`)
- ❌ Session replay (`sessionReplaySampleRate: 0`)
- ❌ Resource loading monitoring (`trackResources: false`)
- ❌ Performance monitoring (`trackLongTasks: false`)
- ❌ Custom action tracking (commented out in code)

### **Privacy Enhanced**

- 🔒 User input masking enabled (`mask-user-input`)
- 🔒 Manual view tracking for better control
- 🔒 No automatic behavior tracking

## 🔧 **Configuration Details**

### **Session Sampling**

```typescript
sessionSampleRate: 100 // Track all sessions (for error context)
sessionReplaySampleRate: 0 // No session replay recording
```

### **Tracking Features**

```typescript
trackUserInteractions: false // No click/form tracking
trackResources: false // No asset loading tracking
trackLongTasks: false // No performance tracking
trackViewsManually: true // Manual page view control
```

### **Error Tracking**

```typescript
// Still fully functional
addDatadogError(error, context) // ✅ Works
addDatadogAction(name, context) // ❌ Disabled (logs only)
```

## 📊 **What You'll See in Datadog**

### **In RUM Explorer → Errors**

- JavaScript errors with full stack traces
- Network errors with request details
- Custom errors with your business context
- Browser and environment information

### **What You WON'T See**

- User click patterns
- Session recordings
- Page load performance metrics
- Resource loading details
- Custom user actions

## 🧪 **Testing Error Tracking**

### **Test JavaScript Errors**

```javascript
// These will still be tracked
throw new Error("Test runtime error")
Promise.reject(new Error("Test promise rejection"))
console.error("Test console error")
```

### **Test Custom Errors**

```javascript
import { addDatadogError } from "./lib/datadog"

try {
	// Some operation
} catch (error) {
	addDatadogError(error, {
		component: "MyComponent",
		operation: "data_processing",
		userId: "user123",
	})
}
```

### **Search Form Testing**

Your search form still tracks errors perfectly:

- Network errors
- Validation errors
- JavaScript runtime errors
- All with custom context

## 🔄 **How to Re-enable Features**

If you want to enable specific features later:

### **Enable Session Replay**

```typescript
// In src/config/datadog.ts
sessionReplaySampleRate: 20 // 20% of sessions
```

### **Enable User Interactions**

```typescript
// In src/config/datadog.ts
trackUserInteractions: true
```

### **Enable Custom Actions**

```typescript
// In src/lib/datadog.ts - uncomment this line:
datadogRum.addAction(name, context)
```

## 🎯 **Benefits of Error-Only Configuration**

### **Privacy**

- ✅ Minimal user data collection
- ✅ No behavior tracking
- ✅ No session recordings

### **Performance**

- ✅ Lower bandwidth usage
- ✅ Reduced client-side processing
- ✅ Faster page loads

### **Cost**

- ✅ Lower Datadog usage costs
- ✅ Focused data collection
- ✅ Better signal-to-noise ratio

### **Compliance**

- ✅ GDPR/CCPA friendly
- ✅ Minimal PII collection
- ✅ Error-focused monitoring

## 🚨 **Error Monitoring Best Practices**

### **Add Context to Errors**

```javascript
addDatadogError(error, {
	feature: "payment_processing",
	step: "credit_card_validation",
	amount: 99.99,
	currency: "USD",
})
```

### **Use Error Boundaries**

```jsx
class ErrorBoundary extends React.Component {
	componentDidCatch(error, errorInfo) {
		addDatadogError(error, {
			component: "ErrorBoundary",
			componentStack: errorInfo.componentStack,
		})
	}
}
```

### **Monitor Critical Paths**

Focus error tracking on:

- User authentication
- Payment processing
- Data submission forms
- API integrations

Your error-only configuration is now active! 🎯
