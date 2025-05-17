import { hrtime } from "process";
import chalk from "./utils/chalk";

type Timer = {
  id: string;
  label: string;
  namespace: string;
  startTime: bigint;
};

export class Instrumentation {
  private hitCounts = new Map<string, number>();
  private timers = new Map<string, bigint>();
  private timerStack: Timer[] = [];

  constructor(
    private flush: (message: string) => void = (msg) =>
      process.stderr.write(`${msg}\n`),
  ) {}

  hit(label: string) {
    this.hitCounts.set(label, (this.hitCounts.get(label) || 0) + 1);
  }

  start(label: string) {
    const namespace = this.timerStack.map((t) => t.label).join("//");
    const id = `${namespace ? namespace + "//" : ""}${label}`;

    this.hit(id);

    this.timerStack.push({ id, label, namespace, startTime: hrtime.bigint() });

    // Ensure timer exists
    if (!this.timers.has(id)) {
      this.timers.set(id, 0n);
    }
  }

  end(label: string) {
    const current = this.timerStack.pop();
    if (!current || current.label !== label) {
      throw new Error(
        `Mismatched timer end: tried to end "${label}" but top of stack is "${current?.label}"`,
      );
    }

    const elapsed = hrtime.bigint() - current.startTime;
    this.timers.set(current.id, (this.timers.get(current.id) || 0n) + elapsed);
  }

  reset() {
    this.hitCounts.clear();
    this.timers.clear();
    this.timerStack.length = 0;
  }

  report() {
    // Auto-close any open timers
    while (this.timerStack.length > 0) {
      this.end(this.timerStack[this.timerStack.length - 1].label);
    }

    const output: string[] = [];

    // Report timers
    if (this.timers.size > 0) {
      let maxLength = 0;
      const computedTimes = new Map<string, string>();

      for (const [label, time] of this.timers) {
        const ms = `${(Number(time) / 1e6).toFixed(2)}ms`;
        computedTimes.set(label, ms);
        maxLength = Math.max(maxLength, ms.length);
      }

      for (const [label, time] of this.timers) {
        const ms = computedTimes.get(label)!;
        const hits = this.hitCounts.get(label) || 1;
        const lastPart = label.split("//").pop();

        output.push(
          `${chalk("success", `[${ms.padStart(maxLength)}]`)}${this.indent(label, true)}${lastPart} ${
            hits > 1 ? chalk("info", `× ${hits}`) : ""
          }`.trimEnd(),
        );
      }
    }

    this.flush(`\n${output.join("\n")}\n`);
    this.reset();
  }

  private indent(label: string, arrow = false) {
    const depth = label.split("//").length - 1;
    return `${"  ".repeat(depth)}${depth > 0 && arrow ? " ↳ " : ""}`;
  }
}
