const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

let isReady = false;

async function init() {
    if (!isReady) {
        await doc.loadInfo();
        isReady = true;
    }
}

async function getSheet(title, headers) {
    await init();
    let sheet = doc.sheetsByTitle[title];
    if (!sheet) {
        sheet = await doc.addSheet({ title, headerValues: headers });
    }
    return sheet;
}

// Data Handling Helpers
async function getAll(sheetTitle, headers) {
    const sheet = await getSheet(sheetTitle, headers);
    const rows = await sheet.getRows();
    return rows.map(row => {
        const obj = {};
        headers.forEach(h => obj[h] = row.get(h));
        // Add internal ID if simple row number or generated ID is needed
        // Usually we save an 'id' column.
        return obj;
    });
}

async function addRow(sheetTitle, headers, data) {
    const sheet = await getSheet(sheetTitle, headers);
    // Simple ID generation if not provided (based on timestamp for now or max ID)
    if (!data.id) data.id = Date.now().toString();
    await sheet.addRow(data);
    return data;
}

async function updateRow(sheetTitle, headers, id, data) {
    const sheet = await getSheet(sheetTitle, headers);
    const rows = await sheet.getRows();
    const row = rows.find(r => r.get('id') == id);
    if (!row) return null;

    headers.forEach(h => {
        if (data[h] !== undefined) row.assign({ [h]: data[h] });
    });
    await row.save();
    return data;
}

async function deleteRow(sheetTitle, headers, id) {
    const sheet = await getSheet(sheetTitle, headers);
    const rows = await sheet.getRows();
    const row = rows.find(r => r.get('id') == id);
    if (row) {
        await row.delete();
        return true;
    }
    return false;
}

module.exports = { getAll, addRow, updateRow, deleteRow };
