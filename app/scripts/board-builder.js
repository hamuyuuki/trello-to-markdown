import Attachment from './attachment';
import Card from './card';
import List from './list';
import Board from './board';

export default class BoardBuilder {
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
