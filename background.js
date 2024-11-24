chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) {
    console.error("No active tab found.");
    return;
  }

  // Inject the content script into the active tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("Failed to inject content script:", chrome.runtime.lastError.message);
    } else {
      console.log("Content script injected successfully.");
    }
  });
});