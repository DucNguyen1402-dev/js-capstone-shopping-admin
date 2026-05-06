import * as loginElements from "./dom.js";

let shouldRedirect = false;

const enterAdminMode = () => {
  shouldRedirect = true;

  loginElements.header.innerHTML = "⚙️ Admin Panel";
  loginElements.description.textContent = "Sign in to manage the system.";

  loginElements.emailInput.value = "ducnguyenadmin@gmail.com";
  loginElements.passWordInput.value = "123456789";

  loginElements.emailInput.classList.add("ring-1", "ring-green-500");
  loginElements.passWordInput.classList.add("ring-1", "ring-green-500");
};

loginElements.adminLoginBtn.addEventListener("click", enterAdminMode);

loginElements.signInBtn.addEventListener("click", (e) => {
  if (!shouldRedirect) return;

  e.preventDefault();
  loginElements.backdrop.classList.remove("opacity-0", "pointer-events-none");
  loginElements.backdrop.classList.add("opacity-100", "pointer-events-auto");

  setTimeout(() => {
    window.location.href = "admin.html";
  }, 1500);
});
