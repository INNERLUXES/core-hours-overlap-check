## core-hours-overlap-check: FAIL - 31 of 175 checks on 20 days are short of the rules

- Team: examples/team.json (Example product team)
- Range: 35 days, day 0 (Mon) to day 34 (Sun); days counted in Europe/Berlin
- Rule anchor-overlap: everyone shares at least 240 minutes a day with Anke (days of Europe/Berlin)
- Rule core-window: everyone works 16:30-17:30 Europe/Berlin in full on mon-fri
- Clock changes: America/New\_York from UTC-05:00 to UTC-04:00 on day 6 (Sun); Europe/Berlin from UTC+01:00 to UTC+02:00 on day 27 (Sun); Europe/Lisbon from UTC+00:00 to UTC+01:00 on day 27 (Sun)
- Absences: Dina day off on day 15 (Tue); Spring holiday for Anke and Dina on day 32 (Fri)
- Results: 175 checks on 25 days: 144 met, 31 short on 20 days

### People

| Person | Time zone | Working hours (local time) |
| --- | --- | --- |
| Anke | Europe/Berlin | mon-fri 09:00-17:30 |
| Ben | America/New\_York | mon-fri 07:30-12:00, 13:00-16:00 |
| Caio | America/Sao\_Paulo | mon-fri 08:30-11:30, 12:30-17:30 |
| Dina | Europe/Lisbon | mon-fri 09:00-13:00, 14:00-18:00 |

### Short of the rules

| Day | Rule | Who | Shared minutes | Needed | Reasons |
| --- | --- | --- | --- | --- | --- |
| day 7 (Mon) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 8 (Tue) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 9 (Wed) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 10 (Thu) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 11 (Fri) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 14 (Mon) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 15 (Tue) | anchor-overlap | Dina with Anke | 0 | 240 | Dina has a day off on day 15 (Tue) |
| day 15 (Tue) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 15 (Tue) | core-window | Dina | 0 | 60 | Dina has a day off on day 15 (Tue) |
| day 16 (Wed) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 17 (Thu) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 18 (Fri) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 21 (Mon) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 22 (Tue) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 23 (Wed) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 24 (Thu) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 25 (Fri) | core-window | Ben | 30 | 60 | clock change: America/New\_York is at UTC-04:00, ahead of its standard UTC-05:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 28 (Mon) | anchor-overlap | Caio with Anke | 180 | 240 | clock change: Europe/Berlin is at UTC+02:00, ahead of its standard UTC+01:00; with every zone of the check on standard time it would share 240 of 240 minutes |
| day 28 (Mon) | core-window | Caio | 0 | 60 | clock change: Europe/Berlin is at UTC+02:00, ahead of its standard UTC+01:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 29 (Tue) | anchor-overlap | Caio with Anke | 180 | 240 | clock change: Europe/Berlin is at UTC+02:00, ahead of its standard UTC+01:00; with every zone of the check on standard time it would share 240 of 240 minutes |
| day 29 (Tue) | core-window | Caio | 0 | 60 | clock change: Europe/Berlin is at UTC+02:00, ahead of its standard UTC+01:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 30 (Wed) | anchor-overlap | Caio with Anke | 180 | 240 | clock change: Europe/Berlin is at UTC+02:00, ahead of its standard UTC+01:00; with every zone of the check on standard time it would share 240 of 240 minutes |
| day 30 (Wed) | core-window | Caio | 0 | 60 | clock change: Europe/Berlin is at UTC+02:00, ahead of its standard UTC+01:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 31 (Thu) | anchor-overlap | Caio with Anke | 180 | 240 | clock change: Europe/Berlin is at UTC+02:00, ahead of its standard UTC+01:00; with every zone of the check on standard time it would share 240 of 240 minutes |
| day 31 (Thu) | core-window | Caio | 0 | 60 | clock change: Europe/Berlin is at UTC+02:00, ahead of its standard UTC+01:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 32 (Fri) | anchor-overlap | Ben with Anke | 0 | 240 | Spring holiday for Anke on day 32 (Fri) |
| day 32 (Fri) | anchor-overlap | Caio with Anke | 0 | 240 | Spring holiday for Anke on day 32 (Fri) |
| day 32 (Fri) | anchor-overlap | Dina with Anke | 0 | 240 | Spring holiday for Dina on day 32 (Fri); Spring holiday for Anke on day 32 (Fri) |
| day 32 (Fri) | core-window | Anke | 0 | 60 | Spring holiday for Anke on day 32 (Fri) |
| day 32 (Fri) | core-window | Caio | 0 | 60 | clock change: Europe/Berlin is at UTC+02:00, ahead of its standard UTC+01:00; with every zone of the check on standard time it would cover 60 of 60 minutes |
| day 32 (Fri) | core-window | Dina | 0 | 60 | Spring holiday for Dina on day 32 (Fri) |

