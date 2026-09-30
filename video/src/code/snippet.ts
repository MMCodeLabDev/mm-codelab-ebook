/**
 * The bug at the heart of the video — real, compilable C# (top-level statements, .NET 6+).
 *
 *   online / total * 100   →   3 / 4 * 100   →   0 * 100   →   0
 *
 * `online` and `total` are both `int`, so `/` performs INTEGER division and
 * truncates 0.75 to 0 before the value is ever stored in the `double`.
 * Casting one operand — `(double)online / total * 100` — gives 75.
 *
 * Buggy output:  Power: 0%
 * Fixed output:  Power: 75%
 */
export const BUG_LINE_INDEX = 5;

export const SNIPPET_LINES = [
  "// Core power: 3 of 4 cores online",
  "int online = 3;",
  "int total  = 4;",
  "",
  "double power =",
  "    online / total * 100;",
  "",
  'Console.WriteLine($"Power: {power}%");',
] as const;

/** Text inserted by the cursor in the fix scene, and where (column) it goes. */
export const FIX_INSERT = "(double)";
export const FIX_COLUMN = 4;

export const OUTPUT = {
  buggy: "Power: 0%",
  expected: "Expected: 75%",
  fixed: "Power: 75%",
} as const;

/** One-line explanation shown as an on-screen hint (story works without sound). */
export const HINT = {
  title: "int ÷ int = int",
  detail: "3 / 4 == 0",
} as const;

/** Background code fragments for the holographic fly-through. All valid C#. */
export const FRAGMENTS: readonly string[][] = [
  ["var cores = new List<int>();", "foreach (var c in cores)", "    Boot(c);"],
  ["if (shield.Level <= 0)", "    throw new Exception();"],
  ["static double Avg(int a, int b)", "    => (a + b) / 2.0;"],
  ["for (int i = 0; i < n; i++)", "    grid[i] = Sync(i);"],
  ["string id = Guid.NewGuid()", "    .ToString();"],
  ["bool ok = await Task.Run(Check);", "return ok;"],
  ["decimal fuel = 42.5m;", "fuel -= burn * dt;"],
  ["public class Reactor", "{", "    public int Load { get; set; }", "}"],
  ["try { Engage(); }", "catch (Exception e)", "{ Log(e.Message); }"],
  ["DateTime t = DateTime.UtcNow;", "Console.WriteLine(t);"],
];
