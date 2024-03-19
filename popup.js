document.addEventListener("DOMContentLoaded", function () {
  const suggestedMessagesContainer =
    document.getElementById("suggested-messages");
  const chatMessagesContainer = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const userIcon = document.getElementById("user-icon");

  // Suggested messages data
  const suggestedMessageList = [
    "Hello",
    "Good morning",
    "Thank you",
    "What is the duration",
    "What is the agenda",
    "What is the meeting about",
    "Please review the meeting notes",
    "Could you clarify that point?",
    "Let's discuss the action items",
    "Are we on track with the schedule?",
    "Can we take a quick break?",
    "I have a question regarding the last topic",
    "Let's ensure everyone has a chance to speak",
    "Could you share your screen for the presentation?",
    "Let's recap what we've discussed so far",
  ];

  function displaySuggestedMessages() {
    suggestedMessagesContainer.innerHTML = "";
    const shuffledMessages = suggestedMessageList.sort(
      () => Math.random() - 0.5
    );

    const messagesToShow = shuffledMessages.slice(
      0,
      Math.floor(Math.random() * 2) + 3
    );
    messagesToShow.forEach((messageText) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("suggested-message");
      messageElement.textContent = messageText;
      suggestedMessagesContainer.appendChild(messageElement);
    });
  }

  function sendMessage(message) {
    const newMessage = document.createElement("div");
    newMessage.classList.add("chat-message");
    newMessage.textContent = message;
    chatMessagesContainer.appendChild(newMessage);
  }

  suggestedMessagesContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("suggested-message")) {
      const message = event.target.textContent;
      event.target.style.display = "none";
      displaySuggestedMessages();
      sendMessage(message);
    }
  });

  sendButton.addEventListener("click", function () {
    const message = userInput.value.trim();
    if (message !== "") {
      sendMessage(message);
      userInput.value = "";
    }
  });

  displaySuggestedMessages();
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.type === "meeting_title") {
      const meetingTitle = message.data.title
        ? message.data.title
        : "Meeting Title Not Found";
      document.getElementById("meeting-title").textContent = meetingTitle;
      console.log("Meeting title received:", meetingTitle);
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const title = tabs[0].title;
    const url = tabs[0].url;
    const roomId = url.split("/")[4];
    let meetingName = "";

    const regex = /\((.*?)\)|\[(.*?)\]/;
    const match = regex.exec(title);

    if (match) {
      if (match[1]) {
        meetingName = match[1].trim();
      } else if (match[2]) {
        meetingName = match[2].trim();
      }
    }

    if (!meetingName) {
      meetingName = title;
    }

    console.log("Meeting Name:", meetingName);
    console.log("Room ID:", roomId);
    document.getElementById("meeting-title").textContent = meetingName;
  });
});
