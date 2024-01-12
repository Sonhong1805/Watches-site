import categories from "./data/categories.js";
import blogList from "./data/blogs.js";
import productList from "./data/products.js";

const sidebar = document.querySelector(".shop__sidebar");
const openSidebar = document.querySelector(".shop-bars");
const closeSidebar = document.querySelector(".btn__sidebar");

openSidebar.addEventListener("click", () => {
  sidebar.classList.add("sidebar--open");
});

closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("sidebar--open");
});

const overlay = document.querySelector(".shop__sidebar-overlay");
overlay.addEventListener("click", (e) => {
  const overlayVisibility = getComputedStyle(overlay).visibility;
  if (overlayVisibility === "visible") {
    sidebar.classList.remove("sidebar--open");
  }
});
const renderCategories = () => {
  let html = "";
  html = categories.map((category, index) => {
    return `
        <li class="shop__category-item">
          <input type="checkbox" id=${category.name} name="category" data-id=${category.id} />
          <label for=${category.name}>${category.name}</label>
        </li>
    `;
  });
  document.querySelector(".shop__category-list").innerHTML = html.join("");
};

renderCategories();

const renderBlogList = () => {
  let html = "";
  html = blogList.map((blog, index) => {
    return `
      <li class="shop__blogs-item">
        <a href="#" class="shop__blogs-link">
          <div class="shop__blogs-image">
            <img
              src=${blog.image}
              alt=""
              class="shop__blogs-img" />
          </div>
          <p class="shop__blogs-description">
            ${blog.title}
          </p>
        </a>
      </li>
    `;
  });
  document.querySelector(".shop__blogs-list").innerHTML = html.join("");
};

renderBlogList();

let currentPage = 1;
const itemsPerPage = 12;
const totalItems = productList.length;

