'use client';

import { Button } from '~/components/ui/button';

type NavItem = { name: string; href: string };

export default function Navbar({
    navigation,
}: {
    navigation: NavItem[];
}) {
    // Static data - no backend auth
    const username = null; // Set to null since we're not using backend auth
    const checking = false;

    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="text-2xl font-bold text-indigo-500">VibeCode</span>
                    </a>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-white">
                            {item.name}
                        </a>
                    ))}
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    {checking ? (
                        <span className="text-sm/6 font-semibold text-white/70">…</span>
                    ) : username ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-white">{username}</span>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            className="text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
                            onClick={() => {/* No auth - just placeholder */}}
                            type="button"
                        >
                            Sign In
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    );
}
