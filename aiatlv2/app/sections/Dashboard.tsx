import { useState } from "react";
import ConnectGitHub from "~/components/ConnectGithub";
import FeatureMapVisualization from "~/components/FeatureMapVisualization";
import ChatInterface from "~/components/ChatInterface";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

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
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary grid place-items-center text-primary-foreground font-bold">
                            V
                        </div>
                        <h1 className="text-lg font-semibold tracking-tight">VibeCode Analyzer</h1>
                        <span className="ml-3 hidden sm:inline text-xs rounded-full border px-2 py-0.5 text-muted-foreground">
                            Dashboard
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-5 py-8 space-y-6">
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Welcome</CardTitle>
                            <CardDescription>
                                Select a repository to analyze its features and make AI-powered modifications.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground space-y-1">
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
                                <Card className="h-[600px]">
                                    <CardHeader>
                                        <CardTitle>Feature Map</CardTitle>
                                        <CardDescription>Loading feature map...</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Skeleton className="h-12 w-full" />
                                        <Skeleton className="h-12 w-full" />
                                        <Skeleton className="h-12 w-full" />
                                    </CardContent>
                                </Card>
                            ) : (
                                <FeatureMapVisualization features={features} />
                            )}
                        </section>
                    </>
                )}

                {!selectedRepo && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Get Started</CardTitle>
                            <CardDescription>
                                Select a repository above to view its feature map and start making AI-powered modifications.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </main>
        </div>
    );
}
