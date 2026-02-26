export async function requestAITaskAnalysis(taskText) {
  const response = await fetch('http://localhost:5000/api/ai/analyze-task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: taskText }),
  });

  const data = await response.json();
  return data; 
}