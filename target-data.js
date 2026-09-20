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

export const FOREST_MONSTER_CATEGORIES = [
  {name: 'Day', monsters: [
    ['rootlash','Rootlash',160,40,'Medium','Wind'],
    ['brittlecap','Brittlecap',150,38,'Small','Fire'],
    ['sagefrog','Sagefrog',190,48,'Small','Poison'],
    ['bellrope','Bellrope',200,50,'Medium','Earth'],
    ['parasol','Parasol',266,67,'Large','Earth'],
    ['splinter','Splinter',336,84,'Large','Wind'],
    ['sir_brankal','Sir Brankal',360,90,'Large','Neutral']
  ]},
  {name: 'Night', monsters: [
    ['glasscap','Glasscap',170,43,'Small','Water'],
    ['inklash','Inklash',180,45,'Medium','Shadow'],
    ['ghostfrog','Ghostfrog',220,55,'Small','Ghost'],
    ['spigot','Spigot',200,50,'Medium','Water'],
    ['lilac','Lilac',230,58,'Small','Holy'],
    ['anemone','Anemone',240,60,'Medium','Ghost'],
    ['nocturne','Nocturne',266,67,'Large','Undead'],
    ['clinker','Clinker',336,84,'Large','Shadow'],
    ['queen_bakung','Queen Bakung',450,113,'Large','Holy']
  ]}
];

export const MONSTERS = Object.freeze(Object.fromEntries([...MONSTER_CATEGORIES, ...FOREST_MONSTER_CATEGORIES].flatMap(category =>
  category.monsters.map(([id,name,def,mdef,size,element]) =>
    [id,Object.freeze({name,category:category.name,def,mdef,size,element})]))));

export const MONSTER_LOCATIONS = Object.freeze([
  Object.freeze({
    id: 'goblin_junkyard',
    name: 'Goblin Junkyard',
    categories: MONSTER_CATEGORIES,
    monsterIds: Object.freeze(MONSTER_CATEGORIES.flatMap(category => category.monsters.map(([id]) => id)))
  }),
  Object.freeze({
    id: 'enchanted_forest',
    name: 'Enchanted Forest',
    categories: FOREST_MONSTER_CATEGORIES,
    monsterIds: Object.freeze(FOREST_MONSTER_CATEGORIES.flatMap(category => category.monsters.map(([id]) => id)))
  })
]);

// Return a copy, so editing target fields never changes the shared preset.
export function monsterDefaults(id) {
  return MONSTERS[id] ? {...MONSTERS[id]} : null;
}
