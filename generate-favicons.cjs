const fs = require('fs');
const path = require('path');

// Create a simple favicon.ico fallback by copying the SVG content
// For production, you should use proper tools like sharp or @svgr/cli

console.log('To generate PNG favicons, you have two options:\n');

console.log('Option 1: Use an online tool');
console.log('- Visit https://realfavicongenerator.net/');
console.log('- Upload public/favicon.svg');
console.log('- Download and extract the generated files to public/\n');

console.log('Option 2: Install sharp and generate locally');
console.log('Run these commands:');
console.log('  npm install sharp');
console.log('  node generate-favicons-sharp.js\n');

// Create a simple HTML preview
const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Favicon Preview</title>
    <style>
        body {
            font-family: system-ui;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .preview {
            display: flex;
            gap: 20px;
            align-items: center;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
            margin: 20px 0;
        }
        img {
            background: white;
            padding: 10px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <h1>Favicon Preview</h1>
    <div class="preview">
        <img src="/favicon.svg" width="16" alt="16x16">
        <img src="/favicon.svg" width="32" alt="32x32">
        <img src="/favicon.svg" width="64" alt="64x64">
        <img src="/favicon.svg" width="128" alt="128x128">
    </div>
    <p>The SVG favicon is working! For better compatibility, generate PNG versions using the instructions in generate-favicons.js</p>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'public', 'favicon-preview.html'), html);
console.log('✓ Created public/favicon-preview.html - Open this in your browser to see the favicon!');
