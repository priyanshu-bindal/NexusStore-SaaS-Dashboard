import sharp from 'sharp';
import path from 'path';

async function sliceLogos() {
    const inputPath = './public/logo.png';
    const outDir = './public';

    try {
        const m = await sharp(inputPath).metadata();
        const w = m.width || 1264;
        const h = m.height || 848;

        console.log(`Image bounds: ${w}x${h}`);

        // 1. Extract Horizontal Logo (Top Row, top 35%, full width)
        await sharp(inputPath)
            .extract({ left: 0, top: 0, width: w, height: Math.floor(h * 0.35) })
            .trim()
            .toFile(path.join(outDir, 'logo-horizontal.png'));
        console.log('✅ Created logo-horizontal.png');

        // 2. Extract Icon (Middle Row, 3rd column)
        const iconTop = Math.floor(h * 0.35);
        const iconHeight = Math.floor(h * 0.30);
        const iconWidth = Math.floor(w / 4);

        await sharp(inputPath)
            .extract({ left: Math.floor(iconWidth * 2), top: iconTop, width: iconWidth - 1, height: iconHeight })
            .trim()
            .toFile(path.join(outDir, 'logo-icon.png'));
        console.log('✅ Created logo-icon.png');

        // 3. Extract Favicon (Using the logo-icon.png area but resized)
        await sharp(inputPath)
            .extract({ left: Math.floor(iconWidth * 2), top: iconTop, width: iconWidth - 1, height: iconHeight })
            .trim()
            .resize(32, 32)
            .toFile('./src/app/favicon.png');
        console.log('✅ Created favicon.png');

        // 4. Extract Vertical Logo (Bottom Row, Left side)
        const vertTop = Math.floor(h * 0.65);
        const vertHeight = h - vertTop - 1;
        const vertWidth = Math.floor(w / 2);

        await sharp(inputPath)
            .extract({ left: 0, top: vertTop, width: vertWidth, height: vertHeight })
            .trim()
            .toFile(path.join(outDir, 'logo-vertical.png'));
        console.log('✅ Created logo-vertical.png');

    } catch (e) {
        console.error('Error slicing logos:', e.message);
    }
}

sliceLogos();
