const screens = {
  login: document.getElementById("loginScreen"),
  queue: document.getElementById("queueScreen"),
  document: document.getElementById("documentScreen"),
  submitted: document.getElementById("submittedScreen"),
  newPoint: document.getElementById("newPointScreen")
};

const missionPlans = {
  cluster: [
    { title: "×¦×™×œ×•× ×”×›× ×™×¡×”", help: "×ª×ž×•× ×” ×¨×—×‘×” ×©×œ ×”×ž×§×•× ×ž×”×¦×“ ×©×œ ×”×”×’×¢×”.", photo: "×¦×™×œ×•× ×›× ×™×¡×”", control: `<select><option>×›×Ÿ, ×‘×¨×•×¨</option><option>×¦×¨×™×š ×¦×™×œ×•× × ×•×¡×£</option><option>×¢×“×™×™×Ÿ ×œ× ×‘×¨×•×¨</option></select>` },
    { title: "×ž×™×§×•× ×“×•×›×Ÿ ×¦×¤×•×™", help: "××™×¤×” ×”×“×•×›×Ÿ ××ž×•×¨ ×œ×¢×ž×•×“ ×‘×¤×•×¢×œ.", photo: "×¦×™×œ×•× ×ž×™×§×•× ×“×•×›×Ÿ", control: `<input inputmode="decimal" placeholder="×›×ž×” ×ž×˜×¨×™×?">` },
    { title: "×”×¢×¨×•×ª ×¢×œ ×¡×‘×™×‘×ª ×”×ž×§×•×", help: "×ž×” ×—×©×•×‘ ×©×”×¦×•×•×ª ×™×“×¢ ×œ×¤× ×™ ×”×’×¢×”.", photo: "×¦×™×œ×•× × ×•×¡×£ ×× ×¦×¨×™×š", control: `<textarea rows="3" placeholder="×’×™×©×”, ×ž×“×¨×’×•×ª, ×’×™×©×” ×œ×¨×›×‘, ×× ×©×™×, ×—×¡×™×ž×•×ª..."></textarea>` }
  ],
  signage: [
    { title: "×¦×™×œ×•× ×ž×¨×—×•×§", help: "××™×š ×”×ž×§×•× × ×¨××” ×ž×¨×—×•×§.", photo: "×¦×™×œ×•× ×¨×—×•×§", control: `<select><option>×¦×œ× ×ž×¨×—×•×§</option><option>×¦×¨×™×š ×¢×•×“ ×ª×ž×•× ×”</option></select>` },
    { title: "×¦×™×œ×•× ×ž×§×¨×•×‘", help: "×”×ž×§×•× ×©×‘×• ×™×™×ª×œ×” ×”×©×œ×˜.", photo: "×¦×™×œ×•× ×§×¨×•×‘", control: `<textarea rows="2" placeholder="×ž×” × ×“×¨×© ×œ×ª×œ×™×™×”?"></textarea>` },
    { title: "×ž×“×™×“×•×ª ×•×”×¢×¨×•×ª", help: "×¨×•×—×‘, ×’×•×‘×”, ×—×•×ž×¨×™×, ×¡×™×›×•×Ÿ ×œ× ×–×§.", photo: "×¦×™×œ×•× ×¢× ×¡×™×ž×•×Ÿ", control: `<textarea rows="3" placeholder="×¨×•×—×‘, ×’×•×‘×”, ×¦×™×•×“, ×—× ×™×”, ×©×¤×” ×ž×™×•×—×“×ª..."></textarea>` }
  ],
  booth: [
    { title: "×¦×™×œ×•× ×”×ž×§×•×", help: "××™×š ×”×ž×§×•× × ×¨××” ×•×ž×™ ×¢×•×‘×¨ ×‘×•.", photo: "×¦×™×œ×•× ×ž×§×•×", control: `<select><option>×¦×¤×•×£ ×•×ž×ª××™×</option><option>×¡×‘×™×¨</option><option>×“×•×¨×© ×‘×“×™×§×”</option></select>` },
    { title: "×©×¢×•×ª ×ž×•×ž×œ×¦×•×ª", help: "×ž×ª×™ ×›×“××™ ×œ×”×’×™×¢ ×•××™×š ×œ×¤×¨×•×¡.", photo: "×¦×™×œ×•× ×¢× ×¡×™×ž×•×Ÿ", control: `<textarea rows="2" placeholder="×ž×ª×™ ×›×Ÿ ×•×ž×ª×™ ×œ×?"></textarea>` },
    { title: "×”×¢×¨×•×ª ×¢×œ ×ª× ×•×¢×” ×•×¦×™×•×“", help: "×ž×ž×” ×œ×”×™×–×”×¨ ×•×ž×” ×œ×”×‘×™×.", photo: "×¦×™×œ×•× × ×•×¡×£ ×× ×¦×¨×™×š", control: `<textarea rows="3" placeholder="×¦×™×•×“, ×¦×¤×™×¤×•×ª, ×¡×™×›×•× ×™×, ×—× ×™×”..."></textarea>` }
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
const buildStampValue = "2026-07-14 12:27:52 PM";
const buildStamp = document.getElementById("buildStamp");
if (buildStamp) {
  buildStamp.textContent = `Last updated: ${buildStampValue}`;
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
}

function getEditorBaseSource() {
  const surface = getEditorSurface();
  const item = activePhotoEditorItem;
  return activePhotoSource
    || item?.dataset.annotatedSrc
    || item?.dataset.sourceSrc
    || surface?.dataset.sourceSrc
    || item?.querySelector(".photo-preview")?.src
    || "";
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
    } catch (error) {
      // Pointer capture is a nice-to-have here.
    }
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
  mark.style.left = `${Math.max(12, 28 + offset)}px`;
  mark.style.top = `${Math.max(12, 28 + offset)}px`;
  surface.appendChild(mark);
  makeEditorMarkInteractive(mark);
  return mark;
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
  const source = getEditorBaseSource();
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
      const size = 36;
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.94)";
      ctx.strokeStyle = "#1769e0";
      ctx.lineWidth = 3;
      ctx.arc(left + size / 2, top + size / 2, 15, 0, Math.PI * 2);
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

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
  document.querySelector(".bottom-nav").hidden = name !== "queue";
  window.scrollTo({ top: 0, behavior: "smooth" });
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
        <button class="add-photo" type="button">ðŸ“· ${step.photo}</button>
        <small>××¤×©×¨ ×œ×”×•×¡×™×£ ×™×•×ª×¨ ×ž×ª×ž×•× ×” ××—×ª</small>
      </div>
      <div class="photo-gallery"></div>
      <label>×¤×¨×˜×™ ×”×©×œ×‘
        ${step.control}
      </label>
      <button class="complete-step" type="button">×¡×™×™×ž×ª×™ ×©×œ×‘ ×–×”</button>
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
  document.getElementById("progressText").textContent = `${done} ×ž×ª×•×š ${total}`;
  document.getElementById("progressBar").style.width = `${Math.min(100, total ? (done / total) * 100 : 0)}%`;
}

