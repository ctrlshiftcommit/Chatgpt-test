#!/usr/bin/env python3
import argparse
from pathlib import Path

from hpl import run


def main():
    parser = argparse.ArgumentParser(description="Run a Human Programming Language program.")
    parser.add_argument("file", help="Path to a .hpl file")
    args = parser.parse_args()

    source = Path(args.file).read_text(encoding="utf-8")
    run(source)


if __name__ == "__main__":
    main()
