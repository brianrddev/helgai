interface UserNameProps {
    userName: string;
    setUserName: React.Dispatch<React.SetStateAction<string>>;
    handleNameSubmit: (e: React.FormEvent) => void;
}

export default function UserName({
    userName,
    setUserName,
    handleNameSubmit,
}: UserNameProps) {
    return (
        <form
            onSubmit={handleNameSubmit}
            className="flex w-96 items-center justify-between border-b-2 border-blue-600"
        >
            <div className="font-satoshi-md h-fit tracking-wide placeholder:opacity-65">
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Ingresa tu nombre"
                    className="w-full rounded bg-transparent py-2 focus:outline-none"
                    required
                    autoFocus
                />
            </div>
            <div className="flex justify-end">
                <button type="submit" className="cursor-pointer">
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
        </form>
    );
}
