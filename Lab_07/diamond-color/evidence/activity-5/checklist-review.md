# Design Critique Checklist sections 1–7

Assistant review of code and rendered screenshots. The student must still perform their own review and compare observations. No peer review is claimed.

## 1. Truthful and readable
Scatter is appropriate for the price/weight relationship. All 53,940 rows are plotted, with numeric conversion and unchanged CSV. Titles, units, source, legend, and mode caption are present. Build and browser checks pass. Limitation: overlap hides individual records, so broad distributions are more readable than exact point comparisons.

## 2. Comparing views
Both encodings reuse one component, dataset, axes, radius, and opacity; the deliberate change is color and its legend. This is not a new pair of student sketches. Clarity examines ordered grade associations; residual examines deviations from a weight model. Known dataset values were rechecked with the verification script. They answer related but different questions.

## 3. Encoding and channels
X=carat, Y=price; color=clarity or price_resid. Circle shape and radius 2 are constant, not quantitative size encodings; area-scale requirements do not apply. Linear position carries the main quantitative comparison. SVG Y range is reversed appropriately. Grade color uses explicit ranks. Residual uses a signed symmetric diverging domain. Svelte each creates one circle per record. Axes encompass the data. Lightness of overlapping marks also reflects density, a limitation when reading color magnitude.

## 4. Interaction and coordination
One mode $state controls the selected button, explanatory caption, component color mapping, and legend. Controls are semantic buttons with visible selected/focus styles. Mouse activation and Enter/Space were checked. No filtering or aggregate recomputation occurs; each mode still has 53,940 circles. Native tooltips reveal exposed record values but do not offer full keyboard record navigation. Brushing, linked selections, filtered KPIs, and reset filters are not applicable.

## 5. Story and annotation
This is an exploratory two-view chart, not scrollytelling; sticky scenes are not applicable. One view per mode, clearly labeled reframing. Captions avoid causal claims. The residual reference curve is derived from the supplied model coefficients and labeled predicted price. The title names the topic rather than asserting an unsupported finding. Student narrative/reflection remains unwritten.

## 6. Perception and critique
Position supports price/weight comparisons. Color supplies only the requested additional variable. The darkest density regions attract attention, not necessarily the most exceptional grade. Both color-vision simulations and greyscale were rendered and inspected. Clarity ordering survives broadly, but eight individual grades cannot reliably be separated in dense areas. Residual sign survives the two color-vision simulations broadly; a prediction curve was added because hue alone loses sign under greyscale. Faint neutral points and occlusion remain. Text meets 4.5:1 numerically. Do not call the entire chart fully accessible or claim the student found a failure independently.

## 7. Color and colormaps
Clarity is ordinal and sequential; grades follow the real rank order. Residual is signed, uses a diverging PuOr interpolator, and anchors the neutral exactly at zero with [-1.5083,0,1.5083]. No rainbow. Equal rank steps are not a claim of equal quality differences. Raw skewed price is not used for color; the supplied log-price residual is labeled explicitly. Legends have ranks, direction, units, zero where applicable, and readable contrast. Category capacity and overlap remain limitations. Tooltips and the zero-reference curve provide supplementary information; neither resolves every obscured point. Residual adjusts for carat only, not all grade variables or causal effects.

## Actions and remaining work
Implemented: correct intended residual hue direction; add a zero-residual reference curve after the greyscale check; retain clear view labels and semantic controls. No unrelated redesign or optional stretch goal.

Manual: student reviews both views with the same checklist; a real tablemate answers the prompts in tablemate-feedback.md. Decide whether their findings justify further revisions. The seven process-book answers have not been started.
