// Script to automatically generate images.json from assets/img folder
// Run with: node generate-images-list.js

const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'assets', 'img');
const outputFile = path.join(imgDir, 'images.json');

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG'];

try {
  // Check if directory exists
  if (!fs.existsSync(imgDir)) {
    console.log('Creating assets/img directory...');
    fs.mkdirSync(imgDir, { recursive: true });
    console.log('Directory created. Please add images and run this script again.');
    process.exit(0);
  }

  // Read all files in directory
  const files = fs.readdirSync(imgDir);
  
  // Filter only image files
  const imageFiles = files.filter(file => {
    const ext = path.extname(file);
    return imageExtensions.includes(ext);
  }).sort(); // Sort alphabetically

  if (imageFiles.length === 0) {
    console.log('No images found in assets/img folder.');
    // Create empty JSON file
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    console.log('Created empty images.json file.');
  } else {
    // Write JSON file with image list
    fs.writeFileSync(outputFile, JSON.stringify(imageFiles, null, 2));
    console.log(`Found ${imageFiles.length} images:`);
    imageFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });
    console.log(`\n✅ Successfully created images.json with ${imageFiles.length} images!`);
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

