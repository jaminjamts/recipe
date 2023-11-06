import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }

  deleteItem(id) {
    // id gedeg Id-tei indexiig massives haij olno
    const index = this.items.findIndex((el) => el.id === id);
    // ug index deerh elementiig massives ustgana
    this.items.splice(index, 1);
  }
  addItem(item) {
    let newItem = {
      id: uniqid(),
      item,
    };

    this.items.push(newItem);
    return newItem;
  }
}
