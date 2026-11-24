const menuItems = [
  {
    id: "green-goddess", name: "Green Goddess Bowl", category: "Bowls", price: 13.5, rating: "4.9", time: "20–25 min", badge: "FAN FAVORITE",
    description: "Avocado, quinoa, crisp greens & herby dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "smash-burger", name: "The Classic Smash", category: "Burgers", price: 14, rating: "4.8", time: "20–30 min", badge: "BEST SELLER",
    description: "Double smash patty, melty cheddar, house sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "margherita", name: "Garden Margherita", category: "Pizza", price: 16, rating: "4.9", time: "25–30 min", badge: "WOOD FIRED",
    description: "Slow tomato, fresh mozzarella & garden basil.",
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "berry-cheesecake", name: "Berry Cheesecake", category: "Desserts", price: 8.5, rating: "5.0", time: "15–20 min", badge: "SWEET PICK",
    description: "Creamy vanilla cheesecake, bright berry compote.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "crispy-chicken", name: "Crispy Chicken Bowl", category: "Bowls", price: 15, rating: "4.8", time: "20–25 min", badge: "CRUNCHY GOOD",
    description: "Golden chicken, fluffy rice & tangy slaw.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "berry-lemonade", name: "Berry Lemonade", category: "Drinks", price: 5.5, rating: "4.9", time: "10–15 min", badge: "FRESH SQUEEZED",
    description: "Real lemons, juicy berries, a little sunshine.",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "mushroom-pizza", name: "Mushroom & Thyme", category: "Pizza", price: 17, rating: "4.7", time: "25–30 min", badge: "LOCAL PICK",
    description: "Roasted mushrooms, thyme, creamy white sauce.",
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: "choco-cookie", name: "Warm Choc Chip Cookie", category: "Desserts", price: 6, rating: "4.9", time: "15–20 min", badge: "BAKED TODAY",
    description: "Golden edges, gooey middle, sea salt finish.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=700&q=80"
  }
];

const cart = new Map();
let activeCategory = "All";
let searchQuery = "";
let toastTimer;

const menuGrid = document.querySelector("#menu-grid");
const emptyState = document.querySelector("#empty-state");
const searchInput = document.querySelector("#search-input");
const cartOverlay = document.querySelector("#cart-overlay");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartFooter = document.querySelector("#cart-footer");

function renderMenu() {
  const filtered = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const searchText = `${item.name} ${item.category} ${item.description}`.toLowerCase();
    return matchesCategory && searchText.includes(searchQuery.toLowerCase());
  });

  menuGrid.innerHTML = filtered.map((item) => `
    <article class="food-card">
      <div class="food-image-wrap">
        <img class="food-image" src="${item.image}" alt="${item.name}" loading="lazy">
        <span class="food-badge">${item.badge}</span>
        <button class="food-favorite" type="button" aria-label="Add ${item.name} to favorites" aria-pressed="false">♡</button>
      </div>
      <div class="food-info">
        <div class="food-title-row"><h3>${item.name}</h3><span class="food-price">$${item.price.toFixed(2)}</span></div>
        <p class="food-description">${item.description}</p>
        <div class="food-meta">
          <span class="food-rating"><span>★</span>${item.rating}</span>
          <span class="food-time">${item.time}</span>
          <button class="add-button" type="button" data-add="${item.id}" aria-label="Add ${item.name} to cart">+</button>
        </div>
      </div>
    </article>
  `).join("");
  emptyState.hidden = filtered.length !== 0;
  menuGrid.hidden = filtered.length === 0;
}

function updateCart() {
  const entries = Array.from(cart.values());
  const itemCount = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const subtotal = entries.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  document.querySelector("#cart-count").textContent = itemCount;
  document.querySelector("#cart-title-count").textContent = `(${itemCount})`;
  cartEmpty.hidden = entries.length !== 0;
  cartFooter.hidden = entries.length === 0;
  cartItems.innerHTML = entries.map(({ item, quantity }) => `
    <article class="cart-line">
      <img src="${item.image}" alt="">
      <div>
        <h3>${item.name}</h3>
        <span class="cart-line-price">$${item.price.toFixed(2)}</span>
        <div class="quantity-control" aria-label="Quantity for ${item.name}">
          <button type="button" data-quantity="-1" data-id="${item.id}" aria-label="Remove one ${item.name}">−</button>
          <span>${quantity}</span>
          <button type="button" data-quantity="1" data-id="${item.id}" aria-label="Add one ${item.name}">+</button>
        </div>
      </div>
      <span class="cart-line-total">$${(item.price * quantity).toFixed(2)}</span>
    </article>
  `).join("");
  document.querySelector("#cart-subtotal").textContent = `$${subtotal.toFixed(2)}`;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2300);
}

function openCart() {
  cartOverlay.hidden = false;
  document.body.classList.add("cart-open");
  document.querySelector("#close-cart").focus();
}

function closeCart() {
  cartOverlay.hidden = true;
  document.body.classList.remove("cart-open");
  document.querySelector("#open-cart").focus();
}

document.querySelector("#category-list").addEventListener("click", (event) => {
  const chip = event.target.closest("[data-category]");
  if (!chip) return;
  activeCategory = chip.dataset.category;
  document.querySelectorAll(".category-chip").forEach((button) => {
    const isActive = button === chip;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderMenu();
});

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  renderMenu();
});
document.querySelector("#search-button").addEventListener("click", () => {
  document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
  searchInput.focus({ preventScroll: true });
});

menuGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const item = menuItems.find((menuItem) => menuItem.id === addButton.dataset.add);
    const entry = cart.get(item.id);
    cart.set(item.id, { item, quantity: (entry?.quantity ?? 0) + 1 });
    updateCart();
    addButton.textContent = "Added";
    addButton.classList.add("added");
    showToast(`${item.name} added to your cart`);
    window.setTimeout(() => {
      if (addButton.isConnected) {
        addButton.textContent = "+";
        addButton.classList.remove("added");
      }
    }, 1100);
    return;
  }

  const favorite = event.target.closest(".food-favorite");
  if (favorite) {
    const isFavorite = favorite.getAttribute("aria-pressed") !== "true";
    favorite.setAttribute("aria-pressed", String(isFavorite));
    favorite.classList.toggle("is-favorite", isFavorite);
    favorite.textContent = isFavorite ? "♥" : "♡";
  }
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;
  const entry = cart.get(button.dataset.id);
  if (!entry) return;
  const quantity = entry.quantity + Number(button.dataset.quantity);
  if (quantity <= 0) cart.delete(button.dataset.id);
  else cart.set(button.dataset.id, { ...entry, quantity });
  updateCart();
});

document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
document.querySelector("#close-cart-backdrop").addEventListener("click", closeCart);
document.querySelector("#browse-menu").addEventListener("click", () => {
  closeCart();
  document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#checkout-button").addEventListener("click", () => {
  showToast("Checkout is coming soon — your cart is saved!");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cartOverlay.hidden) closeCart();
});

renderMenu();
updateCart();
