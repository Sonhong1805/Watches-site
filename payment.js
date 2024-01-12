let userStorage = JSON.parse(localStorage.getItem("userStorage")) ?? [];

let queryString = window.location.search;
let urlParam = new URLSearchParams(queryString);

let loginUser = JSON.parse(localStorage.getItem("loginUser"));

if (loginUser) {
  const currentUser = userStorage.find((user) => user.id === +loginUser);
  if (currentUser) {
    const realnameInput = document.querySelector("#realname-input");
    const emailInput = document.querySelector("#email-input");
    const phoneInput = document.querySelector("#phone-input");
    const addressInput = document.querySelector("#address-input");
    const selectProvince = document.querySelector(
      ".user-info__select.province"
    );
    const selectDistrict = document.querySelector(
      ".user-info__select.district"
    );
    const selectWard = document.querySelector(".user-info__select.ward");

    const currentAddressDefault = currentUser.address?.find(
      (address) => address.default
    );

    if (currentAddressDefault) {
      realnameInput.value = currentAddressDefault?.realname ?? "";
      emailInput.value = currentUser.email;
      phoneInput.value = currentAddressDefault?.phone ?? "";
      addressInput.value = currentAddressDefault?.note ?? "";
    }

    const currentUserCartChecked = currentUser.cart.filter(
      (product) => product.checked
    );

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
            <tr>
              <td>
                <div class="payment__product-info">
                  <div class="payment__product-image">
                    <img src=${product.thumbnail} alt="" />
                  </div>
                  <div class="payment__product-details">
                    <p class="payment__product-name">${product.name}</p>
                    <p class="payment__product-price">
                      <strong class="payment__product-quantity">${product.quantity}</strong>
                      x
                      <strong class="payment__product-price">${priceFormat}</strong>
                    </p>
                  </div>
                </div>
              </td>
              <td>${priceFormat}</td>
              <td>${product.color}</td>
              <td>x${product.quantity}</td>
              <td>${sumPriceFormat}</td>
            </tr>
    `;
      });

      document.querySelector("tbody").innerHTML = row.join("");
    };

    renderProductCart(currentUserCartChecked);

    const totalPrice = () => {
      const countPrice = currentUserCartChecked.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.quantity * currentValue.price;
        },
        0
      );
      const countPriceFormat = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(countPrice);
      document
        .querySelectorAll(".summary__info strong:not(.country)")
        .forEach((text) => (text.textContent = countPriceFormat));
    };
    totalPrice();

    const btnEditCart = document.querySelector(".payment__button-edit");
    btnEditCart.addEventListener("click", () => {
      const newUrl = new URL("cart.html", window.location.origin);
      const newParams = new URLSearchParams(newUrl.search);
      newUrl.search = newParams.toString();
      window.location.href = newUrl.href;
    });

    const renderProvinceOptions = (data) => {
      let html = "<option >Chọn Tỉnh/Thành *</option>";
      html += data
        .map((item) => {
          return `
      <option class="user-info__select-option" data-code=${item.code}>${item.name}</option>
    `;
        })
        .join("");
      const selectProvince = document.querySelector(
        ".user-info__select.province"
      );
      selectProvince.innerHTML = html;
      selectProvince.addEventListener("change", () => {
        const optionProvince =
          selectProvince.options[selectProvince.selectedIndex];
        const code = +optionProvince.dataset.code;
        getApiDistrict(code);
      });
      const optionsProvince = selectProvince.querySelectorAll("option");
      optionsProvince.forEach((option) => {
        if (option.value === currentAddressDefault?.province) {
          option.selected = true;
          const code = +option.dataset.code;
          getApiDistrict(code);
        }
      });
    };

    const getApiProvince = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/");
        const data = await response.json();
        renderProvinceOptions(data);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    getApiProvince();

    const renderDistrictOptions = async (data) => {
      let html = "<option>Chọn Quận/Huyện *</option>";
      html += data
        .map((item) => {
          return `
      <option class="option-item district" data-code=${item.code}>${item.name}</option>
    `;
        })
        .join("");
      const selectDistrict = document.querySelector(
        ".user-info__select.district"
      );
      selectDistrict.innerHTML = html;
      selectDistrict.addEventListener("change", () => {
        const optionDistrict =
          selectDistrict.options[selectDistrict.selectedIndex];
        const code = +optionDistrict.dataset.code;
        getApiWard(code);
      });
      const optionsDistrict = selectDistrict.querySelectorAll("option");
      optionsDistrict.forEach((option) => {
        if (option.value === currentAddressDefault?.district) {
          option.selected = true;
          const code = +option.dataset.code;
          getApiWard(code);
        }
      });
    };

    const getApiDistrict = async (province_code) => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/d/");
        const data = await response.json();
        let result = data.filter(
          (district) => district.province_code === province_code
        );
        renderDistrictOptions(result);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    const renderWardOptions = async (data) => {
      let html = "<option>Chọn Phường/Xã *</option>";
      html += data
        .map((item) => {
          return `
      <option class="option-item ward" data-code=${item.code}>${item.name}</option>
    `;
        })
        .join("");
      const selectWard = document.querySelector(".user-info__select.ward");
      selectWard.innerHTML = html;
      const optionsWard = selectWard.querySelectorAll("option");
      optionsWard.forEach((option) => {
        if (option.value === currentAddressDefault?.ward) {
          option.selected = true;
        }
      });
    };

    const getApiWard = async (district_code) => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/w/");
        const data = await response.json();
        let result = data.filter(
          (ward) => ward.district_code === district_code
        );
        renderWardOptions(result);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    const checkEmptyInput = () => {
      let isEmpty = true;
      if (realnameInput.value === "") {
        realnameInput.classList.add("error");
        document.querySelector("#realname--error").innerHTML =
          "<strong>Họ và tên</strong><span>là mục bắt buộc</span>";
        isEmpty = false;
      } else {
        realnameInput.classList.remove("error");
        document.querySelector("#realname--error").innerHTML = "";
      }
      if (emailInput.value === "") {
        emailInput.classList.add("error");
        document.querySelector("#email--error").innerHTML =
          "<strong>Email</strong><span>là mục bắt buộc</span>";
        isEmpty = false;
      } else {
        emailInput.classList.remove("error");
        document.querySelector("#email--error").innerHTML = "";
      }
      if (phoneInput.value === "") {
        phoneInput.classList.add("error");
        document.querySelector("#phone--error").innerHTML =
          "<strong>Số điện thoại</strong><span>là mục bắt buộc</span>";
        isEmpty = false;
      } else {
        phoneInput.classList.remove("error");
        document.querySelector("#phone--error").innerHTML = "";
      }
      if (addressInput.value === "") {
        addressInput.classList.add("error");
        document.querySelector("#address--error").innerHTML =
          "<strong>Địa chỉ</strong><span>là mục bắt buộc</span>";
        isEmpty = false;
      } else {
        addressInput.classList.remove("error");
        document.querySelector("#address--error").innerHTML = "";
      }
      let currentPosition =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop;
      if (selectProvince.value === "Chọn Tỉnh/Thành *") {
        selectProvince.classList.add("error");
        document.querySelector("#province--error").innerHTML =
          "<strong>Tỉnh/Thành</strong><span>là mục bắt buộc</span>";
        window.scrollTo({
          top: currentPosition - 500,
          behavior: "smooth",
        });
        isEmpty = false;
      } else {
        selectProvince.classList.remove("error");
        document.querySelector("#province--error").innerHTML = "";
      }
      if (selectDistrict.value === "Chọn Quận/Huyện *") {
        selectDistrict.classList.add("error");
        document.querySelector("#district--error").innerHTML =
          "<strong>Quận/Huyện</strong><span>là mục bắt buộc</span>";
        window.scrollTo({
          top: currentPosition - 500,
          behavior: "smooth",
        });
        isEmpty = false;
      } else {
        selectDistrict.classList.remove("error");
        document.querySelector("#district--error").innerHTML = "";
      }
      if (selectWard.value === "Chọn Phường/Xã *") {
        selectWard.classList.add("error");
        document.querySelector("#ward--error").innerHTML =
          "<strong>Phường/Xã</strong><span>là mục bắt buộc</span>";
        window.scrollTo({
          top: currentPosition - 500,
          behavior: "smooth",
        });
        isEmpty = false;
      } else {
        selectWard.classList.remove("error");
        document.querySelector("#ward--error").innerHTML = "";
      }
      return isEmpty;
    };

    const methodPayment = document.querySelectorAll("input[name='method']");
    methodPayment.forEach((input) =>
      input.addEventListener("change", () => {
        const detail = document.querySelector(".payment-method__bank-details");
        if (input.value === "bank") {
          detail.style.display = "block";
        } else {
          detail.style.display = "none";
        }
      })
    );

    if (!currentUser.bank) {
      document.querySelector(".has-bank").style.display = "none";
    } else {
      document.querySelector(".change-bank").style.display = "none";
    }

    const buyProductSuccessfully = () => {
      Swal.fire({
        icon: "success",
        title: "Mua hàng thành công !",
        showConfirmButton: false,
        timer: 1500,
      });
      let currentUserCart = currentUser.cart;
      currentUserCart = currentUserCart.filter((product) => !product.checked);
      console.log(currentUserCart);
      userStorage = userStorage.map((user) => {
        if (user.id === +loginUser) {
          return { ...user, cart: currentUserCart };
        } else {
          return user;
        }
      });
      localStorage.setItem("userStorage", JSON.stringify(userStorage));
      setTimeout(() => {
        location.href = `cart.html`;
      }, 2000);
    };

    const btnBuyProduct = document.querySelector(".user-info__submit-button");
    btnBuyProduct.addEventListener("click", () => {
      const methodChecked = document.querySelector(
        "input[name='method']:checked"
      );
      if (checkEmptyInput()) {
        if (methodChecked.value === "bank") {
          if (!currentUser.bank) {
            Swal.fire({
              icon: "info",
              title: "Vui lòng thêm tài khoản ngân hàng !",
              showConfirmButton: false,
              showCloseButton: true,
              footer:
                '<p class="change-bank">Thêm tài khoản ngân hàng?<a href="user.html?user-index=1"> Ấn vào đây !</a></p>',
            });
          } else {
            buyProductSuccessfully();
          }
        } else {
          buyProductSuccessfully();
        }
      }
    });
  }
} else {
  location.href = "login.html";
}
