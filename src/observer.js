export class Observer {
  constructor(chatJump) {
    this.chatJump = chatJump;
    this.observer = null;
  }

  initialize() {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver(() => {
      this.chatJump.updateDots();
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
  }
}
