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
      <li class="news__product-item">
          <a href="detail.html?detail=${product.id}" class="news__product-image">
            <img
              src=${product.images[0]}
              alt=""
              class="news__product-img" />
          </a>
          <a href="detail.html?detail=${product.id}" class="news__product-info">
            <h5>${product.title}</h5>
            <p class="news__product-price">
              <del>${priceFormat}</del>
              <strong>${newPriceFormat}</strong>
            </p>
          </a>
      </li>
      `;
  });
  document.querySelector(".news__product-list").innerHTML = html.join("");
};
renderProductList();

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
