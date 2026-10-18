// Skill definitions describe damage, not UI. Add a class or a level here without
// changing the calculator's fields or the downstream damage pipeline.
const commonTier = level => level <= 6 ? 'I' : level <= 12 ? 'II' : level <= 18 ? 'III' : 'IV';
const rowLevels = (rows, columns, extras = {}) => rows.map((row, index) => {
  const values = Object.fromEntries(columns.map((name, i) => [name, row[i]]));
  return {level: index + 1, tier: commonTier(index + 1), ...values, ...extras};
});

const aquaRows = [
  [3,1,35,10,25,3],[6,1,37,10,28,3],[9,1,40,10,31,3],
  [12,1,63,10,34,4],[15,1,66,10,37,4],[18,1,85,10,39,4],
  [21,2,111,10,45,5],[24,2,115,10,48,5],[27,2,119,10,51,5],
  [30,2,123,10,54,6],[33,2,142,10,57,6],[36,2,153,10,60,6],
  [39,3,162,10,65,6],[42,3,167,10,68,6],[45,3,184,10,71,7],
  [48,3,188,10,74,7],[51,3,194,10,77,7],[54,3,211,10,80,7],
  [57,4,233,10,83,8],[60,4,238,10,86,8],[63,4,243,10,89,8],
  [66,4,290,10,92,8],[69,4,296,10,95,8],[72,4,311,10,98,8]
];
const entangleRows = [
  [3,5,1,150,25,20,1],[6,5,1,174,28,22,1.08],[9,6,1,198,31,23,1.15],
  [12,6,1,222,34,25,1.23],[15,7,1,245,37,26,1.31],[18,7,1,269,39,28,1.38],
  [21,9,2,317,45,31,1.54],[24,9,2,329,48,32,1.62],[27,10,2,341,51,34,1.69],
  [30,10,2,353,54,35,1.77],[33,11,2,486,57,37,1.85],[36,11,2,523,60,38,1.92],
  [39,13,3,597,65,42,2.08],[42,13,3,613,68,43,2.15],[45,14,3,734,71,45,2.23],
  [48,14,3,754,74,46,2.31],[51,15,3,774,77,48,2.38],[54,15,3,846,80,49,2.46],
  [57,18,4,1063,83,51,2.62],[60,18,4,1087,86,52,2.69],[63,19,4,1111,89,54,2.77],
  [66,19,4,1324,92,55,2.85],[69,20,4,1352,95,57,2.92],[72,20,4,1422,98,58,3]
];
const meteorRows = [
  [3,15,201,20,100,12],[6,15,211,20,112,12],[9,15,220,20,123,13],
  [12,15,230,20,135,13],[15,15,239,20,146,14],[18,15,249,20,158,14],
  [21,16,269,20,181,15],[24,16,278,20,192,16],[27,16,288,20,204,16],
  [30,16,297,20,215,17],[33,16,307,20,227,17],[36,16,316,20,238,18],
  [39,17,336,20,262,18],[42,17,345,20,273,19],[45,17,355,20,285,19],
  [48,17,364,20,296,20],[51,17,374,20,308,20],[54,17,384,20,319,21],
  [57,18,404,20,343,21],[60,18,413,20,354,22],[63,18,422,20,366,22],
  [66,18,432,20,377,23],[69,18,441,20,389,23],[72,18,451,20,400,24]
];
const tailwindRows = [
  [3,8,150,50],[6,8,185,52],[9,8,220,54],[12,8,255,56],
  [15,8,291,58],[18,8,326,60],[21,8,396,64],[24,8,411,66],
  [27,8,426,68],[30,8,441,70],[33,8,608,72],[36,8,654,74],
  [39,8,746,77],[42,8,792,79],[45,8,918,81],[48,8,942,83],
  [51,8,968,85],[54,8,1058,87],[57,8,1329,90],[60,8,1359,92],
  [63,8,1389,94],[66,8,1656,96],[69,8,1690,98],[72,8,1778,100]
];
const bodySlamRows = [
  [3,30,8,100,24,1,30],[6,30,8,142,26,1.1,31],[9,30,8,185,29,1.2,32],
  [12,30,8,227,31,1.3,32],[15,30,8,269,34,1.5,33],[18,30,8,311,36,1.6,34],
  [21,30,8,396,41,1.8,35],[24,30,8,411,43,1.9,36],[27,30,8,426,45,2,37],
  [30,30,8,441,48,2.2,38],[33,30,8,608,50,2.3,38],[36,30,8,654,53,2.4,39],
  [39,30,8,746,57,2.6,41],[42,30,8,792,60,2.7,42],[45,30,8,918,62,2.8,42],
  [48,30,8,942,65,3,43],[51,30,8,968,67,3.1,44],[54,30,8,1058,69,3.2,45],
  [null,null,null,1329,null,null,null],[null,null,null,1359,null,null,null],
  [null,null,null,1389,null,null,null],[null,null,null,1656,null,null,null],
  [null,null,null,1690,null,null,null],[null,null,null,1778,null,null,null]
];
const timberChargeRows = [
  [3,20,10,42,20,40],[6,20,10,46,20,41],[9,20,10,50,20,42],
  [12,21,11,54,20,43],[15,21,11,59,21,43],[18,21,11,63,21,44],
  [21,21,11,71,21,45],[24,22,12,75,21,46],[27,22,12,79,21,47],
  [30,22,12,84,22,48],[33,22,12,88,22,49],[36,22,12,92,22,50]
];
const whirlwindRows = [
  [3,5,100,24,5,500],[6,5,131,26,5,512],[9,5,162,29,5,523],
  [12,5,193,31,5,535],[15,5,224,34,5,546],[18,5,255,36,6,558],
  [21,5,317,41,6,581],[24,5,329,43,6,592],[27,5,341,45,6,604],
  [30,5,353,48,6,615],[33,5,486,50,6,627],[36,5,523,53,6,638],
  [39,5,597,57,7,662],[42,5,634,60,7,673],[45,5,754,62,7,685],
  [48,5,754,65,7,696],[51,5,774,67,7,708],[54,5,846,69,7,719],
  [null,null,1063,null,null,null],[null,null,1087,null,null,null],
  [null,null,1111,null,null,null],[null,null,1324,null,null,null],
  [null,null,1352,null,null,null],[null,null,1422,null,null,null]
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
  [3,15,200,42,12],[6,15,210,46,12],[9,15,219,50,13],
  [12,15,229,54,13],[15,15,238,59,14],[18,15,248,63,14],
  [21,17,267,71,15],[24,17,277,75,16],[27,17,287,79,16],
  [30,17,296,84,17],[33,17,306,88,17],[36,17,315,92,18]
];
// Damage and slash counts for Lv.13–24 use Lv.12 temporarily until supplied.
const bladeCircuitLaterCooldowns = [19,19,19,19,19,19,21,21,21,21,21,21];
bladeCircuitRows.push(...bladeCircuitLaterCooldowns.map(cooldown =>
  [null,cooldown,315,null,18]));
