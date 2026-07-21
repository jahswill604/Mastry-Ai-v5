import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the Gemini SDK with server-only key and standard AI Studio User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, topic, currentConcept, chatHistory, question, materialText } = body;

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    if (action === "analyzeMaterial") {
      if (!materialText) {
        return NextResponse.json({ error: "Material text is required" }, { status: 400 });
      }

      const prompt = `You are the student's personal Study Buddy AI Teacher.
The student has uploaded or pasted their own notes, textbooks, or learning materials.
Analyze this text content:
"${materialText}"

Extract exactly 4 key concepts (nodes) to help them study and master this specific material.
Also, generate the very first immersive study lesson, a powerful intuitive analogy, and a custom interactive quiz based on this text.

Make the tone extremely warm, intelligent, encouraging, and sophisticated.
Avoid dry textbooks or corporate templates. Speak like an expert tutor helping them master their material.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          intro: {
            type: Type.STRING,
            description: "A highly personal, futuristic, and welcoming greeting from the AI teacher mentor, expressing excitement about studying these materials with the student.",
          },
          concepts: {
            type: Type.ARRAY,
            description: "4 progressive learning stages, representing the personalized study roadmap extracted from the material.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING, description: "A one-sentence summary of what this part of the material covers." },
                difficulty: { type: Type.STRING, description: "Beginner, Intermediate, Advanced, or Master" },
              },
              required: ["id", "title", "description", "difficulty"],
            },
          },
          firstLesson: {
            type: Type.OBJECT,
            properties: {
              conceptId: { type: Type.STRING },
              title: { type: Type.STRING },
              content: {
                type: Type.STRING,
                description: "The full text of the first lesson study guide based on the materials. Use Markdown headers, bullet points, and short, punchy paragraphs. Make it incredibly engaging, visual, and explanation-heavy.",
              },
              analogy: {
                type: Type.STRING,
                description: "A brilliant, everyday analogy that makes this first concept of the material instantly intuitive.",
              },
              diagramPrompt: {
                type: Type.STRING,
                description: "A description of a beautiful diagram representing this concept from their notes.",
              },
              quiz: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Exactly 4 options based on the material.",
                  },
                  correctIndex: { type: Type.INTEGER, description: "0-indexed correct option." },
                  explanation: { type: Type.STRING, description: "Why this answer is correct and why other options are common misconceptions from the text." },
                },
                required: ["question", "options", "correctIndex", "explanation"],
              },
            },
            required: ["conceptId", "title", "content", "analogy", "diagramPrompt", "quiz"],
          },
        },
        required: ["intro", "concepts", "firstLesson"],
      };

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.8,
        },
      });

      const responseText = aiResponse.text;
      if (!responseText) {
        throw new Error("No response generated from Gemini.");
      }

      return NextResponse.json(JSON.parse(responseText.trim()));
    }

    if (action === "generateCurriculum") {
      if (!topic) {
        return NextResponse.json({ error: "Topic is required" }, { status: 400 });
      }

      const prompt = `You are the ultimate private AI teacher from the future.
Generate a comprehensive, custom-tailored, multi-stage learning curriculum for the topic: "${topic}".
Create exactly 4 sequential concepts (nodes) that take the user from absolute beginner to master of this skill.
Also, generate the very first immersive, visually structured lesson for the first concept.

Make the tone extremely warm, intelligent, encouraging, and sophisticated.
Avoid typical corporate dry terminology. Speak like an expert private tutor at Oxford or Stanford.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          intro: {
            type: Type.STRING,
            description: "A highly personal, futuristic, and welcoming greeting from the AI teacher mentor, expressing excitement about teaching the user this specific topic.",
          },
          concepts: {
            type: Type.ARRAY,
            description: "4 progressive learning stages, representing the personalized roadmap.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING, description: "A one-sentence summary of what they will learn in this stage." },
                difficulty: { type: Type.STRING, description: "Beginner, Intermediate, Advanced, or Master" },
              },
              required: ["id", "title", "description", "difficulty"],
            },
          },
          firstLesson: {
            type: Type.OBJECT,
            properties: {
              conceptId: { type: Type.STRING },
              title: { type: Type.STRING },
              content: {
                type: Type.STRING,
                description: "The full text of the first lesson. Use Markdown headers, bullet points, and short, punchy paragraphs. Make it incredibly engaging, visual, and explanation-heavy. Do not just list facts — teach conceptually.",
              },
              analogy: {
                type: Type.STRING,
                description: "A brilliant, everyday analogy that makes this first concept instantly intuitive.",
              },
              diagramPrompt: {
                type: Type.STRING,
                description: "A description of a beautiful diagram representing this concept (e.g., 'A light wave passing through three polarizing filters showing changing angles').",
              },
              quiz: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Exactly 4 options.",
                  },
                  correctIndex: { type: Type.INTEGER, description: "0-indexed correct option." },
                  explanation: { type: Type.STRING, description: "Why this answer is correct and why other options are common misconceptions." },
                },
                required: ["question", "options", "correctIndex", "explanation"],
              },
            },
            required: ["conceptId", "title", "content", "analogy", "diagramPrompt", "quiz"],
          },
        },
        required: ["intro", "concepts", "firstLesson"],
      };

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.8,
        },
      });

      const responseText = aiResponse.text;
      if (!responseText) {
        throw new Error("No response generated from Gemini.");
      }

      return NextResponse.json(JSON.parse(responseText.trim()));
    }

    if (action === "askMentor") {
      if (!topic || !question) {
        return NextResponse.json({ error: "Topic and Question are required" }, { status: 400 });
      }

      // Format simple chat history
      const formattedHistory = (chatHistory || [])
        .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "User" : "AI Teacher"}: ${h.text}`)
        .join("\n");

      const prompt = `You are the private AI teacher for the topic: "${topic}".
