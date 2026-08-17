const FIELD_DOC_APP = {
  properties: PropertiesService.getScriptProperties(),
  sheetNames: ["Settings", "Districts", "Merhavim", "Settlements", "Teams", "Users", "Points", "Photos", "Answers", "StatusHistory", "InfraTests"]
};

function doGet(event) {
  const callback = event.parameter.callback || "";
  const action = (event.parameter.action || "health").toLowerCase();
  if (action === "health") return jsonResponse(getHealth_(), callback);
  if (action === "setup") return jsonResponse(setupWorkspace_(), callback);
  if (action === "hierarchy") return jsonResponse(getHierarchy_(), callback);
  if (action === "bootstrap") return jsonResponse(getBootstrap_(event.parameter), callback);
  if (action === "points") return jsonResponse(getPoints_(event.parameter), callback);
  if (action === "synchierarchy") return jsonResponse(syncHierarchyAction_(), callback);
  if (action === "seedgoldclusters") return jsonResponse(seedGoldClusters_(), callback);
  if (action === "seedtestpoint") return jsonResponse(seedTestPoint_(), callback);
  if (action === "createpoint") return jsonResponse(createPoint_(decodeGetPayload_(event.parameter.payload || "")), callback);
  if (action === "claimpoint") return jsonResponse(changePointAssignment_(decodeGetPayload_(event.parameter.payload || ""), "claim"), callback);
  if (action === "releasepoint") return jsonResponse(changePointAssignment_(decodeGetPayload_(event.parameter.payload || ""), "release"), callback);
  if (action === "submitfeasibility") return jsonResponse(saveFeasibilitySubmission_(decodeGetPayload_(event.parameter.payload || "")), callback);
  if (action === "submitpoint") return jsonResponse(saveFieldPointSubmission_(decodeGetPayload_(event.parameter.payload || "")), callback);
  if (action === "testpoint") return jsonResponse(getLatestTestPoint_(), callback);
  return jsonResponse({ ok: false, error: "Unknown action" }, callback);
}

function doPost(event) {
  try {
    const payload = event.parameter && event.parameter.payload
      ? JSON.parse(event.parameter.payload)
      : JSON.parse(event.postData.contents || "{}");
    const action = (payload.action || "").toLowerCase();
    if (action === "setup") return jsonResponse(setupWorkspace_());
    if (action === "seedgoldclusters") return jsonResponse(seedGoldClusters_());
    if (action === "seedtestpoint") return jsonResponse(seedTestPoint_());
    if (action === "createpoint") return jsonResponse(createPoint_(payload));
    if (action === "claimpoint") return jsonResponse(changePointAssignment_(payload, "claim"));
    if (action === "releasepoint") return jsonResponse(changePointAssignment_(payload, "release"));
    if (action === "submitfeasibility") return jsonResponse(saveFeasibilitySubmission_(payload));
    if (action === "submitpoint") return jsonResponse(saveFieldPointSubmission_(payload));
    return jsonResponse({ ok: false, error: "Unknown action" });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error), stack: error.stack || "" });
  }
}

