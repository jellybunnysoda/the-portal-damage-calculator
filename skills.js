// Skill definitions describe damage, not UI. Add a class or a level here without
// changing the calculator's fields or the downstream damage pipeline.
const commonTier = level => level <= 6 ? 'I' : level <= 12 ? 'II' : 'III';
const rowLevels = (rows, columns, extras = {}) => rows.map((row, index) => {
  const values = Object.fromEntries(columns.map((name, i) => [name, row[i]]));
  return {level: index + 1, tier: commonTier(index + 1), ...values, ...extras};
});

const aquaRows = [
  [3,1,35,10,25,3],[6,1,36,10,28,3],[9,1,36,10,31,3],
  [12,1,37,10,34,4],[15,1,37,10,37,4],[18,2,38,10,39,4],
  [21,2,39,10,45,4],[24,2,40,10,48,5],[27,2,40,10,51,5],
  [30,2,41,10,54,5],[33,2,41,10,57,5],[36,2,42,10,60,5],
  [39,3,43,10,65,6],[42,3,44,10,68,6],[45,3,44,10,71,6],
  [48,3,45,10,74,6],[51,3,45,10,77,6],[54,3,46,10,80,7]
];
const entangleRows = [
  [3,2,1,150,25,20,1],[6,3,1,160,28,22,1.2],[9,4,1,169,31,23,1.4],
  [12,5,1,179,34,25,1.6],[15,6,1,188,37,26,1.8],[18,6,2,198,39,28,2],
  [21,8,2,217,45,31,2.3],[24,9,2,227,48,32,2.5],[27,10,2,237,51,34,2.7],
  [30,11,2,246,54,35,2.9],[33,12,2,256,57,37,3.1],[36,13,2,265,60,38,3.3],
  [39,14,3,285,65,42,3.7],[42,15,3,294,68,43,3.9],[45,16,3,304,71,45,4.1],
  [48,17,3,313,74,46,4.3],[51,18,3,323,77,48,4.5],[54,19,3,333,80,49,4.7]
];
const meteorRows = [
  [3,15,180,20,100,12],[6,15,187,20,112,12],[9,15,193,20,123,13],
  [12,16,200,20,135,13],[15,16,206,20,146,14],[18,16,213,20,158,14],
  [21,16,226,20,181,15],[24,17,232,20,192,16],[27,17,239,20,204,16],
  [30,17,245,20,215,17],[33,17,252,20,227,17],[36,17,258,20,238,18]
];
const tailwindRows = [
  [3,8,150,50],[6,8,160,52],[9,8,169,54],[12,8,179,56],
  [15,8,188,58],[18,8,198,60],[21,8,217,64],[24,8,227,66],
  [27,8,237,68],[30,8,246,70],[33,8,256,72],[36,8,265,74],
  [39,8,285,77],[42,8,294,79],[45,8,304,81],[48,8,313,83],
  [51,8,323,85],[54,8,333,87]
];
const bodySlamRows = [
  [3,30,8,100,24,1,30],[6,30,8,112,26,1.1,31],[9,30,8,123,29,1.2,32],
  [12,30,8,135,31,1.3,32],[15,30,8,146,34,1.5,33],[18,30,8,158,36,1.6,34],
  [21,30,8,181,41,1.8,35],[24,30,8,192,43,1.9,36],[27,30,8,204,45,2,37],
  [30,30,8,215,48,2.2,38],[33,30,8,227,50,2.3,38],[36,30,8,238,53,2.4,39],
  [39,30,8,262,57,2.6,41],[42,30,8,273,60,2.7,42],[45,30,8,285,62,2.8,42],
  [48,30,8,296,65,3,43],[51,30,8,308,67,3.1,44],[54,30,8,319,69,3.2,45]
];
const timberChargeRows = [
  [3,20,10,42,20,40],[6,20,10,46,20,41],[9,20,10,50,20,42],
  [12,21,11,54,20,43],[15,21,11,59,21,43],[18,21,11,63,21,44],
  [21,21,11,71,21,45],[24,22,12,75,21,46],[27,22,12,79,21,47],
  [30,22,12,84,22,48],[33,22,12,88,22,49],[36,22,12,92,22,50]
];
const whirlwindRows = [
  [3,5,100,24,5,500],[6,5,112,26,5,512],[9,5,123,29,5,523],
  [12,5,135,31,5,535],[15,5,146,34,5,546],[18,5,158,36,6,558],
  [21,5,181,41,6,581],[24,5,192,43,6,592],[27,5,204,45,6,604],
  [30,5,215,48,6,615],[33,5,227,50,6,627],[36,5,238,53,6,638],
  [39,5,262,57,7,662],[42,5,273,60,7,673],[45,5,285,62,7,685],
  [48,5,296,65,7,696],[51,5,308,67,7,708],[54,5,319,69,7,719]
];
const auroraWaveRows = [
  [3,15,160,10,100,12],[6,15,165,10,112,12],[9,15,171,10,123,13],
  [12,16,176,10,135,13],[15,16,182,10,146,14],[18,16,187,10,158,14],
  [21,16,198,10,181,15],[24,17,203,10,192,16],[27,17,208,10,204,16],
  [30,17,214,10,215,17],[33,17,219,10,227,17],[36,17,225,10,238,18]
];
const doombellRows = [
  [3,20,9,150,60,3,6],[6,20,9,160,67,3.1,6.1],[9,20,9,169,74,3.2,6.2],
  [12,20,10,179,81,3.3,6.3],[15,20,10,188,88,3.5,6.5],[18,20,10,198,95,3.6,6.6],
  [21,20,10,217,109,3.8,6.8],[24,20,10,227,115,3.9,6.9],[27,20,10,237,122,4,7],
  [30,20,10,246,129,4.2,7.2],[33,20,10,256,136,4.3,7.3],[36,20,10,265,143,4.4,7.4],
  [39,20,11,285,157,4.6,7.6],[42,20,11,294,164,4.7,7.7],[45,20,11,304,171,4.8,7.8],
  [48,20,11,313,178,5,8],[51,20,11,323,185,5.1,8.1],[54,20,11,333,191,5.2,8.2]
];
const holyWoundsRows = [
  [3,1,150,15,1],[6,1,160,18,1],[9,1,169,20,1],
  [12,1,179,23,2],[15,1,188,26,2],[18,2,198,28,2],
  [21,2,217,34,3],[24,2,227,37,3],[27,2,237,39,3],
  [30,2,246,42,3],[33,2,256,45,4],[36,2,265,47,4],
  [39,3,285,53,4],[42,3,294,55,4],[45,3,304,58,5],
  [48,3,313,61,5],[51,3,323,63,5],[54,3,333,66,5]
];
const bladeCircuitRows = [
  [3,15,200,42,12],[6,15,210,46,12],[9,16,219,50,13],
  [12,16,229,54,13],[15,17,238,59,14],[18,17,248,63,14],
  [21,18,267,71,15],[24,18,277,75,16],[27,18,287,79,16],
  [30,19,296,84,17],[33,19,306,88,17],[36,20,315,92,18]
];
const bladeFuryRows = [
  [3,150,20],[6,160,22],[9,169,25],[12,179,27],[15,188,30],[18,198,32],
  [21,217,37],[24,227,40],[27,237,42],[30,246,45],[33,256,47],[36,265,50],
  [39,285,54],[42,294,57],[45,304,59],[48,313,62],[51,323,64],[54,333,67]
];

