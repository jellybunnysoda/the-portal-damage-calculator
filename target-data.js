export const ELEMENTS = ['Neutral','Water','Earth','Fire','Wind','Poison','Holy','Shadow','Ghost','Undead'];

// Rows are attack element; columns follow ELEMENTS as target element.
const rows = [
  [100,100,100,100,100,100,100,100,70,100],
  [100,25,100,150,90,100,75,100,100,100],
  [100,100,25,90,150,100,75,100,100,100],
  [100,90,150,25,100,100,75,100,100,125],
  [100,175,90,100,25,100,75,100,100,100],
  [100,100,125,125,125,0,75,50,100,-25],
  [100,100,100,100,100,100,0,125,100,150],
  [100,100,100,100,100,50,125,0,100,-25],
  [70,100,100,100,100,100,75,75,125,100],
  [100,100,100,100,100,50,100,0,100,0]
];
export const ELEMENT_MATCHUP = Object.freeze(Object.fromEntries(ELEMENTS.map((attack, i) =>
  [attack, Object.freeze(Object.fromEntries(ELEMENTS.map((target, j) => [target, rows[i][j]])))])));

export function elementMatchupPercent(attackElement, targetElement) {
  const value=ELEMENT_MATCHUP[attackElement]?.[targetElement];
  if (value == null) throw new Error(`Unknown element matchup: ${attackElement} → ${targetElement}`);
  return value;
}

export const MONSTER_CATEGORIES = [
  {name: 'Normal', monsters: [
    ['cog_crab','Cog Crab',20,3,'Medium','Fire'],
    ['cup_snail','Cup Snail',24,8,'Large','Poison'],
    ['spore_deer','Spore Deer',28,7,'Medium','Neutral'],
    ['patch_hound','Patch Hound',32,8,'Medium','Undead'],
    ['kettle_beetle','Kettle Beetle',36,7,'Large','Earth'],
    ['scarecrow_goblin','Scarecrow Goblin',60,20,'Medium','Water'],
    ['critter_goblin','Critter Goblin',64,11,'Small','Wind'],
    ['buckethead_goblin','Buckethead Goblin',80,20,'Large','Fire']
  ]},
  {name: 'Elite', monsters: [['barrel_champion','Barrel Champion',104,26,'Medium','Earth']]},
  {name: 'Mini Boss', monsters: [
    ['tin_tortoise','Tin Tortoise',110,27,'Large','Water'],
    ['junk_king','Junk King',140,35,'Small','Fire']
  ]},
  {name: 'Boss', monsters: [['lycaros','Lycaros',300,75,'Large','Shadow']]}
];

export const MONSTERS = Object.freeze(Object.fromEntries(MONSTER_CATEGORIES.flatMap(category =>
  category.monsters.map(([id,name,def,mdef,size,element]) =>
    [id,Object.freeze({name,category:category.name,def,mdef,size,element})]))));

// Return a copy, so editing target fields never changes the shared preset.
export function monsterDefaults(id) {
  return MONSTERS[id] ? {...MONSTERS[id]} : null;
}
