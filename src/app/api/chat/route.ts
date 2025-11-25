import { NextResponse } from 'next/server';
import openai from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using a high-intelligence model as requested
      messages: [
        {
          role: "system",
          content: `Eres Vixai, un asistente de negocios de élite impulsado por IA. 
          Tu objetivo es ayudar a los dueños de negocios a optimizar sus ventas, reducir gastos y tomar decisiones estratégicas.
          
          Tienes acceso a conocimientos generales sobre:
          - Estrategias de ventas y marketing.
          - Optimización de inventario.
          - Análisis financiero básico.
          - Gestión de clientes.

          Responde siempre de manera profesional, concisa y estratégica. Usa un tono elegante y motivador.
          Si te preguntan sobre datos específicos del negocio (como "cuánto vendí hoy"), responde que en esta versión beta estás analizando los patrones generales, pero pronto tendrás acceso directo a la base de datos en tiempo real.`
        },
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({ error: 'Error processing request', details: error.message }, { status: 500 });
  }
}
