document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const logoutBtn = document.querySelector(".logout-btn");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");
      window.location.href = href;
    });
  });

  logoutBtn.addEventListener("click", () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    // Redirect to login page
    window.location.href = "login.html";
  });
});
