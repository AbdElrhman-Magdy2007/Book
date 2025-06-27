import { FC, CSSProperties } from "react";
import "./ScrollFloat.css";

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  className?: string;
  shadowColors?: { after: string; before: string };
  fontSize?: { mobile: string; default: string };
}

interface CustomCSSProperties extends CSSProperties {
  "--after-duration": string;
  "--before-duration": string;
  "--after-shadow": string;
  "--before-shadow": string;
  "--font-size-mobile": string;
  "--font-size-default": string;
}

const GlitchText: FC<GlitchTextProps> = ({
  children,
  speed = 0.6,
  enableShadows = true,
  className = "",
  shadowColors = { after: "#4f46e5", before: "#818cf8" },
  fontSize = {
    mobile: "1.5rem",
    default: "clamp(2.5rem, 5vw, 5rem)",
  },
}) => {
  const inlineStyles: CustomCSSProperties = {
    "--after-duration": `${speed * 2.5}s`,
    "--before-duration": `${speed * 1.8}s`,
    "--after-shadow": enableShadows ? `2px 0 ${shadowColors.after}` : "none",
    "--before-shadow": enableShadows ? `-2px 0 ${shadowColors.before}` : "none",
    "--font-size-mobile": fontSize.mobile,
    "--font-size-default": fontSize.default,
  };

  return (
    <h2
      className={`glitch-text-wrapper ${className}`}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </h2>
  );
};

export default GlitchText;
