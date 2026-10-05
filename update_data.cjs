const fs = require('fs');
let data = fs.readFileSync('src/data/miningData.ts', 'utf8');

// Update imports
data = data.replace('import workshopImg from "../assets/images/Workshop.png";', 'import workshopImg from "../assets/images/Workshop2.png";');
data = data.replace('import mattImg from "../assets/images/MattCoz1.jpg";\n', '');
data = data.replace('import cozzaImg from "../assets/images/Cozza.jpg";\n', '');
data = data.replace('import matt3Img from "../assets/images/Matt 3.jpg";\n', '');
data = data.replace('import lunaticsImg from "../assets/images/Lunatics.jpg";\n', '');
data = data.replace('import cozza2Img from "../assets/images/Cozza2.jpg";\n', '');

// Remove Matt's Place
data = data.replace(/\{\s*id:\s*"matts-place"[\s\S]*?(?=\{\s*id:\s*"cozzas-place")/, '');
// Remove Cozza's Place
data = data.replace(/\{\s*id:\s*"cozzas-place"[\s\S]*?(?=\/\* Hidden for now)/, '');

// Update Library to Trade School
data = data.replace(/id:\s*"library",/, 'id: "trade-school",');
data = data.replace(/name:\s*"Library",/, 'name: "Trade School",');

fs.writeFileSync('src/data/miningData.ts', data);
