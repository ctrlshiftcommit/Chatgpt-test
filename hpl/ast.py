from dataclasses import dataclass
from typing import Any


class Node:
    pass


@dataclass
class Program(Node):
    statements: list[Node]


@dataclass
class CreateVariable(Node):
    name: str


@dataclass
class SetVariable(Node):
    name: str
    value: Any


@dataclass
class Show(Node):
    value: Any


@dataclass
class If(Node):
    left: Any
    operator: str
    right: Any
    then_branch: list[Node]
    else_branch: list[Node]


@dataclass
class Literal(Node):
    value: Any


@dataclass
class Variable(Node):
    name: str
