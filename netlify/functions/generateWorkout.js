export async function handler(event) {
    const { userName, goals, days } = JSON.parse(event.body);

    const messages = [
        {
            role: 'system',
            content:
                'Eres un generador de planes de entrenamiento. SOLO debes responder con un objeto JSON válido. No debes incluir saludos, explicaciones, comentarios, markdown ni ningún texto adicional. Bajo ninguna circunstancia debes responder con texto fuera del objeto JSON. Si no puedes cumplir esto, responde con un objeto JSON vacío: {}.',
        },
        {
            role: 'user',
            content: `Crea un plan de entrenamiento para ${userName} con los siguientes objetivos: ${goals.join(', ')}.
El plan debe incluir entrenamientos para estos días: ${days.join(', ')}.

Devuelve SOLO un objeto JSON con la siguiente estructura exacta:

{
  "generatedPlan": [
    {
      "day": "Nombre del día",
      "workout": {
        "focus": "parte del cuerpo o tipo de entrenamiento del día",
        "duration": "duración estimada (ej: '45-60 min')",
        "phases": [
          {
            "phaseName": "Calentamiento | Principal | Estiramiento",
            "exercises": [
              {
                "name": "Nombre del ejercicio",
                "sets": número de series (solo si aplica),
                "repetitions": "repeticiones (solo si aplica)",
                "duration": "tiempo (solo si aplica)",
                "rest": "descanso entre series (si aplica)",
                "type": "fuerza | resistencia | movilidad",
                "equipment": "ninguno | mancuernas | barra | máquina | banda",
                "tips": "consejo útil"
              }
            ]
          }
        ]
      }
    }
  ]
}

Cada día debe tener exactamente 3 fases: Calentamiento, Principal y Estiramiento.
- Calentamiento: 2-3 ejercicios.
- Principal: 4-6 ejercicios.
- Estiramiento: mínimo 2 ejercicios.

NO INCLUYAS "Aquí tienes", ni comillas alrededor del JSON, ni formato markdown (\`\`\`). Devuelve el JSON limpio. Solo eso.`,
        },
    ];

    try {
        const response = await fetch(
            'https://api.openai.com/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo', // Modelo actualizado y válido
                    messages,
                    temperature: 0,
                    max_tokens: 8000, // Reducido para el modelo estándar
                }),
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI API error:', response.status, errorText);
            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                },
                body: JSON.stringify({
                    error: 'Error en la API de OpenAI',
                    status: response.status,
                    details: errorText,
                }),
            };
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content || typeof content !== 'string') {
            console.error('Respuesta sin contenido o malformada:', data);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                },
                body: JSON.stringify({
                    error: 'OpenAI no devolvió contenido válido',
                    rawResponse: data,
                }),
            };
        }

        // Limpiar la respuesta de posibles caracteres extra
        const cleanContent = content
            .trim()
            .replace(/^```json\n?/, '')
            .replace(/\n?```$/, '');

        // Validar que sea JSON válido antes de enviarlo
        try {
            JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            console.error('Raw content:', content);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                },
                body: JSON.stringify({
                    error: 'La respuesta de OpenAI no es JSON válido',
                    rawContent: content,
                }),
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
            body: JSON.stringify({ content: cleanContent }),
        };
    } catch (err) {
        console.error('Excepción inesperada:', err);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
            body: JSON.stringify({
                error: 'Error inesperado al generar el plan',
                details: err.message,
            }),
        };
    }
}
