const FIELD_DOC_APP = {
  properties: PropertiesService.getScriptProperties(),
  sheetNames: ["Settings", "Districts", "Merhavim", "Settlements", "Teams", "Users", "Points", "Photos", "StatusHistory", "InfraTests"]
};
const SOURCE_HIERARCHY_SPREADSHEET_ID = "1F4vHhLNe6OPpEyZRzSaNd9hIJn4xHr4e-NdF1ECEGtU";

function doGet(event) {
  const action = (event.parameter.action || "health").toLowerCase();
  if (action === "health") return jsonResponse(getHealth_());
  if (action === "setup") return jsonResponse(setupWorkspace_());
  if (action === "hierarchy") return jsonResponse(getHierarchy_());
  if (action === "testpoint") return jsonResponse(getLatestTestPoint_());
  return jsonResponse({ ok: false, error: "Unknown action" });
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    const action = (payload.action || "").toLowerCase();
    if (action === "setup") return jsonResponse(setupWorkspace_());
    if (action === "submitfeasibility") return jsonResponse(saveFeasibilitySubmission_(payload));
    return jsonResponse({ ok: false, error: "Unknown action" });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error), stack: error.stack || "" });
  }
}

function setupWorkspace_() {
  const existingSheetId = FIELD_DOC_APP.properties.getProperty("SPREADSHEET_ID");
  const existingFolderId = FIELD_DOC_APP.properties.getProperty("ROOT_FOLDER_ID");

  const spreadsheet = existingSheetId
    ? SpreadsheetApp.openById(existingSheetId)
    : SpreadsheetApp.create("תיעוד שטח - בדיקת תשתית");
  const rootFolder = existingFolderId
    ? DriveApp.getFolderById(existingFolderId)
    : DriveApp.createFolder("תיעוד שטח - בדיקת תשתית");

  FIELD_DOC_APP.properties.setProperties({
    SPREADSHEET_ID: spreadsheet.getId(),
    ROOT_FOLDER_ID: rootFolder.getId(),
    SETUP_EMAIL: Session.getEffectiveUser().getEmail(),
    SETUP_AT: israelTimestamp_()
  }, true);

  ensureSheets_(spreadsheet);
  seedSettings_(spreadsheet, rootFolder);
  seedHierarchy_(spreadsheet);

  return {
    ok: true,
    ownerEmail: Session.getEffectiveUser().getEmail(),
    spreadsheetId: spreadsheet.getId(),
    spreadsheetUrl: spreadsheet.getUrl(),
    rootFolderId: rootFolder.getId(),
    rootFolderUrl: rootFolder.getUrl()
  };
}

function getHealth_() {
  const sheetId = FIELD_DOC_APP.properties.getProperty("SPREADSHEET_ID");
  const folderId = FIELD_DOC_APP.properties.getProperty("ROOT_FOLDER_ID");
  return {
    ok: true,
    configured: Boolean(sheetId && folderId),
    ownerEmail: Session.getEffectiveUser().getEmail(),
    spreadsheetId: sheetId || "",
    rootFolderId: folderId || "",
    now: israelTimestamp_()
  };
}

