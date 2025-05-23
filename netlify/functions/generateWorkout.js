export async function handler(event) {
    const { userName, goals, days } = JSON.parse(event.body);

    const messages = [
        {
            role: 'system',
            content: `Eres un generador de planes de entrenamiento. Tu única tarea es responder con un objeto JSON válido, siguiendo estrictamente la estructura indicada por el usuario.
NO debes incluir saludos, explicaciones, texto antes o después del JSON.
Tu respuesta debe ser exclusivamente el JSON. Cualquier otra cosa está terminantemente prohibida.`,
        },
        {
            role: 'user',
            content: `Crea un plan de entrenamiento para ${userName} con los siguientes objetivos: ${goals.join(', ')}.
El plan debe incluir entrenamientos para estos días: ${days.join(', ')}.

Devuelve EXCLUSIVAMENTE un objeto JSON válido con la siguiente estructura exacta (sin ningún texto adicional antes o después):

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

REGLAS ESTRICTAS:

- Cada día debe tener exactamente 3 fases: Calentamiento, Principal y Estiramiento.
- Calentamiento: 2 a 3 ejercicios.
- Principal: 4 a 6 ejercicios intensos relacionados a los objetivos.
- Estiramiento: mínimo 2 ejercicios.
- Los ejercicios deben ser variados, no repetirse en días consecutivos y adaptados a los objetivos indicados.

🚫 PROHIBIDO incluir cualquier otra cosa fuera del JSON. No uses etiquetas, saludos ni explicaciones.

Devuelve SOLO el objeto JSON. Nada más.`,
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
