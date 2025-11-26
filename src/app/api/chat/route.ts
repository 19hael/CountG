import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { message, context, mode } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDG9Q8UBsIQUTaqpiWLMwHinACSifIC7sc";
    const client = new GoogleGenAI({ apiKey });

    const model = "gemini-2.0-flash-lite";

    let systemInstructionText = `Eres Vixai, un asistente de negocios de élite impulsado por IA. 
          Tu objetivo es ayudar a los dueños de negocios a optimizar sus ventas, reducir gastos y tomar decisiones estratégicas.
          
          Tienes acceso a conocimientos generales sobre:
          - Estrategias de ventas y marketing.
          - Optimización de inventario.
          - Análisis financiero básico.
          - Gestión de clientes.

          Responde siempre de manera profesional, concisa y estratégica. Usa un tono elegante y motivador.`;

    if (context) {
      systemInstructionText += `\n\nContexto actual del usuario: ${JSON.stringify(context)}`;
    }

    if (mode === 'financial_analyst') {
      systemInstructionText += `\n\nActúa como un Analista Financiero Senior. Enfócate en márgenes, rentabilidad, flujo de caja y reducción de costos. Sé directo y numérico.`;
    } else if (mode === 'admin_copilot') {
      systemInstructionText += `\n\nActúa como un Copiloto Administrativo. Tu trabajo es ejecutar tareas. Si el usuario te pide registrar algo, confirma los datos y simula la acción.`;
    }

    const response = await client.models.generateContent({
      model: model,
      contents: [
        {
          role: "user",
          parts: [
            { text: message }
          ],
        },
      ],
      config: {
        systemInstruction: {
          parts: [
            {
              text: systemInstructionText
            }
          ]
        },
        tools: [{ googleSearch: {} }]
      },
    });

    const reply = response.text || "Lo siento, no pude generar una respuesta en este momento.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Error processing request', details: error.message }, { status: 500 });
  }
}
