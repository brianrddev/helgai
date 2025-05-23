export async function handler(event) {
    const { userName, goals, days } = JSON.parse(event.body);

    const messages = [
        {
            role: 'system',
            content:
                'Eres un generador de planes de entrenamiento. Tu única función es devolver un objeto JSON válido. No puedes incluir saludos, explicaciones, comentarios ni texto adicional. Bajo ninguna circunstancia debes responder con texto fuera del objeto JSON. Si no puedes cumplir esto, responde con un objeto JSON vacío: {}.',
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

Los ejercicios deben ser específicos y distintos entre días consecutivos.

NO INCLUYAS texto fuera del JSON. Solo devuelve el JSON. Nada más.`,
        },
    ];

    console.log(messages);

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
                    model: 'gpt-3.5-turbo',
                    messages,
                    temperature: 0.7,
                    max_tokens: 3000,
                }),
            },
        );

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        return {
            statusCode: 200,
            body: JSON.stringify({ content }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error al generar el plan',
                details: err.message,
            }),
        };
    }
}
