import { formatCurrency } from "../scripts/utils/money.js";

export let products = [];

export function getProduct(productId) {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });
  return matchingProduct;
}

class Product {
  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return ``;
  }
}

class Clothing extends Product {
  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_blank">Size Chart</a>
    `;
  }
}

export function loadProductsFetch() {
  const promise = fetch("https://supersimplebackend.dev/products")
    .then((response) => {
      return response.json();
    })
    .then((productsData) => {
      try {
        products = productsData.map((productDetails) => {
          if (productDetails.type === "clothing") {
            return new Clothing(productDetails);
          }
          return new Product(productDetails);
        });
        console.log("Products loaded successfully");
      } catch (e) {
        console.error("Failed to parse products:", e);
      }
    });
  return promise;
}
// loadProductsFetch().then(() => {
//   console.log("next step");
// });

export function loadProducts(callback) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("load", () => {
    try {
      products = JSON.parse(xhr.response).map((productDetails) => {
        if (productDetails.type === "clothing") {
          return new Clothing(productDetails);
        }
        return new Product(productDetails);
      });
      console.log("Products loaded successfully");
      if (typeof callback === "function") {
        callback();
      }
    } catch (e) {
      console.error("Failed to parse products:", e);
    }
  });

  xhr.addEventListener("error", () => {
    console.error("Failed to load products");
  });

  xhr.open("GET", "https://supersimplebackend.dev/products");
  xhr.send();
}

// Example usage:
loadProducts(() => {
  console.log("Products are ready to be used", products);
});
