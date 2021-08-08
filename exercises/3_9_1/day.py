import re
from lib.test import test, assert_match, assert_not_match

# 3.9.1 (a)
# Regex for English days of the week

day_pattern = re.compile(r"(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day")


# def test():
#     days = [
#         "Monday",
#         "Tuesday",
#         "Wednesday",
#         "Thursday",
#         "Friday",
#         "Saturday",
#         "Sunday",
#     ]
#     for day in days:
#         assert day_pattern.match(day), f"Day pattern not OK. Doesn't match {day}"

#     not_days = ["Sine", "Moonday"]
#     for not_day in not_days:
#         assert not day_pattern.match(not_day), f"Day pattern not OK. Matches {not_day}"

#     print("Day pattern OK")


def positive_case():
    days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ]
    for day in days:
        assert_match(day, day_pattern)
        # assert day_pattern.match(day), f"Day pattern not OK. Doesn't match {day}"


def negative_case():
    not_days = ["Sine", "Moonday"]
    for not_day in not_days:
        assert_not_match(not_day, day_pattern)


if __name__ == "__main__":
    test("matches a day", positive_case)
    test("doesn't match a non-day", negative_case)
