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
          const lastDay = days[days.length - 1];
          const year = currDate.slice(0, 2);
          const month = currDate.slice(3, 5);
          const day = currDate.slice(-2);

          if (days.includes(day) && month === lastMonth && year === lastYear) {
            paths.push(`${lastYear}/${lastMonth}/${day}`);
          } else {
            if (paths.length === 0 || paths[paths.length - 1] !== lastDay) {
              paths.push(`${lastYear}/${lastMonth}/${lastDay}`);
            }
          }

          const newPaths = paths.length > 3 ? paths.slice(1) : paths;

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
