/**
 * EGIL & FELICIA – OSA-formulär → Google Sheets
 * ================================================
 * Klistra in den här koden i Google Apps Script-editorn
 * och följ installationsstegen nedan.
 *
 * INSTALLATION (gör detta en gång):
 * ----------------------------------
 * 1. Skapa ett nytt Google Sheets-dokument i Drive
 * 2. Gå till Tillägg → Apps Script
 * 3. Radera all befintlig kod och klistra in hela den här filen
 * 4. Klicka på "Spara" (diskettikonen)
 * 5. Klicka på "Deploy" → "New deployment"
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Klicka "Deploy" och godkänn behörigheter
 * 7. Kopiera den genererade Web App URL:en
 * 8. Öppna js/main.js och klistra in URL:en som värde
 *    för konstanten SCRIPT_URL längst upp i filen
 *
 * UPPDATERA SKRIPTET (om du gör ändringar):
 * ------------------------------------------
 * Klicka Deploy → Manage deployments → redigera den
 * befintliga deploymentet och välj "New version".
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Skapa rubrikrad automatiskt vid första svaret
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Namn',
      'Kommer',
      'Antal barn',
      'Barnens namn',
      'Telefon',
      'Allergier / specialkost',
      'Låtförslag',
      'Hälsning till brudparet',
      'Inskickat'
    ]);

    // Formatera rubrikraden
    var headerRange = sheet.getRange(1, 1, 1, 9);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#2a3d35');
    headerRange.setFontColor('#f7f3ed');
    sheet.setFrozenRows(1);
  }

  var p = e.parameter;

  sheet.appendRow([
    p.name             || '',
    p.attending === 'yes' ? 'Ja ✓' : 'Nej',
    p.children_count   || '0',
    p.children_names   || '',
    p.phone            || '',
    p.dietary          || '',
    p.song             || '',
    p.message          || '',
    new Date().toLocaleString('sv-SE')
  ]);

  // Auto-resize kolumner för läsbarhet
  sheet.autoResizeColumns(1, 9);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
