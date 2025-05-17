import { CONFIG } from "./config.js";
import { getMessageContent, scrollToMessage } from "./dom.js";

export class Navigation {
  constructor() {
    this.container = null;
    this.dots = [];
    this.init();
  }

  init() {
    this.createContainer();
  }

  createContainer() {
    if (this.container) {
      document.body.removeChild(this.container);
    }
    this.container = document.createElement("div");
    this.container.id = "chat-jump-nav";
    document.body.appendChild(this.container);
  }

  clearDots() {
    if (this.container) {
      this.container.innerHTML = "";
      this.dots = [];
    }
  }

  updateDots(messages) {
    if (!messages || messages.length === 0) {
      this.clearDots();
      return;
    }

    // 컨테이너가 없으면 다시 생성
    if (!this.container || !document.body.contains(this.container)) {
      this.init();
    }

    this.clearDots();

    // 최신 메시지부터 표시하고 최대 개수 제한
    const startIndex = Math.max(0, messages.length - CONFIG.MAX_DOTS);
    const recentMessages = messages.slice(startIndex);

    recentMessages.forEach((message, index) => {
      const dot = this.createDot(message, startIndex + index);
      this.container.appendChild(dot);
      this.dots.push(dot);
    });
  }

  createDot(message, index) {
    const dot = document.createElement("div");
    dot.className = "chat-jump-dot";

    // 툴팁 텍스트 설정
    const tooltipText =
      message.text.slice(0, CONFIG.TOOLTIP_MAX_LENGTH) +
      (message.text.length > CONFIG.TOOLTIP_MAX_LENGTH ? "..." : "");
    dot.setAttribute("title", tooltipText);

    dot.addEventListener("click", () => {
      const messageElement = message.element;
      if (messageElement) {
        // 메시지 요소로 스크롤
        messageElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // 활성화된 도트 표시
        this.dots.forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");
      }
    });

    return dot;
  }
}
