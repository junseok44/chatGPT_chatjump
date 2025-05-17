// 모듈 로드 함수
async function loadModule(modulePath) {
  const src = chrome.runtime.getURL(modulePath);
  return import(src);
}

// 메인 초기화 함수
async function initialize() {
  try {
    const [
      { CONFIG },
      { getMessages },
      { Navigation },
      { Observer },
      { UrlHandler },
    ] = await Promise.all([
      loadModule("src/config.js"),
      loadModule("src/dom.js"),
      loadModule("src/navigation.js"),
      loadModule("src/observer.js"),
      loadModule("src/url-handler.js"),
    ]);

    class ChatJump {
      constructor() {
        this.navigation = new Navigation();
        this.observer = new Observer(this);
        this.urlHandler = new UrlHandler(this);
        this.currentChatId = null;
      }

      initialize() {
        // 초기 URL 체크
        this.checkUrlAndUpdate();

        // URL 변경 감지
        this.urlHandler.initialize();

        // DOM 변경 감지
        this.observer.initialize();
      }

      checkUrlAndUpdate() {
        const url = window.location.href;
        const chatIdMatch =
          url.match(/\/c\/([a-f0-9-]+)/) ||
          url.match(/\/g\/([a-f0-9-]+)\/c\/([a-f0-9-]+)/);
        const newChatId = chatIdMatch ? chatIdMatch[1] : null;

        console.log("isNewUrl?", newChatId !== this.currentChatId);

        if (newChatId !== this.currentChatId) {
          this.currentChatId = newChatId;
          this.updateDots();
        }
      }

      updateDots() {
        const messages = getMessages();
        if (messages && messages.length > 0) {
          this.navigation.updateDots(messages);
        }
      }
    }

    // DOM이 로드된 후 초기화
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        new ChatJump().initialize()
      );
    } else {
      new ChatJump().initialize();
    }
  } catch (error) {
    console.error("모듈 로드 중 오류 발생:", error);
  }
}

initialize();
