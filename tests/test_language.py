import unittest

from hpl import run


class LanguageTests(unittest.TestCase):
    def test_compact_variables_and_show(self):
        output = []
        run(
            '''VARIABLE name
name = "Shivv"
SHOW name''',
            output.append,
        )
        self.assertEqual(output, ["Shivv"])

    def test_if_and_else(self):
        output = []
        run(
            '''VARIABLE age
age = 16
IF age == 16
    SHOW "correct"
ELSE
    SHOW "wrong"''',
            output.append,
        )
        self.assertEqual(output, ["correct"])

    def test_legacy_syntax_still_works(self):
        output = []
        run(
            '''Create a variable called name.
Set name to "Shivv".
If name is "Shivv":
    show "correct"
Otherwise:
    show "wrong"''',
            output.append,
        )
        self.assertEqual(output, ["correct"])


if __name__ == "__main__":
    unittest.main()
