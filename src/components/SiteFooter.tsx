// src/components/Footer.tsx
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import logoPill from ".././assets/sceneassist-wordmark.png";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import heartUrl from ".././assets/beating-heart.lottie?url";

export default function Footer() {
    return (
        <footer className="w-full min-w-[360px] min-[1400px]:py-2 py-4 bg-black">
            <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 min-[1400px]:grid-cols-3 items-center gap-2">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start gap-3">
                    <img src={logoPill} alt="SceneAssist" className="block h-auto w-[clamp(120px,20vw,180px)] max-h-8 shrink-0" />
                    <span className="text-xs text-[#FFD445] whitespace-normal sm:whitespace-nowrap [overflow-wrap:anywhere]">
                        Audio&nbsp;Description<wbr />&nbsp;for&nbsp;Any&nbsp;Scene
                    </span>
                </div>
                {/* Legal Links (left) */}
                {/* <div className="flex-1 flex space-x-6 items-center whitespace-nowrap">
                    <a
                        href="/privacy"
                        className="text-gray-400 underline hover:text-blue-400 transition-colors duration-200 text-xs"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="/terms"
                        className="text-gray-400 underline hover:text-blue-400 transition-colors duration-200 text-xs"
                    >
                        Terms &amp; Conditions
                    </a>
                </div> */}

                {/* Copyright (center) */}
                <div className="flex-2 text-center text-xs text-gray-400">
                    <small>
                        &copy; {new Date().getFullYear()} SceneAssist, Inc. All rights reserved.
                        <br />
                        SceneAssist<sup>™</sup> is a trademark of SceneAssist, Inc. Other names may be trademarks of their owners.
                    </small>
                </div>
                <div className="grid grid-cols-1 w-full min-[1400px]:justify-end gap-2">
                    {/* Contributions (left side of the right column) */}
                    <div className="place-self-center
                flex max-[499px]:flex-wrap min-[500px]:flex-nowrap
                justify-center min-w-0 items-center
                gap-x-1 gap-y-1
                text-xs text-gray-400 leading-none whitespace-normal text-center">

                        {/* prefix */}
                        <span className="inline-flex items-center leading-none">
                            Crafted with{' '}
                            <span className="relative inline-block h-7 w-7 align-middle">
                                <DotLottieReact
                                    src={heartUrl}
                                    loop
                                    autoplay
                                    aria-hidden="true"
                                    className="absolute inset-0 h-full w-full"
                                />
                            </span>
                            <span className="sr-only">love</span>
                            <span>by</span>
                        </span>

                        {/* force a line break ONLY below 500px */}
                        {/* <span className="hidden max-[499px]:block max-[499px]:basis-full" aria-hidden="true" /> */}

                        {/* Monish cluster (kept together) */}
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <a href="https://github.com/Tonedcandy/" target="_blank" rel="noopener noreferrer"
                                className="no-underline hover:text-blue-400 hover:no-underline" title="Monish S. S. portfolio">
                                Monish S. S.
                            </a>
                            <a href="https://linkedin.com/in/ssmonish" target="_blank" rel="noopener noreferrer"
                                aria-label="Monish S. S. on LinkedIn" title="Monish S. S. on LinkedIn"
                                className="inline-flex items-center shrink-0">
                                <AiFillLinkedin className="h-4 w-4 text-gray-400 hover:text-white transition-colors duration-200" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </span>

                        {/* optional second break ONLY below 500px (keeps to max 2 lines) */}
                        {/* <span className="hidden max-[499px]:block max-[499px]:basis-full" aria-hidden="true" /> */}

                        {/* Lauren cluster (kept together) */}
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <span>and</span>
                            <a href="https://www.laurenrbeck.com/" target="_blank" rel="noopener noreferrer"
                                className="no-underline hover:text-blue-400 hover:no-underline" title="Dr. Lauren R. Beck portfolio">
                                Dr. Lauren R. Beck
                            </a>
                            <a href="https://www.linkedin.com/in/laurenrbeck/" target="_blank" rel="noopener noreferrer"
                                aria-label="Dr. Lauren R. Beck on LinkedIn" title="Dr. Lauren R. Beck on LinkedIn"
                                className="inline-flex items-center shrink-0">
                                <AiFillLinkedin className="h-4 w-4 text-gray-400 hover:text-white transition-colors duration-200" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </span>
                    </div>

                    {/* Project GitHub (far right of the right column) */}
                    <a
                        href="https://github.com/Tonedcandy/sceneassist-web"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Project GitHub repository"
                        title="Project GitHub repository"
                        className="absolute right-5 min-[1400px]:top-1/2 min-[1400px]:-translate-y-1/2 top-0 inline-flex items-center align-middle shrink-0 z-10"
                    >
                        <AiFillGithub className="h-5 w-5 text-gray-500 hover:text-white transition-colors duration-200" />
                        <span className="sr-only">GitHub</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