The student is currently working on or finished with the concept: "${currentConcept || "Introduction"}".
They are asking a follow-up question: "${question}".

Here is the conversation history:
${formattedHistory}

Answer their question in an incredibly friendly, clear, and highly encouraging manner.
If appropriate, design a simple conceptual flow diagram (mind-map node graph) with 3 to 5 nodes to visually lay out the concept they are asking about.
Position the nodes logically on a grid of width 600 and height 200 (x: 50 to 550, y: 30 to 170). Use harmonious colors (e.g., primary blues, soft purples, success greens).`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          reply: {
            type: Type.STRING,
            description: "The main text of your conversational reply. Use clear spacing, friendly encouraging remarks, and standard markdown formatting.",
          },
          visualRepresentation: {
            type: Type.OBJECT,
            description: "Optional diagram nodes/edges to display as a custom interactive SVG graph.",
            properties: {
              title: { type: Type.STRING, description: "Short title of this conceptual diagram." },
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    label: { type: Type.STRING, description: "Short 1-3 word text inside the node." },
                    color: { type: Type.STRING, description: "Hex code (e.g. #3b82f6 for blue, #a855f7 for purple, #22c55e for green)" },
                    x: { type: Type.NUMBER, description: "X position on a 600x200 canvas (50 to 550)" },
                    y: { type: Type.NUMBER, description: "Y position on a 600x200 canvas (30 to 170)" },
                  },
                  required: ["id", "label", "color", "x", "y"],
                },
              },
              edges: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    from: { type: Type.STRING },
                    to: { type: Type.STRING },
                    label: { type: Type.STRING, description: "Optional verb/relationship (e.g., 'leads to', 'consists of', 'defines')" },
                  },
                  required: ["from", "to"],
                },
              },
            },
            required: ["title", "nodes", "edges"],
          },
        },
        required: ["reply"],
      };

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.7,
        },
      });

      const responseText = aiResponse.text;
      if (!responseText) {
        throw new Error("No response generated from Gemini.");
      }

      return NextResponse.json(JSON.parse(responseText.trim()));
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process the request." },
      { status: 500 }
    );
  }
}
