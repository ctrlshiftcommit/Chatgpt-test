from .ast import Program, CreateVariable, SetVariable, Show, If, Literal, Variable


class Interpreter:
    def __init__(self, output=print):
        self.variables = {}
        self.output = output

    def run(self, program: Program):
        for statement in program.statements:
            self.execute(statement)

    def execute(self, node):
        if isinstance(node, CreateVariable):
            if node.name in self.variables:
                raise RuntimeError(f"Variable already exists: {node.name}")
            self.variables[node.name] = None
        elif isinstance(node, SetVariable):
            if node.name not in self.variables:
                raise RuntimeError(f"Unknown variable: {node.name}")
            self.variables[node.name] = self.evaluate(node.value)
        elif isinstance(node, Show):
            self.output(self.evaluate(node.value))
        elif isinstance(node, If):
            matches = self.evaluate(node.left) == self.evaluate(node.right)
            if node.operator == "is not":
                matches = not matches
            branch = node.then_branch if matches else node.else_branch
            for statement in branch:
                self.execute(statement)
        else:
            raise RuntimeError(f"Unknown AST node: {type(node).__name__}")

    def evaluate(self, node):
        if isinstance(node, Literal):
            return node.value
        if isinstance(node, Variable):
            if node.name not in self.variables:
                raise RuntimeError(f"Unknown variable: {node.name}")
            return self.variables[node.name]
        return node
