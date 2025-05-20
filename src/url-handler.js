import { CONFIG } from "./config.js";

export class UrlHandler {
  constructor(chatJump) {
    this.chatJump = chatJump;
    this.lastUrl = window.location.href;
  }

  initialize() {
    // URL 변경 감지를 위한 MutationObserver 설정

    // console.log("url handler initialized");

    const observer = new MutationObserver(() => {
      const currentUrl = window.location.href;

      if (currentUrl !== this.lastUrl) {
        // console.log("url changed", currentUrl);
        this.lastUrl = currentUrl;

        if (CONFIG.CHAT_PAGE_REGEX.test(currentUrl)) {
          // console.log("Chat page detected, reinitializing observer");
          this.chatJump.observer.initialize();
        } else {
          // console.log("Non-chat page detected, disconnecting observer");
          this.chatJump.disconnect();
        }
      }
    });

    // body의 변경 감지
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}