function decodeGetPayload_(encodedPayload) {
  if (!encodedPayload) return {};
  return JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(encodedPayload)).getDataAsString());
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
  }, false);

  ensureSheets_(spreadsheet);
  seedSettings_(spreadsheet, rootFolder);
  const hierarchySync = seedHierarchy_(spreadsheet);

  return {
    ok: true,
    ownerEmail: Session.getEffectiveUser().getEmail(),
    spreadsheetId: spreadsheet.getId(),
    spreadsheetUrl: spreadsheet.getUrl(),
    rootFolderId: rootFolder.getId(),
    rootFolderUrl: rootFolder.getUrl(),
    hierarchySync
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

function saveFieldPointSubmission_(payload) {
  const workspace = requireWorkspace_();
  const spreadsheet = SpreadsheetApp.openById(workspace.spreadsheetId);
  ensureSheets_(spreadsheet);

  const point = createPointObject_(payload);
  point.status = payload.status || "Waiting for review";
  point.documentedBy = payload.documentedBy || point.documentedBy || "";
  point.correctedLat = payload.correctedLocation && payload.correctedLocation.lat || payload.correctedLat || point.correctedLat || "";
  point.correctedLng = payload.correctedLocation && payload.correctedLocation.lng || payload.correctedLng || point.correctedLng || "";
  point.notes = payload.notes || point.notes || "";
  point.updatedAt = israelTimestamp_();
  point.assignedTo = payload.assignedTo || point.assignedTo || payload.documentedBy || "";

  upsertObject_(spreadsheet.getSheetByName("Points"), "pointId", point);
  appendObject_(spreadsheet.getSheetByName("StatusHistory"), {
    pointId: point.pointId,
    timestamp: point.updatedAt,
    fromStatus: payload.previousStatus || "",
    toStatus: point.status,
    changedBy: point.documentedBy,
    note: "Field documentation submitted"
  });

  saveAnswers_(spreadsheet, point.pointId, payload.answers || [], point.documentedBy);
  const savedPhotos = savePhotos_(spreadsheet, point, payload.photos || []);

  return {
    ok: true,
    point,
    photos: savedPhotos,
    output: buildOutputUrls_(point)
  };
}

function createPoint_(payload) {
  const workspace = requireWorkspace_();
  const spreadsheet = SpreadsheetApp.openById(workspace.spreadsheetId);
  ensureSheets_(spreadsheet);
  const point = createPointObject_(payload);
  point.status = payload.status || "Open for documentation";
  point.createdBy = payload.createdBy || payload.documentedBy || "";
  point.updatedAt = israelTimestamp_();
  upsertObject_(spreadsheet.getSheetByName("Points"), "pointId", point);
  appendObject_(spreadsheet.getSheetByName("StatusHistory"), {
    pointId: point.pointId,
    timestamp: point.updatedAt,
    fromStatus: "",
    toStatus: point.status,
    changedBy: point.createdBy,
    note: "Point created"
  });
  return { ok: true, point, output: buildOutputUrls_(point) };
}

function seedGoldClusters_() {
  const workspace = requireWorkspace_();
  const spreadsheet = SpreadsheetApp.openById(workspace.spreadsheetId);
  ensureSheets_(spreadsheet);
  const settlements = activeRows_(sheetObjects_(spreadsheet.getSheetByName("Settlements")));
  const merhavim = activeRows_(sheetObjects_(spreadsheet.getSheetByName("Merhavim")));
  const settlementByKey = {};
  settlements.forEach((settlement) => {
    settlementByKey[normalizeHebrewKey_(settlement.settlementName)] = settlement;
  });
  const merhavById = {};
  merhavim.forEach((merhav) => merhavById[merhav.merhavId] = merhav);

  const rows = goldClusterSeedRows_();
  let created = 0;
  let updated = 0;
  const missingSettlements = [];
  rows.forEach((row, index) => {
    const sourceKey = normalizeHebrewKey_(row.settlementName);
    const settlement = settlementByKey[sourceKey] || null;
    if (!settlement) missingSettlements.push(row.settlementName);
    const merhav = settlement ? merhavById[settlement.merhavId] || {} : {};
    const existing = findObjectByKey_(spreadsheet.getSheetByName("Points"), "pointId", row.pointId);
    const mappedSettlementName = settlement ? settlement.settlementName : row.settlementName;
    const point = createPointObject_({
      pointId: row.pointId,
      districtId: "north-sharon-district",
      districtName: "מחוז צפון השרון",
      merhavId: settlement ? settlement.merhavId : "",
      merhavName: merhav.merhavName || "",
      settlementId: settlement ? settlement.settlementId : slugify_(row.settlementName),
      settlementName: mappedSettlementName,
      type: "cluster",
      number: `אשכול זהב ${String(index + 1).padStart(3, "0")}`,
      pointName: row.clusterName,
      priority: "1",
      importanceReason: `אשכול זהב לפי מקור. דירוג ארצי ${row.nationalRank}; ${row.level}`,
      status: existing.object && existing.object.status ? existing.object.status : "Open for documentation",
      plannedAddress: row.address ? `${cleanAddress_(row.address)}, ${mappedSettlementName}` : mappedSettlementName,
      createdBy: "seed-gold-clusters",
      notes: `אשכול מקור: ${row.sourceCluster}; כתובת מקור: ${row.address}; סוג קלפי: ${row.level}; דירוג ארצי: ${row.nationalRank}`
    });
    point.createdAt = existing.object && existing.object.createdAt ? existing.object.createdAt : point.createdAt;
    point.updatedAt = israelTimestamp_();
    upsertObject_(spreadsheet.getSheetByName("Points"), "pointId", point);
    appendObject_(spreadsheet.getSheetByName("StatusHistory"), {
      pointId: point.pointId,
      timestamp: point.updatedAt,
      fromStatus: existing.object ? existing.object.status || "" : "",
      toStatus: point.status,
      changedBy: "seed-gold-clusters",
      note: existing.object ? "Gold cluster seed updated" : "Gold cluster seeded"
    });
    if (existing.object) updated += 1;
    else created += 1;
  });
  return {
    ok: true,
    expected: 32,
    processed: rows.length,
    created,
    updated,
    missingSettlements: Array.from(new Set(missingSettlements))
  };
}

function seedGoldClusters() {
  return seedGoldClusters_();
}

function seedTestPoint_() {
  const workspace = requireWorkspace_();
  const spreadsheet = SpreadsheetApp.openById(workspace.spreadsheetId);
  ensureSheets_(spreadsheet);
  const pointId = "TEST-PLAYGROUND-001";
  const existing = findObjectByKey_(spreadsheet.getSheetByName("Points"), "pointId", pointId);
  const point = createPointObject_({
    pointId,
    districtId: "north-sharon-district",
    districtName: "מחוז צפון השרון",
    merhavId: "חדרה-מנשה",
    merhavName: "חדרה מנשה",
    settlementId: "חדרה",
    settlementName: "חדרה",
    type: "signage",
    number: "נקודת בדיקה 001",
    pointName: "נקודת בדיקה - לא אמיתי",
    priority: "",
    importanceReason: "נקודת בדיקה להפעלת זרימת נתונים",
    status: existing.object && existing.object.status ? existing.object.status : "Open for documentation",
    plannedAddress: "אחד העם 1, חדרה",
    createdBy: "seed-test-point",
    notes: "נקודת בדיקה בלבד. אפשר לצלם, לדקור GPS ולשלוח כדי לבדוק שהנתונים נשמרים."
  });
  point.createdAt = existing.object && existing.object.createdAt ? existing.object.createdAt : point.createdAt;
  point.updatedAt = israelTimestamp_();
  upsertObject_(spreadsheet.getSheetByName("Points"), "pointId", point);
  appendObject_(spreadsheet.getSheetByName("StatusHistory"), {
    pointId,
    timestamp: point.updatedAt,
    fromStatus: existing.object ? existing.object.status || "" : "",
    toStatus: point.status,
    changedBy: "seed-test-point",
    note: existing.object ? "Test point updated" : "Test point seeded"
  });
  return {
    ok: true,
    created: !existing.object,
    updated: Boolean(existing.object),
    point,
    output: buildOutputUrls_(point)
  };
}

function seedTestPoint() {
  return seedTestPoint_();
}

function goldClusterSeedRows_() {
  return [
    { pointId: "GOLD-001", settlementName: "בנימינהגבעת עדה", sourceCluster: "2", clusterName: "בי\"ס אשכולות", address: "המורה", nationalRank: "12", level: "רמה 1" },
    { pointId: "GOLD-002", settlementName: "פרדס חנהכרכור", sourceCluster: "21", clusterName: "ביה\"ס ממלכתי מעיינות", address: "צליל,7", nationalRank: "16", level: "רמה 1" },
    { pointId: "GOLD-003", settlementName: "אבן יהודה", sourceCluster: "4", clusterName: "בית חינוך בית אב\"י", address: "העצמאות,140", nationalRank: "28", level: "רמה 1" },
    { pointId: "GOLD-004", settlementName: "קדימהצורן", sourceCluster: "107+109", clusterName: "מתנ\"ס צורן+ביה\"ס לב-רן", address: "דרך לב השרון צורן,1 +דרך לב השרון צורן,2", nationalRank: "33", level: "רמה 1" },
    { pointId: "GOLD-005", settlementName: "קיסריה", sourceCluster: "3+2", clusterName: "בית ספר קיסריה-מבנה דרומי+בית ספר קיסריה-מבנה צפוני", address: "שד רוטשילד,30 +שד רוטשילד,30", nationalRank: "40", level: "רמה 1" },
    { pointId: "GOLD-006", settlementName: "זכרון יעקב", sourceCluster: "7", clusterName: "בית ספר החיטה", address: "דרך אהרן,4", nationalRank: "42", level: "רמה 1" },
    { pointId: "GOLD-007", settlementName: "זכרון יעקב", sourceCluster: "2", clusterName: "בי\"ס ממלכתי נילי", address: "שד ניל\"י", nationalRank: "72", level: "רמה 1" },
    { pointId: "GOLD-008", settlementName: "נתניה", sourceCluster: "51", clusterName: "בי\"ס רימלט", address: "מעפילי אגוז,5", nationalRank: "74", level: "רמה 1" },
    { pointId: "GOLD-009", settlementName: "בת חפר", sourceCluster: "1", clusterName: "בי\"ס שדות-בת חפר", address: "חלבלוב", nationalRank: "94", level: "רמה 1" },
    { pointId: "GOLD-010", settlementName: "נתניה", sourceCluster: "142", clusterName: "ביה\"ס חיים חפר", address: "ברמן בני,4", nationalRank: "107", level: "רמה 2" },
    { pointId: "GOLD-011", settlementName: "תל מונד", sourceCluster: "7", clusterName: "ביה\"ס נוף ילדות", address: "החצב,1", nationalRank: "114", level: "רמה 2" },
    { pointId: "GOLD-012", settlementName: "נתניה", sourceCluster: "149", clusterName: "בי\"ס ע\"ש אהרון דוידי", address: "שמורת נחל שניר,3", nationalRank: "131", level: "רמה 2" },
    { pointId: "GOLD-013", settlementName: "נתניה", sourceCluster: "100", clusterName: "בי\"ס ממלכתי ע\"ש מנחם בגין", address: "גור מרדכי,4", nationalRank: "205", level: "רמה 3" },
    { pointId: "GOLD-014", settlementName: "פרדס חנהכרכור", sourceCluster: "23", clusterName: "בי\"ס שדות", address: "נחלה,34", nationalRank: "213", level: "רמה 3" },
    { pointId: "GOLD-015", settlementName: "תל מונד", sourceCluster: "1", clusterName: "בי\"ס שלנו", address: "הדקל,64", nationalRank: "216", level: "רמה 3" },
    { pointId: "GOLD-016", settlementName: "פרדס חנהכרכור", sourceCluster: "8", clusterName: "בי\"ס חורב-אגודה", address: "מצדה,314", nationalRank: "220", level: "רמה 3" },
    { pointId: "GOLD-017", settlementName: "תל מונד", sourceCluster: "6", clusterName: "מתנ\"ס תל מונד", address: "הדקל,31", nationalRank: "244", level: "רמה 3" },
    { pointId: "GOLD-018", settlementName: "חדרה", sourceCluster: "44+66", clusterName: "ביה\"ס עש אילן רמון כניסה ראשית+ביה\"ס עש אילן רמון שער אחורי", address: "רבין יצחק,56 +רבין יצחק,56", nationalRank: "251", level: "רמה 3" },
    { pointId: "GOLD-019", settlementName: "נתניה", sourceCluster: "125+8", clusterName: "מרכז קהילתי אופק+העמותה לחינוך הבלתי פורמלי", address: "אחימאיר,9 +אחימאיר,9", nationalRank: "290", level: "רמה 3" },
    { pointId: "GOLD-020", settlementName: "בנימינהגבעת עדה", sourceCluster: "104", clusterName: "בית ספר גבע", address: "הניצנים,17", nationalRank: "292", level: "רמה 3" },
    { pointId: "GOLD-021", settlementName: "זכרון יעקב", sourceCluster: "8", clusterName: "בי\"ס החורש", address: "דרך פינלס", nationalRank: "295", level: "רמה 3" },
    { pointId: "GOLD-022", settlementName: "מעגן מיכאל", sourceCluster: "1", clusterName: "מועדון האסם", address: "מעגן מיכאל", nationalRank: "302", level: "רמה 4" },
    { pointId: "GOLD-023", settlementName: "חדרה", sourceCluster: "1+69", clusterName: "בי\"ס אחד העם כניסה משער צפוני+בי\"ס אחד העם כניסה משער ראשי", address: "אחד העם,19 +אחד העם,19", nationalRank: "328", level: "רמה 4" },
    { pointId: "GOLD-024", settlementName: "כפר יונה", sourceCluster: "19", clusterName: "בית הספר רימון", address: "יקינטון,4", nationalRank: "333", level: "רמה 4" },
    { pointId: "GOLD-025", settlementName: "חדרה", sourceCluster: "4", clusterName: "בי\"ס צפרירים כ. ראשית רח' אלון", address: "האלון,30", nationalRank: "345", level: "רמה 4" },
    { pointId: "GOLD-026", settlementName: "בית יצחקשער חפר", sourceCluster: "1", clusterName: "בית העם", address: "בית יצחק-שער חפר", nationalRank: "353", level: "רמה 4" },
    { pointId: "GOLD-027", settlementName: "פרדס חנהכרכור", sourceCluster: "13", clusterName: "בי\"ס ממלכתי כרכור", address: "המייסדים,73", nationalRank: "354", level: "רמה 4" },
    { pointId: "GOLD-028", settlementName: "פרדס חנהכרכור", sourceCluster: "2", clusterName: "בי\"ס ממלכתי אלונים", address: "הנדיב,1", nationalRank: "361", level: "רמה 4" },
    { pointId: "GOLD-029", settlementName: "פרדסיה", sourceCluster: "3+5", clusterName: "בי\"ס תפוז+אולם ספורט-מול בי\"ס", address: "רמב\"ם,35 +רמב\"ם,36", nationalRank: "365", level: "רמה 4" },
    { pointId: "GOLD-030", settlementName: "חדרה", sourceCluster: "52", clusterName: "בי\"ס מדעים ויהדות", address: "משמר הגבול,1", nationalRank: "373", level: "רמה 4" },
    { pointId: "GOLD-031", settlementName: "חדרה", sourceCluster: "64", clusterName: "בי\"ס תחכמוני חדש", address: "שדרות כושי עפגין,7", nationalRank: "382", level: "רמה 4" },
    { pointId: "GOLD-032", settlementName: "נתניה", sourceCluster: "101", clusterName: "בי\"ס שלהבות (הרי\"ף)", address: "החפץ חיים,801", nationalRank: "400", level: "רמה 4" }
  ];
}

function changePointAssignment_(payload, mode) {
  const workspace = requireWorkspace_();
  const spreadsheet = SpreadsheetApp.openById(workspace.spreadsheetId);
  ensureSheets_(spreadsheet);
  const sheet = spreadsheet.getSheetByName("Points");
  const existing = findObjectByKey_(sheet, "pointId", payload.pointId);
  if (!existing.object) return { ok: false, error: "Point not found", pointId: payload.pointId || "" };

  const point = existing.object;
  const fromStatus = point.status || "";
  const now = new Date();
  point.updatedAt = israelTimestamp_();
  if (mode === "claim") {
    point.status = "In progress";
    point.assignedTo = payload.assignedTo || payload.documentedBy || "";
    point.assignedAt = israelTimestamp_();
    point.assignmentExpiresAt = Utilities.formatDate(new Date(now.getTime() + 10 * 60 * 60 * 1000), "Asia/Jerusalem", "yyyy-MM-dd HH:mm:ss");
  } else {
    point.status = "Open for documentation";
    point.assignedTo = "";
    point.assignedAt = "";
    point.assignmentExpiresAt = "";
  }
  upsertObject_(sheet, "pointId", point);
  appendObject_(spreadsheet.getSheetByName("StatusHistory"), {
    pointId: point.pointId,
    timestamp: point.updatedAt,
    fromStatus,
    toStatus: point.status,
    changedBy: payload.assignedTo || payload.documentedBy || "",
    note: mode === "claim" ? "Point claimed for 10 hours" : "Point released"
  });
  return { ok: true, point };
}

function getBootstrap_(params) {
  const hierarchy = getHierarchy_();
  const points = getPoints_(params || {});
  return {
    ok: true,
    hierarchy,
    points: points.points,
    users: points.users,
    now: israelTimestamp_()
  };
}

function getPoints_(params) {
  const workspace = requireWorkspace_();
  const spreadsheet = SpreadsheetApp.openById(workspace.spreadsheetId);
  ensureSheets_(spreadsheet);
  const merhavId = String(params && params.merhavId || "");
  const settlementId = String(params && params.settlementId || "");
  const users = activeRows_(sheetObjects_(spreadsheet.getSheetByName("Users")));
  const photos = sheetObjects_(spreadsheet.getSheetByName("Photos"));
  const answers = sheetObjects_(spreadsheet.getSheetByName("Answers"));
  const points = sheetObjects_(spreadsheet.getSheetByName("Points"))
    .filter((point) => !merhavId || point.merhavId === merhavId || point.merhavName === merhavId)
    .filter((point) => !settlementId || point.settlementId === settlementId || point.settlementName === settlementId)
    .map((point) => {
      const output = buildOutputUrls_(point);
      return Object.assign({}, point, {
        googleMaps: output.googleMaps,
        waze: output.waze,
        photoCount: photos.filter((photo) => photo.pointId === point.pointId).length,
        answerCount: answers.filter((answer) => answer.pointId === point.pointId).length
      });
    });
  return {
    ok: true,
    points,
    users,
    now: israelTimestamp_()
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
    districts: activeRows_(sheetObjects_(spreadsheet.getSheetByName("Districts"))),
    merhavim: activeRows_(sheetObjects_(spreadsheet.getSheetByName("Merhavim"))),
    settlements: activeRows_(sheetObjects_(spreadsheet.getSheetByName("Settlements"))),
    teams: activeRows_(sheetObjects_(spreadsheet.getSheetByName("Teams"))),
    settings: sheetObjects_(spreadsheet.getSheetByName("Settings"))
  };
}

function syncHierarchyAction_() {
  const workspace = requireWorkspace_();
  const spreadsheet = SpreadsheetApp.openById(workspace.spreadsheetId);
  return {
    ok: true,
    hierarchySync: syncHierarchyFromSource_(spreadsheet),
    hierarchy: getHierarchy_()
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
  setHeaders_(spreadsheet.getSheetByName("Users"), ["userId", "name", "email", "phone", "role", "pin", "districtId", "merhavId", "settlementId", "teamId", "active"]);
  setHeaders_(spreadsheet.getSheetByName("Points"), ["pointId", "timestamp", "createdAt", "updatedAt", "districtId", "districtName", "merhavId", "merhavName", "settlementId", "settlementName", "type", "number", "pointName", "priority", "importanceReason", "town", "teamId", "status", "plannedAddress", "plannedLat", "plannedLng", "correctedLat", "correctedLng", "assignedTo", "assignedAt", "assignmentExpiresAt", "documentedBy", "createdBy", "notes"]);
  setHeaders_(spreadsheet.getSheetByName("Photos"), ["photoId", "pointId", "timestamp", "itemKey", "caption", "fileId", "fileUrl", "mimeType", "compressedBytes", "width", "height"]);
  setHeaders_(spreadsheet.getSheetByName("Answers"), ["answerId", "pointId", "timestamp", "sectionKey", "fieldKey", "label", "value", "documentedBy"]);
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
  if (districts.getLastRow() < 2) {
    appendObject_(districts, {
      districtId: "north-sharon-district",
      districtName: "מחוז צפון השרון",
      districtLeadEmail: "",
      active: true
    });
  }
  return syncHierarchyFromSource_(spreadsheet);
}

function syncHierarchyFromSource_(spreadsheet) {
  try {
    const sourceSpreadsheetId = FIELD_DOC_APP.properties.getProperty("HIERARCHY_SOURCE_SPREADSHEET_ID");
    if (!sourceSpreadsheetId) {
      return { ok: false, reason: "Hierarchy source spreadsheet ID is not configured." };
    }
    const source = SpreadsheetApp.openById(sourceSpreadsheetId);
    const sheet = source.getSheetByName("מיפוי מחוז צפון השרון")
      || source.getSheetByName("מצבת פעילים והרשאות")
      || source.getSheets()[0];
    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return { ok: false, reason: "Source sheet has no data rows." };
    const headers = values[0].map((value) => String(value).trim());
    const headerRowIndex = values.findIndex((row) => String(row[0]).trim() === "יישוב");
    if (headerRowIndex === -1) {
      return {
        ok: false,
        reason: "Source sheet is missing יישוב column.",
        headers
      };
    }
    const rows = values.slice(headerRowIndex + 1);

    const districtId = "north-sharon-district";
    const merhavSheet = spreadsheet.getSheetByName("Merhavim");
    const settlementSheet = spreadsheet.getSheetByName("Settlements");
    clearDataRows_(merhavSheet);
    clearDataRows_(settlementSheet);

    const merhavDisplayNames = [
      "בנימינה / גבעת עדה + יישובי אלונה",
      "זכרון יעקב+",
      "קיסריה / אור עקיבה +",
      "פרדס חנה",
      "חדרה מנשה",
      "עמק חפר",
      "נתניה +"
    ];
    const merhavBySourceGroup = {
      "בנימינה ויישובי אלונה": "בנימינה / גבעת עדה + יישובי אלונה",
      "סה\"כ בנימינה וצפון השרון": "",
      "זכרון יעקב והסביבה": "זכרון יעקב+",
      "חדרה מנשה": "חדרה מנשה",
      "חריש מנשה": "חדרה מנשה",
      "נתניה ומרכז השרון": "נתניה +",
      "עמק חפר": "עמק חפר",
      "פרדס חנה והסביבה": "פרדס חנה",
      "קיסריה, שדות ים ואור עקיבא": "קיסריה / אור עקיבה +"
    };

    const settlementById = new Map();
    let currentMerhavName = "";

    rows.forEach((row) => {
      const firstCell = String(row[0] || "").trim();
      const leader = String(row[1] || "").trim();
      if (!firstCell || firstCell.indexOf("🏆") !== -1) return;
      if (firstCell.indexOf("סה\"כ") !== -1) return;
      if (leader) {
        currentMerhavName = merhavBySourceGroup[firstCell] || "";
        return;
      }
      if (!currentMerhavName) return;
      const merhavId = slugify_(currentMerhavName);
      splitSettlementNames_(firstCell).forEach((settlementName) => {
        const settlementId = slugify_(settlementName);
        if (!settlementId || settlementById.has(settlementId)) return;
        settlementById.set(settlementId, {
          settlementId,
          merhavId,
          districtId,
          settlementName,
          settlementLeadEmail: "",
          active: true
        });
      });
    });

    merhavDisplayNames.forEach((merhavName) => {
      appendObject_(merhavSheet, {
        merhavId: slugify_(merhavName),
        districtId,
        merhavName,
        merhavLeadEmail: "",
        active: true
      });
    });
    Array.from(settlementById.values())
      .sort((a, b) => String(a.settlementName).localeCompare(String(b.settlementName), "he"))
      .forEach((settlement) => appendObject_(settlementSheet, settlement));
    return {
      ok: true,
      sourceSheetName: sheet.getName(),
      sourceRows: rows.length,
      merhavim: merhavDisplayNames.length,
      settlements: settlementById.size
    };
  } catch (error) {
    Logger.log(`Hierarchy sync skipped: ${error}`);
    return { ok: false, reason: String(error) };
  }
}

function splitSettlementNames_(text) {
  return String(text || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function cleanAddress_(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .replace(/\s+\+/g, " +")
    .replace(/\+\s+/g, "+ ")
    .trim();
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

function upsertObject_(sheet, keyName, object) {
  const found = findObjectByKey_(sheet, keyName, object[keyName]);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map((key) => object[key] == null ? "" : object[key]);
  if (found.rowIndex) {
    sheet.getRange(found.rowIndex, 1, 1, headers.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }
}

function findObjectByKey_(sheet, keyName, value) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return { rowIndex: 0, object: null };
  const headers = values[0];
  const keyIndex = headers.indexOf(keyName);
  if (keyIndex === -1) return { rowIndex: 0, object: null };
  for (let index = 1; index < values.length; index += 1) {
    if (String(values[index][keyIndex]) === String(value)) {
      const object = {};
      headers.forEach((header, column) => object[header] = values[index][column]);
      return { rowIndex: index + 1, object };
    }
  }
  return { rowIndex: 0, object: null };
}

function createPointObject_(payload) {
  const timestamp = payload.timestamp || israelTimestamp_();
  const pointId = payload.pointId || `POINT-${Date.now()}`;
  const settlementName = payload.settlementName || payload.town || "";
  return {
    pointId,
    timestamp,
    createdAt: payload.createdAt || timestamp,
    updatedAt: payload.updatedAt || timestamp,
    districtId: payload.districtId || "north-sharon-district",
    districtName: payload.districtName || "מחוז צפון השרון",
    merhavId: payload.merhavId || "",
    merhavName: payload.merhavName || "",
    settlementId: payload.settlementId || slugify_(settlementName),
    settlementName,
    type: payload.type || "signage",
    number: payload.number || nextPointNumber_(payload.type || "signage"),
    pointName: payload.pointName || payload.name || payload.plannedAddress || "",
    priority: payload.priority || "",
    importanceReason: payload.importanceReason || "",
    town: settlementName,
    teamId: payload.teamId || "",
    status: payload.status || "Open for documentation",
    plannedAddress: payload.plannedAddress || payload.address || "",
    plannedLat: payload.plannedLat || "",
    plannedLng: payload.plannedLng || "",
    correctedLat: payload.correctedLat || "",
    correctedLng: payload.correctedLng || "",
    assignedTo: payload.assignedTo || "",
    assignedAt: payload.assignedAt || "",
    assignmentExpiresAt: payload.assignmentExpiresAt || "",
    documentedBy: payload.documentedBy || "",
    createdBy: payload.createdBy || "",
    notes: payload.notes || ""
  };
}

function nextPointNumber_(type) {
  const prefix = type === "cluster" ? "אשכול" : type === "booth" ? "דוכן" : "שילוט";
  return `${prefix} חדש`;
}

function saveAnswers_(spreadsheet, pointId, answers, documentedBy) {
  const sheet = spreadsheet.getSheetByName("Answers");
  const timestamp = israelTimestamp_();
  (answers || []).forEach((answer, index) => {
    appendObject_(sheet, {
      answerId: `${pointId}-A${Date.now()}-${index + 1}`,
      pointId,
      timestamp,
      sectionKey: answer.sectionKey || "",
      fieldKey: answer.fieldKey || "",
      label: answer.label || "",
      value: answer.value == null ? "" : String(answer.value),
      documentedBy: documentedBy || ""
    });
  });
}

function savePhotos_(spreadsheet, point, photos) {
  const workspace = requireWorkspace_();
  const rootFolder = DriveApp.getFolderById(workspace.rootFolderId);
  const pointFolder = getOrCreateChildFolder_(
    getOrCreateChildFolder_(
      getOrCreateChildFolder_(rootFolder, point.districtName || "מחוז צפון השרון"),
      point.merhavName || "ללא מרחב"
    ),
    `${point.settlementName || point.town || "ללא יישוב"} - ${point.pointId}`
  );
  return (photos || []).filter((photo) => photo && photo.base64).map((photo, index) => {
    const bytes = Utilities.base64Decode(photo.base64 || "");
    const blob = Utilities.newBlob(bytes, photo.mimeType || "image/jpeg", photo.fileName || `${point.pointId}-${index + 1}.jpg`);
    const file = pointFolder.createFile(blob);
    const row = {
      photoId: `${point.pointId}-P${Date.now()}-${index + 1}`,
      pointId: point.pointId,
      timestamp: point.updatedAt || israelTimestamp_(),
      itemKey: photo.itemKey || "",
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
}

function clearDataRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
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

function normalizeHebrewKey_(text) {
  return String(text || "")
    .replace(/["'`״׳]/g, "")
    .replace(/[\u0591-\u05C7]/g, "")
    .replace(/[^A-Za-z0-9\u0590-\u05FF]/g, "")
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

function jsonResponse(data, callback) {
  const json = JSON.stringify(data);
  if (callback && /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)*$/.test(callback)) {
    return ContentService
      .createTextOutput(`${callback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
