"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <Button
      aria-label={dark ? "切换到浅色" : "切换到深色"}
      onClick={() => {
        document.documentElement.classList.toggle("dark", !dark);
      }}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