### Every day

Shared minutes; a star marks a check that is short of its rule, and a dash a check that does not run that day.

| Day | anchor-overlap Ben | anchor-overlap Caio | anchor-overlap Dina | core-window Anke | core-window Ben | core-window Caio | core-window Dina |
| --- | --- | --- | --- | --- | --- | --- | --- |
| day 0 (Mon) | 240 | 240 | 390 | 60 | 60 | 60 | 60 |
| day 1 (Tue) | 240 | 240 | 390 | 60 | 60 | 60 | 60 |
| day 2 (Wed) | 240 | 240 | 390 | 60 | 60 | 60 | 60 |
| day 3 (Thu) | 240 | 240 | 390 | 60 | 60 | 60 | 60 |
| day 4 (Fri) | 240 | 240 | 390 | 60 | 60 | 60 | 60 |
| day 5 (Sat) | - | - | - | - | - | - | - |
| day 6 (Sun) | - | - | - | - | - | - | - |
| day 7 (Mon) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 8 (Tue) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 9 (Wed) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 10 (Thu) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 11 (Fri) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 12 (Sat) | - | - | - | - | - | - | - |
| day 13 (Sun) | - | - | - | - | - | - | - |
| day 14 (Mon) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 15 (Tue) | 270 | 240 | **0\*** | 60 | **30\*** | 60 | **0\*** |
| day 16 (Wed) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 17 (Thu) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 18 (Fri) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 19 (Sat) | - | - | - | - | - | - | - |
| day 20 (Sun) | - | - | - | - | - | - | - |
| day 21 (Mon) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 22 (Tue) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 23 (Wed) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 24 (Thu) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 25 (Fri) | 270 | 240 | 390 | 60 | **30\*** | 60 | 60 |
| day 26 (Sat) | - | - | - | - | - | - | - |
| day 27 (Sun) | - | - | - | - | - | - | - |
| day 28 (Mon) | 240 | **180\*** | 390 | 60 | 60 | **0\*** | 60 |
| day 29 (Tue) | 240 | **180\*** | 390 | 60 | 60 | **0\*** | 60 |
| day 30 (Wed) | 240 | **180\*** | 390 | 60 | 60 | **0\*** | 60 |
| day 31 (Thu) | 240 | **180\*** | 390 | 60 | 60 | **0\*** | 60 |
| day 32 (Fri) | **0\*** | **0\*** | **0\*** | **0\*** | 60 | **0\*** | **0\*** |
| day 33 (Sat) | - | - | - | - | - | - | - |
| day 34 (Sun) | - | - | - | - | - | - | - |

### The moments behind each number

All times are in UTC.

#### day 0 (Mon)

- anchor-overlap Ben with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day -1 23:00Z-23:00Z. Ben (America/New\_York, UTC-05:00): 12:30Z-17:00Z, 18:00Z-21:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 12:30Z-16:30Z = 240 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day -1 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day -1 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-05:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 1 (Tue)

- anchor-overlap Ben with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 0 23:00Z-23:00Z. Ben (America/New\_York, UTC-05:00): 12:30Z-17:00Z, 18:00Z-21:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 12:30Z-16:30Z = 240 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 0 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 0 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-05:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 2 (Wed)

- anchor-overlap Ben with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 1 23:00Z-23:00Z. Ben (America/New\_York, UTC-05:00): 12:30Z-17:00Z, 18:00Z-21:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 12:30Z-16:30Z = 240 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 1 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 1 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-05:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 3 (Thu)

- anchor-overlap Ben with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 2 23:00Z-23:00Z. Ben (America/New\_York, UTC-05:00): 12:30Z-17:00Z, 18:00Z-21:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 12:30Z-16:30Z = 240 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 2 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 2 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-05:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 4 (Fri)

