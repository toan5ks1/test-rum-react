import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface TraceTestResult {
  url: string;
  method: string;
  status: number;
  response?: any;
  error?: string;
  timestamp: string;
  duration?: number;
}

export function TraceTest() {
  const [results, setResults] = useState<TraceTestResult[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  // Note: We can't directly inspect injected headers from JavaScript
  // The SDK automatically injects headers into outgoing requests
  // We can only verify this through browser DevTools Network tab

  // Helper function to make traced request
  // The SDK will automatically inject trace headers into this request
  const makeTracedRequest = async (
    url: string,
    method: string = "GET",
    body?: any
  ): Promise<TraceTestResult> => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      // Simple fetch - SDK will automatically inject trace headers
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Test-Request": "datadog-trace-test",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Try to get response data
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      return {
        url,
        method,
        status: response.status,
        response: responseData,
        timestamp,
        duration,
      };
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      return {
        url,
        method,
        status: 0,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp,
        duration,
      };
    }
  };

  // Test different API endpoints
  const testJsonPlaceholder = async () => {
    setLoading("jsonplaceholder");
    try {
      const result = await makeTracedRequest(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      setResults((prev) => [result, ...prev]);
    } finally {
      setLoading(null);
    }
  };

  const testHttpBin = async () => {
    setLoading("httpbin");
    try {
      const result = await makeTracedRequest("https://httpbin.org/headers");
      setResults((prev) => [result, ...prev]);
    } finally {
      setLoading(null);
    }
  };

  const testPostRequest = async () => {
    setLoading("post");
    try {
      const result = await makeTracedRequest(
        "https://jsonplaceholder.typicode.com/posts",
        "POST",
        {
          title: "Trace Test Post",
          body: "Testing distributed tracing with POST request",
          userId: 1,
        }
      );
      setResults((prev) => [result, ...prev]);
    } finally {
      setLoading(null);
    }
  };

  // Test Axios POST request
  const testAxiosPost = async () => {
    setLoading("axios-post");
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
          title: "Axios Trace Test",
          body: "Testing distributed tracing with Axios POST",
          userId: 1,
        },
        {
          headers: {
            "X-Test-Request": "axios-trace-test",
            "X-Request-Type": "axios-post",
          },
        }
      );

      const duration = Date.now() - startTime;
      const result: TraceTestResult = {
        url: "https://jsonplaceholder.typicode.com/posts",
        method: "POST (Axios)",
        status: response.status,
        response: response.data,
        timestamp,
        duration,
      };

      setResults((prev) => [result, ...prev]);
    } catch (error) {
      const duration = Date.now() - startTime;
      const result: TraceTestResult = {
        url: "https://jsonplaceholder.typicode.com/posts",
        method: "POST (Axios)",
        status: 0,
        error: error instanceof Error ? error.message : "Axios request failed",
        timestamp,
        duration,
      };
      setResults((prev) => [result, ...prev]);
    } finally {
      setLoading(null);
    }
  };

  // Test Axios GET request
  const testAxiosGet = async () => {
    setLoading("axios-get");
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      const response = await axios.get("https://httpbin.org/headers", {
        headers: {
          "X-Test-Request": "axios-trace-test",
          "X-Request-Type": "axios-get",
        },
      });

      const duration = Date.now() - startTime;
      const result: TraceTestResult = {
        url: "https://httpbin.org/headers",
        method: "GET (Axios)",
        status: response.status,
        response: response.data,
        timestamp,
        duration,
      };

      setResults((prev) => [result, ...prev]);
    } catch (error) {
      const duration = Date.now() - startTime;
      const result: TraceTestResult = {
        url: "https://httpbin.org/headers",
        method: "GET (Axios)",
        status: 0,
        error: error instanceof Error ? error.message : "Axios request failed",
        timestamp,
        duration,
      };
      setResults((prev) => [result, ...prev]);
    } finally {
      setLoading(null);
    }
  };

  // Test XMLHttpRequest
  const testXHRPost = async () => {
    setLoading("xhr-post");
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    return new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open("POST", "https://jsonplaceholder.typicode.com/posts");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("X-Test-Request", "xhr-trace-test");
      xhr.setRequestHeader("X-Request-Type", "xhr-post");

      xhr.onload = () => {
        const duration = Date.now() - startTime;
        let responseData;
        try {
          responseData = JSON.parse(xhr.responseText);
        } catch {
          responseData = xhr.responseText;
        }

        const result: TraceTestResult = {
          url: "https://jsonplaceholder.typicode.com/posts",
          method: "POST (XHR)",
          status: xhr.status,
          response: responseData,
          timestamp,
          duration,
        };

        setResults((prev) => [result, ...prev]);
        setLoading(null);
        resolve();
      };

      xhr.onerror = () => {
        const duration = Date.now() - startTime;
        const result: TraceTestResult = {
          url: "https://jsonplaceholder.typicode.com/posts",
          method: "POST (XHR)",
          status: xhr.status || 0,
          error: "XMLHttpRequest failed",
          timestamp,
          duration,
        };

        setResults((prev) => [result, ...prev]);
        setLoading(null);
        resolve();
      };

      const requestBody = JSON.stringify({
        title: "XHR Trace Test",
        body: "Testing distributed tracing with XMLHttpRequest",
        userId: 1,
      });

      xhr.send(requestBody);
    });
  };

  // Test XMLHttpRequest GET
  const testXHRGet = async () => {
    setLoading("xhr-get");
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    return new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.open("GET", "https://httpbin.org/json");
      xhr.setRequestHeader("X-Test-Request", "xhr-trace-test");
      xhr.setRequestHeader("X-Request-Type", "xhr-get");

      xhr.onload = () => {
        const duration = Date.now() - startTime;
        let responseData;
        try {
          responseData = JSON.parse(xhr.responseText);
        } catch {
          responseData = xhr.responseText;
        }

        const result: TraceTestResult = {
          url: "https://httpbin.org/json",
          method: "GET (XHR)",
          status: xhr.status,
          response: responseData,
          timestamp,
          duration,
        };

        setResults((prev) => [result, ...prev]);
        setLoading(null);
        resolve();
      };

      xhr.onerror = () => {
        const duration = Date.now() - startTime;
        const result: TraceTestResult = {
          url: "https://httpbin.org/json",
          method: "GET (XHR)",
          status: xhr.status || 0,
          error: "XMLHttpRequest failed",
          timestamp,
          duration,
        };

        setResults((prev) => [result, ...prev]);
        setLoading(null);
        resolve();
      };

      xhr.send();
    });
  };

  const clearResults = () => {
    setResults([]);
  };

  // Check if request was successful (trace headers are injected automatically)
  const isSuccessful = (result: TraceTestResult) => {
    return result.status >= 200 && result.status < 300;
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Distributed Tracing Test</CardTitle>
          <CardDescription>
            Test Datadog RUM's automatic trace header injection for distributed
            tracing. Check browser Network tab to see injected headers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fetch API Tests */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">
              Fetch API Tests
            </h4>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <Button
                onClick={testJsonPlaceholder}
                disabled={loading === "jsonplaceholder"}
                variant="outline"
                size="sm"
              >
                {loading === "jsonplaceholder" ? "Testing..." : "GET (Fetch)"}
              </Button>
              <Button
                onClick={testHttpBin}
                disabled={loading === "httpbin"}
                variant="outline"
                size="sm"
              >
                {loading === "httpbin" ? "Testing..." : "Headers (Fetch)"}
              </Button>
              <Button
                onClick={testPostRequest}
                disabled={loading === "post"}
                variant="outline"
                size="sm"
              >
                {loading === "post" ? "Testing..." : "POST (Fetch)"}
              </Button>
            </div>
          </div>

          {/* Axios Tests */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-blue-700">Axios Tests</h4>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <Button
                onClick={testAxiosGet}
                disabled={loading === "axios-get"}
                variant="outline"
                size="sm"
                className="border-blue-200 hover:bg-blue-50"
              >
                {loading === "axios-get" ? "Testing..." : "GET (Axios)"}
              </Button>
              <Button
                onClick={testAxiosPost}
                disabled={loading === "axios-post"}
                variant="outline"
                size="sm"
                className="border-blue-200 hover:bg-blue-50"
              >
                {loading === "axios-post" ? "Testing..." : "POST (Axios)"}
              </Button>
            </div>
          </div>

          {/* XMLHttpRequest Tests */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-purple-700">
              XMLHttpRequest Tests
            </h4>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <Button
                onClick={testXHRGet}
                disabled={loading === "xhr-get"}
                variant="outline"
                size="sm"
                className="border-purple-200 hover:bg-purple-50"
              >
                {loading === "xhr-get" ? "Testing..." : "GET (XHR)"}
              </Button>
              <Button
                onClick={testXHRPost}
                disabled={loading === "xhr-post"}
                variant="outline"
                size="sm"
                className="border-purple-200 hover:bg-purple-50"
              >
                {loading === "xhr-post" ? "Testing..." : "POST (XHR)"}
              </Button>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center">
            <Button onClick={clearResults} variant="destructive" size="sm">
              Clear All Results
            </Button>
          </div>

          {/* Instructions */}
          <div className="rounded bg-blue-50 p-4 text-sm">
            <h4 className="mb-2 font-semibold">
              🔍 How to Verify Automatic Trace Header Injection:
            </h4>
            <ol className="list-inside list-decimal space-y-1">
              <li>
                <strong>Open Browser DevTools</strong> → Network tab (before
                clicking buttons)
              </li>
              <li>
                <strong>Click any test button</strong> above to make an API
                request
              </li>
              <li>
                <strong>Find the request</strong> in Network tab (look for the
                URL)
              </li>
              <li>
                <strong>Click on the request</strong> → Headers tab
              </li>
              <li>
                <strong>Scroll to "Request Headers"</strong> section
              </li>
              <li>
                <strong>Look for automatically injected headers:</strong>
              </li>
              <ul className="ml-4 mt-1 list-inside list-disc space-y-1 text-xs">
                <li>
                  <code className="rounded bg-white px-1">
                    x-datadog-trace-id
                  </code>{" "}
                  - Unique trace ID
                </li>
                <li>
                  <code className="rounded bg-white px-1">
                    x-datadog-parent-id
                  </code>{" "}
                  - Parent span ID
                </li>
                <li>
                  <code className="rounded bg-white px-1">
                    x-datadog-sampling-priority
                  </code>{" "}
                  - Sampling decision
                </li>
                <li>
                  <code className="rounded bg-white px-1">traceparent</code> -
                  W3C trace context
                </li>
              </ul>
            </ol>
            <div className="mt-2 rounded bg-yellow-100 p-2 text-xs">
              <strong>Note:</strong> These headers are automatically injected by
              the Datadog RUM SDK into <strong>all HTTP libraries</strong>{" "}
              (Fetch, Axios, XHR). You won't see them in JavaScript - only in
              the browser's Network tab!
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results ({results.length})</CardTitle>
            <CardDescription>
              Recent API requests with automatic trace header injection. Check
              Network tab to see injected headers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`rounded border p-4 ${
                    isSuccessful(result)
                      ? "border-green-200 bg-green-50"
                      : result.error
                        ? "border-red-200 bg-red-50"
                        : "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-mono text-sm font-semibold">
                        {result.method} {result.url}
                      </div>
                      <div className="mt-1 flex items-center gap-4">
                        <span
                          className={`text-sm ${
                            isSuccessful(result)
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          Status: {result.status || "Failed"}
                        </span>
                        {result.duration && (
                          <span className="text-sm text-blue-600">
                            Duration: {result.duration}ms
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Request Status */}
                  <div className="mt-2">
                    {isSuccessful(result) ? (
                      <div className="text-sm text-green-600">
                        ✅ Request successful - Trace headers automatically
                        injected by SDK
                      </div>
                    ) : result.error ? (
                      <div className="text-sm text-red-600">
                        ❌ Request failed - Check Network tab for trace headers
                      </div>
                    ) : (
                      <div className="text-sm text-yellow-600">
                        ⚠️ Request completed with non-2xx status
                      </div>
                    )}
                  </div>

                  {/* Error Display */}
                  {result.error && (
                    <div className="mt-2 text-sm text-red-600">
                      Error: {result.error}
                    </div>
                  )}

                  {/* Instructions for this specific request */}
                  <div className="mt-2 rounded bg-blue-50 p-2 text-xs">
                    <strong>To see trace headers:</strong> Open DevTools →
                    Network → Find "{result.url}" → Headers → Request Headers
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