export const SKILL_CATALOG = {
  enchanter: {
    name: 'Enchanter',
    skills: {
      aqua_bloom: {
        name: 'Aqua Bloom', damageType: 'magic', baseStat: 'MATK',
        attackElement: 'Water',
        baseFormula: {kind: 'linear', terms: [{stat: 'MATK', coefficient: 1}]},
        hitMode: 'projectile',
        levels: rowLevels(aquaRows, ['intRequired','cooldown','damagePercent','radius','mpCost','maxProjectiles'])
      },
      entangle: {
        name: 'Entangle', damageType: 'magic', baseStat: 'MATK',
        attackElement: 'Earth',
        baseFormula: {kind: 'linear', terms: [{stat: 'MATK', coefficient: 1}]},
        hitMode: 'single',
        levels: rowLevels(entangleRows, ['intRequired','aoe','cooldown','damagePercent','mpCost','rootChance','rootDuration'])
      },
      meteor_shower: {
        name: 'Meteor Shower', damageType: 'magic', baseStat: 'MATK',
        attackElement: 'Fire',
        baseFormula: {kind: 'linear', terms: [{stat: 'MATK', coefficient: 1}]},
        hitMode: 'projectile',
        levels: rowLevels(meteorRows, ['intRequired','cooldown','damagePercent','radius','mpCost','maxProjectiles'])
      },
      tailwind: {
        name: 'Tailwind', damageType: 'magic', baseStat: 'MATK',
        attackElement: 'Wind',
        baseFormula: {kind: 'linear', terms: [{stat: 'MATK', coefficient: 1}]},
        hitMode: 'multi-hit', hits: 10, damagePercentType: 'total', rollPerHit: true,
        levels: rowLevels(tailwindRows, ['intRequired','cooldown','damagePercent','mpCost'])
      }
    }
  },
  cleric: {
    name: 'Cleric',
    skills: {
      aurora_wave: {
        name: 'Aurora Wave', damageType: 'magic', baseStat: 'MATK',
        attackElement: 'Ghost',
        hitMode: 'projectile', damagePercentType: 'perHit', rollPerHit: true,
        levels: rowLevels(auroraWaveRows, ['wisRequired','cooldown','damagePercent','radius','mpCost','maxProjectiles'])
      },
      doombell: {
        name: 'Doombell', damageType: 'magic', baseStat: 'MATK',
        attackElement: 'Fire',
        hitMode: 'single', damageComponent: 'initialHit',
        // Provisional in-game estimate. Tick count/timing is intentionally unknown.
        dot: {enabled: true, baseStat: 'MATK', scalingType: 'levelLinear',
          basePercent: 25, percentPerLevel: 2.5, tickInterval: 1,
          canCrit: false, provisional: true},
        levels: rowLevels(doombellRows, ['wisRequired','aoeRadius','cooldown','damagePercent','mpCost','stunDuration','bellDuration'])
      },
      holy_wounds: {
        name: 'Holy Wounds', damageType: 'magic', baseStat: 'MATK',
        attackElement: 'Holy',
        hitMode: 'projectile', damagePercentType: 'perHit', rollPerHit: true,
        levels: rowLevels(holyWoundsRows, ['wisRequired','cooldown','damagePercent','mpCost','maxProjectiles'])
      }
    }
  },
  defender: {
    name: 'Defender',
    skills: {
      body_slam: {
        name: 'Body Slam', damageType: 'physical', baseStat: 'DEF',
        attackElement: 'Earth',
        baseFormula: {kind: 'linear', terms: [{stat: 'DEF', coefficient: 1}]},
        hitMode: 'single', scalingType: 'damagePercent',
        levels: rowLevels(bodySlamRows, ['vitRequired','aoeRadius','cooldown','damagePercent','mpCost','stunDuration','jumpRange'])
      },
      timber_charge: {
        name: 'Timber Charge', damageType: 'physical', baseStat: 'MAX_HP',
        baseFormula: {kind: 'linear', terms: [{stat: 'MAX_HP', coefficient: 1}]},
        hitMode: 'single', scalingType: 'hpPercent',
        levels: rowLevels(timberChargeRows, ['vitRequired','cooldown','duration','mpCost','moveSpeed','hpPercent'])
      },
      whirlwind: {
        name: 'Whirlwind', damageType: 'physical', baseStat: 'DEF',
        attackElement: 'Wind',
        baseFormula: {kind: 'linear', terms: [{stat: 'DEF', coefficient: 1}]},
        hitMode: 'single', scalingType: 'damagePercent',
        levels: rowLevels(whirlwindRows, ['vitRequired','cooldown','damagePercent','mpCost','tauntDuration','threatBonus'])
      }
    }
  },
  warrior: {
    name: 'Warrior',
    skills: {
      blade_circuit: {
        name: 'Blade Circuit', damageType: 'physical', baseStat: 'PATK',
        hitMode: 'multi-hit', hitUnit: 'slash', damagePercentType: 'perHit', rollPerHit: true,
        levels: rowLevels(bladeCircuitRows, ['strRequired','cooldown','damagePercent','mpCost','hits'])
      },
      blade_fury: {
        name: 'Blade Fury', damageType: 'physical', baseStat: 'PATK',
        hitMode: 'multi-hit', hits: 3, damagePercentType: 'perHit', rollPerHit: true,
        levels: rowLevels(bladeFuryRows, ['strRequired','damagePercent','mpCost'], {cooldown: 5})
      },
      blade_rush: {
        name: 'Blade Rush', damageType: 'physical', baseStat: 'PATK',
        hitMode: 'multi-hit', hitsPerCast: 5, maxCasts: 2,
        damagePercentType: 'totalPerCast', rollPerHit: true,
        levels: rowLevels(bladeFuryRows, ['strRequired','damagePercent','mpCost'], {cooldown: 7})
      }
    }
  }
};

