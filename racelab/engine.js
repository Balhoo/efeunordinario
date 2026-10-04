export const circuits = Object.freeze({
  costa: { name: 'Costa Azul', base: 82, wear: 1.0, pit: 23 },
  sierra: { name: 'Sierra Norte', base: 96, wear: 1.35, pit: 26 },
  valle: { name: 'Valle Central', base: 73, wear: 0.8, pit: 19 },
});
export const compounds = Object.freeze({
  soft: { name: 'Blando', pace: -1.3, life: 15 },
  medium: { name: 'Medio', pace: 0, life: 24 },
  hard: { name: 'Duro', pace: 0.8, life: 34 },
});
const climates = { cool: 0.9, mild: 1, hot: 1.2 };
function integer(value, min, max, label) {
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${label}: debe ser un entero entre ${min} y ${max}.`);
}
export function validate(config, strategy) {
  if (!config || !Object.hasOwn(circuits, config.circuit)) throw new Error('Circuito no válido.');
  integer(config.laps, 5, 100, 'Vueltas');
  if (!Object.hasOwn(climates, config.climate)) throw new Error('Temperatura no válida.');
  if (!strategy || !Object.hasOwn(compounds, strategy.start)) throw new Error('Neumático inicial no válido.');
  if (!Array.isArray(strategy.stops) || strategy.stops.length > 5) throw new Error('Máximo cinco paradas por estrategia.');
  let previous = 0;
  for (const stop of strategy.stops) {
    if (!stop || !Object.hasOwn(compounds, stop.compound)) throw new Error('Neumático de parada no válido.');
    integer(stop.lap, 1, config.laps - 1, 'Vuelta de parada');
    if (stop.lap <= previous) throw new Error('Las paradas deben tener vueltas únicas y estar ordenadas.');
    previous = stop.lap;
  }
}
export function simulate(config, strategy) {
  validate(config, strategy);
  const circuit = circuits[config.circuit];
  let compound = strategy.start, age = 0, total = 0;
  const rows = [];
  for (let lap = 1; lap <= config.laps; lap++) {
    const tyre = compounds[compound];
    const equivalentAge = age * circuit.wear * climates[config.climate];
    const wear = Math.min(100, (equivalentAge + circuit.wear * climates[config.climate]) / tyre.life * 100);
    const degradation = equivalentAge * 0.055 + Math.max(0, equivalentAge - tyre.life) ** 2 * 0.035;
    const fuel = (config.laps - lap) * 0.032;
    const pit = strategy.stops.find(stop => stop.lap === lap);
    const seconds = circuit.base + tyre.pace + degradation + fuel + (pit ? circuit.pit : 0);
    total += seconds;
    rows.push({ lap, compound, age: age + 1, wear, seconds, total, pit: Boolean(pit), next: pit?.compound ?? null });
    if (pit) { compound = pit.compound; age = 0; } else age++;
  }
  return { rows, total, stops: strategy.stops.length, highWear: rows.filter(row => row.wear >= 100).length };
}
export function compare(config, a, b) {
  const A = simulate(config, a), B = simulate(config, b);
  return { A, B, winner: Math.abs(A.total - B.total) < 0.000001 ? 'tie' : A.total < B.total ? 'A' : 'B', gap: Math.abs(A.total - B.total) };
}
export function parseStops(text) {
  if (!text.trim()) return [];
  return text.split(',').map(entry => {
    const match = entry.trim().match(/^(\d{1,3})\s*:\s*(soft|medium|hard)$/);
    if (!match) throw new Error('Formato de paradas: 12:medium, 25:hard. Usa soft, medium o hard.');
    return { lap: Number(match[1]), compound: match[2] };
  });
}
export function validateScenario(value) {
  if (!value || value.format !== 'racelab' || value.version !== 1) throw new Error('Escenario no compatible.');
  validate(value.config, value.A); validate(value.config, value.B);
  const strategy = s => ({ start: s.start, stops: s.stops.map(stop => ({ lap: stop.lap, compound: stop.compound })) });
  return { format: 'racelab', version: 1, config: { circuit: value.config.circuit, laps: value.config.laps, climate: value.config.climate }, A: strategy(value.A), B: strategy(value.B) };
}
export const defaultScenario = { format: 'racelab', version: 1, config: { circuit: 'costa', laps: 40, climate: 'mild' }, A: { start: 'medium', stops: [{ lap: 20, compound: 'hard' }] }, B: { start: 'soft', stops: [{ lap: 13, compound: 'medium' }, { lap: 27, compound: 'soft' }] } };
