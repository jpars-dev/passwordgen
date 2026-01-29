const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateFavicon() {
  const sizes = [16, 32, 48, 64];
  const inputSvg = path.join(__dirname, '../public/favicon.svg');
  const outputDir = path.join(__dirname, '../public');

  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile(inputSvg);

    // Generate PNG files for each size
    const pngBuffers = await Promise.all(
      sizes.map(async (size) => {
        const buffer = await sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toBuffer();
        return { size, buffer };
      })
    );

    // Write the ICO file
    const icoPath = path.join(outputDir, 'favicon.ico');
    await fs.writeFile(icoPath, Buffer.concat(pngBuffers.map(({ buffer }) => buffer)));

    console.log('Favicon generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon();
