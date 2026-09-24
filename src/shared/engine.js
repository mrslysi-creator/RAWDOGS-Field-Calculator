/* RAWDOGS Field Calculator — shared calculation engine
   Geometry is common to all weapons. Weapon-specific elevation maths is selected by solverId.
*/
window.RAWDOGS_ENGINE = (function(){
  'use strict';

  const solvers = {};

  function registerSolver(id, fn){
    if(!id || typeof fn !== 'function') throw new Error('Invalid solver registration');
    solvers[id] = fn;
  }

  function normaliseCoord(value){
    const cleaned = String(value ?? '').replace(/[xy,]/gi, '').trim();
    if(!cleaned) return NaN;
    return Number(cleaned);
  }

  function geometry(profile, mx, my, tx, ty){
    const scale = Number(profile.coordinateScaleMeters || 100);
    const dx = (tx - mx) * scale;
    const dy = (ty - my) * scale;
    const range = Math.hypot(dx, dy);
    let bearing = Math.atan2(dx, dy) * 180 / Math.PI;
    if(bearing < 0) bearing += 360;
    return { dx, dy, range, bearing };
  }

  function sortedMarks(marks){
    return Array.isArray(marks)
      ? marks.filter(m=>Number.isFinite(Number(m.range))&&Number.isFinite(Number(m.mil)))
             .map(m=>({range:Number(m.range),mil:Number(m.mil)}))
             .sort((a,b)=>a.range-b.range)
      : [];
  }

  function nearestMarks(marks, range){
    const m = sortedMarks(marks);
    if(m.length < 2) return [];
    if(range <= m[0].range) return [m[0], m[1]];
    if(range >= m[m.length - 1].range) return [m[m.length - 2], m[m.length - 1]];
    for(let i=0;i<m.length-1;i++){
      if(range >= m[i].range && range <= m[i+1].range) return [m[i], m[i+1]];
    }
    return [];
  }

  function interpolateMarks(marks, range, allowExtrapolation){
    const m=sortedMarks(marks);
    if(m.length<2) return { error:'Not enough calibration marks for this weapon.' };
    const min=m[0].range,max=m[m.length-1].range;
    if(!allowExtrapolation && (range<min || range>max)){
      return { outside:true, minRange:min, maxRange:max, nearest:nearestMarks(m,range) };
    }
    let a,b;
    if(range<=min){a=m[0];b=m[1]}
    else if(range>=max){a=m[m.length-2];b=m[m.length-1]}
    else{
      for(let i=0;i<m.length-1;i++){
        if(range>=m[i].range && range<=m[i+1].range){a=m[i];b=m[i+1];break}
      }
    }
    if(!a||!b) return { error:'Could not bracket this range in the calibration table.' };
    const output=a.mil+(range-a.range)*(b.mil-a.mil)/(b.range-a.range);
    return { output, nearest:[a,b], minRange:min, maxRange:max, outside:false };
  }

  registerSolver('range-table-linear', function(profile, geom){
    const c=profile.calibration||{};
    const solved=interpolateMarks(c.marks,geom.range,!!c.allowExtrapolation);
    if(solved.error) return solved;
    const verified=Number.isFinite(c.verifiedMinRange)&&Number.isFinite(c.verifiedMaxRange)
      ? geom.range>=c.verifiedMinRange&&geom.range<=c.verifiedMaxRange
      : !solved.outside;
    return {
      output:solved.output,
      outputs:solved.outside?[]:[{key:'primary',label:profile.outputLabel||'OUTPUT',output:solved.output,nearest:solved.nearest,verified}],
      verified,
      nearest:solved.nearest||[],
      outsideCalibration:!!solved.outside,
      calibrationMin:solved.minRange,
      calibrationMax:solved.maxRange,
      hasSolution:!solved.outside
    };
  });

  registerSolver('dual-range-table-linear', function(profile, geom){
    const c=profile.calibration||{};
    const low=c.lowArc||{}, high=c.highArc||{};
    const allow=!!c.allowExtrapolation;
    const lowSolved=interpolateMarks(low.marks,geom.range,allow);
    const highSolved=interpolateMarks(high.marks,geom.range,allow);
    if(lowSolved.error) return lowSolved;
    if(highSolved.error) return highSolved;

    const outputs=[];
    if(!lowSolved.outside){
      outputs.push({
        key:'low',label:profile.outputLabel||'LOW MIL',output:lowSolved.output,
        nearest:lowSolved.nearest||[],verified:geom.range>=low.verifiedMinRange&&geom.range<=low.verifiedMaxRange
      });
    }
    if(!highSolved.outside){
      outputs.push({
        key:'high',label:profile.secondaryOutputLabel||'HIGH MIL',output:highSolved.output,
        nearest:highSolved.nearest||[],verified:geom.range>=high.verifiedMinRange&&geom.range<=high.verifiedMaxRange
      });
    }

    const minRange=Math.min(lowSolved.minRange,highSolved.minRange);
    const maxRange=Math.max(lowSolved.maxRange,highSolved.maxRange);
    const primary=outputs.find(o=>o.key==='low')||outputs[0];
    const secondary=outputs.find(o=>o.key==='high');
    return {
      output:primary?.output,
      secondaryOutput:secondary?.output,
      outputs,
      verified:outputs.length>0&&outputs.every(o=>o.verified),
      nearest:primary?.nearest||[],
      outsideCalibration:outputs.length===0,
      calibrationMin:minRange,
      calibrationMax:maxRange,
      hasSolution:outputs.length>0,
      peak:c.peak||null
    };
  });

  function calculate(profile, fields){
    if(!profile || !profile.enabled) return { error:'This weapon profile is not enabled yet.' };
    const mx=normaliseCoord(fields.mx),my=normaliseCoord(fields.my),tx=normaliseCoord(fields.tx),ty=normaliseCoord(fields.ty);
    if(![mx,my,tx,ty].every(Number.isFinite)) return { error:'Enter valid X and Y coordinates for the firing position and target.' };
    const geom=geometry(profile,mx,my,tx,ty);
    const solver=solvers[profile.solverId];
    if(!solver) return { error:'No calculator is installed for '+profile.label+'.' };
    const weaponResult=solver(profile,geom);
    if(weaponResult.error) return weaponResult;
    return {
      mx,my,tx,ty,dx:geom.dx,dy:geom.dy,range:geom.range,bearing:geom.bearing,
      output:weaponResult.output,
      secondaryOutput:weaponResult.secondaryOutput,
      outputs:weaponResult.outputs||[],
      verified:!!weaponResult.verified,
      nearest:weaponResult.nearest||[],
      outsideCalibration:!!weaponResult.outsideCalibration,
      calibrationMin:weaponResult.calibrationMin,
      calibrationMax:weaponResult.calibrationMax,
      hasSolution:weaponResult.hasSolution!==false,
      peak:weaponResult.peak||null
    };
  }

  return { registerSolver, normaliseCoord, geometry, calculate };
})();
