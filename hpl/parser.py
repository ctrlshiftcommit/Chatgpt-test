from .ast import Program, CreateVariable, SetVariable, Show, If, Literal, Variable


class Parser:
    """Parse HPL's compact, predictable core syntax.

    HPL deliberately uses keywords rather than full English sentences.
    """

    def __init__(self, source: str):
        self.lines = [line.strip() for line in source.splitlines() if line.strip() and not line.strip().startswith("#")]

    def parse(self) -> Program:
        statements, index = self._parse_block(0)
        if index != len(self.lines):
            raise SyntaxError(f"Unexpected statement: {self.lines[index]}")
        return Program(statements)

    def _parse_block(self, index: int, stop_on_else: bool = False):
        statements = []
        while index < len(self.lines):
            line = self.lines[index].rstrip(".,;")
            low = line.lower()

            if low in ("else", "otherwise"):
                if stop_on_else:
                    return statements, index
                raise SyntaxError(f"{line} without a matching if")

            if low.startswith("variable "):
                name = line[9:].strip()
                if not name:
                    raise SyntaxError(f"Line {index + 1}: variable needs a name")
                statements.append(CreateVariable(name))
                index += 1
                continue

            if low.startswith("create a variable called "):
                name = line[len("Create a variable called "):].strip()
                if not name:
                    raise SyntaxError(f"Line {index + 1}: variable needs a name")
                statements.append(CreateVariable(name))
                index += 1
                continue

            if "=" in line and not low.startswith("if "):
                name, raw = line.split("=", 1)
                name = name.strip()
                raw = raw.strip()
                if not name:
                    raise SyntaxError(f"Line {index + 1}: assignment needs a variable name")
                statements.append(SetVariable(name, self._value(raw)))
                index += 1
                continue

            if low.startswith("set ") and " to " in low:
                split_at = low.index(" to ", 4)
                name = line[4:split_at].strip()
                raw = line[split_at + 4:].strip()
                statements.append(SetVariable(name, self._value(raw)))
                index += 1
                continue

            if low.startswith("show "):
                statements.append(Show(self._value(line[5:].strip())))
                index += 1
                continue

            if low.startswith("if ") and (low.endswith(":") or low.endswith(" then")):
                condition = line[3:-1].strip() if low.endswith(":") else line[3:-5].strip()
                left, operator, right = self._condition(condition)
                then_branch, index = self._parse_block(index + 1, True)
                else_branch = []
                if index < len(self.lines) and self.lines[index].lower().rstrip(".,;") in ("else", "otherwise"):
                    else_branch, index = self._parse_block(index + 1, False)
                statements.append(If(left, operator, right, then_branch, else_branch))
                continue

            raise SyntaxError(f"Line {index + 1}: I don't understand: {line}")

        return statements, index

    def _condition(self, text: str):
        for operator in ("==", "!="):
            if operator in text:
                pos = text.index(operator)
                left = text[:pos].strip()
                right = text[pos + len(operator):].strip()
                return self._value(left), operator, self._value(right)

        for operator in (" is not ", " is "):
            if operator in text.lower():
                pos = text.lower().index(operator)
                left = text[:pos].strip()
                right = text[pos + len(operator):].strip()
                return self._value(left), operator.strip(), self._value(right)

        raise SyntaxError(f"Condition needs '==' or '!=': {text}")

    def _value(self, raw: str):
        if len(raw) >= 2 and raw[0] == '"' and raw[-1] == '"':
            return Literal(bytes(raw[1:-1], "utf-8").decode("unicode_escape"))
        if raw.replace(".", "", 1).isdigit():
            return Literal(float(raw) if "." in raw else int(raw))
        return Variable(raw)
