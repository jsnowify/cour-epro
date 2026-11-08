import { memo } from "react";
import { highlight } from "@/lib/code";

/**
 * One line of the editor. Static markup: the "current line" look is a data-cur attribute styled in globals.css,
 * so the rail can move it from line to line without React rendering anything.
 */
function CodeLine({ no, text, cur, gutter, cursor }: { no: number; text: string; cur?: boolean; gutter: string; cursor: string }) {
  return (
    <div className="code-line" data-cur={cur ? "" : undefined}>
      <span className={`code-no ${gutter} shrink-0 text-right`}>{no + 1}</span>
      <span className="code-text overflow-hidden text-white/80">
        {highlight(text)}
        {text === "" && " "}
      </span>
      <span aria-hidden className={`code-cur bg-crimson ${cursor}`} />
    </div>
  );
}

export default memo(CodeLine);
