import BoardBuilder from './board-builder';

export default class MarkdownBuilder {
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
