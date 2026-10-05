const fs = require('fs');
const path = require('path');

const numPoints = 15000;
let plyData = `ply
format ascii 1.0
element vertex ${numPoints}
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
end_header
`;

for (let i = 0; i < numPoints; i++) {
  // Generate points roughly on a sphere with some noise
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);
  const r = 2 + (Math.random() * 0.5 - 0.25); // Radius around 2
  
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  
  // Matrix opal colors: browns, blacks, and flashes of blue/green/orange
  let red, green, blue;
  const rand = Math.random();
  if (rand < 0.7) {
    // Matrix rock (dark browns/blacks)
    red = 40 + Math.random() * 30;
    green = 30 + Math.random() * 20;
    blue = 20 + Math.random() * 20;
  } else if (rand < 0.85) {
    // Blue/green flash
    red = 10 + Math.random() * 40;
    green = 150 + Math.random() * 100;
    blue = 150 + Math.random() * 100;
  } else {
    // Red/orange flash
    red = 200 + Math.random() * 55;
    green = 100 + Math.random() * 80;
    blue = 20 + Math.random() * 40;
  }
  
  plyData += `${x.toFixed(3)} ${y.toFixed(3)} ${z.toFixed(3)} ${Math.floor(red)} ${Math.floor(green)} ${Math.floor(blue)}\n`;
}

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/City of Onkaparinga.ply', plyData);
console.log('PLY created');
