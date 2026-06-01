const fs = require('fs');
const path = 'src/pages/Admin.jsx';
let content = fs.readFileSync(path, 'utf8');

const targetUpload = `                // Handle Team Ministry Items Media`;
const replacementUpload = `                // Handle Ministry Items Media
                if (currentConfig.ministryItems) {
                    const updatedMinistryItems = [...currentConfig.ministryItems];
                    for (let i = 0; i < updatedMinistryItems.length; i++) {
                        const fieldName = \`ministry-\${i}\`;
                        const localFile = bannerFiles[fieldName];
                        if (localFile) {
                            try {
                                const uploadedUrl = await dbService.uploadFile(localFile, 'ministries');
                                updatedMinistryItems[i] = { ...updatedMinistryItems[i], image: uploadedUrl };
                            } catch (err) {
                                console.error(\`Error uploading ministry image \${fieldName}:\`, err);
                            }
                        } else if (updatedMinistryItems[i].image && updatedMinistryItems[i].image.includes('drive.google.com')) {
                            updatedMinistryItems[i] = { ...updatedMinistryItems[i], image: dbService.formatDriveImage(updatedMinistryItems[i].image) };
                        }
                    }
                    currentConfig.ministryItems = updatedMinistryItems;
                }

                // Handle Team Ministry Items Media`;

if (content.includes(targetUpload)) {
    content = content.replace(targetUpload, replacementUpload);
    console.log('Fixed upload logic.');
}

const targetFallback1 = `ministryItems: (fbConfig.ministryItems && fbConfig.ministryItems.length > 0) ? fbConfig.ministryItems : churchData.ministries.map(m => ({`;
const replacementFallback1 = `ministryItems: (fbConfig.ministryItems) ? fbConfig.ministryItems : churchData.ministries.map(m => ({`;

if (content.includes(targetFallback1)) {
    content = content.replace(targetFallback1, replacementFallback1);
    console.log('Fixed ministryItems fallback logic.');
}

const targetFallback2 = `teamMinistryItems: (fbConfig.teamMinistryItems && fbConfig.teamMinistryItems.length > 0) ? fbConfig.teamMinistryItems : churchData.team_ministries || [],`;
const replacementFallback2 = `teamMinistryItems: (fbConfig.teamMinistryItems) ? fbConfig.teamMinistryItems : churchData.team_ministries || [],`;

if (content.includes(targetFallback2)) {
    content = content.replace(targetFallback2, replacementFallback2);
    console.log('Fixed teamMinistryItems fallback logic.');
}

fs.writeFileSync(path, content, 'utf8');
console.log('Patch applied successfully.');
