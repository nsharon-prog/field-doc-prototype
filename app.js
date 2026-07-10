const screens = {
  queue: document.getElementById("queueScreen"),
  document: document.getElementById("documentScreen"),
  submitted: document.getElementById("submittedScreen"),
  newPoint: document.getElementById("newPointScreen")
};

const missionPlans = {
  cluster: {
    label: "אשכול",
    steps: [
      {
        title: "צילום הכניסה לאשכול",
        help: "עמדו במקום שממנו קל לזהות את הכניסה.",
        photo: "צילום כניסה",
        question: "האם הכניסה ברורה למתנדבים?",
        control: `<select><option>כן, ברורה</option><option>צריך הסבר נוסף</option><option>יש כמה כניסות</option></select>`
      },
      {
        title: "מיקום צפוי לדוכן",
        help: "צלמו את המדרכה ואת הסביבה שבה הדוכן אמור לעמוד.",
        photo: "צילום מקום הדוכן",
        question: "רוחב מדרכה / מקום פנוי",
        control: `<input inputmode="decimal" placeholder="בערך במטרים">`
      },
      {
        title: "הערות הקמה",
        help: "מה צריך לדעת מי שמקים את המקום בבוקר הבחירות?",
        photo: "צילום נוסף אם צריך",
        question: "הוראות למתנדבים",
        control: `<textarea rows="3" placeholder="גישה, מגבלות, נקודת מפגש, דברים שיכולים לבלבל..."></textarea>`
      }
    ]
  },
  signage: {
    label: "שילוט",
    steps: [
      {
        title: "מבט מרחוק",
        help: "עמדו איפה שרכב או הולך רגל יראה את השלט.",
        photo: "צילום מרחוק",
        question: "רמת חשיבות",
        control: `<select><option>1 - בקרבת אשכול זהב</option><option>2 - אזור צפוף תומכים / נראות גבוהה לתעבורה של היישוב</option><option>3 - בקרבת אשכול רגיל גבוה יחסית</option><option>4 - ביישוב תומך</option><option>5 - נראה לי טוב</option></select><textarea rows="2" placeholder="סיבה לחשיבות: מה רואים כאן שמצדיק שילוט?"></textarea>`
      },
      {
        title: "מקום תלייה מקרוב",
        help: "צלמו את העמוד, הגדר או הקיר ואת נקודות החיבור.",
        photo: "צילום מקרוב",
        question: "איך תולים כאן?",
        control: `<textarea rows="2" placeholder="אזיקונים, חבל, סולם, שני אנשים לפחות..."></textarea>`
      },
      {
        title: "מדידות",
        help: "צלמו שוב אם צריך לסמן חץ או גבולות לשלט.",
        photo: "צילום עם סימון",
        question: "גודל מקסימלי לשלטים",
        control: `<div class="measurement-row"><input inputmode="decimal" placeholder="רוחב בס״מ"><input inputmode="decimal" placeholder="גובה בס״מ"></div>`
      },
      {
        title: "סיכונים ובקשות מיוחדות",
        help: "סכמו מה יכול להשפיע על השלט אחרי ההקמה.",
        photo: "צילום נוסף אם צריך",
        question: "סיכון / שפה / בקשה מיוחדת",
        control: `<textarea rows="3" placeholder="מלחמת מקום, סיכון לנזק, ערבית/רוסית, מגבלות מיוחדות..."></textarea>`
      }
    ]
  },
  booth: {
    label: "דוכן",
    steps: [
      {
        title: "מבט רחב על המקום",
        help: "צלמו כך שרואים תנועת אנשים ואת הסביבה.",
        photo: "צילום רחב",
        question: "כמה המקום נראה פעיל?",
        control: `<select><option>1 - צפוף עם קהל מתאים</option><option>2 - צפוף כללי</option><option>3 - ליד אשכול זהב</option><option>4 - ליד אשכול רגיל</option><option>5 - רעיון ששווה בדיקה</option></select>`
      },
      {
        title: "המיקום המדויק לדוכן",
        help: "צלמו את המקום שבו הדוכן יעמוד בפועל.",
        photo: "צילום מיקום הדוכן",
        question: "איזה סוג דוכן מתאים?",
        control: `<select><option>דוכן מלא</option><option>דוכנוע</option><option>עוד לא ברור</option></select>`
      },
      {
        title: "שעות ותוכן",
        help: "אם אפשר, צלמו מה גורם לכם לחשוב שהשעה חשובה.",
        photo: "צילום אופציונלי",
        question: "שעות מומלצות / פליירים / שפות",
        control: `<textarea rows="3" placeholder="למשל 16:00-20:00, פליירים ברוסית, נושא תחבורה..."></textarea>`
      },
      {
        title: "סיכונים והערות מקום",
        help: "סכמו מה יכול להפריע להפעלה של הדוכן.",
        photo: "צילום נוסף אם צריך",
        question: "סיכון / תחרות על מקום / הערות",
        control: `<textarea rows="2" placeholder="עומס, התנגדות צפויה, מקום צר, מגבלות מיוחדות..."></textarea>`
      }
    ]
  }
};

