// src/App.tsx
import React from "react";

/* ---- your assets (place in src/assets/) ---- */
import logoPill from "./assets/sceneassist-lockup-stacked.svg";
import phones from "./assets/image-3.png";
import playBadge from "./assets/image-2.png";
import appStoreBadge from "./assets/group.png";
import useHeadroom from "./components/hooks/useHeadroom";

/* Brand tokens */
const brand = {
    primary: "#002363",
    blue: "#a6c6fe",
};



export default function App() {
    const { pinned, scrolled } = useHeadroom({
        pinStart: 24,        // start reacting after 24px
        downTolerance: 10,   // feel free to tweak
        upTolerance: 6,
    });
    return (
        <main className="flex flex-1 flex-col bg-white text-slate-900">
            {/* ================= HEADER ================= */}
            <header className={[
                "sticky top-0 z-40 border-b border-black/10 backdrop-blur bg-black",
                "transition-transform duration-200 will-change-transform",
                // hide on scroll down, show on scroll up
                pinned ? "translate-y-0" : "-translate-y-full",
            ].join(" ")}>
                <div className="my-2 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-center">
                    <a href="#home" className="inline-flex flex-col items-center">
                        <img
                            src={logoPill}
                            alt="SceneAssist — Audio Description for any scene"
                            className="h-9 w-auto"
                        />
                    </a>
                    {/* <a
                        href="#get"
                        className="rounded-xl px-3.5 py-2 text-sm font-semibold text-white"
                        style={{ background: brand.primary }}
                    >
                        Get the app
                    </a> */}
                </div>
            </header>
            <section
                id="home"
                className="
                flex-1
                relative flex w-[100dvw] left-[calc(50%-50dvw)] items-center pt-px pb-px -mb-px isolate"
                style={{
                    background: `
            radial-gradient(1200px 600px at 70% -10%, rgba(255,255,255,.45), transparent 60%),
            linear-gradient(180deg, #b9d0ff 0%, #a6c6fe 35%, #97b7f2 100%)`,
                }}
            >
                <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 md:py-2 lg:py-20">
                    {/* Transparent content grid */}
                    <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                        {/* Left: copy + badges */}
                        <div className="min-w-0">
                            <h1
                                className="mt-3 font-black leading-[1.05] text-slate-900 text-balance"
                                style={{ fontSize: "clamp(2.25rem, 2.6vw + 0.5rem, 3.75rem)" }}
                            >
                                Audio Description
                                <span className="block">that’s actually easy.</span>
                            </h1>

                            <p className="text-center mt-5 text-lg text-slate-800">
                                Inclusive, low-latency audio description for live theatre and
                                campus events - right on your phone. No rentals. No lines.{" "}
                                <strong>Start listening.</strong>
                            </p>
                            <h2 id="beta-signup" className="mt-4 text-xl font-semibold text-slate-900">
                                Request TestFlight invite
                            </h2>
                            <p className="mt-1 text-sm text-slate-700">
                                Private iOS beta for campus pilots. iOS TestFlight required.
                            </p>
                            <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-4">
                                {/* <img src={appStoreBadge} alt="Pre-order on the App Store" className="h-14 w-auto" loading="lazy" />
                                <img src={playBadge} alt="Pre-register on Google Play" className="h-14 w-auto" loading="lazy" /> */}

                                <form action="/api/testflight-signup" method="POST" className="mx-auto w-full max-w-[360px] sm:max-w-[640px] space-y-2 text-sm">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Full name */}
                                        <label className="block">
                                            <span className="text-start mb-1 block font-medium text-slate-800">Full name</span>
                                            <input
                                                name="full_name"
                                                required
                                                placeholder="Jane Doe"
                                                className="bg-white w-full h-10 rounded-lg border border-slate-300 px-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/20"
                                            />
                                        </label>

                                        {/* Apple ID email */}
                                        <label className="block">
                                            <div className="mb-1 flex items-center gap-1">
                                                <span className="font-medium text-slate-800">Apple ID email</span>
                                                <span className="relative group inline-flex">
                                                    <button
                                                        type="button"
                                                        aria-describedby="apple-id-help"
                                                        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 bg-white text-[10px] leading-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                                                        aria-label="What is an Apple ID email?"
                                                    >
                                                        i
                                                    </button>
                                                    <span
                                                        id="apple-id-help"
                                                        role="tooltip"
                                                        className="pointer-events-none absolute left-1/2 z-10 mt-2 hidden w-60 -translate-x-1/2 rounded-md bg-slate-900 px-2.5 py-2 text-xs text-white shadow-lg group-hover:block group-focus-within:block"
                                                    >
                                                        The email you use with the App Store on your device. We’ll send your TestFlight invite here.
                                                    </span>
                                                </span>
                                            </div>
                                            <input
                                                type="email"
                                                name="apple_id_email"
                                                required
                                                placeholder="jane@icloud.com"
                                                aria-describedby="apple-id-help"
                                                className="bg-white w-full h-10 rounded-lg border border-slate-300 px-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/20"
                                            />
                                        </label>

                                        {/* Affiliation */}
                                        <label className="block">
                                            <span className="text-start mb-1 block font-medium text-slate-800">Affiliation / Campus / Department or Venue</span>
                                            <input
                                                name="affiliation"
                                                required
                                                placeholder="Cal Poly — Theatre & Dance"
                                                className="bg-white w-full h-10 rounded-lg border border-slate-300 px-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900/20"
                                            />
                                        </label>

                                        {/* Role */}
                                        <label className="block">
                                            <span className="text-start mb-1 block font-medium text-slate-800">Role</span>
                                            <select
                                                name="role"
                                                required
                                                defaultValue=""
                                                className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 outline-none focus:ring-2 focus:ring-slate-900/20"
                                            >
                                                <option value="" disabled>Select a role</option>
                                                <option>Accessibility Office</option>
                                                <option>Theatre Dept</option>
                                                <option>Event Services</option>
                                                <option>Student</option>
                                                <option>Other</option>
                                            </select>
                                        </label>
                                    </div>

                                    {/* Consent (compact + visible checkbox) */}
                                    <div className="flex items-start gap-2">
                                        <input
                                            id="consent"
                                            type="checkbox"
                                            name="consent"
                                            required
                                            className="h-5 w-5 rounded border-slate-400 mt-0.5"
                                            style={{
                                                appearance: 'auto',
                                                WebkitAppearance: 'checkbox',
                                                accentColor: '#0f172a',
                                                backgroundColor: 'white'
                                            }}
                                            aria-describedby="consent-help"
                                        />
                                        <label htmlFor="consent" className="text-start text-slate-800 leading-5">
                                            I agree to receive a TestFlight invitation and understand diagnostic/crash data
                                            may be collected during the beta.
                                        </label>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/50"
                                    >
                                        Request TestFlight invite
                                    </button>

                                    <p className="text-center text-xs text-slate-500">
                                        We’ll only use your info for beta access and pilot coordination.
                                    </p>
                                </form>
                            </div>
                        </div>

                        {/* Right: phones */}
                        <div className="relative flex items-center justify-center lg:justify-end min-w-0">
                            <img
                                src={phones}
                                alt="SceneAssist mobile app mockups"
                                className="block h-auto max-w-full w-[min(560px,92%,calc(min(520px,65vh)*916/1041))]"
                                loading="eager"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER =================
          - Full-bleed to match the hero.
          - pt-px prevents top-margin collapse from its first child.
          - flow-root creates an isolated block formatting context (also blocks margin collapse).
      */}
        </main>
    );
}
