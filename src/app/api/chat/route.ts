import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDG9Q8UBsIQUTaqpiWLMwHinACSifIC7sc";
    const client = new GoogleGenAI({ apiKey });

    const model = "gemini-2.0-flash-lite";

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
              text: `Eres Vixai, un asistente de negocios de élite impulsado por IA. 
          Tu objetivo es ayudar a los dueños de negocios a optimizar sus ventas, reducir gastos y tomar decisiones estratégicas.
          
          Tienes acceso a conocimientos generales sobre:
          - Estrategias de ventas y marketing.
          - Optimización de inventario.
          - Análisis financiero básico.
          - Gestión de clientes.

          Responde siempre de manera profesional, concisa y estratégica. Usa un tono elegante y motivador.
          Si te preguntan sobre datos específicos del negocio (como "cuánto vendí hoy"), responde que en esta versión beta estás analizando los patrones generales, pero pronto tendrás acceso directo a la base de datos en tiempo real.`
            }
          ]
        },
        thinkingConfig: {
          thinkingLevel: "HIGH",
        },
        tools: [{ googleSearch: {} }]
      },
    });

    // Handle the response. The new SDK response object typically has a text() method.
    // We need to be careful if the response is blocked or empty.
    const reply = response.text ? response.text() : "Lo siento, no pude generar una respuesta en este momento.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: 'Error processing request', details: error.message }, { status: 500 });
  }
}
