const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Konfiguracija
const BLOB_STORE_URL = 'https://api.vercel.com/v1/blob'; // Zameni sa tvojim Vercel Blob URL-om
const API_TOKEN = process.env.VERCEL_BLOB_READ_WRITE_TOKEN; // Dodaj u .env.local

async function uploadFile(filePath, filename) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    const response = await fetch(`${BLOB_STORE_URL}?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/octet-stream',
      },
      body: fileBuffer,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ Uploaded: ${filename} -> ${result.url}`);
    return result.url;
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

async function migrateFiles() {
  const publicDir = path.join(__dirname, '../public');
  const filesToMigrate = [
    'growth-professional-services-materials/Techtarget-How can the XaaS business model drive innovative growth for your services, software or digital content bu.pdf',
    'growth-professional-services-materials/Professional_Services_pack.zip',
    'downloads/CFO_Insights_OxfordEconomics.pdf',
    'downloads/CFO_pack.zip',
    'downloads/Finance_3_Insights.pdf',
    'downloads/Finance_Checklist.pdf',
    'growth-materials/34559_CheckListLongPartner_91776.pdf',
    'growth-materials/90036_Oxford Economics_CFO Insights_partner-2.pdf',
    'growth-materials/91828_Finance_IG_PARTNER.pdf',
  ];

  const results = {};

  for (const filePath of filesToMigrate) {
    const fullPath = path.join(publicDir, filePath);
    
    if (fs.existsSync(fullPath)) {
      const url = await uploadFile(fullPath, path.basename(filePath));
      if (url) {
        results[filePath] = url;
      }
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  }

  // Sačuvaj rezultate
  fs.writeFileSync(
    path.join(__dirname, '../public/blob-urls.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\n📄 Upload results saved to public/blob-urls.json');
  console.log('🔗 URLs:', results);
}

if (require.main === module) {
  migrateFiles().catch(console.error);
}

module.exports = { uploadFile, migrateFiles };
