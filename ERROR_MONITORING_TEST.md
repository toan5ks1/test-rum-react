# Error Monitoring Test Guide

This guide explains how to test Datadog RUM error monitoring using the search form component.

## Overview

I've created a comprehensive search form that demonstrates various error scenarios and tracks them with Datadog RUM. This allows you to test and verify that error monitoring is working correctly.

## Features

### 🔍 **Search Form with Query Parameters**

- **URL Integration**: Search queries are stored in URL parameters (`?q=search-term`)
- **State Management**: Form maintains state between navigation and page refreshes
- **Real-time Updates**: URL updates as you search

### 🚨 **Error Scenarios**

#### **API Error Simulation**

1. **Network Error** - Simulates network connectivity issues
2. **Timeout Error** - Simulates request timeout scenarios
3. **Validation Error** - Simulates server-side validation failures
4. **Server Error** - Simulates internal server errors (500)
5. **Authentication Error** - Simulates authentication/authorization failures

#### **JavaScript Runtime Errors**

1. **JSON Parse Error** - Simulates malformed API responses
2. **Reference Error** - Simulates undefined variable access
3. **Type Error** - Simulates null/undefined method calls

### 📊 **Datadog Tracking**

#### **Automatic Error Tracking**

Every error is automatically tracked with rich context:

```javascript
addDatadogError(error, {
	component: "SearchForm",
	action: "search_api_call",
	query: searchQuery,
	errorType: errorType,
	errorName: error.name,
	timestamp: new Date().toISOString(),
	userAgent: navigator.userAgent,
	url: window.location.href,
})
```

#### **Custom Action Tracking**

- **Search Initiated**: Tracks when user starts a search
- **Search Completed**: Tracks successful searches with result count
- **Search Failed**: Tracks failed searches with error details

#### **Custom Attributes**

- **last_search_query**: Latest search term
- **search_timestamp**: When the search was performed

## How to Test

### 🌐 **Access the Test Page**

1. **Navigation**: Use the top navigation "Error Monitoring Test" link
2. **Direct URL**: Visit `/search` directly
3. **Home Page Button**: Click "🔍 Test Error Monitoring with Search" on home page

### 🧪 **Testing Steps**

#### **1. Basic Search Testing**

```
1. Navigate to /search
2. Enter a normal search term (e.g., "test query")
3. Click "Search" - should show mock results
4. Check Datadog for successful search tracking
```

#### **2. API Error Testing**

```
1. Click any of the colored error buttons:
   - Network Error
   - Timeout Error
   - Validation Error
   - Server Error
   - Auth Error
   - JSON Error
2. Observe the error message displayed
3. Check Datadog dashboard for error events
```

#### **3. JavaScript Error Testing**

```
1. Click the red error buttons:
   - Reference Error
   - Type Error
2. These will trigger JavaScript runtime errors
3. Check Datadog for JavaScript error tracking
```

#### **4. URL Parameter Testing**

```
1. Try direct URLs with query parameters:
   - /search?q=test
   - /search?q=network-error&error_type=network
2. Verify the form loads with the query pre-filled
3. Check that searches are automatically triggered
```

### 📱 **What to Look For in Datadog**

#### **Error Events**

- Navigate to RUM Explorer → Errors
- Filter by `@error.source:custom` for our tracked errors
- Look for errors with component: "SearchForm"

#### **Custom Actions**

- Navigate to RUM Explorer → Actions
- Filter by action names:
  - `search_initiated`
  - `search_completed`
  - `search_failed`

#### **Error Context**

Each error should include:

- Search query that caused the error
- Error type and name
- Component and action context
- Timestamp and user agent
- Current URL

## Error Types and Expected Behavior

### **Handled API Errors**

- **Display**: User-friendly error message
- **Tracking**: Full error context in Datadog
- **Recovery**: User can retry search

### **JavaScript Runtime Errors**

- **Display**: Technical error message
- **Tracking**: Stack trace and context in Datadog
- **Recovery**: Page remains functional

### **Validation Errors**

- **Display**: Clear validation message
- **Tracking**: Validation failure context
- **Recovery**: User guided to correct input

## Advanced Testing Scenarios

### **1. Search Flow Testing**

```bash
# Test complete search flow
1. /search?q=valid-query → successful search
2. /search?q=network-error → API error
3. /search?q=reference-error → JS error
4. Check Datadog for complete user journey
```

### **2. Error Recovery Testing**

```bash
# Test error recovery
1. Trigger any error
2. Perform successful search
3. Verify both events are tracked
4. Check user session continuity
```

### **3. URL State Testing**

```bash
# Test URL parameter handling
1. Navigate with direct URL: /search?q=test&error_type=timeout
2. Verify form populates and triggers search
3. Check error is properly simulated
4. Verify URL updates on new searches
```

## Datadog Dashboard Setup

### **Recommended Filters**

```
# Filter for search-related events
@action.name:search_*

# Filter for search form errors
@error.source:custom AND component:SearchForm

# Filter for specific error types
@context.errorType:NetworkError
```

### **Custom Dashboards**

Create dashboards to monitor:

1. **Search Success Rate**: `search_completed` vs `search_failed`
2. **Error Types Distribution**: Group by `@context.errorType`
3. **Search Query Analysis**: Top queries causing errors
4. **User Journey**: Complete search session flows

## Troubleshooting

### **If Errors Aren't Appearing in Datadog**

1. Check browser console for Datadog initialization
2. Verify network tab shows requests to Datadog
3. Check sample rates in configuration
4. Ensure correct application ID and client token

### **If Search Form Isn't Working**

1. Check browser console for JavaScript errors
2. Verify all components are properly imported
3. Check React Router configuration
4. Ensure URL parameters are properly handled

## Code Structure

```
src/
├── components/
│   └── search-form.tsx       # Main search component
├── pages/
│   └── search/
│       └── index.tsx         # Search page wrapper
├── lib/
│   └── datadog.ts           # Datadog helper functions
└── config/
    └── datadog.ts           # Datadog configuration
```

This comprehensive test setup allows you to verify that Datadog RUM is properly capturing and contextualizing errors in your application!
