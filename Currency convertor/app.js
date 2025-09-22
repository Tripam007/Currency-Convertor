const Base_URL = "https://2024-03-06.currency-api.pages.dev/v1/currencies";

// ✅ Only these currencies will show in dropdowns
const supportedCurrencies = ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD", "CNY", "CHF"];

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

window.addEventListener("load", () => {
    populateDropdowns();
    updateExchangeRate();
});

function populateDropdowns() {
    for (let select of dropdowns) {
        supportedCurrencies.forEach(currCode => {
            let option = document.createElement("option");
            option.value = currCode;
            option.innerText = currCode;

            if (select.name === "from" && currCode === "USD") {
                option.selected = true;
            } else if (select.name === "to" && currCode === "INR") {
                option.selected = true;
            }

            select.append(option);
        });

        select.addEventListener("change", (e) => {
            updateFlag(e.target);
        });

        updateFlag(select); // initial load
    }
}

function updateFlag(element) {
    const currCode = element.value;
    const countryCode = countryList[currCode] || "US"; // fallback if not found
    const img = element.parentElement.querySelector("img");

    if (img) {
        img.src = `https://flagsapi.com/${countryCode}/shiny/64.png`;

        // Optional: fallback if flag doesn't exist
        img.onerror = () => {
            img.src = `https://flagsapi.com/US/shiny/64.png`;
        };
    }
}

btn.addEventListener("click", (e) => {
    e.preventDefault();
    updateExchangeRate();
});

async function updateExchangeRate() {
    const amountInput = document.querySelector(".amount input");
    let amtVal = parseFloat(amountInput.value);

    if (isNaN(amtVal) || amtVal <= 0) {
        amtVal = 1;
        amountInput.value = "1";
    }

    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();
    const url = `${Base_URL}/${from}.json`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const rate = data[from]?.[to];

        if (!rate) {
            msg.innerText = `Rate for "${from.toUpperCase()}" to "${to.toUpperCase()}" not available.`;
            return;
        }

        const convertedAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
    } catch (err) {
        msg.innerText = "Error fetching exchange rate.";
        console.error("Fetch error:", err);
    }
}
