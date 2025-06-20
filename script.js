function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("hidden");
}

function toggleTasks() {
  document.getElementById("tasks").classList.toggle("hidden");
}

function loadAddYear() {
  document.getElementById("dynamic-content").innerHTML = `
    <div style="margin-top: 20px; background: white; padding: 15px; border-radius: 10px;">
      <h2>إضافة سنة دراسية</h2>
      <p>اختر السنة التي تريد إضافتها:</p>
      <ul>
        <li><button onclick="initYear('سنة أولى')">سنة أولى</button></li>
        <li><button onclick="initYear('سنة ثانية')">سنة ثانية</button></li>
        <li><button onclick="initYear('سنة ثالثة')">سنة ثالثة</button></li>
        <li><button onclick="initYear('سنة رابعة')">سنة رابعة</button></li>
        <li><button onclick="initYear('سنة خامسة')">سنة خامسة</button></li>
        <li><button onclick="initYear('الامتياز')">الامتياز</button></li>
      </ul>
    </div>
  `;
}

function initYear(yearName) {
  if (yearName === "الامتياز") {
    goToYear("الامتياز");
    return;
  }

  document.getElementById("dynamic-content").innerHTML = `
    <div style="margin-top: 20px; background: white; padding: 15px; border-radius: 10px;">
      <h2>📘 ${yearName}</h2>
      <button onclick="showAddSubjectForm('${yearName}')">➕ إضافة مادة</button>
      <ul id="subjects-list-${yearName}"></ul>
    </div>
  `;
}

function showAddSubjectForm(yearName) {
  const subjectName = prompt("أدخل اسم المادة:");
  if (!subjectName) return;

  const subjectList = document.getElementById(`subjects-list-${yearName}`);
  const li = document.createElement("li");
  li.style.cursor = "pointer";
  li.textContent = subjectName;
  li.onclick = () => openSubject(yearName, subjectName);
  subjectList.appendChild(li);
}

function openSubject(yearName, subjectName) {
  document.getElementById("dynamic-content").innerHTML = `
    <div style="margin-top: 20px; background: white; padding: 15px; border-radius: 10px;">
      <h2>📚 ${subjectName} - ${yearName}</h2>
      <p>اختر نوع المحتوى:</p>
      <button onclick="loadSection('${subjectName}', 'محاضرات')">📘 المحاضرات</button>
      <button onclick="loadSection('${subjectName}', 'سكاشن')">📝 السكاشن</button>
    </div>
  `;
}


function goToYear(yearName) {
  let content = "";

  if (yearName === "الامتياز") {
    content = `
      <div style="margin-top: 20px; background: white; padding: 15px; border-radius: 10px;">
        <h2>📁 ${yearName}</h2>
        <p>هنا يمكنك رفع صورة أو ملف متعلق بسنة الامتياز.</p>
        <input type="file" accept=".pdf,.jpg,.png,.doc,.docx" />
      </div>
    `;
  } else {
    content = `
      <div style="margin-top: 20px; background: white; padding: 15px; border-radius: 10px;">
        <h2>📘 ${yearName}</h2>
        <p>اختر نوع المحتوى:</p>
        <button onclick="loadSection('${yearName}', 'محاضرات')">📘 المحاضرات</button>
        <button onclick="loadSection('${yearName}', 'سكاشن')">📝 السكاشن</button>
      </div>
    `;
  }

  document.getElementById("dynamic-content").innerHTML = content;
}

function loadSection(yearName, sectionType) {
  document.getElementById("dynamic-content").innerHTML = `
    <div style="margin-top: 20px; background: white; padding: 15px; border-radius: 10px;">
      <h2>${sectionType} - ${yearName}</h2>
      <p>هنا يتم عرض أو إضافة ${sectionType === 'محاضرات' ? 'المحاضرات' : 'السكاشن'} الخاصة بـ ${yearName}.</p>
    </div>
  `;
}

function loadSection(subjectName, sectionType) {
  const key = `${subjectName}-${sectionType}`;
  if (!window.sections) window.sections = {};
  if (!window.sections[key]) window.sections[key] = [];

  const sectionList = window.sections[key];

  const listItems = sectionList.map((_, index) => {
    const itemTitle = sectionType === "محاضرات" ? `Lec-${index + 1}` : `Tut-${index + 1}`;
    return `<li onclick="openSectionDetail('${key}', ${index}, '${itemTitle}')"
                style="cursor:pointer; color:#007bff;">📄 ${itemTitle}</li>`;
  }).join("");

  document.getElementById("dynamic-content").innerHTML = `
    <div style="margin-top: 20px; background: white; padding: 15px; border-radius: 10px;">
      <h2>${sectionType} - ${subjectName}</h2>
      <button onclick="addSectionItem('${subjectName}', '${sectionType}')">➕ إضافة ${sectionType === 'محاضرات' ? 'محاضرة' : 'سكشن'}</button>
      <ul id="section-list">
        ${listItems || "<li>لا يوجد محتوى بعد.</li>"}
      </ul>
    </div>
  `;
}

