# Field Documentation Infrastructure Feasibility

This folder implements Phase 0 of the plan: prove the free stack before building the full app.

## What This Tests

- A phone can open a test frontend.
- A phone can capture GPS.
- A phone can choose/take a photo.
- The browser can compress the photo before upload.
- Apps Script can receive the submission.
- Apps Script can write to Google Sheets.
- Apps Script can upload the compressed photo to Google Drive.
- An output endpoint can read back the latest test point.

## Files

- `apps-script/Code.gs` - Apps Script backend.
- `apps-script/appsscript.json` - Apps Script manifest and scopes.
- `feasibility-client.html` - mobile test client.
- `../output-mockups.html` - mobile output mockups for point page and town summary.

## Google Account / Password Rule

Use `nsharon@democrats.org.il` as the production owner.

Do not share the password with Codex. The safe process is:

1. You log into `nsharon@democrats.org.il` in the browser.
2. You create or open the Apps Script project.
3. You paste/push the files from `apps-script/`.
4. You run `setupWorkspace_` or deploy the web app and POST `{ "action": "setup" }`.
5. You approve Google permissions yourself.

Set the hierarchy source spreadsheet ID in Apps Script Script Properties:

- `HIERARCHY_SOURCE_SPREADSHEET_ID`

Use the source sheet that contains the real `מרחב` and `יישוב` lists.

## Manual Setup Steps

1. In Google Drive under `nsharon@democrats.org.il`, create a new Apps Script project.
2. Copy `apps-script/Code.gs` into `Code.gs`.
3. Copy `apps-script/appsscript.json` into the project manifest.
4. Deploy as a Web App:
   - Execute as: `Me`
   - Who has access: for the feasibility test, `Anyone with the link`
5. Copy the Web App URL.
6. Open `feasibility-client.html` on your phone.
7. Paste the Web App URL.
8. Run `Check backend`.
9. Submit one test point with one photo.

## Success Criteria

The feasibility phase passes when:

- A spreadsheet named `תיעוד שטח - בדיקת תשתית` exists under `nsharon@democrats.org.il`.
- A Drive folder named `תיעוד שטח - בדיקת תשתית` exists under `nsharon@democrats.org.il`.
- A test point row appears in the `Points` tab.
- A compressed photo file appears in the point folder.
- A photo row appears in the `Photos` tab.
- The Web App `?action=testpoint` endpoint returns the latest point and photo metadata.

## Notes

For real deployment we should avoid making write endpoints public without a team code or session token. This feasibility version is intentionally small so we can prove storage, photo compression, and ownership first.
