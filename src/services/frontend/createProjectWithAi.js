let isProcessing = false;

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const handleCreateProjectWithAI = async (projectPrompt) => {
  try {
    if (isProcessing) return;

    isProcessing = true;

    const aiResponse = await fetch(
      `${API_URL}/api/ai/create-ai-project`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: projectPrompt
        })
      }
    );

    if (!aiResponse.ok) {
      throw new Error('AI project request failed');
    }

    const aiData = await aiResponse.json();

    return aiData;

  } catch (err) {
    console.error(
      'AI failed: handleCreateProjectWithAI',
      err
    );

    return null;

  } finally {
    isProcessing = false;
  }
};