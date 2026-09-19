import {BASE_STAT_FIELDS} from './skills.js?v=20260920-0134';
import {elementMatchupPercent} from './target-data.js?v=20260920-0134';

export const WEAPON_SIZE = {
  '1H Blunt': [75,100,75], '1H Dagger': [100,75,50], '1H Staff': [100,100,100],
  '1H Sword': [75,100,75], '2H Blunt': [75,75,100], '2H Staff': [100,100,100],
  '2H Sword': [75,75,100], Fist: [100,100,100], Custom: [100,100,100]
};
export const SIZES = ['Small','Medium','Large'];
export const PVP_MULTIPLIER = 0.1; // Final damage step: divide by 10 once.
const clamp = (n,min,max) => Math.min(max,Math.max(min,Number.isFinite(+n)?+n:0));
const nonnegative = n => clamp(n,0,Number.MAX_SAFE_INTEGER);
const namedBaseFormulas = new Map();

// Future non-linear skills can register a named formula without changing UI or
// the downstream damage stages. Linear formulas already support many stats.
export function registerBaseFormula(id, resolver) {
  if (!id || typeof resolver !== 'function') throw new Error('Invalid base formula');
  namedBaseFormulas.set(id, resolver);
}
export function resolveDamageBase(attacker, skill) {
  const formula = skill.baseFormula ?? {kind: 'linear', terms: [{stat: skill.baseStat, coefficient: 1}]};
  if (formula.kind === 'named') {
    const resolver = namedBaseFormulas.get(formula.id);
    if (!resolver) throw new Error(`Unknown base formula: ${formula.id}`);
    return nonnegative(resolver(attacker, skill));
  }
  if (formula.kind !== 'linear') throw new Error(`Unknown base formula kind: ${formula.kind}`);
  const terms = formula.terms ?? [];
  const value = nonnegative(formula.flat ?? 0) + terms.reduce((sum, term) => {
    const field = BASE_STAT_FIELDS[term.stat];
    if (!field) throw new Error(`Unknown base stat: ${term.stat}`);
    return sum + nonnegative(attacker[field]) * Number(term.coefficient ?? 1);
  }, 0);
  return nonnegative(value);
}

export function calculate(input) {
  const a=input.attacker, t=input.target;
  const skill=input.skill ?? {
    damageType: a.type, baseStat: a.type === 'magic' ? 'MATK' : 'PATK',
    damagePercent: a.skill, hits: a.hits, maxProjectiles: a.hits
  };
  const magical=skill.damageType==='magic';
  const attack=resolveDamageBase(a,skill);
  const skillPercent=nonnegative(skill.damagePercent);
  const maxHits=Math.max(1,Math.floor(clamp(skill.maxHits ?? skill.maxProjectiles ?? skill.hits ?? 1,1,999)));
  const percentPerHit=skill.damagePercentType === 'total' ? skillPercent/maxHits
    : skill.damagePercentType === 'totalPerCast' ? skillPercent/Math.max(1,skill.hitsPerCast) : skillPercent;
  const isPvP=Boolean(t.pvp);
  const elementPercent=a.attackElement != null && t.element != null
    ? elementMatchupPercent(a.attackElement,t.element) : nonnegative(a.element ?? 100);
  const sizeIndex=Math.max(0,SIZES.indexOf(t.size));
  const sizePct=isPvP ? 100 : (a.weapon==='Custom'?nonnegative(a.customWeaponSize):WEAPON_SIZE[a.weapon]?.[sizeIndex] ?? 100);
  const defRaw=nonnegative(magical?t.mdef:t.def);
  const defenseBeforeIgnore=defRaw*(magical?2:1);
  const ignore=clamp(a.ignoreDef,0,70)/100;
  const effectiveDefense=defenseBeforeIgnore*(1-ignore);
  const defenseReduction=Math.min(.9,effectiveDefense/(effectiveDefense+120));
  const critRate=skill.canCrit === false ? 0 : clamp(a.critRate,0,85)/100;
  const maxProjectiles=skill.maxProjectiles == null ? null : Math.max(1,Math.floor(clamp(skill.maxProjectiles,1,999)));
  const hits=Math.max(1,Math.floor(clamp(skill.hits ?? 1,1,maxHits)));
  const stages=[
    ['Damage Base',1],['Damage Roll',1],['Skill',percentPerHit/100],
    ['Critical',1],['Damage Up',1+clamp(a.damageUp,0,150)/100],
    ['Element',elementPercent/100],['Weapon Size',sizePct/100],
    ['DEF / MDEF',1-defenseReduction],['Block',1-clamp(t.block,0,100)/100],
    ['Damage Reduction',1-clamp(t.damageReduction,0,100)/100],
    ['Race bonus',1+nonnegative(a.raceBonus)/100],
    ['Size bonus',isPvP?1:1+nonnegative(a.sizeBonus)/100],
    ['Race Resistance',1-clamp(t.raceResistance,0,100)/100],
    ['Codex',1+nonnegative(a.codexBonus)/100],
    ['PvP',t.pvp?PVP_MULTIPLIER:1]
  ];
  function path(roll,critical){
    let value=attack;
    return stages.map(([label,factor])=>{
      const f=label==='Damage Roll'?roll:label==='Critical'?(critical && skill.canCrit !== false ? clamp(a.critDamage,0,300)/100 : 1):factor;
      value*=f;
      return {label,factor:f,value};
    });
  }
  const normalPath=path(1,false),criticalPath=path(1,true);
  const normal=normalPath.at(-1).value, critical=criticalPath.at(-1).value;
  const average=normal*(1-critRate)+critical*critRate;
  const lowNormal=path(.9,false).at(-1).value, lowCritical=path(.9,true).at(-1).value;
  const highNormal=path(1.1,false).at(-1).value, highCritical=path(1.1,true).at(-1).value;
  const lowAverage=lowNormal*(1-critRate)+lowCritical*critRate;
  const highAverage=highNormal*(1-critRate)+highCritical*critRate;
  const averageMin=Math.min(lowAverage,highAverage);
  const averageMax=Math.max(lowAverage,highAverage);
  return {
    normal,critical,average,
    min:Math.min(lowNormal,lowCritical,highNormal,highCritical),
    max:Math.max(lowNormal,lowCritical,highNormal,highCritical),
    averageMin,averageMax,hits,maxHits,maxProjectiles,total:average*hits,
    totalMin:averageMin*hits,totalMax:averageMax*hits,
    baseStatValue:attack,baseSkillDamage:attack*percentPerHit/100,
    damagePercent:skillPercent,damagePercentPerHit:percentPerHit,
    damagePercentType:skill.damagePercentType ?? 'perHit',
    damageType:skill.damageType,baseStat:skill.baseStat,
    normalPath,criticalPath,critRate,defenseBeforeIgnore,effectiveDefense,defenseReduction,sizePct,ignore,elementPercent
  };
}

