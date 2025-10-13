import { Link } from "react-router-dom";
// optional: show the wordmark
// import logoPill from "../assets/sceneassist-lockup-stacked.svg";

export default function NotFound() {
    return (
        <main className="flex flex-1 flex-col text-slate-900 min-w-[360px]">
            {/* Hero-ish band so it fits your marketing look */}
            <section className="hero-bg w-full flex-1">
                <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="max-w-[640px] mx-auto text-center">
                        {/* Optional logo
            <img src={logoPill} alt="SceneAssist" className="mx-auto mb-6 h-10 w-auto" />
            */}
                        <h1
                            className="font-black leading-tight text-slate-900"
                            style={{ fontSize: "clamp(2rem, 2.4vw + 0.5rem, 3rem)" }}
                        >
                            Page not found
                        </h1>
                        <p className="mt-3 text-slate-700">
                            The page you’re looking for doesn’t exist or has moved.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                to="/"
                                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/50"
                            >
                                Go home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}