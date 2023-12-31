import categories from "./data/categories.js";
import productList from "./data/products.js";
import blogList from "./data/blogs.js";
import reviews from "./data/reviews.js";

let swiperBanner = new Swiper(".myBanner", {
  slidesPerView: 1,
  loop: true,
  speed: 1000,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

function autoBannerSlide() {
  swiperBanner.slideNext();
}

let autoBannerSlideInterval;

function startBannerAutoSlide() {
  autoBannerSlideInterval = setInterval(autoBannerSlide, 3000);
}

function stopBannerAutoSlide() {
  clearInterval(autoBannerSlideInterval);
}

swiperBanner.el.addEventListener("mouseenter", stopBannerAutoSlide);
swiperBanner.el.addEventListener("mouseleave", startBannerAutoSlide);

startBannerAutoSlide();

let swiperCategory = new Swiper(".myCategory", {
  slidesPerView: 4,
  spaceBetween: 30,
  slidesPerGroup: 4,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      slidesPerGroup: 1,
    },
    768: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 30,
    },
  },
});

function autoCategorySlide() {
  swiperCategory.slideNext(2000);
}

let autoCategorySlideInterval;

function startCategoryAutoSlide() {
  autoCategorySlideInterval = setInterval(autoCategorySlide, 3000);
}

function stopCategoryAutoSlide() {
  clearInterval(autoCategorySlideInterval);
}

swiperCategory.el.addEventListener("mouseenter", stopCategoryAutoSlide);
swiperCategory.el.addEventListener("mouseleave", startCategoryAutoSlide);

setTimeout(startCategoryAutoSlide, 3000);

let swiperBlogs = new Swiper(".myBlogs", {
  slidesPerView: 3,
  spaceBetween: 30,
  slidesPerGroup: 1,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

function autoBlogsSlide() {
  swiperBlogs.slideNext();
}

let autoBlogsSlideInterval;

function startBlogsAutoSlide() {
  autoBlogsSlideInterval = setInterval(autoBlogsSlide, 3000);
}

function stopBlogsAutoSlide() {
  clearInterval(autoBlogsSlideInterval);
}

swiperBlogs.el.addEventListener("mouseenter", stopBlogsAutoSlide);
swiperBlogs.el.addEventListener("mouseleave", startBlogsAutoSlide);

startBlogsAutoSlide();

const renderCategories = () => {
  let html = "";
  html = categories.map((category, index) => {
    return `
    <article class="swiper-slide">
    <div class="swiper__category">
      <div class="swiper__category-image">
        <img src=${category.thumbnail} alt="" />
      </div>
      <div class="swiper__category-info">
        <h3>${category.name}</h3>
        <p>${category.total} sản phẩm</p>
      </div>
    </div>
  </article>
    `;
  });
  document.querySelector(".myCategory .swiper-wrapper").innerHTML =
    html.join("");
};

renderCategories();

const renderProductList = (value, firstRender = true) => {
  const filterProduct = productList.filter((product) => {
    return product.tags.some((tag) => tag === value);
  });

  const productsLimit = filterProduct.slice(0, 10);
  let html = "";
  html = productsLimit.map((product, index) => {
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
      <article class="outstanding__product ${
        firstRender ? "" : "products--open"
      }"  data-detail=${product.id}> 
        <div class="outstanding__discount">-${product.discount}%</div>
        <div class="outstanding__details">
          <a href="javascript:void(0);" class="outstanding__image">
            <img src=${product.images[0]} alt="" />
          </a>
          <div class="outstanding__info">
            <h2 class="outstanding__title">${product.title}</h2>
            <div class="outstanding__price">
              <del class="outstanding__original-price">${priceFormat}</del>
              <strong class="outstanding__discounted-price"
                >${newPriceFormat}</strong
              >
            </div>
            <button class="outstanding__details">xem chi tiết</button>
          </div>
        </div>
      </article>
      `;
  });
  document.querySelector(".outstanding__products").innerHTML = html.join("");
};

renderProductList("popular");

let queryString = window.location.search;
let urlParam = new URLSearchParams(queryString);
let paramsId = urlParam.get("id");

const products = document.querySelectorAll("article.outstanding__product");
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

const btnsSwiperBanner = document.querySelectorAll(
  ".swiper__banner-content button"
);
btnsSwiperBanner.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (paramsId) {
      location.href = `shop.html?id=${paramsId}`;
    } else {
      location.href = `shop.html`;
    }
  });
});

const renderBlogList = () => {
  let html = "";
  html = blogList.map((blog, index) => {
    return `
      <article class="swiper-slide blog">
        <a href="#" class="swiper-blog">
          <div class="blog__image">
            <img src=${blog.image} alt="" />
          </div>
          <div class="blog__content">
            <h5>
              ${blog.title}
            </h5>
            <p>
              ${blog.description}
            </p>
            <div class="blog__read-more">
              <a href="#">
                Đọc thêm <i class="fa-solid fa-play"></i>
              </a>
            </div>
          </div>
        </a>
      </article>
    `;
  });
  document.querySelector(".myBlogs .swiper-wrapper").innerHTML = html.join("");
};

renderBlogList();

const allBlogs = document.querySelectorAll("article.swiper-slide.blog");
allBlogs.forEach((blog) => {
  blog.addEventListener("click", () => {
    if (paramsId) {
      location.href = `news.html?id=${paramsId}`;
    } else {
      location.href = `news.html`;
    }
  });
});

const renderReviewList = () => {
  let html = "";
  html = reviews.map((user, index) => {
    return `
      <article class="feedback__item">
      <div class="feedback__avatar">
        <img src=${user.avatar} alt="" />
      </div>
      <div class="feedback__rating">
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
      </div>
      <p class="feedback__comment">
        ${user.comment}
      </p>
      <div class="feedback__author">
        <h3 class="feedback__author-name">${user.name}</h3>
        <span>/</span>
        <p class="feedback__author-role">${user.role}</p>
      </div>
    </article>
    `;
  });
  document.querySelector(".feedback__container").innerHTML = html.join("");
};

renderReviewList();

const myCategory = document.querySelector(".myCategory");
const myBlogs = document.querySelector(".myBlogs");
const outstandingProducts = document.querySelectorAll(".outstanding__product");
const feedbacks = document.querySelectorAll(".feedback__item");

outstandingProducts.forEach((product, index) => {
  product.style.cssText = `--i:${index + 1}`;
});

feedbacks.forEach((feedback, index) => {
  feedback.style.cssText = `--i:${index + 1}`;
});

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (scrollY > 344) {
    myCategory.classList.add("myCategory--open");
  }

  if (scrollY > 752) {
    outstandingProducts.forEach((product) => {
      product.classList.add("products--open");
    });
  }

  if (scrollY > 1700) {
    myBlogs.classList.add("myBlogs--open");
  }

  if (scrollY > 2230) {
    feedbacks.forEach((feedback) => {
      feedback.classList.add("feedback--open");
    });
  }
});

const outstandingInput = document.querySelectorAll("input[name='outstanding']");
outstandingInput.forEach((input) => {
  input.addEventListener("click", () => {
    if (input.checked) {
      renderProductList(input.value, false);
    }
  });
});
