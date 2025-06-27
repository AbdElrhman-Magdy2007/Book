import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power4.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animationDone = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || animationDone.current) return;

    const useAbsolute = splitType === "lines";
    if (useAbsolute) el.style.position = "relative";

    const splitter = new GSAPSplitText(el, {
      type: splitType,
      absolute: useAbsolute,
      linesClass: "split-line",
    });

    const targets: Element[] =
      splitType === "lines"
        ? splitter.lines
        : splitType === "words"
        ? splitter.words
        : splitType === "words, chars"
        ? [...splitter.words, ...splitter.chars]
        : splitter.chars;

    // Apply temporary will-change for performance
    targets.forEach((t) => {
      (t as HTMLElement).style.willChange = "transform, opacity";
    });

    const startPct = (1 - threshold) * 100;
    const rootOffset = parseInt(rootMargin || "0", 10);
    const scrollStart = `top ${startPct}%${rootOffset < 0 ? `-=${Math.abs(rootOffset)}px` : `+=${rootOffset}px`}`;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: scrollStart,
        once: true,
      },
      onComplete: () => {
        animationDone.current = true;
        gsap.set(targets, { ...to, clearProps: "willChange" });
        onLetterAnimationComplete?.();
      },
    });

    tl.set(targets, { ...from, immediateRender: false, force3D: true });
    tl.to(targets, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      force3D: true,
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.killTweensOf(targets);
      splitter.revert();
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  return (
    <p
      ref={ref}
      className={`split-text ${className}`}
      style={{
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
    >
      {text}
    </p>
  );
};

export default SplitText;
