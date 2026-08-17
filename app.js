const screens = {
  login: document.getElementById("loginScreen"),
  queue: document.getElementById("queueScreen"),
  document: document.getElementById("documentScreen"),
  submitted: document.getElementById("submittedScreen"),
  newPoint: document.getElementById("newPointScreen")
};

const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyKGdThaFdAWX-yW-Vy_Lt1jy6nDbLPrIGfqIZ7A2BDg45tmS8PaoTeyf9IIEa6HZh6Nw/exec";
const PILOT_PIN = "1234";
const fallbackMerhavim = [
  { merhavId: "בנימינה-גבעת-עדה-יישובי-אלונה", merhavName: "בנימינה / גבעת עדה + יישובי אלונה" },
  { merhavId: "זכרון-יעקב", merhavName: "זכרון יעקב+" },
  { merhavId: "קיסריה-אור-עקיבה", merhavName: "קיסריה / אור עקיבה +" },
  { merhavId: "פרדס-חנה", merhavName: "פרדס חנה" },
  { merhavId: "חדרה-מנשה", merhavName: "חדרה מנשה" },
  { merhavId: "עמק-חפר", merhavName: "עמק חפר" },
  { merhavId: "נתניה", merhavName: "נתניה +" }
];
const fallbackGoldPoints = [
  ["GOLD-001", "בנימינה-גבעת-עדה-יישובי-אלונה", "בנימינה / גבעת עדה + יישובי אלונה", "בנימינה-גבעת עדה", "בי\"ס אשכולות", "המורה, בנימינה-גבעת עדה"],
  ["GOLD-002", "פרדס-חנה", "פרדס חנה", "פרדס חנה-כרכור", "ביה\"ס ממלכתי מעיינות", "צליל,7, פרדס חנה-כרכור"],
  ["GOLD-003", "נתניה", "נתניה +", "אבן יהודה", "בית חינוך בית אב\"י", "העצמאות,140, אבן יהודה"],
  ["GOLD-004", "נתניה", "נתניה +", "קדימה-צורן", "מתנ\"ס צורן+ביה\"ס לב-רן", "דרך לב השרון צורן,1 +דרך לב השרון צורן,2, קדימה-צורן"],
  ["GOLD-005", "קיסריה-אור-עקיבה", "קיסריה / אור עקיבה +", "קיסריה", "בית ספר קיסריה-מבנה דרומי+בית ספר קיסריה-מבנה צפוני", "שד רוטשילד,30 +שד רוטשילד,30, קיסריה"],
  ["GOLD-006", "זכרון-יעקב", "זכרון יעקב+", "זכרון יעקב", "בית ספר החיטה", "דרך אהרן,4, זכרון יעקב"],
  ["GOLD-007", "זכרון-יעקב", "זכרון יעקב+", "זכרון יעקב", "בי\"ס ממלכתי נילי", "שד ניל\"י, זכרון יעקב"],
  ["GOLD-008", "נתניה", "נתניה +", "נתניה", "בי\"ס רימלט", "מעפילי אגוז,5, נתניה"],
  ["GOLD-009", "עמק-חפר", "עמק חפר", "בת חפר", "בי\"ס שדות-בת חפר", "חלבלוב, בת חפר"],
  ["GOLD-010", "נתניה", "נתניה +", "נתניה", "ביה\"ס חיים חפר", "ברמן בני,4, נתניה"],
  ["GOLD-011", "נתניה", "נתניה +", "תל מונד", "ביה\"ס נוף ילדות", "החצב,1, תל מונד"],
  ["GOLD-012", "נתניה", "נתניה +", "נתניה", "בי\"ס ע\"ש אהרון דוידי", "שמורת נחל שניר,3, נתניה"],
  ["GOLD-013", "נתניה", "נתניה +", "נתניה", "בי\"ס ממלכתי ע\"ש מנחם בגין", "גור מרדכי,4, נתניה"],
  ["GOLD-014", "פרדס-חנה", "פרדס חנה", "פרדס חנה-כרכור", "בי\"ס שדות", "נחלה,34, פרדס חנה-כרכור"],
  ["GOLD-015", "נתניה", "נתניה +", "תל מונד", "בי\"ס שלנו", "הדקל,64, תל מונד"],
  ["GOLD-016", "פרדס-חנה", "פרדס חנה", "פרדס חנה-כרכור", "בי\"ס חורב-אגודה", "מצדה,314, פרדס חנה-כרכור"],
  ["GOLD-017", "נתניה", "נתניה +", "תל מונד", "מתנ\"ס תל מונד", "הדקל,31, תל מונד"],
  ["GOLD-018", "חדרה-מנשה", "חדרה מנשה", "חדרה", "ביה\"ס עש אילן רמון כניסה ראשית+ביה\"ס עש אילן רמון שער אחורי", "רבין יצחק,56 +רבין יצחק,56, חדרה"],
  ["GOLD-019", "נתניה", "נתניה +", "נתניה", "מרכז קהילתי אופק+העמותה לחינוך הבלתי פורמלי", "אחימאיר,9 +אחימאיר,9, נתניה"],
  ["GOLD-020", "בנימינה-גבעת-עדה-יישובי-אלונה", "בנימינה / גבעת עדה + יישובי אלונה", "בנימינה-גבעת עדה", "בית ספר גבע", "הניצנים,17, בנימינה-גבעת עדה"],
  ["GOLD-021", "זכרון-יעקב", "זכרון יעקב+", "זכרון יעקב", "בי\"ס החורש", "דרך פינלס, זכרון יעקב"],
  ["GOLD-022", "זכרון-יעקב", "זכרון יעקב+", "מעגן מיכאל", "מועדון האסם", "מעגן מיכאל"],
  ["GOLD-023", "חדרה-מנשה", "חדרה מנשה", "חדרה", "בי\"ס אחד העם כניסה משער צפוני+בי\"ס אחד העם כניסה משער ראשי", "אחד העם,19 +אחד העם,19, חדרה"],
  ["GOLD-024", "נתניה", "נתניה +", "כפר יונה", "בית הספר רימון", "יקינטון,4, כפר יונה"],
  ["GOLD-025", "חדרה-מנשה", "חדרה מנשה", "חדרה", "בי\"ס צפרירים כ. ראשית רח' אלון", "האלון,30, חדרה"],
  ["GOLD-026", "עמק-חפר", "עמק חפר", "בית יצחק-שער חפר", "בית העם", "בית יצחק-שער חפר"],
  ["GOLD-027", "פרדס-חנה", "פרדס חנה", "פרדס חנה-כרכור", "בי\"ס ממלכתי כרכור", "המייסדים,73, פרדס חנה-כרכור"],
  ["GOLD-028", "פרדס-חנה", "פרדס חנה", "פרדס חנה-כרכור", "בי\"ס ממלכתי אלונים", "הנדיב,1, פרדס חנה-כרכור"],
  ["GOLD-029", "נתניה", "נתניה +", "פרדסיה", "בי\"ס תפוז+אולם ספורט-מול בי\"ס", "רמב\"ם,35 +רמב\"ם,36, פרדסיה"],
  ["GOLD-030", "חדרה-מנשה", "חדרה מנשה", "חדרה", "בי\"ס מדעים ויהדות", "משמר הגבול,1, חדרה"],
  ["GOLD-031", "חדרה-מנשה", "חדרה מנשה", "חדרה", "בי\"ס תחכמוני חדש", "שדרות כושי עפגין,7, חדרה"],
  ["GOLD-032", "נתניה", "נתניה +", "נתניה", "בי\"ס שלהבות (הרי\"ף)", "החפץ חיים,801, נתניה"]
].map((row, index) => ({
  pointId: row[0],
  type: "cluster",
  number: `אשכול זהב ${String(index + 1).padStart(3, "0")}`,
  merhavId: row[1],
  merhavName: row[2],
  settlementName: row[3],
  pointName: row[4],
  plannedAddress: row[5],
  status: "Open for documentation",
  priority: "1",
  notes: "נטען מרשימת אשכולות זהב מקומית"
}));
const appState = {
  hierarchy: { districts: [], merhavim: [], settlements: [] },
  points: [],
  currentUser: "",
  currentMerhavId: "",
  currentMerhavName: "",
  currentPoint: null,
  correctedLocation: null
};

