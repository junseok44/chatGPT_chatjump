export class Observer {
  constructor(chatJump) {
    this.chatJump = chatJump;
    this.observer = null;
    this.updateTimeout = null;
  }

  initialize() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver(() => {
      // 디바운싱 적용
      if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
      }

      this.updateTimeout = setTimeout(() => {
        this.chatJump.updateDots();
      }, 500); // 500ms 딜레이
    });

    const chatContainer = document.querySelector("main");

    if (chatContainer) {
      this.observer.observe(chatContainer, {
        childList: true,
        subtree: true,
      });
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
  }
}
