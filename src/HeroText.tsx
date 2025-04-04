export default function HeroText() {
    return (
        <div className="font-recoleta mb-12 max-w-4xl text-center">
            <h1 className="mb-4 text-5xl font-bold text-pretty sm:text-6xl md:text-7xl lg:text-8xl">
                Entrenamiento, ahora con IA
            </h1>
            <p className="font-satoshi mx-auto max-w-60 text-xs text-balance text-gray-400 sm:text-sm md:max-w-2xl md:text-base lg:text-lg">
                El nuevo estándar para entrenamientos personalizados, reemplaza
                rutinas genéricas con planes{' '}
                <span className="font-satoshi-bd"> adaptados</span> y al{' '}
                <span className="font-satoshi-bd"> instante</span>.
            </p>
        </div>
    );
}
