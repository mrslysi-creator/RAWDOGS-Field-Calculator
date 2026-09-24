(function(){
'use strict';

const weapons=window.RAWDOGS_WEAPONS||{}, engine=window.RAWDOGS_ENGINE;
if(!engine||!Object.keys(weapons).length){alert('RAWDOGS calculator files did not load correctly.');return}
const $=id=>document.getElementById(id);
const app=$('app'),mainView=$('mainView'),oldView=$('oldView'),folderTab=$('folderTab'),teamModal=$('teamModal');
const positionName=$('positionName'),positionX=$('positionX'),positionY=$('positionY');
const targetName=$('targetName'),targetX=$('targetX'),targetY=$('targetY');
const bearingValue=$('bearingValue'),rangeValue=$('rangeValue'),outputValue=$('outputValue'),secondaryValue=$('secondaryValue');
const outputLabel=$('outputLabel'),secondaryLabel=$('secondaryLabel'),secondaryCell=$('secondaryCell'),resultGrid=$('resultGrid');
const resultName=$('resultName'),resultNote=$('resultNote'),dataBadge=$('dataBadge'),positionTitle=$('positionTitle');
const positionA=$('positionA'),positionB=$('positionB'),weaponBtn=$('weaponBtn'),weaponMenu=$('weaponMenu');
const OLD_MAX=5,OLD_TTL=30*60*1000;

let activePosition='A';
let selectedTeam=sessionStorage.getItem('rawdogs_team')||'';
let activeWeaponId=localStorage.getItem('rawdogs_active_weapon_v2')||Object.values(weapons).find(w=>w.enabled)?.id||'';
let currentSolution=null,recalledOldId=null,weaponReady=false,oldOpen=false;

const readJSON=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??f}catch{return f}};
const writeJSON=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const clone=o=>JSON.parse(JSON.stringify(o));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const currentWeapon=()=>weapons[activeWeaponId];
const positionsKey=()=>`rawdogs_positions_v2_${activeWeaponId}`;
const relativeTime=ts=>{const m=Math.max(0,Math.floor((Date.now()-ts)/60000));return m<1?'Just now':`${m} min ago`};

function getPositions(){
  const p=currentWeapon(),defaults=clone(p.defaultPositions||{A:{name:'Position A',x:'',y:''},B:{name:'Position B',x:'',y:''}});
  return Object.assign(defaults,readJSON(positionsKey(),{})||{});
}
function savePosition(){
  if(!currentWeapon())return;
  const positions=getPositions();
  positions[activePosition]={name:positionName.value.trim(),x:positionX.value.trim(),y:positionY.value.trim()};
  writeJSON(positionsKey(),positions);
}
function loadPosition(){
  const p=getPositions()[activePosition]||{name:'',x:'',y:''};
  positionName.value=p.name||'';positionX.value=p.x||'';positionY.value=p.y||'';
  positionA.classList.toggle('selected',activePosition==='A');positionB.classList.toggle('selected',activePosition==='B');
}
function setTeam(team){
  selectedTeam=team;sessionStorage.setItem('rawdogs_team',team);app.dataset.team=team;
  document.querySelectorAll('.team-btn').forEach(b=>b.classList.toggle('selected',b.dataset.team===team));
  teamModal.classList.add('hidden');
}
document.querySelectorAll('.team-btn').forEach(b=>b.addEventListener('click',()=>setTeam(b.dataset.team)));
if(selectedTeam)setTeam(selectedTeam);else teamModal.classList.remove('hidden');

function renderWeaponMenu(){
  weaponMenu.innerHTML=Object.values(weapons).map(w=>`<button type="button" data-weapon="${esc(w.id)}">${esc(w.menuLabel||w.label)}<span class="weapon-sub">data v${esc(w.dataVersion||'?')}${w.testedDate?' • tested '+esc(w.testedDate):''}</span></button>`).join('');
  weaponMenu.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{setActiveWeapon(b.dataset.weapon);weaponMenu.classList.remove('open')}));
}
function setActiveWeapon(id){
  const next=weapons[id];if(!next||!next.enabled)return;
  if(weaponReady)savePosition();
  activeWeaponId=id;localStorage.setItem('rawdogs_active_weapon_v2',id);activePosition='A';currentSolution=null;recalledOldId=null;
  weaponBtn.textContent=`WEAPON: ${next.label} ▼`;
  positionTitle.textContent=next.positionLabel?.replace(' — stays saved','')||'Firing position';
  positionA.textContent=(next.presetLabels?.[0]||'A').replace(/MORTAR |SPA /,'');
  positionB.textContent=(next.presetLabels?.[1]||'B').replace(/MORTAR |SPA /,'');
  outputLabel.textContent=next.outputLabel||'MIL';secondaryLabel.textContent=next.secondaryOutputLabel||'HIGH ARC MIL';
  const dual=next.solverId==='dual-range-table-linear';secondaryCell.classList.toggle('hidden',!dual);resultGrid.classList.toggle('dual',dual);
  dataBadge.textContent=`${next.label} data v${next.dataVersion||'?'}`;
  loadPosition();clearResults('Enter a target');weaponReady=true;renderOldTargets();
}
weaponBtn.addEventListener('click',()=>weaponMenu.classList.toggle('open'));
document.addEventListener('click',e=>{if(!e.target.closest('.weapon-wrap'))weaponMenu.classList.remove('open')});
positionA.addEventListener('click',()=>{savePosition();activePosition='A';loadPosition()});
positionB.addEventListener('click',()=>{savePosition();activePosition='B';loadPosition()});
[positionName,positionX,positionY].forEach(el=>el.addEventListener('change',savePosition));

