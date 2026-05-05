export async function analyzeResume(file, jobDescription) {
  const form = new FormData();
  form.append('resume', file);
  form.append('job_description', jobDescription);

  const res = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Analysis failed');
  }

  return res.json(); // { score, missing_keywords, suggestions }
}
