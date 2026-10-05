/** Bar with rounded ends at the top only, anchored flat to the baseline. */
export function topRoundedBar(x, y, width, height, radius) {
	const r = Math.max(0, Math.min(radius, width / 2, height));
	if (height <= 0) return '';
	return `M${x},${y + height}V${y + r}a${r},${r} 0 0 1 ${r},${-r}h${width - 2 * r}a${r},${r} 0 0 1 ${r},${r}V${y + height}Z`;
}

/** Bar with rounded ends on the right only, anchored flat to the left axis. */
export function rightRoundedBar(x, y, width, height, radius) {
	const r = Math.max(0, Math.min(radius, height / 2, width));
	if (width <= 0) return '';
	return `M${x},${y}h${width - r}a${r},${r} 0 0 1 ${r},${r}v${height - 2 * r}a${r},${r} 0 0 1 ${-r},${r}h${-(width - r)}Z`;
}
