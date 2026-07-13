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
let photoEditor = null;
let editorCaption = null;
const photoCache = new Map();

function getPhotoEditor() {
  if (!photoEditor) photoEditor = document.getElementById("photoEditor");
  if (!editorCaption) editorCaption = document.getElementById("editorCaption");
  return photoEditor;
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
  document.querySelectorAll("#documentScreen .mission-step").forEach((step) => {
    let state = step.querySelector(".step-state");
    if (!state) {
      state = document.createElement("div");
      state.className = "step-state pending-state";
      state.textContent = "×¢×•×“ ×œ× ×‘×•×¦×¢";
      const anchor = step.querySelector(".step-title");
      if (anchor && anchor.nextSibling) {
        anchor.parentNode.insertBefore(state, anchor.nextSibling);
      } else if (anchor) {
        anchor.insertAdjacentElement("afterend", state);
      } else {
        step.appendChild(state);
      }
    }
  });
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
}

function openPointCard(card, allowConfirm) {
  if (!card) return;
  if (allowConfirm && card.classList.contains("point-card")) {
    const ok = confirm(`×œ×§×—×ª ××ª ${card.dataset.number}? ×”× ×§×•×“×” ×ª×™×©×ž×¨ ×¢×‘×•×¨×š ×œ-10 ×©×¢×•×ª.`);
    if (!ok) return;
  }
  showScreen("document");
  try {
    setActivePoint(card);
  } catch (error) {
    console.error("Failed to load point card", error);
  }
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
    button.style.touchAction = "manipulation";
    button.onclick = () => {
      const card = button.closest("[data-type]");
      openPointCard(card, button.classList.contains("take-button"));
    };
  });
}

window.__openPointCard = openPointCard;

document.addEventListener("pointerup", (event) => {
  const card = event.target.closest(".my-point, .point-card");
  if (!card) return;
  if (event.target.closest("button, input, select, textarea, a")) return;
  openPointCard(card, false);
});

document.addEventListener("click", (event) => {
  const button = event.target.closest(".continue-assignment, .take-button, .point-open");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  const card = button.closest("[data-type]");
  openPointCard(card, button.classList.contains("take-button"));
}, true);

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
  status.style.display = "inline-block";
  status.style.padding = "6px 10px";
  status.style.borderRadius = "999px";
  status.style.background = "#e2f6ee";
});

document.getElementById("useCurrentLocation").addEventListener("click", () => {
  const status = document.getElementById("actualLocationText");
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
      status.style.display = "inline-block";
      status.style.padding = "6px 10px";
      status.style.borderRadius = "999px";
      status.style.background = "#e2f6ee";
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
    const step = button.closest(".mission-step");
    step.classList.add("done");
    const state = step.querySelector(".step-state");
    if (state) {
      state.textContent = "×‘×•×¦×¢";
      state.className = "step-state done-state";
    }
    button.textContent = "âœ“ ×‘×•×¦×¢";
    updateProgress();
    return;
  }

  if (button.classList.contains("add-photo")) {
    activePhotoTarget = button.closest(".mission-step").querySelector(".photo-gallery");
    activePhotoInput = document.getElementById("photoInput");
    activePhotoInput.value = "";
    activePhotoInput.click();
    return;
  }

  if (button.classList.contains("annotate-button")) {
    activePhotoTarget = button.closest(".photo-item");
    getPhotoEditor().hidden = false;
    const captionInput = activePhotoTarget.querySelector("input[type='text']");
    editorCaption.value = captionInput ? captionInput.value : "";
    return;
  }

  if (button.classList.contains("remove-photo")) {
    button.closest(".photo-item").remove();
  }
});

document.getElementById("photoInput").addEventListener("change", async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file || !activePhotoTarget) return;
  const previewUrl = URL.createObjectURL(file);
  const compressed = await compressPhotoFile(file);
  const item = document.createElement("div");
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
  item.dataset.fileName = compressed.fileName;
  item.dataset.base64 = compressed.base64;
  item.dataset.width = String(compressed.width);
  item.dataset.height = String(compressed.height);
  item.dataset.bytes = String(compressed.bytes);
  activePhotoTarget.appendChild(item);
  photoCache.set(item, compressed);
  activePhotoTarget = null;
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
  getPhotoEditor().hidden = true;
});
document.getElementById("saveEditor").addEventListener("click", () => {
  if (!editorCaption) editorCaption = document.getElementById("editorCaption");
  if (activePhotoTarget) {
    const captionInput = activePhotoTarget.querySelector("input[type='text']");
    if (captionInput) captionInput.value = editorCaption.value.trim();
  }
  getPhotoEditor().hidden = true;
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

