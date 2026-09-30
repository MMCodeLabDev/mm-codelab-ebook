/**
 * The mysterious legacy file — real, compilable C# (.NET 6+, implicit usings supply
 * System.Threading; Database/Auth/Api are the project's own classes).
 *
 * Nobody knows why `Thread.Sleep(7);` is there. A developer deletes it. The build
 * still succeeds (it is valid code) — but production depended on that timing.
 * The punchline is itself a valid C# comment typed where the line used to be.
 */
export const FILE_NAME = "Production.cs";

export const LEGACY_LINES = [
  "public static class Production",
  "{",
  "    public static void Start()",
  "    {",
  "",
  "        // DO NOT DELETE",
  "        // Nobody knows why this works.",
  "        Thread.Sleep(7);",
  "",
  "        Database.Connect();",
  "        Auth.Initialize();",
  "        Api.Listen();",
  "    }",
  "}",
] as const;

export const INDENT = 8;

/** Blank line where the developer types their comment. */
export const COMMENT_LINE = 4;
export const DEV_COMMENT = "// Let's clean this up.";

/** Ominous comments. */
export const WARNING_LINES = [5, 6] as const;

/** The line nobody understands. */
export const SACRED_LINE = 7;
export const SACRED_TEXT = "Thread.Sleep(7);";

/** Typed by itself where the deleted line used to be. */
export const PUNCHLINE = "// I TOLD YOU.";

/** Identifiers highlighted as types in this file. */
export const EXTRA_TYPES: ReadonlySet<string> = new Set(["Production", "Thread", "Database", "Auth", "Api"]);

export const OUTAGE = ["DATABASE", "AUTHENTICATION", "API"] as const;