function setActivePoint(card) {
  const type = card.dataset.type || "cluster";
  const typeBadge = document.getElementById("documentPointType");
  typeBadge.className = `point-kind ${type}`;
  typeBadge.textContent = card.dataset.badge || type;
  document.getElementById("documentPointNumber").textContent = card.dataset.number || "";
  document.getElementById("documentPointName").textContent = card.dataset.name || "";
  document.getElementById("documentPointAddress").textContent = card.dataset.address || "";
  document.getElementById("submittedPointName").textContent = `${card.dataset.number || ""} Â· ${card.dataset.name || ""}`;
  document.getElementById("plannedLocationText").textContent = card.dataset.address || "×œ×¤×™ ×ž×•×‘×™×œ ×”×¦×•×•×ª";
  const actual = document.getElementById("actualLocationText");
  actual.textContent = "×¢×“×™×™×Ÿ ×œ× ××•×ž×ª ×ž×”×ž×›×©×™×¨";
  actual.className = "";

  const query = encodeURIComponent((card.dataset.address || "").replace("Â·", " "));
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
    const title = step.querySelector("h2")?.textContent || "×©×œ×‘";
    if (!step.classList.contains("done")) {
      items.push(`×œ× ×¡×•×ž×Ÿ ×©×”×•×©×œ×: "${title}"`);
    }
    if (step.classList.contains("field-step") && step.querySelectorAll(".photo-item").length === 0) {
      items.push(`××™×Ÿ ×ª×ž×•× ×” ×‘-"${title}"`);
    }
  });
  if (!document.getElementById("actualLocationText").classList.contains("location-ok")) {
    items.push("×”×ž×™×§×•× ×¢×“×™×™×Ÿ ×œ× ××•×©×¨");
  }
  return items;
}

