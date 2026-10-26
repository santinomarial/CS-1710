# Boston & Cambridge Airbnb Listings (Inside Airbnb, June 2026)

Source: **Inside Airbnb** (<https://insideairbnb.com/get-the-data/>), the "summary
listings" export for **Boston, MA** (compiled 15 June 2026) and **Cambridge, MA**
(compiled 29 June 2026), combined into one file. Inside Airbnb publishes scraped
snapshots of public Airbnb listings under a Creative Commons CC0 dedication.

- File: `airbnb_boston_cambridge.csv` — **4,777 rows, 12 columns**. One row per active
  short-term-rental listing.
- **Lightly cleaned on purpose.** This is a *perceptual-critique* lab, not a
  data-cleaning one — so the file is a clean canvas, and any ugliness in your chart
  comes from *encoding choices*, not the data.

## What we changed from the raw Inside Airbnb export

So you can trust the file and reproduce it:

- **Combined two cities** and added a `city` column (`Boston` / `Cambridge`).
- **Dropped listings with no published price** (Inside Airbnb increasingly omits price;
  ~1,060 rows) — because `price` is central to this lab.
- **Trimmed 27 extreme price outliers** (> $2,000/night) so the price scale isn't
  wrecked by a handful of luxury listings.
- **Removed the 3 "Shared room" listings** (a negligible 4th category) — leaving three
  clean room types.
- **Filled `reviews_per_month` = 0** for never-reviewed listings (blank in the raw data).
- Kept 12 useful columns; dropped host IDs, license, and other metadata.

Result: **no missing values in any column.**

## Columns

| Column | Type | Range / values (this file) | Notes |
| --- | --- | --- | --- |
| `name` | text | — | The listing's title. For tooltips only. |
| `city` | **category** | `Boston` (3,705), `Cambridge` (1,072) | A second categorical, if you want it. |
| `neighbourhood` | category | 38 values (Dorchester, Back Bay, Downtown, …) | Many values — too many for a color channel. |
| `latitude` | float | 42.23 – 42.42 | Maps straight to a y-scale (a real map — see Lab 3). |
| `longitude` | float | −71.19 – −71.00 | Maps to an x-scale. |
| `room_type` | **category** | `Entire home/apt` (3,014), `Private room` (1,666), `Hotel room` (97) | The **category**. **Unordered** — three values. |
| `price` | int | 8 – 1,995 (median 269) | Nightly price in USD. **Hundreds to ~2,000** — far larger than every other field. |
| `minimum_nights` | int | 1 – 300 (median 2) | Minimum nights a guest must book. |
| `number_of_reviews` | int | 0 – 1,098 (median 20) | All-time reviews. |
| `reviews_per_month` | float | 0 – 24.16 (median 0.93) | Review velocity — a proxy for how often it's booked. |
| `availability_365` | int | 1 – 365 (median 254) | Nights available in the next year. |
| `number_of_reviews_ltm` | int | 0 – 281 (median 4) | Reviews in the last twelve months. |

Every value loads as a **string**; convert the numeric columns to numbers, and keep
`room_type` (and `city`) as a **category**.

## Things worth knowing (they shape a perceptual critique)

- **`room_type` is categorical, not ordinal.** The three values are labels, not an order.
  Encode with a **categorical** palette (distinct hues), never a sequential light→dark
  ramp — a ramp implies a ranking that doesn't exist.
- **Three categories is where red-green palettes bite.** A naive 3-color palette often
  lands on red / green / blue — and red-vs-green is the classic color-vision-deficiency
  failure (~8% of men). Small category count, maximal accessibility lesson.
- **The three room types are lopsided.** `Entire home/apt` and `Private room` dominate;
  `Hotel room` is a small third group (97). A real, uneven category count — good practice.
- **`price` dwarfs everything.** It runs into the hundreds and low thousands while
  `reviews_per_month` is under 25. Don't co-encode fields of wildly different scale on one
  axis or one size scale — the small one flatlines. (Same trap as `proline` last labs.)
- **`price` is right-skewed.** Even after trimming, a few $2,000 listings sit far above a
  ~$270 median. Put `price` on **dot size** with a *linear* radius and the pricey listings
  scream — that's the Lab 3 size lie again; area (`scaleSqrt`), not radius.
- **It's clean by design.** No cleaning is required of you. This dataset is a *canvas for
  encoding decisions*, so the lab can be a pure test of perceptual judgment.

## Why this dataset for a critique lab

Three natural categories to (mis)encode, several magnitudes that tempt an agent into
piling color + size + shape onto one scatter, a small category count that makes the
colorblind-safety lesson unavoidable — and a topic students can actually reason about
(you know these neighborhoods). All with zero data-wrangling to distract from the real
skill: **looking at the rendered chart and naming what's wrong.**
