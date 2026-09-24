/**
 * ==============================================================================
 * Google Apps Script for SysOps Journal / TechOps Wire
 * ==============================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1BF0Em2tRbmexI88f1vchZavzad1vp1JgImCJxdSUWxY
 * 2. In the top menu, click "Extensions" -> "Apps Script".
 * 3. Delete any code in the editor and paste THIS ENTIRE FILE.
 * 4. To update the 9 completed articles right now:
 *    - In the top dropdown, select "updateCompletedArticles" and click "Run" (▶).
 *    - Grant permissions when prompted.
 *    - Boom! Sheet1 will have all 9 articles added, and Sheet2 will change them from "Pending" to "Live" with URLs and Dates!
 * 
 * 5. To enable Automatic Daily Posting from our automated script:
 *    - Click "Deploy" (top right) -> "New deployment".
 *    - Select type: "Web app".
 *    - Execute as: "Me (your email)".
 *    - Who has access: "Anyone".
 *    - Click "Deploy", copy the Web App URL, and save it as GOOGLE_SHEET_WEBHOOK_URL.
 * ==============================================================================
 */

// Data of the 9 completed articles
var COMPLETED_ARTICLES = [
  {
    keyword: "how to remove duplicates in excel",
    category: "Data & Excel Automation",
    tags: "how to find duplicates in excel, how to delete duplicates in excel, how to highlight duplicates in excel, remove duplicates in excel shortcut",
    status: "Live",
    url: "https://techopswire.com/articles/how-to-remove-duplicates-in-excel",
    date: "2026-09-24 10:00:00",
    sheet2RowTarget: "how to remove duplicates in excel"
  },
  {
    keyword: "aws ec2 instance types",
    category: "Cloud & Infrastructure",
    tags: "ec2 instance types comparison, aws ec2 instance types pricing, best ec2 instances for web servers",
    status: "Live",
    url: "https://techopswire.com/articles/aws-ec2-instance-types-explained",
    date: "2026-09-24 10:00:00",
    sheet2RowTarget: "aws ec2 instance types"
  },
  {
    keyword: "why is chatgpt so slow",
    category: "AI & Developer Tools",
    tags: "chatgpt slow response fix, why does chatgpt take so long to generate, chatgpt latency issues",
    status: "Live",
    url: "https://techopswire.com/articles/why-is-chatgpt-so-slow",
    date: "2026-09-24 10:00:00",
    sheet2RowTarget: "why is chatgpt so slow"
  },
  {
    keyword: "windows 11 pro vs home",
    category: "OS & Systems",
    tags: "difference between windows 11 home and pro, is windows 11 pro worth it, windows 11 bitlocker vs home",
    status: "Live",
    url: "https://techopswire.com/articles/windows-11-pro-vs-home",
    date: "2026-09-24 10:00:00",
    sheet2RowTarget: "windows 11 pro vs home"
  },
  {
    keyword: "linux file permissions",
    category: "Cloud & Infrastructure",
    tags: "chmod command in linux, chown command in linux, chmod 755 vs 644, octal notation linux permissions",
    status: "Live",
    url: "https://techopswire.com/articles/linux-file-permissions-chmod-chown",
    date: "2026-09-24 10:00:00",
    sheet2RowTarget: "linux file permissions explained: chmod, chown & octal notation"
  },
  {
    keyword: "excel drop down list",
    category: "Data & Excel Automation",
    tags: "how to create a drop down list in excel, how to add drop down list in excel, create drop down list in excel, excel drop down menu",
    status: "Live",
    url: "https://techopswire.com/articles/excel-drop-down-list",
    date: "2026-09-24 10:00:00",
    sheet2RowTarget: "excel drop down list"
  },
  {
    keyword: "docker container architecture",
    category: "Cloud & Infrastructure",
    tags: "docker swarm vs kubernetes, docker overlay network, docker volume vs bind mount",
    status: "Live",
    url: "https://techopswire.com/articles/docker-container-architecture",
    date: "2026-09-24 10:00:00",
    sheet2RowTarget: "docker swarm vs kubernetes"
  },
  {
    keyword: "chatgpt file upload limit",
    category: "AI & Developer Tools",
    tags: "chatgpt plus file upload limits, chatgpt pdf max size, chatgpt token limits explained",
    status: "Live",
    url: "https://techopswire.com/articles/chatgpt-file-upload-limits",
    date: "2026-09-24 10:00:00",
    sheet2RowTarget: "chatgpt file upload limit"
  },
  {
    keyword: "server 2019 end of life",
    category: "OS & Systems",
    tags: "windows server 2019 support lifecycle, server 2019 upgrade to 2022, windows server migration checklist",
    status: "Live",
    url: "https://techopswire.com/articles/windows-server-2019-end-of-life",
    date: "2026-09-24 10:00:00",
    sheet2RowTarget: "server 2019 end of life"
  }
];

