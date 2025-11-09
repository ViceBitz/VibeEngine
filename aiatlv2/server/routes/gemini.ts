import { Router } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { Octokit } from '@octokit/rest';
import type { AuthRequest } from '../middleware/auth.js';
import type { Feature } from '../models/Feature.js';

import { getPrompts } from '../utils/prompts.js'

const router = Router();
// router.use(authenticateToken);

const ai = new GoogleGenAI({apiKey: "AIzaSyBsDXpxnZntE-cs8JoCLKmic6zHhrcBrWM"})

interface GetFileArgs {
  owner: string;
  repo: string;
  file_path: string;
  branch?: string;
}

interface UpdateFileArgs {
  owner: string;
  repo: string;
  path: string;
  content: string;
  message: string;
  branch?: string;
  sha: string;
}

// Gemini API endpoint
router.post("/generate", async (req: AuthRequest, res) => {
  try {
    const { prompt } = req.body; // Expect JSON { prompt: "..." }
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Conversation history can just include the single prompt or multiple messages

    // Generate content using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{
          //@ts-ignore
          functionDeclarations: functionDeclaration
        }],
      },    
    });
    

    // The response object may vary depending on Gemini client version
    // Typically output text is in response.output_text
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0]; // Assuming one function call
      res.json({ functionName: functionCall.name, result: functionCall.args })
    } else {
      console.log(response.text)
      res.json(null)
    }
  } catch (error) {
    console.error("Gemini generation error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Generate feature map from disconnected features with Gemini
async function makeFeatureMap(features: typeof Feature[]) : Promise<any> {
  const { markdown, json } = await getPrompts("feature");

  // Generate content using Gemini
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: markdown,
    config: {
      tools: [{
        //@ts-ignore
        functionDeclarations: json
      }],
    },    
  });
  

  // The response object may vary depending on Gemini client version
  // Typically output text is in response.output_text
  if (response.functionCalls && response.functionCalls.length > 0) {
    const functionCall = response.functionCalls[0]; // Assuming one function call
    return { functionName: functionCall.name, result: functionCall.args }
  } else {
    console.log(response.text)
    return null;
  }
}

export default router;