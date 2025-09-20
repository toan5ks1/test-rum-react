import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  addDatadogError,
  addDatadogAction,
  addDatadogAttribute,
} from "../lib/datadog";

interface SearchResult {
  id: string;
  title: string;
  description: string;
}

// Mock API function that can throw various errors
const mockSearchAPI = async (
  query: string,
  errorType?: string
): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate different error scenarios based on query or error type
  if (errorType === "network" || query === "network-error") {
    throw new Error("Network error: Failed to fetch search results");
  }

  if (errorType === "timeout" || query === "timeout-error") {
    const timeoutError = new Error("Request timeout: Search took too long");
    timeoutError.name = "TimeoutError";
    throw timeoutError;
  }

  if (errorType === "validation" || query === "validation-error") {
    const validationError = new Error(
      "Validation error: Invalid search parameters"
    );
    validationError.name = "ValidationError";
    throw validationError;
  }

  if (errorType === "server" || query === "server-error") {
    const serverError = new Error(
      "Internal server error: Something went wrong on our end"
    );
    serverError.name = "ServerError";
    throw serverError;
  }

  if (errorType === "auth" || query === "auth-error") {
    const authError = new Error(
      "Authentication error: Please log in to continue"
    );
    authError.name = "AuthenticationError";
    throw authError;
  }

  if (query === "json-parse-error") {
    // Simulate a JSON parsing error
    throw new SyntaxError("Unexpected token < in JSON at position 0");
  }

  if (query === "reference-error") {
    // Simulate a reference error
    // @ts-ignore - intentionally causing an error
    return undefinedVariable.map((item) => item.name);
  }

  if (query === "type-error") {
    // Simulate a type error
    const nullValue: any = null;
    return nullValue.map((item: any) => item.name);
  }

  // Return mock results for valid queries
  if (query.length < 2) {
    return [];
  }

  return [
    {
      id: "1",
      title: `Result for "${query}"`,
      description: `This is a mock search result for your query: ${query}`,
    },
    {
      id: "2",
      title: `Another result for "${query}"`,
      description: `Another mock search result matching: ${query}`,
    },
  ];
};

export function SearchForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track search attempts
  const handleSearch = async (searchQuery: string, errorType?: string) => {
    if (!searchQuery.trim()) {
      setError("Search query cannot be empty");
      addDatadogError(new Error("Empty search query"), {
        component: "SearchForm",
        action: "search_validation",
        query: searchQuery,
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    // Update URL with search parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("q", searchQuery);
    if (errorType) {
      newSearchParams.set("error_type", errorType);
    }
    setSearchParams(newSearchParams);

    // Track search action in Datadog
    addDatadogAction("search_initiated", {
      query: searchQuery,
      queryLength: searchQuery.length,
      hasErrorType: !!errorType,
      errorType: errorType || null,
    });

    // Add custom attributes for this search session
    addDatadogAttribute("last_search_query", searchQuery);
    addDatadogAttribute("search_timestamp", new Date().toISOString());

    try {
      const searchResults = await mockSearchAPI(searchQuery, errorType);
      setResults(searchResults);

      // Track successful search
      addDatadogAction("search_completed", {
        query: searchQuery,
        resultCount: searchResults.length,
        success: true,
      });
    } catch (err) {
      const error = err as Error;
      setError(error.message);

      // Track detailed error information in Datadog
      addDatadogError(error, {
        component: "SearchForm",
        action: "search_api_call",
        query: searchQuery,
        errorType: errorType || "unknown",
        errorName: error.name,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });

      // Also track as a custom action for analytics
      addDatadogAction("search_failed", {
        query: searchQuery,
        errorMessage: error.message,
        errorType: error.name,
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  // Handle error simulation buttons
  const simulateError = (errorType: string) => {
    const testQuery = `${errorType}-error`;
    setQuery(testQuery);
    handleSearch(testQuery, errorType);
  };

  // Load search results on mount if query param exists
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    const urlErrorType = searchParams.get("error_type");
    if (urlQuery) {
      setQuery(urlQuery);
      handleSearch(urlQuery, urlErrorType || undefined);
    }
  }, []); // Empty dependency array for mount only

  return (
    <div className="w-full max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search with Error Monitoring</CardTitle>
          <CardDescription>
            Test search functionality with various error scenarios for Datadog
            monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter search query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>

          {/* Error Simulation Buttons */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateError("network")}
              disabled={loading}
            >
              Network Error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateError("timeout")}
              disabled={loading}
            >
              Timeout Error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateError("validation")}
              disabled={loading}
            >
              Validation Error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateError("server")}
              disabled={loading}
            >
              Server Error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => simulateError("auth")}
              disabled={loading}
            >
              Auth Error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("json-parse-error");
                handleSearch("json-parse-error");
              }}
              disabled={loading}
            >
              JSON Error
            </Button>
          </div>

          {/* JavaScript Error Simulation */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setQuery("reference-error");
                handleSearch("reference-error");
              }}
              disabled={loading}
            >
              Reference Error
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setQuery("type-error");
                handleSearch("type-error");
              }}
              disabled={loading}
            >
              Type Error
            </Button>
          </div>

          {/* Current URL Display */}
          <div className="rounded bg-muted p-2 text-xs text-muted-foreground">
            <strong>Current URL:</strong> {window.location.href}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Occurred</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              This error has been tracked in Datadog RUM with additional
              context.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.id} className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold">{result.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              <span className="ml-2">Searching...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