function dotTickInput(input) {
  const dot=input.skill?.dot;
  if (!dot?.enabled) return null;
  if (dot.scalingType !== 'levelLinear') throw new Error(`Unknown DoT scaling: ${dot.scalingType}`);
  const damagePercent=dot.basePercent+(input.skill.level-1)*dot.percentPerLevel;
  return {
    ...input,
    skill: {
      damageType: dot.damageType ?? input.skill.damageType,
      baseStat: dot.baseStat, baseFormula: dot.baseFormula,
      damagePercent, damagePercentType: 'perHit',
      hits: 1, maxHits: 1, rollPerHit: true, canCrit: dot.canCrit
    }
  };
}

// Returns damage for one tick only. Bell duration does not establish tick count.
export function calculateDotTick(input) {
  const tickInput=dotTickInput(input);
  if (!tickInput) return null;
  return {
    scalingPercent: tickInput.skill.damagePercent,
    tickInterval: input.skill.dot.tickInterval,
    bellDuration: input.skill.metadata?.bellDuration ?? null,
    provisional: Boolean(input.skill.dot.provisional),
    canCrit: input.skill.dot.canCrit,
    damage: calculate(tickInput)
  };
}

export function simulateDotTick(input, random=Math.random) {
  const tickInput=dotTickInput(input);
  return tickInput ? simulateHits(tickInput, random).hits[0] : null;
}

// A cast simulation uses a fresh roll and crit draw for every hit. Expected
// totals above remain deterministic and use the 100% average roll.
export function simulateHits(input, random=Math.random) {
  const result=calculate(input);
  const sharedRoll=input.skill?.rollPerHit === false ? .9 + random()*.2 : null;
  const hits=Array.from({length:result.hits},(_,index)=>{
    const roll=sharedRoll ?? .9 + random()*.2;
    const critical=random()<result.critRate;
    return {index:index+1,roll,critical,damage:(critical?result.critical:result.normal)*roll};
  });
  return {hits,total:hits.reduce((sum,hit)=>sum+hit.damage,0)};
}

export function compareBuilds(buildA,buildB,target,skill){
  const a=calculate({attacker:buildA,target,skill}),b=calculate({attacker:buildB,target,skill});
  return {a,b,difference:b.average-a.average,percent:a.average?((b.average/a.average)-1)*100:null};
}
