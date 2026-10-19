import katex from "katex";
import { describe, expect, it } from "vitest";

import { katexStrict } from "./latex";

const options = {
  displayMode: true,
  throwOnError: true,
  output: "html",
  trust: false,
  strict: katexStrict,
} as const;

describe("KaTeX options (match renderLatex)", () => {
  it("renders simple math with trust disabled and strict error mode", () => {
    const html = katex.renderToString("x^2 + y^2 = r^2", options);
    expect(html).toMatch(/katex/i);
    expect(html).toContain("x");
  });

  it("throws on invalid TeX with throwOnError", () => {
    expect(() => katex.renderToString("\\nope{", options)).toThrow();
  });

  it("renders text with no font metrics instead of failing", () => {
    const html = katex.renderToString("\\text{日本語}", options);
    expect(html).toContain("日");
  });

  it("still rejects unicode text in math mode", () => {
    expect(() => katex.renderToString("日本語", options)).toThrow();
  });

  it("keeps every other strict check as an error", () => {
    expect(katexStrict("unicodeTextInMathMode")).toBe("error");
    expect(katexStrict("symbolNotInFont")).toBe("warn");
  });
});
