const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const btnSignUp = document.getElementById("btn-signUp");

const userStorage = JSON.parse(localStorage.getItem("userStorage")) ?? [];

const checkErrorInputs = () => {
  let isCheckError = true;
  if (username.value === "") {
    document.querySelector(".error-username").innerHTML =
      "<strong>Lỗi: </strong> Yêu cầu tên tài khoản.";
    isCheckError = false;
    return;
  } else {
    document.querySelector(".error-username").innerHTML = "";
    isCheckError = true;
  }
  if (email.value === "") {
    document.querySelector(".error-email").innerHTML =
      "<strong>Lỗi: </strong> Xin điền địa chỉ email.";
    isCheckError = false;
    return;
  } else {
    document.querySelector(".error-email").innerHTML = "";
    isCheckError = true;
  }

  if (password.value === "") {
    document.querySelector(".error-password").innerHTML =
      "<strong>Lỗi: </strong> Xin điền mật khẩu.";
    isCheckError = false;
    return;
  } else {
    document.querySelector(".error-password").innerHTML = "";
    isCheckError = true;
  }

  if (confirmPassword.value === "") {
    document.querySelector(".error-confirmPassword").innerHTML =
      "<strong>Lỗi: </strong> Xin điền xác nhận lại mật khẩu.";
    isCheckError = false;
    return;
  } else {
    document.querySelector(".error-confirmPassword").innerHTML = "";
    isCheckError = true;
  }

  if (confirmPassword.value !== password.value) {
    document.querySelector(".error-confirmPassword").innerHTML =
      "<strong>Lỗi: </strong> Mật khẩu xác nhận không hợp lệ.";
    isCheckError = false;
    return;
  } else {
    document.querySelector(".error-confirmPassword").innerHTML = "";
    isCheckError = true;
  }

  const isCheckEmail = userStorage.some((user) => user.email === email.value);
  if (isCheckEmail) {
    document.querySelector(".error-email").innerHTML =
      "<strong>Lỗi: </strong> Địa chỉ email đã tồn tại.";
    isCheckError = false;
    return;
  } else {
    document.querySelector(".error-email").innerHTML = "";
    isCheckError = true;
  }

  return isCheckError;
};

const checkEmptyInput = () => {};
btnSignUp.addEventListener("click", (e) => {
  e.preventDefault();
  if (checkErrorInputs()) {
    userStorage.push({
      id: Date.now(),
      username: username.value,
      email: email.value,
      password: password.value,
    });
    localStorage.setItem("userStorage", JSON.stringify(userStorage));
    alert("Đăng kí thành công");
    location.href = "login.html";
    document.getElementsByTagName("form")[0].reset();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (checkErrorInputs()) {
      userStorage.push({
        id: Date.now(),
        username: username.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      });
      localStorage.setItem("userStorage", JSON.stringify(userStorage));
      alert("Đăng kí thành công");
      location.href = "login.html";
      document.getElementsByTagName("form")[0].reset();
    }
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
