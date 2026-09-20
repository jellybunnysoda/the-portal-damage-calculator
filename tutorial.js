const tutorial = document.getElementById('tutorial');
const replay = document.getElementById('tutorialReplay');
const back = document.getElementById('tutorialBack');
const next = document.getElementById('tutorialNext');
const skip = document.getElementById('tutorialSkip');
const example = document.getElementById('tutorialImage');
const bubble = document.querySelector('.tutorialBubble');

const steps = [
  {
    title: 'กรอกข้อมูล Status',
    description: 'เลือก Class, Skill และ Skill Level แล้วกรอกค่าสเตตัสของตัวละคร',
    image: './assets/tutorial-player.png',
    alt: 'ตัวอย่างส่วน Player แสดงการเลือกสกิลและกรอกค่าสเตตัส'
  },
  {
    title: 'เลือก Monster',
    description: 'เลือก Monster แล้วปรับค่าของเป้าหมายให้ตรงกับที่ต้องการทดสอบ',
    image: './assets/tutorial-target.png',
    alt: 'ตัวอย่างส่วน Target แสดงการเลือกมอนสเตอร์และค่าป้องกัน'
  },
  {
    title: 'ความเสียหายที่ทำได้',
    description: 'ตัวเลขใหญ่คือดาเมจเฉลี่ยต่อ Hit; ด้านล่างแสดง Normal และ Critical Hit',
    image: './assets/tutorial-result.png',
    alt: 'ตัวอย่างแผงผลลัพธ์ แสดงดาเมจเฉลี่ย Normal Hit และ Critical Hit'
  }
];

let stepIndex = 0;
let previousFocus = null;
let closeTimer = null;

function renderStep() {
  const step = steps[stepIndex];
  document.getElementById('tutorialProgress').textContent = `✦ วิธีใช้ · ${stepIndex + 1} / ${steps.length}`;
  document.getElementById('tutorialTitle').textContent = step.title;
  document.getElementById('tutorialDescription').textContent = step.description;
  example.src = step.image;
  example.alt = step.alt;
  bubble.scrollTop = 0;
  back.hidden = stepIndex === 0;
  next.textContent = stepIndex === steps.length - 1 ? 'เริ่มใช้งาน' : 'ถัดไป';
}

function openTutorial() {
  if (!tutorial.hidden && !tutorial.classList.contains('isClosing')) return;
  clearTimeout(closeTimer);
  tutorial.classList.remove('isClosing');
  previousFocus = document.activeElement;
  stepIndex = 0;
  renderStep();
  tutorial.hidden = false;
  document.body.classList.add('tutorialOpen');
  document.querySelector('.shell').inert = true;
  next.focus();
}

function closeTutorial() {
  if (tutorial.hidden || tutorial.classList.contains('isClosing')) return;
  tutorial.classList.add('isClosing');
  closeTimer = setTimeout(() => {
    tutorial.hidden = true;
    tutorial.classList.remove('isClosing');
    document.body.classList.remove('tutorialOpen');
    document.querySelector('.shell').inert = false;
    if (previousFocus instanceof HTMLElement && previousFocus !== document.body) previousFocus.focus({preventScroll:true});
    else document.getElementById('classButton').focus({preventScroll:true});
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350);
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
