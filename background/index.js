const GITHUB = new API(
  'https://api.github.com',
  'fengshangwuqi',
  'Front-End-News'
);

async function handleMessage(message, sender, sendResponse) {
  const paths = News.getPaths() || [];
  const currDate = formatDate(new Date());

  switch (message.action) {
    case 'initPopup':
      if (paths.includes(currDate)) {
        sendResponse(paths);
      } else {
        try {
          const years = await GITHUB.getContent('history');
          const lastYear = years.pop();
          const months = await GITHUB.getContent(`history/${lastYear}`);
          const lastMonth = months.pop();
          const days = await GITHUB.getContent(
            `history/${lastYear}/${lastMonth}`
          );

          const firstThreePaths = days.length > 3 ? days.slice(-3) : days;
          const newPaths = firstThreePaths.map(
            day => `${lastYear}/${lastMonth}/${day}`
          );

          News.savePaths(newPaths);
          sendResponse(newPaths);
        } catch (err) {
          console.error(err);
          sendResponse(paths);
        }
      }
      break;
    case 'getCurrNew':
      const currPath = message.path;
      const NEWS = new News(
        'https://github.com/FengShangWuQi/Daily-Front-End-News',
        `https://raw.githubusercontent.com/FengShangWuQi/Front-End-News/master/history/${currPath}/README.md`
      );

      sendResponse(await NEWS.getCurrNew(currPath));
      break;
    default:
      sendResponse(false);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true;
});
