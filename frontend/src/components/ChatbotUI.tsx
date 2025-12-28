import { useState } from "react";
import { shortlistCVs } from "../api";

export default function ChatbotUI() {
  const [job, setJob] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [reportUrl, setReportUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const res = await shortlistCVs(job, files);
    setResults(res.data.candidates);
    setReportUrl("https://kushitha-cv-shortlist.hf.space" + res.data.report_url);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          AI CV Shortlisting System (Company Panel)
        </h2>

        <textarea
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Paste Job Description"
          onChange={e => setJob(e.target.value)}
        />

        <input
          type="file"
          multiple
          className="w-full border rounded-lg p-2 mb-4"
          onChange={e => setFiles(Array.from(e.target.files || []))}
        />

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? "Processing CVs..." : "Shortlist CVs"}
        </button>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold mb-2">Ranked Candidates</h3>
            {results.map((r, i) => (
              <div key={i} className="border p-3 rounded mb-2">
                <strong>{i + 1}. {r.filename}</strong><br />
                Match: {(r.score * 100).toFixed(2)}%<br />
                Skills: {r.skills.join(", ")}
              </div>
            ))}
          </div>
        )}

        {/* Download Report */}
        {reportUrl && (
          <a
            href={reportUrl}
            target="_blank"
            className="block mt-4 text-center bg-green-600 text-white py-2 rounded-lg"
          >
            Download PDF Report
          </a>
        )}
      </div>
    </div>
  );
}
