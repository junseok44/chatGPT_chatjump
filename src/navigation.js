import { CONFIG } from "./config.js";
import { getMessageContent, scrollToMessage } from "./dom.js";

export class Navigation {
  constructor() {
    this.container = null;
    this.dots = [];
    this.currentPage = 0; // 현재 페이지 번호
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

    if (!this.container || !document.body.contains(this.container)) {
      this.init();
    }

    this.clearDots();

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(messages.length / CONFIG.MAX_DOTS);

    // 현재 페이지의 메시지 범위 계산
    const startIndex = Math.max(
      0,
      messages.length - (this.currentPage + 1) * CONFIG.MAX_DOTS
    );
    const endIndex = Math.max(
      0,
      messages.length - this.currentPage * CONFIG.MAX_DOTS
    );
    const pageMessages = messages.slice(startIndex, endIndex);

    // 이전 페이지 버튼 추가
    if (this.currentPage < totalPages - 1) {
      const prevButton = this.createNavigationButton("↑", () => {
        this.currentPage++;
        this.updateDots(messages);
      });
      this.container.appendChild(prevButton);
    }

    // 도트 생성
    pageMessages.forEach((message, index) => {
      const dot = this.createDot(message, startIndex + index);
      this.container.appendChild(dot);
      this.dots.push(dot);
    });

    // 다음 페이지 버튼 추가
    if (this.currentPage > 0) {
      const nextButton = this.createNavigationButton("↓", () => {
        this.currentPage--;
        this.updateDots(messages);
      });
      this.container.appendChild(nextButton);
    }
  }

  createNavigationButton(symbol, onClick) {
    const button = document.createElement("div");
    button.className = `chat-jump-nav-button ${symbol === "↑" ? "up" : "down"}`;
    button.addEventListener("click", onClick);
    return button;
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
