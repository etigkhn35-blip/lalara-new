import type { CSSProperties } from "react";

export type CmsLocale = "en" | "tr";
export type CmsFontFamily = "display" | "sans";
export type CmsTextRole = "eyebrow" | "heading" | "text" | "button";

export type CmsRecord = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  buttonLabel?: string;
  buttonLink?: string;

  eyebrowSize?: number;
  headingSize?: number;
  textSize?: number;
  buttonSize?: number;

  eyebrowFontFamily?: CmsFontFamily;
  headingFontFamily?: CmsFontFamily;
  textFontFamily?: CmsFontFamily;
  buttonFontFamily?: CmsFontFamily;

  eyebrowFontWeight?: number;
  headingFontWeight?: number;
  textFontWeight?: number;
  buttonFontWeight?: number;

  eyebrowLineHeight?: number;
  headingLineHeight?: number;
  textLineHeight?: number;
  buttonLineHeight?: number;

  eyebrowLetterSpacing?: number;
  headingLetterSpacing?: number;
  textLetterSpacing?: number;
  buttonLetterSpacing?: number;

  // Legacy fields. Keep these until old Firestore records are retired.
  fontFamily?: CmsFontFamily;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;

  visible?: boolean;
  status?: string;
  page?: string;
  section?: string;
};

export type CmsMap = Record<string, CmsRecord>;

const DISPLAY_STACK = '"Iowan Old Style", Baskerville, "Times New Roman", serif';
const SANS_STACK = '"Helvetica Neue", Helvetica, Arial, sans-serif';

export function cmsRecordStyle(item: CmsRecord | undefined, role: CmsTextRole): CSSProperties | undefined {
  if (!item) return undefined;

  const size =
    role === "eyebrow" ? item.eyebrowSize :
    role === "heading" ? item.headingSize :
    role === "button" ? item.buttonSize : item.textSize;

  const family =
    role === "eyebrow" ? item.eyebrowFontFamily ?? item.fontFamily :
    role === "heading" ? item.headingFontFamily ?? item.fontFamily :
    role === "button" ? item.buttonFontFamily ?? item.fontFamily :
    item.textFontFamily ?? item.fontFamily;

  const weight =
    role === "eyebrow" ? item.eyebrowFontWeight ?? item.fontWeight :
    role === "heading" ? item.headingFontWeight ?? item.fontWeight :
    role === "button" ? item.buttonFontWeight ?? item.fontWeight :
    item.textFontWeight ?? item.fontWeight;

  const lineHeight =
    role === "eyebrow" ? item.eyebrowLineHeight ?? item.lineHeight :
    role === "heading" ? item.headingLineHeight ?? item.lineHeight :
    role === "button" ? item.buttonLineHeight ?? item.lineHeight :
    item.textLineHeight ?? item.lineHeight;

  const letterSpacing =
    role === "eyebrow" ? item.eyebrowLetterSpacing ?? item.letterSpacing :
    role === "heading" ? item.headingLetterSpacing ?? item.letterSpacing :
    role === "button" ? item.buttonLetterSpacing ?? item.letterSpacing :
    item.textLetterSpacing ?? item.letterSpacing;

  return {
    ...(size !== undefined ? { fontSize: `${size}px` } : {}),
    ...(family ? { fontFamily: family === "sans" ? SANS_STACK : DISPLAY_STACK } : {}),
    ...(weight !== undefined ? { fontWeight: weight, fontSynthesis: "none" } : {}),
    ...(lineHeight !== undefined ? { lineHeight } : {}),
    ...(letterSpacing !== undefined ? { letterSpacing: `${letterSpacing}px` } : {}),
  };
}
