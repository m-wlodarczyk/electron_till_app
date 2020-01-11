export default class ShoppingCart {
  constructor() {
    this.prodList = {};
    this.total = 0;
    this.distinct_items = 0;
  }

  calcTotal() {
    Object.keys(this.prodList).forEach(key => {
      this.total =
        this.total + this.prodList[key].quantity * this.prodList[key].price;
    });
  }

  addItem = () => {};

  updateCart = () => {
    product = product.split(" ");

    if (product[0] in this.prodList) {
      this.prodList[product[0]].quantity += parseInt(product[1], 10);
      updateItem(product[0]);
    } else {
      this.prodList[product[0]] = {
        quantity: 1,
        price: parseFloat(product[2]),
        index: counter
      };
      addItem(product[0]);
    }
  };
}
