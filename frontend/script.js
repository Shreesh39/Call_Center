document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const logoutBtn = document.querySelector(".logout-btn");
  const logoutBtn2 = document.querySelector(".logout-btn2");
  const logoutBtn3 = document.querySelector(".logout-btn3");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");
      window.location.href = href;
    });
  });

  logoutBtn.addEventListener("click", () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
  });
  logoutBtn2.addEventListener("click", () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
  });
  logoutBtn3.addEventListener("click", () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
  });
});
