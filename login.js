const username = document.getElementById("username");
const password = document.getElementById("password");
const btnLogin = document.getElementById("btn-login");
const eye = document.getElementById("eye");
const remember = document.getElementById("remember");

let userStorage = JSON.parse(localStorage.getItem("userStorage")) ?? [];

const userRemember = userStorage.find((user) => user.isRemember);
if (userRemember) {
  username.value = userRemember.username ?? "";
  password.value = userRemember.password ?? "";
  remember.checked = userRemember.isRemember ?? false;
}

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

  if (password.value === "") {
    document.querySelector(".error-password").innerHTML =
      "<strong>Lỗi: </strong> Xin điền mật khẩu.";
    isCheckError = false;
    return;
  } else {
    document.querySelector(".error-password").innerHTML = "";
    isCheckError = true;
  }

  const isCheckUsername = userStorage.some(
    (user) => user.username === username.value
  );
  const isCheckPassword = userStorage.some(
    (user) => user.password === password.value
  );

  if (!isCheckUsername) {
    document.querySelector(".error-username").innerHTML =
      "<strong>Lỗi: </strong> Tên tài khoản không tồn tại.";
    isCheckError = false;
    return;
  } else {
    document.querySelector(".error-username").innerHTML = "";
    isCheckError = true;
  }

  if (!isCheckPassword) {
    document.querySelector(".error-password").innerHTML =
      "<strong>Lỗi: </strong> Mật khẩu không hợp lệ";
    isCheckError = false;
    return;
  } else {
    document.querySelector(".error-password").innerHTML = "";
    isCheckError = true;
  }

  return isCheckError;
};

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  if (checkErrorInputs()) {
    const user = userStorage.find((user) => {
      return (
        user.username === username.value && user.password === password.value
      );
    });
    const { id } = user;
    if (remember.checked) {
      userStorage = userStorage.map((user) => {
        delete user.isRemember;
        return user;
      });
      user.isRemember = remember.checked;
    }
    if (username.value === user.username && password.value === user.password) {
      localStorage.setItem("loginUser", id);
      location.href = `index.html`;
    }
    localStorage.setItem("userStorage", JSON.stringify(userStorage));
    document.getElementsByTagName("form")[0].reset();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (checkErrorInputs()) {
      const user = userStorage.find((user) => {
        return (
          user.username === username.value && user.password === password.value
        );
      });
      userStorage = userStorage.map((user) => {
        delete user.isRemember;
        return user;
      });
      user.isRemember = remember.checked;
      if (
        username.value === user.username &&
        password.value === user.password
      ) {
        location.href = "index.html";
      }
      localStorage.setItem("userStorage", JSON.stringify(userStorage));
      document.getElementsByTagName("form")[0].reset();
    }
  }
});

const togglePasswordType = () => {
  if (eye.getAttribute("class") === "fa-regular fa-eye-slash") {
    eye.setAttribute("class", "fa-regular fa-eye");
  } else {
    eye.setAttribute("class", "fa-regular fa-eye-slash");
  }
  password.type = password.type === "password" ? "text" : "password";
};
