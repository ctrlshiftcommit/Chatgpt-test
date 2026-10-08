# HPL Language Reference

HPL (Human Programming Language) uses short, predictable keywords instead of full English sentences. The goal is code that is easy for a beginner to read and easy for the compiler to parse deterministically.

## Core syntax

### Variables

Create a variable with the full keyword `VARIABLE`:

```hpl
VARIABLE name
name = "Shivv"

SHOW name
```

Numbers work too:

```hpl
VARIABLE age
age = 16
SHOW age
```

### Output

Use `SHOW`:

```hpl
SHOW "Hello, world!"
SHOW name
```

### Conditions

HPL supports compact comparisons:

```hpl
IF age == 16
    SHOW "You are 16"
ELSE
    SHOW "A different age"
```

`!=` means not equal.

For readability, the older `is` and `is not` comparison forms are also accepted while the language is evolving.

## UI syntax

UI is part of HPL's language design. The intended syntax is deliberately declarative:

```hpl
INPUT name "Enter your name"
BUTTON submit "Submit"

IF submit clicked
    SHOW name
```

The UI keywords describe what the programmer wants; a web backend can later translate them into HTML, CSS, and JavaScript.

Planned UI keywords include:

- `INPUT` — input field
- `BUTTON` — clickable button
- `TEXT` — text element
- `IMAGE` — image element
- `SECTION` — container/section

## Styling

The planned styling syntax keeps visual concepts readable:

```hpl
COLOR product #222222
CENTER product
LEFT productName
RIGHT submit
```

## Design rule

HPL is **controlled English**, not free-form English. A line should be understandable to a human without requiring the compiler to guess intent.

New language features should therefore follow this pattern:

1. Choose a clear keyword.
2. Define one deterministic grammar.
3. Add an example to this document.
4. Add a parser/runtime test.
5. Only then expose the feature in the editor.

## Implementation status

Implemented now:

- `VARIABLE`
- assignment with `=`
- `SHOW`
- `IF` / `ELSE`
- `==` / `!=`
- legacy `is` / `is not` forms

Designed and documented, but not implemented yet:

- `INPUT`
- `BUTTON`
- `TEXT`
- `IMAGE`
- `SECTION`
- styling and positioning
- UI event handling
