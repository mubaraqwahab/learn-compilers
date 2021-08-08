import re

# 3.9.1 (b)
# Regex for integers where every 3 digits are separated by commas.

sep_int_pattern = re.compile(r"[0-9]{1,3}(,[0-9]{3})*")


def test():
    sep_ints = ["78", "1,092", "692,098,000"]
    for sep_int in sep_ints:
        assert sep_int_pattern.match(
            sep_int
        ), f"Separated int pattern not OK. Doesn't match {sep_int}"

    not_sep_ints = ["78,", "10,92", "692098000"]
    for not_day in not_sep_ints:
        assert not sep_int_pattern.match(
            not_day
        ), f"Separated int pattern not OK. Matches {sep_int}"

    print("Days pattern OK")


if __name__ == "__main__":
    test()