const missionPlans = {
  cluster: [
    { title: "צילום הכניסה", help: "צילום ברור של המקום והכניסה.", photo: "צלם כניסה", control: `<select><option>כן, ברור</option><option>צריך צילום נוסף</option><option>עדיין לא ברור</option></select>` },
    { title: "מיקום הדוכן", help: "איפה בדיוק עומדים.", photo: "צלם מיקום", control: `<input inputmode="decimal" placeholder="כמה מטרים?">` },
    { title: "הערות למיקום", help: "כל מה שצריך לדעת לפני שמגיעים.", photo: "צילום נוסף אם צריך", control: `<textarea rows="3" placeholder="גישה, מדרכות, אנשים, חסימות..."></textarea>` }
  ],
  signage: [
    { title: "צילום מרחוק", help: "איך המקום נראה מהרחוב.", photo: "צלם מרחוק", control: `<select><option>כן, ברור</option><option>צריך עוד תמונה</option></select>` },
    { title: "צילום תקריב", help: "איפה השלט ייתלה.", photo: "צלם תקריב", control: `<textarea rows="2" placeholder="מה נדרש לתלייה?"></textarea>` },
    { title: "מדידות והערות", help: "רוחב, גובה, גישה וסיכון.", photo: "צילום עם סימון", control: `<textarea rows="3" placeholder="רוחב, גובה, ציוד, חניה, שפה מיוחדת..."></textarea>` }
  ],
  booth: [
    { title: "צילום המקום", help: "איך המקום נראה ומה עובר שם.", photo: "צלם מקום", control: `<select><option>צפוף ומתאים</option><option>סביר</option><option>דורש בדיקה</option></select>` },
    { title: "שעות מומלצות", help: "מתי כן ומתי לא.", photo: "צילום עם סימון", control: `<textarea rows="2" placeholder="מתי כן ומתי לא?"></textarea>` },
    { title: "הערות למקום", help: "ציוד, קהל, גישה וסיכון.", photo: "צילום נוסף אם צריך", control: `<textarea rows="3" placeholder="ציוד, צפיפות, חסימות, חניה..."></textarea>` }
  ]
};

let currentType = "cluster";
let selectedNewType = "";
let activePhotoTarget = null;
let activePhotoInput = null;
let pendingPhotoItem = null;
let activePhotoEditorItem = null;
let photoEditor = null;
let editorCaption = null;
let editorToolMode = "arrow";
let activePhotoSource = "";
const photoCache = new Map();
const buildStampValue = "2026-08-17 16:20:00";
const buildStamp = document.getElementById("buildStamp");
if (buildStamp) {
  buildStamp.textContent = `גרסת שטח: ${buildStampValue} IL`;
}

