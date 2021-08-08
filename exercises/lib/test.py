from types import FunctionType
from typing import Pattern


def test(desc: str, fn: FunctionType):
    """Create a test.

    The test fails if fn raises an exception, but passes otherwise.

    Example:
    ```
    def passing_case():
        assert 2 + 2 == 4, "wrong! 2 + 2 isn't 4"

    def failing_case():
        assert 2 + 2 == 5, "wrong! 2 + 2 isn't 5"

    test("2 + 2 is 4", passing_case)
    # ✔ 2 + 2 is 4

    test("2 + 2 is 5", failing_case)
    # ❌ 2 + 2 is 5
    #     wrong! 2 + 2 isn't 5
    ```
    """

    try:
        print("..")
        fn()
        print(f"✔ {desc}")
    except Exception as err:
        print(f"❌ {desc}\n    {err}")


def assert_match(string: str, pattern: Pattern):
    """Assert that a string matches a compiled regex pattern."""
    assert pattern.match(string), f"Doesn't match {string}."


def assert_not_match(string: str, pattern: Pattern):
    """Assert that a string does not match a compiled regex pattern."""
    assert not pattern.match(string), f"Matches {string}."
