class News {
  constructor(repository, url) {
    this.repository = repository;
    this.url = url;
  }

  static getNews() {
    return JSON.parse(localStorage.getItem('FEDN-content'));
  }

  static saveNews(news) {
    localStorage.setItem('FEDN-content', JSON.stringify(news));
  }

  static getPaths() {
    return JSON.parse(localStorage.getItem('FEDN-path'));
  }

  static savePaths(paths) {
    localStorage.setItem('FEDN-path', JSON.stringify(paths));
  }

  async getCurrNew(path) {
    const news = News.getNews() || [];
    let record = news.find(n => n.path === path);
    let curr = record && record.text;

    if (!curr) {
      try {
        const text = await fetch(this.url, {
          method: 'GET',
        }).then(res => res.text());

        curr = await GITHUB.getMarkdown(text);
        news.push({ path, text: curr });
        News.saveNews(news.length > 3 ? news.slice(1) : news);
      } catch (err) {
        console.error(err);
      }
    }

    return { repository: this.repository, path, text: curr };
  }
}
