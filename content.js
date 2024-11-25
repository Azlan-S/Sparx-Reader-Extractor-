// Function to create and inject the overlay UI into the webpage
function createOverlayUI() {
  if (document.getElementById("custom-text-extractor-overlay")) {
    console.log("Overlay already exists!");
    return;
  }

  // Create the overlay container
  const overlay = document.createElement("div");
  overlay.id = "custom-text-extractor-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "80px";
  overlay.style.right = "100px";
  overlay.style.width = "350px";
  overlay.style.height = "auto";
  overlay.style.maxHeight = "300px";
  overlay.style.backgroundColor = "rgba(203, 232, 239, 1)";
  overlay.style.border = "1px solid #ccc";
  overlay.style.borderRadius = "8px";
  overlay.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  overlay.style.zIndex = "10000";
  overlay.style.fontFamily = "'Korto', sans-serif";
  overlay.style.overflow = "hidden";
  overlay.style.cursor = "grab";

  // Create the header
  const header = document.createElement("div");
  header.style.background = "linear-gradient(135deg, #4c54d4, #4c5ce4, #4444bb, #4858b8)";
  header.style.color = "white";
  header.style.padding = "20px 50px 20px 20px";
  header.style.fontSize = "24px";
  header.style.fontWeight = "bold";
  header.style.textAlign = "center";
  header.style.position = "relative";
  header.style.cursor = "grab";

  const headerText = document.createElement("div");
  headerText.innerText = "Sparx Reader Extractor";

  // Add the close button ("X")
  const closeButton = document.createElement("button");
  closeButton.id = "closeOverlayButton";
  closeButton.innerHTML = "&times;";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.width = "50px";
  closeButton.style.height = "50px";
  closeButton.style.backgroundColor = "transparent";
  closeButton.style.border = "none";
  closeButton.style.color = "red";
  closeButton.style.fontSize = "35px";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontWeight = "bold";

  header.appendChild(headerText);
  header.appendChild(closeButton);
  overlay.appendChild(header);

  // Create the content area
  const content = document.createElement("div");
  content.style.padding = "20px";

  // Add buttons
  content.innerHTML = `
    <button id="extractTextButton" style="width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Extract Reading Text</button>
    <button id="extractQuestionsButton" style="width: 100%; padding: 10px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 10px;">Extract Questions & Answers</button>
    <button id="helpButton" style="
      width: 100%; 
      padding: 10px; 
      background-color: #ff2a00; 
      color: black; 
      border: none; 
      border-radius: 5px; 
      cursor: pointer; 
      font-size: 16px; 
      margin-top: 10px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
    ">
      I need Help
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAAUVBMVEVHcEwAAAABAQEAAAAICAgCAgIFBQUEBAQFBQUBAQEDAwMBAQECAgIAAAAAAAALCwsDAwMBAQECAgIAAAACAgIDAwMBAQEDAwMBAQEEBAQCAgKC4hCIAAAAG3RSTlMA/sHkDGsVHSSyQtei+OsEY5c333VJjSzIMXyexvrBAAABCUlEQVQoz32S27KDIAxF2UEU5KIUa9vz/x96Ei6jD53mgUG2yQo7KNViMU4D0M4s6h7z4aOmkAPp6I/5Eh4E2u3Eu8nuvH8M4VmSkWO1bSKaVJ49o5RVSHtw7lxZXEupWTMlEdY3JGJmyppIWAcMr9YD7zPzmjnL4OAinoRxAoH/e3mkD7PIL8rEXdhn8R+pnQHB79Eop62cTIvdKhRRqFY7pWux4UQA6vdEWiFcgiWgFVUBCvnyiAVqAvPuOQZww0/OuXFCo6vO6b1JnIVGivTW7tM4dtn6Vu7TPZD4o4GpHnTfxAeH9Bq9HJfXlfNuzO71mI84NFfOmM9tpk2/ZvrjHfx4O1/f2z86VwtdMD5yeAAAAABJRU5ErkJggg==" 
        alt="Help Icon" style="
        margin-left: 8px; 
        width: 20px; 
        height: 20px;
      " />
    </button>
  `;

  // Add a message area for success messages
  const messageArea = document.createElement("div");
  messageArea.id = "successMessage";
  messageArea.style.marginTop = "15px";
  messageArea.style.textAlign = "center";
  messageArea.style.color = "green";
  messageArea.style.fontWeight = "bold";
  messageArea.style.fontSize = "14px";
  messageArea.style.visibility = "hidden"; // Initially hidden
  content.appendChild(messageArea);

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  // Make the overlay draggable
  makeOverlayDraggable(overlay, header);

  // Close button functionality
  closeButton.addEventListener("click", () => {
    overlay.remove();
  });

  // Add event listeners for the buttons
  document.getElementById("extractTextButton").addEventListener("click", async () => {
    try {
      const extractedText = extractText();
      await navigator.clipboard.writeText(extractedText);
      showSuccessMessage("Reading text copied to clipboard!");
    } catch (error) {
      console.error("Error extracting and copying text:", error);
      showSuccessMessage("Error: Could not copy text.", true);
    }
  });

  document.getElementById("extractQuestionsButton").addEventListener("click", async () => {
    try {
      const questionsAndAnswers = extractQuestions();

      if (!questionsAndAnswers) {
        showSuccessMessage("No questions/answers found.", true);
        return;
      }

      await navigator.clipboard.writeText(questionsAndAnswers);
      showSuccessMessage("Questions & answers copied to clipboard!");
    } catch (error) {
      console.error("Error extracting questions and answers:", error);
      showSuccessMessage("Error: Could not copy questions.", true);
    }
  });

  document.getElementById("helpButton").addEventListener("click", () => {
    window.open(chrome.runtime.getURL("help.html"), "_blank");
  });
}

