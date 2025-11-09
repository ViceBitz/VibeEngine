import { useState } from "react";
import ConnectGitHub from "~/components/ConnectGithub";
import FeatureMapVisualization from "~/components/FeatureMapVisualization";
import ChatInterface from "~/components/ChatInterface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// STATIC DATA - Hardcoded features since we're not using backend
const STATIC_FEATURES = [
    {
        featureId: "feature-1",
        featureName: "User Authentication",
        userSummary: "Allows users to sign up, log in, and manage their accounts securely.",
        aiSummary: "Implements JWT-based authentication with refresh tokens, password hashing using bcrypt, and session management.",
        filenames: ["src/auth/login.ts", "src/auth/signup.ts", "src/middleware/auth.ts"],
        neighbors: ["feature-2", "feature-3"]
    },
    {
        featureId: "feature-2",
        featureName: "User Profile",
        userSummary: "Users can view and edit their profile information including avatar and bio.",
        aiSummary: "RESTful API endpoints for CRUD operations on user profiles, with image upload support via S3.",
        filenames: ["src/profile/profile.controller.ts", "src/profile/profile.service.ts"],
        neighbors: ["feature-1"]
    },
    {
        featureId: "feature-3",
        featureName: "Dashboard Analytics",
        userSummary: "Displays key metrics and statistics about user activity and engagement.",
        aiSummary: "Aggregates data from multiple sources using Redis caching, renders charts with recharts library.",
        filenames: ["src/analytics/dashboard.tsx", "src/analytics/metrics.service.ts"],
        neighbors: ["feature-1", "feature-4"]
    },
    {
        featureId: "feature-4",
        featureName: "Notifications",
        userSummary: "Sends real-time notifications to users about important events.",
        aiSummary: "WebSocket-based notification system with fallback to polling, stores notifications in PostgreSQL.",
        filenames: ["src/notifications/notification.service.ts", "src/notifications/websocket.ts"],
        neighbors: ["feature-3"]
    }
];

type Feature = {
    featureId: string;
    featureName: string;
    userSummary: string;
    aiSummary: string;
    filenames: string[];
    neighbors: string[];
};

export default function Dashboard() {
    const [features] = useState<Feature[]>(STATIC_FEATURES); // Using static data
    const [selectedRepo, setSelectedRepo] = useState<{ owner: string; repo: string; repoId?: string } | null>({
        owner: "example",
        repo: "react-app"
    });
    const [loading] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-24">
            <header className="sticky top-0 z-20 border-b border-gray-800 bg-gray-900/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-indigo-600 grid place-items-center text-white font-bold">
                            V
                        </div>
                        <h1 className="text-lg font-semibold tracking-tight text-white">VibeCode Analyzer</h1>
                        <span className="ml-3 hidden sm:inline text-xs rounded-full border border-gray-700 px-2 py-0.5 text-gray-400">
                            Dashboard
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-8 space-y-6">
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1 bg-gray-800/50 border-gray-700 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Welcome</CardTitle>
                            <CardDescription className="text-gray-400">
                                Select a repository to analyze its features and make AI-powered modifications.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400 space-y-1">
                            <p>• Interactive feature map visualization</p>
                            <p>• AI-powered code analysis</p>
                            <p>• Natural language code modifications</p>
                            <p>• Automatic commit tracking</p>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-2">
                        <ConnectGitHub />
                    </div>
                </section>

                {selectedRepo && (
                    <>
                        <section>
                            {loading && features.length === 0 ? (
                                <Card className="h-[600px] bg-gray-800/50 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white">Feature Map</CardTitle>
                                        <CardDescription className="text-gray-400">Loading feature map...</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Skeleton className="h-12 w-full bg-gray-700" />
                                        <Skeleton className="h-12 w-full bg-gray-700" />
                                        <Skeleton className="h-12 w-full bg-gray-700" />
                                    </CardContent>
                                </Card>
                            ) : (
                                <FeatureMapVisualization features={features} />
                            )}
                        </section>
                    </>
                )}

                {!selectedRepo && (
                    <Card className="bg-gray-800/50 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white">Get Started</CardTitle>
                            <CardDescription className="text-gray-400">
                                Select a repository above to view its feature map and start making AI-powered modifications.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </main>

            {/* Fixed Chat Interface at Bottom */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur border-t border-gray-800">
                <div className="mx-auto max-w-7xl px-5 py-4">
                    <form
                        className="flex items-center gap-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            // No implementation - just prevent default
                        }}
                    >
                        <Input
                            type="text"
                            placeholder="Chat with Gemini..."
                            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500 focus-visible:border-indigo-500"
                        />
                        <Button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6"
                        >
                            Send
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
