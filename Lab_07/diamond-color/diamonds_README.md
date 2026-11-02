# Diamond prices, cut, colour & clarity (53,940 stones)

## Source

The canonical `diamonds` dataset — prices and attributes of round-cut diamonds, originally
scraped from a retail listing site and distributed with the R package **ggplot2** (Hadley
Wickham), where it is the standard large-N teaching dataset. Mirrored as CSV by the
**seaborn-data** repository: <https://github.com/mwaskom/seaborn-data>. Licence: the
ggplot2 package is MIT-licensed and the dataset ships with it.

> **Note for teaching staff.** Because it ships with ggplot2, any student who has used R
> may recognise this data. That's a fair trade for how cleanly it exposes the colour
> failure modes, but it's worth knowing.

## Size & format

One CSV, ~2.9 MB, **53,940 rows × 11 columns**. Every row is one stone. Ten columns are
original; `price_resid` is derived — see below.

## Schema

| Column | Meaning |
| --- | --- |
| `carat` | Weight, 0.20–5.01 |
| `cut` | Cut quality — **ordered**: `Fair` < `Good` < `Very Good` < `Premium` < `Ideal` |
| `color` | Colour grade — **ordered, and reverse-alphabetical**: `J` (worst) … `D` (best) |
| `clarity` | Clarity grade — **ordered**: `I1` (worst) < `SI2` < `SI1` < `VS2` < `VS1` < `VVS2` < `VVS1` < `IF` (best) |
| `depth` | Total depth as a % of diameter, 43.0–79.0 |
| `table` | Width of the top facet as a % of widest point, 43.0–95.0 |
| `price` | US dollars, 326–18,823 |
| `x`, `y`, `z` | Length, width, depth in mm |
| `price_resid` | **Derived.** Signed. See "The derived column" below. |

**The three grade columns are ordinal, not nominal.** That is the single most important
fact in this file. `cut`, `color`, and `clarity` are *ranked* quality scales, and neither
of the two most obvious orderings — alphabetical, or order-of-first-appearance — matches
the real one. `color` runs backwards alphabetically (D is best, J is worst) and `clarity`
is a set of trade abbreviations with no lexical order at all.

## The derived column (`price_resid`)

Price is dominated by size, which drowns out every other signal. `price_resid` removes
size by fitting, over all 53,940 rows:

```
log(price) = 8.448661 + 1.675817 * log(carat)
price_resid = log(price) - (8.448661 + 1.675817 * log(carat))
```

So it reads as **"how much more (or less) this stone costs than its weight predicts."**
Negative = cheaper than expected, positive = dearer, zero = exactly as predicted.

- Range **−1.5083 to +1.3379**, mean 0 by construction
- **27,496** below zero, **26,434** above
- It is *not* noise — it tracks clarity monotonically (table below)

The coefficients are reproducible from the shipped file, so students can re-derive the
column rather than take it on faith.

## What's actually in the file

**Counts.** `cut`: Fair 1,610 · Good 4,906 · Very Good 12,082 · Premium 13,791 · Ideal
21,551. `color`: D 6,775 · E 9,797 · F 9,542 · G 11,292 · H 8,304 · I 5,422 · J 2,808.
`clarity`: I1 741 · SI2 9,194 · SI1 13,065 · VS2 12,258 · VS1 8,171 · VVS2 5,066 ·
VVS1 3,655 · IF 1,790. Each sums to 53,940.

**Mean price** $3,932.80; total $212,135,217. **Mean carat** 0.7979.

**Clarity is what the price scatter is hiding.** Plot `carat` against `price` and you get
an undifferentiated cloud. Hold carat roughly constant (0.90–1.10, n = 10,331) and the
cloud resolves completely:

| clarity (worst → best) | n | mean price |
| --- | --: | --: |
| I1 | 222 | $2,686 |
| SI2 | 2,839 | $4,033 |
| SI1 | 3,094 | $4,666 |
| VS2 | 2,099 | $5,591 |
| VS1 | 1,152 | $6,154 |
| VVS2 | 566 | $8,050 |
| VVS1 | 215 | $8,364 |
| IF | 144 | $10,606 |

Same size, four times the price. Colouring the scatter by `clarity` makes that visible in
one step — which is the whole reason this dataset is here.

**The same pattern, stated robustly**, using the derived column over all rows:

| clarity | n | mean `price_resid` |
| --- | --: | --: |
| I1 | 741 | −0.662 |
| SI2 | 9,194 | −0.207 |
| SI1 | 13,065 | −0.095 |
| VS2 | 12,258 | +0.038 |
| VS1 | 8,171 | +0.077 |
| VVS2 | 5,066 | +0.211 |
| VVS1 | 3,655 | +0.241 |
| IF | 1,790 | +0.327 |

## Known data wrinkles (these matter for *judging*)

- **Better grades look cheaper.** Mean price by `cut` is **Fair $4,359 · Good $3,929 ·
  Very Good $3,982 · Premium $4,584 · Ideal $3,458** — the *worst* cut is nearly the
  dearest and the best is the cheapest. Mean price by `color` is worse: **D $3,170 →
  J $5,324**, a clean inversion of the actual quality order. Both are **carat
  confounding** — poorer-graded stones in this data tend to be larger, and size swamps
  everything. A chart that colours raw price by grade will state the opposite of the
  truth. Controlling for size (`price_resid`) is what makes the real ordering appear.
- **Twenty rows have a zero dimension** — `x`, `y`, or `z` recorded as `0`, which is
  physically impossible. They have valid `carat` and `price`, so they will silently sit
  at the origin of any dimension scatter.
- **Three rows have impossible dimensions**: one stone with `y` = 58.9 mm (a 2-carat
  diamond is about 8 mm across) and two with `z` = 31.8 mm. Almost certainly misplaced
  decimals or transposed fields. They will flatten the axes of any x/y/z plot.
- **`depth` and `table` are percentages, not millimetres** — despite `z` also being called
  "depth" in the trade. Different quantity, different units.
- **Price is a right-skewed dollar amount** spanning 326 to 18,823. Linear scales bunch
  almost everything at the bottom; the log relationship with carat is the one that
  actually holds.

## Story angles

- **What are you actually paying for?** Size versus the three quality grades — and which
  of them a buyer can most afford to compromise on.
- **The confounding trap.** Why better-graded diamonds appear cheaper, and what has to be
  held constant before any grade comparison means anything.
- **Bargain hunting.** Where `price_resid` is most negative — which combinations of grade
  are systematically under-priced relative to weight.
- **The market's rounding.** Carat clusters hard on round numbers (1.00, 1.50, 2.00) and
  prices jump across those thresholds.

## Cleaning notes

None applied. The file is shipped exactly as distributed, including all 23 physically
impossible rows, so the wrinkles above are genuinely present and have to be judged rather
than assumed away. All figures in this README were computed from the shipped file.

For hand-checkable verification there is a 20-row slice — `diamonds_slice20.csv`, with
`diamonds_slice20_ANSWERS.md`.

## Verdict

**STRONG** for a colour lab specifically. It is the rare dataset that is simultaneously
large enough that the scatter is a real cloud (53,940 points), carries **three ordinal
grade columns** that a categorical palette will silently destroy, has a clarity signal
that only becomes visible *through* colour, and ships a genuine signed quantity for the
diverging case. The grade-inversion trap gives the judging step real teeth: the naive
coloured chart doesn't just look wrong, it asserts the opposite of the truth.
