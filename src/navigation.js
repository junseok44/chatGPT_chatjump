import { CONFIG } from "./config.js";
import { getMessageContent, scrollToMessage } from "./dom.js";

export class Navigation {
  constructor() {
    this.container = null;
    this.dots = [];
    this.currentPage = 0; // 현재 페이지 번호
    this.dotStates = new Map(); // 도트별 상태 저장 (key: messageIndex, value: showingAnswer)
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
      // 상태는 유지 (페이지 전환 시에도 상태 보존)
    }
  }

  destroy() {
    if (this.container && document.body.contains(this.container)) {
      document.body.removeChild(this.container);
    }
    this.container = null;
    this.dots = [];
    this.currentPage = 0;
    this.dotStates.clear(); // 전체 정리 시에만 상태 초기화
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

    // 현재 사용자 메시지 다음의 어시스턴트 답변 article 찾기
    const findAssistantAfterUser = (userMessageElement) => {
      if (!userMessageElement) return null;
      let userArticle = userMessageElement;
      while (userArticle && userArticle.tagName !== "ARTICLE") {
        userArticle = userArticle.parentElement;
      }
      if (!userArticle) return null;

      let el = userArticle.nextElementSibling;
      while (el) {
        if (
          el.tagName === "ARTICLE" &&
          el.querySelector('[data-message-author-role="assistant"]')
        ) {
          return el;
        }
        el = el.nextElementSibling;
      }
      return null;
    };

    const assistantResponse = findAssistantAfterUser(message.element);

    // 도트별 상태를 클래스 레벨에서 관리
    const dotKey = `dot-${index}`;
    if (!this.dotStates.has(dotKey)) {
      this.dotStates.set(dotKey, false); // 초기값: false (질문 상태)
    }

    // 툴팁 텍스트 설정
    let tooltipText;
    if (CONFIG.TOOLTIP_FROM_END) {
      // 끝부분부터 표시
      const start = Math.max(
        0,
        message.text.length - CONFIG.TOOLTIP_MAX_LENGTH
      );
      tooltipText = (start > 0 ? "..." : "") + message.text.slice(start);
    } else {
      // 처음부터 표시
      tooltipText =
        message.text.slice(0, CONFIG.TOOLTIP_MAX_LENGTH) +
        (message.text.length > CONFIG.TOOLTIP_MAX_LENGTH ? "..." : "");
    }

    // 커스텀 툴팁 생성
    const tooltip = document.createElement("div");
    tooltip.className = "chat-jump-tooltip";
    tooltip.textContent = tooltipText;
    dot.appendChild(tooltip);

    dot.addEventListener("click", () => {
      const messageElement = message.element;
      if (!messageElement) return;

      // 현재 상태 가져오기
      const currentState = this.dotStates.get(dotKey);

      console.log(
        `클릭 전 상태: showingAnswer=${currentState}, assistantResponse=${!!assistantResponse}`
      );

      // 상태 해석: false=다음에 질문으로, true=다음에 답변으로
      let targetElement;
      if (currentState) {
        // 다음이 답변 → 답변으로 이동하고 다음은 질문으로 설정
        if (assistantResponse) {
          console.log("답변으로 이동");
          targetElement = assistantResponse;
          this.dotStates.set(dotKey, false); // 다음은 질문으로
        } else {
          console.log("답변 없음 → 질문으로 이동");
          targetElement = messageElement;
          this.dotStates.set(dotKey, false);
        }
      } else {
        // 다음이 질문 → 질문으로 이동하고 다음은 답변으로 설정
        console.log("질문으로 이동");
        targetElement = messageElement;
        if (assistantResponse) {
          this.dotStates.set(dotKey, true); // 다음은 답변으로
        }
      }

      console.log(`스크롤 대상:`, targetElement);
      console.log(`클릭 후 상태: showingAnswer=${this.dotStates.get(dotKey)}`);

      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // 활성화된 도트 표시
      this.dots.forEach((d) => d.classList.remove("active"));
      dot.classList.add("active");
    });

    return dot;
  }
}