function solutionFromFields(){
  const profile=currentWeapon();
  const calc=engine.calculate(profile,{mx:positionX.value,my:positionY.value,tx:targetX.value,ty:targetY.value});
  if(calc.error)return calc;
  return Object.assign(calc,{
    id:null,name:targetName.value.trim()||'Unnamed target',positionName:positionName.value.trim()||'Saved position',
    team:selectedTeam,weaponId:profile.id,weaponLabel:profile.label,outputLabel:profile.outputLabel||'OUTPUT',
    secondaryOutputLabel:profile.secondaryOutputLabel||'',time:Date.now()
  });
}
function sameTarget(a,b){return a&&b&&a.weaponId===b.weaponId&&Math.abs(a.tx-b.tx)<.00001&&Math.abs(a.ty-b.ty)<.00001&&Math.abs(a.mx-b.mx)<.00001&&Math.abs(a.my-b.my)<.00001}
function getOldTargets(){
  const now=Date.now();
  const list=(readJSON('rawdogs_old_targets_v2',[])||[]).filter(t=>t&&now-t.time<OLD_TTL);
  writeJSON('rawdogs_old_targets_v2',list);return list;
}
function archiveSolution(sol){
  if(!sol||!Number.isFinite(sol.range)||sol.hasSolution===false)return;
  let list=getOldTargets().filter(x=>!sameTarget(x,sol));
  list.unshift({...sol,id:sol.id||`t${Date.now()}${Math.random().toString(16).slice(2)}`});
  writeJSON('rawdogs_old_targets_v2',list.slice(0,OLD_MAX));renderOldTargets();
}
function oldSolutionText(t){
  if(Array.isArray(t.outputs)&&t.outputs.length){
    const low=t.outputs.find(o=>o.key==='low'),high=t.outputs.find(o=>o.key==='high'),parts=[];
    if(low&&Number.isFinite(Number(low.output)))parts.push(`LOW ${Math.round(low.output)}`);
    if(high&&Number.isFinite(Number(high.output)))parts.push(`HIGH ${Math.round(high.output)}`);
    if(parts.length)return parts.join(' / ')+' MIL';
  }
  return Number.isFinite(Number(t.output))?`${Math.round(t.output)} ${t.outputLabel||'MIL'}`:'---';
}
function renderOldTargets(){
  const list=getOldTargets(),host=$('oldList');
  if(!list.length){host.innerHTML='<div class="old-empty">No old targets yet. A firing solution is stored when you move to another target or press NEW TARGET.</div>';return}
  host.innerHTML=list.map(t=>`<div class="old-card ${recalledOldId===t.id?'recalled':''}">
    <div class="lamp-bezel"><div class="lamp"></div></div>
    <div class="old-card-name">${esc(t.name||'Unnamed target')}</div>
    <div class="old-meta">${String(Math.round(t.bearing)).padStart(3,'0')}° · ${Math.round(t.range)} m · ${esc(oldSolutionText(t))}</div>
    <div class="old-coords">X${Number(t.tx).toFixed(2)} / Y${Number(t.ty).toFixed(2)}</div>
    <div class="old-extra">${esc(t.weaponLabel||t.weaponId||'')} • ${(t.team||'unknown').toUpperCase()}</div>
    <div class="old-time">${relativeTime(t.time)}</div>
    <button class="return-btn" data-id="${esc(t.id)}" type="button">RETURN TO TARGET</button>
  </div>`).join('');
  host.querySelectorAll('.return-btn').forEach(b=>b.addEventListener('click',()=>returnOldTarget(b.dataset.id)));
}
function showOldTargets(){
  oldOpen=true;mainView.classList.add('hidden');oldView.classList.remove('hidden');folderTab.textContent='MAIN CALC';folderTab.setAttribute('aria-label','Return to main calculator');renderOldTargets();window.scrollTo(0,0);
}
function showMain(){
  oldOpen=false;oldView.classList.add('hidden');mainView.classList.remove('hidden');folderTab.textContent='OLD TARGETS';folderTab.setAttribute('aria-label','Open old targets');window.scrollTo(0,0);
}
folderTab.addEventListener('click',()=>oldOpen?showMain():showOldTargets());
$('backMainBtn').addEventListener('click',showMain);

