import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, context, mode } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      console.error("PERPLEXITY_API_KEY is missing");
      return NextResponse.json({ 
        reply: "Error de configuración: Falta la API Key de Perplexity. Por favor configura la variable de entorno PERPLEXITY_API_KEY." 
      });
    }

    const model = "llama-3.1-sonar-large-128k-online";

    let systemInstructionText = `Eres Vixai, un asistente de negocios de élite, altamente inteligente y profesional.
          Tu objetivo es proporcionar análisis estratégicos, respuestas precisas y ayuda operativa a dueños de negocios.
          
          Tus capacidades incluyen:
          - Búsqueda de información en tiempo real (gracias a tu conexión a internet).
          - Análisis de datos financieros y operativos.
          - Asesoramiento en estrategias de crecimiento y reducción de costos.
          
          Directrices:
          - Responde siempre de manera profesional, directa y sin rodeos.
          - Usa formato Markdown para estructurar tus respuestas (listas, negritas, tablas si es necesario).
          - Si te piden datos actuales (tipo de cambio, noticias), búscalos y cítalos.
          - NO inventes datos. Si no sabes algo, dilo o busca la información.
          - Mantén un tono elegante, sofisticado y motivador.`;

    if (context) {
      systemInstructionText += `\n\nContexto actual del usuario (Datos reales de su empresa): ${JSON.stringify(context)}`;
    }

    if (mode === 'financial_analyst') {
      systemInstructionText += `\n\nMODO: Analista Financiero. Prioriza métricas, KPIs, márgenes y rentabilidad. Sé extremadamente analítico.`;
    } else if (mode === 'admin_copilot') {
      systemInstructionText += `\n\nMODO: Copiloto Administrativo. Enfócate en la ejecución de tareas, organización y eficiencia operativa.`;
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: systemInstructionText },
          { role: "user", content: message }
        ],
        temperature: 0.2,
        top_p: 0.9,
        return_citations: true,
        search_domain_filter: ["perplexity.ai"],
        return_images: false,
        return_related_questions: false,
        search_recency_filter: "month",
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Perplexity API Error:', response.status, errorData);
      throw new Error(`Perplexity API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "No pude obtener una respuesta.";
    const citations = data.citations || [];

    return NextResponse.json({ reply, citations });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Error processing request', details: error.message }, { status: 500 });
  }
}