/**
 * 1. RUN THIS FUNCTION TO UPDATE ALL 9 ARTICLES IMMEDIATELY IN SHEET1 & SHEET2
 */
function updateCompletedArticles() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Update Sheet1
  var sheet1 = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
  var s1Data = sheet1.getDataRange().getValues();
  
  // Check existing URLs in Sheet1 to avoid duplicates
  var existingUrls = {};
  for (var i = 1; i < s1Data.length; i++) {
    if (s1Data[i][4]) {
      existingUrls[s1Data[i][4]] = true;
    }
  }
  
  COMPLETED_ARTICLES.forEach(function(art) {
    if (!existingUrls[art.url]) {
      sheet1.appendRow([
        art.keyword,
        art.category,
        art.tags,
        art.status,
        art.url,
        art.date
      ]);
      existingUrls[art.url] = true;
    }
  });
  
  // Update Sheet2
  var sheet2 = ss.getSheetByName("Sheet2") || ss.getSheets()[1];
  if (sheet2) {
    var s2Data = sheet2.getDataRange().getValues();
    // Headers:
    // Col 2 (index 2): Main Target Keyword (H1)
    // Col 9 (index 9): Status
    // Col 10 (index 10): Post Url
    // Col 11 (index 11): Post Date / Tmie
    
    for (var r = 1; r < s2Data.length; r++) {
      var rowKw = String(s2Data[r][2] || "").toLowerCase().trim();
      var rowTitle = String(s2Data[r][1] || "").toLowerCase().trim();
      
      COMPLETED_ARTICLES.forEach(function(art) {
        var targetKw = String(art.sheet2RowTarget || art.keyword).toLowerCase().trim();
        if (rowKw === targetKw || rowKw.indexOf(targetKw) !== -1 || targetKw.indexOf(rowKw) !== -1 || rowTitle.indexOf(targetKw) !== -1) {
          // Set Status = Live (Column J / 10)
          sheet2.getRange(r + 1, 10).setValue("Live");
          // Set Post Url (Column K / 11)
          sheet2.getRange(r + 1, 11).setValue(art.url);
          // Set Post Date / Time (Column L / 12)
          sheet2.getRange(r + 1, 12).setValue(art.date);
        }
      });
    }
  }
  
  Logger.log("Successfully updated Sheet1 and Sheet2 with all 9 completed articles!");
}

/**
 * 2. WEBHOOK RECEIVER FOR DAILY AUTOMATED POSTING
 * When the GitHub Action or auto-publisher runs daily, it posts JSON to this webhook.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Append to Sheet1
    var sheet1 = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    sheet1.appendRow([
      data.keyword || "",
      data.category || "",
      data.tags || "",
      "Live",
      data.postUrl || "",
      data.postDate || new Date().toISOString().replace('T', ' ').slice(0, 19)
    ]);
    
    // 2. Update status in Sheet2
    var sheet2 = ss.getSheetByName("Sheet2") || ss.getSheets()[1];
    if (sheet2 && data.keyword) {
      var s2Data = sheet2.getDataRange().getValues();
      var searchKw = String(data.keyword).toLowerCase().trim();
      for (var r = 1; r < s2Data.length; r++) {
        var rowKw = String(s2Data[r][2] || "").toLowerCase().trim();
        if (rowKw === searchKw || rowKw.indexOf(searchKw) !== -1 || searchKw.indexOf(rowKw) !== -1) {
          sheet2.getRange(r + 1, 10).setValue("Live");
          sheet2.getRange(r + 1, 11).setValue(data.postUrl);
          sheet2.getRange(r + 1, 12).setValue(data.postDate || new Date().toISOString().replace('T', ' ').slice(0, 19));
          break;
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Sheet updated successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