function saveFeasibilitySubmission_(payload) {
  const workspace = requireWorkspace_();
  const spreadsheet = SpreadsheetApp.openById(workspace.spreadsheetId);
  const rootFolder = DriveApp.getFolderById(workspace.rootFolderId);
  const pointId = payload.pointId || `TEST-${Date.now()}`;
  const timestamp = israelTimestamp_();
  const districtId = payload.districtId || "north-sharon-district";
  const districtName = payload.districtName || "מחוז צפון השרון";
  const merhavId = payload.merhavId || "east-sharon";
  const merhavName = payload.merhavName || "מרחב מזרח השרון";
  const settlementId = payload.settlementId || "kfar-saba";
  const settlementName = payload.town || payload.settlementName || "כפר סבא";
  const pointFolder = getOrCreateChildFolder_(
    getOrCreateChildFolder_(
      getOrCreateChildFolder_(rootFolder, districtName),
      merhavName
    ),
    `${settlementName} - ${pointId}`
  );

  const point = {
    pointId,
    timestamp,
    districtId,
    districtName,
    merhavId,
    merhavName,
    settlementId,
    settlementName,
    type: payload.type || "signage",
    number: payload.number || "בדיקה 001",
    town: settlementName,
    teamId: payload.teamId || "north-sharon",
    status: "Waiting for review",
    plannedAddress: payload.plannedAddress || "",
    correctedLat: payload.correctedLocation && payload.correctedLocation.lat || "",
    correctedLng: payload.correctedLocation && payload.correctedLocation.lng || "",
    documentedBy: payload.documentedBy || "",
    notes: payload.notes || ""
  };

  appendObject_(spreadsheet.getSheetByName("Points"), point);
  appendObject_(spreadsheet.getSheetByName("StatusHistory"), {
    pointId,
    timestamp: point.timestamp,
    fromStatus: "",
    toStatus: point.status,
    changedBy: point.documentedBy,
    note: "Infrastructure feasibility submission"
  });

  const savedPhotos = (payload.photos || []).map((photo, index) => {
    const bytes = Utilities.base64Decode(photo.base64 || "");
    const blob = Utilities.newBlob(bytes, photo.mimeType || "image/jpeg", photo.fileName || `${pointId}-${index + 1}.jpg`);
    const file = pointFolder.createFile(blob);
    const row = {
      photoId: `${pointId}-P${index + 1}`,
      pointId,
      timestamp: point.timestamp,
      itemKey: photo.itemKey || "feasibility",
      caption: photo.caption || "",
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      mimeType: photo.mimeType || "image/jpeg",
      compressedBytes: bytes.length,
      width: photo.width || "",
      height: photo.height || ""
    };
    appendObject_(spreadsheet.getSheetByName("Photos"), row);
    return row;
  });

  appendObject_(spreadsheet.getSheetByName("InfraTests"), {
    timestamp: point.timestamp,
    pointId,
    result: "PASS",
    photos: savedPhotos.length,
    spreadsheetId: workspace.spreadsheetId,
    rootFolderId: workspace.rootFolderId
  });

  return {
    ok: true,
    point,
    photos: savedPhotos,
    output: buildOutputUrls_(point)
  };
}

function getLatestTestPoint_() {
  const workspace = requireWorkspace_();
  const spreadsheet = SpreadsheetApp.openById(workspace.spreadsheetId);
  const points = sheetObjects_(spreadsheet.getSheetByName("Points"));
  const photos = sheetObjects_(spreadsheet.getSheetByName("Photos"));
  const point = points[points.length - 1];
  if (!point) return { ok: true, point: null, photos: [] };
  return {
    ok: true,
    point,
    photos: photos.filter((photo) => photo.pointId === point.pointId),
    output: buildOutputUrls_(point)
  };
}

function getHierarchy_() {
  const workspace = requireWorkspace_();
  const spreadsheet = SpreadsheetApp.openById(workspace.spreadsheetId);
  return {
    ok: true,
    districts: cleanHierarchyRows_(activeRows_(sheetObjects_(spreadsheet.getSheetByName("Districts"))), "districtId", ["north-sharon-district"]),
    merhavim: cleanHierarchyRows_(activeRows_(sheetObjects_(spreadsheet.getSheetByName("Merhavim"))), "merhavId", ["east-sharon"]),
    settlements: cleanHierarchyRows_(activeRows_(sheetObjects_(spreadsheet.getSheetByName("Settlements"))), "settlementId", ["kfar-saba"]),
    teams: activeRows_(sheetObjects_(spreadsheet.getSheetByName("Teams"))),
    settings: sheetObjects_(spreadsheet.getSheetByName("Settings"))
  };
}

