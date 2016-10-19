'use strict';

import MarkdownBuilder from './markdown-builder';

chrome.browserAction.onClicked.addListener(tab => {
  let jsonUrl = /(https:\/\/trello.com\/b\/.*)\/.*/.exec(tab.url)[1] + '.json';

  let xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function() {
    if ( xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      let text = MarkdownBuilder.build(xmlHttp.responseText);

      let textArea = document.createElement('textarea');
      textArea.style.cssText = 'position:absolute;left:-100%';
      document.body.appendChild(textArea);
      textArea.value = text;
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      new Notification(chrome.i18n.getMessage('appName'), {
        body: chrome.i18n.getMessage('succeeded'), icon: '../images/icon-128.png'
      });
    }
  }

  xmlHttp.open('GET', jsonUrl, true);
  xmlHttp.send();
});
