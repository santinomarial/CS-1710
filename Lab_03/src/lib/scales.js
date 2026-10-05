import * as d3 from 'd3';

export const MAX_RADIUS = 12;

// Sqrt on radius, domain and range anchored at 0, so circle area ∝ magnitude.
export const magRadius = d3.scaleSqrt().domain([0, 8.8]).range([0, MAX_RADIUS]);
