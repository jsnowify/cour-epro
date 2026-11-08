import type { ReactNode } from "react";

/**
 * The design system's sci-fi arrow as inline SVG that takes the colour of the surrounding text (currentColor),
 * used in text links instead of the font's "→" / "↑" characters. `dir="up"` rotates it for "back to top".
 */
export function Arrow({ dir = "right" }: { dir?: "right" | "up" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 22 22"
      fill="currentColor"
      className={`ml-[0.45em] inline-block h-[1.35em] w-[1.35em] align-[-0.38em] transition-transform duration-300 ${dir === "up" ? "-rotate-90" : "[a:hover_&]:translate-x-1"}`}
    >
      <path d="M4.58333 9.16667H11.9167V5.04167H13.75L20.1667 11L13.75 16.9583H11.9167V12.8333H4.58333V9.16667Z" />
      <path d="M3.20833 9.16667H0.916667V12.8333H3.20833V9.16667Z" />
      <path d="M9.16667 5.5H4.58333V6.875H9.16667V5.5Z" fillOpacity="0.55" />
      <path d="M9.16667 15.125H4.58333V16.5H9.16667V15.125Z" fillOpacity="0.55" />
    </svg>
  );
}

/** Renders a label that ends in " →" with the sci-fi arrow instead of the character. */
export function ArrowText({ text }: { text: string }): ReactNode {
  return text.endsWith(" →") ? (
    <>
      {text.slice(0, -2)}
      <Arrow />
    </>
  ) : (
    text
  );
}
