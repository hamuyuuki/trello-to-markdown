'use strict';

chrome.browserAction.onClicked.addListener(tab => {
  var jsonUrl = /(https:\/\/trello.com\/b\/.*)\/.*/.exec(tab.url)[1] + '.json';

  var xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function() {
    if ( xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      var text = MarkdownBuilder.build(xmlHttp.responseText);

      var textArea = document.createElement('textarea');
      textArea.style.cssText = 'position:absolute;left:-100%';
      document.body.appendChild(textArea);
      textArea.value = text;
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      alert("クリップボードにコピーされました！！！");
    }
  }

  xmlHttp.open('GET', jsonUrl, true);
  xmlHttp.send();
});

class MarkdownBuilder {
  static build(jsonData) {
    var board = BoardBuilder.build(jsonData);

    var markdownText = '## ' + board.name + '\n';
    ['Todo', 'Doing', 'Done'].forEach(listName => {
      markdownText += '\n### ' + listName + '\n\n';
      board.lists
           .find(list => list.name == listName)
           .cards
           .filter(card => !card.closed)
           .forEach(card => markdownText += '- ' + card.name + '\n');
    });

    return markdownText;
  }
}

class BoardBuilder {
  static build(jsonData) {
    var data = JSON.parse(jsonData);

    var lists = data.lists.map(list => {
      var filter_cards = data.cards.filter(card => card.idList == list.id);
      var cards = filter_cards.map(card => {
        var attachments = card.attachments.map(attachment => {
          return new Attachment(attachment.name, attachment.url);
        });
        return new Card(card.name, attachments, card.closed);
      });
      return new List(list.name, cards);
    });

    return new Board(data.name, lists);
  }
}

class Board {
  constructor(name, lists) {
    this.name = name;
    this.lists = lists;
  }
}

class Card {
  constructor(name, attachments, closed) {
    this.name = name;
    this.attachments = attachments;
    this.closed = closed;
  }
}

class Attachment {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
}

class List {
  constructor(name, cards) {
    this.name = name;
    this.cards = cards;
  }
}
