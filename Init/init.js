
const product = require("../models/product");




const products = [
  {
    name: "Cappuccino Classic",
    description: "Strong and bold single shot of espresso with rich crema.",
    price: 120,
    image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990444/cafe1_n6js2y.jpg",
    avgRating: 4.6,
    category: "coffee"
  },
  {
    name: "Espresso Shot",
    description: "Smooth espresso blended with steamed milk and a thick milk foam layer.",
    price: 180,
    image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990440/cafe2_pa0lns.jpg",
    avgRating: 4.8,
    category: "coffee"
  },
  {
    name: "Cold Brew Coffee",
    description: "Chilled, slow-brewed coffee with a natural sweetness and less acidity.",
    price: 200,
    image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990445/cafe3_hskiui.jpg",
    avgRating: 4.5,
    category: "coffee"
  },
  {
  name: "Hazelnut Latte",
  description: "Creamy latte infused with nutty hazelnut flavor, topped with foam.",
  price: 220,
  image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990438/cafe4_twmdvf.jpg",
  avgRating: 4.7,
  category: "coffee"
},
{
  name: "Caramel Macchiato",
  description: "Layered espresso drink with milk, vanilla syrup, and caramel drizzle.",
  price: 240,
  image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990439/cafe5_gh5jut.jpg",
  avgRating: 4.7,
  category: "coffee"
}
,
  {
    name: "Mocha Delight",
    description: "A rich blend of espresso, and steamed milk topped with whipped cream.",
    price: 230,
    image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990447/cafe6_gcddta.jpg",
    avgRating: 4.8,
    category: "coffee"
  },
  {
    name: "Iced Americano",
    description: "Refreshing espresso-based drink with chilled water and ice cubes.",
    price: 160,
    image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990439/cafe7_sfcflw.jpg",
    avgRating: 4.3,
    category: "coffee"
  },
  {
    name: "Vanilla Cold Coffee",
    description: "Smooth cold coffee with a hint of vanilla, perfect for summer.",
    price: 190,
    image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990441/cafe8_fidgvc.jpg",
    avgRating: 4.6,
    category: "coffee"
  }, {
    name: "Orange Juice",
    description: "Refreshing orange juice packed with vitamin C.",
    price: 110,
    image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990443/cafe9_hz0gs8.jpg",
    category: "drink"
  },
  {
    name: "Virgin Mojito",
    description: "Minty lime mocktail served chilled with soda.",
    price: 180,
    image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990442/cafe10_dwwlbt.jpg",
    avgRating: 4.6,
    category: "drink"
  },
  {
    name: "Chocolate Shake",
    description: "Thick chocolate milkshake topped with whipped cream.",
    price: 160,
    image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990446/cafe11_nuaosl.jpg",
    avgRating: 4.5,
    category: "drink"
  },
  {
    name: "Strawberry Shake",
    description: "Creamy strawberry shake made with fresh strawberries.",
    price: 170,
    image: "https://res.cloudinary.com/dzcn4guhn/image/upload/v1782990444/cafe12_qh2nwx.jpg",
    avgRating: 4.6,
    category: "drink"
  }

];

  module.exports = { data: products };