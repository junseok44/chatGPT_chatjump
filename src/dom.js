export const createElement = (tag, className) => {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  return element;
};

export const getMessageContent = (message) => {
  const messageContent = message.querySelector(".whitespace-pre-wrap");
  return messageContent ? messageContent.textContent.trim() : "";
};

export function getMessages() {
  const messageElements = document.querySelectorAll(
    '[data-message-author-role="user"]'
  );
  return Array.from(messageElements).map((element) => ({
    element,
    text: element.textContent.trim(),
  }));
}

export function getChatContainer() {
  return document.querySelector("main");
}

export function scrollToMessage(element, offset = 0) {
  const messageTop =
    element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top: messageTop,
    behavior: "smooth",
  });
}