- anchor-overlap Ben with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 3 23:00Z-23:00Z. Ben (America/New\_York, UTC-05:00): 12:30Z-17:00Z, 18:00Z-21:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 12:30Z-16:30Z = 240 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 3 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 3 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-05:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 7 (Mon)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 6 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 6 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 6 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 8 (Tue)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 7 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 7 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 7 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 9 (Wed)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 8 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 8 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 8 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 10 (Thu)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 9 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 9 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 9 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 11 (Fri)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 10 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 10 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 10 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 14 (Mon)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 13 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 13 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 13 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 15 (Tue)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 14 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 14 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 0 minutes, 240 needed, short. day of Europe/Berlin (UTC+01:00): day 14 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): none; scheduled 09:00Z-13:00Z, 14:00Z-18:00Z, taken out: day off. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: none = 0 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 0 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): none; scheduled 15:30Z-16:30Z, taken out: day off. shared: none = 0 minutes

#### day 16 (Wed)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 15 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 15 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 15 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 17 (Thu)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 16 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 16 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 16 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 18 (Fri)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 17 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 17 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 17 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 21 (Mon)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 20 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 20 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 20 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 22 (Tue)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 21 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 21 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 21 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 23 (Wed)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 22 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 22 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 22 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 24 (Thu)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 23 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 23 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 23 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 25 (Fri)