function ensureSheets_(spreadsheet) {
  FIELD_DOC_APP.sheetNames.forEach((name) => {
    if (!spreadsheet.getSheetByName(name)) spreadsheet.insertSheet(name);
  });
  setHeaders_(spreadsheet.getSheetByName("Settings"), ["key", "value"]);
  setHeaders_(spreadsheet.getSheetByName("Districts"), ["districtId", "districtName", "districtLeadEmail", "active"]);
  setHeaders_(spreadsheet.getSheetByName("Merhavim"), ["merhavId", "districtId", "merhavName", "merhavLeadEmail", "active"]);
  setHeaders_(spreadsheet.getSheetByName("Settlements"), ["settlementId", "merhavId", "districtId", "settlementName", "settlementLeadEmail", "active"]);
  setHeaders_(spreadsheet.getSheetByName("Teams"), ["teamId", "districtId", "merhavId", "settlementId", "town", "teamName", "teamLeadEmail", "active"]);
  setHeaders_(spreadsheet.getSheetByName("Users"), ["userId", "name", "email", "phone", "role", "districtId", "merhavId", "settlementId", "teamId", "active"]);
  setHeaders_(spreadsheet.getSheetByName("Points"), ["pointId", "timestamp", "districtId", "districtName", "merhavId", "merhavName", "settlementId", "settlementName", "type", "number", "town", "teamId", "status", "plannedAddress", "correctedLat", "correctedLng", "documentedBy", "notes"]);
  setHeaders_(spreadsheet.getSheetByName("Photos"), ["photoId", "pointId", "timestamp", "itemKey", "caption", "fileId", "fileUrl", "mimeType", "compressedBytes", "width", "height"]);
  setHeaders_(spreadsheet.getSheetByName("StatusHistory"), ["pointId", "timestamp", "fromStatus", "toStatus", "changedBy", "note"]);
  setHeaders_(spreadsheet.getSheetByName("InfraTests"), ["timestamp", "pointId", "result", "photos", "spreadsheetId", "rootFolderId"]);
}

function seedSettings_(spreadsheet, rootFolder) {
  const settings = spreadsheet.getSheetByName("Settings");
  if (settings.getLastRow() > 1) return;
  appendObject_(settings, { key: "rootFolderId", value: rootFolder.getId() });
  appendObject_(settings, { key: "rootFolderUrl", value: rootFolder.getUrl() });
  appendObject_(settings, { key: "photoMaxWidth", value: "1600" });
  appendObject_(settings, { key: "photoJpegQuality", value: "0.76" });
  appendObject_(settings, { key: "superAdminEmail", value: "" });
}

function seedHierarchy_(spreadsheet) {
  const districts = spreadsheet.getSheetByName("Districts");
  const merhavim = spreadsheet.getSheetByName("Merhavim");
  const settlements = spreadsheet.getSheetByName("Settlements");
  if (districts.getLastRow() < 2) {
    appendObject_(districts, {
      districtId: "north-sharon-district",
      districtName: "מחוז צפון השרון",
      districtLeadEmail: "",
      active: true
    });
  }
  syncHierarchyFromSource_(spreadsheet);
}

