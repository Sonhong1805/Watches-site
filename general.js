import categories from "./data/categories.js";

const userStorage = JSON.parse(localStorage.getItem("userStorage"));

const renderSubmenu = () => {
  let html = "";
  html = categories.map((category) => {
    return `
      <li class="navbar__sub-item">
        <a href="javascript:void(0)" class="navbar__sub-link" data-category=${category.id}>${category.name}</a>
      </li>
    `;
  });
  document.querySelector(".navbar__sub-list").innerHTML = html.join(" ");
};

renderSubmenu();

const renderSubmenuPopup = () => {
  let html = "";
  html = categories.map((category) => {
    return `
      <li><a href="javascript:void(0)" class="popup__submenu-item" data-category=${category.id}>${category.name}</a></li>
    `;
  });
  document.querySelector(".popup__submenu").innerHTML = html.join(" ");
};

renderSubmenuPopup();

const btnOpenBars = document.querySelector(".header__bars");
const btnCloseBars = document.querySelector(".btn-xmark");
const popup = document.querySelector(".popup");

btnOpenBars.addEventListener("click", () => {
  popup.classList.add("popup--open");
});

btnCloseBars.addEventListener("click", () => {
  popup.classList.remove("popup--open");
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("popup--open")) {
    popup.classList.remove("popup--open");
    btnCloseBars.classList.remove("xmark-open");
  }
});

const btnShowSubmenu = document.querySelectorAll(
  ".popup__menu-link-container i"
);
const submenu = document.querySelectorAll(".popup__submenu");

btnShowSubmenu.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    submenu[index].classList.toggle("submenu--open");
  });
});

const goTop = document.querySelector(".goTop");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  if (scrollY > 752) {
    goTop.classList.add("goTop--show");
  } else {
    goTop.classList.remove("goTop--show");
  }
});

let queryString = window.location.search;
let urlParam = new URLSearchParams(queryString);
let paramsId = urlParam.get("id");

if (paramsId) {
  const headerUserFirst = document.querySelector(".header__user");
  headerUserFirst.classList.remove("user--open");
  headerUserFirst.classList.add("user--close");

  const headerUserLast = document.querySelector(".header__user:last-child");
  headerUserLast.classList.remove("user--close");
  headerUserLast.classList.add("user--open");

  const popupUserLinksOpen = document.querySelectorAll(
    ".popup__menu-item.popup__item-open"
  );
  const popupUserLinksClose = document.querySelectorAll(
    ".popup__menu-item.popup__item-close"
  );

  popupUserLinksOpen.forEach((link) => {
    link.classList.remove("popup__item-open");
    link.classList.add("popup__item-close");
  });

  popupUserLinksClose.forEach((link) => {
    link.classList.remove("popup__item-close");
    link.classList.add("popup__item-open");
  });

  const { username } = userStorage.find((user) => user.id === +paramsId);
  if (username) {
    document.querySelector("#username").innerHTML = username;
    document.querySelector("#username-popup").innerHTML = username;
  }

  const userpage = document.querySelector(".userpage");
  const logo = document.querySelector(".header__bottom-logo");
  const cartPage = document.querySelector(".header__bottom-cart");

  const linksArr = [userpage, logo, cartPage];
  linksArr.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const newUrl = new URL(link.href);
      const newParams = new URLSearchParams(newUrl.search);

      newParams.set("id", paramsId);
      newUrl.search = newParams.toString();

      window.location.href = newUrl.href;
    });
  });

  const linksLogout = document.querySelectorAll(".log-out");
  linksLogout.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const newUrl = new URL(window.location.href);
      const newParams = new URLSearchParams(newUrl.search);

      newParams.delete("id");
      newUrl.search = newParams.toString();

      window.location.href = newUrl.href;
    });
  });
}

const navbarLinks = document.querySelectorAll(".navbar__link");
const popupLinks = document.querySelectorAll(".popup__menu-item:not(.log-out)");

const navLinksArr = [navbarLinks, popupLinks];
navLinksArr.forEach((navLink) => {
  navLink.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (paramsId) {
        const newUrl = new URL(link.href);
        const newParams = new URLSearchParams(newUrl.search);

        newParams.set("id", paramsId);
        newUrl.search = newParams.toString();

        window.location.href = newUrl.href;
      } else {
        window.location.href = link.href;
      }
    });
  });
});

const btnSearch = document.querySelector(".header__bottom-search i");
btnSearch.addEventListener("click", () => {
  const inputSearch = document.querySelector(".header__bottom-search input");
  const searchValue = inputSearch.value.trim();

  const url = new URL("shop.html", window.location.origin);
  const params = new URLSearchParams(url.search);

  if (paramsId) {
    params.set("id", paramsId);
  }

  params.set("q", searchValue);
  url.search = params.toString();

  window.location.href = url.href;
});

const btnPopupSearch = document.querySelector(".popup__search-input i");
btnPopupSearch.addEventListener("click", () => {
  const inputSearch = document.querySelector(".popup__search-input input");
  const searchValue = inputSearch.value.trim();

  const url = new URL("shop.html", window.location.origin);
  const params = new URLSearchParams(url.search);

  if (paramsId) {
    params.set("id", paramsId);
  }

  params.set("q", searchValue);
  url.search = params.toString();

  window.location.href = url.href;
});

const subLinkTags = document.querySelectorAll("[data-tag]");
subLinkTags.forEach((tag) => {
  tag.addEventListener("click", () => {
    const url = new URL("shop.html", window.location.origin);
    const params = new URLSearchParams(url.search);
    if (paramsId) {
      params.set("id", paramsId);
    }
    params.set("tag", tag.dataset.tag);
    url.search = params.toString();

    window.location.href = url.href;
  });
});

const subLinkCategories = document.querySelectorAll("[data-category]");
subLinkCategories.forEach((category) => {
  category.addEventListener("click", () => {
    const url = new URL("shop.html", window.location.origin);
    const params = new URLSearchParams(url.search);

    if (paramsId) {
      params.set("id", paramsId);
    }

    params.set("category", category.dataset.category);
    url.search = params.toString();

    window.location.href = url.href;
  });
});

if (paramsId) {
  const currentUser = userStorage.find((user) => user.id === +paramsId);
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
}
