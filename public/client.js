const socket = io();

// Input user's name logic
let name;

do {
  name = prompt("Please enter your name");
} while (!name);

const modalbtn = document.querySelector(".modal");
const okbtn = document.querySelector(".okbtn");
const section = document.querySelector(".chat__section");
const sendbtn = document.getElementById("btn");
// Flag to track modal state
let isModalOpen = false;

function openModal() {
  if (!isModalOpen) {
    modalbtn.style.display = "block";
    section.classList.add("modal-open"); // Add the modal-open class
    isModalOpen = true;
    textarea.setAttribute("disabled", "true");
    textarea.classList.add("disable");
    sendbtn.classList.add("disable");
  }
}

okbtn.addEventListener("click", () => {
  modalbtn.style.display = "none";
  section.classList.remove("modal-open");
  isModalOpen = false;
  textarea.removeAttribute("disabled"); // Remove the disabled attribute
  textarea.classList.remove("disable");
  sendbtn.classList.remove("disable");
  textarea.focus(); // Set focus back to the textarea
});

function randomNumber() {
  const num = Math.floor(Math.random() * 100000);
  const msg = `Here's your random number ${num}`;
  sendMessage(msg);
}

function clearChat() {
  messageArea.innerHTML = "";
}

function replaceTextWithEmoji(message) {
  const emojiMap = {
    react: "⚛️",
    woah: "😲",
    hey: "👋",
    lol: "😂",
    like: "🤍",
    congratulations: "🎉",
  };

  const words = message.split(" ");
  console.log(words);

  // Replace text with emojis
  const replacedWords = words.map((word) => {
    const lowercaseWord = word.toLowerCase();
    if (emojiMap.hasOwnProperty(lowercaseWord)) {
      return emojiMap[lowercaseWord];
    }
    return word;
  });
  console.log(replacedWords);

  return replacedWords.join(" ");
}

// Logic for text input
let textarea = document.querySelector("#textarea");
textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && textarea.value.trim() !== "") {
    const text = e.target.value.substring(0, e.target.value.length - 1); // Remove the enter key from the text
    if (text === "/help") {
      openModal();
      textarea.value = "";
    } else if (text === "/random") {
      randomNumber();
      textarea.value = "";
    } else if (text === "/clear") {
      clearChat();
      textarea.value = "";
    } else {
      sendMessage(replaceTextWithEmoji(text)); // Replace text with emojis before sending
    }
  }
});

document.querySelector("#btn").addEventListener("click", (e) => {
  const text = textarea.value.trim();
  if (text === "/help") {
    openModal();
    textarea.value = "";
  } else if (text === "/random") {
    randomNumber();
    textarea.value = "";
  } else if (text === "/clear") {
    clearChat();
    textarea.value = "";
  } else if (text !== "") {
    sendMessage(replaceTextWithEmoji(text)); // Replace text with emojis before sending
  }
});

// message sending logic
let messageArea = document.querySelector(".message__area");
// Function to send message
function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };

  //   Append the message to the chat
  appendMessage(msg, "outgoing");
  scrollToBottom();
  textarea.value = "";

  //   Send to Server
  socket.emit("message", msg);
}

// Function to append message
function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  //   Creating the html for message
  let markup = `
    <h4> ${msg.user} </h4>
    <p> ${msg.message} </p>
    `;
  // adding the html to mainDiv
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

// Recieve message

const userList = document.getElementById("userList");
const users = new Set(); // To store unique user names
updateUserList(name); // Update the user list with the current user name
// Function to update the user list
function updateUserList(userName) {
  if (userName.trim() !== "") {
    users.add(userName);
  }
  userList.innerHTML = ""; // Clear the user list
  users.forEach((user) => {
    const userItem = document.createElement("li");
    userItem.classList.add("user-item");
    userItem.innerHTML = `
                          <p>${user}</p>`;
    userList.appendChild(userItem);
  });
}

socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  updateUserList(msg.user);
  scrollToBottom();
});

// Scroll to the newest message
function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
