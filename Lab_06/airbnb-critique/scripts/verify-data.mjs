import assert from 'node:assert/strict';
import { csv, rollup, min, max, median } from 'd3';

const base = process.argv[2] || 'http://127.0.0.1:5174';
const numericColumns = ['latitude', 'longitude', 'price', 'minimum_nights', 'number_of_reviews', 'reviews_per_month', 'availability_365', 'number_of_reviews_ltm'];
const page = await fetch(base);
assert.equal(page.status, 200, 'Scaffold page must respond successfully');
assert.match(await page.text(), /Welcome to SvelteKit/);
const rows = await csv(`${base}/airbnb_boston_cambridge.csv`, row => {
  for (const [key, value] of Object.entries(row)) assert.notEqual(value.trim(), '', `Missing ${key}`);
  for (const key of numericColumns) {
    row[key] = Number(row[key]);
    assert.ok(Number.isFinite(row[key]), `Invalid numeric value: ${key}`);
  }
  return row;
});
const actual = {
  listings: rows.length,
  roomTypes: Object.fromEntries(rollup(rows, values => values.length, row => row.room_type)),
  cities: Object.fromEntries(rollup(rows, values => values.length, row => row.city)),
  price: { min: min(rows, row => row.price), max: max(rows, row => row.price), median: median(rows, row => row.price) }
};
assert.equal(rows.columns.length, 12);
assert.deepEqual(actual, {
  listings: 4777,
  roomTypes: { 'Entire home/apt': 3014, 'Private room': 1666, 'Hotel room': 97 },
  cities: { Boston: 3705, Cambridge: 1072 },
  price: { min: 8, max: 1995, median: 269 }
});
console.log(JSON.stringify({ status: 'PASS', checkedAt: new Date().toISOString(), source: `${base}/airbnb_boston_cambridge.csv`, columns: rows.columns.length, numericColumns, ...actual, optionalSlice: 'Not available locally; download airbnb_slice20.csv from Canvas or the course download folder.' }, null, 2));
