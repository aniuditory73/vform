export const quantityDiscounts = [
  { minimum: 21, percent: 20 },
  { minimum: 10, percent: 15 },
  { minimum: 5, percent: 10 },
  { minimum: 2, percent: 5 },
];

export const garments = [
  { id: "tee", label: "Футболка", price: 1000 },
  { id: "hoodie", label: "Худи", price: 2000 },
  { id: "longsleeve", label: "Лонгслив", price: 1500 },
  { id: "tote", label: "Шоппер", price: 1000 },
];

export const printSizes = [
  { id: "a5", label: "До А5", price: 300 },
  { id: "a4", label: "До А4", price: 500 },
  { id: "a3", label: "До А3", price: 750 },
  { id: "larger", label: "Больше А3", price: 1000, minimum: true },
];

export const deliveries = [
  { id: "pickup", label: "Самовывоз", price: 0 },
  { id: "moscow", label: "Доставка по Москве", price: 300 },
  { id: "ozon", label: "OZON Доставка", price: 300 },
  { id: "cdek", label: "СДЭК", price: 200 },
  { id: "avito", label: "Авито Доставка", price: null },
];
