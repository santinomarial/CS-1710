# Bluebikes & the T — one week in September 2026

## Source

- **Trips:** Bluebikes' public trip history, month file `202609-bluebikes-tripdata.csv`
  from <https://s3.amazonaws.com/hubway-data/index.html>. Published by Bluebikes (operated
  by Lyft for the municipalities of Boston, Cambridge, Somerville and others) under the
  Bluebikes data licence agreement.
- **Bike stations:** the live GBFS feed,
  <https://gbfs.bluebikes.com/gbfs/en/station_information.json>, snapshot taken
  **5 Oct 2026**.
- **Subway stations:** the MBTA V3 API, <https://api-v3.mbta.com>, routes of type 0
  (light rail) and 1 (heavy rail) — Red, Orange, Blue, Green B/C/D/E and the Mattapan
  trolley.
- **Towns** for the bike stations GBFS leaves unassigned come from the US Census
  geocoder (county subdivisions).

Both files are built by `extract_lab08.py`, which re-runs for any month and any week.

## Size & format

| File | Rows | Size | One row is… |
| --- | --: | --: | --- |
| `stations.csv` | 732 | 54 KB | one station — **607 bike + 125 subway** |
| `trips_week.csv` | 148,943 | 5.9 MB (1.2 MB gzipped) | one bike trip, **Mon 14 – Sun 20 Sept 2026** |

## Schema

**`stations.csv`**

| Column | Meaning |
| --- | --- |
| `id` | Bike: Bluebikes short code, e.g. `M32006`. Subway: MBTA parent station, e.g. `place-harsq` |
| `name` | Display name |
| `lat`, `lon` | WGS84 degrees, 6 decimals (~10 cm) |
| `kind` | `bike` or `subway` |
| `municipality` | Town: Boston, Cambridge, Somerville, Medford, … |
| `capacity` | Docks (bike only; blank for subway) |
| `lines` | Subway only. **Pipe-separated** — `Red`, or `Red\|Green-B\|Green-C\|Green-D\|Green-E` at Park Street |

**`trips_week.csv`**

| Column | Meaning |
| --- | --- |
| `start_id`, `end_id` | Station `id` — joins to `stations.csv` |
| `started` | Local time (Boston), to the minute: `2026-09-16 08:12` |
| `dur_min` | Ride length in minutes, one decimal |
| `bike` | `c` classic · `e` electric |
| `rider` | `m` annual member · `c` casual (pass or single ride) |

The trip file deliberately carries **no names and no coordinates** — only station ids.
Everything spatial comes from joining to `stations.csv`, so there is exactly one place a
station's location lives.

## Why this week

Monday 14 – Sunday 20 September is the second full week of term, after Labor Day
(7 Sept) and before the nor'easter of 26–28 Sept. It is a dry, ordinary week —
the Bluebikes trip counts show what the alternatives would have done:

| Day | High °F | Rain (in) | Trips |
| --- | --: | --: | --: |
| Sun 13 Sept (not shipped) | 68 | **1.27** | 8,606 |
| Mon 14 | 72 | 0 | 21,325 |
| Tue 15 | 66 | 0 | 21,867 |
| Wed 16 | 78 | 0 | 23,125 |
| Thu 17 | 77 | 0.07 | 21,395 |
| Fri 18 | 77 | 0.02 | 23,756 |
| Sat 19 | 62 | 0 | 22,784 |
| Sun 20 | 62 | 0.05 | 14,691 |
| Sat 26 Sept (not shipped) | 62 | **1.78** | 3,915 |

Weather: Open-Meteo historical archive, central Boston. Trips: the shipped file (and,
for the two unshipped days, the full month file, which includes Salem).

## What's actually in the file

**Who and what.** 68.6% of trips are by members; 36.6% are on e-bikes. Median ride
10.3 minutes; 95% are under 35.

**Two peaks on weekdays, one hump at weekends.** Across the five weekdays, departures
peak at **17:00 (12,531)** and **08:00 (9,665)**; the weekend has no morning peak at all
and plateaus around 2,700–3,000 an hour from noon to 18:00. Note these are *totals* —
five weekdays against two weekend days. Per day, the weekday 17:00 hour is ~2,500 trips.

