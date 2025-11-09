import Navbar from '~/components/Navbar';
import { Button } from "~/components/ui/button";

// Static navigation data
const navigation = [
    { name: 'Services', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
]

const Home = () => {
    return (
        <div>
            <Navbar navigation={navigation} />

            <div className="relative isolate px-6 pt-14 lg:px-8 flex justify-center">
                <div className="max-w-2xl py-32 sm:py-48 lg:py-56 *text-center">
                    <div>
                        <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
                            Decoding Vibecoding
                        </h1>
                        <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
                            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
                            fugiat veniam occaecat.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <div className="flex items-center gap-x-6">
                                <Button
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5"
                                    onClick={() => {}}
                                >
                                    Get started
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
                                >
                                    Learn more →
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
