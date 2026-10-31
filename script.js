
const STORAGE_KEY = "nexora_business_data";

let data = {
  products: [],
  sales: []
};

try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed.products) && Array.isArray(parsed.sales)) {
      data = parsed;
    }
  }
} catch (error) {
  console.error("Could not load saved data:", error);
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.toggle("active", page.id === pageId);
  });

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  renderApp();
}

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.page);
  });
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.go);
  });
});

document.getElementById("productForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = Number(document.getElementById("productPrice").value);
  const stock = Number(document.getElementById("productStock").value);

  if (!name || !Number.isFinite(price) || price <= 0 ||
      !Number.isInteger(stock) || stock < 0) {
    alert("Please enter a valid product name, price, and stock amount.");
    return;
  }

  data.products.push({
    id: Date.now() + Math.random(),
    name,
    price,
    stock
  });

  saveData();
  event.target.reset();
  renderApp();
});

document.getElementById("saleForm").addEventListener("submit", event => {
  event.preventDefault();

  const productId = Number(document.getElementById("saleProduct").value);
  const quantity = Number(document.getElementById("saleQuantity").value);

  const product = data.products.find(item => item.id === productId);
  const message = document.getElementById("saleMessage");

  if (!product) {
    message.textContent = "Please select a product.";
    return;
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    message.textContent = "Enter a valid quantity.";
    return;
  }

  if (quantity > product.stock) {
    message.textContent = "Not enough stock available.";
    return;
  }

  product.stock -= quantity;

  data.sales.unshift({
    id: Date.now() + Math.random(),
    productName: product.name,
    quantity,
    total: product.price * quantity,
    date: new Date().toLocaleString()
  });

  saveData();
  message.textContent = "Sale recorded successfully!";
  document.getElementById("saleQuantity").value = 1;
  renderApp();
});

function money(amount) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

function renderProducts() {
  const list = document.getElementById("productList");
  const selector = document.getElementById("saleProduct");

  list.innerHTML = "";
  selector.innerHTML = '<option value="">Select a product</option>';

  if (data.products.length === 0) {
    list.textContent = "No products yet. Add your first product above!";
    return;
  }

  data.products.forEach(product => {
    const row = document.createElement("div");
    row.className = "product-row";

    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = product.name;

    const info = document.createElement("p");
    info.textContent = `${money(product.price)} • ${product.stock} in stock`;

    details.append(name, info);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      if (confirm(`Delete ${product.name}?`)) {
        data.products = data.products.filter(item => item.id !== product.id);
        saveData();
        renderApp();
      }
    });

    row.append(details, deleteButton);
    list.appendChild(row);

    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.name} (${product.stock} available)`;
    option.disabled = product.stock === 0;
    selector.appendChild(option);
  });
}

function renderHistory() {
  const history = document.getElementById("salesHistory");
  history.innerHTML = "";

  if (data.sales.length === 0) {
    history.textContent = "No sales recorded yet.";
    return;
  }

  data.sales.forEach(sale => {
    const row = document.createElement("div");
    row.className = "sale-row";

    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = sale.productName;

    const date = document.createElement("p");
    date.textContent = `${sale.quantity} sold • ${sale.date}`;

    details.append(name, date);

    const total = document.createElement("strong");
    total.textContent = money(sale.total);

    row.append(details, total);
    history.appendChild(row);
  });
}

function renderDashboard() {
  const revenue = data.sales.reduce((sum, sale) => sum + sale.total, 0);
  const orders = data.sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const lowStock = data.products.filter(product => product.stock <= 5).length;

  document.getElementById("totalRevenue").textContent = money(revenue);
  document.getElementById("totalOrders").textContent = orders;
  document.getElementById("totalProducts").textContent = data.products.length;
  document.getElementById("lowStock").textContent = lowStock;
}

function renderApp() {
  renderDashboard();
  renderProducts();
  renderHistory();
}

renderApp();

// Finish the opening animation and reveal the application.
window.addEventListener("load", () => {
  setTimeout(() => {
    const intro = document.getElementById("intro");
    if (intro) intro.remove();
  }, 2900);
});
