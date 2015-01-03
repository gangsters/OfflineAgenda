chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('src/html/index.html',
    {width: 800, height: 600});
});