function openSubmitDecision() {
  const missing = collectMissingItems();
  const list = document.getElementById("missingList");
  list.innerHTML = missing.length
    ? missing.map((item) => `<span>${item}</span>`).join("")
    : `<span class="all-good">××™×Ÿ ×—×•×¡×¨×™× ×‘×•×œ×˜×™×</span>`;
  document.getElementById("submitDecision").hidden = false;
}

function attachPointLaunchers() {
  document.querySelectorAll(".continue-assignment, .take-button, .point-open").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-type]");
      if (button.classList.contains("take-button")) {
        const ok = confirm(`×œ×§×—×ª ××ª ${card.dataset.number}? ×”× ×§×•×“×” ×ª×™×©×ž×¨ ×¢×‘×•×¨×š ×œ-10 ×©×¢×•×ª.`);
        if (!ok) return;
      }
      setActivePoint(card);
      showScreen("document");
    });
  });
}

document.getElementById("enterApp").addEventListener("click", () => {
  const merhav = document.getElementById("loginMerhav").value;
  const user = document.getElementById("loginUser").value;
  const password = document.getElementById("loginPassword").value.trim();
  if (!merhav || !user) {
    alert("×¦×¨×™×š ×œ×‘×—×•×¨ ×ž×¨×—×‘ ×•×ž×©×ª×ž×©");
    return;
  }
  if (!password) {
    alert("×¦×¨×™×š ×œ×”×–×™×Ÿ ×¡×™×¡×ž×”");
    return;
  }
  if (password.length < 4) {
    alert("×”×¡×™×¡×ž×” ×§×¦×¨×” ×ž×“×™");
    return;
  }
  document.getElementById("welcomeLine").textContent = `×©×œ×•×, ${user}`;
  document.getElementById("welcomeLine").dataset.merhav = merhav;
  showScreen("queue");
});

document.querySelectorAll("[data-nav]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.nav));
});

document.getElementById("addFieldPoint").addEventListener("click", () => showScreen("newPoint"));

document.getElementById("releaseButton").addEventListener("click", () => {
  if (confirm("×œ×©×—×¨×¨ ××ª ×”× ×§×•×“×” ×•×œ×—×–×•×¨ ×œ×¨×©×™×ž×”?")) showScreen("queue");
});

document.getElementById("confirmLocation").addEventListener("click", () => {
  const status = document.getElementById("actualLocationText");
  status.textContent = "×”×ž×™×§×•× ×”×ž×ª×•×›× ×Ÿ ××•×©×¨ ×‘×©×˜×—";
  status.className = "location-ok";
  markLocationStepDone();
});

document.getElementById("useCurrentLocation").addEventListener("click", () => {
  const status = document.getElementById("actualLocationText");
  if (!window.isSecureContext) {
    status.textContent = "×ž×™×§×•× ×¢×•×‘×“ ×¨×§ ×‘×—×™×‘×•×¨ ×ž××•×‘×˜×— (https).";
    status.className = "location-error";
    return;
  }
  if (!navigator.geolocation) {
    status.textContent = "×”×“×¤×“×¤×Ÿ ×œ× ×ª×•×ž×š ×‘×ž×™×§×•×";
    status.className = "location-error";
    return;
  }
  status.textContent = "×§×•×¨× ×ž×™×§×•× × ×•×›×—×™...";
  status.className = "location-pending";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);
      const query = encodeURIComponent(`${lat},${lng}`);
      const navLinks = document.querySelectorAll(".nav-actions a");
      navLinks[0].href = `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
      navLinks[1].href = `https://www.google.com/maps/search/?api=1&query=${query}`;
      status.textContent = `×¢×•×“×›×Ÿ ×œ×ž×™×§×•× ×”× ×•×›×—×™: ${lat}, ${lng}`;
      status.className = "location-ok";
      markLocationStepDone();
    },
    () => {
      status.textContent = "×œ× ×”×¦×œ×—× ×• ×œ×§×¨×•× GPS";
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
  showScreen("submitted");
});
document.getElementById("saveForLater").addEventListener("click", () => {
  document.getElementById("submitDecision").hidden = true;
  showScreen("queue");
});

