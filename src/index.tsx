// src/index.tsx
import logoPill from "./assets/sceneassist-lockup-stacked.svg";
import phones from "./assets/image-3.png";
import React, { useState } from 'react';
import AppleIdHelp from "./components/AppleIDHelp";

// import playBadge from "./assets/image-2.png";
// import appStoreBadge from "./assets/group.png";

import useHeadroom from "./components/hooks/useHeadroom";

// Custom messages per field + constraint type
const ERR: Record<string, Partial<Record<"valueMissing" | "typeMismatch" | "patternMismatch", string>>> = {
    full_name: {
        valueMissing: "Please enter your full name",
    },
    apple_id_email: {
        valueMissing: "Please enter your Apple ID email",
        typeMismatch: "Enter a valid Apple ID email you use with the App Store",
    },
    affiliation: {
        valueMissing: "Please enter your campus department or venue",
    },
    role: {
        valueMissing: "Please select your role",
    },
    consent: {
        valueMissing: "You must agree to receive a TestFlight invitation to continue",
    },
};

// Set a custom message based on the element’s validity
const handleInvalid = (e: React.FormEvent<any>) => {
    const el = e.currentTarget as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const name = (el.getAttribute("name") || el.id || "").toString();
    const v = el.validity;

    let msg = "";
    if (v.valueMissing && ERR[name]?.valueMissing) msg = ERR[name]!.valueMissing!;
    else if (v.typeMismatch && ERR[name]?.typeMismatch) msg = ERR[name]!.typeMismatch!;
    else if (v.patternMismatch && ERR[name]?.patternMismatch) msg = ERR[name]!.patternMismatch!;

    el.setCustomValidity(msg);
};

// Clear custom message as the user types/selects
// const clearInvalid = (e: React.FormEvent<any>) => {
//     (e.currentTarget as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).setCustomValidity("");
// };


