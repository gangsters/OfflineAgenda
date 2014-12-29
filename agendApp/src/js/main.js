chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('src/html/index.html',
    {width: 500, height: 309});
});