import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GeneratedProject } from '@/lib/types';

const openrouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY is not set');
      return NextResponse.json({
        success: false,
        error: 'OpenRouter API key is not configured. Please check your environment variables.',
        debug: {
          hasApiKey: false,
          envVars: Object.keys(process.env).filter(key => key.includes('OPENROUTER'))
        }
      }, { status: 500 });
    }

    const { userPreferences } = await request.json();

    if (!userPreferences) {
      return NextResponse.json(
        { success: false, error: 'User preferences are required' },
        { status: 400 }
      );
    }

    const prompt = `Generate a comprehensive project idea for a ${userPreferences.skillLevel} developer with the following requirements:
      
      Primary Stack: ${userPreferences.primaryStack}
      Goals: ${userPreferences.goals.join(', ')}
      Interests: ${userPreferences.interests.join(', ')}
      Additional Skills: ${userPreferences.additionalSkills}
      Target Industry: ${userPreferences.targetIndustry}
      
      Please create a project that includes:
      
      1. **Title**: A catchy, descriptive project name
      2. **Summary**: A brief 2-3 sentence overview
      3. **Description**: Detailed explanation of what the project will accomplish
      4. **Difficulty**: beginner, intermediate, or advanced
      5. **Tech Stack**: Array of specific technologies, frameworks, and tools needed
      6. **Requirements**: Array of prerequisites and knowledge needed
      7. **Milestones**: Array of 5-6 specific, actionable milestones with:
         - id: unique identifier
         - title: clear milestone name
         - description: detailed explanation
         - estimatedHours: realistic time estimate
         - detectionHint: how to verify completion
         - completed: false
      8. **Challenges**: Array of 3-4 realistic technical and practical challenges the developer might face
      9. **Resources**: Array of 4-5 helpful resources including:
         - title: resource name
         - url: actual documentation/tutorial URL
         - type: documentation, tutorial, video, course, etc.
      10. **Notes**: Array of 3-4 practical tips and best practices for successful execution
      
      Make sure:
      - The project is realistic for the skill level
      - Tech stack includes specific versions/frameworks when relevant
      - Resources include actual URLs to official docs, tutorials, etc.
      - Challenges are specific to the project's complexity
      - Notes provide actionable advice for execution
      - All arrays are properly formatted as JSON arrays
      
      Return the response as valid JSON with this exact structure:
      {
        "title": "string",
        "summary": "string", 
        "description": "string",
        "difficulty": "beginner|intermediate|advanced",
        "techStack": ["string"],
        "requirements": ["string"],
        "milestones": [{"id": "string", "title": "string", "description": "string", "estimatedHours": number, "detectionHint": "string", "completed": false}],
        "challenges": ["string"],
        "resources": [{"title": "string", "url": "string", "type": "string"}],
        "notes": ["string"]
      }`;
    

    const models = [
      'openai/gpt-4o-mini',      
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-3.5-turbo',   
      'google/gemini-1.5-flash' 
    ];
    
    let lastError: Error | null = null;
    
    for (const model of models) {
      try {
        
        const completion = await openrouterClient.chat.completions.create({
          model: model,
          messages: [
            {
              role: "system",
              content: `You are an expert technical mentor who creates personalized project ideas for individuals in technical fields. 
              You understand different skill levels, tech stacks, and career goals. 
              Always respond with valid JSON that matches the exact structure provided.`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: "json_object" }
        });

        const response = completion.choices[0]?.message?.content;
        
        if (!response) {
          throw new Error('No response from AI service');
        }
      
        const projectData = JSON.parse(response);
        
        const generatedProject: GeneratedProject = {
          title: projectData.title,
          summary: projectData.summary,
          description: projectData.description || projectData.summary,
          difficulty: projectData.difficulty,
          techStack: Array.isArray(projectData.techStack) ? projectData.techStack : [],
          requirements: Array.isArray(projectData.requirements) ? projectData.requirements : [],
          milestones: Array.isArray(projectData.milestones) ? projectData.milestones.map((milestone: { id?: string; title: string; description: string; estimatedHours: number; detectionHint: string }) => ({
            id: milestone.id || `milestone_${Math.random().toString(36).substr(2, 9)}`,
            title: milestone.title,
            description: milestone.description,
            estimatedHours: milestone.estimatedHours,
            detectionHint: milestone.detectionHint,
            completed: false
          })) : [],
          challenges: Array.isArray(projectData.challenges) 
            ? projectData.challenges 
            : ['Challenges not specified'],
          resources: Array.isArray(projectData.resources) 
            ? projectData.resources 
            : [{
              title: 'Documentation',
              url: '#',
              type: 'documentation'
            }],
          notes: Array.isArray(projectData.notes) 
            ? projectData.notes 
            : ['Notes not specified']
        };
        return NextResponse.json({
          success: true,
          project: generatedProject
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log(`Model ${model} failed:`, errorMessage);
        lastError = error instanceof Error ? error : new Error(errorMessage);
        continue; 
      }
    }
    
    throw new Error(`All AI models failed. Last error: ${lastError?.message || 'Unknown error'}`);

  } catch (error) {
    console.error('Project generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate project',
        debug: {
          hasApiKey: !!process.env.OPENROUTER_API_KEY,
          apiKeyLength: process.env.OPENROUTER_API_KEY?.length || 0,
          errorType: error?.constructor?.name
        }
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 