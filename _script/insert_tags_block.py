#!/usr/bin/env python3
import argparse
import pathlib
import re
from typing import Optional, Iterable

# Match ##/###/#### heading + "Example request(s)" (case-insensitive)
HEADING_RE = re.compile(
    r"^(?P<indent>\s{0,3})(?P<hashes>#{2,4})\s+Example requests?\b\s*$",
    re.IGNORECASE,
)

# Detect start of an existing spec-insert block
START_TAG_RE = re.compile(r"^\s*<!--\s*spec_insert_start", re.IGNORECASE)

# Start/end fenced code blocks (``` or ~~~), optionally with language
FENCE_RE = re.compile(r"^\s*(```|~~~)")

SPEC_BLOCK = """<!-- spec_insert_start
component: example_code
rest:
body: |

-->
<!-- spec_insert_end -->
"""

def find_insert_position(lines: list[str]) -> Optional[int]:
    """Return the index *after* the heading line where we should insert, or None."""
    in_fence = False
    for i, line in enumerate(lines):
        if FENCE_RE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        if HEADING_RE.match(line):
            return i + 1
    return None

def has_block_immediately_after(lines: list[str], pos: int) -> bool:
    """True if the next non-blank line at/after pos starts a spec-insert block."""
    j = pos
    while j < len(lines) and lines[j].strip() == "":
        j += 1
    return j < len(lines) and START_TAG_RE.match(lines[j]) is not None

def process_file(p: pathlib.Path, write: bool) -> bool:
    if not p.is_file() or p.suffix.lower() != ".md":
        return False
    text = p.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)

    insert_at = find_insert_position(lines)
    if insert_at is None:
        return False

    if has_block_immediately_after(lines, insert_at):
        return False

    needs_blank = not (insert_at < len(lines) and lines[insert_at].strip() == "")
    block = (("\n" if needs_blank else "") + SPEC_BLOCK)

    if write:
        lines.insert(insert_at, block)
        p.write_text("".join(lines), encoding="utf-8")
    return True

def iter_targets(paths: Iterable[pathlib.Path], recursive: bool) -> Iterable[pathlib.Path]:
    for path in paths:
        if path.is_file():
            yield path
        elif path.is_dir():
            if recursive:
                yield from path.rglob("*.md")
            else:
                yield from (p for p in path.glob("*.md") if p.is_file())

def main():
    ap = argparse.ArgumentParser(
        description="Insert a blank spec-insert block under Example request headings."
    )
    ap.add_argument(
        "paths", nargs="*", default=["_api-reference"],
        help="Files and/or directories to process (default: _api-reference)"
    )
    ap.add_argument(
        "--no-recursive", action="store_true",
        help="When a directory is given, only scan its top level (no recursion)."
    )
    ap.add_argument("--dry-run", action="store_true", help="Preview changes only.")
    args = ap.parse_args()

    base_paths = [pathlib.Path(p).resolve() for p in args.paths]
    recursive = not args.no_recursive
    write = not args.dry_run

    changed = []
    for target in iter_targets(base_paths, recursive=recursive):
        try:
            if process_file(target, write=write):
                changed.append(str(target))
        except UnicodeDecodeError:
            # Skip non-UTF8 files
            continue

    verb = "Would modify" if args.dry_run else "Modified"
    print(f"{verb} {len(changed)} file(s).")
    if changed:
        print("\n".join(changed))

if __name__ == "__main__":
    main()