import { VertexAI } from '@google-cloud/vertexai'

const vertexAI = new VertexAI({
  project: 'unitask-b9b5e',
  location: 'us-central1',
})

const model = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-flash-lite',
});

export async function analyzeTask(taskText) {
  const request = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `
            Return valid JSON only:
            {"priority":"Urgent|High|Medium|Low","tag":"1-2 words","description":"short summary"  }

            Task: ${taskText}
            `,
          },
        ],
      },
    ],
    generationConfig: {
      maxOutputTokens: 40,
      temperature: 0.2,
    },
  };

  const result = await model.generateContent(request);
  const response = result.response;
  let text = response.candidates[0].content.parts[0].text.trim();

  if (text.startsWith("```")) {
    text = text.replace(/```json|```/g, "").trim();
  }

  return JSON.parse(text);
}