function syncHierarchyFromSource_(spreadsheet) {
  try {
    const source = SpreadsheetApp.openById(SOURCE_HIERARCHY_SPREADSHEET_ID);
    const sheet = source.getSheets()[0];
    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return;
    const headers = values[0].map((value) => String(value).trim());
    const rows = values.slice(1);
    const townIndex = headers.indexOf("יישוב");
    const merhavIndex = headers.indexOf("מרחב");
    if (townIndex === -1 || merhavIndex === -1) return;

    const existingMerhavIds = new Set(sheetObjects_(spreadsheet.getSheetByName("Merhavim")).map((row) => String(row.merhavId)));
    const existingSettlementIds = new Set(sheetObjects_(spreadsheet.getSheetByName("Settlements")).map((row) => String(row.settlementId)));
    const districtId = "north-sharon-district";
    const districtName = "מחוז צפון השרון";

    const merhavNameById = new Map();
    const settlementRows = [];

    rows.forEach((row) => {
      const settlementName = String(row[townIndex] || "").trim();
      const merhavName = String(row[merhavIndex] || "").trim();
      if (!settlementName || !merhavName) return;
      const merhavId = slugify_(merhavName);
      const settlementId = slugify_(settlementName);
      if (!existingMerhavIds.has(merhavId)) {
        merhavNameById.set(merhavId, merhavName);
      }
      if (!existingSettlementIds.has(settlementId)) {
        settlementRows.push({
          settlementId,
          merhavId,
          districtId,
          settlementName,
          settlementLeadEmail: "",
          active: true
        });
      }
    });

    merhavNameById.forEach((merhavName, merhavId) => {
      appendObject_(spreadsheet.getSheetByName("Merhavim"), {
        merhavId,
        districtId,
        merhavName,
        merhavLeadEmail: "",
        active: true
      });
    });
    settlementRows.forEach((settlement) => appendObject_(spreadsheet.getSheetByName("Settlements"), settlement));
  } catch (error) {
    Logger.log(`Hierarchy sync skipped: ${error}`);
  }
}

function requireWorkspace_() {
  const spreadsheetId = FIELD_DOC_APP.properties.getProperty("SPREADSHEET_ID");
  const rootFolderId = FIELD_DOC_APP.properties.getProperty("ROOT_FOLDER_ID");
  if (!spreadsheetId || !rootFolderId) throw new Error("Workspace not set up. POST { action: 'setup' } first.");
  return { spreadsheetId, rootFolderId };
}

function setHeaders_(sheet, headers) {
  const lastColumn = sheet.getLastColumn();
  const existingHeaders = lastColumn
    ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0].filter(Boolean)
    : [];
  const mergedHeaders = existingHeaders.slice();
  headers.forEach((header) => {
    if (mergedHeaders.indexOf(header) === -1) mergedHeaders.push(header);
  });
  sheet.getRange(1, 1, 1, mergedHeaders.length).setValues([mergedHeaders]).setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function appendObject_(sheet, object) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map((key) => object[key] == null ? "" : object[key]);
  sheet.appendRow(row);
}

function sheetObjects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).map((row) => {
    const object = {};
    headers.forEach((header, index) => object[header] = row[index]);
    return object;
  });
}

function activeRows_(rows) {
  return rows.filter((row) => String(row.active).toLowerCase() !== "false");
}

function cleanHierarchyRows_(rows, key, blockedIds) {
  const blocked = new Set(blockedIds || []);
  const cleaned = rows.filter((row) => !blocked.has(String(row[key])));
  const deduped = [];
  const seen = new Set();
  cleaned.forEach((row) => {
    const id = String(row[key] || "");
    if (!id || seen.has(id)) return;
    seen.add(id);
    deduped.push(row);
  });
  return deduped;
}

function slugify_(text) {
  return String(text || "")
    .trim()
    .replace(/["'`]/g, "")
    .replace(/[\u0591-\u05C7]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9\u0590-\u05FF-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function getOrCreateChildFolder_(parent, name) {
  const existing = parent.getFoldersByName(name);
  return existing.hasNext() ? existing.next() : parent.createFolder(name);
}

function buildOutputUrls_(point) {
  const hasCorrected = point.correctedLat && point.correctedLng;
  const query = hasCorrected
    ? `${point.correctedLat},${point.correctedLng}`
    : point.plannedAddress;
  return {
    googleMaps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
    waze: hasCorrected
      ? `https://www.waze.com/ul?ll=${point.correctedLat},${point.correctedLng}&navigate=yes`
      : `https://www.waze.com/ul?q=${encodeURIComponent(query)}`
  };
}

function israelTimestamp_() {
  return Utilities.formatDate(new Date(), "Asia/Jerusalem", "yyyy-MM-dd HH:mm:ss");
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
