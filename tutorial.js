const tutorial = document.getElementById('tutorial');
const replay = document.getElementById('tutorialReplay');
const back = document.getElementById('tutorialBack');
const next = document.getElementById('tutorialNext');
const skip = document.getElementById('tutorialSkip');

const steps = [
  {
    title: 'เริ่มที่ข้อมูล Player',
    description: 'เลือก Class → Skill → Skill Level แล้วกรอกค่าสเตตัสของตัวละคร เช่น M.ATK, Crit Rate และ Damage Up',
    tip: 'เลือกสกิลแล้วระบบจะเติมข้อมูลสกิลให้เอง หากเป็นสกิลหลาย Hit ให้ระบุจำนวนที่โดนเป้าหมาย'
  },
  {
    title: 'เลือก Target ที่ต้องการทดสอบ',
    description: 'เลือก Monster เพื่อเติมขนาด ธาตุ DEF และ MDEF อัตโนมัติ หรือแก้ตัวเลขเองให้ตรงกับเป้าหมาย',
    tip: 'ถ้าคำนวณสู้กับผู้เล่น ให้เปิด PvP ระบบจะคิดดาเมจขั้นสุดท้าย ÷10 และไม่ใช้ขนาดมอนสเตอร์'
  },
  {
    title: 'อ่านผลลัพธ์ของคุณ',
    description: 'ตัวเลขใหญ่คือดาเมจเฉลี่ยต่อ Hit ส่วนด้านล่างแสดง Normal, Critical, ช่วง Roll 90–110% และผลรวมเมื่อโดนหลาย Hit',
    tip: 'เปิด Formula breakdown เพื่อดูว่าตัวคูณแต่ละขั้นเปลี่ยนดาเมจอย่างไร'
  }
];

let stepIndex = 0;
let previousFocus = null;

function renderStep() {
  const step = steps[stepIndex];
  document.getElementById('tutorialProgress').textContent = `✦ วิธีใช้ · ${stepIndex + 1} / ${steps.length}`;
  document.getElementById('tutorialTitle').textContent = step.title;
  document.getElementById('tutorialDescription').textContent = step.description;
  document.getElementById('tutorialTip').textContent = step.tip;
  back.hidden = stepIndex === 0;
  next.textContent = stepIndex === steps.length - 1 ? 'เริ่มใช้งาน' : 'ถัดไป';
}

function openTutorial() {
  if (!tutorial.hidden) return;
  previousFocus = document.activeElement;
  stepIndex = 0;
  renderStep();
  tutorial.hidden = false;
  document.body.classList.add('tutorialOpen');
  document.querySelector('.shell').inert = true;
  next.focus();
}

function closeTutorial() {
  tutorial.hidden = true;
  document.body.classList.remove('tutorialOpen');
  document.querySelector('.shell').inert = false;
  if (previousFocus instanceof HTMLElement && previousFocus !== document.body) previousFocus.focus({preventScroll:true});
  else document.getElementById('classButton').focus({preventScroll:true});
}

back.addEventListener('click', () => {
  if (stepIndex > 0) {
    stepIndex--;
    renderStep();
    next.focus();
  }
});

next.addEventListener('click', () => {
  if (stepIndex === steps.length - 1) closeTutorial();
  else {
    stepIndex++;
    renderStep();
    next.focus();
  }
});

skip.addEventListener('click', closeTutorial);
replay.addEventListener('click', openTutorial);

tutorial.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeTutorial();
  }
  if (event.key !== 'Tab') return;
  const controls = [...tutorial.querySelectorAll('button:not([hidden])')];
  const first = controls[0];
  const last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

openTutorial();
window.addEventListener('pageshow', event => {
  if (event.persisted) openTutorial();
});
