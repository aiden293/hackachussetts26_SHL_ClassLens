"""
Splice the generated sampleCourses array into src/lib/data/courses.ts,
replacing the old array while keeping the type definitions above and the
taxonomy/search helpers below untouched.
"""

import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
TARGET = os.path.join(ROOT, "src", "lib", "data", "courses.ts")
GENERATED = os.path.join(HERE, "out", "sampleCourses.generated.ts")

MARKER_START = "export const sampleCourses: Course[] = ["
MARKER_AFTER = "/* College & department (major) taxonomy"


def main() -> None:
    src = open(TARGET, encoding="utf-8").read()

    start = src.index(MARKER_START)
    after = src.index(MARKER_AFTER)
    # Back up to the start of the comment block line before the taxonomy marker.
    tail_start = src.rindex("/* ---", 0, after)

    header = src[:start]

    gen = open(GENERATED, encoding="utf-8").read()
    # Drop the generated file's leading comment lines; keep from the export.
    gen_array = gen[gen.index(MARKER_START):].rstrip() + "\n\n"

    tail = src[tail_start:]

    new_src = header + gen_array + tail
    open(TARGET, "w", encoding="utf-8").write(new_src)
    print(f"Updated {TARGET}")
    print(f"  header: {len(header)} chars, array: {len(gen_array)} chars, tail: {len(tail)} chars")


if __name__ == "__main__":
    main()
