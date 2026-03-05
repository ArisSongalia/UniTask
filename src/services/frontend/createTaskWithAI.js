let isProcessing = false;

export const handleAnalyzeTaskAI = async (taskText) => {

  try{
    if(isProcessing) return;

    isProcessing = true;
    const aiResponse = await fetch('http://localhost:5000/api/ai/analyze-task', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ task: taskText })
    });

    const aiData = await aiResponse.json();

    const saveResponse = await fetch('http://localhost:5000/api/tasks', {
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