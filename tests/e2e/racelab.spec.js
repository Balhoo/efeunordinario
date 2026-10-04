import {test,expect} from '@playwright/test';
test('efeuno opens its bundled simulator and returns without page errors',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/#racelab');
  await page.getByRole('link',{name:'Abrir simulador RaceLab',exact:true}).click();
  await expect(page.getByText('34.115 s',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Simular estrategias →',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('escenario guardado');
  await page.getByRole('link',{name:'← VOLVER A EFEUNO',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Del aficionado al muro de boxes.',exact:true})).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
});
test('mobile navigation closes with Escape and author page links to RaceLab',async({page},testInfo)=>{
  await page.goto('/');
  if(testInfo.project.name==='mobile'){
    await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
    await expect(page.getByRole('button',{name:'Cerrar menú',exact:true})).toHaveAttribute('aria-expanded','true');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button',{name:'Abrir menú',exact:true})).toHaveAttribute('aria-expanded','false');
  }
  await page.goto('/aboutme.html');
  if(testInfo.project.name==='mobile')await page.getByRole('button',{name:'Abrir menú',exact:true}).click();
  await page.getByRole('link',{name:'RACELAB',exact:true}).click();
  await expect(page.getByRole('heading',{name:'02 / Telemetría comparada',exact:true})).toBeVisible();
});
