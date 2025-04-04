export default function Badge() {
    return (
        <div className="mb-6 flex flex-col items-center">
            <div className="flex items-center rounded-md bg-blue-600 px-2 py-2">
                <span className="font-recoleta-bd mr-2 rounded bg-white px-1 py-1 text-xs text-gray-800 capitalize md:px-1 md:py-1 md:text-base">
                    new
                </span>
                <span className="font-satoshi-md text-xs tracking-wide text-gray-100 md:text-base">
                    Entrena con inteligencia artificial
                </span>
            </div>
        </div>
    );
}