**Cambridge is the centre of gravity.** Three of the five busiest start stations are in
Cambridge, and the busiest is MIT's:

| Station | Town | Trips started |
| --- | --- | --: |
| MIT at Mass Ave / Amherst St | Cambridge | 2,487 |
| Massachusetts Ave at Boylston St. | Boston | 1,873 |
| Central Square at Mass Ave / Essex St | Cambridge | 1,841 |
| MIT Vassar St | Cambridge | 1,711 |
| Harvard Square at Mass Ave/ Dunster | Cambridge | 1,683 |

The single busiest route crosses the river: **MIT at Mass Ave → Beacon St at Mass Ave,
262 trips** (and 200 back).

**The busiest station is not the busiest at 08:00.** On weekday 08:00 departures in
Cambridge, **MIT Vassar St leads with 210** — two and a half times MIT at Mass Ave (84).
Busiest-overall and busiest-at-rush-hour are different questions with different answers.

**Bikes cluster at the T.** 235 of the 607 bike stations (39%) sit within 400 m of a
subway station, but those stations originate **55% of all trips** (82,624).

## Known data wrinkles (these matter for *judging*)

- **Cutting the data at the town line is a lie by omission.** Of the 43,982 trips that
  start in Cambridge, **16,499 (37.5%) end outside it** — most in Boston. A "Cambridge
  only" filter applied to both ends silently deletes more than a third of Cambridge's
  riding, and nearly all of its river crossings. Filter on one end, and say which.
- **One station isn't in the station list.** `X32999` appears in 15 trips and has no row
  in `stations.csv` (it is not in the live feed). An inner join drops those trips without a
  word; a lookup returns `undefined` and the mark lands at `NaN`. 15 of 148,943 is
  harmless — the *silence* is the lesson.
- **The system is wider than Cambridge.** Bike stations run up to 13.5 km from Harvard
  Square — Hyde Park at the far end, then Revere, Newton, Malden — across 12 towns. Fit the map to "all stations" and Cambridge
  is a small patch in the middle. Pick the initial view on purpose.
- **Transfer stations belong to several lines.** 14 of the 125 subway stations carry more
  than one line in `lines`. Color by line and Park Street needs a decision, not a default —
  and splitting the field naively turns the four Green branches into four "lines".
- **The station snapshot is newer than the trips.** Locations are from 5 Oct 2026; trips
  are from mid-September. A station moved in between would plot at its new spot.
- **A few rides are very long.** 208 trips run over 3 hours and one over 24 (1,492 min).
  Leave them in for counting; cap or exclude them before averaging durations.
- **4,029 round trips** start and end at the same dock. On a flow map they are a
  zero-length line — invisible unless you draw them some other way.
- **Bluebikes' raw file has more columns than this one.** The originals include
  `start_lat`/`start_lng` per trip, but for e-bikes these are the *bike's* GPS, not the
  dock (one station has 73 distinct "locations" in a month). That's why this extract keeps
  ids only.

## Performance note

148,943 rows is about 6 MB of CSV and loads in well under a second; filtering it in
JavaScript takes milliseconds. What will *not* be fast is drawing it. One SVG element per
trip is ~150,000 DOM nodes and the map will stutter on every pan. Keep the rows in memory,
**draw aggregates**: ~730 station marks, a few dozen flow lines, a 24-bar chart.

## Story angles

- **First mile, last mile.** How much of bike share is really a feeder for the T?
- **Two rivers of commuters.** The 08:00 and 17:00 flows across the Charles, and which
  bridges' stations carry them.
- **Members vs casuals.** Weekday commute vs weekend leisure — where on the map each lives.
- **Where's the gap?** Stations far from any T stop, and whether their riding looks
  different.

## Cleaning notes

Trips with no start or no end station were dropped (396 and 1,236 in the month file,
0.3%). **Salem was removed**: its 18 stations form a separate network 25 km up the coast.
That week, 592 trips stayed inside Salem and only 11 crossed to the rest of the system
(~45–65-minute e-bike rides to Revere or Chelsea), so all 603 trips touching a Salem station
were dropped. Nothing else was removed. All figures above were computed from the shipped files.
