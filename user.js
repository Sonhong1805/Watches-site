const userStorage = JSON.parse(localStorage.getItem("userStorage"));

let queryString = window.location.search;
let urlParam = new URLSearchParams(queryString);

let loginUser = JSON.parse(localStorage.getItem("loginUser"));

if (loginUser) {
  const currentUser = userStorage.find((user) => user.id === +loginUser);
  document.querySelector("#username-input").value = currentUser.username;
  document.querySelector("#email-input").value = currentUser.email;
  document.querySelector("#phone-input").value = currentUser.phone ?? "";
  document.querySelector("#realname-input").value = currentUser.realname ?? "";
  document.querySelector(".current-option.day").textContent =
    currentUser.dateOfBirth?.day ?? "1";
  document.querySelector(".current-option.month").textContent =
    currentUser.dateOfBirth?.month ?? "Tháng 1";
  document.querySelector(".current-option.year").textContent =
    currentUser.dateOfBirth?.year ?? "1990";
  const genderInputs = document.querySelectorAll("input[name='gender']");
  genderInputs.forEach((input) => {
    if (input.value === currentUser.gender) {
      input.checked = true;
    }
  });
  document.querySelector("#account-number").value =
    currentUser.bank?.accountNumber ?? "";
  document.querySelector("#owner").value = currentUser.bank?.owner ?? "";
  document.querySelector("#cmnd").value = currentUser.bank?.cmnd ?? "";

  const nameBank = document.querySelector(".current-option.bank");
  nameBank.textContent = currentUser.bank?.name ?? "Chọn ngân hàng";

  const logoBank = document.querySelector(".current-option__image img");
  logoBank.style.display = currentUser.bank?.logo ? "block" : "none";
  logoBank.src =
    currentUser.bank?.logo ?? "https://placehold.co/500x400/000000/FFFFFF.png";

  const optionsDay = document.querySelector(".option-list.day");
  const optionsMonth = document.querySelector(".option-list.month");
  const optionsYear = document.querySelector(".option-list.year");
  for (let i = 2; i <= 31; i++) {
    const li = document.createElement("li");
    li.className = "option-item day";
    li.textContent = i;
    optionsDay.appendChild(li);
  }
  for (let i = 2; i <= 12; i++) {
    const li = document.createElement("li");
    li.className = "option-item month";
    li.textContent = "Tháng " + i;
    optionsMonth.appendChild(li);
  }
  for (let i = new Date().getFullYear(); i >= 1910; i--) {
    const li = document.createElement("li");
    li.className = "option-item year";
    li.textContent = i;
    optionsYear.appendChild(li);
  }
  const addonBank = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    for (let i = 0; i < 6; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    document.querySelector(".addon-text").innerHTML = randomString;
  };

  addonBank();

  const handleOptionClick = (option) => {
    const optionImage = option.querySelector("img");
    const optionBank = option.querySelector(".option-item.bank");
    document.querySelector(".current-option__image img").src = optionImage.src;
    document.querySelector(".current-option.bank").textContent =
      optionBank.textContent;
  };

  const renderBankOptions = (data) => {
    let html = `
    <li class="option-item">
      <input
        type="text"
        placeholder="Tìm ngân hàng"
        class="option-input" />
    </li>
  `;
    html += data
      .map((item) => {
        return `
        <li class="option-item bank-item">
          <img src="${item.logo}" alt="" />
          <div class="option-item bank">${item.short_name}</div>
        </li>
      `;
      })
      .join("");

    const optionList = document.querySelector(".option-list.bank");
    optionList.innerHTML = html;

    const optionsBank = document.querySelectorAll(".option-item.bank-item");
    optionsBank.forEach((option) => {
      option.addEventListener("click", (e) => {
        const optionGrandpa = e.target.parentNode.parentNode;
        optionGrandpa.classList.remove("option-open");
        optionGrandpa.previousElementSibling.classList.remove("option-open");
        logoBank.style.display = "block";
        handleOptionClick(option);
      });
    });

    const filterBanks = (searchValue) => {
      const optionItems = document.querySelectorAll(".option-item.bank");
      optionItems.forEach((optionItem) => {
        const bankName = optionItem.textContent.toLowerCase();
        const shouldDisplay = bankName.includes(searchValue.toLowerCase());
        optionItem.parentElement.style.display = shouldDisplay
          ? "flex"
          : "none";
      });
    };

    const searchBank = document.querySelector(".option-input");
    searchBank.addEventListener("input", (event) => {
      const searchValue = event.target.value.trim();
      filterBanks(searchValue);
    });
  };

  const getApiBank = async () => {
    try {
      const response = await fetch("https://api.vietqr.io/v2/banks");
      const json = await response.json();
      const data = json.data;
      renderBankOptions(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  getApiBank();

  const handleOptionItemClick = (optionClass, currentOptionClass, callApi) => {
    const optionItems = document.querySelectorAll(optionClass);
    optionItems.forEach((option) => {
      option.addEventListener("click", (e) => {
        const optionParent = e.target.parentNode;
        optionParent.classList.remove("option-open");
        optionParent.previousElementSibling.classList.remove("option-open");
        document.querySelector(currentOptionClass).innerHTML =
          option.textContent;
        const code = +e.target.dataset.code;
        if (code) {
          callApi(code);
        }
      });
    });
  };

  handleOptionItemClick(".option-item.day", ".current-option.day");
  handleOptionItemClick(".option-item.month", ".current-option.month");
  handleOptionItemClick(".option-item.year", ".current-option.year");

  const handleFilterOptionsProvince = (optionClass, currentOptionClass) => {
    const provinceInput = document.querySelector(currentOptionClass);
    provinceInput.addEventListener("input", (e) => {
      const searchValue = e.target.value.trim().toLowerCase();
      const optionsProvince = document.querySelectorAll(optionClass);
      optionsProvince.forEach((optionItem) => {
        const provinceName = optionItem.textContent.trim().toLowerCase();
        const shouldDisplay = provinceName.includes(searchValue);
        optionItem.style.display = shouldDisplay ? "block" : "none";
      });
    });
  };

  const handleOptionItemProvinceClick = (
    optionClass,
    currentOptionClass,
    callApi
  ) => {
    const optionItems = document.querySelectorAll(optionClass);
    optionItems.forEach((option) => {
      option.addEventListener("click", (e) => {
        const optionParent = e.target.parentNode;
        optionParent.classList.remove("option-open");
        optionParent.previousElementSibling.classList.remove("option-open");
        document.querySelector(currentOptionClass).value = option.textContent;
        const code = +e.target.dataset.code;
        if (code) {
          callApi(code);
        }
      });
    });
  };

  const renderProvinceOptions = (data) => {
    let html = "";
    html = data
      .map((item) => {
        return `
      <li class="option-item province" data-code=${item.code}>${item.name}</li>
    `;
      })
      .join("");
    document.querySelector(".option-list.provice").innerHTML = html;

    handleOptionItemProvinceClick(
      ".option-item.province",
      ".current-option.province",
      getApiDistrict
    );

    handleFilterOptionsProvince(
      ".option-item.province",
      ".current-option.province"
    );
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
    let html = "";
    html = data
      .map((item) => {
        return `
      <li class="option-item district" data-code=${item.code}>${item.name}</li>
    `;
      })
      .join("");
    document.querySelector(".option-list.district").innerHTML = html;

    handleOptionItemProvinceClick(
      ".option-item.district",
      ".current-option.district",
      getApiWard
    );

    handleFilterOptionsProvince(
      ".option-item.district",
      ".current-option.district"
    );
  };

  const getApiDistrict = async (province_code) => {
    try {
      if (province_code) {
        const addressDistrict = document.querySelector(
          ".selected-option.district"
        );
        addressDistrict.classList.remove("address-hide");
        addressDistrict.querySelector("input").disabled = false;
      }
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
    let html = "";
    html = data
      .map((item) => {
        return `
      <li class="option-item ward">${item.name}</li>
    `;
      })
      .join("");
    document.querySelector(".option-list.ward").innerHTML = html;

    handleOptionItemProvinceClick(".option-item.ward", ".current-option.ward");
    handleFilterOptionsProvince(".option-item.ward", ".current-option.ward");
  };

  const getApiWard = async (district_code) => {
    try {
      if (district_code) {
        const addressDistrict = document.querySelector(".selected-option.ward");
        addressDistrict.classList.remove("address-hide");
        addressDistrict.querySelector("input").disabled = false;
      }
      const response = await fetch("https://provinces.open-api.vn/api/w/");
      const data = await response.json();
      let result = data.filter((ward) => ward.district_code === district_code);
      renderWardOptions(result);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const btnsShowSidebar = document.querySelectorAll(".profile__header-button");
  const sidebar = document.querySelector(".profile__sidebar");
  const closeSidebar = document.querySelector(".btn__sidebar");

  btnsShowSidebar.forEach((btn) => {
    btn.addEventListener("click", () => {
      sidebar.classList.add("sidebar--open");
    });
  });

  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("sidebar--open");
  });

  const overlay = document.querySelector(".profile__sidebar-overlay");
  overlay.addEventListener("click", (e) => {
    const overlayVisibility = getComputedStyle(overlay).visibility;
    if (overlayVisibility === "visible") {
      sidebar.classList.remove("sidebar--open");
    }
  });

  const sidebarLinks = sidebar.querySelectorAll(".profile__sidebar-link");
  const profileHeader = document.querySelectorAll(".profile__header");
  const profileForm = document.querySelectorAll(".profile__form");

  let paramsUserIndex = urlParam.get("user-index");

  if (paramsUserIndex) {
    sidebar
      .querySelector(".profile__sidebar-link.active")
      .classList.remove("active");
    sidebarLinks[paramsUserIndex].classList.add("active");

    document
      .querySelector(".profile__header.active")
      .classList.remove("active");
    profileHeader[paramsUserIndex].classList.add("active");

    document.querySelector(".profile__form.active").classList.remove("active");
    profileForm[paramsUserIndex].classList.add("active");
  }

  const selectedOptions = document.querySelectorAll(".selected-option");

  selectedOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      const parentOption = option.parentNode;

      const allOptionLists = document.querySelectorAll(".option-list");
      allOptionLists.forEach((optionList) => {
        if (optionList !== parentOption.querySelector(".option-list")) {
          optionList.classList.remove("option-open");
        }
      });

      const optionList = parentOption.querySelector(".option-list");
      optionList.classList.toggle("option-open");

      const allSelectedOptions = document.querySelectorAll(".selected-option");
      allSelectedOptions.forEach((selectedOption) => {
        if (selectedOption !== option) {
          selectedOption.classList.remove("option-open");
        }
      });

      option.classList.toggle("option-open");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedEvent = event.target;
    const selectedOption = clickedEvent.querySelector(
      ".selected-option.option-open"
    );
    const optionList = clickedEvent.querySelector(".option-list.option-open");
    if (selectedOption && optionList) {
      selectedOption.classList.remove("option-open");
      optionList.classList.remove("option-open");
    }
  });

  const eyeOpen = document.querySelectorAll(".eye-open");
  const eyeClose = document.querySelectorAll(".eye-close");

  eyeClose.forEach((eyes) => {
    eyes.addEventListener("click", (e) => {
      e.currentTarget.classList.add("hide");
      const parent = e.target.parentNode;
      parent.querySelector(".eye-open").classList.remove("hide");
      const input = parent.querySelector("input[type='password']");
      input.setAttribute("type", "text");
    });
  });

  eyeOpen.forEach((eyes) => {
    eyes.addEventListener("click", (e) => {
      e.currentTarget.classList.add("hide");
      const parent = e.target.parentNode;
      parent.querySelector(".eye-close").classList.remove("hide");
      const input = parent.querySelector("input[type='text']");
      input.setAttribute("type", "password");
    });
  });

  const usernameInput = document.querySelector("#username-input");
  const realnameInput = document.querySelector("#realname-input");
  const emailInput = document.querySelector("#email-input");
  const phoneInput = document.querySelector("#phone-input");
  const optionDay = document.querySelector(".current-option.day");
  const optionMonth = document.querySelector(".current-option.month");
  const optionYear = document.querySelector(".current-option.year");

  const btnSaveInfo = document.querySelector("#add-info");
  btnSaveInfo.addEventListener("click", () => {
    const gender = document.querySelector("input[name='gender']:checked");
    try {
      currentUser.gender = gender.value;
    } catch (error) {}
    currentUser.username = usernameInput.value;
    currentUser.email = emailInput.value;
    currentUser.realname = realnameInput.value;
    currentUser.phone = phoneInput.value;
    currentUser.dateOfBirth = {
      day: optionDay.textContent,
      month: optionMonth.textContent,
      year: optionYear.textContent,
    };
    Swal.fire({
      icon: "success",
      title: "Cập nhật hồ sơ !",
      showConfirmButton: false,
      timer: 1500,
    });
    localStorage.setItem("userStorage", JSON.stringify(userStorage));
    document.querySelector("#username").innerHTML = usernameInput.value;
    document.querySelector("#username-popup").innerHTML = usernameInput.value;
  });

  const accountNumber = document.querySelector("#account-number");
  const owner = document.querySelector("#owner");
  const cmnd = document.querySelector("#cmnd");
  const addonInput = document.querySelector("#addon");
  const addonText = document.querySelector(".addon-text");

  const checkEmptyBank = () => {
    let isEmpty = true;
    if (nameBank.textContent === "Chọn ngân hàng") {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng chọn ngân hàng",
        showCancelButton: true,
        cancelButtonText: "Hủy",
      });
      isEmpty = false;
      return;
    } else if (isNaN(accountNumber.value) || accountNumber.value === "") {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng nhập lại số tài khoản",
        showCancelButton: true,
        cancelButtonText: "Hủy",
      });
      isEmpty = false;
      return;
    } else if (owner.value === "") {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng nhập chủ tài khoản",
        showCancelButton: true,
        cancelButtonText: "Hủy",
      });
      isEmpty = false;
      return;
    } else if (cmnd.value === "") {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng nhập CMND",
        showCancelButton: true,
        cancelButtonText: "Hủy",
      });
      isEmpty = false;
      return;
    } else if (addonInput.value !== addonText.textContent) {
      Swal.fire({
        icon: "error",
        title: "Sai mã bảo vệ !!!",
        showCancelButton: true,
        cancelButtonText: "Hủy",
      });
      isEmpty = false;
      return;
    }
    return isEmpty;
  };

  const btnAddBank = document.querySelector("#add-bank");
  btnAddBank.addEventListener("click", () => {
    if (checkEmptyBank()) {
      currentUser.bank = {
        logo: logoBank.src,
        name: nameBank.textContent,
        owner: owner.value,
        cmnd: cmnd.value,
        accountNumber: accountNumber.value,
      };
      addonInput.value = "";
      Swal.fire({
        icon: "success",
        title: "Thêm ngân hàng thành công !",
        showConfirmButton: false,
        timer: 1500,
      });
      addonBank();
      localStorage.setItem("userStorage", JSON.stringify(userStorage));
    }
  });

  const deleteBank = document.querySelector("#delete-bank");
  deleteBank.addEventListener("click", () => {
    delete currentUser.bank;
    logoBank.style.display = "none";
    nameBank.textContent = "Chọn ngân hàng";
    accountNumber.value = "";
    owner.value = "";
    cmnd.value = "";
    addonInput.value = "";
    addonBank();
    localStorage.setItem("userStorage", JSON.stringify(userStorage));
  });

  const newPasswordInput = document.querySelector("#new-password");
  const repeatPasswordInput = document.querySelector("#repeat-password");

  const btnAddPassword = document.querySelector("#add-password");
  btnAddPassword.addEventListener("click", () => {
    currentUser.password = newPasswordInput.value;
    Swal.fire({
      icon: "success",
      title: "Thay đổi mật khẩu thành công !",
      showConfirmButton: false,
      timer: 1500,
    });
    localStorage.setItem("userStorage", JSON.stringify(userStorage));
  });

  newPasswordInput.addEventListener("input", () => {
    const newPassword = newPasswordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,16}$/;

    const newPasswordCheck = document.querySelector("#new_password-check");
    if (newPassword === "") {
      newPasswordCheck.classList.remove("check-error");
    } else if (passwordRegex.test(newPassword)) {
      newPasswordCheck.classList.remove("check-error");
    } else {
      newPasswordCheck.classList.add("check-error");
    }
  });

  repeatPasswordInput.addEventListener("input", () => {
    const repeatPassword = repeatPasswordInput.value;
    const repeatPasswordCheck = document.querySelector(
      "#repeat_password-check"
    );

    if (repeatPassword === "") {
      repeatPasswordCheck.classList.remove("check-error");
    } else if (repeatPassword !== newPasswordInput.value) {
      repeatPasswordCheck.classList.add("check-error");
    } else if (repeatPassword === newPasswordInput.value) {
      repeatPasswordCheck.classList.remove("check-error");
      btnAddPassword.classList.remove("check-error");
    }
  });

  const realnameAddress = document.querySelector("#realname-address");
  const phoneAddress = document.querySelector("#phone-address");
  const noteAddress = document.querySelector("#note-address");
  const defaultAddress = document.querySelector("#default-address");
  const provinceAddress = document.querySelector(".current-option.province");
  const districtAddress = document.querySelector(".current-option.district");
  const wardAddress = document.querySelector(".current-option.ward");

  const checkEmptyAddress = () => {
    let isEmpty = true;
    if (realnameAddress.value === "") {
      realnameAddress.classList.add("check-error");
      isEmpty = false;
    } else {
      realnameAddress.classList.remove("check-error");
    }
    if (phoneAddress.value === "") {
      phoneAddress.classList.add("check-error");
      isEmpty = false;
    } else {
      phoneAddress.classList.remove("check-error");
    }
    if (noteAddress.value === "") {
      noteAddress.classList.add("check-error");
      isEmpty = false;
    } else {
      noteAddress.classList.remove("check-error");
    }
    if (provinceAddress.value === "") {
      provinceAddress.classList.add("check-error");
      provinceAddress.parentNode.classList.add("check-error");
      isEmpty = false;
    } else {
      provinceAddress.classList.remove("check-error");
      provinceAddress.parentNode.classList.remove("check-error");
    }
    if (districtAddress.value === "") {
      districtAddress.classList.add("check-error");
      districtAddress.parentNode.classList.add("check-error");
      isEmpty = false;
    } else {
      districtAddress.classList.remove("check-error");
      districtAddress.parentNode.classList.remove("check-error");
    }
    if (wardAddress.value === "") {
      wardAddress.classList.add("check-error");
      wardAddress.parentNode.classList.add("check-error");
      isEmpty = false;
    } else {
      wardAddress.classList.remove("check-error");
      wardAddress.parentNode.classList.remove("check-error");
    }
    return isEmpty;
  };

  const resetFormAddress = () => {
    realnameAddress.value = "";
    phoneAddress.value = "";
    noteAddress.value = "";
    provinceAddress.value = "";
    districtAddress.value = "";
    wardAddress.value = "";
    document.querySelectorAll("input[name='type']").forEach((input) => {
      input.checked = false;
    });
    defaultAddress.checked = false;
    btnResetAddress.style.display = "none";
  };

  const renderUserAddress = (arr) => {
    arr.sort((a, b) => (a.default === b.default ? 0 : a.default ? -1 : 1));
    let html = "";
    html = arr.map((address) => {
      return `
      <div class="profile__address-item">
        <div class="profile__address-info">
          <div class="profile__address-contact">
            <strong class="profile__address-name"
              >${address.realname}</strong
            >
            <span class="profile__address-separator"></span>
            <span class="profile__address-phone"
              >${address.phone}</span
            >
          </div>
          <p class="profile__address-street">${address.note}</p>
          <p class="profile__address-location">
          ${address.ward}, ${address.district}, ${address.province}
          </p>
          ${
            address.default
              ? '<button class="profile__address-default">Mặc định</button>'
              : ""
          }
        </div>
        <div class="profile__actions">
          <button class="profile__update" data-id=${
            address.id
          }>Cập nhật</button>
          ${
            address.default
              ? ""
              : `<button class="profile__delete" data-id=${address.id}>Xoá</button>`
          }
          <br />
          <button class="profile__set-default ${
            address.default ? "checked" : ""
          }" data-id=${address.id}>
            Thiết lập mặc định
          </button>
        </div>
      </div>
      `;
    });
    document.querySelector(".profile__address-details").innerHTML =
      html.join("");
  };

  renderUserAddress(currentUser.address);

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("profile__delete")) {
      const idAddress = +e.target.dataset.id;
      currentUser.address = currentUser.address.filter(
        (address) => address.id !== idAddress
      );
      Swal.fire({
        icon: "error",
        title: `Bạn có chắc muốn xoá địa chỉ này?`,
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(e.target);
          Swal.fire({
            icon: "success",
            title: "Xoá địa chỉ thành công !",
            showConfirmButton: false,
            timer: 1500,
          });
          renderUserAddress(currentUser.address);
          localStorage.setItem("userStorage", JSON.stringify(userStorage));
        }
      });
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("profile__set-default")) {
      const idAddress = +e.target.dataset.id;
      const findAddress = currentUser.address.find(
        (address) => address.id === idAddress
      );
      currentUser.address.forEach((item) => {
        item.default = false;
      });
      findAddress.default = true;
      renderUserAddress(currentUser.address);
      localStorage.setItem("userStorage", JSON.stringify(userStorage));
    }
  });

  let idCurrentAddress = null;

  let btnAddAddress = document.querySelector(".add-address");
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-address")) {
      console.log(e.target);
      const typeAddress = document.querySelector("input[name='type']:checked");
      const addressInfo = {
        realname: realnameAddress.value,
        phone: phoneAddress.value,
        note: noteAddress.value,
        province: provinceAddress.value,
        district: districtAddress.value,
        ward: wardAddress.value,
        type: typeAddress ? typeAddress.value : "",
      };
      if (checkEmptyAddress()) {
        if (defaultAddress.checked) {
          currentUser.address?.forEach((item) => {
            item.default = false;
          });
        }
        if (idCurrentAddress) {
          currentUser.address = currentUser.address.map((address) => {
            if (address.id === idCurrentAddress) {
              return {
                ...addressInfo,
                id: address.id,
                default: defaultAddress.checked ? true : false,
              };
            } else {
              return address;
            }
          });
          renderUserAddress(currentUser.address);
          Swal.fire({
            icon: "success",
            title: "Thay đổi địa chỉ thành công",
            showConfirmButton: false,
            timer: 1500,
          });
          btnAddAddress.textContent = "Thêm địa chỉ";
        } else {
          const newAddress = {
            id: Math.floor(Math.random() * 1000000),
            ...addressInfo,
            default: defaultAddress.checked ? true : false,
          };
          currentUser.address.push(newAddress);
          renderUserAddress(currentUser.address);
          Swal.fire({
            icon: "success",
            title: "Thêm địa chỉ thành công !",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        resetFormAddress();
        localStorage.setItem("userStorage", JSON.stringify(userStorage));
      }
    }
  });

  const btnResetAddress = document.querySelector("#reset-address");
  btnResetAddress.addEventListener("click", () => {
    btnAddAddress.textContent = "Thêm địa chỉ";
    resetFormAddress();
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("profile__update")) {
      const idAddress = +e.target.dataset.id;
      const findAddress = currentUser.address.find(
        (address) => address.id === idAddress
      );
      idCurrentAddress = findAddress.id;
      realnameAddress.value = findAddress.realname;
      phoneAddress.value = findAddress.phone;
      noteAddress.value = findAddress.note;
      provinceAddress.value = findAddress.province;
      districtAddress.value = findAddress.district;
      wardAddress.value = findAddress.ward;
      defaultAddress.checked = findAddress.default;
      document.querySelectorAll("input[name='type']").forEach((input) => {
        if (input.value === findAddress.type) {
          input.checked = true;
        }
      });
      if (idCurrentAddress) {
        btnAddAddress.textContent = "Hoàn thành";
        btnResetAddress.style.display = "block";
      }
    }
  });
} else {
  location.href = "index.html";
}
