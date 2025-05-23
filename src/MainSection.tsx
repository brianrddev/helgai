import { useState } from 'react';
import UserName from './steps/UserName';
import UserGoals from './steps/UserGoals';
import SelectedDays from './steps/SelectedDays';

interface Exercise {
    name: string;
    sets?: number;
    repetitions?: string;
    duration?: string;
    rest?: string;
    type: string;
    equipment: string;
    tips: string;
}

interface Phase {
    phaseName: string;
    exercises: Exercise[];
}

interface Workout {
    focus: string;
    duration: string;
    phases: Phase[];
}

interface WorkoutDay {
    day: string;
    workout: Workout;
}

interface WorkoutPlan {
    userName: string;
    goals: string[];
    workoutDays: string[];
    generatedPlan: WorkoutDay[];
}

export default function MainSection() {
    const [userName, setUserName] = useState('');
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

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

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim()) setStep(2);
    };

    const handleGoalToggle = (goal: string) => {
        setSelectedGoals((prev) =>
            prev.includes(goal)
                ? prev.filter((g) => g !== goal)
                : [...prev, goal],
        );
    };

    const handleGoalsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedGoals.length > 0) setStep(3);
    };

    const handleDayToggle = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
        );
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
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userName, goals, days }),
                },
            );

            const data = await response.json();
            return JSON.parse(data.content);
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
                setWorkoutPlan({
                    userName,
                    goals: selectedGoals,
                    workoutDays: selectedDays,
                    generatedPlan: workoutData.generatedPlan,
                });
            } catch (error) {
                setApiError(
                    error instanceof Error
                        ? error.message
                        : 'Error desconocido',
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
            <div className="flex h-full flex-col md:flex-row">
                <div className="p-6">
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
                                    selectedDays={selectedDays}
                                    availableDays={availableDays}
                                    handleDayToggle={handleDayToggle}
                                    handleFinalSubmit={handleFinalSubmit}
                                    isLoading={isLoading}
                                />
                            )}
                            {apiError && (
                                <div className="mt-4 w-full rounded-md bg-red-50 p-4 text-red-600">
                                    <p>Error: {apiError}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mx-auto rounded-md bg-gray-50 shadow-2xl shadow-blue-700/80 md:w-full md:p-8">
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
                                        className="rounded bg-gray-300 px-4 py-2 hover:bg-blue-600 hover:text-white"
                                    >
                                        Nuevo plan
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {workoutPlan.generatedPlan.map((day, index) => (
                                    <div key={index} className="rounded-lg p-6">
                                        <h3 className="font-satoshi-bd text-lg text-blue-700">
                                            {day.day}
                                        </h3>
                                        <p className="mb-2 text-sm text-gray-500">
                                            Enfoque: {day.workout.focus} |
                                            Duración: {day.workout.duration}
                                        </p>
                                        {day.workout.phases.map(
                                            (phase, pIdx) => (
                                                <div
                                                    key={pIdx}
                                                    className="mb-4"
                                                >
                                                    <h4 className="text-md mt-3 font-semibold text-blue-600">
                                                        {phase.phaseName}
                                                    </h4>
                                                    <ul className="ml-6 list-disc text-sm">
                                                        {phase.exercises.map(
                                                            (ex, eIdx) => (
                                                                <li
                                                                    key={eIdx}
                                                                    className="mb-2"
                                                                >
                                                                    <strong>
                                                                        {
                                                                            ex.name
                                                                        }
                                                                    </strong>{' '}
                                                                    {ex.sets &&
                                                                        `- ${ex.sets}x`}{' '}
                                                                    {ex.repetitions &&
                                                                        `${ex.repetitions} reps`}{' '}
                                                                    {ex.duration &&
                                                                        `- ${ex.duration}`}
                                                                    <br />
                                                                    <span className="text-gray-500">
                                                                        Tipo:{' '}
                                                                        {
                                                                            ex.type
                                                                        }{' '}
                                                                        |
                                                                        Equipo:{' '}
                                                                        {
                                                                            ex.equipment
                                                                        }{' '}
                                                                        |{' '}
                                                                        {ex.rest &&
                                                                            `Descanso: ${ex.rest}`}
                                                                    </span>
                                                                    <br />
                                                                    <em className="text-blue-500">
                                                                        Consejo:{' '}
                                                                        {
                                                                            ex.tips
                                                                        }
                                                                    </em>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            ),
                                        )}
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