function setLoadStatus(message, mode = "") {
  const status = document.getElementById("loadStatus");
  if (!status) return;
  status.textContent = message;
  status.dataset.mode = mode;
}

function encodePayload(payload) {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => binary += String.fromCharCode(byte));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function jsonp(action, params = {}) {
  return new Promise((resolve, reject) => {
    const callback = `fieldDocCallback_${Date.now()}_${Math.round(Math.random() * 100000)}`;
    const url = new URL(BACKEND_URL);
    url.searchParams.set("action", action);
    url.searchParams.set("callback", callback);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value);
    });
    const script = document.createElement("script");
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("לא התקבלה תשובה מהשרת"));
    }, 18000);
    function cleanup() {
      window.clearTimeout(timer);
      script.remove();
      delete window[callback];
    }
    window[callback] = (data) => {
      cleanup();
      resolve(data);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("החיבור לשרת נכשל"));
    };
    script.src = url.toString();
    document.body.appendChild(script);
  });
}

function postInNewTab(payload) {
  const form = document.createElement("form");
  form.method = "post";
  form.action = BACKEND_URL;
  form.target = "_blank";
  form.style.display = "none";
  const input = document.createElement("input");
  input.name = "payload";
  input.value = JSON.stringify(payload);
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  form.remove();
}

function getEditorSurface() {
  return document.querySelector(".editor-photo");
}

function clearEditorMarks() {
  const surface = getEditorSurface();
  if (!surface) return;
  surface.querySelectorAll(".editor-mark").forEach((mark) => mark.remove());
}

function resetEditorOverlay() {
  clearEditorMarks();
  activePhotoSource = "";
  const arrow = document.querySelector(".canvas-arrow");
  const label = document.querySelector(".canvas-label");
  if (arrow) arrow.style.display = "none";
  if (label) label.style.display = "none";
}

function addEditorMark(mode) {
  const surface = getEditorSurface();
  if (!surface) return;
  const mark = document.createElement("span");
  mark.className = `editor-mark ${mode}`;
  mark.dataset.mode = mode;
  mark.dataset.editing = "false";
  if (mode === "text") {
    mark.contentEditable = "false";
    mark.textContent = document.getElementById("editorCaption").value.trim() || "טקסט";
  } else if (mode === "circle") {
    mark.textContent = "◌";
  } else {
    mark.textContent = "➜";
  }
  const offset = surface.querySelectorAll(".editor-mark").length * 18;
  mark.style.left = `${24 + offset}px`;
  mark.style.top = `${24 + offset}px`;
  surface.appendChild(mark);
  makeEditorMarkInteractive(mark);
}

