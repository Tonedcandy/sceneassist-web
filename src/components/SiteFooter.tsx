// src/components/Footer.tsx
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import logoPill from ".././assets/sceneassist-wordmark.png";
export default function Footer() {
    return (
        <footer className="w-full py-2 bg-black">
            <div className="max-w-10xl mx-auto flex flex-col md:flex-row items-center justify-end px-4 gap-2">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start gap-3">
                    <img src={logoPill} alt="SceneAssist" className="block h-auto w-[clamp(120px,20vw,180px)] max-h-8 shrink-0" />
                    <span className="text-xs text-[#FFD445]">Audio Description for Any Scene</span>
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
                <div className="flex-2 text-center text-xs text-gray-400 whitespace-nowrap">
                    <small>
                        &copy; {new Date().getFullYear()} SceneAssist, Inc. All rights reserved.
                        <br />
                        SceneAssist<sup>™</sup> is a trademark of SceneAssist, Inc. Other names may be trademarks of their owners.
                    </small>
                </div>

                {/* Socials (right) */}
                <div className="flex-1 flex justify-end space-x-6 items-center">
                    <a
                        href="https://github.com/Tonedcandy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <AiFillGithub className="h-5 w-5 text-gray-500 hover:text-white transition-colors duration-200" />
                    </a>
                    <a
                        href="https://linkedin.com/in/ssmonish"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                    >
                        <AiFillLinkedin className="h-5 w-5 text-gray-500 hover:text-white transition-colors duration-200" />
                    </a>
                </div>
            </div>
        </footer>
    );
}