import Board from "./Board";

export default class BoardBuilder {
  static build(jsonData) {
    var data = JSON.parse(jsonData);

    // data.lists.forEach(list =>
    //   console.log(list.name);
    // );
    return new Board("name", [1,2,3]);
  }
}
