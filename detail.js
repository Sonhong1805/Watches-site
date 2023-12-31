import productList from "./data/products.js";
import categories from "./data/categories.js";

let queryString = window.location.search;
let urlParam = new URLSearchParams(queryString);
let paramsId = urlParam.get("id");

if (paramsId) {
  new Swiper(".myDetail", {
    slidesPerView: 1,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  let swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    loop: true,
    spaceBetween: 10,
    freeMode: true,
    watchSlidesProgress: true,
  });

  let swiper2 = new Swiper(".mySwiper2", {
    slidesPerView: 1,
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      swiper: swiper,
    },
  });

  let swiperModal = new Swiper(".myModal", {
    zoom: true,
    loop: true,
    slidesPerView: "auto",
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  swiper2.on("slideChangeTransitionStart", function () {
    let activeIndex = swiper2.activeIndex;
    if (activeIndex === 0) {
      swiperModal.slideTo(0);
    } else {
      swiperModal.slideTo(activeIndex);
    }
  });

  const images = document.querySelectorAll(".mySwiper2 .swiper-slide img");
  const modal = document.querySelector("section.modal");
  const btnOpenModal = document.querySelector(".detail__icon-zoom");
  const btnCloseModal = document.querySelector(".btn-closeModal");

  images.forEach((image) => {
    image.addEventListener("click", () => {
      modal.classList.add("modal--open");
    });
  });

  btnOpenModal.addEventListener("click", () => {
    modal.classList.add("modal--open");
  });

  btnCloseModal.addEventListener("click", () => {
    modal.classList.remove("modal--open");
  });

  let paramsDetail = urlParam.get("detail");

  const {
    title,
    price,
    discount,
    categoryId,
    color: colorList,
    images: imageList,
  } = productList.find((product) => product.id === paramsDetail);

  document.querySelector(".detail__discount").innerHTML = "-" + discount + "%";

  const allProductName = document.querySelectorAll(".productName");
  allProductName.forEach((product) => {
    product.textContent = title;
  });

  const findCategory = categories.find(
    (category) => category.id === categoryId
  );
  const allCategoryName = document.querySelectorAll(".categoryName");
  allCategoryName.forEach((category) => {
    category.innerHTML = findCategory.name;
  });

  const priceFormat = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

  const newPrice = price - (price * discount) / 100;
  document.querySelector(".detail__price del").innerHTML = priceFormat;

  const newPriceFormat = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(newPrice);
  document.querySelector(".detail__price strong").innerHTML = newPriceFormat;

  let renderColor = "";
  renderColor = colorList
    .map((color, index) => {
      return `
    <div class="detail__color-input">
      <input type="radio" name="color" id="color${index}" value="${color}" />
      <label for="color${index}">${color}</label>
    </div>
  `;
    })
    .join("");

  document.querySelector(".detail__color-group").innerHTML = renderColor;

  let renderImages = "";
  renderImages = imageList
    .map((image) => {
      return `
    <div class="swiper-slide">
      <img src=${image} />
    </div>
  `;
    })
    .join("");
  document.querySelector(".image__swiper").innerHTML = renderImages;
  document.querySelector(".thumbs__swiper").innerHTML = renderImages;

  let modalImages = "";
  modalImages = imageList
    .map((image) => {
      return `
    <div class="swiper-slide">
      <div class="swiper-zoom-container">
        <img src=${image} />
      </div>
    </div>
  `;
    })
    .join("");
  document.querySelector(".modal__images").innerHTML = modalImages;

  const quantityMinus = document.querySelector("button.quantity-minus");
  quantityMinus.addEventListener("click", () => {
    const input = document.querySelector(".detail__quantity-input input");
    if (input.value <= 1) {
      input.value = 1;
    } else {
      --input.value;
    }
  });
  const quantityPlus = document.querySelector("button.quantity-plus");
  quantityPlus.addEventListener("click", () => {
    const input = document.querySelector(".detail__quantity-input input");
    if (isNaN(input.value)) {
      input.value = 1;
    } else {
      ++input.value;
    }
  });

  const btnAddToCart = document.querySelector("button.cart-buttons__add");
  let userStorage = JSON.parse(localStorage.getItem("userStorage")) ?? [];

  const handleAddToCart = (isChecked) => {
    const currentUser = userStorage.find((user) => user.id === +paramsId);
    const currentUserCart = currentUser.cart ?? [];

    const product = productList.find((product) => product.id === paramsDetail);
    const priceProduct =
      product.price - (product.price * product.discount) / 100;
    const input = document.querySelector(".detail__quantity-input input");

    const productInfo = {
      id: product.id,
      name: product.title,
      price: priceProduct,
      thumbnail: product.images[0],
      checked: isChecked,
    };

    const colorChecked = document.querySelector("input[name='color']:checked");
    try {
      const isCheckedColor = currentUserCart.some(
        (product) => product.color === colorChecked.value
      );
      if (isCheckedColor) {
        const isCheckedId = currentUserCart.some(
          (product) => product.id === productInfo.id
        );
        if (isCheckedId) {
          currentUserCart.map((product) => {
            if (
              product.id === productInfo.id &&
              product.color === colorChecked.value
            ) {
              return {
                ...product,
                quantity: (product.quantity += +input.value),
              };
            } else {
              return product;
            }
          });
        }
      } else {
        currentUserCart.unshift({
          ...productInfo,
          quantity: +input.value,
          color: colorChecked.value,
        });
      }
      alert("Thêm vào giỏ hàng thành công !");
    } catch (error) {
      alert("Vui lòng chọn màu sắc !");
    }

    userStorage = userStorage.map((user) => {
      if (user.id === +paramsId) {
        return { ...user, cart: currentUserCart };
      } else {
        return user;
      }
    });
    localStorage.setItem("userStorage", JSON.stringify(userStorage));

    const counter = document.querySelector(".header__bottom-counter");
    if (currentUser.cart) {
      const totalQuantity = currentUser.cart.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.quantity;
        },
        0
      );
      counter.textContent = totalQuantity;
    }
  };

  btnAddToCart.addEventListener("click", () => handleAddToCart(false));

  const btnBuyNow = document.querySelector("button.cart-buttons__buy-now");
  btnBuyNow.addEventListener("click", () => {
    handleAddToCart(true);

    const url = new URL("cart.html", window.location.origin);
    const params = new URLSearchParams(url.search);

    if (paramsId) {
      params.set("id", paramsId);
    }

    url.search = params.toString();

    window.location.href = url.href;
  });

  const findProductId = productList.find(
    (product) => product.id === paramsDetail
  );

  const findRelatedProducts = productList.filter(
    (product) => product.categoryId === findProductId.categoryId
  );

  const renderRelatedProducts = (findRelatedProducts) => {
    let html = "";
    html = findRelatedProducts
      .map((product) => {
        const priceFormat = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(product.price);

        const newPrice =
          product.price - (product.price * product.discount) / 100;
        const newPriceFormat = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(newPrice);
        return `
      <article class="detail__product-item" data-detail=${product.id}>
        <div class="detail__discount related-discount">-${product.discount}%</div>
        <div class="detail__product-image">
          <img src=${product.images[0]} alt="" />
        </div>
        <div class="detail__product-info">
          <h4>${product.title}</h4>
          <p class="detail__product-price">
            <del class="detail__product-old-price">${priceFormat}</del>
            <strong class="detail__product-new-price">${newPriceFormat}</strong>
          </p>
          <button class="detail__product-btn-detail">xem chi tiết</button>
        </div>
    </article>
    `;
      })
      .join("");
    document.querySelector(".detail__products-list").innerHTML = html;
  };

  renderRelatedProducts(findRelatedProducts);

  const products = document.querySelectorAll("article.detail__product-item");
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
} else {
  location.href = "login.html";
}
