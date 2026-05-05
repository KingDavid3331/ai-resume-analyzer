import { useState } from 'react';
import UploadForm from './components/UploadForm';
import ResultsPanel from './components/ResultsPanel';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleReset() {
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Resume Analyzer</h1>
          <p className="text-gray-500 mt-2">
            Upload your resume and a job description to get an AI-powered match score.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 animate-pulse">Analyzing your resume...</p>
            </div>
          )}

          {!loading && !result && (
            <UploadForm onResult={setResult} onLoading={setLoading} />
          )}

          {!loading && result && (
            <>
              <ResultsPanel result={result} />
              <button
                onClick={handleReset}
                className="mt-6 w-full border border-gray-300 text-gray-600 py-2 rounded hover:bg-gray-50 transition text-sm"
              >
                Analyze Another Resume
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
