import { CONFIG } from "./config.js";

export class UrlHandler {
  constructor(chatJump) {
    this.chatJump = chatJump;
    this.lastUrl = window.location.href;
  }

  initialize() {
    // URL 변경 감지를 위한 MutationObserver 설정
    const observer = new MutationObserver(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== this.lastUrl) {
        this.lastUrl = currentUrl;
        this.chatJump.checkUrlAndUpdate();
      }
    });

    // body의 변경 감지
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}
