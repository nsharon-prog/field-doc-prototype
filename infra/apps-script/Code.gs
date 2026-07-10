const FIELD_DOC_APP = {
  properties: PropertiesService.getScriptProperties(),
  sheetNames: ["Settings", "Districts", "Merhavim", "Settlements", "Teams", "Users", "Points", "Photos", "StatusHistory", "InfraTests"]
};

function doGet(event) {
  const action = (event.parameter.action || "health").toLowerCase();
  if (action === "health") return jsonResponse(getHealth_());
  if (action === "setup") return jsonResponse(setupWorkspace_());
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
  if (merhavim.getLastRow() < 2) {
    appendObject_(merhavim, {
      merhavId: "east-sharon",
      districtId: "north-sharon-district",
      merhavName: "מרחב מזרח השרון",
      merhavLeadEmail: "",
      active: true
    });
  }
  if (settlements.getLastRow() < 2) {
    appendObject_(settlements, {
      settlementId: "kfar-saba",
      merhavId: "east-sharon",
      districtId: "north-sharon-district",
      settlementName: "כפר סבא",
      settlementLeadEmail: "",
      active: true
    });
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
