# Console Capture Test Guide

## 🎯 **Purpose**

Test exactly which console methods are captured by Datadog RUM to address team concerns about data collection.

## 🧪 **Test Page Created**

Navigate to: **`/console-test`** or use the "Console Capture Test" navigation link.

## 📋 **What We're Testing**

### **Console Methods**

- `console.log()` - General logging
- `console.info()` - Information messages
- `console.warn()` - Warning messages
- `console.error()` - Error messages
- `console.debug()` - Debug messages
- `console.trace()` - Stack traces

### **Data Types**

- Simple strings
- Complex objects
- **Sensitive data simulation** (emails, tokens, credit cards)

## 🔬 **Testing Process**

### **Step 1: Trigger Console Messages**

1. Go to `/console-test`
2. Click individual console method buttons
3. Or click "Test All Console Methods" for batch testing
4. **⚠️ Use "Test with Sensitive Data" to see privacy implications**

### **Step 2: Check Browser Console**

1. Open Developer Tools → Console
2. Verify all messages appear in browser console
3. Note the different message types and colors

### **Step 3: Check Datadog RUM**

1. Wait 2-5 minutes for data transmission
2. Go to Datadog RUM Explorer → Errors
3. Look for console messages with timestamps matching your tests
4. Check what data is captured vs what's missing

### **Step 4: Check Datadog Logs (if applicable)**

1. Go to Datadog Log Explorer
2. Search for console messages
3. Compare what appears in RUM vs Logs

## 🔍 **What to Look For**

### **In Datadog RUM Explorer**

Filter by:

```
@type:console_error
@type:console_warning
@type:console_log
```

### **Expected Results**

Based on documentation:

- ✅ `console.error()` - Should appear
- ✅ `console.warn()` - Should appear
- ❓ `console.log()` - **This is what we're testing**
- ❓ `console.info()` - **This is what we're testing**
- ❓ `console.debug()` - **This is what we're testing**

### **Sensitive Data Check**

Look for:

- Email addresses
- Credit card numbers
- API keys/tokens
- SSN numbers
- Passwords

## 📊 **Results Documentation**

After testing, document:

### **Captured by RUM**

- [ ] console.log()
- [ ] console.info()
- [ ] console.warn()
- [ ] console.error()
- [ ] console.debug()
- [ ] console.trace()

### **Data Sensitivity**

- [ ] Simple strings captured
- [ ] Complex objects captured
- [ ] Sensitive data exposed
- [ ] Data sanitization needed

## ⚠️ **Privacy Implications**

### **If console.log() IS captured:**

- **Risk**: Development debug statements with sensitive data
- **Action**: Audit codebase for console.log statements
- **Solution**: Remove or sanitize production console logs

### **If console.log() is NOT captured:**

- **Good**: Only intentional error logging is monitored
- **Action**: Continue current practices

## 🛠️ **Remediation Options**

### **Option 1: Code Audit**

```bash
# Search for console statements in codebase
grep -r "console\." src/
```

### **Option 2: Production Filtering**

```javascript
// Remove console logs in production
if (process.env.NODE_ENV === "production") {
	console.log = () => {}
	console.info = () => {}
	console.debug = () => {}
}
```

### **Option 3: Secure Logging**

```javascript
// Safe logging wrapper
const logger = {
	log: (message) => {
		if (process.env.NODE_ENV === "development") {
			console.log(message)
		}
	},
	error: (error, context) => {
		// Always log errors (captured by RUM)
		console.error(error)
		// Add custom context
		addDatadogError(error, context)
	},
}
```

## 📝 **Test Results Template**

```markdown
## Console Capture Test Results

**Test Date:** [DATE]
**Datadog RUM Version:** 6.17.0
**Environment:** Development

### Captured Methods:

- console.log(): ✅/❌
- console.info(): ✅/❌
- console.warn(): ✅/❌
- console.error(): ✅/❌
- console.debug(): ✅/❌
- console.trace(): ✅/❌

### Sensitive Data Exposure:

- Email addresses: ✅/❌
- API tokens: ✅/❌
- Credit card numbers: ✅/❌

### Recommendations:

- [ ] Audit codebase for console statements
- [ ] Implement production log filtering
- [ ] Update team guidelines
- [ ] Document findings for compliance
```

## 🎯 **Next Steps**

1. **Run the test** and document results
2. **Share findings** with your teammate
3. **Implement remediation** if needed
4. **Update team practices** based on results

This empirical testing will give you definitive answers about what Datadog RUM actually captures vs what the documentation suggests.


