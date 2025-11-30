import { NextResponse } from 'next/server';
import { getBedrockCompletion } from '@/lib/bedrock';

export async function POST(req: Request) {
  try {
    const { message, context, mode } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let systemInstructionText = `Eres Vixai, un asistente de negocios de élite, altamente inteligente y profesional.
          Tu objetivo es proporcionar análisis estratégicos, respuestas precisas y ayuda operativa a dueños de negocios.
          
          Tus capacidades incluyen:
          - Análisis de datos financieros y operativos.
          - Asesoramiento en estrategias de crecimiento y reducción de costos.
          
          Directrices:
          - Responde siempre de manera profesional, directa y sin rodeos.
          - Usa formato Markdown para estructurar tus respuestas (listas, negritas, tablas si es necesario).
          - NO inventes datos. Si no sabes algo, dilo.
          - Mantén un tono elegante, sofisticado y motivador.`;

    if (context) {
      systemInstructionText += `\n\nContexto actual del usuario (Datos reales de su empresa): ${JSON.stringify(context)}`;
    }

    if (mode === 'financial_analyst') {
      systemInstructionText += `\n\nMODO: Analista Financiero. Prioriza métricas, KPIs, márgenes y rentabilidad. Sé extremadamente analítico.`;
    } else if (mode === 'admin_copilot') {
      systemInstructionText += `\n\nMODO: Copiloto Administrativo. Enfócate en la ejecución de tareas, organización y eficiencia operativa.`;
    }
    
    const fullPrompt = `${systemInstructionText}\n\nHuman: ${message}\n\nAssistant:`;

    const reply = await getBedrockCompletion(fullPrompt);

    if (!reply) {
      return NextResponse.json({ error: 'Error getting response from Bedrock' }, { status: 500 });
    }

    // The 'citations' part from Perplexity is not available in this Bedrock implementation.
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Error processing request', details: error.message }, { status: 500 });
  }
}
