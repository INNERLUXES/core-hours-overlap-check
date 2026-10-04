// The pages and sentences the tool and its documents rest on. Each sentence comes from a page that is saved, with its
// address on the first line, in research/sources, and test/data.test.js compares this file with the saved text. Change a
// sentence here only after saving the new page text and updating docs/rules-and-sources.md. The code in src/ uses these
// constants and never writes a quoted sentence of its own.

export const SOURCES = [
  { id: 'ecma402', file: 'ecma402-time-zones.txt', url: 'https://tc39.es/ecma402/', label: 'ECMAScript Internationalization API Specification (ECMA-402): the IANA Time Zone Database, Intl.supportedValuesOf, CreateDateTimeFormat and formatToParts' },
  { id: 'iana-tz', file: 'iana-time-zones.txt', url: 'https://www.iana.org/time-zones', label: 'IANA: Time Zones, the page of the Time Zone Database' },
  { id: 'iana-theory', file: 'iana-tz-theory.txt', url: 'https://www.iana.org/time-zones/theory', label: 'IANA: Theory and pragmatics of the tz code and data' },
  { id: 'rfc3339', file: 'rfc3339-date-time.txt', url: 'https://www.rfc-editor.org/rfc/rfc3339.txt', label: 'RFC 3339, Date and Time on the Internet: Timestamps' },
  { id: 'rfc8259', file: 'rfc8259-json-objects.txt', url: 'https://www.rfc-editor.org/rfc/rfc8259', label: 'RFC 8259, The JSON Data Interchange Format' }
];

export const source = (id) => SOURCES.find((s) => s.id === id);

// Sentences quoted in the reports and the documents. Every text is on its saved page word for word (test/data.test.js
// compares them, with runs of white space read as one space), and holds no year.
export const FACTS = {
  tzDatabase: { source: 'iana-tz', section: 'Time Zones', text: 'The Time Zone Database (often called tz or zoneinfo) contains code and data that represent the history of local time for many representative locations worldwide.' },
  tzUpdated: { source: 'iana-tz', section: 'Time Zones', text: 'It is updated periodically to reflect changes made by political bodies to time zone boundaries, UTC offsets, and daylight-saving rules.' },
  tzNameUnique: { source: 'iana-theory', section: 'Timezone identifiers', text: 'Each timezone has a name that uniquely identifies the timezone.' },
  tzNameFormat: { source: 'iana-theory', section: 'Timezone identifiers', text: 'Names normally have the format AREA/LOCATION, where AREA is a continent or ocean, and LOCATION is a specific location within the area.' },
  tzZoneOrLink: { source: 'iana-theory', section: 'Timezone identifiers', text: 'The database defines each timezone name to be a zone, or a link to a zone.' },
  tzBaseOffset: { source: 'iana-theory', section: 'Scope of the tz database', text: 'It does not always make sense to talk about a timezone\'s "base offset", which is not necessarily a single number.' },
  tzCase: { source: 'iana-theory', section: 'Timezone identifiers', text: 'Although the reference implementation is case-sensitive, some other implementations are not, and they would mishandle names differing only in case.' },
  ecmaNamesFromIana: { source: 'ecma402', section: '6.5 Use of the IANA Time Zone Database', text: 'No String may be an available named time zone identifier unless it is a Zone name or a Link name in the IANA Time Zone Database.' },
  ecmaUtcPrimary: { source: 'ecma402', section: '6.5 Use of the IANA Time Zone Database', text: 'For historical reasons, "UTC" must be a primary time zone identifier.' },
  ecmaUpdates: { source: 'ecma402', section: '6.5 Use of the IANA Time Zone Database', text: 'These updates may add new Zone or Link names, may change Zones to Links, and may change the UTC offsets and transitions associated with any Zone.' },
  ecmaCaseInsensitive: { source: 'ecma402', section: '6.5.2 GetAvailableNamedTimeZoneIdentifier ( timeZoneIdentifier )', text: 'If record.[[Identifier]] is an ASCII-case-insensitive match for timeZoneIdentifier, return record.' },
  ecmaPrimaryList: { source: 'ecma402', section: '8.3.2 Intl.supportedValuesOf ( key )', text: 'Let list be AvailablePrimaryTimeZoneIdentifiers( ).' },
  ecmaRangeError: { source: 'ecma402', section: '11.1.2 CreateDateTimeFormat', text: 'If timeZoneIdentifierRecord is empty, throw a RangeError exception.' },
  ecmaPrimaryResolved: { source: 'ecma402', section: '11.1.2 CreateDateTimeFormat', text: 'Set timeZone to timeZoneIdentifierRecord.[[PrimaryIdentifier]].' },
  ecmaSystemZone: { source: 'ecma402', section: '11.1.2 CreateDateTimeFormat', text: 'If timeZone is undefined, then Set timeZone to SystemTimeZoneIdentifier().' },
  ecmaNowWhenUndefined: { source: 'ecma402', section: '11.3.6 Intl.DateTimeFormat.prototype.formatToParts ( date )', text: 'If date is undefined, then Let x be ! Call(%Date.now%, undefined).' },
  rfcUtc: { source: 'rfc3339', section: '4.1. Coordinated Universal Time (UTC)', text: 'Because the daylight saving rules for local time zones are so convoluted and can change based on local law at unpredictable times, true interoperability is best achieved by using Coordinated Universal Time (UTC).' },
  rfcFullDate: { source: 'rfc3339', section: '5.6. Internet Date/Time Format', text: 'full-date = date-fullyear "-" date-month "-" date-mday' },
  rfcTimeOffset: { source: 'rfc3339', section: '5.6. Internet Date/Time Format', text: 'time-offset = "Z" / time-numoffset' },
  jsonUnpredictable: { source: 'rfc8259', section: '4. Objects', text: 'When the names within an object are not unique, the behavior of software that receives such an object is unpredictable.' }
};

// The page of a quoted sentence.
export const factPage = (key) => source(FACTS[key].source).url;

// The days of the week as the configuration and the reports write them, from Sunday, in the order of
// Date.prototype.getUTCDay.
export const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
