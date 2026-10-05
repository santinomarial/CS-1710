import * as d3 from 'd3';

// The dataset's earliest and latest #1 (Aug 4 1958 -> Jan 11 2025).
export const YEAR_MIN = 1958;
export const YEAR_MAX = 2025;

export const UNLABELED = 'Unlabeled';

const DATE_RE = /^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/;
const parseFullDate = d3.timeParse('%d-%b-%Y');

/**
 * `Date` arrives as `4-Aug-58`. Parsing that with `%y` pivots the century at
 * 1969, so 1958 would land in 2058. Expand the two-digit year to four digits
 * first: >= 58 is a 19xx year, anything lower is 20xx.
 */
export function parseBillboardDate(value) {
	const m = DATE_RE.exec(String(value ?? '').trim());
	if (!m) return null;
	const [, day, month, yy] = m;
	const year = Number(yy) >= 58 ? 1900 + Number(yy) : 2000 + Number(yy);
	const date = parseFullDate(`${day}-${month}-${year}`);
	if (!date) return null;
	// Guard the stated range rather than trusting the expansion silently.
	return date.getFullYear() >= YEAR_MIN && date.getFullYear() <= YEAR_MAX ? date : null;
}

/** Blank and non-numeric strings become null, never 0. */
export function toNumber(value) {
	const s = String(value ?? '').trim();
	if (s === '') return null;
	const n = Number(s);
	return Number.isFinite(n) ? n : null;
}

/** Primary genre = the text before the first `;`. Blank is a real category. */
export function primaryGenre(value) {
	const g = String(value ?? '').split(';')[0].trim();
	return g === '' ? UNLABELED : g;
}

/** One row in, one song out — a row is a song, not a chart-week. */
export function prepareSongs(rows) {
	return rows.map((d) => {
		const date = parseBillboardDate(d.Date);
		return {
			song: d.Song,
			artist: d.Artist,
			date,
			year: date ? date.getFullYear() : null,
			weeksAtNumberOne: toNumber(d['Weeks at Number One']),
			genre: primaryGenre(d['CDR Genre']),
			bpm: toNumber(d.BPM),
			energy: toNumber(d.Energy),
			danceability: toNumber(d.Danceability),
			happiness: toNumber(d.Happiness),
			acousticness: toNumber(d.Acousticness),
			loudnessDb: toNumber(d['Loudness (dB)']),
			lengthSec: toNumber(d['Length (Sec)'])
		};
	});
}
