import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Label } from "~/components/ui/label";
import { RotateCcw, Rocket } from "lucide-react";

// STATIC DATA - Hardcoded repos since we're not using backend
const STATIC_REPOS = [
    {
        id: 1,
        full_name: "example/react-app",
        private: false,
        description: "A sample React application",
        language: "TypeScript"
    },
    {
        id: 2,
        full_name: "example/node-backend",
        private: true,
        description: "Node.js backend API",
        language: "JavaScript"
    },
    {
        id: 3,
        full_name: "example/python-ml",
        private: false,
        description: "Machine learning project",
        language: "Python"
    }
];

type Repo = {
    id: number;
    full_name: string;
    private: boolean;
    description: string;
    language: string;
};

export default function ConnectGitHub({ onRepoSelected }: { onRepoSelected?: (owner: string, repo: string) => void }) {
    const [phase, setPhase] = useState<"idle" | "loading" | "connected" | "error">("connected");
    const [repos] = useState<Repo[]>(STATIC_REPOS); // Using static data
    const [selectedRepo, setSelectedRepo] = useState<string>("");

    const connected = phase === "connected";
    const busy = phase === "loading";

    return (
        <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="text-white">GitHub Integration</CardTitle>
                    <CardDescription className="text-gray-400">Connect and select a repository to analyze.</CardDescription>
                </div>
                <Badge variant={connected ? "default" : "secondary"} className={connected ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"}>
                    {connected ? "Ready" : "Not configured"}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-5">
                {repos.length === 0 ? (
                    <>
                        <p className="text-sm text-gray-400">
                            {busy
                                ? "Loading your repositories..."
                                : "You don't have any repositories, or we couldn't load them."}
                        </p>
                        {busy && <Skeleton className="h-9 w-full bg-gray-700" />}
                    </>
                ) : (
                    <>
                        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                            <div className="grid gap-2">
                                <Label htmlFor="repo" className="text-gray-300">Repository</Label>
                                {busy ? (
                                    <Skeleton className="h-9 w-full bg-gray-700" />
                                ) : (
                                    <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                                        <SelectTrigger id="repo" className="w-full bg-gray-900 border-gray-600 text-white">
                                            <SelectValue placeholder="Choose a repository" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-gray-700">
                                            {repos.map((r) => (
                                                <SelectItem key={r.id} value={r.full_name} className="text-white focus:bg-gray-800 focus:text-white">
                                                    <div className="flex items-center gap-2">
                                                        <span>{r.full_name}</span>
                                                        {r.private && <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">Private</Badge>}
                                                        {r.language && <Badge variant="secondary" className="text-xs bg-purple-600/20 text-purple-300 border-purple-600/50">{r.language}</Badge>}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                            <div className="flex items-end gap-2">
                                <Button variant="outline" size="sm" disabled={busy} className="border-purple-600 text-white hover:bg-purple-700 hover:text-white">
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Refresh
                                </Button>
                                <Button size="sm" disabled={!selectedRepo || busy} className="gap-2 bg-purple-600 hover:bg-purple-500 text-white">
                                    <Rocket className="h-4 w-4" />
                                    Analyze
                                </Button>
                            </div>
                        </div>

                        <Separator className="bg-gray-700" />
                        <p className="text-xs text-gray-400">
                            We'll analyze your repository to create a feature map and set up webhooks to track changes automatically.
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
