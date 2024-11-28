const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [
  16, 32, 48, 64, 128, 256, // favicon and small icons
  192, 512 // PWA icons
];

async function generateIcons() {
  const inputSvg = path.join(__dirname, '../public/favicon.svg');
  const outputDir = path.join(__dirname, '../public');

  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile(inputSvg);

    // Generate PNG files for each size
    await Promise.all(
      sizes.map(async (size) => {
        const pngBuffer = await sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toBuffer();

        // Save as PNG
        const pngPath = path.join(outputDir, `icon-${size}.png`);
        await fs.writeFile(pngPath, pngBuffer);
        console.log(`Generated ${pngPath}`);

        // For PWA sizes, also create manifest-specific names
        if (size === 192) {
          await fs.writeFile(path.join(outputDir, 'icon-192x192.png'), pngBuffer);
        }
        if (size === 512) {
          await fs.writeFile(path.join(outputDir, 'icon-512x512.png'), pngBuffer);
        }

        return { size, buffer: pngBuffer };
      })
    );

    // Create apple-touch-icon
    const appleIconBuffer = await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toBuffer();
    await fs.writeFile(path.join(outputDir, 'apple-touch-icon.png'), appleIconBuffer);
    console.log('Generated apple-touch-icon.png');

    // Create favicon.ico (16, 32, 48)
    const icoSizes = [16, 32, 48];
    const icoBuffers = await Promise.all(
      icoSizes.map(size => 
        sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toBuffer()
      )
    );
    
    await fs.writeFile(path.join(outputDir, 'favicon.ico'), Buffer.concat(icoBuffers));
    console.log('Generated favicon.ico');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
