import categories from "./data/categories.js";
import productList from "./data/products.js";
import blogList from "./data/blogs.js";
import reviews from "./data/reviews.js";

let swiperSlider = new Swiper(".mySlider", {
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
  swiperSlider.slideNext();
}

let autoBannerSlideInterval;

function startBannerAutoSlide() {
  autoBannerSlideInterval = setInterval(autoBannerSlide, 3000);
}

function stopBannerAutoSlide() {
  clearInterval(autoBannerSlideInterval);
}

swiperSlider.el.addEventListener("mouseenter", stopBannerAutoSlide);
swiperSlider.el.addEventListener("mouseleave", startBannerAutoSlide);

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
    <a href='shop.html?category=${category.id}' class="swiper-slide">
    <div class="swiper__category">
      <div class="swiper__category-image">
        <img src=${category.thumbnail} alt="" />
      </div>
      <div class="swiper__category-info">
        <h3>${category.name}</h3>
        <p>${category.total} sản phẩm</p>
      </div>
    </div>
  </a>
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
          <a href="detail.html?&detail=${
            product.id
          }" class="outstanding__image">
            <img src=${product.images[0]} alt="" />
          </a>
          <div class="outstanding__info">
            <a href="detail.html?detail=${
              product.id
            }" class="outstanding__title">${product.title}</a>
            <div class="outstanding__price">
              <del class="outstanding__original-price">${priceFormat}</del>
              <strong class="outstanding__discounted-price"
                >${newPriceFormat}</strong
              >
            </div>
            <a href="detail.html?&detail=${
              product.id
            }" class="outstanding__details">xem chi tiết</a>
          </div>
        </div>
      </article>
      `;
  });
  document.querySelector(".outstanding__products").innerHTML = html.join("");
};

renderProductList("new");

const btnsSwiperBanner = document.querySelectorAll(
  ".swiper__banner-content button"
);
btnsSwiperBanner.forEach((btn) => {
  btn.addEventListener("click", () => {
    location.href = `shop.html`;
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
    location.href = `news.html`;
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
  console.log(scrollY);

  if (scrollY > 900) {
    myCategory.classList.add("myCategory--open");
  }

  if (scrollY > 1800) {
    outstandingProducts.forEach((product) => {
      product.classList.add("products--open");
    });
  }

  if (scrollY > 3400) {
    myBlogs.classList.add("myBlogs--open");
  }

  if (scrollY > 4100) {
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

const renderMarquee = () => {
  let html = "";
  for (let i = 0; i < 100; i++) {
    html += `<em> SIÊU PHẨM
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 sparkles-icon">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </em>
    `;
  }
  document.querySelector(".marquee__item").innerHTML = html;
};

renderMarquee();
