import React, { useState } from "react";
import axios from "axios";

export default function CVUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [jobDesc, setJobDesc] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("job_description", jobDesc);
    files.forEach((file) => formData.append("files", file));

    const res = await axios.post("http://127.0.0.1:8000/shortlist", formData);
    setResults(res.data.shortlisted);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          AI CV Shortlisting System
        </h1>
        <p className="text-gray-600">
          Smart hiring powered by Artificial Intelligence
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Job Description
            </h2>
            <textarea
              rows={8}
              placeholder="Paste job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Upload CVs */}
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Upload CVs
            </h2>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setFiles(Array.from(e.target.files || []))
                }
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                PDF or DOCX files supported
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Analyzing CVs..." : "Shortlist Candidates"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="max-w-6xl mx-auto mt-8">
          <h2 className="text-xl font-bold mb-4">
            Shortlisted Candidates
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {results.map((res, index) => (
              <div
                key={res.filename}
                className="bg-white rounded-xl shadow p-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    #{index + 1} {res.filename}
                  </h3>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                    {res.score}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${res.score * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Match Score
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
