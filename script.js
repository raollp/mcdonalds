let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = "#FFFFFF";
tg.MainButton.color = "#2cab37";

let item = {
    burger: 0,
    fries: 0,
    pizza: 0,
    coke: 0,
    donut: 0,
    hdog: 0
};

let prices = {
    burger: 15.01,
    fries: 10.15,
    pizza: 25.00,
    coke: 9.99,
    donut: 5.55,
    hdog: 13.80
};

let products = ["burger", "fries", "pizza", "coke", "donut", "hdog"];

function countTotal() {
    let sum = 0;

    for (let key in item) {
        sum += item[key] * prices[key];
    }

    return sum;
}

function updateMainButton() {
    let total = countTotal();

    if (total > 0) {
        tg.MainButton.setText("В корзине товаров на " + total.toFixed(2) + " zl. Оплатить");
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

function createBadge(productName) {
    let productButton = document.getElementById(productName);
    let productBlock = productButton.closest(".item");
    let imgBlock = productBlock.querySelector(".img_block");

    let badge = document.createElement("div");
    badge.id = productName + "_badge";
    badge.classList.add("badge");
    badge.innerText = item[productName];

    imgBlock.appendChild(badge);
}

function updateBadge (productName) {
    let badge = document.getElementById(productName + "_badge");

    if (item[productName] > 0) {
        if (badge) {
        badge.innerText = item[productName];
        } else {
        createBadge (productName);
        }
    } else {
        if (badge) {
        badge.remove();
        }
    }
}

function showCounter(productName) {

    let addButton = document.getElementById(productName);
    let buttonBlock = addButton.parentElement;

    addButton.classList.add("hidden");

    let oldControls = document.getElementById(productName + "_controls");
    if (oldControls) {
        oldControls.remove();
    }

    let controls = document.createElement("div");
    controls.id = productName + "_controls";
    controls.classList.add("controls");

    let minusButton = document.createElement("button");
    minusButton.id = productName + "_minus";
    minusButton.innerText = "-";
    minusButton.classList.add("btn_minus");

    let countText = document.createElement("span");
    countText.id = productName + "_count";
    countText.classList.add("sum");
    countText.innerText = (item[productName] * prices[productName]).toFixed(2) + " zl";

    let plusButton = document.createElement("button");
    plusButton.id = productName + "_plus";
    plusButton.innerText = "+";
    plusButton.classList.add("btn_plus");

    controls.appendChild(minusButton);
    controls.appendChild(countText);
    controls.appendChild(plusButton);

    buttonBlock.appendChild(controls);

    plusButton.addEventListener("click", function () {
    item[productName] += 1;
    updateProduct(productName);
    });

    minusButton.addEventListener("click", function () {
        if (item[productName] > 0) {
            item[productName] -= 1;
        }
        updateProduct(productName);
    });
}

function hideCounter(productName) {
    let addButton = document.getElementById(productName);
    let controls = document.getElementById(productName + "_controls");

    if (controls) {
        controls.remove();
    }

    addButton.classList.remove("hidden");
}

function updateProduct (productName) {
    if (item[productName] <= 0) {
        item[productName] = 0;
        hideCounter (productName);
    } else {
        let countText = document.getElementById(productName + "_count");
        if (countText) {
        countText.innerText = (item[productName] * prices[productName]).toFixed(2) + " zl";
        } else {
        showCounter (productName);
        }
    }
    updateBadge (productName);
    updateMainButton();
}

products.forEach(function (productName) {
    let button = document.getElementById(productName);

    if (button) {
        button.addEventListener("click", function () {
        item[productName] = 1;
        showCounter(productName);
        updateBadge(productName);
        updateMainButton();
        });
    }
});

tg.onEvent("mainButtonClicked", function () {
    let result = "";
    for (let key in item) {
        if (item[key] > 0) {
        result += key + ":" + item[key] + ";";
        }
    }
    tg.sendData(result);
});

let usercard = document.getElementById("usercard");

if (usercard) {
    let p = document.createElement("p");
    p.innerText = "Hi!";
    usercard.appendChild(p);
}
