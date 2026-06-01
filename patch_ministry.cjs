const fs = require('fs');

const path = 'src/pages/Admin.jsx';
let content = fs.readFileSync(path, 'utf8');

const target1 = `                // Handle Team Ministry Items Media`;
const replacement1 = `                // Handle Ministry Items Media
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

if (content.includes(target1)) {
    content = content.replace(target1, replacement1);
    console.log("Successfully replaced image upload block.");
} else {
    console.log("Could not find image upload block target.");
}

const target2 = `                    sundaySchoolDescriptionEn: fbConfig.sundaySchoolDescriptionEn || '',`;
const replacement2 = `                    sundaySchoolDescriptionEn: fbConfig.sundaySchoolDescriptionEn || '',

                    ministryItems: (fbConfig.ministryItems && fbConfig.ministryItems.length > 0) ? fbConfig.ministryItems : churchData.ministries.map(m => ({
                        ...m,
                        detail: m.id === 'tsc' ?
                            "[교육 목표]\\n하나님을 알고, 하나님을 사랑하며, 하나님을 닮아가는 어린이\\n\\n[주요 활동]\\n- 통합 예배: 부모님과 함께 드리는 예배를 통해 경외감을 배웁니다.\\n- 분반 공부: 연령별 맞춤 성경 공부로 말씀의 기초를 다집니다.\\n- 절기 행사: 부활절, 추수감사절, 성탄절 등 기독교 문화를 체험합니다.\\n\\nTSC는 우리 아이들이 세상의 빛과 소금으로 자라나도록 기도와 사랑으로 양육합니다." :
                            "[교육 비전]\\n복음으로 무장하여 세상을 변화시키는 차세대 리더\\n\\n[주요 활동]\\n- 열린 예배: 청소년들의 눈높이에 맞춘 찬양과 말씀 선포\\n- 소그룹 나눔: 고민을 나누고 서로 중보하며 믿음의 우정을 쌓습니다.\\n- 비전 트립: 수련회와 탐방을 통해 더 넓은 세상을 경험하고 비전을 찾습니다.\\n\\nTSY는 혼자가 아닌 '함께'의 가치를 배우며 믿음의 여정을 걸어가는 공동체입니다."
                    })),
                    teamMinistryItems: (fbConfig.teamMinistryItems && fbConfig.teamMinistryItems.length > 0) ? fbConfig.teamMinistryItems : churchData.team_ministries || [],`;

if (content.includes(target2)) {
    content = content.replace(target2, replacement2);
    console.log("Successfully replaced setFormData initialization block.");
} else {
    console.log("Could not find setFormData initialization block target.");
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done.');
