document.addEventListener("DOMContentLoaded", async () => {
  // 현재 설정 로드
  const config = await chrome.storage.sync.get({
    MAX_DOTS: 20,
    TOOLTIP_MAX_LENGTH: 200,
    TOOLTIP_FROM_END: false,
  });

  // UI에 현재 설정 표시
  document.getElementById("maxDots").value = config.MAX_DOTS;
  document.getElementById("tooltipLength").value = config.TOOLTIP_MAX_LENGTH;
  document.getElementById("tooltipFromEnd").checked = config.TOOLTIP_FROM_END;

  // 저장 버튼 클릭 이벤트
  document.getElementById("saveButton").addEventListener("click", async () => {
    const newConfig = {
      MAX_DOTS: parseInt(document.getElementById("maxDots").value),
      TOOLTIP_MAX_LENGTH: parseInt(
        document.getElementById("tooltipLength").value
      ),
      TOOLTIP_FROM_END: document.getElementById("tooltipFromEnd").checked,
    };

    // 설정 저장
    await chrome.storage.sync.set(newConfig);

    // 현재 탭에 설정 변경 알림
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab) {
      chrome.tabs.sendMessage(tab.id, {
        type: "CONFIG_UPDATED",
        config: newConfig,
      });
    }

    // 팝업 닫기
    window.close();
  });
});
