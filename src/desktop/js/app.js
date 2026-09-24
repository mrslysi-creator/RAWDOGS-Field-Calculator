(function(){
'use strict';

const weapons=window.RAWDOGS_WEAPONS||{};
const engine=window.RAWDOGS_ENGINE;
if(!engine||!Object.keys(weapons).length){alert('RAWDOGS calculator files did not load correctly.');return}

const $=id=>document.getElementById(id);
const stage=$('stage'),shell=$('appShell'),drawer=$('oldDrawer'),folderTab=$('folderTab');
const teamModal=$('teamModal'),teamWarning=$('teamWarning');
const positionName=$('positionName'),positionX=$('positionX'),positionY=$('positionY');
const targetName=$('targetName'),targetX=$('targetX'),targetY=$('targetY');
const resultName=$('resultName'),bearingValue=$('bearingValue'),rangeValue=$('rangeValue'),outputValue=$('outputValue'),resultNote=$('resultNote');
const outputLabel=$('outputLabel'),secondaryOutputCell=$('secondaryOutputCell'),secondaryOutputLabel=$('secondaryOutputLabel'),secondaryOutputValue=$('secondaryOutputValue'),resultGrid=$('resultGrid');
const positionPanelTitle=$('positionPanelTitle'),dataBadge=$('dataBadge');
const calculateBtn=$('calculateBtn'),newTargetBtn=$('newTargetBtn');
const positionA=$('positionA'),positionB=$('positionB');
const weaponBtn=$('weaponBtn'),weaponMenu=$('weaponMenu');
const OLD_MAX=3,OLD_TTL=30*60*1000;

let activePosition='A';
let selectedTeam=sessionStorage.getItem('rawdogs_team')||'';
let activeWeaponId=localStorage.getItem('rawdogs_active_weapon_v2')||Object.values(weapons).find(w=>w.enabled)?.id||'';
let currentSolution=null;
let recalledOldId=null;
let weaponReady=false;

function readJSON(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return v??fallback}catch{return fallback}}
function writeJSON(key,v){localStorage.setItem(key,JSON.stringify(v))}
function currentWeapon(){return weapons[activeWeaponId]}
function positionsKey(){return 'rawdogs_positions_v2_'+activeWeaponId}
function clone(obj){return JSON.parse(JSON.stringify(obj))}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function relativeTime(ts){const m=Math.max(0,Math.floor((Date.now()-ts)/60000));return m<1?'Just now':m+' min ago'}

function getPositions(){
  const profile=currentWeapon();
  const defaults=clone(profile.defaultPositions||{A:{name:'Position A',x:'',y:''},B:{name:'Position B',x:'',y:''}});
  const stored=readJSON(positionsKey(),null);
  return stored?Object.assign(defaults,stored):defaults;
}
function savePosition(){
  const positions=getPositions();
  positions[activePosition]={name:positionName.value.trim(),x:positionX.value.trim(),y:positionY.value.trim()};
  writeJSON(positionsKey(),positions);
}
function loadPosition(){
  const profile=currentWeapon(),positions=getPositions();
  const p=positions[activePosition]||profile.defaultPositions?.[activePosition]||{name:'',x:'',y:''};
  positionName.value=p.name||'';positionX.value=p.x||'';positionY.value=p.y||'';
  positionA.classList.toggle('selected',activePosition==='A');
  positionB.classList.toggle('selected',activePosition==='B');
}

function renderWeaponMenu(){
  weaponMenu.innerHTML=Object.keys(weapons).map(id=>{
    const w=weapons[id],disabled=w.enabled?'':' disabled';
    const sub=w.enabled?('data v'+(w.dataVersion||'?')+(w.testedDate?' • tested '+w.testedDate:'')):'profile ready for future calibration';
    return `<button type="button" data-weapon="${id}"${disabled}>${escapeHtml(w.menuLabel||w.label)}<span class="weapon-sub">${escapeHtml(sub)}</span></button>`;
  }).join('');
  weaponMenu.querySelectorAll('button:not(:disabled)').forEach(btn=>btn.addEventListener('click',()=>{
    setActiveWeapon(btn.dataset.weapon);weaponMenu.classList.remove('open');weaponBtn.setAttribute('aria-expanded','false');
  }));
}

function setOutputMode(profile){
  const dual=profile.solverId==='dual-range-table-linear';
  outputLabel.textContent=profile.outputLabel||'OUTPUT';
  secondaryOutputLabel.textContent=profile.secondaryOutputLabel||'HIGH ARC MIL';
  secondaryOutputCell.classList.toggle('hidden',!dual);
  resultGrid.classList.toggle('has-secondary',dual);
}

function setActiveWeapon(id){
  const next=weapons[id];if(!next||!next.enabled)return;
  if(weaponReady&&activeWeaponId&&weapons[activeWeaponId])savePosition();
  activeWeaponId=id;localStorage.setItem('rawdogs_active_weapon_v2',id);
  activePosition='A';currentSolution=null;recalledOldId=null;
  weaponBtn.textContent='WEAPON: '+next.label+' ▼';
  positionPanelTitle.textContent=next.positionLabel||'Firing position — stays saved';
  positionA.textContent=(next.presetLabels&&next.presetLabels[0])||'A';
  positionB.textContent=(next.presetLabels&&next.presetLabels[1])||'B';
  dataBadge.textContent=next.label+' data v'+(next.dataVersion||'?')+(next.testedDate?' • '+next.testedDate:'');
  setOutputMode(next);loadPosition();clearResults('Enter a target');weaponReady=true;renderOldTargets();
}

function setTeam(team){
  selectedTeam=team;sessionStorage.setItem('rawdogs_team',team);shell.dataset.team=team;
  document.querySelectorAll('.team-btn').forEach(b=>b.classList.toggle('selected',b.dataset.team===team));
  teamWarning.textContent='YOU ARE '+team.toUpperCase()+' TEAM';teamWarning.classList.add('show');teamModal.classList.add('hidden');
}
document.querySelectorAll('.team-btn').forEach(b=>b.addEventListener('click',()=>setTeam(b.dataset.team)));
if(selectedTeam)setTeam(selectedTeam);else{shell.dataset.team='none';teamModal.classList.remove('hidden')}

positionA.addEventListener('click',()=>{savePosition();activePosition='A';loadPosition()});
positionB.addEventListener('click',()=>{savePosition();activePosition='B';loadPosition()});
[positionName,positionX,positionY].forEach(el=>el.addEventListener('change',savePosition));
weaponBtn.addEventListener('click',()=>{const open=!weaponMenu.classList.contains('open');weaponMenu.classList.toggle('open',open);weaponBtn.setAttribute('aria-expanded',String(open))});
document.addEventListener('click',e=>{if(!e.target.closest('.brand')){weaponMenu.classList.remove('open');weaponBtn.setAttribute('aria-expanded','false')}});
folderTab.addEventListener('click',()=>{const open=!stage.classList.contains('drawer-open');stage.classList.toggle('drawer-open',open);folderTab.setAttribute('aria-expanded',String(open));drawer.setAttribute('aria-hidden',String(!open));renderOldTargets()});

function solutionFromFields(){
  const profile=currentWeapon();
  const calc=engine.calculate(profile,{mx:positionX.value,my:positionY.value,tx:targetX.value,ty:targetY.value});
  if(calc.error)return calc;
  return Object.assign(calc,{
    id:null,name:targetName.value.trim()||'Unnamed target',
    positionName:positionName.value.trim()||((profile.presetLabels?.[activePosition==='A'?0:1])||('Position '+activePosition)),
    team:selectedTeam,weaponId:profile.id,weaponLabel:profile.label,outputLabel:profile.outputLabel||'OUTPUT',
    secondaryOutputLabel:profile.secondaryOutputLabel||'',time:Date.now()
  });
}
function sameTarget(a,b){return a&&b&&a.weaponId===b.weaponId&&Math.abs(a.tx-b.tx)<0.00001&&Math.abs(a.ty-b.ty)<0.00001&&a.positionName===b.positionName&&Math.abs(a.mx-b.mx)<0.00001&&Math.abs(a.my-b.my)<0.00001}
function archiveSolution(sol){
  if(!sol||!Number.isFinite(sol.range)||sol.hasSolution===false)return;
  let list=getOldTargets().filter(x=>!sameTarget(x,sol));
  list.unshift(Object.assign({},sol,{id:sol.id||('t'+Date.now()+Math.random().toString(16).slice(2))}));
  list=list.slice(0,OLD_MAX);writeJSON('rawdogs_old_targets_v2',list);renderOldTargets();
}
function migrateOldTarget(t){
  if(!t)return t;
  if(t.output===undefined&&t.mil!==undefined)t.output=t.mil;
  if(!t.outputLabel)t.outputLabel='MIL';
  if(!t.weaponId)t.weaponId=t.weapon||'L81';
  if(!t.weaponLabel)t.weaponLabel=(weapons[t.weaponId]||{}).label||t.weaponId;
  if(!t.positionName)t.positionName=t.mortarName||'Saved position';
  return t;
}
function getOldTargets(){
  const now=Date.now();let list=readJSON('rawdogs_old_targets_v2',[]).map(migrateOldTarget).filter(x=>x&&now-x.time<OLD_TTL);
  writeJSON('rawdogs_old_targets_v2',list);return list;
}
function oldSolutionText(t){
  if(Array.isArray(t.outputs)&&t.outputs.length){
    const low=t.outputs.find(o=>o.key==='low'),high=t.outputs.find(o=>o.key==='high');
    if(low||high){
      const parts=[];
      if(low&&Number.isFinite(Number(low.output)))parts.push('LOW ARC '+Math.round(Number(low.output)));
      if(high&&Number.isFinite(Number(high.output)))parts.push('HIGH ARC '+Math.round(Number(high.output)));
      return parts.join(' / ')+' MIL';
    }
  }
  return Number.isFinite(Number(t.output))?Math.round(Number(t.output))+' '+(t.outputLabel||''): '---';
}
function renderOldTargets(){
  const list=getOldTargets(),host=$('oldList');
  if(!list.length){host.innerHTML='<div class="old-empty">No old targets yet. Press NEW TARGET after a firing solution and it will be kept here for a while.</div>';return}
  host.innerHTML=list.map(t=>{
    const team=t.team?t.team.toUpperCase():'UNKNOWN TEAM';
    return `<div class="old-card ${recalledOldId===t.id?'recalled':''}">
      <div class="old-lamp-bezel" title="${recalledOldId===t.id?'This old target is currently recalled':'Stored old target — not currently applied'}"><div class="old-lamp"></div></div>
      <div class="old-card-name">${escapeHtml(t.name)}</div>
      <div class="old-meta">${String(Math.round(t.bearing)).padStart(3,'0')}° · ${Math.round(t.range)} m · ${escapeHtml(oldSolutionText(t))}</div>
      <div class="old-coords">X${Number(t.tx).toFixed(2)} / Y${Number(t.ty).toFixed(2)}</div>
      <div class="old-weapon">${escapeHtml(t.weaponLabel||t.weaponId)} • ${escapeHtml(team)}</div>
      <div class="old-time">${relativeTime(t.time)}</div>
      <button class="old-return" type="button" data-id="${escapeHtml(t.id)}">RETURN TO TARGET</button>
    </div>`;
  }).join('');
  host.querySelectorAll('.old-return').forEach(btn=>btn.addEventListener('click',()=>returnOldTarget(btn.dataset.id)));
}
function returnOldTarget(id){
  const t=getOldTargets().find(x=>x.id===id);if(!t)return;
  if(t.team&&selectedTeam&&t.team!==selectedTeam){
    const ok=window.confirm('This target was saved while you were '+t.team.toUpperCase()+' TEAM. You are currently '+selectedTeam.toUpperCase()+' TEAM.\n\nReturn to this target anyway?');
    if(!ok)return;
  }
  if(t.weaponId&&weapons[t.weaponId]?.enabled&&t.weaponId!==activeWeaponId)setActiveWeapon(t.weaponId);
  if(Number.isFinite(Number(t.mx))&&Number.isFinite(Number(t.my))){
    positionName.value=t.positionName||positionName.value;
    positionX.value=Number(t.mx).toFixed(2);positionY.value=Number(t.my).toFixed(2);savePosition();
  }
  targetName.value=t.name;targetX.value=Number(t.tx).toFixed(2);targetY.value=Number(t.ty).toFixed(2);
  recalledOldId=id;calculate(false);renderOldTargets();
  stage.classList.remove('drawer-open');folderTab.setAttribute('aria-expanded','false');drawer.setAttribute('aria-hidden','true');
}

function clearResults(name){
  resultName.textContent=name||'Enter a target';bearingValue.textContent='---';rangeValue.textContent='---';outputValue.textContent='---';secondaryOutputValue.textContent='---';
  resultNote.textContent='Firing position is preserved when you press NEW TARGET.';
}
function displayError(msg){resultName.textContent='Check input';bearingValue.textContent='---';rangeValue.textContent='---';outputValue.textContent='---';secondaryOutputValue.textContent='---';resultNote.textContent=msg}
function nearestText(sol){
  const n=sol.nearest||[];
  if(n.length!==2)return '';
  return n[0].range+' m / '+n[0].mil+' ↔ '+n[1].range+' m / '+n[1].mil;
}
function calculate(archivePrevious=true){
  if(!selectedTeam){teamModal.classList.remove('hidden');return}
  savePosition();const profile=currentWeapon(),sol=solutionFromFields();if(sol.error){displayError(sol.error);return}
  if(archivePrevious&&currentSolution&&!sameTarget(currentSolution,sol))archiveSolution(currentSolution);
  currentSolution=sol;
  resultName.textContent=sol.name;bearingValue.textContent=String(Math.round(sol.bearing)).padStart(3,'0')+'°';rangeValue.textContent=Math.round(sol.range)+' m';
  outputValue.textContent='---';secondaryOutputValue.textContent='---';

  if(sol.outsideCalibration||sol.hasSolution===false){
    outputValue.textContent='OUT';
    const min=Math.round(sol.calibrationMin),max=Math.round(sol.calibrationMax);
    resultNote.textContent='OUTSIDE CAPTURED '+profile.label+' SIGHT DATA — verified/calibrated span currently '+min+'–'+max+' m.';
    return;
  }

  if(profile.solverId==='dual-range-table-linear'){
    const low=sol.outputs.find(o=>o.key==='low'),high=sol.outputs.find(o=>o.key==='high');
    outputValue.textContent=low?String(Math.round(low.output)):'—';
    secondaryOutputValue.textContent=high?String(Math.round(high.output)):'—';
    if(low&&high){
      resultNote.textContent='LOW ARC = flatter/faster • HIGH ARC = steeper and useful for clearing buildings or terrain. Choose the solution that suits the line of fire.';
    }else if(high){
      resultNote.textContent='HIGH ARC solution only in the captured SPH-2 sight data at this range.';
    }else if(low){
      resultNote.textContent='LOW ARC solution only in the captured SPH-2 sight data at this range.';
    }
    return;
  }

  outputValue.textContent=Number.isFinite(sol.output)?String(Math.round(sol.output)):'---';
  const n=nearestText(sol);
  resultNote.textContent=(sol.verified?'Verified sight calibration. ':'Estimated between captured sight marks. ')+(n?'Nearest marks: '+n+'.':'');
}

calculateBtn.addEventListener('click',()=>calculate(true));
newTargetBtn.addEventListener('click',()=>{
  if(currentSolution)archiveSolution(currentSolution);
  currentSolution=null;recalledOldId=null;targetName.value='';targetX.value='';targetY.value='';
  resultName.textContent='New target';bearingValue.textContent='---';rangeValue.textContent='---';outputValue.textContent='---';secondaryOutputValue.textContent='---';resultNote.textContent='Firing position preserved.';
  renderOldTargets();targetX.focus();
});
[targetName,targetX,targetY].forEach(el=>el.addEventListener('input',()=>{if(recalledOldId!==null){recalledOldId=null;renderOldTargets()}}));
[targetName,targetX,targetY,positionName,positionX,positionY].forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();calculate(true)}}));

renderWeaponMenu();
if(!weapons[activeWeaponId]||!weapons[activeWeaponId].enabled)activeWeaponId=Object.values(weapons).find(w=>w.enabled)?.id||'';
setActiveWeapon(activeWeaponId);renderOldTargets();
})();
