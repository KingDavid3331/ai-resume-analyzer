export default function ResultsPanel({ result }) {
  const { score, missing_keywords, suggestions } = result;

  const scoreColor =
    score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Match Score</p>
        <p className={`text-6xl font-bold ${scoreColor}`}>{score}</p>
        <p className="text-gray-400 text-sm">out of 100</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Missing Keywords</h3>
        {missing_keywords.length === 0 ? (
          <p className="text-sm text-gray-500">None — great coverage!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missing_keywords.map((kw) => (
              <span
                key={kw}
                className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded"
              >
                {kw}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Suggestions</h3>
        <ul className="list-disc list-inside space-y-1">
          {suggestions.map((s, i) => (
            <li key={i} className="text-sm text-gray-600">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
