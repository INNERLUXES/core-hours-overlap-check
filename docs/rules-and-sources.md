# Rules and sources

Every sentence the tool quotes, in a report or in these documents, comes from a page that was opened and saved as plain text in `research/sources`, with its address on the first line. `src/data.js` holds the sentences, and `test/data.test.js` compares each one with the saved text, so a sentence cannot drift from its page. Where the tool makes a choice that no page makes for it, docs/method.md says so.

## The saved pages

| File | Page | What is kept |
| --- | --- | --- |
| `ecma402-time-zones.txt` | ECMAScript Internationalization API Specification (ECMA-402), the draft at https://tc39.es/ecma402/ | section 6.5 on the use of the IANA Time Zone Database, 6.5.1 to 6.5.3 on the available and primary time zone names, the time zone branch of 8.3.2 `Intl.supportedValuesOf`, the time zone steps of 11.1.2 CreateDateTimeFormat, and 11.3.6 `formatToParts` |
| `iana-time-zones.txt` | IANA: Time Zones, https://www.iana.org/time-zones | the two paragraphs that describe the Time Zone Database |
| `iana-tz-theory.txt` | IANA: Theory and pragmatics of the tz code and data, https://www.iana.org/time-zones/theory | the end of the scope section on base offsets, and the parts of the section on timezone identifiers about names, their format, case, zones and links, and Etc/UTC |
| `rfc3339-date-time.txt` | RFC 3339, Date and Time on the Internet: Timestamps, https://www.rfc-editor.org/rfc/rfc3339.txt | section 4.1 on UTC and the grammar of section 5.6 |
| `rfc8259-json-objects.txt` | RFC 8259, The JSON Data Interchange Format, https://www.rfc-editor.org/rfc/rfc8259 | section 4, objects and repeated names |

Each page is kept in parts: a line `[...]` marks text left out. Left out are the parts that hold a year or a release date (the title line of the ECMA-402 draft, its example of a renamed zone, the latest release on the IANA page), the parts that hold characters outside ASCII (the CLDR example names on the theory page), and the parts the tool does not rest on. Typographic quotes and apostrophes are written as ASCII. The ECMA-402 steps are written one to a line, with their nesting as indentation; the words are those of the page. Every line of the saved text was compared with the page it came from.

## The rules

