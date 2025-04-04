interface SelectedDaysProps {
    handleFinalSubmit: (e: React.FormEvent) => void;
    handleDayToggle: (day: string) => void;
    availableDays: string[];
    selectedDays: string[];
    isLoading: boolean;
}

export default function SelectedDays({
    handleFinalSubmit,
    availableDays,
    handleDayToggle,
    selectedDays,
    isLoading,
}: SelectedDaysProps) {
    return (
        <form onSubmit={handleFinalSubmit} className="mb-6">
            <div>
                <div className="mb-4 flex flex-wrap gap-2 rounded-md bg-transparent mask-b-from-56 p-4 md:mask-b-from-12">
                    {availableDays.map((day) => (
                        <button
                            key={day}
                            type="button"
                            onClick={() => handleDayToggle(day)}
                            className={`cursor-pointer rounded-md px-4 py-2 transition-all duration-300 ease-in-out select-none hover:bg-gray-300 ${
                                selectedDays.includes(day)
                                    ? 'bg-gray-200'
                                    : 'border-gray-500 bg-transparent'
                            }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={selectedDays.length === 0 || isLoading}
                        className={`cursor-pointer rounded px-4 py-2 ${selectedDays.length === 0 || isLoading ? 'cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg
                                    className="mr-2 -ml-1 h-4 w-4 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Generando...
                            </span>
                        ) : (
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
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
