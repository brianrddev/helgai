import { useState } from 'react';
import UserName from './steps/UserName';
import UserGoals from './steps/UserGoals';
import SelectedDays from './steps/SelectedDays';

interface WorkoutDay {
    day: string;
    exercises: Exercise[];
}

interface Exercise {
    name: string;
    sets: number;
    repetitions: string;
    rest: string;
}

interface WorkoutPlan {
    userName: string;
    goals: string[];
    workoutDays: string[];
    generatedPlan: WorkoutDay[];
}

export default function MainSection() {
    // Estados para el formulario secuencial
    const [userName, setUserName] = useState('');
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    // Opciones disponibles
    const availableGoals = [
        'Pérdida de peso',
        'Ganancia muscular',
        'Resistencia',
        'Tonificación',
        'Fuerza',
    ];

    const availableDays = [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
        'Domingo',
    ];

    // Manejadores de eventos
    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim()) {
            setStep(2);
        }
    };

    const handleGoalToggle = (goal: string) => {
        if (selectedGoals.includes(goal)) {
            setSelectedGoals(selectedGoals.filter((g) => g !== goal));
        } else {
            setSelectedGoals([...selectedGoals, goal]);
        }
    };

    const handleGoalsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedGoals.length > 0) {
            setStep(3);
        }
    };

    const handleDayToggle = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const generateWorkoutPlanWithOpenAI = async (
        userName: string,
        goals: string[],
        days: string[],
    ) => {
        setApiError(null);

        try {
            const response = await fetch(
                '/.netlify/functions/generateWorkout',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userName, goals, days }),
                },
            );

            const data = await response.json();

            // ✅ Ahora el backend retorna { content: "..." }
            const content = data.content;
            const json = JSON.parse(content); // el plan generado

            console.log(json);
            return json;
        } catch (err) {
            console.error(err);
            setApiError('Error al generar el plan de entrenamiento.');
        }
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDays.length > 0) {
            setIsLoading(true);

            try {
                const workoutData = await generateWorkoutPlanWithOpenAI(
                    userName,
                    selectedGoals,
                    selectedDays,
                );

                const generatedWorkoutPlan: WorkoutPlan = {
                    userName,
                    goals: selectedGoals,
                    workoutDays: selectedDays,
                    generatedPlan: workoutData.generatedPlan,
                };

                setWorkoutPlan(generatedWorkoutPlan);
            } catch (error) {
                setApiError(
                    error instanceof Error
                        ? error.message
                        : 'Ocurrió un error al generar el plan',
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    const resetForm = () => {
        setUserName('');
        setSelectedGoals([]);
        setSelectedDays([]);
        setWorkoutPlan(null);
        setApiError(null);
        setStep(1);
    };

    return (
        <div className="h-fit min-h-56 w-fit max-w-6xl rounded-lg">
            {/* App Interface */}
            <div className="flex h-full flex-col md:flex-row">
                {/* Main Content Area */}
                <div className="p-6">
                    {/* Sequential Input Form */}
                    {!workoutPlan ? (
                        <div className="mx-auto flex w-60 items-center justify-center md:w-full">
                            {step === 1 && (
                                <UserName
                                    handleNameSubmit={handleNameSubmit}
                                    userName={userName}
                                    setUserName={setUserName}
                                />
                            )}

                            {step === 2 && (
                                <UserGoals
                                    selectedGoals={selectedGoals}
                                    availableGoals={availableGoals}
                                    handleGoalToggle={handleGoalToggle}
                                    handleGoalsSubmit={handleGoalsSubmit}
                                />
                            )}

                            {step === 3 && (
                                <SelectedDays
                                    handleFinalSubmit={handleFinalSubmit}
                                    availableDays={availableDays}
                                    handleDayToggle={handleDayToggle}
                                    selectedDays={selectedDays}
                                    isLoading={isLoading}
                                />
                            )}

                            {apiError && (
                                <div className="mt-4 w-full rounded-md bg-red-50 p-4 text-red-600">
                                    <p>Error: {apiError}</p>
                                    <p className="mt-2 text-sm">
                                        Asegúrate de haber configurado
                                        correctamente la API key de OpenAI en
                                        tus variables de entorno.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Display workout plan
                        <div className="mx-auto rounded-md bg-gray-50 shadow-2xl shadow-blue-700/80 md:w-full md:p-8 lg:min-w-3xl">
                            <div className="mb-6 border-b border-gray-300 p-6 pb-0">
                                <div className="mb-6 flex justify-between">
                                    <div className="flex items-center">
                                        <div className="flex flex-col gap-2">
                                            <h3 className="font-satoshi-bd text-xl capitalize">
                                                {workoutPlan.userName}
                                            </h3>
                                            <div className="text-md text-gray-500">
                                                Objetivos:{' '}
                                                {workoutPlan.goals.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={resetForm}
                                        className="max-h-10 cursor-pointer rounded bg-gray-300 px-4 py-2 transition-all duration-200 ease-in-out hover:bg-blue-600 hover:text-gray-50"
                                    >
                                        Nuevo plan
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {workoutPlan.generatedPlan.map((day, index) => (
                                    <div key={index} className="rounded-lg p-6">
                                        <div className="mb-4 flex items-center">
                                            <div className="mr-3 rounded-lg bg-blue-600 p-2 text-blue-50">
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <h3 className="font-satoshi-bd text-lg">
                                                {day.day}
                                            </h3>
                                        </div>

                                        <div className="ml-10 space-y-3">
                                            {day.exercises.map(
                                                (exercise, exIndex) => (
                                                    <div
                                                        key={exIndex}
                                                        className="border-l-2 border-blue-600/50 py-2 pl-4"
                                                    >
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                            <span className="font-satoshi text-lg">
                                                                {exercise.name}
                                                            </span>
                                                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 sm:mt-0">
                                                                <span>
                                                                    {
                                                                        exercise.sets
                                                                    }{' '}
                                                                    series
                                                                </span>
                                                                <span>
                                                                    {
                                                                        exercise.repetitions
                                                                    }{' '}
                                                                    reps
                                                                </span>
                                                                <span>
                                                                    {
                                                                        exercise.rest
                                                                    }{' '}
                                                                    descanso
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}

                                            <div className="mt-4 pl-4 text-sm text-gray-400">
                                                <span>
                                                    Recuerda calentar antes y
                                                    estirar después de cada
                                                    sesión
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
