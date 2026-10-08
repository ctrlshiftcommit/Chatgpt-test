import unittest

from hpl import run


class LanguageTests(unittest.TestCase):
    def test_variables_and_show(self):
        output = []
        run(
            '''Create a variable called name.
Set name to "Shivv".
Show name.''',
            output.append,
        )
        self.assertEqual(output, ["Shivv"])

    def test_if_and_otherwise(self):
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
