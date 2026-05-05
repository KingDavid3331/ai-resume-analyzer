import { useState } from 'react';

export default function UploadForm({ onResult, onLoading }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file || !jobDescription.trim()) {
      setError('Please provide both a resume PDF and a job description.');
      return;
    }
    setError('');
    onLoading(true);
    try {
      const { analyzeResume } = await import('../api/analyze.js');
      const result = await analyzeResume(file, jobDescription);
      onResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      onLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resume (PDF)
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          placeholder="Paste the full job description here..."
          className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition font-medium"
      >
        Analyze Resume
      </button>
    </form>
  );
}
