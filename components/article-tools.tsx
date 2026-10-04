"use client";
import { useEffect, useRef, useState } from "react";
export function ArticleTools({ postPath }: { postPath: string }) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLPreElement>(".prose pre").forEach((pre, index) => {
      const bar = document.createElement("div"); bar.className = "code-toolbar";
      const label = document.createElement("span"); label.textContent = pre.dataset.language || "Code";
      const button = document.createElement("button"); button.type = "button"; button.textContent = "Copy code"; button.setAttribute("aria-label", `Copy code block ${index + 1}`);
      const copy = async () => {
        try {
          await navigator.clipboard.writeText(pre.querySelector("code")?.textContent || "");
          setMessage("Code copied to clipboard."); button.textContent = "Copied";
          const reset = setTimeout(() => { button.textContent = "Copy code"; }, 2000); cleanups.push(() => clearTimeout(reset));
        } catch { setMessage("Copy is unavailable. Select the code to copy it."); }
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setMessage(""), 3500);
      };
      button.addEventListener("click", copy); bar.append(label, button); pre.before(bar); pre.classList.add("has-toolbar");
      cleanups.push(() => { button.removeEventListener("click", copy); bar.remove(); pre.classList.remove("has-toolbar"); });
    });
    return () => { cleanups.forEach(fn => fn()); if (timer.current) clearTimeout(timer.current); };
  }, [postPath]);
  return <span className="sr-only" role="status">{message}</span>;
}
