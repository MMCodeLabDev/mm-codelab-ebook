export type TokenKind =
  | "keyword"
  | "type"
  | "number"
  | "string"
  | "ident"
  | "punct"
  | "method"
  | "comment"
  | "space";

export type Token = { text: string; kind: TokenKind };

const KEYWORDS = new Set([
  "if", "else", "for", "foreach", "while", "return", "new", "var", "public",
  "private", "static", "void", "class", "using", "namespace", "in", "true",
  "false", "null", "await", "async", "try", "catch", "throw",
]);
const TYPES = new Set([
  "int", "double", "string", "bool", "float", "decimal", "Console", "List",
  "Math", "Task", "Exception", "DateTime", "Guid",
]);

const PATTERN =
  /(\/\/.*$)|(\$?"(?:[^"\\]|\\.)*")|(\d+(?:\.\d+)?[mMfFdD]?)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z_\d])/g;

/** Minimal C# tokenizer — enough for cinematic syntax highlighting. `extraTypes` adds project-specific type names. */
export const tokenize = (line: string, extraTypes?: ReadonlySet<string>): Token[] => {
  const tokens: Token[] = [];
  for (const m of line.matchAll(PATTERN)) {
    const [text, comment, str, num, word, space] = m;
    if (comment) tokens.push({ text, kind: "comment" });
    else if (str) tokens.push({ text, kind: "string" });
    else if (num) tokens.push({ text, kind: "number" });
    else if (space) tokens.push({ text, kind: "space" });
    else if (word) {
      const rest = line.slice((m.index ?? 0) + text.length);
      if (KEYWORDS.has(word)) tokens.push({ text, kind: "keyword" });
      else if (TYPES.has(word) || extraTypes?.has(word)) tokens.push({ text, kind: "type" });
      else if (rest.startsWith("(")) tokens.push({ text, kind: "method" });
      else tokens.push({ text, kind: "ident" });
    } else tokens.push({ text, kind: "punct" });
  }
  return tokens;
};
