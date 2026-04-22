let isProcessing = false;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const handleAnalyzeTaskAI = async (taskText) => {

  try{
    if(isProcessing) return;
    

    isProcessing = true;
    const aiResponse = await fetch(`${API_URL}/api/ai/analyze-task`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ task: taskText })
    });
    if (!aiResponse.ok) {
      throw new Error('AI analyze request failed');
    }

    const aiData = await aiResponse.json();

    const saveResponse = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({
        title: taskText,
        priority: aiData.priority,
        tag: aiData.tag,
        description: aiData.description,
      })
    });
    

    const saveData = await saveResponse.json();
    return saveData.task;
  } catch (error) {
    console.error('AI failed: handleAnalyzeTaskAI', error)
  } finally {
    isProcessing = false;
  }
}