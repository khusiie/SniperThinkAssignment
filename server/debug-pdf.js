const pdf = require('pdf-parse');
console.log('--- PDF-PARSE DEBUG ---');
console.log('Type of pdf:', typeof pdf);
console.log('Keys of pdf:', Object.keys(pdf || {}));
console.log('Full pdf object:', pdf);
if (pdf && pdf.default) {
    console.log('Type of pdf.default:', typeof pdf.default);
}
console.log('-----------------------');