function openSectionDetail(key, index, itemTitle) {
  const filesKey = `${key}-${index}`;
  if (!window.uploads) window.uploads = {};
  if (!window.uploads[filesKey]) window.uploads[filesKey] = [];

  const uploaded = window.uploads[filesKey].map(file => `<li>${file.name}</li>`).join("");

  document.getElementById("dynamic-content").innerHTML = `
    <div style="margin-top:20px; background:white; padding:15px; border-radius:10px;">
      <h2>${itemTitle}</h2>
      <input type="file" multiple accept=".pdf,.jpg,.png,.mp3,.wav,.doc,.docx"
             onchange="handleUpload(event, '${filesKey}')" />
      <h3>📎 الملفات المرفوعة:</h3>
      <ul id="uploaded-files">
        ${uploaded || "<li>لا توجد ملفات.</li>"}
      </ul>
      <button onclick="loadSectionFromKey('${key}')">🔙 الرجوع</button>
    </div>
  `;
}

function handleUpload(event, filesKey) {
  const files = Array.from(event.target.files);
  if (!window.uploads[filesKey]) window.uploads[filesKey] = [];
  window.uploads[filesKey].push(...files);

  openSectionDetail(filesKey.split("-").slice(0, -1).join("-"), parseInt(filesKey.split("-").pop()), filesKey.split("-").slice(-1)[0]);
}
function loadSectionFromKey(key) {
  const [subjectName, sectionType] = key.split("-");
  loadSection(subjectName, sectionType);
}


function addSectionItem(subjectName, sectionType) {
  const key = `${subjectName}-${sectionType}`;
  if (!window.sections) window.sections = {};
  if (!window.sections[key]) window.sections[key] = [];

  window.sections[key].push({}); // مجرد عنصر فاضي، هيتعرض برقم تلقائي

  loadSection(subjectName, sectionType); // إعادة تحميل المحتوى
}

function updateTasksList() {
  const tasksUl = document.getElementById("tasks");
  tasksUl.innerHTML = ""; // امسح المهام القديمة

  if (!window.sections) return;

  Object.keys(window.sections).forEach((key) => {
    const sectionList = window.sections[key];

    sectionList.forEach((_, index) => {
      const itemId = `${key}-${index}`;
      const isChecked = localStorage.getItem(itemId) === "true";

      if (!isChecked) {
        const [subjectName, sectionType] = key.split("-");
        const itemTitle = sectionType === "محاضرات" ?` محاضرة ${index + 1}` :` سكشن ${index + 1}`;
        const li = document.createElement("li");
        li.innerHTML = `📌 <a href="#${itemId}" onclick="goToStoredSection('${key}', ${index})">${itemTitle} - ${subjectName}</a>`;
        tasksUl.appendChild(li);
      }
    });
  });
}

function goToStoredSection(key, index) {
  const itemTitle = key.includes("محاضرات") ? `Lec-${index + 1}` : `Tut-${index + 1}`;
  openSectionDetail(key, index, itemTitle);
}

function addSectionItem(subjectName, sectionType) {
  const key = `${subjectName}-${sectionType}`;
  if (!window.sections) window.sections = {};
  if (!window.sections[key]) window.sections[key] = [];

  window.sections[key].push({});
  loadSection(subjectName, sectionType);
}

function loadSection(subjectName, sectionType) {
  const key = `${subjectName}-${sectionType}`;
  if (!window.sections) window.sections = {};
  if (!window.sections[key]) window.sections[key] = [];

  const sectionList = window.sections[key];

  const listItems = sectionList.map((_, index) => {
    const itemId = `${key}-${index}`;
    const itemTitle = sectionType === "محاضرات" ? `Lec-${index + 1}` : `Tut-${index + 1}`;
    const isChecked = localStorage.getItem(itemId) === "true";

    return `
      <li style="display:flex;align-items:center;gap:10px;" id="${itemId}">
        <input type="checkbox" onchange="toggleStudied('${itemId}')" ${isChecked ? "checked" : ""}/>
        <span onclick="openSectionDetail('${key}', ${index}, '${itemTitle}')" style="cursor:pointer; color:#007bff;">📄 ${itemTitle}</span>
      </li>`;
  }).join("");

  const percentage = Math.round(
    (sectionList.filter((_, index) => localStorage.getItem(`${key}-${index}`) === "true").length / sectionList.length) * 100
  );

  document.getElementById("dynamic-content").innerHTML = `
    <div style="margin-top:20px; background:white; padding:15px; border-radius:10px;">
      <h2>${sectionType} - ${subjectName}</h2>
      <p style="margin-bottom:10px;">تمت مذاكرة ${percentage}%</p>
      <button onclick="addSectionItem('${subjectName}', '${sectionType}')">➕ إضافة ${sectionType === 'محاضرات' ? 'محاضرة' : 'سكشن'}</button>
      <ul id="section-list">
        ${listItems || "<li>لا يوجد محتوى بعد.</li>"}
      </ul>
    </div>
  `;

  updateTasksList();
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.querySelector(".overlay");

  const isHidden = sidebar.classList.contains("hidden");

  if (isHidden) {
    sidebar.classList.remove("hidden");
    overlay.classList.add("active");
  } else {
    sidebar.classList.add("hidden");
    overlay.classList.remove("active");
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.querySelector('.menu-toggle');
  const overlay = document.querySelector('.overlay');

  toggleButton.addEventListener('click', function () {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  // إغلاق القائمة لو ضغط المستخدم براها
  document.addEventListener('click', function (e) {
    if (
      window.innerWidth <= 768 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !toggleButton.contains(e.target)
    ) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
  });
});
