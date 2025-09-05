# Datadog RUM Troubleshooting Guide

## 🚨 Issue: No Data Appearing in Datadog Dashboard

Based on investigation, your Datadog RUM is properly initialized but no network requests are being sent to Datadog servers.

## 🔍 **Current Status**

- ✅ Datadog RUM initialized successfully
- ✅ Configuration is correct (application ID, client token, site)
- ✅ Events are being triggered in browser
- ❌ No network requests to Datadog servers
- ❌ No data appearing in dashboard

## 🛠️ **Troubleshooting Steps**

### **Step 1: Check Browser Console**

1. Open your browser at `http://localhost:5174`
2. Open Developer Tools (F12) → Console tab
3. Look for:
   - ✅ `Datadog RUM initialized successfully for development environment`
   - 📤 `Datadog event being sent:` messages (after our debugging update)
   - ❌ Any error messages

### **Step 2: Check Network Tab**

1. Open Developer Tools → Network tab
2. Interact with your app (click buttons, navigate)
3. Look for requests to:
   - `browser-intake-datadoghq.com`
   - `rum-http-intake.logs.us5.datadoghq.com`
   - Any URLs containing `datadoghq.com`

### **Step 3: Manual Debugging**

Open browser console and run:

```javascript
// Check if Datadog is working
window.debugDatadog && window.debugDatadog()

// Or access the debug function directly
import { debugDatadog } from "./src/lib/datadog"
debugDatadog()
```

### **Step 4: Force Manual Events**

In browser console, try:

```javascript
// Manual event triggering
window.DD_RUM.addAction("manual_test", { test: true })
window.DD_RUM.addError(new Error("Test error"), { manual: true })
window.DD_RUM.startView("test_view")
```

## 🔧 **Common Solutions**

### **Solution 1: Check Application Credentials**

Verify your Datadog credentials in `/src/config/datadog.ts`:

```typescript
applicationId: "22053378-bd08-477d-b261-6069a6d6b1bb" // ✅ Correct
clientToken: "pub4eb6a440f1f5ab8dbee356507e4fe974" // ✅ Correct
site: "us5.datadoghq.com" // ✅ Correct
```

### **Solution 2: Check Network/Firewall**

Ensure these domains are accessible:

- `browser-intake-datadoghq.com`
- `rum-http-intake.logs.us5.datadoghq.com`
- `session-replay-datadoghq.com`

### **Solution 3: Sampling Rate**

Try setting 100% sampling temporarily:

```typescript
sessionSampleRate: 100,
sessionReplaySampleRate: 100,
```

### **Solution 4: Manual View Start**

React Router integration might need manual view starting:

```javascript
// Add to your app
import { startView } from "./lib/datadog"

// Manually start views
useEffect(() => {
	startView("home_page")
}, [])
```

### **Solution 5: Environment Configuration**

Check if environment variables are overriding settings:

```bash
# Create .env.local file
VITE_DATADOG_APPLICATION_ID=22053378-bd08-477d-b261-6069a6d6b1bb
VITE_DATADOG_CLIENT_TOKEN=pub4eb6a440f1f5ab8dbee356507e4fe974
VITE_DATADOG_SITE=us5.datadoghq.com
VITE_DATADOG_SERVICE=vite-app
VITE_DATADOG_ENV=development
```

## 🚀 **Next Steps**

### **Immediate Actions:**

1. **Refresh your app** to get the debugging updates
2. **Open browser console** and look for `📤 Datadog event being sent:` messages
3. **Click some buttons** to trigger events
4. **Check Network tab** for Datadog requests

### **If Still No Data:**

1. **Wait 5-10 minutes** - Initial data can take time to appear
2. **Check Datadog Live Tail** in your dashboard
3. **Try production build** - some issues only appear in development
4. **Contact Datadog support** with your application ID

### **Alternative Testing:**

1. **Deploy to production** and test there
2. **Use different browser** (disable ad blockers)
3. **Test from different network** (corporate firewalls can block)

## 📊 **Expected Timeline**

- **Immediate**: Console messages showing events
- **30 seconds**: Network requests to Datadog
- **2-5 minutes**: Data appearing in Live Tail
- **5-15 minutes**: Data in RUM Explorer

## 🆘 **If Nothing Works**

Create a minimal test case:

```html
<!doctype html>
<html>
	<head>
		<script src="https://www.datadoghq-browser-agent.com/us5/v4/datadog-rum-us5.js"></script>
		<script>
			window.DD_RUM &&
				window.DD_RUM.init({
					applicationId: "22053378-bd08-477d-b261-6069a6d6b1bb",
					clientToken: "pub4eb6a440f1f5ab8dbee356507e4fe974",
					site: "us5.datadoghq.com",
					service: "test-app",
					env: "development",
					sessionSampleRate: 100,
					trackUserInteractions: true,
				})
		</script>
	</head>
	<body>
		<button onclick="window.DD_RUM.addAction('test_click')">Test Click</button>
	</body>
</html>
```

Save this as `test.html` and open it directly to isolate the issue.

## 📞 **Get Help**

If data still doesn't appear:

1. **Datadog Support**: Include your application ID and this troubleshooting log
2. **Datadog Community**: Share your configuration (without sensitive tokens)
3. **Check Status Page**: https://status.datadoghq.com/ for service issues