| Rule | Key | Sentences | Method |
| --- | --- | --- | --- |
| `pair-overlap` | `rules.pairOverlap` | `rfcUtc`, `tzUpdated` | [pair-overlap](method.md#pair-overlap) |
| `anchor-overlap` | `rules.anchorOverlap` | `rfcUtc`, `tzUpdated` | [anchor-overlap](method.md#anchor-overlap) |
| `core-window` | `rules.coreWindow` | `rfcUtc`, `tzUpdated` | [core-window](method.md#core-window) |

The reason "clock change" rests on `tzBaseOffset` and `tzUpdated`. `--explain` prints the sentences of the rules, and of the reasons used, at the end of the report, with the section and the page.

## The sentences

| Key | Used by | Page and section | Sentence |
| --- | --- | --- | --- |
| `tzDatabase` | the documents | iana-time-zones.txt, Time Zones | The Time Zone Database (often called tz or zoneinfo) contains code and data that represent the history of local time for many representative locations worldwide. |
| `tzUpdated` | `pair-overlap`, `anchor-overlap`, `core-window`, reason clock-change | iana-time-zones.txt, Time Zones | It is updated periodically to reflect changes made by political bodies to time zone boundaries, UTC offsets, and daylight-saving rules. |
| `tzNameUnique` | the documents | iana-tz-theory.txt, Timezone identifiers | Each timezone has a name that uniquely identifies the timezone. |
| `tzNameFormat` | the documents | iana-tz-theory.txt, Timezone identifiers | Names normally have the format AREA/LOCATION, where AREA is a continent or ocean, and LOCATION is a specific location within the area. |
| `tzZoneOrLink` | the documents | iana-tz-theory.txt, Timezone identifiers | The database defines each timezone name to be a zone, or a link to a zone. |
| `tzBaseOffset` | reason clock-change | iana-tz-theory.txt, Scope of the tz database | It does not always make sense to talk about a timezone's "base offset", which is not necessarily a single number. |
| `tzCase` | the documents | iana-tz-theory.txt, Timezone identifiers | Although the reference implementation is case-sensitive, some other implementations are not, and they would mishandle names differing only in case. |
| `ecmaNamesFromIana` | the documents | ecma402-time-zones.txt, 6.5 Use of the IANA Time Zone Database | No String may be an available named time zone identifier unless it is a Zone name or a Link name in the IANA Time Zone Database. |
| `ecmaUtcPrimary` | the documents | ecma402-time-zones.txt, 6.5 Use of the IANA Time Zone Database | For historical reasons, "UTC" must be a primary time zone identifier. |
| `ecmaUpdates` | the documents | ecma402-time-zones.txt, 6.5 Use of the IANA Time Zone Database | These updates may add new Zone or Link names, may change Zones to Links, and may change the UTC offsets and transitions associated with any Zone. |
| `ecmaCaseInsensitive` | the documents | ecma402-time-zones.txt, 6.5.2 GetAvailableNamedTimeZoneIdentifier ( timeZoneIdentifier ) | If record.[[Identifier]] is an ASCII-case-insensitive match for timeZoneIdentifier, return record. |
| `ecmaPrimaryList` | the documents | ecma402-time-zones.txt, 8.3.2 Intl.supportedValuesOf ( key ) | Let list be AvailablePrimaryTimeZoneIdentifiers( ). |
| `ecmaRangeError` | the documents | ecma402-time-zones.txt, 11.1.2 CreateDateTimeFormat | If timeZoneIdentifierRecord is empty, throw a RangeError exception. |
| `ecmaPrimaryResolved` | the documents | ecma402-time-zones.txt, 11.1.2 CreateDateTimeFormat | Set timeZone to timeZoneIdentifierRecord.[[PrimaryIdentifier]]. |
| `ecmaSystemZone` | the documents | ecma402-time-zones.txt, 11.1.2 CreateDateTimeFormat | If timeZone is undefined, then Set timeZone to SystemTimeZoneIdentifier(). |
| `ecmaNowWhenUndefined` | the documents | ecma402-time-zones.txt, 11.3.6 Intl.DateTimeFormat.prototype.formatToParts ( date ) | If date is undefined, then Let x be ! Call(%Date.now%, undefined). |
| `rfcUtc` | `pair-overlap`, `anchor-overlap`, `core-window` | rfc3339-date-time.txt, 4.1. Coordinated Universal Time (UTC) | Because the daylight saving rules for local time zones are so convoluted and can change based on local law at unpredictable times, true interoperability is best achieved by using Coordinated Universal Time (UTC). |
| `rfcFullDate` | the documents | rfc3339-date-time.txt, 5.6. Internet Date/Time Format | full-date = date-fullyear "-" date-month "-" date-mday |
| `rfcTimeOffset` | the documents | rfc3339-date-time.txt, 5.6. Internet Date/Time Format | time-offset = "Z" / time-numoffset |
| `jsonUnpredictable` | the documents | rfc8259-json-objects.txt, 4. Objects | When the names within an object are not unique, the behavior of software that receives such an object is unpredictable. |

## What the sentences do and do not say

- ECMA-402 says how Intl resolves a time zone name, that an unknown name throws a RangeError, that `Intl.supportedValuesOf('timeZone')` lists the primary names, and that UTC is a primary name. It does not say how a local time that is skipped or repeated must be read; the rule of docs/method.md is the tool's own.
- The IANA pages say what the database holds, how names are formed, and that offsets and rules change. They do not define a standard time for every zone; the tool's lowest offset of the year around a day is its own definition, and the theory page warns that a base offset is not necessarily a single number.
- RFC 3339 gives the form of a date and the `Z` of UTC that the reports use. The reports write a moment as `HH:MMZ` with no seconds, which is not an RFC 3339 date-time.
