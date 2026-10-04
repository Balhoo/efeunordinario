import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compare, defaultScenario } from '../racelab/engine.js';
test('efeuno links to a bundled RaceLab with a return route',async()=>{const home=await readFile(new URL('../index.html',import.meta.url),'utf8');const race=await readFile(new URL('../racelab/index.html',import.meta.url),'utf8');assert.ok(home.includes('href="racelab/"'));assert.ok(home.includes('id="racelab"'));assert.ok(race.includes('href="../index.html#racelab"'));});
test('bundled race engine reproduces the checked reference scenario',()=>{const result=compare(defaultScenario.config,defaultScenario.A,defaultScenario.B);assert.equal(result.winner,'B');assert.equal(result.gap.toFixed(3),'34.115');});
test('mobile controls are keyboard buttons on both pages',async()=>{for(const filename of ['index.html','aboutme.html']){const html=await readFile(new URL('../'+filename,import.meta.url),'utf8');assert.ok(html.includes('aria-label="Abrir menú"'));assert.ok(html.includes('aria-controls="navbar"'));assert.ok(!html.includes('<i class="mobile-nav-toggle'));}});
test('historical context and original rights are explicit',async()=>{const html=await readFile(new URL('../index.html',import.meta.url),'utf8');assert.ok(html.includes('ARCHIVO 2023'));assert.ok(html.includes('No usa telemetría real'));assert.ok(html.includes('Alan Berra Garcia'));});
