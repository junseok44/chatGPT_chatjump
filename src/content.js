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
        // URL 변경 감지
        this.urlHandler.initialize();

        // DOM 변경 감지
        this.observer.initialize();
      }

      updateDots() {
        const messages = getMessages();

        if (messages) {
          this.navigation.updateDots(messages);
        }
      }

      disconnect() {
        this.navigation.clearDots();
        this.observer.disconnect();
        this.urlHandler.disconnect();
      }
    }

    const chatJump = new ChatJump();

    // DOM이 로드된 후 초기화
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        chatJump.initialize()
      );
    } else {
      chatJump.initialize();
    }

    // 설정 변경 메시지 리스너
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "CONFIG_UPDATED") {
        // CONFIG 객체 업데이트
        Object.assign(CONFIG, message.config);

        // 도트 업데이트
        chatJump.updateDots();
      }
    });
  } catch (error) {
    console.error("모듈 로드 중 오류 발생:", error);
  }
}

initialize();
