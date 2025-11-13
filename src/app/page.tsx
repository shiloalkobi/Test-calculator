"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DeleteIcon, DivideIcon, MinusIcon, PercentIcon, PlusIcon, XIcon } from "lucide-react";

const buttons = [
  ["C", "%", "⌫", "/"],
  ["7", "8", "9", "*"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "=",],
];

function formatExpression(expr: string): string {
  return expr
    .replace(/\//g, " ÷ ")
    .replace(/\*/g, " × ")
    .replace(/\+/g, " + ")
    .replace(/-/g, " − ");
}

function safeEval(expr: string): string {
  try {
    // Replace % with /100 for percentage calculations
    const sanitized = expr.replace(/(\d+(?:\.\d+)?)%/g, (_, n) => String(Number(n) / 100));
    // eslint-disable-next-line no-eval
    const result = eval(sanitized);
    if (typeof result === "number" && isFinite(result)) {
      return result.toString();
    }
    return "Error";
  } catch {
    return "Error";
  }
}

export function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState(false);

  const handleButtonClick = (val: string) => {
    if (val === "C") {
      setExpression("");
      setResult("");
      setError(false);
      return;
    }
    if (val === "⌫") {
      setExpression((prev) => prev.slice(0, -1));
      setError(false);
      return;
    }
    if (val === "=") {
      const evalResult = safeEval(expression);
      setResult(evalResult);
      setError(evalResult === "Error");
      return;
    }
    if (val === "%") {
      // Only add % if last char is a digit
      if (expression && /\d$/.test(expression)) {
        setExpression((prev) => prev + "%");
      }
      return;
    }
    // Prevent multiple operators in a row
    if (["/", "*", "+", "-"].includes(val)) {
      if (!expression || /[\/*+\-%]$/.test(expression)) return;
    }
    setExpression((prev) => prev + val);
    setError(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200/60 via-white/60 to-purple-200/60">
      <Card
        className={cn(
          "w-[340px] p-6 rounded-2xl shadow-xl backdrop-blur-xl border border-white/30",
          "bg-white/30",
          "relative overflow-hidden"
        )}
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", border: "1px solid rgba(255,255,255,0.18)" }}
      >
        {/* Glassy shine overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 via-transparent to-white/10 opacity-60" />
        <div className="relative z-10">
          <div className="mb-4">
            <Input
              className={cn(
                "text-right text-2xl font-mono bg-white/40 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
                error && "text-red-500 animate-shake"
              )}
              value={formatExpression(expression)}
              readOnly
              aria-label="Calculator expression"
              tabIndex={-1}
            />
            <div className="text-right text-lg font-mono text-gray-700 min-h-[1.5em] mt-1">
              {result && !error && <span>= {result}</span>}
              {error && <span className="text-red-500">Error</span>}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {buttons.flat().map((btn, i) => (
              <Button
                key={btn + i}
                variant={
                  btn === "C"
                    ? "destructive"
                    : btn === "="
                    ? "default"
                    : btn === "⌫"
                    ? "secondary"
                    : ["/", "*", "+", "-", "%"].includes(btn)
                    ? "outline"
                    : "ghost"
                }
                className={cn(
                  "h-14 text-xl font-semibold rounded-xl backdrop-blur-md bg-white/40 border border-white/30 hover:bg-white/60 transition",
                  btn === "0" && "col-span-2",
                  btn === "=" && "col-span-2 bg-blue-500 text-white hover:bg-blue-600"
                )}
                onClick={() => handleButtonClick(btn)}
                aria-label={btn === "⌫" ? "Backspace" : btn}
              >
                {btn === "/" ? <DivideIcon className="w-5 h-5" /> :
                 btn === "*" ? <XIcon className="w-5 h-5" /> :
                 btn === "+" ? <PlusIcon className="w-5 h-5" /> :
                 btn === "-" ? <MinusIcon className="w-5 h-5" /> :
                 btn === "%" ? <PercentIcon className="w-5 h-5" /> :
                 btn === "⌫" ? <DeleteIcon className="w-5 h-5" /> :
                 btn}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function Page() {
  return <Calculator />;
}
