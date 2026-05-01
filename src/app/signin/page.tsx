import { signIn } from '@/auth';
import Image from 'next/image';

export default async function SignInPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
                {/* Left: pitch */}
                <div className="space-y-5">
                    <h1 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent"
                        style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-highlight))' }}>
                        AI Notes
                    </h1>
                    <p className="text-muted text-base">
                        Smart note-taking with AI-powered summaries and tags.
                    </p>
                    <ul className="space-y-2 text-sm text-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-primary">✦</span>
                            <span>Per-user notes with full CRUD</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">✦</span>
                            <span>AI summaries with streaming responses (Gemini)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">✦</span>
                            <span>AI-generated tags for organization</span>
                        </li>
                    </ul>
                    <div className="rounded-2xl overflow-hidden border border-white/10">
                        <Image
                            src="/screenshot.png"
                            alt="AI Notes preview"
                            width={800}
                            height={500}
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                {/* Right: auth */}
                <div className="bg-card border border-white/10 rounded-2xl p-8 w-full space-y-4">
                    <h2 className="text-xl font-semibold text-center text-foreground">Sign in to continue</h2>
                    <p className="text-muted text-center text-sm">Pick your provider</p>
                    <form action={async () => { 'use server'; await signIn('github', { redirectTo: '/' }); }}>
                        <button type="submit" className="w-full bg-card hover:bg-accent/40 border border-white/10 text-foreground px-4 py-2 rounded-xl transition-colors cursor-pointer font-medium">
                            Continue with GitHub
                        </button>
                    </form>
                    <form action={async () => { 'use server'; await signIn('google', { redirectTo: '/' }); }}>
                        <button type="submit" className="w-full bg-card hover:bg-accent/40 border border-white/10 text-foreground px-4 py-2 rounded-xl transition-colors cursor-pointer font-medium">
                            Continue with Google
                        </button>
                    </form>
                    <p className="text-xs text-muted text-center pt-2">
                        We only store your name, email, and avatar.
                    </p>
                </div>
            </div>
        </main>
    );
}
