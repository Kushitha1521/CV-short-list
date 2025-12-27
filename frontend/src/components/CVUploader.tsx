import { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

    try {
      const res = await axios.post("https://kushitha-cv-shortlist.hf.space/shortlist", formData);
      setResults(res.data.shortlisted);
    } catch (error) {
      console.error("Error shortlisting CVs:", error);
    }
    setLoading(false);
  };

  // --- PDF Generation Logic ---
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
    doc.text("AI CV Shortlist Report", 14, 20);
    
    // Add Date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Add Job Description (Shortened if too long)
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Job Description Summary:", 14, 40);
    const splitDesc = doc.splitTextToSize(jobDesc.substring(0, 500) + (jobDesc.length > 500 ? "..." : ""), 180);
    doc.setFontSize(10);
    doc.text(splitDesc, 14, 48);

    // Create Table
    const tableRows = results.map((res, index) => [
      index + 1,
      res.filename,
      `${(res.score * 100).toFixed(1)}%`
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Rank', 'Candidate Filename', 'Match Score']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }, // Blue-600 color
    });

    doc.save("Shortlist_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">AI CV Shortlisting System</h1>
        <p className="text-gray-600">Smart hiring powered by Artificial Intelligence</p>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Job Description</h2>
            <textarea
              rows={8}
              placeholder="Paste job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Upload CVs</h2>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="w-full"
              />
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

      {results.length > 0 && (
        <div className="max-w-6xl mx-auto mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Shortlisted Candidates</h2>
            {/* PDF Export Button */}
            <button
              onClick={generatePDF}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              Download PDF Report
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {results.map((res, index) => (
              <div key={res.filename} className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 truncate pr-2">
                    #{index + 1} {res.filename}
                  </h3>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">
                    {(res.score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${res.score * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}