export default function App() {
    const { pinned } = useHeadroom({
        pinStart: 24,
        downTolerance: 10,
        upTolerance: 6,
    });

    const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setState("loading");

        const fd = new FormData(e.currentTarget);

        // send exactly what a normal form would send
        const body = new URLSearchParams();
        fd.forEach((v, k) => body.append(k, String(v)));

        try {
            const res = await fetch("/api/testflight-signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    "Accept": "application/json", // so the API can return 200 JSON (no redirect)
                },
                body: body.toString(),
            });
            setState(res.ok ? "success" : "error");
        } catch {
            setState("error");
        }
    }

    return (
        <main className="flex flex-1 flex-col text-slate-900 min-w-[360px]">
            {/* ================= HEADER ================= */}
            <header className={[
                "sticky top-0 left-0 right-0 z-40 border-b border-black/10 backdrop-blur bg-black",
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
                flex
                flex-1
                flex-col
                relative w-full left-[calc(50%-50w)] items-center isolate"

            >
                <div className="grow hero-bg mx-auto w-full px-4 xl:py-10 py-5 sm:px-6 lg:px-8">
                    {/* Transparent content grid */}
                    <div className="relative grid items-center gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                        {/* Left: copy + badges */}
                        <div className="min-w-0">
                            <h1
                                className="mt-3 font-black leading-[1.05] text-slate-900 text-balance"
                                style={{ fontSize: "clamp(2.25rem, 2.6vw + 0.5rem, 3.75rem)" }}
                            >
                                Audio Description
                                <span className="block">that’s actually easy.</span>
                            </h1>

                            <p className="text-center mt-5 text-lg text-slate-800 mx-auto w-full max-w-[360px] sm:max-w-[640px]">
                                Inclusive, low-latency audio description for live theatre and
                                campus events - right on your phone. No rentals. No lines.{" "}
                                <strong>Start listening.</strong>
                            </p>

                            <div className="mt-4 flex flex-col w-full flex-wrap items-center justify-center gap-4 min-h-[340px] sm:min-h-[380px]">
                                {/* <img src={appStoreBadge} alt="Pre-order on the App Store" className="h-14 w-auto" loading="lazy" />
                                <img src={playBadge} alt="Pre-register on Google Play" className="h-14 w-auto" loading="lazy" /> */}

                                <form action="/api/testflight-signup" method="POST" className={`${state === "success" ? "hidden" : ""} mx-auto w-full max-w-[360px] sm:max-w-[640px] space-y-2 text-sm`} onSubmit={onSubmit}>
                                    <h1 id="beta-signup" className="mt-4 text-3xl font-semibold text-slate-900">
                                        Request TestFlight invite
                                    </h1>
                                    <p className="mt-1 text-base text-slate-700">
                                        Private iOS beta for campus pilots. iOS TestFlight required.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Full name */}
                                        <label className="block">
                                            <span className="text-start mb-1 block font-medium text-slate-800">Full name</span>
                                            <input
                                                onInvalid={handleInvalid}
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
                                                    {/* <button
                                                        type="button"
                                                        aria-describedby="apple-id-help"
                                                        aria-expanded={showAidHelp}
                                                        aria-controls="apple-id-help"
                                                        onClick={() => setShowAidHelp((v) => !v)}
                                                        onBlur={() => setShowAidHelp(false)}        // closes when focus leaves
                                                        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-400 bg-white text-[10px] leading-none text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                                                        aria-label="What is an Apple ID email?"
                                                    >
                                                        i
                                                    </button>
                                                    <span
                                                        id="apple-id-help"
                                                        role="tooltip"
                                                        className={`absolute left-1/2 z-30 mt-2 w-60 -translate-x-1/2 rounded-md bg-slate-900 px-2.5 py-2 text-xs text-white shadow-lg ${showAidHelp ? "block" : "hidden"
                                                            }`}                                                    >
                                                        The email you use with the App Store on your device. We’ll send your TestFlight invite here.
                                                    </span> */}
                                                    <AppleIdHelp className="left-0 sm:left-1"></AppleIdHelp>
                                                </span>
                                            </div>
                                            <input
                                                onInvalid={handleInvalid}
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
                                            <span className="text-start mb-1 block font-medium text-slate-800 whitespace-nowrap">Campus department or venue</span>
                                            <input
                                                onInvalid={handleInvalid}
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
                                            onInvalid={handleInvalid}
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
                                <div
                                    role="status"
                                    aria-live="polite"
                                    className={`${state === "success" ? "block" : "hidden"} basis-1/2 grow-0 shrink-0 flex flex-col mx-auto w-full max-w-[360px] sm:max-w-[640px] rounded-xl bg-emerald-50 p-4 text-slate-800 shadow-lg + ring-1 ring-[black]-200/60`}
                                >
                                    <h3 className="text-lg font-semibold">Thanks for signing up. You’re in!</h3>
                                    <p className="mt-1 text-sm">
                                        Keep an eye on your Apple ID inbox for a TestFlight invite.
                                    </p>

                                    <div className="mt-3 flex gap-3 justify-center">
                                        <a
                                            href="https://apps.apple.com/app/testflight/id899247664"
                                            className="items-center rounded-lg bg-slate-900 px-3 py-2 text-white text-sm hover:bg-slate-800"
                                        >
                                            Get TestFlight
                                        </a>
                                    </div>

                                    <p className="mt-3 text-xs text-slate-600">
                                        We only use your info for beta access and pilot coordination.
                                    </p>
                                </div>
                                <div className={`${state === "success" ? "flex-1 min-h-0 mx-auto w-full max-w-[360px] sm:max-w-[640px]" : "hidden"} `}></div>

                            </div>
                        </div>

                        {/* Right: phones */}
                        <div className="relative flex items-center justify-center min-w-0">
                            <img
                                src={phones}
                                alt="SceneAssist mobile app mockups"
                                className="block w-[clamp(300px,36vw,560px)] aspect-[916/1041]"
                                loading="eager"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
