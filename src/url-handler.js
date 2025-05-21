import { CONFIG } from "./config.js";

export class UrlHandler {
  constructor(chatJump) {
    this.chatJump = chatJump;
    this.lastUrl = window.location.href;
  }

  initialize() {
    this.handler = new MutationObserver(() => {
      const currentUrl = window.location.href;

      if (currentUrl !== this.lastUrl) {
        this.lastUrl = currentUrl;

        this.chatJump.observer.initialize();
      }
    });

    this.handler.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  disconnect() {
    if (this.handler) {
      this.handler.disconnect();
    }
  }
}
