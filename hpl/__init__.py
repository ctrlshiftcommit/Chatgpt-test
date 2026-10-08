from .parser import Parser
from .interpreter import Interpreter


def run(source: str, output=print):
    program = Parser(source).parse()
    Interpreter(output=output).run(program)
