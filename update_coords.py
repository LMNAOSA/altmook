import re

with open('src/data/miningData.ts', 'r') as f:
    content = f.read()

# Update coords
coords = {
    'brewery': (50, 40),
    'opal-workshop': (46, 48),
    'marys-place': (70, 55),
    'trading-post': (65, 53),
    'outfitters': (55, 53),
    'trade-school': (40, 42),
    'post-office': (40, 50),
    'partners': (55, 45) # HQ
}

for node_id, (x, y) in coords.items():
    pattern = r'(id:\s*"' + node_id + r'",\s*name:\s*"[^"]*",\s*type:\s*"destination",\s*x:\s*)\d+(,\s*y:\s*)\d+'
    repl = r'\g<1>' + str(x) + r'\g<2>' + str(y)
    content = re.sub(pattern, repl, content)

# Add Museum and Digital Mining
new_nodes = """  {
    id: "museum",
    name: "Museum",
    type: "destination",
    x: 40,
    y: 55,
    tagline: "Historical artefacts and people's stories.",
    history: "A repository of outback memory. The museum houses the physical relics of Andamooka's founding generations.",
    theDirt: "Displays of vintage mining gear, old photographs, and handwritten letters.",
    minersNote: "'Every object here has a story. Some are even true.'",
    image: "/src/assets/images/Hut interior.jpg"
  },
  {
    id: "digital-mining",
    name: "Digital Mining",
    type: "destination",
    x: 55,
    y: 35,
    tagline: "A tunnel into the mullock heap that leads underground to the digital layer.",
    history: "Where the physical grit of the outback meets cryptographic permanence.",
    theDirt: "The gateway to the digital layer. Proving provenance through science and technology.",
    minersNote: "'The future of opal mining isn't just in the dirt, it's in the data.'",
    image: "/src/assets/images/DigitalMine.png"
  }
];"""

content = content.replace("  }\n];", "  },\n" + new_nodes)

with open('src/data/miningData.ts', 'w') as f:
    f.write(content)
