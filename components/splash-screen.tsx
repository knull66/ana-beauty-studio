"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Wordmark } from "@/components/wordmark";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const { dictionary } = useLanguage();

  return (
    <>
      {done ? null : (
        <div
          className="splash-overlay pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-background"
          aria-hidden="true"
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) {
              setDone(true);
            }
          }}
        >
          <div className="flex flex-col items-center">
            <p className="splash-kicker mb-8 text-[10px] uppercase tracking-[0.5em] text-muted">
              {dictionary.splash.kicker}
            </p>
            <div className="splash-mark">
              <Wordmark />
            </div>
            <span className="splash-rule mt-8 h-px w-24 origin-center bg-gold" />
          </div>
        </div>
      )}
      {children}
    </>
  );
}
