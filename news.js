import productList from "./data/products.js";
import blogList from "./data/blogs.js";

const renderProductList = () => {
  const productsLimit = productList.slice(0, 5);
  let html = "";
  html = productsLimit.map((product) => {
    const priceFormat = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(product.price);
    const newPrice = product.price - (product.price * product.discount) / 100;
    const newPriceFormat = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(newPrice);
    return `
      <li class="news__product-item" data-detail=${product.id}>
        <div class="news__product-image">
          <img
            src=${product.images[0]}
            alt=""
            class="news__product-img" />
        </div>
        <div class="news__product-info">
          <h5>${product.title}</h5>
          <p class="news__product-price">
            <del>${priceFormat}</del>
            <strong>${newPriceFormat}</strong>
          </p>
        </div>
      </li>
      `;
  });
  document.querySelector(".news__product-list").innerHTML = html.join("");
};
renderProductList();

let queryString = window.location.search;
let urlParam = new URLSearchParams(queryString);
let paramsId = urlParam.get("id");

const products = document.querySelectorAll("li.news__product-item");
products.forEach((product) => {
  product.addEventListener("click", () => {
    const detail = product.dataset.detail;
    nextToDetail(detail);
  });
});

const nextToDetail = (detail) => {
  const url = new URL("detail.html", window.location.origin);
  const params = new URLSearchParams(url.search);

  if (paramsId) {
    params.set("id", paramsId);
  }

  params.set("detail", detail);

  location.href = url.href;
  url.search = params.toString();

  window.location.href = url.href;
};

const renderBlogList = (arr) => {
  let html = "";
  html = arr.map((blog, index) => {
    return `
      <article class="blog__post">
        <div class="blog__date">
          <div class="blog__date-day">07</div>
          <div class="blog__date-month">Th7</div>
        </div>
        <div class="blog__image">
          <img src=${blog.image} alt="" />
        </div>
        <div class="blog__content">
          <h5>
            ${blog.title}
          </h5>
          <div class="blog__divider"></div>
          <p>
          ${blog.description}
          </p>
        </div>
      </article>
    `;
  });
  document.querySelector(".blog").innerHTML = html.join("");
};

renderBlogList(blogList);

const searchInput = document.querySelector(".news__search input");
searchInput.addEventListener("input", (e) => {
  const value = e.target.value;
  let searchArr = blogList.filter((blog) =>
    blog.title.toLowerCase().includes(value.toLowerCase())
  );
  renderBlogList(searchArr);
});
