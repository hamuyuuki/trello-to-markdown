'use strict';

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

class MarkdownBuilder {
  static build(jsonData) {
    let board = BoardBuilder.build(jsonData);

    let markdownText = '## ' + board.name + '\n';
    ['ToDo', 'Todo', 'Doing', 'Done'].forEach(listName => {
      let lists = board.lists.find(list => list.name == listName)
      if (lists == undefined) return;
      markdownText += '\n### ' + listName + '\n\n';
      lists.cards
           .filter(card => !card.closed)
           .forEach(card => markdownText += '- ' + card.name + '\n');
    });

    return markdownText;
  }
}

class BoardBuilder {
  static build(jsonData) {
    let data = JSON.parse(jsonData);

    let lists = data.lists.map(list => {
      let filter_cards = data.cards.filter(card => card.idList == list.id);
      let cards = filter_cards.map(card => {
        let attachments = card.attachments.map(attachment => {
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
