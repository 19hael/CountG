import { NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize Bedrock Client
const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

const MODEL_ID = "anthropic.claude-3-sonnet-20240229-v1:0";

// Define Tools
const tools = [
  {
    name: "get_financial_summary",
    description: "Get a summary of the current financial status, including income, expenses, and profit.",
    input_schema: {
      type: "object",
      properties: {},
    }
  },
  {
    name: "search_web",
    description: "Search the internet for real-time information, news, or specific data.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search query" }
      },
      required: ["query"]
    }
  },
  {
    name: "update_database",
    description: "Update a record in the database. Use this when the user explicitly asks to modify data.",
    input_schema: {
      type: "object",
      properties: {
        table: { type: "string", description: "The table to update (e.g., 'transactions', 'clients')" },
        action: { type: "string", enum: ["insert", "update", "delete"], description: "The action to perform" },
        data: { type: "string", description: "JSON string of the data to insert or update" }
      },
      required: ["table", "action", "data"]
    }
  }
];

async function invokeBedrock(messages: any[], systemPrompt: string) {
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages,
    tools: tools.map(t => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema
    }))
  };

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await bedrock.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody;
}

export async function POST(req: Request) {
  try {
    const { message, context, mode, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let systemInstructionText = `Eres Vixai, un asistente de negocios de élite, autónomo y altamente inteligente.
          Tu objetivo es gestionar la empresa de manera eficiente, tomando decisiones y ejecutando acciones cuando sea necesario.
          
          CAPACIDADES:
          - Tienes acceso a herramientas para leer y escribir en la base de datos.
          - Puedes buscar en internet información actualizada.
          - Eres proactivo: si ves algo mal, sugiérelo o arréglalo (pidiendo confirmación si es crítico).
          
          PERSONALIDAD:
          - Profesional, directo, "CEO-level".
          - No pidas disculpas excesivas. Enfócate en soluciones.
          - Usa Markdown para tus respuestas.`;

    if (context) {
      systemInstructionText += `\n\nCONTEXTO ACTUAL: ${JSON.stringify(context)}`;
    }

    // Construct message history for Claude
    // Note: In a real app, we should sanitize and format 'history' properly.
    // For now, we'll start a fresh conversation or append the user message.
    const messages = [
      { role: "user", content: message }
    ];

    // 1. First Call to LLM
    let response = await invokeBedrock(messages, systemInstructionText);
    
    let finalReply = "";
    let toolResults = [];

    // 2. Handle Tool Use Loop (Simplified for single turn)
    if (response.stop_reason === "tool_use") {
      const toolUseContent = response.content.find((c: any) => c.type === "tool_use");
      if (toolUseContent) {
        const toolName = toolUseContent.name;
        const toolInput = toolUseContent.input;
        const toolId = toolUseContent.id;

        console.log(`[Agent] Calling tool: ${toolName}`, toolInput);

        let result = "";
        // Execute Tool
        if (toolName === "get_financial_summary") {
            // Mock data for now - in real app, query DB
            result = JSON.stringify({ income: 50000, expenses: 32000, profit: 18000, currency: "USD" });
        } else if (toolName === "search_web") {
            result = "Búsqueda simulada: El mercado actual muestra tendencias alcistas en tecnología.";
        } else if (toolName === "update_database") {
            result = `Base de datos actualizada exitosamente: ${toolInput.action} en ${toolInput.table}`;
        }

        // Add tool result to messages
        messages.push({ role: "assistant", content: response.content });
        messages.push({
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: toolId,
                    content: result
                }
            ]
        });

        // 3. Second Call to LLM with Tool Results
        const followUpResponse = await invokeBedrock(messages, systemInstructionText);
        finalReply = followUpResponse.content[0].text;
      }
    } else {
      finalReply = response.content[0].text;
    }

    return NextResponse.json({ reply: finalReply });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ 
      error: 'Error processing request', 
      details: error.message,
      hint: "Check AWS Credentials and Model Access in Bedrock"
    }, { status: 500 });
  }
}