// Function to show success or error messages
function showSuccessMessage(message, isError = false) {
  const messageArea = document.getElementById("successMessage");
  if (messageArea) {
    messageArea.textContent = message;
    messageArea.style.color = isError ? "red" : "green";
    messageArea.style.visibility = "visible";

    // Hide the message after 3 seconds
    setTimeout(() => {
      messageArea.style.visibility = "hidden";
    }, 3000);
  }
}

// Function to make the overlay draggable
function makeOverlayDraggable(overlay, header) {
  let isDragging = false;
  let startX, startY, initialX, initialY;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = parseInt(overlay.style.right) || 100;
    initialY = parseInt(overlay.style.top) || 50;
    overlay.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const dx = startX - e.clientX;
    const dy = startY - e.clientY;

    overlay.style.right = `${initialX + dx}px`;
    overlay.style.top = `${initialY - dy}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      overlay.style.cursor = "grab";
    }
  });
}

// Function to extract the reading text between "Start reading here" and "Stop reading here"
function extractText() {
  const containerSelector = "#book-scroll > div > div > div.read-content";
  const startMarker = "Start reading here";
  const stopMarker = "Stop reading here";

  const container = document.querySelector(containerSelector);
  if (!container) {
    throw new Error(`Container "${containerSelector}" not found on the page.`);
  }

  let isCapturing = false;
  let extractedText = "";
  const startElement = Array.from(container.querySelectorAll("*")).find((node) =>
    node.textContent?.includes(startMarker)
  );
  const stopElement = Array.from(container.querySelectorAll("*")).find((node) =>
    node.textContent?.includes(stopMarker)
  );

  if (!startElement || !stopElement) {
    throw new Error(`Markers "${startMarker}" or "${stopMarker}" not found.`);
  }

  const traverse = (node) => {
    if (node === startElement) {
      isCapturing = true;
      extractedText += `Start reading here\n\n`;
    }
    if (isCapturing && node.nodeType === Node.TEXT_NODE) {
      extractedText += node.nodeValue.trim() + " ";
    }
    if (node === stopElement) {
      extractedText += `\n\nStop reading here`;
      isCapturing = false;
    }
    node.childNodes.forEach(traverse);
  };

  traverse(container);
  return extractedText.trim();
}

// Function to extract questions and their answers
function extractQuestions() {
  const containerSelector = ".PanelPaperbackQuestionContainer";
  const questionContainers = Array.from(document.querySelectorAll(containerSelector));

  if (questionContainers.length === 0) {
    return null; // Return null if no questions are found
  }

  let output = "";

  questionContainers.forEach((container, index) => {
    const questionTextElement = container.querySelector("._PanelQuestionContent_1idyw_228");
    const questionText = questionTextElement ? questionTextElement.textContent.trim() : null;

    if (!questionText) {
      console.warn(`No question text found for container ${index + 1}. Skipping.`);
      return;
    }

    const answerElements = Array.from(container.querySelectorAll("._Buttons_1idyw_257 button div"));
    const answers = answerElements.map((answer) => answer.textContent.trim());

    output += `Q${index + 1}: ${questionText}\n`;
    answers.forEach((answer, i) => {
      output += `  - ${answer}\n`;
    });
    output += "\n";
  });

  return output.trim();
}

// Inject the overlay UI
createOverlayUI();
