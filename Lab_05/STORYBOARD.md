# U.S. Road Deaths: Why the Measure Matters

Seven scenes, Freytag structure. Scene 1 establishes the chart; each later scene makes exactly one visual change.
State lives in `+page.svelte` as `step`; `measure`, `xDomain`, and `highlightedYear` are derived from it.
`xDomain: null` means the full 1975–2024 range. `highlightedYear: null` means no highlight. `annotatedYear` is `null` in every scene except Scene 6.

| Scene | Stage | `measure` | `xDomain` | `highlightedYear` | The one change |
| --- | --- | --- | --- | --- | --- |
| 1 | Exposition | fatalities | null | null | — (establish chart) |
| 2 | Rising action | fatalities | null | 1979 | highlight appears on 1979 |
| 3 | Rising action | fatalities | null | 2011 | highlight moves to 2011 |
| 4 | Rising action | fatalities | null | 2024 | highlight moves to 2024 |
| 5 | Climax | rate_per_100m_vmt | null | 2024 | measure switches to rate |
| 6 | Falling action | rate_per_100m_vmt | [2019, 2024] | 2024 | x-domain zooms to 2019–2024 (with its 2020 annotation) |
| 7 | Resolution | rate_per_100m_vmt | null | 2024 | x-domain restored to 1975–2024 |

---

## Scene 1 — Exposition

- **Graphic state:** `measure: "fatalities"`, `xDomain: null`, `highlightedYear: null`
- **Claim:** Annual U.S. road deaths fluctuated over the period.
- **Visual change:** Establish the full fatalities chart.

**Narration:**
Every year, tens of thousands of people die on American roads. This chart shows the total number of road deaths each year from 1975 to 2024. The line does not move in one direction: it climbs, falls, and climbs again, ranging between about 32,000 and 51,000 deaths a year. The 2024 figure is preliminary.

---

## Scene 2 — Rising Action

- **Graphic state:** `measure: "fatalities"`, `xDomain: null`, `highlightedYear: 1979`
- **Claim:** Annual fatalities peaked at 51,093 in 1979.
- **Visual change:** Highlight 1979.

**Narration:**
The highest count came in 1979, when 51,093 people died in traffic crashes, the most of any year in this dataset. 1980 was nearly identical, at 51,091. Keep in mind that this is a raw count of deaths: it tells us how many people died, not how risky each mile of driving was.

---

## Scene 3 — Rising Action

- **Graphic state:** `measure: "fatalities"`, `xDomain: null`, `highlightedYear: 2011`
- **Claim:** Fatalities reached the dataset's lowest annual count of 32,479 in 2011.
- **Visual change:** Move the highlight to 2011.

**Narration:**
Three decades later, the count reached its lowest point. In 2011, 32,479 people died on U.S. roads, about 18,600 fewer than in 1979. But the low did not last. Deaths rose again in later years, and the preliminary 2024 count of 39,254 sits well above the 2011 low.

---

## Scene 4 — Rising Action

- **Graphic state:** `measure: "fatalities"`, `xDomain: null`, `highlightedYear: 2024`
- **Claim:** The preliminary 2024 count of 39,254 is about 12% below the 1975 count of 44,525.
- **Visual change:** Move the highlight to 2024.

**Narration:**
Compare the two ends of the line. In 1975, 44,525 people died on U.S. roads; in 2024, the preliminary count was 39,254. That is about 12% fewer deaths across the fifty years of data: a real decline, but a modest one, and the path between those years was far from steady.

---

## Scene 5 — Climax

- **Graphic state:** `measure: "rate_per_100m_vmt"`, `xDomain: null`, `highlightedYear: 2024`
- **Claim:** The fatality rate declined from 3.35 in 1975 to 1.19 in preliminary 2024 data, a much larger proportional decline than the total number of fatalities.
- **Visual change:** Switch from the fatalities count to the fatality rate. The 2024 highlight is kept, so it now marks the endpoint of the rate comparison.

**Narration:**
Now look at the same years through a different measure: deaths per 100 million vehicle-miles traveled, which accounts for how much Americans drove. This rate fell from 3.35 in 1975 to 1.19 in preliminary 2024 data, a drop of about 64%, far steeper than the 12% decline in total deaths.