export const BASE_STAT_FIELDS = {
  MATK: 'matk', PATK: 'patk', MAX_HP: 'maxHp', DEF: 'def', MDEF: 'mdef'
};

export function getSkill(classId, skillId) {
  return SKILL_CATALOG[classId]?.skills[skillId] ?? null;
}
export function getSkillLevel(classId, skillId, level) {
  const skill = getSkill(classId, skillId);
  return skill?.levels.find(row => row.level === Number(level)) ?? null;
}
export function resolveSkill(classId, skillId, level, projectilesHit, requestedCasts = 1) {
  const skill = getSkill(classId, skillId), row = getSkillLevel(classId, skillId, level);
  if (!skill || !row) throw new Error('Unknown skill level');
  const hitsPerCast = row.hitsPerCast ?? skill.hitsPerCast ?? null;
  const maxCasts = skill.maxCasts ?? 1;
  const castsUsed = hitsPerCast ? Math.min(maxCasts, Math.max(1, Math.floor(Number(requestedCasts) || 1))) : 1;
  const maximum = skill.hitMode === 'projectile' ? row.maxProjectiles
    : hitsPerCast ? hitsPerCast * maxCasts
    : skill.hitMode === 'multi-hit' ? (row.hits ?? skill.hits) : 1;
  const requested = Number.isFinite(Number(projectilesHit)) ? Math.floor(Number(projectilesHit)) : maximum;
  const hits = skill.hitMode === 'projectile' ? Math.min(maximum, Math.max(1, requested))
    : hitsPerCast ? hitsPerCast * castsUsed : maximum;
  return {
    classId, skillId, name: skill.name, level: row.level, damageType: skill.damageType,
    attackElement: skill.attackElement ?? null,
    baseStat: skill.baseStat, baseFormula: skill.baseFormula,
    scalingType: skill.scalingType ?? 'damagePercent',
    damagePercent: row.damagePercent ?? row.hpPercent,
    hitMode: skill.hitMode, hits, maxHits: maximum,
    hitUnit: skill.hitUnit ?? 'hit', hitsPerCast, castsUsed, maxCasts,
    maxProjectiles: skill.hitMode === 'projectile' ? maximum : null,
    damagePercentType: skill.damagePercentType ?? 'perHit',
    damageComponent: skill.damageComponent ?? null,
    dot: skill.dot ?? null,
    rollPerHit: skill.rollPerHit ?? true,
    cooldown: row.cooldown, mpCost: row.mpCost,
    metadata: row
  };
}
export function customSkill({damageType = 'magic', baseStat = 'MATK', damagePercent = 100, hits = 1} = {}) {
  if (!BASE_STAT_FIELDS[baseStat]) throw new Error('Unknown base stat');
  return {
    classId: 'custom', skillId: 'custom', name: 'Custom Skill',
    damageType, baseStat,
    baseFormula: {kind: 'linear', terms: [{stat: baseStat, coefficient: 1}]},
    damagePercent: Number(damagePercent), hitMode: 'custom',
    damagePercentType: 'perHit', rollPerHit: true,
    hits: Math.max(1, Math.floor(Number(hits) || 1)),
    maxHits: Math.max(1, Math.floor(Number(hits) || 1)),
    maxProjectiles: Math.max(1, Math.floor(Number(hits) || 1)),
    cooldown: null, mpCost: null, metadata: {}
  };
}
