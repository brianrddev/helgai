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

- La fase de Calentamiento debe contener de 2 a 3 ejercicios.
- La fase Principal debe contener entre 4 y 6 ejercicios intensos enfocados en los objetivos indicados.
- La fase de Estiramiento debe incluir al menos 2 ejercicios de movilidad y relajación.

Los ejercicios deben ser variados, específicos para los objetivos, y no repetirse en días consecutivos.

No incluyas nada más que el JSON.`,
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
