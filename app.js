import {calculate, calculateDotTick, WEAPON_SIZE, SIZES} from './engine.js?v=20260920-0134';
import {SKILL_CATALOG, getSkill, getSkillLevel, resolveSkill, customSkill} from './skills.js?v=20260920-0134';
import {ELEMENTS, MONSTER_LOCATIONS, MONSTERS, monsterDefaults} from './target-data.js?v=20260920-enchanted-forest';

const $ = id => document.getElementById(id);
const fmt = n => new Intl.NumberFormat('th-TH', {maximumFractionDigits: 2}).format(n);
const pct = n => `${fmt(n * 100)}%`;
const fields = [...document.querySelectorAll('[data-field]')];
const classSelect = $('classSelect'), skillSelect = $('skillSelect'), levelSelect = $('levelSelect');
const weapon = $('weapon');
Object.keys(WEAPON_SIZE).forEach(name => weapon.add(new Option(name, name)));
SIZES.forEach(name => $('size').add(new Option(name, name)));
for (const element of ELEMENTS) {
  $('attackElement').add(new Option(element, element));
  $('targetElement').add(new Option(element, element));
}
const presetSelect=$('targetPreset');
const locationSelect=$('targetLocation');
const monsterIcon=$('monsterIcon');
monsterIcon.addEventListener('error', () => {
  monsterIcon.hidden=true;
  $('monsterFallback').hidden=false;
});
const DEFAULT_MONSTER_ID='cog_crab';
MONSTER_LOCATIONS.forEach(location => locationSelect.add(new Option(location.name,location.id)));
locationSelect.value='goblin_junkyard';
function populateMonsterOptions(preferred=DEFAULT_MONSTER_ID) {
  const location=MONSTER_LOCATIONS.find(item => item.id === locationSelect.value);
  const allowed=new Set(location?.monsterIds ?? []);
  presetSelect.replaceChildren();
  const customGroup=document.createElement('optgroup');
  customGroup.label='Custom';
  customGroup.append(new Option('Custom', 'custom'));
  presetSelect.append(customGroup);
  for (const category of location?.categories ?? []) {
    const options=category.monsters.filter(([id]) => allowed.has(id));
    if (!options.length) continue;
    const group=document.createElement('optgroup');
    group.label=category.name;
    options.forEach(([id,name]) => group.append(new Option(name,id)));
    presetSelect.append(group);
  }
  presetSelect.value=preferred === 'custom' || allowed.has(preferred)
    ? preferred : location?.monsterIds[0] ?? 'custom';
}
populateMonsterOptions();
Object.entries(SKILL_CATALOG).forEach(([id, value]) => classSelect.add(new Option(value.name, id)));
const classButton = $('classButton'), classMenu = $('classMenu');
const classOptions = Object.entries(SKILL_CATALOG).map(([id, value]) => {
  const option = document.createElement('button');
  option.type = 'button';
  option.className = 'classOption';
  option.setAttribute('role', 'option');
  option.dataset.classId = id;
  const icon = document.createElement('img');
  icon.src = `./assets/${id}.webp`;
  icon.alt = '';
  icon.width = icon.height = 30;
  option.append(icon, document.createTextNode(value.name));
  classMenu.append(option);
  option.addEventListener('click', () => {
    if (classSelect.value !== id) {
      classSelect.value = id;
      classSelect.dispatchEvent(new Event('change', {bubbles: true}));
    }
    closeClassMenu(true);
  });
  return option;
});
function syncClassPicker() {
  const id = classSelect.value;
  $('classIcon').src = `./assets/${id}.webp`;
  $('classValue').textContent = SKILL_CATALOG[id]?.name ?? '';
  classOptions.forEach(option => option.setAttribute('aria-selected', String(option.dataset.classId === id)));
}
function closeClassMenu(restoreFocus = false) {
  classMenu.hidden = true;
  classButton.setAttribute('aria-expanded', 'false');
  if (restoreFocus) classButton.focus();
}
function openClassMenu(focusIndex = classOptions.findIndex(option => option.dataset.classId === classSelect.value)) {
  classMenu.hidden = false;
  classButton.setAttribute('aria-expanded', 'true');
  classOptions[Math.max(0, focusIndex)]?.focus();
}
classButton.addEventListener('click', () => classMenu.hidden ? openClassMenu() : closeClassMenu());
classButton.addEventListener('keydown', event => {
  if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
  event.preventDefault();
  const selected = classOptions.findIndex(option => option.dataset.classId === classSelect.value);
  openClassMenu((selected + (event.key === 'ArrowDown' ? 1 : classOptions.length - 1)) % classOptions.length);
});
classMenu.addEventListener('keydown', event => {
  const current = classOptions.indexOf(document.activeElement);
  if (event.key === 'Escape' || event.key === 'Tab') { closeClassMenu(event.key === 'Escape'); return; }
  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? classOptions.length - 1
      : (current + (event.key === 'ArrowDown' ? 1 : classOptions.length - 1)) % classOptions.length;
    classOptions[next]?.focus();
  }
});
document.addEventListener('pointerdown', event => {
  if (!event.target.closest('.classPicker')) closeClassMenu();
});
function skillIconPath(id) {
  return ['enchanter', 'cleric', 'defender', 'warrior'].includes(classSelect.value) && id !== 'custom'
    ? `./assets/skill_${id}.webp` : '';
}
weapon.value = '1H Staff';
$('size').value = 'Medium';

