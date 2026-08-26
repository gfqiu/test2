#!/usr/bin/env python3
"""Smoke checks for the static school site."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
required = [
    ROOT / "index.html",
    ROOT / "css" / "styles.css",
    ROOT / "js" / "main.js",
    ROOT / "assets" / "hero-campus.jpg",
    ROOT / "assets" / "library.jpg",
    ROOT / "assets" / "study.jpg",
    ROOT / "assets" / "campus-alt.jpg",
]

errors = []
for path in required:
    if not path.exists():
        errors.append(f"missing: {path.relative_to(ROOT)}")
    elif path.stat().st_size < 32:
        errors.append(f"too small: {path.relative_to(ROOT)}")

html = (ROOT / "index.html").read_text(encoding="utf-8")
for needle in ["./css/styles.css", "./js/main.js", "./assets/hero-campus.jpg", "青麓中学"]:
    if needle not in html:
        errors.append(f"index.html missing reference: {needle}")

css = (ROOT / "css" / "styles.css").read_text(encoding="utf-8")
if ":root" not in css or ".hero" not in css:
    errors.append("styles.css incomplete")

js = (ROOT / "js" / "main.js").read_text(encoding="utf-8")
if "IntersectionObserver" not in js or "visit-form" not in js:
    errors.append("main.js incomplete")

if errors:
    print("FAIL")
    for e in errors:
        print("-", e)
    sys.exit(1)

print("PASS: static school site structure OK")
