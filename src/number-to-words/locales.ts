import { NumberToWordsDefinition, NumberToWordsLocale } from "./types";

const enOnes = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
];
const enTeens = [
  "ten", "eleven", "twelve", "thirteen", "fourteen",
  "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const enTens = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
];

function convertGroupEn(n: number): string {
  const hundredsDigit = Math.floor(n / 100);
  const remainder = n % 100;
  const parts: string[] = [];

  if (hundredsDigit > 0) {
    parts.push(`${enOnes[hundredsDigit]} hundred`);
  }

  if (remainder > 0) {
    if (remainder < 10) {
      parts.push(enOnes[remainder]!);
    } else if (remainder < 20) {
      parts.push(enTeens[remainder - 10]!);
    } else {
      const tensDigit = Math.floor(remainder / 10);
      const unitDigit = remainder % 10;
      parts.push(unitDigit === 0 ? enTens[tensDigit]! : `${enTens[tensDigit]}-${enOnes[unitDigit]}`);
    }
  }

  return parts.join(" ");
}

const viOnes = [
  "không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín",
];

function convertGroupVi(n: number, isLeadingGroup: boolean): string {
  const hundredsDigit = Math.floor(n / 100);
  const remainder = n % 100;
  const tensDigit = Math.floor(remainder / 10);
  const unitDigit = remainder % 10;
  const parts: string[] = [];

  if (hundredsDigit > 0) {
    parts.push(`${viOnes[hundredsDigit]} trăm`);
  } else if (!isLeadingGroup) {
    // A zero hundreds digit is still read out ("không trăm") in every group
    // except the leading one, e.g. 1005 -> "một nghìn không trăm linh năm".
    parts.push("không trăm");
  }

  if (remainder === 0) {
    // Nothing more to add; a fully-zero group is filtered out by the caller.
  } else if (tensDigit === 0) {
    // "linh" (roughly "and") introduces a lone unit digit whenever a tens
    // (or hundreds) part was already read, e.g. "trăm linh năm" (105) or
    // "không trăm linh năm" (...005); a bare leading unit needs no "linh".
    parts.push(hundredsDigit > 0 || !isLeadingGroup ? `linh ${viOnes[unitDigit]}` : viOnes[unitDigit]!);
  } else if (tensDigit === 1) {
    // 10-19: "mười" [+ unit], with the "năm" -> "lăm" exception for 15.
    parts.push(unitDigit === 0 ? "mười" : unitDigit === 5 ? "mười lăm" : `mười ${viOnes[unitDigit]}`);
  } else {
    // 20-99: "{tensDigit} mươi" [+ unit], with "một" -> "mốt" and "năm" -> "lăm".
    const tensWord = `${viOnes[tensDigit]} mươi`;
    if (unitDigit === 0) {
      parts.push(tensWord);
    } else if (unitDigit === 1) {
      parts.push(`${tensWord} mốt`);
    } else if (unitDigit === 5) {
      parts.push(`${tensWord} lăm`);
    } else {
      parts.push(`${tensWord} ${viOnes[unitDigit]}`);
    }
  }

  return parts.join(" ");
}

/**
 * Registry of per-language spelling rules. Add a new language by adding a
 * key here (and, if its word lists warrant it, a dedicated block above) —
 * no other file needs to change.
 */
export const definitions: Record<NumberToWordsLocale, NumberToWordsDefinition> = {
  en: {
    zero: "zero",
    negativePrefix: "negative ",
    decimalSeparator: "point",
    digits: enOnes,
    scaleWords: ["", "thousand", "million", "billion", "trillion", "quadrillion"],
    convertGroup: convertGroupEn,
  },
  vi: {
    zero: "không",
    negativePrefix: "âm ",
    decimalSeparator: "phẩy",
    digits: viOnes,
    scaleWords: ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"],
    convertGroup: convertGroupVi,
  },
};
