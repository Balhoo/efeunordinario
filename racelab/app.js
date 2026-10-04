import { circuits, compounds, compare, parseStops, validateScenario, defaultScenario } from './engine.js';
const $ = selector => document.querySelector(selector);
const key = 'racelab.scenario.v1';
let result, scenario, baseline = localStorageSafeRead(), blocked = false;
function localStorageSafeRead() { try { return localStorage.getItem(key); } catch { return null; } }
function message(text) { $('#message').textContent = text; }
function fill(value) {
  $('#circuit').value = value.config.circuit; $('#laps').value = value.config.laps; $('#climate').value = value.config.climate;
  for (const id of ['a', 'b']) { const strategy = value[id.toUpperCase()]; $(`#${id}-start`).value = strategy.start; $(`#${id}-stops`).value = strategy.stops.map(s => `${s.lap}:${s.compound}`).join(', '); }
}
function read() {
  return validateScenario({ format: 'racelab', version: 1, config: { circuit: $('#circuit').value, laps: Number($('#laps').value), climate: $('#climate').value }, A: { start: $('#a-start').value, stops: parseStops($('#a-stops').value) }, B: { start: $('#b-start').value, stops: parseStops($('#b-stops').value) } });
}
function save(value) {
  try {
    if (blocked || localStorage.getItem(key) !== baseline) { blocked = true; message('No se sobrescribió el escenario: hay datos dañados o cambios en otra pestaña. Exporta primero o importa un respaldo conscientemente.'); return; }
    const serialized = JSON.stringify(value); localStorage.setItem(key, serialized); baseline = serialized; message('Simulación calculada y escenario guardado en este navegador.');
  } catch { message('Simulación calculada, pero no pudo guardarse. Exporta el escenario antes de cerrar.'); }
}
function format(seconds) { const milliseconds = Math.round(seconds * 1000); return `${Math.floor(milliseconds / 60000)}:${String(Math.floor(milliseconds / 1000) % 60).padStart(2, '0')}.${String(milliseconds % 1000).padStart(3, '0')}`; }
function element(tag, text, className) { const node = document.createElement(tag); node.textContent = text; if (className) node.className = className; return node; }
function render(value) {
  result = compare(value.config, value.A, value.B); scenario = value;
  const metrics = element('div', '', 'metrics');
  for (const id of ['A', 'B']) { const metric = element('div', '', `metric ${id.toLowerCase()}`); metric.append(element('small', `ESTRATEGIA ${id} / ${result[id].stops} PARADAS`), element('strong', format(result[id].total))); metrics.append(metric); }
  const winner = element('div', '', 'metric'); winner.append(element('small', result.winner === 'tie' ? 'MISMO RESULTADO' : `VENTAJA ${result.winner}`), element('strong', `${result.gap.toFixed(3)} s`)); metrics.append(winner); $('#summary').replaceChildren(metrics);
  const rows = document.createDocumentFragment();
  for (let i = 0; i < value.config.laps; i++) { const a = result.A.rows[i], b = result.B.rows[i], row = element('tr', '');
    for (const text of [a.lap, `${compounds[a.compound].name}${a.pit ? ' / PIT' : ''}`, format(a.seconds), `${a.wear.toFixed(1)}%`, `${compounds[b.compound].name}${b.pit ? ' / PIT' : ''}`, format(b.seconds), `${b.wear.toFixed(1)}%`, (a.total - b.total).toFixed(3)]) row.append(element('td', String(text)));
    rows.append(row);
  } $('#rows').replaceChildren(rows);
  $('#stints').replaceChildren();
  for (const id of ['A', 'B']) { $('#stints').append(element('p', `Plan ${id} · ${result[id].highWear} vueltas alcanzan o superan el 100% de desgaste nominal`, 'stint-label')); const bar = element('div', '', 'stints');
    const segments = [{ lap: 0, compound: value[id].start }, ...value[id].stops];
    segments.forEach((segment, i) => { const end = segments[i + 1]?.lap ?? value.config.laps; const label = element('span', `${segment.lap + 1}–${end}`, segment.compound); label.style.flexGrow = end - segment.lap; label.style.flexBasis = '0'; label.title = `${compounds[segment.compound].name}: vueltas ${segment.lap + 1} a ${end}`; bar.append(label); }); $('#stints').append(bar);
  }
  drawChart(result.A.rows.map((row, i) => row.total - result.B.rows[i].total));
}
function drawChart(deltas) {
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', '0 0 700 230'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Diferencia acumulada por vuelta. Los valores exactos se encuentran en la tabla de vueltas.');
  const limit = Math.max(1, ...deltas.map(Math.abs));
  const y = delta => 110 - delta / limit * 80;
  const line = document.createElementNS(ns, 'line'); for (const [name, value] of Object.entries({ x1: 45, x2: 680, y1: 110, y2: 110, stroke: '#647572', 'stroke-dasharray': '4 4' })) line.setAttribute(name, value); svg.append(line);
  for (const [text, x, yValue] of [[`+${limit.toFixed(1)} s`, 10, 22], ['0', 10, 115], [`−${limit.toFixed(1)} s`, 10, 210], ['Vuelta 1', 45, 225], [`Vuelta ${deltas.length}`, 595, 225]]) { const label = document.createElementNS(ns, 'text'); label.textContent = text; label.setAttribute('x', x); label.setAttribute('y', yValue); label.setAttribute('fill', '#b9c7c3'); label.setAttribute('font-size', '12'); svg.append(label); }
  const path = document.createElementNS(ns, 'polyline'); path.setAttribute('points', deltas.map((delta, i) => `${45 + i / (deltas.length - 1) * 635},${y(delta)}`).join(' ')); path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#d5ff53'); path.setAttribute('stroke-width', '2.5'); svg.append(path); $('#chart').replaceChildren(svg);
}
function download(text, filename, type) { const url = URL.createObjectURL(new Blob([text], { type })); const a = element('a', ''); a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); message('Descarga solicitada al navegador. Revisa Descargas o su diálogo de guardado.'); }
$('#setup').addEventListener('submit', event => { event.preventDefault(); try { const value = read(); render(value); save(value); } catch (error) { message(error.message); } });
$('#reset').addEventListener('click', () => { fill(defaultScenario); render(defaultScenario); save(defaultScenario); });
$('#export').addEventListener('click', () => { try { download(JSON.stringify(read(), null, 2), 'racelab-escenario.json', 'application/json'); } catch (error) { message(error.message); } });
$('#csv').addEventListener('click', () => { const rows = [['vuelta','compuesto_A','segundos_A','desgaste_A','compuesto_B','segundos_B','desgaste_B','delta_acumulado']]; result.A.rows.forEach((a, i) => { const b = result.B.rows[i]; rows.push([a.lap,a.compound,a.seconds.toFixed(3),a.wear.toFixed(2),b.compound,b.seconds.toFixed(3),b.wear.toFixed(2),(a.total-b.total).toFixed(3)]); }); download('\ufeff' + rows.map(row => row.join(',')).join('\r\n'), 'racelab-resultados.csv', 'text/csv;charset=utf-8'); });
$('#import').addEventListener('change', async event => {
  const input = event.target, file = input.files?.[0]; if (!file) return;
  const controls = [...document.querySelectorAll('button, input, select')];
  controls.forEach(control => { control.disabled = true; });
  try { if (file.size > 100_000) throw new Error('El escenario supera 100 KB.'); const value = validateScenario(JSON.parse(await file.text())); if (!confirm('¿Reemplazar la configuración actual? Exporta primero si quieres conservarla.')) return;
    const serialized = JSON.stringify(value); localStorage.setItem(key, serialized); baseline = serialized; blocked = false; fill(value); render(value); message('Escenario importado y guardado.');
  } catch (error) { message(`No se importó: ${error.message}`); } finally { input.value = ''; controls.forEach(control => { control.disabled = false; }); }
});
window.addEventListener('storage', event => { if (event.key === key || event.key === null) { blocked = true; message('Otra pestaña cambió el escenario. No sobrescribiremos sus datos; exporta tu configuración o recarga.'); } });
try { scenario = baseline ? validateScenario(JSON.parse(baseline)) : defaultScenario; } catch { scenario = defaultScenario; blocked = true; message('El escenario guardado no es válido. Se muestra el ejemplo sin sobrescribir tus datos.'); }
fill(scenario); render(scenario);
