import { VertexAI } from '@google-cloud/vertexai'

function getModel() {
  console.log("PROJECT:", process.env.GCP_PROJECT_ID);
  console.log("KEYFILE:", process.env.GOOGLE_APPLICATION_CREDENTIALS);

  const vertexAI = new VertexAI({
    project: process.env.GCP_PROJECT_ID,
    location: process.env.GCP_LOCATION,
    googleAuthOptions: {
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    }
  });

  const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';

  return vertexAI.getGenerativeModel({
    model: MODEL_NAME,
  });
}

export async function analyzeTask(taskText) {

  const model = getModel();  

  const request = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `
            Return valid JSON only:
            {"priority":"Urgent|High|Medium|Low","tag":"1-2 words","description":"short summary"}

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

  if (!text) throw new Error('No AI response');

  if (text.startsWith("```")) {
    text = text.replace(/```json|```/g, "").trim();
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('AI JSON parse failed:', text);
    throw new Error('AI returned invalid JSON');
  }
}

export async function createProjectWithAI(prompt) {
  const model = getModel();

  const request = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `
              Return valid JSON only:
              {
                "projectTitle":"",
                "projectDescription":"",
                "dueDate":"YYYY-MM-DD",
                "tasks":[
                  {
                    "title":"",
                    "description":"",
                    "priority":"Urgent|High|Medium|Low",
                    "category":"",
                    "dueDate":"YYYY-MM-DD"
                  }
                ]
              }

              Rules:
              - Generate 5-10 tasks in logical order
              - Keep titles/descriptions concise
              - Use realistic due dates
              - Categories: Frontend, Backend, Design, Testing, Research, Planning, etc.
              - No markdown
              - No explanations
              - JSON only

              Project details:
              ${prompt}
            `
          }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 1200,
      temperature: 0.2,
    },
  };

  const result = await model.generateContent(request);
  const response = result.response;
  let text = response.candidates[0].content.parts[0].text.trim();

  if (!text) throw new Error('No AI response');

  if (text.startsWith("```")) {
    text = text.replace(/```json|```/g, "").trim();
  };

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('AI JSON parse failed:', text);
    throw new Error('AI returned invalid JSON');
  }
}