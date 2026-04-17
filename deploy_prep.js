const fs = require('fs');
let s = fs.readFileSync('js/script.js', 'utf8');
s = s.replace(/http:\/\/localhost:5000\/api/g, '/api');
fs.writeFileSync('js/script.js', s);
