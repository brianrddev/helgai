// netlify/functions/generateWorkout.js
export async function handler(event) {
    const { userName, goals, days } = JSON.parse(event.body);

    const messages = [
        {
            role: 'system',
            content:
                'Eres un entrenador personal experto que crea planes de entrenamiento personalizados. Responde siempre con un objeto JSON válido que tenga el formato exacto que se especifica, sin texto adicional.',
        },
        {
            role: 'user',
            content: `Crea un plan de entrenamiento para ${userName} con los siguientes objetivos: ${goals.join(
                ', ',
            )}.
      El plan debe incluir entrenamientos para estos días: ${days.join(', ')}.

      Devuelve SOLO un objeto JSON con la siguiente estructura exacta:
      {
        "generatedPlan": [
          {
            "day": "Nombre del día",
            "exercises": [
              {
                "name": "Nombre del ejercicio",
                "sets": número de series,
                "repetitions": "rango de repeticiones (ej: '8-12')",
                "rest": "tiempo de descanso (ej: '60 seg')"
              },
              ... más ejercicios
            ]
          },
          ... más días
        ]
      }

      Cada día debe tener entre 3-5 ejercicios específicos adaptados a los objetivos. No incluyas nada más que el JSON.`,
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
                    model: 'gpt-3.5-turbo',
                    messages,
                    temperature: 0.7,
                    max_tokens: 2000,
                }),
            },
        );

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
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