- anchor-overlap Ben with Anke: 270 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 24 23:00Z-23:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-16:00Z = 270 minutes
- anchor-overlap Caio with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 24 23:00Z-23:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 11:30Z-14:30Z, 15:30Z-16:30Z = 240 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+01:00): day 24 23:00Z-23:00Z. Dina (Europe/Lisbon, UTC+00:00): 09:00Z-13:00Z, 14:00Z-18:00Z. Anke (Europe/Berlin, UTC+01:00): 08:00Z-16:30Z. shared: 09:00Z-13:00Z, 14:00Z-16:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Anke (Europe/Berlin, UTC+01:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Ben: 30 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Ben (America/New\_York, UTC-04:00): 15:30Z-16:00Z. shared: 15:30Z-16:00Z = 30 minutes
- core-window Caio: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Caio (America/Sao\_Paulo, UTC-03:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+01:00): 15:30Z-16:30Z. Dina (Europe/Lisbon, UTC+00:00): 15:30Z-16:30Z. shared: 15:30Z-16:30Z = 60 minutes

#### day 28 (Mon)

- anchor-overlap Ben with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+02:00): day 27 22:00Z-22:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 11:30Z-15:30Z = 240 minutes
- anchor-overlap Caio with Anke: 180 minutes, 240 needed, short. day of Europe/Berlin (UTC+02:00): day 27 22:00Z-22:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 11:30Z-14:30Z = 180 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+02:00): day 27 22:00Z-22:00Z. Dina (Europe/Lisbon, UTC+01:00): 08:00Z-12:00Z, 13:00Z-17:00Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 08:00Z-12:00Z, 13:00Z-15:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Anke (Europe/Berlin, UTC+02:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes
- core-window Ben: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Ben (America/New\_York, UTC-04:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes
- core-window Caio: 0 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Caio (America/Sao\_Paulo, UTC-03:00): none. shared: none = 0 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Dina (Europe/Lisbon, UTC+01:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes

#### day 29 (Tue)

- anchor-overlap Ben with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+02:00): day 28 22:00Z-22:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 11:30Z-15:30Z = 240 minutes
- anchor-overlap Caio with Anke: 180 minutes, 240 needed, short. day of Europe/Berlin (UTC+02:00): day 28 22:00Z-22:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 11:30Z-14:30Z = 180 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+02:00): day 28 22:00Z-22:00Z. Dina (Europe/Lisbon, UTC+01:00): 08:00Z-12:00Z, 13:00Z-17:00Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 08:00Z-12:00Z, 13:00Z-15:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Anke (Europe/Berlin, UTC+02:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes
- core-window Ben: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Ben (America/New\_York, UTC-04:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes
- core-window Caio: 0 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Caio (America/Sao\_Paulo, UTC-03:00): none. shared: none = 0 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Dina (Europe/Lisbon, UTC+01:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes

#### day 30 (Wed)

- anchor-overlap Ben with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+02:00): day 29 22:00Z-22:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 11:30Z-15:30Z = 240 minutes
- anchor-overlap Caio with Anke: 180 minutes, 240 needed, short. day of Europe/Berlin (UTC+02:00): day 29 22:00Z-22:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 11:30Z-14:30Z = 180 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+02:00): day 29 22:00Z-22:00Z. Dina (Europe/Lisbon, UTC+01:00): 08:00Z-12:00Z, 13:00Z-17:00Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 08:00Z-12:00Z, 13:00Z-15:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Anke (Europe/Berlin, UTC+02:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes
- core-window Ben: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Ben (America/New\_York, UTC-04:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes
- core-window Caio: 0 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Caio (America/Sao\_Paulo, UTC-03:00): none. shared: none = 0 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Dina (Europe/Lisbon, UTC+01:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes

#### day 31 (Thu)

- anchor-overlap Ben with Anke: 240 minutes, 240 needed. day of Europe/Berlin (UTC+02:00): day 30 22:00Z-22:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 11:30Z-15:30Z = 240 minutes
- anchor-overlap Caio with Anke: 180 minutes, 240 needed, short. day of Europe/Berlin (UTC+02:00): day 30 22:00Z-22:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 11:30Z-14:30Z = 180 minutes
- anchor-overlap Dina with Anke: 390 minutes, 240 needed. day of Europe/Berlin (UTC+02:00): day 30 22:00Z-22:00Z. Dina (Europe/Lisbon, UTC+01:00): 08:00Z-12:00Z, 13:00Z-17:00Z. Anke (Europe/Berlin, UTC+02:00): 07:00Z-15:30Z. shared: 08:00Z-12:00Z, 13:00Z-15:30Z = 390 minutes
- core-window Anke: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Anke (Europe/Berlin, UTC+02:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes
- core-window Ben: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Ben (America/New\_York, UTC-04:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes
- core-window Caio: 0 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Caio (America/Sao\_Paulo, UTC-03:00): none. shared: none = 0 minutes
- core-window Dina: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Dina (Europe/Lisbon, UTC+01:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes

#### day 32 (Fri)

- anchor-overlap Ben with Anke: 0 minutes, 240 needed, short. day of Europe/Berlin (UTC+02:00): day 31 22:00Z-22:00Z. Ben (America/New\_York, UTC-04:00): 11:30Z-16:00Z, 17:00Z-20:00Z. Anke (Europe/Berlin, UTC+02:00): none; scheduled 07:00Z-15:30Z, taken out: Spring holiday. shared: none = 0 minutes
- anchor-overlap Caio with Anke: 0 minutes, 240 needed, short. day of Europe/Berlin (UTC+02:00): day 31 22:00Z-22:00Z. Caio (America/Sao\_Paulo, UTC-03:00): 11:30Z-14:30Z, 15:30Z-20:30Z. Anke (Europe/Berlin, UTC+02:00): none; scheduled 07:00Z-15:30Z, taken out: Spring holiday. shared: none = 0 minutes
- anchor-overlap Dina with Anke: 0 minutes, 240 needed, short. day of Europe/Berlin (UTC+02:00): day 31 22:00Z-22:00Z. Dina (Europe/Lisbon, UTC+01:00): none; scheduled 08:00Z-12:00Z, 13:00Z-17:00Z, taken out: Spring holiday. Anke (Europe/Berlin, UTC+02:00): none; scheduled 07:00Z-15:30Z, taken out: Spring holiday. shared: none = 0 minutes
- core-window Anke: 0 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Anke (Europe/Berlin, UTC+02:00): none; scheduled 14:30Z-15:30Z, taken out: Spring holiday. shared: none = 0 minutes
- core-window Ben: 60 minutes, 60 needed. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Ben (America/New\_York, UTC-04:00): 14:30Z-15:30Z. shared: 14:30Z-15:30Z = 60 minutes
- core-window Caio: 0 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Caio (America/Sao\_Paulo, UTC-03:00): none. shared: none = 0 minutes
- core-window Dina: 0 minutes, 60 needed, short. window 16:30-17:30 Europe/Berlin (UTC+02:00): 14:30Z-15:30Z. Dina (Europe/Lisbon, UTC+01:00): none; scheduled 14:30Z-15:30Z, taken out: Spring holiday. shared: none = 0 minutes

### Basis

- "Because the daylight saving rules for local time zones are so convoluted and can change based on local law at unpredictable times, true interoperability is best achieved by using Coordinated Universal Time (UTC)." (4.1. Coordinated Universal Time (UTC), https://www.rfc-editor.org/rfc/rfc3339.txt)
- "It is updated periodically to reflect changes made by political bodies to time zone boundaries, UTC offsets, and daylight-saving rules." (Time Zones, https://www.iana.org/time-zones)
- "It does not always make sense to talk about a timezone's "base offset", which is not necessarily a single number." (Scope of the tz database, https://www.iana.org/time-zones/theory)