function returnOldTarget(id){
  const t=getOldTargets().find(x=>x.id===id);if(!t)return;
  if(t.team&&selectedTeam&&t.team!==selectedTeam){
    if(!confirm(`This was saved while ${t.team.toUpperCase()} TEAM. You are ${selectedTeam.toUpperCase()} TEAM.\n\nReturn anyway?`))return;
  }
  if(t.weaponId&&weapons[t.weaponId]?.enabled&&t.weaponId!==activeWeaponId)setActiveWeapon(t.weaponId);
  if(Number.isFinite(Number(t.mx))&&Number.isFinite(Number(t.my))){
    positionName.value=t.positionName||positionName.value;positionX.value=Number(t.mx).toFixed(2);positionY.value=Number(t.my).toFixed(2);savePosition();
  }
  targetName.value=t.name||'';targetX.value=Number(t.tx).toFixed(2);targetY.value=Number(t.ty).toFixed(2);
  recalledOldId=id;showMain();calculate(false);renderOldTargets();
}
function clearResults(name){
  resultName.textContent=name||'Enter a target';bearingValue.textContent='---';rangeValue.textContent='---';outputValue.textContent='---';secondaryValue.textContent='---';
  resultNote.textContent='Firing position stays saved when NEW TARGET is pressed.';
}
function displayError(msg){resultName.textContent='Check input';bearingValue.textContent='---';rangeValue.textContent='---';outputValue.textContent='---';secondaryValue.textContent='---';resultNote.textContent=msg}
function calculate(archivePrevious=true){
  if(!selectedTeam){teamModal.classList.remove('hidden');return}
  savePosition();const profile=currentWeapon(),sol=solutionFromFields();if(sol.error){displayError(sol.error);return}
  if(archivePrevious&&currentSolution&&!sameTarget(currentSolution,sol))archiveSolution(currentSolution);
  currentSolution=sol;resultName.textContent=sol.name;bearingValue.textContent=String(Math.round(sol.bearing)).padStart(3,'0')+'°';rangeValue.textContent=Math.round(sol.range)+'m';
  outputValue.textContent='---';secondaryValue.textContent='---';
  if(sol.outsideCalibration||sol.hasSolution===false){
    outputValue.textContent='OUT';
    resultNote.textContent=`Outside captured ${profile.label} sight data (${Math.round(sol.calibrationMin)}–${Math.round(sol.calibrationMax)} m).`;
    return;
  }
  if(profile.solverId==='dual-range-table-linear'){
    const low=sol.outputs.find(o=>o.key==='low'),high=sol.outputs.find(o=>o.key==='high');
    outputValue.textContent=low?String(Math.round(low.output)):'—';secondaryValue.textContent=high?String(Math.round(high.output)):'—';
    if(low&&high)resultNote.textContent='LOW = flatter/faster • HIGH = steeper for clearing buildings or terrain.';
    else if(high)resultNote.textContent='HIGH ARC solution only at this captured range.';
    else resultNote.textContent='LOW ARC solution only at this captured range.';
    return;
  }
  outputValue.textContent=Number.isFinite(sol.output)?String(Math.round(sol.output)):'---';
  resultNote.textContent=sol.verified?'Verified sight calibration.':'Estimated between captured sight marks.';
}
$('calculateBtn').addEventListener('click',()=>calculate(true));
function newTarget(){
  if(currentSolution)archiveSolution(currentSolution);
  currentSolution=null;recalledOldId=null;targetName.value='';targetX.value='';targetY.value='';clearResults('New target');renderOldTargets();showMain();targetX.focus();
}
$('newTargetBtn').addEventListener('click',newTarget);
$('oldNewTargetBtn').addEventListener('click',newTarget);
[targetName,targetX,targetY].forEach(el=>el.addEventListener('input',()=>{if(recalledOldId!==null){recalledOldId=null;renderOldTargets()}}));
[targetName,targetX,targetY,positionName,positionX,positionY].forEach(el=>el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();calculate(true)}}));

renderWeaponMenu();
if(!weapons[activeWeaponId]||!weapons[activeWeaponId].enabled)activeWeaponId=Object.values(weapons).find(w=>w.enabled)?.id||'';
setActiveWeapon(activeWeaponId);renderOldTargets();
if(!selectedTeam) $('installTip').classList.add('show');
})();
