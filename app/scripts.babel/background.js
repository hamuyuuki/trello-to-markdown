'use strict';

chrome.browserAction.onClicked.addListener(tab => {
  var jsonUrl = /(https:\/\/trello.com\/b\/.*)\/.*/.exec(tab.url)[1] + '.json';

  var xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function() {
    if ( xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      var text = MarkdownBuilder.build(xmlHttp.responseText);
      alert(text);
    }
  }

  xmlHttp.open('GET', jsonUrl, true);
  xmlHttp.send();
});

class MarkdownBuilder {
  static build(jsonData) {
    var data = JSON.parse(jsonData);

    var todoList = data.lists.find(list => list.name == 'Todo');
    var doingList = data.lists.find(list => list.name == 'Doing');
    var doneList = data.lists.find(list => list.name == 'Done');

    var todoCards = data.cards.filter(card => card.idList == todoList.id && card.closed == false);
    var doingCards = data.cards.filter(card => card.idList == doingList.id && card.closed == false);
    var doneCards = data.cards.filter(card => card.idList == doneList.id && card.closed == false);

    var markdownText = '';
    markdownText += '\n### Todo\n\n';
    todoCards.forEach(card => markdownText += '- ' + card.name + '\n');
    markdownText += '\n### Doing\n\n';
    doingCards.forEach(card => markdownText += '- ' + card.name + '\n');
    markdownText += '\n### Done\n\n';
    doneCards.forEach(card => markdownText += '- ' + card.name + '\n');
    return markdownText;
  }
}

// 今後は以下のクラスを使う
// class BoardBuilder {
//   static build(jsonData) {
//   }
// }
//
// class Board {
//   constructor(name, lists) {
//     this.name = name;
//     this.lists = lists;
//   }
// }
//
// class Card {
//   constructor(name, checkLists, attachments) {
//     this.name = name;
//     this.checkLists = checkLists;
//     this.attachments = attachments;
//   }
// }
//
// class CheckItem {
//   constructor(name, isCheck) {
//     this.name = name;
//     this.isCheck = isCheck;
//   }
// }
//
// class Attachment {
//   constructor(name, url) {
//     this.name = name;
//     this.url = url;
//   }
// }
//
// class CheckList {
//   constructor(name, checkItems) {
//     this.name = name;
//     this.checkItems = checkItems;
//   }
// }
//
// class List {
//   constructor(name, cards) {
//     this.name = name;
//     this.cards = cards;
//   }
// }
