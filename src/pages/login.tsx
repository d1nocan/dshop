import { type Provider } from "next-auth/providers";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn({ providers }: { providers: Provider[] }) {
    const router = useRouter();
    const session = useSession();
    session.data?.user && router.push("/");
    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-neutral-900 dark:bg-neutral-50">
            <div className="mx-auto flex w-fit min-w-[250px] flex-col gap-6 rounded-lg border-4 border-neutral-900 bg-neutral-100 p-10 duration-100 hover:-translate-x-1 hover:-translate-y-1 dark:border-neutral-50 dark:bg-neutral-800">
                {Object.values(providers).map((provider) => (
                    <button
                        key={provider.name}
                        className="rounded border-2 border-neutral-900 bg-neutral-200 p-2 shadow-xl dark:border-neutral-50 dark:bg-neutral-900"
                        type="button"
                        onClick={() => signIn(provider.id)}
                    >
                        Sign in with {provider.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: { providers },
    };
}
