chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ai-analyze-tc",
    title: "🤖 Analyze with AI",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "ai-analyze-tc") {
    chrome.storage.local.set({ tcText: info.selectionText }, () => {
      chrome.action.setBadgeText({ text: "AI" });
      chrome.action.setBadgeBackgroundColor({ color: "#667eea" });
      
      if (chrome.action.openPopup) {
        chrome.action.openPopup().catch(() => {
          showNotification();
        });
      } else {
        showNotification();
      }
    });
  }
});

function showNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjIiIGZpbGw9IiM2NjdlZWEiLz4KPHR0ZXh0IHg9IjI0IiB5PSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QUk8L3RleHQ+Cjwvc3ZnPg==',
    title: 'AI Analysis Ready!',
    message: 'Click the extension icon to view your AI-powered T&C analysis and recommendation.'
  });
}