let currentType = "cluster";

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
  document.querySelector(".bottom-nav").hidden = name !== "queue";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderMission(type) {
  currentType = type;
  const plan = missionPlans[type] || missionPlans.cluster;
  const steps = document.getElementById("missionSteps");
  steps.innerHTML = plan.steps.map((step, index) => `
    <section class="mission-step field-step">
      <div class="step-title">
        <span>${index + 2}</span>
        <div><h2>${step.title}</h2><p>${step.help}</p></div>
      </div>
      <div class="photo-line">
        <button class="add-photo" type="button">📷 ${step.photo}</button>
        <small>אפשר להוסיף יותר מתמונה אחת</small>
      </div>
      <div class="photo-gallery"></div>
      <label>${step.question}${step.control}</label>
      <button class="complete-step" type="button">סיימתי שלב זה</button>
    </section>
  `).join("");
  document.getElementById("logisticsStepNumber").textContent = plan.steps.length + 2;
  document.getElementById("equipmentStepNumber").textContent = plan.steps.length + 3;
  document.getElementById("reviewStepNumber").textContent = plan.steps.length + 4;
  updateProgress();
}

function updateProgress() {
  const total = document.querySelectorAll("#documentScreen .complete-step").length;
  const done = document.querySelectorAll("#documentScreen .mission-step.done").length;
  document.getElementById("progressText").textContent = `${done} מתוך ${total}`;
  document.getElementById("progressBar").style.width = `${Math.min(100, (done / total) * 100)}%`;
}

function setActivePoint(card) {
  const type = card.dataset.type || "cluster";
  const typeBadge = document.getElementById("documentPointType");
  typeBadge.className = `point-kind ${type}`;
  typeBadge.textContent = card.dataset.badge || missionPlans[type].label;
  document.getElementById("documentPointNumber").textContent = card.dataset.number;
  document.getElementById("documentPointName").textContent = card.dataset.name;
  document.getElementById("documentPointAddress").textContent = card.dataset.address;
  document.getElementById("submittedPointName").textContent = `${card.dataset.number} · ${card.dataset.name}`;
  document.getElementById("plannedLocationText").textContent = card.dataset.address;
  document.getElementById("actualLocationText").textContent = "עדיין לא אומת מהמכשיר";
  document.getElementById("actualLocationText").className = "";
  const query = encodeURIComponent(card.dataset.address.replace("·", " "));
  const navLinks = document.querySelectorAll(".nav-actions a");
  navLinks[0].href = `https://www.waze.com/ul?q=${query}`;
  navLinks[1].href = `https://www.google.com/maps/search/?api=1&query=${query}`;
  document.querySelectorAll("#documentScreen .mission-step").forEach((step) => step.classList.remove("done"));
  document.getElementById("blockerBox").hidden = true;
  renderMission(type);
}

