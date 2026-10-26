# Baseline encoding explanation

Source: src/lib/ListingScatter.svelte. Line numbers refer to the original Activity 3 baseline.

| Channel | Variable | Scale definition | Mark assignment | Explanation |
| --- | --- | --- | --- | --- |
| X-position | number_of_reviews | Lines 11-13 | Line 43: cx={x(listing.number_of_reviews)} | A linear scale maps total reviews from zero to the dataset maximum onto horizontal position, left to right. nice() rounds the domain endpoint for readable ticks. |
| Y-position | price | Lines 14-16 | Line 44: cy={y(listing.price)} | A linear scale maps nightly USD price onto vertical position. The reversed pixel range places higher prices higher on the chart. |
| Color | room_type | Lines 8-9 and 17 | Line 45: fill={color(listing.room_type)} | An ordinal scale maps Entire home/apt to blue (#1f77b4), Private room to orange (#ff7f0e), and Hotel room to green (#2ca02c). The legend uses the same scale at line 33. |
| Size | reviews_per_month | Lines 18-21 | Line 46: r={radius(listing.reviews_per_month)} | A square-root scale maps reviews per month to circle radii from 2 to 15 SVG units. The minimum keeps zero-review listings visible; because of this offset, area is not strictly proportional to the value. |

Svelte renders each data mark in the each block at lines 41-49. D3 selects only the dedicated axis groups at lines 25-26, never the circles. Opacity is a constant 0.65 at line 47, so it does not encode an additional variable.

The page loads the CSV inside onMount and converts the eight numeric columns. No rows are filtered. Browser inspection confirmed all 4,777 circles were rendered.
