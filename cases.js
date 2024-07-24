function calculateAverageValue(outcomes) {
    let totalValue = 0;
    for (const item of outcomes) {
        totalValue += item.value;
    }

    return totalValue;
}

function calculateOddsToProfit(outcomes, casePrice) {
    let oddsToProfit = 0;
    for (const item of outcomes) {
        if (item.price >= casePrice) {
            oddsToProfit += item.chance;
        }
    }

    return oddsToProfit;
}


function getAllOutcomes() {
    const caseItemListElement = document.querySelector('.skins-list.items-list')
    const outcomes = caseItemListElement.querySelectorAll('.pf-table-row-link');

    let result = [];

    outcomes.forEach(outcome => {
        const chanceElement = outcome.querySelector('.table-cell.odds');
        const chanceText = chanceElement.textContent.trim();
        // Extract the numerical value from the chance text (replace as needed)
        let chance = parseFloat(chanceText.replace(/%$/, "")); // Assuming chance is a percentage

        const priceElement = outcome.querySelector('.price');
        const priceText = priceElement.textContent.trim();
        let price = parseFloat(priceText.replace(/^\$|\s*$/, "")); // Assuming price has a leading '$' and removes trailing whitespace

        let value = chance * price;

        result.push({ "chance": chance, "price": price, "value": value })
    });

    return result;
}

function createCaseStatElement() {
    const element = document.createElement('button');
    element.className = "counter"
    element.setAttribute('data-v-710164b2', '');
    element.style.width = 'auto';
    element.style.padding = '10px';
    element.style.pointerEvents = 'none';
    return element;
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

    if (!openButtonsWrapper) {
        console.warn("Element with class 'open-buttons-wrapper' not found");
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-v-710164b2', '');
    wrapper.className = "case-multiple-switcher"
    openButtonsWrapper.appendChild(wrapper);

    const avgReturnElement = createCaseStatElement();
    avgReturnElement.textContent = `AVG RETURN: $${(averageValue / 100).toFixed(2)}`;
    wrapper.appendChild(avgReturnElement);

    const percentageElement = createCaseStatElement();
    percentageElement.textContent = `PROFITABILITY: ${profitability.toFixed(2)}%`;
    wrapper.appendChild(percentageElement);

    const oddsToProfitElement = createCaseStatElement();
    oddsToProfitElement.textContent = `ODDS TO PROFIT: ${oddsToProfit.toFixed(2)}%`;
    wrapper.appendChild(oddsToProfitElement);

}


const casesObserver = new MutationObserver(function (mutations, mutationInstance) {
    const caseItemListElement = document.querySelector('.skins-list.items-list')
    const someDiv = document.querySelectorAll('[data-qa="sticker_case_price_element"]');
    if (someDiv && caseItemListElement) {
        injectHTML();
        mutationInstance.disconnect();
    }
});

function observeCases() {
    // only observe when on cases page
    if (!window.location.href.includes('/cases/')) {
        return;
    }

    casesObserver.observe(document, {
        childList: true,
        subtree: true
    });
}

// observe again when page is changed
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'pageChanged') {
            observeCases();
        }
    });

    observeCases();
