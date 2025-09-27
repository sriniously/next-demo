"use client";

import { useState } from "react";

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [jobStatus, setJobStatus] = useState<any>(null);

  const processCSV = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jobs/data-processing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "csv",
          data: {
            headers: ["name", "email", "age"],
            rows: [
              ["John Doe", "john@example.com", "30"],
              ["Jane Smith", "jane@example.com", "25"],
            ],
          },
          processingOptions: { batchSize: 100 },
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to queue data processing job" });
    } finally {
      setLoading(false);
    }
  };

  const processJSON = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jobs/data-processing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "json",
          data: {
            users: Array.from({ length: 100 }, (_, i) => ({
              id: i + 1,
              name: `User ${i + 1}`,
              active: Math.random() > 0.5,
            })),
          },
          processingOptions: {
            batchSize: 20,
            outputFormat: "summary",
          },
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to queue data processing job" });
    } finally {
      setLoading(false);
    }
  };

  const processLargeDataset = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jobs/data-processing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "json",
          filePath: "/data/large-dataset.json",
          processingOptions: {
            batchSize: 500,
            outputFormat: "aggregated",
          },
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to queue data processing job" });
    } finally {
      setLoading(false);
    }
  };

  const checkJobStatus = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      const data = await response.json();
      setJobStatus(data);

      // Auto-refresh if job is still processing
      if (data.state === "active" || data.state === "waiting") {
        setTimeout(() => checkJobStatus(jobId), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setJobStatus({ error: "Failed to check job status" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Background Data Processing Demo
        </h1>

        <div className="space-y-6">
          <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Data Processing Examples
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              These examples demonstrate different data processing scenarios that
              run in the background worker.
            </p>

            <div className="space-y-3">
              <div>
                <button
                  onClick={processCSV}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 mr-2 transition-colors"
                >
                  {loading ? "Queueing..." : "Process CSV Data"}
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Simulates CSV parsing and transformation
                </span>
              </div>

              <div>
                <button
                  onClick={processJSON}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 mr-2 transition-colors"
                >
                  {loading ? "Queueing..." : "Process JSON Data"}
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Processes 100 user records in batches
                </span>
              </div>

              <div>
                <button
                  onClick={processLargeDataset}
                  disabled={loading}
                  className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50 mr-2 transition-colors"
                >
                  {loading ? "Queueing..." : "Process Large Dataset"}
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Simulates processing a large file
                </span>
              </div>
            </div>
          </div>

          {result && (
            <div className="border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Queue Result:
              </h3>
              <pre className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
                {JSON.stringify(result, null, 2)}
              </pre>

              {result.jobId && (
                <button
                  onClick={() => checkJobStatus(result.jobId)}
                  className="mt-4 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Check Job Status
                </button>
              )}
            </div>
          )}

          {jobStatus && (
            <div className="border border-blue-200 dark:border-blue-800 p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Job Status:
              </h3>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded">
                <div className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
                  <p>
                    <strong>Job ID:</strong> {jobStatus.id}
                  </p>
                  <p>
                    <strong>State:</strong>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${
                        jobStatus.state === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                          : jobStatus.state === "failed"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
                          : jobStatus.state === "active"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {jobStatus.state}
                    </span>
                  </p>
                  {jobStatus.progress !== undefined && (
                    <div>
                      <p>
                        <strong>Progress:</strong> {jobStatus.progress}%
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${jobStatus.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {jobStatus.result && (
                    <div>
                      <p>
                        <strong>Result:</strong>
                      </p>
                      <pre className="mt-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-xs overflow-x-auto">
                        {JSON.stringify(jobStatus.result, null, 2)}
                      </pre>
                    </div>
                  )}
                  {jobStatus.failedReason && (
                    <p className="text-red-600 dark:text-red-400">
                      <strong>Error:</strong> {jobStatus.failedReason}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              How it works:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>
                Jobs are queued in Redis and processed by the background worker
              </li>
              <li>
                The worker runs continuously, processing jobs as they arrive
              </li>
              <li>Progress is tracked and can be monitored in real-time</li>
              <li>
                Failed jobs are automatically retried with exponential backoff
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}