const renderProductList = (arr) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleProducts = arr.slice(startIndex, endIndex);

  const html = visibleProducts.map((product) => {
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
      <article class="product" data-detail=${product.id}>
        <div class="product__discount">-${product.discount}%</div>
        <a href="detail.html?detail=${product.id}" class="product__image">
          <img src="${product.images[0]}" alt="" />
        </a>
        <div class="product__info">
          <a href="detail.html?&detail=${product.id}" class="product__title">${product.title}</a>
          <div class="product__price">
            <del class="product__original-price">${priceFormat}</del>
            <strong class="product__current-price">${newPriceFormat}</strong>
          </div>
          <a href="detail.html?&detail=${product.id}" class="product__details-button"">Xem chi tiết</a>
        </div>
      </article>
    `;
  });

  document.querySelector(".shop__products").innerHTML = html.join("");
  listPages(arr);
};

const prevPage = () => {
  if (currentPage > 1) {
    currentPage--;
    renderProductList(productList);
  }
};

const nextPage = () => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderProductList(productList);
  }
};

const listPages = (arr) => {
  const filteredTotalItems = arr.length;

  const totalPages = Math.ceil(filteredTotalItems / itemsPerPage);

  const paginationList = document.querySelector(".pagination__list");
  paginationList.innerHTML = "";

  if (totalPages > 1) {
    const prevBtn = document.createElement("li");
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prevBtn.addEventListener("click", prevPage);
    if (currentPage > 1) {
      paginationList.appendChild(prevBtn);
    }

    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("li");
      pageItem.innerText = i;
      pageItem.addEventListener("click", () => changePage(i));
      if (i === currentPage) {
        pageItem.classList.add("active");
      }
      paginationList.appendChild(pageItem);
    }

    const nextBtn = document.createElement("li");
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    nextBtn.addEventListener("click", nextPage);
    if (currentPage < totalPages) {
      paginationList.appendChild(nextBtn);
    }
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= Math.ceil(totalItems / itemsPerPage)) {
    currentPage = page;
    renderProductList(productList);
  }
};

renderProductList(productList);
const applyFilters = () => {
  const fitInputs = document.querySelectorAll('input[name="fit"]');
  const categoryInputs = document.querySelectorAll(
    "input[name='category']:checked"
  );

  const selectedFit = [...fitInputs]
    .filter((input) => input.checked)
    .map((input) => input.id);

  const selectedCategory = [...categoryInputs].map((input) => input.dataset.id);

  let filteredProducts = productList.filter((product) => {
    const isFit =
      selectedFit.includes("all") ||
      selectedFit.some((fit) => product.tags.includes(fit));
    const isCategory =
      selectedCategory.length === 0 ||
      selectedCategory.includes(product.categoryId);
    return isFit && isCategory;
  });
  currentPage = 1;
  renderProductList(filteredProducts);
};

const fitInputs = document.querySelectorAll('input[name="fit"]');
fitInputs.forEach((input) => {
  input.addEventListener("change", applyFilters);
});

const categoryInputs = document.querySelectorAll("input[name='category']");
categoryInputs.forEach((input) => {
  input.addEventListener("change", applyFilters);
});

const rangeInput = document.querySelectorAll(".range-input input"),
  priceInput = document.querySelectorAll(".price-input input"),
  range = document.querySelector(".slider .progress");
let priceGap = 1000;

priceInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minPrice = parseInt(priceInput[0].value),
      maxPrice = parseInt(priceInput[1].value);

    if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
      if (e.target.className === "input-min") {
        rangeInput[0].value = minPrice;
        range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
      } else {
        rangeInput[1].value = maxPrice;
        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
      }
    }
  });
});

rangeInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    let minVal = parseInt(rangeInput[0].value),
      maxVal = parseInt(rangeInput[1].value);

    if (maxVal - minVal < priceGap) {
      if (e.target.className === "range-min") {
        rangeInput[0].value = maxVal - priceGap;
      } else {
        rangeInput[1].value = minVal + priceGap;
      }
    } else {
      priceInput[0].value = minVal;
      priceInput[1].value = maxVal;
      range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
      range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
    }
  });
});

const btnFilterPrice = document.querySelector(".filter-button button");
btnFilterPrice.addEventListener("click", () => {
  const inputAll = document.getElementById("all");
  inputAll.checked = true;
  const inputMin = document.querySelector(".input-min");
  const inputMax = document.querySelector(".input-max");
  let newArr = [];
  newArr = productList.filter((product) => {
    const newPrice = product.price - (product.price * product.discount) / 100;
    return newPrice >= inputMin.value && newPrice <= inputMax.value;
  });
  currentPage = 1;
  renderProductList(newArr);
});

const selectedSort = document.querySelector(".shop__results-select");
selectedSort.addEventListener("change", (e) => {
  const sortBy = e.target.value;
  const inputAll = document.getElementById("all");
  inputAll.checked = true;

  let sortedProducts = [...productList];
  switch (sortBy) {
    case "price-desc":
      sortedProducts.sort((a, b) => {
        const priceA = a.price - (a.price * a.discount) / 100;
        const priceB = b.price - (b.price * b.discount) / 100;
        return priceA - priceB;
      });
      break;
    case "price-asc":
      sortedProducts.sort((a, b) => {
        const priceA = a.price - (a.price * a.discount) / 100;
        const priceB = b.price - (b.price * b.discount) / 100;
        return priceB - priceA;
      });
      break;
    case "products-popular":
      sortedProducts = productList.filter((product) =>
        product.tags.includes("popular")
      );
      break;
    case "products-promotion":
      sortedProducts = productList.filter((product) =>
        product.tags.includes("promotion")
      );
      break;
    case "products-new":
      sortedProducts = productList.filter((product) =>
        product.tags.includes("new")
      );
      break;
    default:
      break;
  }
  currentPage = 1;
  renderProductList(sortedProducts);
});

let queryString = window.location.search;
let urlParam = new URLSearchParams(queryString);

let paramsTag = urlParam.get("tag");
if (paramsTag) {
  document.querySelector("input[id=" + paramsTag + "]").checked = true;
  let newArr = productList.filter((item) => {
    return item.tags.some((tag) => tag === paramsTag);
  });
  renderProductList(newArr);
}

let paramsCategory = urlParam.get("category");
if (paramsCategory) {
  document.querySelector(`input[data-id="${paramsCategory}"]`).checked = true;
  let newArr = productList.filter((item) => {
    return item.categoryId === paramsCategory;
  });
  renderProductList(newArr);
}

let paramsName = urlParam.get("name");

if (paramsName) {
  document.querySelector(".header__bottom-search input").value = paramsName;
  const searchArr = productList.filter((product) =>
    product.title.toLowerCase().includes(paramsName.toLowerCase())
  );
  renderProductList(searchArr);
} else if (paramsName === "") {
  location.href = "shop.html";
}
