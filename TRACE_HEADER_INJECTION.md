# Datadog RUM Automatic Trace Header Injection

## 🎯 **What This Tests**

The **automatic injection** of distributed tracing headers by Datadog RUM SDK into outgoing HTTP requests.

## 🔧 **Configuration Enabled**

```javascript
// In src/lib/datadog.ts
datadogRum.init({
	// Enable distributed tracing
	enableDistributedTracing: true,

	// 100% trace sampling for testing
	traceSampleRate: 100,

	// URLs that will get trace headers injected
	allowedTracingUrls: [
		window.location.origin,
		"https://jsonplaceholder.typicode.com",
		"https://httpbin.org",
		"https://api.github.com",
		/.*/, // All URLs for testing
	],
})
```

## 🧪 **How to Test**

### **Step 1: Open Network Tab**

1. Go to `/trace-test`
2. **Open Browser DevTools → Network tab FIRST**
3. Clear existing requests

### **Step 2: Make Test Requests**

1. Click any test button (JSONPlaceholder, HTTPBin, etc.)
2. Watch the Network tab for new requests

### **Step 3: Inspect Headers**

1. **Click on the request** in Network tab
2. **Go to Headers tab**
3. **Scroll to "Request Headers" section**
4. **Look for automatically injected headers:**

## 🔍 **Headers to Look For**

The SDK automatically injects these headers:

```
x-datadog-trace-id: 1234567890123456789
x-datadog-parent-id: 9876543210987654321
x-datadog-sampling-priority: 1
traceparent: 00-1234567890123456789abcdef01234567-9876543210987654-01
```

## ✅ **What You Should See**

### **In Network Tab Request Headers:**

```
GET https://jsonplaceholder.typicode.com/posts/1

Request Headers:
  Content-Type: application/json
  X-Test-Request: datadog-trace-test
  x-datadog-trace-id: 1234567890123456789    ← Automatically injected
  x-datadog-parent-id: 9876543210987654321   ← Automatically injected
  x-datadog-sampling-priority: 1             ← Automatically injected
  traceparent: 00-12345...                   ← W3C standard
```

## 🚫 **What You CAN'T See**

- **JavaScript cannot access these headers** - they're injected at the network level
- **Response headers don't contain trace info** - only request headers do
- **Console.log won't show them** - only visible in DevTools Network tab

## 🎯 **Key Points**

1. **Automatic**: No manual header setting required
2. **Transparent**: Happens behind the scenes
3. **Configurable**: Only for URLs in `allowedTracingUrls`
4. **Standards**: Supports both Datadog and W3C trace context
5. **Sampling**: Controlled by `traceSampleRate`

## 🔗 **End-to-End Tracing**

These headers enable:

- **Request correlation** across services
- **Distributed trace visualization** in Datadog APM
- **Performance monitoring** across your stack
- **Error correlation** between frontend and backend

## 🧪 **Test Different Scenarios**

The test page includes:

- **GET requests** (JSONPlaceholder, GitHub API)
- **POST requests** (with body data)
- **Different domains** (to test allowedTracingUrls)
- **Error scenarios** (to see if headers are still injected)

## 📊 **Verification**

**Success indicators:**

- ✅ Request appears in Network tab
- ✅ Request Headers section shows Datadog headers
- ✅ Headers have valid trace ID format
- ✅ Headers are consistent across requests in same session

**The magic happens automatically - just make HTTP requests and check the Network tab!** 🪄