document.querySelectorAll(".continue-assignment, .take-button").forEach((button) => {
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

document.querySelectorAll("[data-nav]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.nav));
});

document.getElementById("addFieldPoint").addEventListener("click", () => showScreen("newPoint"));
document.getElementById("releaseButton").addEventListener("click", () => {
  if (confirm("לשחרר את הנקודה ולהחזיר אותה לרשימה הפתוחה?")) showScreen("queue");
});

const submitDecision = document.getElementById("submitDecision");

function collectMissingItems() {
  const items = [];
  document.querySelectorAll("#documentScreen .mission-step").forEach((step) => {
    const title = step.querySelector("h2")?.textContent || "שלב";
    if (!step.classList.contains("done")) items.push(`לא סומן שהשלב "${title}" הושלם`);
    if (step.classList.contains("field-step") && step.querySelectorAll(".photo-item").length === 0) {
      items.push(`אין תמונה בשלב "${title}"`);
    }
  });
  if (!document.getElementById("actualLocationText").className) {
    items.push("המיקום עדיין לא אושר או עודכן מהמכשיר");
  }
  return items;
}

function openSubmitDecision() {
  const missing = collectMissingItems();
  const list = document.getElementById("missingList");
  list.innerHTML = missing.length
    ? missing.map((item) => `<span>${item}</span>`).join("")
    : `<span class="all-good">לא זוהו חוסרים ברורים</span>`;
  submitDecision.hidden = false;
}

document.getElementById("submitReview").addEventListener("click", openSubmitDecision);
document.getElementById("backToMissing").addEventListener("click", () => {
  submitDecision.hidden = true;
  const firstMissing = [...document.querySelectorAll("#documentScreen .mission-step")]
    .find((step) => !step.classList.contains("done") || (step.classList.contains("field-step") && step.querySelectorAll(".photo-item").length === 0));
  if (firstMissing) firstMissing.scrollIntoView({ behavior: "smooth", block: "start" });
});
document.getElementById("sendAnyway").addEventListener("click", () => {
  submitDecision.hidden = true;
  showScreen("submitted");
});
document.getElementById("saveForLater").addEventListener("click", () => {
  submitDecision.hidden = true;
  showScreen("queue");
});

document.getElementById("blockerToggle").addEventListener("click", () => {
  const box = document.getElementById("blockerBox");
  box.hidden = !box.hidden;
});

document.getElementById("confirmLocation").addEventListener("click", () => {
  const status = document.getElementById("actualLocationText");
  status.textContent = "המיקום המתוכנן אושר בשטח";
  status.className = "location-ok";
});

document.getElementById("useCurrentLocation").addEventListener("click", () => {
  const status = document.getElementById("actualLocationText");
  if (!confirm("לעדכן את מיקום הנקודה למיקום הנוכחי שלך?")) return;
  status.textContent = "קולט מיקום מהמכשיר...";
  status.className = "location-pending";
  if (!navigator.geolocation) {
    status.textContent = "המיקום עודכן למיקום הנוכחי (הדגמה)";
    status.className = "location-updated";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);
      const query = encodeURIComponent(`${lat},${lng}`);
      const navLinks = document.querySelectorAll(".nav-actions a");
      navLinks[0].href = `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
      navLinks[1].href = `https://www.google.com/maps/search/?api=1&query=${query}`;
      status.textContent = `מיקום הנקודה עודכן: ${lat}, ${lng}`;
      status.className = "location-updated";
    },
    () => {
      status.textContent = "לא התקבל מיקום. אפשר לנסות שוב ליד הנקודה.";
      status.className = "location-error";
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
  );
});

let selectedNewType = "";
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
    alert("כדאי לבחור סוג נקודה כדי שנפתח את המסלול הנכון");
    return;
  }
  const virtualCard = {
    dataset: {
      type: selectedNewType,
      number: `${missionPlans[selectedNewType].label} חדש`,
      name: document.getElementById("newName").value,
      address: `${document.getElementById("newTown").value} · המיקום הנוכחי`,
      badge: "חדש מהשטח"
    }
  };
  setActivePoint(virtualCard);
  showScreen("document");
});

const photoEditor = document.getElementById("photoEditor");
document.getElementById("closeEditor").addEventListener("click", () => {
  photoEditor.hidden = true;
});
document.getElementById("saveEditor").addEventListener("click", () => {
  photoEditor.hidden = true;
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.classList.contains("complete-step")) {
    button.closest(".mission-step").classList.add("done");
    button.textContent = "✓ השלב סומן כהושלם";
    updateProgress();
    return;
  }

  if (button.classList.contains("annotate-button")) {
    photoEditor.hidden = false;
    return;
  }

  if (button.classList.contains("remove-photo")) {
    button.closest(".photo-item").remove();
    return;
  }

  if (button.classList.contains("add-photo")) {
    const step = button.closest(".mission-step");
    const gallery = step.querySelector(".photo-gallery") || document.createElement("div");
    gallery.className = "photo-gallery";
    if (!gallery.parentNode) button.after(gallery);
    const item = document.createElement("div");
    item.className = "photo-item";
    item.innerHTML = `
      <div class="photo-thumb"><span class="demo-arrow">➜</span></div>
      <div>
        <input placeholder="מה רואים בתמונה?" aria-label="תיאור תמונה">
        <div class="photo-actions">
          <button class="annotate-button" type="button">עריכת תמונה</button>
          <button class="remove-photo" type="button">מחיקה</button>
        </div>
      </div>`;
    gallery.appendChild(item);
  }
});

renderMission("cluster");

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js");
}