function populateSkills() {
  skillSelect.replaceChildren();
  const skills = SKILL_CATALOG[classSelect.value]?.skills ?? {};
  Object.entries(skills).forEach(([id, skill]) => skillSelect.add(new Option(skill.name, id)));
  skillSelect.add(new Option('Custom Skill', 'custom'));
  populateLevels();
}
function applySkillDefaultElement() {
  $('attackElement').value = getSkill(classSelect.value, skillSelect.value)?.attackElement ?? 'Neutral';
}
function populateLevels() {
  levelSelect.replaceChildren();
  const skill = getSkill(classSelect.value, skillSelect.value);
  if (skill) {
    skill.levels.forEach(row => levelSelect.add(new Option(`Lv. ${row.level}`, String(row.level))));
    levelSelect.disabled = false;
  } else {
    levelSelect.add(new Option('Custom', 'custom'));
    levelSelect.disabled = true;
  }
  updateProjectileDefault();
  $('castsUsed').value = '1';
}
function updateProjectileDefault() {
  const level = getSkillLevel(classSelect.value, skillSelect.value, levelSelect.value);
  const skill = getSkill(classSelect.value, skillSelect.value);
  if (skill?.hitMode === 'projectile' && level) {
    $('projectilesHit').max = String(level.maxProjectiles);
    $('projectilesHit').value = String(level.maxProjectiles);
  }
}
function readFields() {
  const v = {};
  for (const el of fields) {
    v[el.dataset.field] = el.type === 'checkbox' ? el.checked : el.type === 'number' ? Number(el.value) : el.value;
  }
  return v;
}
function selectedSkill(v) {
  return v.skillId === 'custom'
    ? customSkill({damageType: v.customType, baseStat: v.customBase, damagePercent: v.customDamage, hits: v.customHits})
    : resolveSkill(v.classId, v.skillId, v.skillLevel, v.projectilesHit, v.castsUsed);
}
function read() {
  const v = readFields(), skill = selectedSkill(v);
  const fixedMonster = !v.pvp && monsterDefaults(v.targetPreset);
  return {
    skill,
    attacker: {
      type: skill.damageType,
      matk: v.matk, patk: v.patk, maxHp: v.maxHp, def: v.attackerDef, mdef: v.attackerMdef,
      critRate: v.critRate, critDamage: v.critDamage, damageUp: v.damageUp,
      attackElement: v.attackElement, weapon: v.weapon, customWeaponSize: v.customWeaponSize,
      ignoreDef: v.ignoreDef, raceBonus: v.raceBonus, sizeBonus: v.sizeBonus, codexBonus: v.codexBonus
    },
    target: {
      def: fixedMonster?.def ?? v.def, mdef: fixedMonster?.mdef ?? v.mdef,
      size: v.pvp ? null : (fixedMonster?.size ?? v.size),
      element: fixedMonster?.element ?? v.targetElement,
      block: fixedMonster ? 0 : v.block,
      damageReduction: fixedMonster ? 0 : v.damageReduction,
      raceResistance: fixedMonster ? 0 : v.raceResistance,
      pvp: v.pvp
    }
  };
}
function showBaseField(baseStat) {
  const wrappers = {MATK: 'matkWrap', PATK: 'patkWrap', MAX_HP: 'maxHpWrap', DEF: 'attackerDefWrap', MDEF: 'attackerMdefWrap'};
  Object.entries(wrappers).forEach(([stat, id]) => { $(id).hidden = stat !== baseStat; });
}
function renderSkillInfo(skill, result) {
  const summaryIcon = $('skillSummaryIcon');
  const iconPath = skillIconPath(skill.skillId);
  summaryIcon.hidden = !iconPath;
  if (iconPath) summaryIcon.src = iconPath;
  $('skillName').textContent = skill.skillId === 'custom' ? 'Custom Skill' : `${skill.name} · Lv. ${skill.level}`;
  const parts = [
    skill.damageComponent === 'initialHit'
      ? `Initial Hit Damage ${fmt(skill.damagePercent)}%`
      : skill.scalingType === 'hpPercent'
      ? `HP Scaling ${fmt(skill.damagePercent)}%`
      : skill.damagePercentType === 'totalPerCast'
      ? `Total Skill Damage ${fmt(skill.damagePercent)}% / Cast`
      : skill.damagePercentType === 'total'
      ? `Total Skill Damage ${fmt(skill.damagePercent)}%`
      : `Skill Damage ${fmt(skill.damagePercent)}%`,
    `Base ${skill.baseStat.replace('_', ' ')}`,
    skill.damageType === 'magic' ? 'Magic' : 'Physical'
  ];
  if (skill.hitMode === 'single') parts.push('Hits 1');
  if (skill.hitMode === 'multi-hit') {
    parts.push(`Hits ${skill.hits}`);
    if (skill.hitsPerCast) {
      parts.push(`Hits per Cast ${skill.hitsPerCast} · Casts Used ${skill.castsUsed}`);
      parts.push(`Total base scaling ${fmt(skill.damagePercent * skill.castsUsed)}% ${skill.baseStat.replace('_', ' ')}`);
    }
    parts.push(`Damage per ${skill.hitUnit === 'slash' ? 'Slash' : 'Hit'} ${fmt(result.damagePercentPerHit)}% ${skill.baseStat.replace('_', ' ')}`);
    parts.push(`Base damage per Hit ${fmt(result.baseSkillDamage)}`);
  }
  if (skill.cooldown != null) parts.push(`Cooldown ${fmt(skill.cooldown)}`);
  if (skill.mpCost != null) parts.push(`MP ${fmt(skill.mpCost)}`);
  if (skill.metadata?.tier) parts.push(`Tier ${skill.metadata.tier}`);
  if (skill.metadata?.intRequired != null) parts.push(`INT ${skill.metadata.intRequired}`);
  if (skill.metadata?.wisRequired != null) parts.push(`WIS ${skill.metadata.wisRequired}`);
  if (skill.metadata?.vitRequired != null) parts.push(`VIT ${skill.metadata.vitRequired}`);
  if (skill.metadata?.strRequired != null) parts.push(`STR ${skill.metadata.strRequired}`);
  if (skill.metadata?.radius != null) parts.push(`Radius ${skill.metadata.radius}`);
  if (skill.metadata?.aoe != null) parts.push(`AoE ${skill.metadata.aoe}`);
  if (skill.metadata?.aoeRadius != null) parts.push(`AoE Radius ${skill.metadata.aoeRadius}`);
  if (skill.metadata?.rootChance != null) parts.push(`Root ${skill.metadata.rootChance}% / ${skill.metadata.rootDuration}s`);
  if (skill.metadata?.stunDuration != null) parts.push(`Stun ${skill.metadata.stunDuration}s`);
  if (skill.metadata?.bellDuration != null) parts.push(`Bell Duration ${skill.metadata.bellDuration}s`);
  if (skill.metadata?.jumpRange != null) parts.push(`Jump Range ${skill.metadata.jumpRange}`);
  if (skill.metadata?.duration != null) parts.push(`Duration ${skill.metadata.duration}s`);
  if (skill.metadata?.moveSpeed != null) parts.push(`Move Spd ${skill.metadata.moveSpeed}`);
  if (skill.metadata?.tauntDuration != null) parts.push(`Taunt ${skill.metadata.tauntDuration}s`);
  if (skill.metadata?.threatBonus != null) parts.push(`Threat Bonus ${skill.metadata.threatBonus}`);
  if (skill.hitMode === 'projectile') parts.push(`Max ${skill.maxProjectiles} projectiles`);
  $('skillMeta').textContent = parts.join(' · ');
  $('skillNote').textContent = skill.dot?.enabled ? 'Initial hit and provisional DoT per tick are shown separately.' : '';
  $('skillNote').hidden = !skill.dot?.enabled;
  $('customSkillFields').hidden = skill.skillId !== 'custom';
  $('projectileWrap').hidden = skill.hitMode !== 'projectile';
  $('castsWrap').hidden = !skill.hitsPerCast;
  $('projectileMetrics').hidden = skill.hitMode !== 'projectile';
  $('projectileLimit').textContent = skill.hitMode === 'projectile'
    ? `สูงสุด ${skill.maxProjectiles} ลูก · แต่ละลูกคิด Roll และ Crit แยกกัน` : '';
  $('averageLabel').textContent = skill.dot?.enabled ? '✦ Initial Hit · Expected Damage'
    : skill.hitMode === 'projectile' ? '✦ Average Damage per Projectile' : '✦ ค่าเฉลี่ยต่อ Hit';
  showBaseField(skill.baseStat);
}
function render() {
  const input = read(), skill = input.skill, r = calculate(input);
  const dot = calculateDotTick(input);
  renderSkillInfo(skill, r);
  $('dotPanel').hidden = !dot;
  $('totalLabel').textContent = dot ? 'Initial Hit Expected Damage' : 'Total Expected Damage';
  $('breakdownTitle').textContent = dot ? 'Formula breakdown · Initial Hit' : 'Formula breakdown';
  if (dot) {
    $('dotScaling').textContent = `${fmt(dot.scalingPercent)}% ${skill.dot.baseStat.replace('_', ' ')} / tick`;
    $('dotDamage').textContent = `${fmt(dot.damage.min)}–${fmt(dot.damage.max)}`;
    $('dotInterval').textContent = `~${fmt(dot.tickInterval)} sec`;
    $('dotDuration').textContent = `${fmt(dot.bellDuration)} sec`;
  }
  $('targetGrid').hidden = !input.target.pvp && !!MONSTERS[presetSelect.value];
  $('targetSizeWrap').hidden = input.target.pvp;
  $('targetSelectors').hidden = input.target.pvp;
  const monster=MONSTERS[presetSelect.value];
  $('monsterSummary').hidden = input.target.pvp || !monster;
  if (monster && !input.target.pvp) {
    monsterIcon.hidden=false;
    $('monsterFallback').hidden=true;
    const iconPath=`./assets/monster_${presetSelect.value}.webp`;
    if (monsterIcon.getAttribute('src') !== iconPath) monsterIcon.src=iconPath;
    $('monsterName').textContent = monster.name;
    $('monsterStats').textContent = `${monster.category} · ${monster.size} · ${monster.element} · DEF ${monster.def} · MDEF ${monster.mdef}`;
  }
  $('customWrap').hidden = input.attacker.weapon !== 'Custom';
  for (const key of ['normal','critical','average','min','max','total']) $(key).textContent = fmt(r[key]);
  $('baseProjectileDamage').textContent = fmt(r.baseSkillDamage);
  $('averageProjectileDamage').textContent = fmt(r.average);
  $('maxPossibleProjectiles').textContent = fmt(r.maxProjectiles);
  $('hitsOut').textContent = `${r.hits} ${skill.hitMode === 'projectile' ? 'projectiles hit' : 'hits'}`;
  $('avgRange').textContent = skill.hitMode === 'multi-hit'
    ? `ช่วงค่าเฉลี่ยตาม Roll ต่อ Hit: ${fmt(r.averageMin)}–${fmt(r.averageMax)} · รวม ${r.hits} Hit: ${fmt(r.totalMin)}–${fmt(r.totalMax)}`
    : `ช่วงค่าเฉลี่ยตาม Roll: ${fmt(r.averageMin)}–${fmt(r.averageMax)}`;
  $('defInfo').textContent = `${r.damageType === 'magic' ? 'MDEF ×2' : 'DEF'} ${fmt(r.defenseBeforeIgnore)} → หลัง IGN ${fmt(r.effectiveDefense)} → ลด ${pct(r.defenseReduction)}`;
  $('sizeInfo').textContent = input.target.pvp ? 'Weapon Size และ Damage vs Size: N/A (PvP)' : `${input.attacker.weapon} vs ${input.target.size}: ${fmt(r.sizePct)}%`;
  $('breakdown').innerHTML = r.normalPath.map((step, i) =>
    `<tr><td><span class="step">${String(i+1).padStart(2,'0')}</span>${step.label}${step.label === 'Element' ? `<br><small>${input.attacker.attackElement} → ${input.target.element} (${fmt(r.elementPercent)}%)</small>` : ''}</td><td>${input.target.pvp && ['Weapon Size','Size bonus'].includes(step.label) ? 'N/A (PvP)' : `×${fmt(step.factor)}${step.label === 'PvP' && input.target.pvp ? ' (÷10)' : ''}`}</td><td>${fmt(step.value)}</td><td>${i < 3 ? '' : fmt(r.criticalPath[i].value)}</td></tr>`
  ).join('');
  $('critNote').textContent = `ค่าเฉลี่ย = Normal × ${fmt((1-r.critRate)*100)}% + Critical × ${fmt(r.critRate*100)}%`;
}
classSelect.addEventListener('change', () => {
  syncClassPicker();
  const defaults = {critRate: '5', critDamage: '120'};
  $('attackerStatFields').querySelectorAll('input[type="number"]').forEach(input => {
    input.value = defaults[input.dataset.field] ?? '0';
  });
  populateSkills();
  applySkillDefaultElement();
  render();
});
skillSelect.addEventListener('change', () => { populateLevels(); applySkillDefaultElement(); render(); });
levelSelect.addEventListener('change', () => { updateProjectileDefault(); render(); });
let savedPresetTarget=null;
let savedCustomTarget=null;
let previousPreset=DEFAULT_MONSTER_ID;
function targetSnapshot() {
  return {
    size:$('size').value,def:$('targetDef').value,mdef:$('targetMdef').value,element:$('targetElement').value,
    block:$('targetBlock').value,damageReduction:$('targetDamageReduction').value,
    raceResistance:$('targetRaceResistance').value
  };
}
function setTarget(snapshot) {
  $('size').value=snapshot.size;
  $('targetDef').value=snapshot.def;
  $('targetMdef').value=snapshot.mdef;
  $('targetElement').value=snapshot.element;
  $('targetBlock').value=snapshot.block ?? 0;
  $('targetDamageReduction').value=snapshot.damageReduction ?? 0;
  $('targetRaceResistance').value=snapshot.raceResistance ?? 0;
}
presetSelect.addEventListener('change', () => {
  const monster=monsterDefaults(presetSelect.value);
  if (monster) {
    if (previousPreset === 'custom') savedCustomTarget=targetSnapshot();
    setTarget(monster);
  } else if (savedCustomTarget) {
    setTarget(savedCustomTarget);
  }
  previousPreset=presetSelect.value;
  render();
});
locationSelect.addEventListener('change', () => {
  const previousSelection=presetSelect.value;
  populateMonsterOptions(previousSelection);
  if (presetSelect.value !== 'custom') setTarget(monsterDefaults(presetSelect.value));
  previousPreset=presetSelect.value;
  render();
});
$('pvp').addEventListener('change', () => {
  if ($('pvp').checked && MONSTERS[presetSelect.value]) {
    savedPresetTarget=targetSnapshot();
    setTarget({size:'Medium',def:0,mdef:0,element:'Neutral'});
  } else if (!$('pvp').checked && savedPresetTarget) {
    setTarget(monsterDefaults(presetSelect.value));
    savedPresetTarget=null;
  }
  render();
});
fields.filter(el => ![classSelect, skillSelect, levelSelect, locationSelect, presetSelect, $('pvp')].includes(el)).forEach(el => el.addEventListener('input', () => {
  if (['critRate', 'critDamage', 'damageUp'].includes(el.dataset.field) && el.value !== '' && Number(el.value) > Number(el.max)) {
    el.value = el.max;
  }
  render();
}));
$('reset').addEventListener('click', () => {
  document.querySelector('form').reset();
  savedPresetTarget=null;
  savedCustomTarget=null;
  previousPreset=DEFAULT_MONSTER_ID;
  presetSelect.value=DEFAULT_MONSTER_ID;
  locationSelect.value='goblin_junkyard';
  populateMonsterOptions(DEFAULT_MONSTER_ID);
  setTarget(monsterDefaults(DEFAULT_MONSTER_ID));
  classSelect.value = 'enchanter';
  syncClassPicker();
  populateSkills();
  applySkillDefaultElement();
  weapon.value = '1H Staff';
  $('size').value = 'Medium';
  render();
});
classSelect.value = 'enchanter';
syncClassPicker();
populateSkills();
applySkillDefaultElement();
presetSelect.value=DEFAULT_MONSTER_ID;
setTarget(monsterDefaults(DEFAULT_MONSTER_ID));
render();
