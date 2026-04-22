const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function requestAITaskAnalysis(taskText) {
  const response = await fetch(`${API_URL}}/api/ai/analyze-task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: taskText }),
  });

  const data = await response.json();
  return data; 
}