function calculateAverageValue(outcomes) {
    let totalValue = 0;
    for (const item of outcomes) {
        totalValue += item.value;
    }

    return totalValue; // Adjust the multiplier as needed
}

function calculateOddsToProfit(outcomes, casePrice) {
    let oddsToProfit = 0;
    for (const item of outcomes) {
        if (item.price >= casePrice) {
            oddsToProfit += item.chance;
        }
    }

    return oddsToProfit; // Adjust the multiplier as needed
}


function getAllOutcomes() {
    const caseItemListElement = document.querySelector('.skins-list.items-list')
    const outcomes = caseItemListElement.querySelectorAll('.pf-table-row-link');

    // Replace this with your logic to calculate the percentage based on the provided caseItems elements.
    // You can iterate through the elements, extract relevant data, and perform calculations to determine the percentage.
    let result = [];

    outcomes.forEach(outcome => {
        // console.log(outcome)
        const chanceElement = outcome.querySelector('.table-cell.odds');
        // console.log(chanceElement)

        const chanceText = chanceElement.textContent.trim();
        // Extract the numerical value from the chance text (replace as needed)
        let chance = parseFloat(chanceText.replace(/%$/, "")); // Assuming chance is a percentage
        // console.log("chance: " + chance)


        const priceElement = outcome.querySelector('.price');
        const priceText = priceElement.textContent.trim();
        let price = parseFloat(priceText.replace(/^\$|\s*$/, "")); // Assuming price has a leading '$' and removes trailing whitespace
        // console.log("price: " + price)

        let value = chance * price;
        // console.log(value)

        result.push({ "chance": chance, "price": price, "value": value })
    });

    // Example placeholder calculation (assuming you want the count of caseItems as the percentage)
    return result; // Adjust the multiplier as needed
}


function injectHTML() {
    console.log("inject html")

    // get all outcomes
    let outcomes = getAllOutcomes()

    // Get the average value of the case
    const averageValue = calculateAverageValue(outcomes);

    // get case price
    let casePriceElement = document.querySelectorAll('[data-qa="sticker_case_price_element"]')[0];
    let casePriceText = casePriceElement.textContent.trim();
    let casePrice = parseFloat(casePriceText.replace(/^\$|\s*$/, ""));

    let profitability = averageValue / casePrice;

    let oddsToProfit = calculateOddsToProfit(outcomes, casePrice)

    // Find the element to inject the percentage
    const openButtonsWrapper = document.querySelector('.open-buttons-wrapper');

    if (openButtonsWrapper) {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-v-710164b2', '');
        wrapper.className = "case-multiple-switcher"
        openButtonsWrapper.appendChild(wrapper);

        const avgReturnElement = document.createElement('button');
        avgReturnElement.className = "counter"
        avgReturnElement.setAttribute('data-v-710164b2', '');
        avgReturnElement.textContent = `AVG RETURN: $${(averageValue / 100).toFixed(2)}`;
        avgReturnElement.style.width = 'auto';
        avgReturnElement.style.padding = '10px';
        avgReturnElement.style.pointerEvents = 'none';
        wrapper.appendChild(avgReturnElement);

        const percentageElement = document.createElement('button');
        percentageElement.className = "counter"
        percentageElement.setAttribute('data-v-710164b2', '');
        percentageElement.textContent = `PROFITABILITY: ${profitability.toFixed(2)}%`;
        percentageElement.style.width = 'auto';
        percentageElement.style.padding = '10px';
        percentageElement.style.pointerEvents = 'none';
        wrapper.appendChild(percentageElement);

        const oddsToProfitElement = document.createElement('button');
        oddsToProfitElement.className = "counter"
        oddsToProfitElement.setAttribute('data-v-710164b2', '');
        oddsToProfitElement.textContent = `ODDS TO PROFIT: ${oddsToProfit.toFixed(2)}%`;
        oddsToProfitElement.style.width = 'auto';
        oddsToProfitElement.style.padding = '10px';
        oddsToProfitElement.style.pointerEvents = 'none';
        wrapper.appendChild(oddsToProfitElement);
    } else {
        console.warn("Element with class 'open-buttons-wrapper' not found");
    }
}


const casesObserver = new MutationObserver(function (mutations, mutationInstance) {
    const caseItemListElement = document.querySelector('.skins-list.items-list')
    const someDiv = document.querySelectorAll('[data-qa="sticker_case_price_element"]');
    // if (!document.documentElement.dataset.scriptExecuted && someDiv && caseItemListElement) {
    //     injectHTML();
    // mutationInstance.disconnect();
    //     document.documentElement.dataset.scriptExecuted = true; // execute only once
    // }
    if (someDiv && caseItemListElement) {
        injectHTML();
        mutationInstance.disconnect();
    }
});

casesObserver.observe(document, {
    childList: true,
    subtree: true
});

// observe again when page is changed
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'pageChanged') {
            casesObserver.observe(document, {
                childList: true,
                subtree: true
            });
        }
    });
