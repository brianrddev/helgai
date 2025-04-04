interface UserGoalsProps {
    selectedGoals: string[];
    availableGoals: string[];
    handleGoalToggle: (goal: string) => void;
    handleGoalsSubmit: (e: React.FormEvent) => void;
}

export default function UserGoals({
    selectedGoals,
    availableGoals,
    handleGoalToggle,
    handleGoalsSubmit,
}: UserGoalsProps) {
    return (
        <form onSubmit={handleGoalsSubmit} className="mb-8">
            <div className="flex flex-col">
                <div className="mb-4 flex flex-col gap-2 rounded-md bg-transparent mask-b-from-56 p-4 md:flex-row md:flex-nowrap md:mask-b-from-12">
                    {availableGoals.map((goal) => (
                        <button
                            key={goal}
                            type="button"
                            onClick={() => handleGoalToggle(goal)}
                            className={`cursor-pointer rounded-md px-4 py-2 transition-all ease-in-out select-none hover:bg-gray-300 md:duration-200 ${
                                selectedGoals.includes(goal)
                                    ? 'bg-gray-200'
                                    : 'border-gray-500 bg-transparent'
                            }`}
                        >
                            {goal}
                        </button>
                    ))}
                </div>
                <div className="mx-auto mt-4 flex md:mx-0 md:justify-end">
                    <button
                        type="submit"
                        disabled={selectedGoals.length === 0}
                        className={`cursor-pointer ${selectedGoals.length === 0 ? 'cursor-not-allowed' : ''}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="none"
                            className="transition-all duration-300 ease-in-out hover:translate-x-1 hover:text-blue-600"
                        >
                            <path
                                d="M20.0001 11.9998L4.00012 11.9998"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M15.0003 17C15.0003 17 20.0002 13.3176 20.0002 12C20.0002 10.6824 15.0002 7 15.0002 7"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </form>
    );
}