---

## Scene 6 — Falling Action

- **Graphic state:** `measure: "rate_per_100m_vmt"`, `xDomain: [2019, 2024]`, `highlightedYear: 2024`, `annotatedYear: 2020`
- **Claim:** The rate increased from 1.11 in 2019 to 1.34 in 2020, then fluctuated before reaching 1.19 in preliminary 2024 data.
- **Visual change:** Zoom to 2019–2024. The 2024 highlight is inside the zoomed range, so it stays visible. (The chart still hides any highlight outside the visible x-domain without modifying `highlightedYear`.)
- **Annotation (stretch goal):** The 2020 point carries a small label, "2020: 1.34 / Up 0.23 from 1.11 in 2019", computed from the CSV. It exists only in this scene and is part of the zoomed detail view: it enters with the zoom and leaves with it, and is not an independent change of measure, range, or highlight. Scene 7 restores the full range and removes the label in the same transition.

**Narration:**
The decline was not steady. In 2020, vehicle-miles traveled fell about 11% from 2019, yet road deaths rose about 7%, from 36,355 to 39,007. Fewer miles and more deaths pushed the rate from 1.11 to 1.34 deaths per 100 million vehicle-miles, its sharpest one-year rise in this dataset. It reached 1.38 in 2021, then eased to a preliminary 1.19 in 2024.

---

## Scene 7 — Resolution

- **Graphic state:** `measure: "rate_per_100m_vmt"`, `xDomain: null`, `highlightedYear: 2024`
- **Claim:** The long-term rate declined substantially, despite increases in individual years.
- **Visual change:** Restore the full x-domain.

**Narration:**
Step back to the full fifty years and the long-term pattern is clear. The death rate per mile driven fell by roughly two-thirds, even though it rose in ten individual years, including 2020 and 2021. Total deaths tell a more uneven story. Which measure we choose shapes the story we tell.

---

## Revision notes

- Earlier six-scene draft kept a 2011 highlight on the rate chart (old Scenes 4–6). 2011 is the lowest *count* but not the lowest *rate* (2014, 1.08), and it was unrelated to the 1975-vs-2024 rate claim. It was also hidden by the 2019–2024 zoom and reappeared on restore, so the final transition looked like two changes.
- Fix: new Scene 4 moves the highlight to 2024 while still on the count chart, and states the count comparison that was previously the last sentence of the rate scene. The measure switch (Scene 5) then keeps a highlight that is relevant to both measures, and 2024 stays visible through the zoom and restore.

- Claim audit (see `CLAIM_AUDIT.md`): Scene 6 narration reported only the rate jump for 2020. It now also states that vehicle-miles fell ~11% while deaths rose ~7%, so all three 2020 movements are shown. Scene 6 also gained the 2020 annotation (stretch goal).

## Verified figures (from `static/us_road_deaths_by_year.csv`)

| Year | Fatalities | Rate per 100M VMT | Note |
| --- | --- | --- | --- |
| 1975 | 44,525 | 3.35 | Ties 1980 for highest rate |
| 1979 | 51,093 | 3.34 | Highest count |
| 1980 | 51,091 | 3.35 | Ties 1975 for highest rate |
| 2011 | 32,479 | 1.10 | Lowest count (lowest rate is 2014, 1.08) |
| 2019 | 36,355 | 1.11 | |
| 2020 | 39,007 | 1.34 | +0.23, largest one-year rate increase; VMT 2,903.6 B (−10.98% vs. 2019's 3,261.8 B); deaths +7.29% |
| 2021 | 43,230 | 1.38 | |
| 2022 | 42,721 | 1.34 | |
| 2023 | 41,025 | 1.26 | |
| 2024 | 39,254 | 1.19 | Preliminary (Annual Report File, not Final) |

- 1975 → 2024: rate −64.5%; fatalities −11.8% (5,271 fewer deaths).
- Years the rate rose over the prior year: 1977, 1979, 1980, 1986, 2005, 2012, 2015, 2016, 2020, 2021 (10 years).