document.getElementById("blockerToggle").addEventListener("click", () => {
  const box = document.getElementById("blockerBox");
  box.hidden = !box.hidden;
});

let selectedPhotoTarget = null;
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.classList.contains("complete-step")) {
    button.closest(".mission-step").classList.add("done");
    button.textContent = "âœ“ × ×©×ž×¨";
    updateProgress();
    return;
  }

  if (button.classList.contains("add-photo")) {
    activePhotoTarget = button.closest(".mission-step").querySelector(".photo-gallery");
    activePhotoInput = document.getElementById("photoInput");
    activePhotoInput.value = "";
    pendingPhotoItem = document.createElement("div");
    pendingPhotoItem.className = "photo-item pending-photo";
    pendingPhotoItem.innerHTML = `
      <div class="photo-thumb photo-placeholder"></div>
      <div>
        <strong>×ž×ž×ª×™×Ÿ ×œ×ª×ž×•× ×”...</strong>
        <div class="photo-actions">
          <button class="remove-photo" type="button">×ž×—×™×§×”</button>
        </div>
      </div>`;
    activePhotoTarget.appendChild(pendingPhotoItem);
    activePhotoInput.click();
    return;
  }

  if (button.classList.contains("annotate-button")) {
    const item = button.closest(".photo-item");
    const editor = document.getElementById("photoEditor");
    const editorPhoto = document.querySelector(".editor-photo");
    const captionInput = item.querySelector("input[type='text']");
    const preview = item.querySelector(".photo-preview");
    activePhotoEditorItem = item;
    resetEditorOverlay();
    activePhotoSource = item.dataset.annotatedSrc || preview?.src || item.dataset.sourceSrc || "";
    editor.hidden = false;
    editorPhoto.style.background = activePhotoSource ? `#394b52 url(${activePhotoSource}) center/contain no-repeat` : "#394b52";
    document.getElementById("editorCaption").value = captionInput ? captionInput.value : "";
    return;
  }

  if (button.classList.contains("remove-photo")) {
    button.closest(".photo-item").remove();
  }
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
      <input type="text" placeholder="×ž×” ×¨×•××™× ×‘×ª×ž×•× ×”?" value="">
      <div class="photo-actions">
        <button class="annotate-button" type="button">×¢×¨×™×›×ª ×ª×ž×•× ×”</button>
        <button class="remove-photo" type="button">×ž×—×™×§×”</button>
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

document.getElementById("newPointForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedNewType) {
    alert("×¦×¨×™×š ×œ×‘×—×•×¨ ×¡×•×’ × ×§×•×“×”");
    return;
  }
  const virtualCard = {
    dataset: {
      type: selectedNewType,
      number: `${selectedNewType === "cluster" ? "××©×›×•×œ" : selectedNewType === "signage" ? "×©×™×œ×•×˜" : "×“×•×›×Ÿ"} ×—×“×©`,
      name: document.getElementById("newName").value || "× ×§×•×“×” ×—×“×©×”",
      address: `${document.getElementById("newTown").value} Â· ×ž×™×§×•× × ×•×›×—×™`,
      badge: selectedNewType === "cluster" ? "××©×›×•×œ ×–×”×‘" : selectedNewType === "signage" ? "×©×™×œ×•×˜" : "×“×•×›×Ÿ"
    }
  };
  setActivePoint(virtualCard);
  showScreen("document");
});

document.getElementById("closeEditor").addEventListener("click", () => {
  resetEditorOverlay();
  document.querySelector(".editor-photo").style.background = "#394b52";
  document.getElementById("photoEditor").hidden = true;
  activePhotoEditorItem = null;
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

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js");
}
