chrome.runtime.sendMessage(
  {
    action: 'initPopup',
  },
  res => {
    NewsCard.init(res);
  }
);
