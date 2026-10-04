# Limits

The tool compares the working hours it is given. It is as good as the team file and the time zone data of the Node that runs it.

## What it cannot see

- **How the time is used.** Shared hours are hours in which both people are scheduled to work. Meetings, focus time, people who answer outside their hours and people who do not answer inside them are not in the file.
- **Absences that are not in the file.** A sick day, a late start or a public holiday that nobody wrote down is not seen. Holidays come from the team file only; the tool has no calendar of public holidays.
- **The time zone data of another machine.** The offsets come from the Intl API of the Node that runs the tool, and so from the time zone data built into it. The IANA page says of the database: "It is updated periodically to reflect changes made by political bodies to time zone boundaries, UTC offsets, and daylight-saving rules." A Node with older data gives other results for a zone whose rules changed after its data was made, and two machines with different Node versions can disagree about the future. Pin the Node version of the pipeline that runs the check.
- **Standard time in odd zones.** The reason "clock change" compares with each zone's lowest offset within half a year on each side of a day. For a zone that moved its offset for good within that time, the lowest offset is the old one, and a short day can be put down to a clock change that is really a new offset. A zone whose summer time is below its standard time in the data, or a zone with more than two offsets in a year, is read the same way: by its offsets, not by its names.
- **Two changes within a day.** Offsets are read once a day and every change between two readings is found to the second. Two changes within one day that undo each other are not seen.
- **Shifts across midnight in one piece.** They are written as two shifts. A day off on the second day then takes out only the second part.
- **Days across zones.** The overlap rules count in the calendar days of `dayZone`. For people whose working day lies across midnight in `dayZone`, one long overlap can be split between two days, and each part is checked on its own day.
- **Names.** People are named by display names; two people with the same name must be told apart in the file, because names are compared without case.

## Size limits

Past a limit, the input is refused with exit code `2` and no verdict; nothing is half read.

| What | Limit |
| --- | --- |
| team file | 1 MB, nesting 32 deep, 100,000 values, 4,096 characters in a string |
| people | 100, names of at most 60 characters |
| shifts | 6 on one day of the week |
| days off | 1,000 for each person |
| holidays | 500, with 1,000 days each |
| range | 1 to 1,000 days, ending on the last day of the four-digit years at the latest |
| days as numbers | -3,660 to 3,660 |
| checks | 200,000 in one run: the days of the range times the checks of a day |
| problems listed | 20, then a count of the rest |

The tests run a hundred people in ten zones over a thousand days, close to two hundred thousand checks, with a time limit, and refuse a team file of megabytes and JSON nested half a million deep in one pass.
