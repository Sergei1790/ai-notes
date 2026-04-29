import {auth, signOut} from '@/auth';
import Image from 'next/image';

export default async function Header() {
    const session = await auth();
    if (!session?.user) return null;
    return (
        <header className="border-b border-white/10 bg-card/50 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
            <span className="font-semibold text-foreground">AI Notes</span>
            <div className="flex items-center gap-3">
                {session.user.image && <Image src={session.user.image} alt="avatar" width={32} height={32} className="rounded-full" />}
                <span className="text-sm text-muted hidden sm:block">{session.user.name}</span>
                <form
                    action={async () => {
                        'use server';
                        await signOut({redirectTo: '/signin'});
                    }}>
                    <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted hover:text-foreground transition-colors cursor-pointer">
                        Sign out
                    </button>
                </form>
            </div>
        </header>
    );
}
