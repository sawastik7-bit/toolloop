type Level = "INFO" | "WARN" | "ERROR" | "TRACE" | "METRIC";
type Context = Record<string, unknown>;

const PAD: Record<Level, string> = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  TRACE: "TRACE",
  METRIC: "METRIC",
};

/** Formats a log message with a timestamp, log level, message, and optional context. */
function fmt(level: Level, message: string, context?: Context): string {
  const timestamp = new Date().toISOString();
  const contextStr =
    context && Object.keys(context).length > 0 ? ` ${JSON.stringify(context)}` : "";
  return `${timestamp} [${PAD[level]}] ${message}${contextStr}`;
}

/** Checks if the provided error object is an internal Next.js error by looking for a specific digest property. */
function isNextInternalThrow(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as Record<string, unknown>).digest === "string" &&
    ((error as Record<string, unknown>).digest as string).startsWith("NEXT_")
  );
}

/** Logs an informational message to the console with an optional context. */
function info(message: string, context?: Context): void {
  console.log(fmt("INFO", message, context));
}

/** Logs a warning - use for expected-but-notable failures (domain denials, validation). */
function warn(message: string, context?: Context): void {
  console.warn(fmt("WARN", message, context));
}

/** Logs an error - use for unexpected failures outside normal business logic. */
function error(message: string, context?: Context): void {
  console.error(fmt("ERROR", message, context));
}

/** Logs a trace message - use for debugging and tracing execution flow. */
function trace(message: string, context?: Context): void {
  console.trace(fmt("TRACE", message, context));
}

/** Times fn and logs its duration. Re-throes on real errors, treats Next.js redirect/not-found as success. */
async function metric<T>(name: string, fn: () => T | Promise<T>, context?: Context): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    console.log(fmt("METRIC", `${name} completed in ${duration}ms`, context));
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    if (isNextInternalThrow(error)) {
      console.log(
        fmt("METRIC", `${name} completed in ${duration}ms (Next.js internal throw)`, context),
      );
      throw error; // Re-throw to allow Next.js to handle it
    }
    const msg = error instanceof Error ? error.message : String(error);
    console.error(fmt("ERROR", `${name} failed after ${duration}ms - ${msg}`, context));
    throw error; // Re-throw to allow upstream handling
  }
}

export const logger = { info, warn, error, trace, metric };
