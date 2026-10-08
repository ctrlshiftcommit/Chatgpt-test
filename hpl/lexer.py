from dataclasses import dataclass
import re


@dataclass
class Token:
    kind: str
    value: str
    line: int


_TOKEN_RE = re.compile(
    r'(?P<STRING>"(?:\\.|[^"\\])*")|'
    r'(?P<NUMBER>\\d+(?:\\.\\d+)?)|'
    r'(?P<WORD>[A-Za-z_][A-Za-z0-9_]*(?:[ -][A-Za-z0-9_]+)*)'
)


def lex(source: str) -> list[Token]:
    tokens: list[Token] = []
    for line_no, line in enumerate(source.splitlines(), 1):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue

        # Keep quoted strings intact; commands are parsed from the resulting words.
        pos = 0
        while pos < len(line):
            if line[pos].isspace() or line[pos] in ",.":
                pos += 1
                continue
            match = _TOKEN_RE.match(line, pos)
            if not match:
                raise SyntaxError(f"Line {line_no}: unexpected character {line[pos]!r}")
            kind = match.lastgroup
            value = match.group()
            tokens.append(Token(kind, value, line_no))
            pos = match.end()
    return tokens
