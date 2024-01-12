let userStorage = JSON.parse(localStorage.getItem("userStorage")) ?? [];

let queryString = window.location.search;
let urlParam = new URLSearchParams(queryString);

let loginUser = JSON.parse(localStorage.getItem("loginUser"));

if (loginUser) {
  const sectionTable = document.querySelector(".cart__table");
  sectionTable.style.display = "none";
  const sectionButtons = document.querySelector(".cart__buttons");
  sectionButtons.style.display = "none";
  const sectionMessage = document.querySelector(".cart-message");
  sectionMessage.style.display = "block";

  const currentUser = userStorage.find((user) => user.id === +loginUser);
  if (currentUser) {
    let currentUserCart = currentUser.cart ?? [];

    if (currentUserCart.length !== 0) {
      sectionTable.style.display = "block";
      sectionButtons.style.display = "flex";
      sectionMessage.style.display = "none";
    }
    const renderProductCart = (arr) => {
      let row = "";
      row = arr.map((product) => {
        const priceFormat = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(product.price);
        const sumPrice = product.price * product.quantity;
        const sumPriceFormat = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(sumPrice);
        return `
      <tr class="cart__item">
      <td class="cart__product" data-cell="sản phẩm">
        <div class="cart__product-info">
          <input type="checkbox" class="cart__checkbox-input" ${
            product.checked ? "checked" : ""
          } data-id=${product.id} data-color="${product.color}" />
          <img
            src=${product.thumbnail}
            alt=""
            class="cart__product-image" />
          <div class="cart__product-name">${product.name}</div>
        </div>
      </td>
      <td class="cart__color" data-cell="màu sắc">${product.color}</td>
      <td class="cart__unit-price" data-cell="đơn giá">${priceFormat}</td>
      <td class="cart__quantity" data-cell="số lượng">
        <div class="cart__quantity-group">
          <button class="cart__quantity-btn quantity-minus">-</button>
          <input type="text" class="cart__quantity-input" value=${
            product.quantity
          } data-id=${product.id} data-color="${product.color}" />
          <button class="cart__quantity-btn quantity-plus">+</button>
        </div>
      </td>
      <td class="cart__total" data-cell="tổng">${sumPriceFormat}</td>
      <td class="cart__action" data-cell="thao tác">
        <i class="fa-regular fa-circle-xmark" data-id=${
          product.id
        } data-color="${product.color}"></i>
      </td>
    </tr>
    `;
      });

      document.querySelector("tbody").innerHTML = row.join("");
    };

    renderProductCart(currentUserCart);

    const totalQuantity = () => {
      const countQuantity = currentUserCart
        .filter((product) => product.checked)
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue.quantity;
        }, 0);
      document.querySelector(".cart__total-quantity").innerHTML =
        countQuantity ?? 0;
    };

    totalQuantity();

    const totalPrice = () => {
      const countPrice = currentUserCart
        .filter((product) => product.checked)
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue.quantity * currentValue.price;
        }, 0);
      const countPriceFormat = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(countPrice);
      document.querySelector(".cart__total-price").innerHTML =
        countPriceFormat ?? 0;
    };

    totalPrice();

    const saveLocalStorage = () => {
      userStorage = userStorage.map((user) => {
        if (user.id === +loginUser) {
          return { ...user, cart: currentUserCart };
        } else {
          return user;
        }
      });

      localStorage.setItem("userStorage", JSON.stringify(userStorage));
      const counter = document.querySelector(".header__bottom-counter");
      if (currentUserCart) {
        const totalQuantity = currentUserCart.reduce(
          (accumulator, currentValue) => {
            return accumulator + currentValue.quantity;
          },
          0
        );
        counter.textContent = totalQuantity;
      }

      if (currentUserCart.length === 0) {
        sectionTable.style.display = "none";
        sectionButtons.style.display = "none";
        sectionMessage.style.display = "block";
      }
    };

    const handleUpdateQuantity = (input) => {
      const id = input.dataset.id;
      const color = input.dataset.color;
      const currentProduct = currentUserCart.find(
        (product) => product.id === id && product.color === color
      );
      currentProduct.quantity = +input.value;
      saveLocalStorage();
      const currentRow = input.closest("tr");
      const priceCell = currentRow.querySelector(".cart__total");
      const currentPrice = +input.value * currentProduct.price;
      priceCell.textContent = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(currentPrice);
      totalQuantity();
      totalPrice();
    };

    const btnQuantityPlus = document.querySelectorAll("button.quantity-plus");
    btnQuantityPlus.forEach((btn) => {
      btn.addEventListener("click", () => {
        let input = btn.previousElementSibling;
        if (isNaN(input.value)) {
          input.value = 1;
        } else {
          ++input.value;
        }
        handleUpdateQuantity(input);
      });
    });

    const btnQuantityMinus = document.querySelectorAll("button.quantity-minus");
    btnQuantityMinus.forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = btn.nextElementSibling;
        if (input.value <= 1) {
          input.value = 1;
        } else {
          --input.value;
        }
        handleUpdateQuantity(input);
      });
    });

    const productsInput = document.querySelectorAll(".cart__quantity-input");
    productsInput.forEach((input) => {
      input.addEventListener("change", () => {
        handleUpdateQuantity(input);
      });
    });
    const btnCheckboxAll = document.querySelector(".cart__checkbox");
    const checkboxAll = () => {
      const isProductsChecked = currentUserCart.every(
        (product) => product.checked
      );
      btnCheckboxAll.checked = isProductsChecked;
    };

    const productsCheckbox = document.querySelectorAll(".cart__checkbox-input");
    productsCheckbox.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const id = checkbox.dataset.id;
        const color = checkbox.dataset.color;
        const currentProduct = currentUserCart.find(
          (product) => product.id === id && product.color === color
        );
        currentProduct.checked = checkbox.checked;
        if (currentProduct) {
          currentProduct.checked = checkbox.checked;
          checkboxAll();

          saveLocalStorage();
          totalQuantity();
          totalPrice();
        }
      });
    });

    btnCheckboxAll.addEventListener("change", (e) => {
      currentUserCart = currentUserCart.map((item) => {
        return { ...item, checked: e.target.checked };
      });

      saveLocalStorage();

      productsCheckbox.forEach((checkbox) => {
        checkbox.checked = e.target.checked;
      });

      totalQuantity();
      totalPrice();
    });

    checkboxAll();

    const btnsRemove = document.querySelectorAll(".cart__action i");
    btnsRemove.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const color = e.target.dataset.color;
        Swal.fire({
          icon: "error",
          title: `Bạn có muốn bỏ sản phẩm này không ?`,
          showCancelButton: true,
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            currentUserCart = currentUserCart.filter(
              (product) => product.id !== id || product.color !== color
            );
            btn.closest("tr").remove();
            saveLocalStorage();
            totalQuantity();
            totalPrice();
            Swal.fire({
              icon: "success",
              title: "Xoá thành công !",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      });
    });

    const btnRemoveChecked = document.querySelector(
      ".cart__button--delete-checked"
    );
    btnRemoveChecked.addEventListener("click", () => {
      let sumProductChecked = 0;
      const productCheckboxs = document.querySelectorAll(
        ".cart__checkbox-input"
      );
      productCheckboxs.forEach((checkbox) => {
        if (checkbox.checked) {
          sumProductChecked += 1;
        }
      });
      if (sumProductChecked === 0) {
        Swal.fire({
          icon: "warning",
          title: "Bạn chưa chọn sản phẩm nào để xoá",
          showCancelButton: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: `Bạn có muốn bỏ ${sumProductChecked} sản phẩm không ?`,
          showCancelButton: true,
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
        }).then((result) => {
          if (result.isConfirmed) {
            currentUserCart = currentUserCart.filter(
              (product) => !product.checked
            );
            renderProductCart(currentUserCart);
            saveLocalStorage();
            totalQuantity();
            totalPrice();
            Swal.fire({
              icon: "success",
              title: "Xoá thành công !",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      }
    });

    const deleteAll = document.querySelector(".cart__button--delete-all");
    deleteAll.addEventListener("click", () => {
      Swal.fire({
        icon: "error",
        title: `Bạn có muốn xoá tất cả sản phẩm không ?`,
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          currentUserCart = [];
          saveLocalStorage();
          totalQuantity();
          totalPrice();
          Swal.fire({
            icon: "success",
            title: "Xoá thành công !",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    });

    const btnPayment = document.querySelector(".cart__button-add");
    btnPayment.addEventListener("click", () => {
      const isProductChecked = currentUserCart.some(
        (product) => product.checked
      );
      if (isProductChecked) {
        window.location.href = "payment.html";
      } else {
        Swal.fire({
          icon: "warning",
          title: "Bạn vẫn chưa chọn sản phẩm nào để mua.",
          showCancelButton: true,
          cancelButtonText: "Hủy",
        });
      }
    });
  }
} else {
  location.href = "login.html";
}
