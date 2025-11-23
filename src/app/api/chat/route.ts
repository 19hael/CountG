import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/gemini';

const SYSTEM_PROMPT = `
Eres un asistente inteligente para la empresa CountG.

Tu rol es ayudar con:
1. Consultas de inventario en tiempo real
2. Gestión de citas y reservas
3. Información contable (facturas, deudas)
4. Lectura y categorización de documentos
5. Recomendaciones basadas en datos

CONTEXTO DE LA EMPRESA:
- Sector: Gestión Empresarial
- Productos/Servicios: Software SaaS
- Horarios: Lunes a Viernes 9am - 6pm

INSTRUCCIONES:
- Responde siempre en español profesional
- Si no tienes certeza, consulta la base de datos (Simulado por ahora)
- Ofrece sugerencias basadas en patrones de la empresa
- Sé amable pero directo
- Si es acción importante, pide confirmación
- Nunca hagas transacciones sin confirmación explícita

Si te preguntan por inventario, simula que consultas la base de datos y responde con datos realistas.
Si te preguntan por citas, verifica disponibilidad simulada.
`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Combine system prompt with user message
    const prompt = `${SYSTEM_PROMPT}\n\nUsuario: ${message}\nAsistente:`;
    
    const response = await generateResponse(prompt);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
