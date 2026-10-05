const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove hasEntered state
content = content.replace(/const \[hasEntered, setHasEntered\] = useState\(false\);\n?/g, '');

// Remove the condition for !hasEntered and just render the map
const mainViewRegex = /<AnimatePresence mode="wait">[\s\S]*?\/\* ================= MAIN INTERACTIVE HQ VIEW ================= \*\/[\s\S]*?<motion\.div\s*key="main-hq"\s*initial={{ opacity: 0 }}\s*animate={{ opacity: 1 }}\s*transition={{ duration: 0.6 }}\s*className="absolute inset-0 flex flex-col items-stretch"\s*>/;

// Replace everything up to the main-hq motion div with just a simple container
content = content.replace(/<AnimatePresence mode="wait">[\s\S]*?<motion\.div\s*key="main-hq"\s*initial={{ opacity: 0 }}\s*animate={{ opacity: 1 }}\s*transition={{ duration: 0.6 }}\s*className="absolute inset-0 flex flex-col items-stretch"\s*>/, 
`<div className="absolute inset-0 flex flex-col items-stretch">`);

// Replace the closing tags for AnimatePresence
content = content.replace(/<\/motion\.div>\s*<\/AnimatePresence>\s*<\/div>/, `</div>\n    </div>`);

// Remove isHistoricalView, isDigitalView and the audio toggles entirely for simplicity
content = content.replace(/const \[isHistoricalView, setIsHistoricalView\] = useState\(false\);\n?/g, '');
content = content.replace(/const \[isDigitalView, setIsDigitalView\] = useState\(false\);\n?/g, '');
content = content.replace(/const \[soundEnabled, setSoundEnabled\] = useState\(false\);\n?/g, '');

// Let's just create a completely fresh App.tsx that is extremely minimal
