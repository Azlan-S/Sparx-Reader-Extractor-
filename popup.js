document.getElementById("extractReadingTextButton").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) {
      alert("No active tab found. Please open a webpage and try again.");
      console.error("No active tab found.");
      return;
    }

    // Inject the content script into the current tab
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Content script injection failed:", chrome.runtime.lastError.message);
          alert("Failed to inject content script. Try reloading the page or checking permissions.");
          return;
        }

        // Send a message to the content script to extract the text
        chrome.tabs.sendMessage(tab.id, { action: "extractTextBetweenMarkers" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Failed to send message:", chrome.runtime.lastError.message);
            alert("Content script is not running. Try refreshing the page.");
            return;
          }

          if (response && response.extractedText) {
            // Get the user's custom text
            const customText = document.getElementById("customText").value.trim();

            // Combine the extracted text with the custom text
            const combinedText = `${response.extractedText}\n\n${customText}`;

            // Copy the combined text to the clipboard
            navigator.clipboard.writeText(combinedText).then(() => {
              // Show the "Copied to clipboard!" message
              const statusElement = document.getElementById("status");
              statusElement.style.display = "block"; // Show the status message
              statusElement.textContent = "Copied to clipboard!";
              setTimeout(() => {
                statusElement.style.display = "none"; // Hide the status message after 2 seconds
              }, 2000);
            });
          } else {
            alert("Failed to extract text. Ensure the markers exist on the page.");
            console.error("No extracted text returned.");
          }
        });
      }
    );
  } catch (error) {
    console.error("Error in popup script:", error);
    alert("An unexpected error occurred. Check the console for details.");
  }
});