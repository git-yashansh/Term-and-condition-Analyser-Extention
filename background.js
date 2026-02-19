// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: "ai-analyze-tc",
//     title: "🤖 Analyze with AI",
//     contexts: ["selection"]
//   });
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === "ai-analyze-tc") {
//     chrome.storage.local.set({ tcText: info.selectionText }, () => {
//       chrome.action.setBadgeText({ text: "AI" });
//       chrome.action.setBadgeBackgroundColor({ color: "#667eea" });

//       // if (chrome.action.openPopup) {
//       //   chrome.action.openPopup().catch(() => {
//       //     showNotification();
//       //   });
//       // } else {
//       //   showNotification();
//       // }
//       chrome.storage.local.set({
//   tcText: info.selectionText,
//   localRiskData: null
// }, () => {

//   chrome.storage.onChanged.addListener(function waitForRisk(changes, area) {

//     if(area === "local" && changes.localRiskData){

//       chrome.storage.onChanged.removeListener(waitForRisk);

//       chrome.action.openPopup();

//     }

//   });

// });

//     });
//   }
// });

// function showNotification() {
//   chrome.notifications.create({
//     type: "basic",
//     iconUrl: "icon.png",
//     title: "AI Analysis Ready!",
//     message: "Click the extension icon to view your AI-powered T&C analysis."
//   });
// }

// let latestRiskData = null;

// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

//   if(msg.type === "RISK_RESULT"){
//     latestRiskData = msg.data;
//   }

//   if(msg.type === "GET_RISK_RESULT"){
//     sendResponse(latestRiskData);
//   }

// });
// jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: "ai-analyze-tc",
//     title: "🤖 Analyze with AI",
//     contexts: ["selection"]
//   });
// });

// chrome.contextMenus.onClicked.addListener(async (info, tab) => {

//   if (info.menuItemId === "ai-analyze-tc") {

//     await chrome.storage.local.set({
//       tcText: info.selectionText,
//       localRiskData: null
//     });

//     // ⭐ FORCE inject content.js FIRST
//     await chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ["content.js"]
//     });

//     // ⭐ NOW send message AFTER injection
//     chrome.tabs.sendMessage(tab.id, {
//       type: "ANALYZE_LOCAL",
//       text: info.selectionText
//     });

//     chrome.action.openPopup();

//   }

// });

  

//     chrome.storage.onChanged.addListener(function waitForRisk(changes, area){

//       if(area==="local" && changes.localRiskData){

//         chrome.storage.onChanged.removeListener(waitForRisk);

//         chrome.action.openPopup();

//       }

//     });

// function analyzeLocalRisk(text){

//   const high=[
//     "sell","share","third party","track",
//     "record","location","keystroke","microphone",
//     "auto renew","subscription","no refund",
//     "not responsible","terminate","arbitration"
//   ];

//   const medium=[
//     "collect","store data","cookies",
//     "analytics","modify terms"
//   ];

//   const low=[
//     "encrypt","secure","protect"
//   ];

//   let h=0,m=0,l=0;
//   const t=text.toLowerCase();

//   high.forEach(k=>{if(t.includes(k))h++;});
//   medium.forEach(k=>{if(t.includes(k))m++;});
//   low.forEach(k=>{if(t.includes(k))l++;});

//   return {score:(h*3)+(m*2)-l};
// }

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ai-analyze-tc",
    title: "Analyze with TermiAI",
    contexts: ["selection"]
  });
});

function analyzeLocalRisk(text){

  const high=[
    "sell personal data",
    "share with advertisers",
    "track keystrokes",
    "monitor keyboard",
    "record microphone",
    "access camera",
    "no refund",
    "non refundable",
    "automatic billing",
    "auto renew",
    "recurring charges",
    "terminate without notice",
    "at our sole discretion",
    "no liability",
    "not responsible",
    "binding arbitration",
    "class action waiver",
    "irrevocable license",
    "perpetual license",
    "exclusive rights"
  ];

  const medium=[
    "collect data",
    "collect information",
    "usage data",
    "store data",
    "cookies",
    "analytics",
    "modify terms",
    "change policy",
    "update terms",
    "service improvement",
    "monitor usage"
  ];

  const low=[
    "encrypt",
    "secure",
    "privacy control",
    "opt out",
    "data deletion",
    "user consent",
    "comply with law"
  ];

  let h=0,m=0,l=0;
  const t=text.toLowerCase();

  high.forEach(k=>{if(t.includes(k))h++;});
  medium.forEach(k=>{if(t.includes(k))m++;});
  low.forEach(k=>{if(t.includes(k))l++;});

  return {score:(h*3)+(m*2)-l};
}

chrome.contextMenus.onClicked.addListener(async (info)=>{

  if(info.menuItemId==="ai-analyze-tc"){

    const risk=analyzeLocalRisk(info.selectionText);

    await chrome.storage.local.set({
      tcText:info.selectionText,
      localRiskData:risk
    });

    chrome.action.openPopup();

  }

});


  

