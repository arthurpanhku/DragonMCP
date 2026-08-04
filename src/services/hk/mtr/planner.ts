import { MTR_LINES } from './constants.js';
import { RouteLeg } from './types.js';

/**
 * Route planning over the MTR network.
 *
 * Each line is a tree (a main sequence plus optional branches), so the path
 * between any two stations on one line is unique. Across lines we run Dijkstra
 * over (station, line) states with a transfer cost large enough to dominate any
 * possible stop count, which makes the search minimise transfers first and
 * stops second.
 *
 * Caveat worth repeating wherever this is surfaced: fewest transfers is not the
 * same as fastest. We have no inter-station running times, so we do not claim to
 * optimise for time.
 */

// Larger than the longest possible stop count on the network.
const TRANSFER_COST = 10_000;

interface LineGraph {
    adj: Map<string, string[]>;
    /** Hops to the DOWN terminus, used to derive travel direction. */
    distToDown: Map<string, number>;
}

const lineGraphs = new Map<string, LineGraph>();
const stationLines = new Map<string, string[]>();

function connect(adj: Map<string, string[]>, a: string, b: string): void {
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a)!.push(b);
    adj.get(b)!.push(a);
}

function bfsDistances(adj: Map<string, string[]>, source: string): Map<string, number> {
    const dist = new Map<string, number>([[source, 0]]);
    const queue = [source];

    for (let head = 0; head < queue.length; head++) {
        const current = queue[head];
        for (const next of adj.get(current) ?? []) {
            if (!dist.has(next)) {
                dist.set(next, dist.get(current)! + 1);
                queue.push(next);
            }
        }
    }

    return dist;
}

function buildIndex(): void {
    for (const [lineCode, line] of Object.entries(MTR_LINES)) {
        const adj = new Map<string, string[]>();

        for (let i = 0; i < line.stations.length; i++) {
            const station = line.stations[i];
            if (!adj.has(station)) adj.set(station, []);
            if (i > 0) connect(adj, line.stations[i - 1], station);
        }

        for (const branch of line.branches ?? []) {
            let previous = branch.junction;
            for (const station of branch.stations) {
                connect(adj, previous, station);
                previous = station;
            }
        }

        lineGraphs.set(lineCode, { adj, distToDown: bfsDistances(adj, line.downDest) });

        for (const station of adj.keys()) {
            if (!stationLines.has(station)) stationLines.set(station, []);
            stationLines.get(station)!.push(lineCode);
        }
    }
}

buildIndex();

/** Lines serving a station. Empty if the station is unknown. */
export function linesForStation(station: string): string[] {
    return stationLines.get(station) ?? [];
}

/** Every station that more than one line serves — the real interchanges. */
export function interchangeStations(): string[] {
    return [...stationLines.entries()].filter(([, lines]) => lines.length > 1).map(([station]) => station);
}

/** The unique path between two stations on one line, inclusive of both ends. */
function pathOnLine(lineCode: string, from: string, to: string): string[] | null {
    const { adj } = lineGraphs.get(lineCode)!;
    if (!adj.has(from) || !adj.has(to)) return null;
    if (from === to) return [from];

    const previous = new Map<string, string>([[from, from]]);
    const queue = [from];

    for (let head = 0; head < queue.length; head++) {
        const current = queue[head];
        if (current === to) break;
        for (const next of adj.get(current) ?? []) {
            if (!previous.has(next)) {
                previous.set(next, current);
                queue.push(next);
            }
        }
    }

    if (!previous.has(to)) return null;

    const path = [to];
    while (path[0] !== from) path.unshift(previous.get(path[0])!);
    return path;
}

/**
 * Where a train serving this leg can terminate: every leaf reachable from the
 * alighting station while continuing away from the boarding station. Returns
 * more than one entry where the line splits ahead (East Rail past Sheung Shui),
 * which is exactly what platform signage shows.
 */
function terminiFor(lineCode: string, from: string, to: string): string[] {
    const { adj } = lineGraphs.get(lineCode)!;
    const path = pathOnLine(lineCode, from, to);
    const cameFrom = path && path.length > 1 ? path[path.length - 2] : null;

    const termini: string[] = [];
    const seen = new Set<string>(cameFrom ? [cameFrom] : []);
    const stack = [to];
    seen.add(to);

    while (stack.length > 0) {
        const current = stack.pop()!;
        const onward = (adj.get(current) ?? []).filter((next) => !seen.has(next));

        // Nothing further in this direction, so the train terminates here.
        if (onward.length === 0) termini.push(current);

        for (const next of onward) {
            seen.add(next);
            stack.push(next);
        }
    }

    return termini.length > 0 ? termini : [to];
}

/**
 * Plan a journey, minimising transfers and then stops.
 * Returns null when either station is unknown to the network.
 */
export function planRoute(from: string, to: string): RouteLeg[] | null {
    if (!stationLines.has(from) || !stationLines.has(to)) return null;
    if (from === to) return [];

    const key = (station: string, line: string) => `${station}|${line}`;
    const distance = new Map<string, number>();
    const previous = new Map<string, string>();

    for (const line of stationLines.get(from)!) {
        distance.set(key(from, line), 0);
    }

    const settled = new Set<string>();
    let goal: string | null = null;

    for (;;) {
        let current: string | null = null;
        let best = Infinity;
        for (const [node, cost] of distance) {
            if (!settled.has(node) && cost < best) {
                best = cost;
                current = node;
            }
        }
        if (current === null) break;

        settled.add(current);
        const [station, line] = current.split('|');

        if (station === to) {
            goal = current;
            break;
        }

        for (const next of lineGraphs.get(line)!.adj.get(station) ?? []) {
            const node = key(next, line);
            if (best + 1 < (distance.get(node) ?? Infinity)) {
                distance.set(node, best + 1);
                previous.set(node, current);
            }
        }

        for (const otherLine of stationLines.get(station)!) {
            if (otherLine === line) continue;
            const node = key(station, otherLine);
            if (best + TRANSFER_COST < (distance.get(node) ?? Infinity)) {
                distance.set(node, best + TRANSFER_COST);
                previous.set(node, current);
            }
        }
    }

    if (goal === null) return null;

    const nodes: string[] = [goal];
    while (previous.has(nodes[0])) nodes.unshift(previous.get(nodes[0])!);

    // Group consecutive nodes sharing a line into legs.
    const legs: RouteLeg[] = [];
    let runStart = 0;

    for (let i = 1; i <= nodes.length; i++) {
        const sameLine = i < nodes.length && nodes[i].split('|')[1] === nodes[runStart].split('|')[1];
        if (sameLine) continue;

        const [startStation, line] = nodes[runStart].split('|');
        const endStation = nodes[i - 1].split('|')[0];

        if (startStation !== endStation) {
            const graph = lineGraphs.get(line)!;
            const isUp = graph.distToDown.get(endStation)! > graph.distToDown.get(startStation)!;
            legs.push({
                line,
                direction: isUp ? 'UP' : 'DOWN',
                from: startStation,
                to: endStation,
                stops: i - 1 - runStart,
                termini: terminiFor(line, startStation, endStation),
            });
        }

        runStart = i;
    }

    return legs;
}
