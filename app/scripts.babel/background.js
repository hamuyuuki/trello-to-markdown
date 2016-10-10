'use strict';

chrome.browserAction.onClicked.addListener(tab => {
  var jsonUrl = /(https:\/\/trello.com\/b\/.*)\/.*/.exec(tab.url)[1] + '.json';

  var xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function() {
    if ( xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      var board = BoardBuilder.build(xmlHttp.responseText);
      console.log(baord);
    }
  }

  xmlHttp.open('GET', jsonUrl, true);
  xmlHttp.send();
});
