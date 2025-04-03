import './App.css';
import Squares from './backgrounds/Squares/Squares';
import Badge from './Badge';
import Header from './Header';
import HeroText from './HeroText';
import MainSection from './MainSection';

const App: React.FC = () => {
    return (
        <>
            <div className="flex min-h-screen flex-col bg-gray-100 text-gray-950">
                <Header />
                <div className="z-10 flex flex-grow flex-col items-center justify-center px-4 py-12">
                    <Badge />
                    <HeroText />
                    <MainSection />
                </div>
                <div className="absolute right-0 bottom-0 left-0 z-0 mx-auto h-[300px] max-h-screen w-full overflow-hidden mask-t-from-1.5 mask-b-from-95%">
                    <Squares speed={0.2} />
                </div>
            </div>
        </>
    );
};

export default App;
