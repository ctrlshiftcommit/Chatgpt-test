# Human Programming Language

A beginner-friendly programming language that reads like simple English.

## Goal

Write instructions instead of traditional programming syntax.

Example:

```text
Create a section called product.
Put a button called "Add to cart" inside product.
Color product #222222.
Center product.

If the customer clicks the "Add to cart" button,
show "Product added to cart".
```

## Grammar

### Variables

```text
Create a variable called customer name.
Set customer name to "Shivv".
```

### Conditions

```text
If customer enters "buy" in the message field,
show "Thanks for your order".
Otherwise,
show "What would you like to buy?"
```

### Interface

```text
Create a section called product card.
Put a text called product name inside product card.
Put a button called "Add to cart" inside product card.
```

### Styling

```text
Color product card #222222.
Color product name #ffffff.
Center product card.
Put product name left.
Put the button right.
```

## Architecture

Source code -> Lexer -> Tokens -> Parser -> AST -> Runtime

The language will use a strict, predictable grammar. It should feel like English without requiring the parser to guess what the programmer means.

## First milestone

Build a lexer, parser, AST, and interpreter capable of handling variables, conditions, events, simple UI elements, colors, and positioning.

## Status

Language design and grammar definition.