const bladeFuryRows = [
  [3,150,20],[6,160,22],[9,169,25],[12,179,27],[15,188,30],[18,198,32],
  [21,218,37],[24,227,40],[27,237,42],[30,246,45],[33,256,47],[36,265,50],
  [39,285,54],[42,294,57],[45,306,59],[48,314,62],[51,323,64],[54,352,67],
  [null,443,null],[null,453,null],[null,463,null],
  [null,552,null],[null,564,null],[null,593,null]
];
const bladeRushDamage = [
  150,163,175,188,200,213,239,247,256,265,365,392,
  446,473,550,566,580,634,797,815,833,993,1014,1067
];
const bladeRushRows = bladeFuryRows.map(([strRequired, , mpCost], index) =>
  [strRequired, bladeRushDamage[index], mpCost]);

const defenderBaseFormula = {kind: 'linear', terms: [
  {stat: 'DEF', coefficient: 0.7}, {stat: 'PATK', coefficient: 1}
]};

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
        baseFormula: defenderBaseFormula,
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
        baseFormula: defenderBaseFormula,
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
          .map(row => row.level >= 13 ? {...row, provisionalDamage: true, provisionalHits: true} : row)
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
        levels: rowLevels(bladeRushRows, ['strRequired','damagePercent','mpCost'], {cooldown: 7})
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