function makeEditorMarkInteractive(mark) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  mark.addEventListener("pointerdown", (event) => {
    if (mark.dataset.editing === "true") return;
    event.preventDefault();
    dragging = true;
    try {
      mark.setPointerCapture(event.pointerId);
    } catch (error) {}
    const rect = mark.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    mark.classList.add("dragging");
  });

  mark.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    event.preventDefault();
    const surface = getEditorSurface();
    if (!surface) return;
    const bounds = surface.getBoundingClientRect();
    const nextLeft = event.clientX - bounds.left - offsetX;
    const nextTop = event.clientY - bounds.top - offsetY;
    const maxLeft = bounds.width - mark.offsetWidth - 4;
    const maxTop = bounds.height - mark.offsetHeight - 4;
    mark.style.left = `${Math.min(Math.max(4, nextLeft), Math.max(4, maxLeft))}px`;
    mark.style.top = `${Math.min(Math.max(4, nextTop), Math.max(4, maxTop))}px`;
  });

  const endDrag = () => {
    dragging = false;
    mark.classList.remove("dragging");
  };

  mark.addEventListener("pointerup", endDrag);
  mark.addEventListener("pointercancel", endDrag);

  mark.addEventListener("dblclick", (event) => {
    if (mark.dataset.mode !== "text") return;
    event.preventDefault();
    mark.dataset.editing = "true";
    mark.contentEditable = "true";
    mark.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(mark);
    selection.removeAllRanges();
    selection.addRange(range);
  });

  mark.addEventListener("blur", () => {
    if (mark.dataset.mode !== "text") return;
    mark.dataset.editing = "false";
    mark.contentEditable = "false";
    if (!mark.textContent.trim()) mark.textContent = "טקסט";
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawContainImage(ctx, img, canvasWidth, canvasHeight) {
  const ratio = Math.min(canvasWidth / img.naturalWidth, canvasHeight / img.naturalHeight);
  const drawWidth = img.naturalWidth * ratio;
  const drawHeight = img.naturalHeight * ratio;
  const dx = (canvasWidth - drawWidth) / 2;
  const dy = (canvasHeight - drawHeight) / 2;
  ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
}

async function flattenEditorPhoto() {
  const surface = getEditorSurface();
  const source = activePhotoSource || activePhotoEditorItem?.dataset.annotatedSrc || activePhotoEditorItem?.dataset.sourceSrc || activePhotoEditorItem?.querySelector(".photo-preview")?.src || "";
  if (!surface || !source) return null;
  const img = await loadImage(source);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(surface.clientWidth || img.naturalWidth));
  canvas.height = Math.max(1, Math.round(surface.clientHeight || img.naturalHeight));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#394b52";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawContainImage(ctx, img, canvas.width, canvas.height);
  const marks = [...surface.querySelectorAll(".editor-mark")];
  marks.forEach((mark) => {
    const left = parseFloat(mark.style.left || "0");
    const top = parseFloat(mark.style.top || "0");
    const text = (mark.innerText || mark.textContent || "").trim();
    ctx.save();
    if (mark.dataset.mode === "text") {
      const paddingX = 10;
      const height = 34;
      ctx.font = "700 18px Arial";
      const textWidth = Math.ceil(ctx.measureText(text).width);
      const width = Math.max(64, textWidth + paddingX * 2);
      ctx.fillStyle = "rgba(255,255,255,0.94)";
      ctx.strokeStyle = "#1769e0";
      ctx.lineWidth = 2;
      roundedRect(ctx, left, top, width, height, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#1769e0";
      ctx.textBaseline = "middle";
      ctx.fillText(text, left + paddingX, top + height / 2 + 1);
    } else if (mark.dataset.mode === "circle") {
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.94)";
      ctx.strokeStyle = "#1769e0";
      ctx.lineWidth = 3;
      ctx.arc(left + 18, top + 18, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.font = "700 24px Arial";
      ctx.fillStyle = "#1769e0";
      ctx.fillText("➜", left, top + 24);
    }
    ctx.restore();
  });
  return canvas.toDataURL("image/jpeg", 0.84);
}

function markLocationStepDone() {
  document.querySelector(".location-step")?.classList.add("done");
  updateProgress();
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
  document.querySelector(".bottom-nav").hidden = name !== "queue";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function pointTypeLabel(type) {
  if (type === "cluster") return "אשכול";
  if (type === "booth") return "דוכן";
  return "שילוט";
}

function pointTypeClass(type) {
  if (type === "cluster") return "cluster";
  if (type === "booth") return "booth";
  return "signage";
}

function statusLabel(status) {
  const labels = {
    "Open for documentation": "פתוח לתיעוד",
    "In progress": "בביצוע",
    "Waiting for review": "ממתין לבדיקה",
    "Needs completion": "צריך השלמה",
    "Ready for pre-election check": "מוכן לבדיקה לפני בחירות",
    "Ready for election day": "מוכן ליום הבחירות"
  };
  return labels[status] || status || "פתוח לתיעוד";
}

function renderHierarchy() {
  const merhavSelect = document.getElementById("loginMerhav");
  if (!merhavSelect) return;
  const merhavim = (appState.hierarchy.merhavim && appState.hierarchy.merhavim.length)
    ? appState.hierarchy.merhavim
    : fallbackMerhavim;
  merhavSelect.innerHTML = [
    `<option value="">כל המחוז</option>`,
    ...merhavim.map((merhav) => `<option value="${merhav.merhavId}">${merhav.merhavName}</option>`)
  ].join("");
}

function normalizePoint(point) {
  return {
    pointId: point.pointId || `LOCAL-${Date.now()}`,
    type: point.type || "signage",
    number: point.number || `${pointTypeLabel(point.type)} חדש`,
    name: point.name || point.pointName || point.plannedAddress || point.settlementName || "נקודה ללא שם",
    settlementName: point.settlementName || point.town || "",
    settlementId: point.settlementId || "",
    merhavId: point.merhavId || "",
    merhavName: point.merhavName || "",
    plannedAddress: point.plannedAddress || point.address || "",
    status: point.status || "Open for documentation",
    priority: point.priority || "",
    assignedTo: point.assignedTo || "",
    documentedBy: point.documentedBy || "",
    correctedLat: point.correctedLat || "",
    correctedLng: point.correctedLng || "",
    notes: point.notes || ""
  };
}

function renderPointCard(point, mode) {
  const p = normalizePoint(point);
  const typeClass = pointTypeClass(p.type);
  const buttonText = mode === "mine" ? "המשך" : "אני לוקח/ת";
  return `
    <article class="${mode === "mine" ? "my-point" : "point-card"}" data-point-id="${p.pointId}" data-type="${p.type}" data-number="${p.number}" data-name="${p.name}" data-address="${p.plannedAddress || p.settlementName}" data-badge="${pointTypeLabel(p.type)}" data-priority="${p.priority || ""}">
      <div class="card-top">
        <span class="point-kind ${typeClass}">${p.number}</span>
        <span class="status">${statusLabel(p.status)}${p.priority ? ` · עדיפות ${p.priority}` : ""}</span>
      </div>
      <h2>${p.name}</h2>
      <p>${p.settlementName}${p.plannedAddress ? ` · ${p.plannedAddress}` : ""}</p>
      ${p.notes ? `<div class="review-note">${p.notes}</div>` : ""}
      <button class="${mode === "mine" ? "point-open" : "take-button"}" type="button">${buttonText}</button>
    </article>
  `;
}

function renderQueues() {
  const lists = document.querySelectorAll("#queueScreen .point-list");
  if (lists.length < 2) return;
  const user = appState.currentUser;
  const selectedMerhav = appState.currentMerhavId;
  const points = appState.points.map(normalizePoint)
    .filter((point) => !selectedMerhav || point.merhavId === selectedMerhav || point.merhavName === appState.currentMerhavName)
    .sort((a, b) => {
      const statusOrder = { "Needs completion": 0, "Open for documentation": 1, "In progress": 2, "Waiting for review": 3, "Ready for pre-election check": 4, "Ready for election day": 5 };
      return (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9) || Number(a.priority || 9) - Number(b.priority || 9);
    });
  const mine = points.filter((point) => point.assignedTo === user && point.status === "In progress");
  const open = points.filter((point) => ["Open for documentation", "Needs completion"].includes(point.status) || (!point.assignedTo && point.status !== "Waiting for review"));
  lists[0].innerHTML = mine.length ? mine.map((point) => renderPointCard(point, "mine")).join("") : `<div class="empty-state">אין לך נקודות בטיפול כרגע.</div>`;
  lists[1].innerHTML = open.length ? open.map((point) => renderPointCard(point, "open")).join("") : `<div class="empty-state">אין כרגע נקודות פתוחות במרחב הזה.</div>`;
}

async function loadBootstrap() {
  setLoadStatus("טוען רשימות מהשרת...");
  try {
    const data = await jsonp("bootstrap");
    if (data && data.ok) {
      appState.hierarchy = data.hierarchy || data.hierarchy?.hierarchy || data.hierarchy || {};
      if (data.hierarchy && data.hierarchy.ok) appState.hierarchy = data.hierarchy;
      appState.points = data.points || [];
      if (!appState.points.length) appState.points = fallbackGoldPoints;
      renderHierarchy();
      renderQueues();
      setLoadStatus(`נטענו ${appState.points.length} נקודות`, "ok");
      return;
    }
  } catch (error) {
    console.warn(error);
  }
  appState.hierarchy = { merhavim: fallbackMerhavim };
  appState.points = fallbackGoldPoints;
  renderHierarchy();
  renderQueues();
  setLoadStatus("לא הצלחנו לטעון מהשרת. מוצגת רשימת אשכולות זהב מקומית.", "fallback");
}

function renderMission(type) {
  currentType = type;
  const steps = missionPlans[type] || missionPlans.cluster;
  const target = document.getElementById("missionSteps");
  target.innerHTML = steps.map((step, index) => `
    <section class="mission-step field-step">
      <div class="step-title">
        <span>${index + 3}</span>
        <div>
          <h2>${step.title}</h2>
          <p>${step.help}</p>
        </div>
      </div>
      <div class="photo-line">
        <button class="add-photo" type="button">📷 ${step.photo}</button>
        <small>אפשר להוסיף יותר מתמונה אחת</small>
      </div>
      <div class="photo-gallery"></div>
      <label>פרטי השלב
        ${step.control}
      </label>
      <button class="complete-step" type="button">סיימתי שלב זה</button>
    </section>
  `).join("");

  document.getElementById("logisticsStepNumber").textContent = steps.length + 3;
  document.getElementById("equipmentStepNumber").textContent = steps.length + 4;
  document.getElementById("reviewStepNumber").textContent = steps.length + 5;
  updateProgress();
}

function updateProgress() {
  const total = document.querySelectorAll("#documentScreen .complete-step").length;
  const done = document.querySelectorAll("#documentScreen .mission-step.done").length;
  document.getElementById("progressText").textContent = `${done} מתוך ${total}`;
  document.getElementById("progressBar").style.width = `${Math.min(100, total ? (done / total) * 100 : 0)}%`;
}

function setActivePoint(card) {
  const existing = appState.points.map(normalizePoint).find((point) => point.pointId === card.dataset.pointId);
  appState.currentPoint = existing || {
    pointId: card.dataset.pointId || `LOCAL-${Date.now()}`,
    type: card.dataset.type || "cluster",
    number: card.dataset.number || "",
    name: card.dataset.name || "",
    plannedAddress: card.dataset.address || "",
    settlementName: card.dataset.town || "",
    status: "In progress"
  };
  appState.correctedLocation = appState.currentPoint.correctedLat && appState.currentPoint.correctedLng
    ? { lat: appState.currentPoint.correctedLat, lng: appState.currentPoint.correctedLng }
    : null;
  const type = appState.currentPoint.type || "cluster";
  const typeBadge = document.getElementById("documentPointType");
  typeBadge.className = `point-kind ${type}`;
  typeBadge.textContent = pointTypeLabel(type);
  document.getElementById("documentPointNumber").textContent = appState.currentPoint.number || "";
  document.getElementById("documentPointName").textContent = appState.currentPoint.name || appState.currentPoint.plannedAddress || "";
  document.getElementById("documentPointAddress").textContent = appState.currentPoint.plannedAddress || appState.currentPoint.settlementName || "";
  document.getElementById("submittedPointName").textContent = `${appState.currentPoint.number || ""} · ${appState.currentPoint.name || ""}`;
  document.getElementById("plannedLocationText").textContent = appState.currentPoint.plannedAddress || "לפי מוביל הצוות";
  const actual = document.getElementById("actualLocationText");
  actual.textContent = appState.correctedLocation
    ? `המקום נוקב לפי GPS: ${appState.correctedLocation.lat}, ${appState.correctedLocation.lng}`
    : "עדיין לא דקרנו את המקום";
  actual.className = appState.correctedLocation ? "location-ok" : "";

  const query = encodeURIComponent(
    (appState.currentPoint.plannedAddress || appState.currentPoint.name || appState.currentPoint.settlementName || "")
      .replace(/\s+/g, " ")
      .trim()
  );
  const navLinks = document.querySelectorAll(".nav-actions a");
  navLinks[0].href = `https://www.waze.com/ul?q=${query}`;
  navLinks[1].href = `https://www.google.com/maps/search/?api=1&query=${query}`;

  document.querySelectorAll("#documentScreen .mission-step").forEach((step) => step.classList.remove("done"));
  document.getElementById("blockerBox").hidden = true;
  renderMission(type);
  updateProgress();
}

function collectMissingItems() {
  const items = [];
  document.querySelectorAll("#documentScreen .mission-step").forEach((step) => {
    const title = step.querySelector("h2")?.textContent || "שלב";
    if (!step.classList.contains("done")) {
      items.push(`לא סומן שהושלם: "${title}"`);
    }
    if (step.classList.contains("field-step") && step.querySelectorAll(".photo-item").length === 0) {
      items.push(`אין תמונה ב-"${title}"`);
    }
  });
  if (!document.getElementById("actualLocationText").classList.contains("location-ok")) {
    items.push("המיקום עדיין לא אושר");
  }
  return items;
}


function openSubmitDecision() {
  const missing = collectMissingItems();
  const list = document.getElementById("missingList");
  list.innerHTML = missing.length
    ? missing.map((item) => `<span>${item}</span>`).join("")
    : '<span class="all-good">הכול נראה מוכן לשליחה</span>';
  document.getElementById("submitDecision").hidden = false;
}

function collectAnswers() {
  const answers = [];
  document.querySelectorAll("#documentScreen .mission-step").forEach((step, sectionIndex) => {
    const title = step.querySelector("h2")?.textContent || `שלב ${sectionIndex + 1}`;
    step.querySelectorAll("input, select, textarea").forEach((field, fieldIndex) => {
      if (field.type === "file" || field.id === "photoInput") return;
      const label = field.closest("label")?.childNodes[0]?.textContent?.trim() || field.placeholder || `שדה ${fieldIndex + 1}`;
      answers.push({
        sectionKey: title,
        fieldKey: field.id || field.name || `${sectionIndex + 1}-${fieldIndex + 1}`,
        label,
        value: field.value || ""
      });
    });
  });
  return answers;
}

function collectPhotos() {
  return [...document.querySelectorAll("#documentScreen .photo-item")].map((item, index) => {
    const source = item.dataset.annotatedSrc || item.dataset.sourceSrc || "";
    const base64 = source.includes(",") ? source.split(",")[1] : item.dataset.base64 || "";
    const section = item.closest(".mission-step")?.querySelector("h2")?.textContent || "photo";
    return {
      itemKey: section,
      caption: item.querySelector("input[type='text']")?.value || "",
      fileName: item.dataset.fileName || `photo-${index + 1}.jpg`,
      mimeType: "image/jpeg",
      base64,
      width: item.dataset.width || "",
      height: item.dataset.height || ""
    };
  }).filter((photo) => photo.base64);
}

function currentPointPayload(status) {
  const point = appState.currentPoint || {};
  const [lat, lng] = appState.correctedLocation
    ? [appState.correctedLocation.lat, appState.correctedLocation.lng]
    : [point.correctedLat || "", point.correctedLng || ""];
  return {
    action: "submitpoint",
    pointId: point.pointId,
    districtId: point.districtId || "north-sharon-district",
    districtName: point.districtName || "מחוז צפון השרון",
    merhavId: point.merhavId || appState.currentMerhavId,
    merhavName: point.merhavName || appState.currentMerhavName,
    settlementId: point.settlementId || "",
    settlementName: point.settlementName || "",
    type: point.type || currentType,
    number: point.number || "",
    pointName: point.name || point.pointName || document.getElementById("documentPointName").textContent || "",
    priority: point.priority || "",
    status,
    plannedAddress: point.plannedAddress || document.getElementById("documentPointAddress").textContent || "",
    correctedLocation: lat && lng ? { lat, lng } : null,
    documentedBy: appState.currentUser,
    assignedTo: appState.currentUser,
    notes: document.querySelector(".review-step textarea")?.value || "",
    answers: collectAnswers(),
    photos: collectPhotos()
  };
}

function submitCurrentPoint(status = "Waiting for review") {
  const payload = currentPointPayload(status);
  postInNewTab(payload);
  const existingIndex = appState.points.findIndex((point) => point.pointId === payload.pointId);
  if (existingIndex !== -1) {
    appState.points[existingIndex] = { ...appState.points[existingIndex], ...payload };
  }
  renderQueues();
}

function openPhotoEditor(item) {
  const editor = document.getElementById("photoEditor");
  const editorPhoto = document.querySelector(".editor-photo");
  const captionInput = item.querySelector("input[type='text']");
  const preview = item.querySelector(".photo-preview");
  activePhotoEditorItem = item;
  resetEditorOverlay();
  activePhotoSource = item.dataset.annotatedSrc || preview?.src || item.dataset.sourceSrc || "";
  editor.hidden = false;
  editorPhoto.style.background = activePhotoSource
    ? `#394b52 url(${activePhotoSource}) center/contain no-repeat`
    : "#394b52";
  document.getElementById("editorCaption").value = captionInput ? captionInput.value : "";
}

function setCardAsActive(card) {
  if (!card) return;
  setActivePoint(card);
  showScreen("document");
}

function attachPointLaunchers() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("button, .my-point, .point-card");
    if (!trigger) return;

    const card = trigger.closest(".my-point, .point-card") || trigger;

    if (trigger.classList.contains("point-open") || trigger.classList.contains("my-point")) {
      setCardAsActive(card);
      return;
    }

    if (trigger.classList.contains("take-button") || trigger.classList.contains("point-card")) {
      const pointId = card.dataset.pointId;
      if (pointId && !pointId.startsWith("LOCAL-")) {
        const payload = { pointId, assignedTo: appState.currentUser, documentedBy: appState.currentUser };
        jsonp("claimpoint", { payload: encodePayload(payload) }).then((data) => {
          if (data && data.ok) {
            const index = appState.points.findIndex((point) => point.pointId === pointId);
            if (index !== -1) appState.points[index] = data.point;
          }
        }).catch((error) => console.warn(error));
      }
      setCardAsActive(card);
      return;
    }

    if (trigger.classList.contains("back") && trigger.dataset.nav) {
      showScreen(trigger.dataset.nav);
      return;
    }

    if (trigger.dataset.nav) {
      showScreen(trigger.dataset.nav);
      return;
    }

    if (trigger.id === "releaseButton") {
      if (appState.currentPoint && appState.currentPoint.pointId && !appState.currentPoint.pointId.startsWith("LOCAL-")) {
        jsonp("releasepoint", {
          payload: encodePayload({ pointId: appState.currentPoint.pointId, documentedBy: appState.currentUser, assignedTo: appState.currentUser })
        }).then((data) => {
          if (data && data.ok) {
            const index = appState.points.findIndex((point) => point.pointId === data.point.pointId);
            if (index !== -1) appState.points[index] = data.point;
            renderQueues();
          }
        }).catch((error) => console.warn(error));
      }
      showScreen("queue");
      return;
    }

    if (trigger.id === "blockerToggle") {
      const box = document.getElementById("blockerBox");
      box.hidden = !box.hidden;
      return;
    }

    if (trigger.classList.contains("complete-step")) {
      trigger.closest(".mission-step")?.classList.add("done");
      trigger.textContent = "✓ נשמר";
      updateProgress();
      return;
    }

    if (trigger.classList.contains("add-photo")) {
      const photoArea = trigger.closest(".blocker-box") || trigger.closest(".mission-step");
      activePhotoTarget = photoArea?.querySelector(".photo-gallery");
      activePhotoInput = document.getElementById("photoInput");
      if (!activePhotoTarget || !activePhotoInput) return;
      activePhotoInput.value = "";
      pendingPhotoItem = document.createElement("div");
      pendingPhotoItem.className = "photo-item pending-photo";
      pendingPhotoItem.innerHTML = `
        <div class="photo-thumb photo-placeholder"></div>
        <div>
          <strong>ממתין לתמונה...</strong>
          <div class="photo-actions">
            <button class="remove-photo" type="button">מחיקה</button>
          </div>
        </div>`;
      activePhotoTarget.appendChild(pendingPhotoItem);
      activePhotoInput.click();
      return;
    }

    if (trigger.classList.contains("annotate-button")) {
      openPhotoEditor(trigger.closest(".photo-item"));
      return;
    }

    if (trigger.classList.contains("remove-photo")) {
      trigger.closest(".photo-item")?.remove();
      return;
    }

    if (trigger.id === "addFieldPoint") {
      showScreen("newPoint");
      return;
    }

  });

  document.getElementById("enterApp").addEventListener("click", () => {
    const merhavSelect = document.getElementById("loginMerhav");
    const merhav = merhavSelect.value;
    const user = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!user) {
      alert("צריך להזין שם");
      return;
    }
    if (password !== PILOT_PIN) {
      alert("קוד כניסה שגוי לפיילוט");
      return;
    }
    appState.currentUser = user;
    appState.currentMerhavId = merhav;
    appState.currentMerhavName = merhavSelect.options[merhavSelect.selectedIndex]?.textContent || "";
    document.getElementById("welcomeLine").textContent = `שלום, ${user}`;
    renderQueues();
    showScreen("queue");
  });

  document.getElementById("photoInput").addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    const target = activePhotoTarget || (pendingPhotoItem && pendingPhotoItem.parentElement);
    if (!file || !target) return;
    const previewUrl = URL.createObjectURL(file);
    const item = pendingPhotoItem || document.createElement("div");
    item.className = "photo-item";
    item.innerHTML = `
      <div class="photo-thumb"><img alt="" class="photo-preview" src="${previewUrl}"></div>
      <div>
        <input type="text" placeholder="מה רואים בתמונה?" value="">
        <div class="photo-actions">
          <button class="annotate-button" type="button">עריכת תמונה</button>
          <button class="remove-photo" type="button">מחיקה</button>
        </div>
      </div>`;
    if (!item.parentElement) target.appendChild(item);
    try {
      const compressed = await compressPhotoFile(file);
      item.dataset.fileName = compressed.fileName;
      item.dataset.base64 = compressed.base64;
      item.dataset.width = String(compressed.width);
      item.dataset.height = String(compressed.height);
      item.dataset.bytes = String(compressed.bytes);
      item.dataset.sourceSrc = compressed.dataUrl;
      item.dataset.annotatedSrc = "";
      const preview = item.querySelector(".photo-preview");
      if (preview) preview.src = compressed.dataUrl;
      photoCache.set(item, compressed);
    } catch (error) {
      item.dataset.fileName = file.name;
      item.dataset.base64 = "";
      item.dataset.bytes = "0";
      photoCache.set(item, { error: String(error) });
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
    activePhotoTarget = null;
    pendingPhotoItem = null;
  });

  document.getElementById("useCurrentLocation").addEventListener("click", () => {
    const status = document.getElementById("actualLocationText");
    if (!window.isSecureContext) {
      status.textContent = "מיקום עובד רק בחיבור מאובטח (https).";
      status.className = "location-error";
      return;
    }
    if (!navigator.geolocation) {
      status.textContent = "הדפדפן לא תומך במיקום";
      status.className = "location-error";
      return;
    }
    status.textContent = "קורא מיקום נוכחי...";
    status.className = "location-pending";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        appState.correctedLocation = { lat, lng };
        const query = encodeURIComponent(`${lat},${lng}`);
        const navLinks = document.querySelectorAll(".nav-actions a");
        navLinks[0].href = `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
        navLinks[1].href = `https://www.google.com/maps/search/?api=1&query=${query}`;
        status.textContent = `המקום נוקב לפי GPS: ${lat}, ${lng}`;
        status.className = "location-ok";
        markLocationStepDone();
      },
      () => {
        status.textContent = "לא הצלחנו לקרוא GPS";
        status.className = "location-error";
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });

  document.getElementById("submitReview").addEventListener("click", openSubmitDecision);
  document.getElementById("backToMissing").addEventListener("click", () => {
    document.getElementById("submitDecision").hidden = true;
    const firstMissing = [...document.querySelectorAll("#documentScreen .mission-step")]
      .find((step) => !step.classList.contains("done") || (step.classList.contains("field-step") && step.querySelectorAll(".photo-item").length === 0));
    if (firstMissing) firstMissing.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("sendAnyway").addEventListener("click", () => {
    document.getElementById("submitDecision").hidden = true;
    submitCurrentPoint("Waiting for review");
    showScreen("submitted");
  });
  document.getElementById("saveForLater").addEventListener("click", () => {
    document.getElementById("submitDecision").hidden = true;
    submitCurrentPoint("In progress");
    showScreen("queue");
  });

  document.getElementById("saveEditor").addEventListener("click", async () => {
    if (activePhotoEditorItem) {
      const captionInput = activePhotoEditorItem.querySelector("input[type='text']");
      const editorCaption = document.getElementById("editorCaption");
      if (captionInput) captionInput.value = editorCaption.value.trim();
      const annotated = await flattenEditorPhoto();
      if (annotated) {
        const preview = activePhotoEditorItem.querySelector(".photo-preview");
        if (preview) preview.src = annotated;
        activePhotoEditorItem.dataset.annotatedSrc = annotated;
        activePhotoEditorItem.dataset.sourceSrc = annotated;
        photoCache.set(activePhotoEditorItem, {
          ...(photoCache.get(activePhotoEditorItem) || {}),
          annotated
        });
      }
    }
    resetEditorOverlay();
    document.querySelector(".editor-photo").style.background = "#394b52";
    document.getElementById("photoEditor").hidden = true;
    activePhotoEditorItem = null;
  });

  document.getElementById("closeEditor").addEventListener("click", () => {
    resetEditorOverlay();
    document.querySelector(".editor-photo").style.background = "#394b52";
    document.getElementById("photoEditor").hidden = true;
    activePhotoEditorItem = null;
  });

  document.querySelectorAll(".editor-tools button").forEach((button, index) => {
    const actions = ["arrow", "circle", "text", "undo"];
    button.dataset.editorAction = actions[index] || "arrow";
    button.addEventListener("click", () => {
      const action = button.dataset.editorAction;
      if (action === "undo") {
        const marks = getEditorSurface()?.querySelectorAll(".editor-mark");
        if (marks && marks.length) marks[marks.length - 1].remove();
        return;
      }
      addEditorMark(action);
    });
  });

  document.querySelectorAll("[data-new-type]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-new-type]").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      selectedNewType = button.dataset.newType;
    });
  });

  document.getElementById("newPointForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!selectedNewType) {
      alert("צריך לבחור סוג נקודה");
      return;
    }
    const town = document.getElementById("newTown").value.trim();
    const payload = {
      type: selectedNewType,
      number: `${pointTypeLabel(selectedNewType)} חדש`,
      name: document.getElementById("newName").value.trim() || "נקודה חדשה",
      settlementName: town,
      settlementId: town,
      merhavId: appState.currentMerhavId,
      merhavName: appState.currentMerhavName,
      plannedAddress: document.getElementById("newLocation").value.trim() || town,
      notes: document.getElementById("newReason").value.trim(),
      status: "In progress",
      assignedTo: appState.currentUser,
      documentedBy: appState.currentUser,
      createdBy: appState.currentUser
    };
    try {
      const data = await jsonp("createpoint", { payload: encodePayload(payload) });
      if (data && data.ok) {
        appState.points.push(data.point);
        renderQueues();
        const virtualCard = { dataset: { pointId: data.point.pointId } };
        setCardAsActive(virtualCard);
        return;
      }
    } catch (error) {
      console.warn(error);
    }
    const localPoint = normalizePoint({ ...payload, pointId: `LOCAL-${Date.now()}` });
    appState.points.push(localPoint);
    renderQueues();
    setCardAsActive({ dataset: { pointId: localPoint.pointId } });
  });
}

function compressPhotoFile(file, maxWidth = 1600, quality = 0.78) {
  return new Promise(async (resolve, reject) => {
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, maxWidth / bitmap.width);
      const width = Math.round(bitmap.width * scale);
      const height = Math.round(bitmap.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error("Photo compression failed"));
          return;
        }
        const dataUrl = await blobToDataUrl(blob);
        resolve({
          dataUrl,
          base64: dataUrl.split(",")[1],
          bytes: blob.size,
          width,
          height,
          fileName: file.name.replace(/\.[^.]+$/, "") + "-compressed.jpg",
          mimeType: "image/jpeg"
        });
      }, "image/jpeg", quality);
    } catch (error) {
      reject(error);
    }
  });
}

renderMission("cluster");
attachPointLaunchers();
loadBootstrap();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js");
}
