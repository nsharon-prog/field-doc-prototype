const screens = {
  login: document.getElementById("loginScreen"),
  queue: document.getElementById("queueScreen"),
  document: document.getElementById("documentScreen"),
  submitted: document.getElementById("submittedScreen"),
  newPoint: document.getElementById("newPointScreen")
};

const missionPlans = {
  cluster: [
    { title: "צילום הכניסה", help: "תמונה רחבה של המקום מהצד של ההגעה.", photo: "צילום כניסה", control: `<select><option>כן, ברור</option><option>צריך צילום נוסף</option><option>עדיין לא ברור</option></select>` },
    { title: "מיקום דוכן צפוי", help: "איפה הדוכן אמור לעמוד בפועל.", photo: "צילום מיקום דוכן", control: `<input inputmode="decimal" placeholder="כמה מטרים?">` },
    { title: "הערות על סביבת המקום", help: "מה חשוב שהצוות ידע לפני הגעה.", photo: "צילום נוסף אם צריך", control: `<textarea rows="3" placeholder="גישה, מדרגות, גישה לרכב, אנשים, חסימות..."></textarea>` }
  ],
  signage: [
    { title: "צילום מרחוק", help: "איך המקום נראה מרחוק.", photo: "צילום רחוק", control: `<select><option>צלם מרחוק</option><option>צריך עוד תמונה</option></select>` },
    { title: "צילום מקרוב", help: "המקום שבו ייתלה השלט.", photo: "צילום קרוב", control: `<textarea rows="2" placeholder="מה נדרש לתלייה?"></textarea>` },
    { title: "מדידות והערות", help: "רוחב, גובה, חומרים, סיכון לנזק.", photo: "צילום עם סימון", control: `<textarea rows="3" placeholder="רוחב, גובה, ציוד, חניה, שפה מיוחדת..."></textarea>` }
  ],
  booth: [
    { title: "צילום המקום", help: "איך המקום נראה ומי עובר בו.", photo: "צילום מקום", control: `<select><option>צפוף ומתאים</option><option>סביר</option><option>דורש בדיקה</option></select>` },
    { title: "שעות מומלצות", help: "מתי כדאי להגיע ואיך לפרוס.", photo: "צילום עם סימון", control: `<textarea rows="2" placeholder="מתי כן ומתי לא?"></textarea>` },
    { title: "הערות על תנועה וציוד", help: "ממה להיזהר ומה להביא.", photo: "צילום נוסף אם צריך", control: `<textarea rows="3" placeholder="ציוד, צפיפות, סיכונים, חניה..."></textarea>` }
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
const photoCache = new Map();

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
  const type = card.dataset.type || "cluster";
  const typeBadge = document.getElementById("documentPointType");
  typeBadge.className = `point-kind ${type}`;
  typeBadge.textContent = card.dataset.badge || type;
  document.getElementById("documentPointNumber").textContent = card.dataset.number || "";
  document.getElementById("documentPointName").textContent = card.dataset.name || "";
  document.getElementById("documentPointAddress").textContent = card.dataset.address || "";
  document.getElementById("submittedPointName").textContent = `${card.dataset.number || ""} · ${card.dataset.name || ""}`;
  document.getElementById("plannedLocationText").textContent = card.dataset.address || "לפי מוביל הצוות";
  const actual = document.getElementById("actualLocationText");
  actual.textContent = "עדיין לא אומת מהמכשיר";
  actual.className = "";

  const query = encodeURIComponent((card.dataset.address || "").replace("·", " "));
  const navLinks = document.querySelectorAll(".nav-actions a");
  navLinks[0].href = `https://www.waze.com/ul?q=${query}`;
  navLinks[1].href = `https://www.google.com/maps/search/?api=1&query=${query}`;

  document.querySelectorAll("#documentScreen .mission-step").forEach((step) => step.classList.remove("done"));
  document.getElementById("blockerBox").hidden = true;
  renderMission(type);
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
    : `<span class="all-good">אין חוסרים בולטים</span>`;
  document.getElementById("submitDecision").hidden = false;
}

function attachPointLaunchers() {
  document.querySelectorAll(".continue-assignment, .take-button, .point-open").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-type]");
      if (button.classList.contains("take-button")) {
        const ok = confirm(`לקחת את ${card.dataset.number}? הנקודה תישמר עבורך ל-10 שעות.`);
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
    alert("צריך לבחור מרחב ומשתמש");
    return;
  }
  if (!password) {
    alert("צריך להזין סיסמה");
    return;
  }
  if (password.length < 4) {
    alert("הסיסמה קצרה מדי");
    return;
  }
  document.getElementById("welcomeLine").textContent = `שלום, ${user}`;
  document.getElementById("welcomeLine").dataset.merhav = merhav;
  showScreen("queue");
});

document.querySelectorAll("[data-nav]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.nav));
});

document.getElementById("addFieldPoint").addEventListener("click", () => showScreen("newPoint"));

document.getElementById("releaseButton").addEventListener("click", () => {
  if (confirm("לשחרר את הנקודה ולחזור לרשימה?")) showScreen("queue");
});

document.getElementById("confirmLocation").addEventListener("click", () => {
  const status = document.getElementById("actualLocationText");
  status.textContent = "המיקום המתוכנן אושר בשטח";
  status.className = "location-ok";
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
      const query = encodeURIComponent(`${lat},${lng}`);
      const navLinks = document.querySelectorAll(".nav-actions a");
      navLinks[0].href = `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
      navLinks[1].href = `https://www.google.com/maps/search/?api=1&query=${query}`;
      status.textContent = `עודכן למיקום הנוכחי: ${lat}, ${lng}`;
      status.className = "location-ok";
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
    button.textContent = "✓ נשמר";
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
        <strong>ממתין לתמונה...</strong>
        <div class="photo-actions">
          <button class="remove-photo" type="button">מחיקה</button>
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
    editor.hidden = false;
    editorPhoto.style.background = preview ? `#394b52 url(${preview.src}) center/contain no-repeat` : "#394b52";
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
    alert("צריך לבחור סוג נקודה");
    return;
  }
  const virtualCard = {
    dataset: {
      type: selectedNewType,
      number: `${selectedNewType === "cluster" ? "אשכול" : selectedNewType === "signage" ? "שילוט" : "דוכן"} חדש`,
      name: document.getElementById("newName").value || "נקודה חדשה",
      address: `${document.getElementById("newTown").value} · מיקום נוכחי`,
      badge: selectedNewType === "cluster" ? "אשכול זהב" : selectedNewType === "signage" ? "שילוט" : "דוכן"
    }
  };
  setActivePoint(virtualCard);
  showScreen("document");
});

document.getElementById("closeEditor").addEventListener("click", () => {
  document.querySelector(".editor-photo").style.background = "#394b52";
  document.getElementById("photoEditor").hidden = true;
  activePhotoEditorItem = null;
});
document.getElementById("saveEditor").addEventListener("click", () => {
  if (activePhotoEditorItem) {
    const captionInput = activePhotoEditorItem.querySelector("input[type='text']");
    const editorCaption = document.getElementById("editorCaption");
    if (captionInput) captionInput.value = editorCaption.value.trim();
  }
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
