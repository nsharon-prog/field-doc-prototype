const FIELD_DOC_APP = {
  properties: PropertiesService.getScriptProperties(),
  sheetNames: ["Settings", "Teams", "Users", "Points", "Photos", "StatusHistory", "InfraTests"]
};

function doGet(event) {
  const action = (event.parameter.action || "health").toLowerCase();
  if (action === "health") return jsonResponse(getHealth_());
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
    SETUP_AT: new Date().toISOString()
  }, true);

  ensureSheets_(spreadsheet);
  seedSettings_(spreadsheet, rootFolder);

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
    now: new Date().toISOString()
  };
}

function saveFeasibilitySubmission_(payload) {
  const workspace = requireWorkspace_();
  const spreadsheet = SpreadsheetApp.openById(workspace.spreadsheetId);
  const rootFolder = DriveApp.getFolderById(workspace.rootFolderId);
  const pointId = payload.pointId || `TEST-${Date.now()}`;
  const timestamp = new Date();
  const town = payload.town || "צפון השרון";
  const pointFolder = getOrCreateChildFolder_(getOrCreateChildFolder_(rootFolder, town), pointId);

  const point = {
    pointId,
    timestamp: timestamp.toISOString(),
    type: payload.type || "signage",
    number: payload.number || "בדיקה 001",
    town,
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

function ensureSheets_(spreadsheet) {
  FIELD_DOC_APP.sheetNames.forEach((name) => {
    if (!spreadsheet.getSheetByName(name)) spreadsheet.insertSheet(name);
  });
  setHeaders_(spreadsheet.getSheetByName("Settings"), ["key", "value"]);
  setHeaders_(spreadsheet.getSheetByName("Teams"), ["teamId", "town", "teamName", "teamLeadEmail", "active"]);
  setHeaders_(spreadsheet.getSheetByName("Users"), ["userId", "name", "email", "phone", "role", "teamId", "active"]);
  setHeaders_(spreadsheet.getSheetByName("Points"), ["pointId", "timestamp", "type", "number", "town", "teamId", "status", "plannedAddress", "correctedLat", "correctedLng", "documentedBy", "notes"]);
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

function requireWorkspace_() {
  const spreadsheetId = FIELD_DOC_APP.properties.getProperty("SPREADSHEET_ID");
  const rootFolderId = FIELD_DOC_APP.properties.getProperty("ROOT_FOLDER_ID");
  if (!spreadsheetId || !rootFolderId) throw new Error("Workspace not set up. POST { action: 'setup' } first.");
  return { spreadsheetId, rootFolderId };
}

function setHeaders_(sheet, headers) {
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
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

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
