window.calculateBattleWinnings = function () {
    const battleSlots = document.querySelectorAll('.battle-slot');
    let values = []
    battleSlots.forEach(battleSlot => {
        let value = getBattleSlotValue(battleSlot);
        values.push(value)
        injectBattleSlotValue(battleSlot, value)
    })

    const teamBattle = document.querySelector(".battle-teams")
    if (teamBattle) {
        const teams = teamBattle.querySelectorAll(".battle-teams__team")
        const ct = teams[0]
        injectTeamBattleValue(ct, values[0] + values[1])
        const t = teams[1]
        injectTeamBattleValue(t, values[2] + values[3])
    }
}

function getBattleSlotValue(battleSlot) {
    const battleDrops = battleSlot.querySelectorAll('.battle-inventory-drop');
    let totalValue = 0

    battleDrops.forEach(drop => {
        const priceElement = drop.querySelector('.price');
        const priceText = priceElement.textContent.trim();
        let price = parseFloat(priceText.replace(/^\$|\s*$/, "")); // Assuming price has a leading '$' and removes trailing whitespace
        totalValue += price;
    });

    return totalValue;
}

function createBattleStatElement() {
    let element = document.createElement('div');
    element.className = "counter"
    element.setAttribute('data-v-710164b2', '');
    element.style.width = 'auto';
    element.style.padding = '10px';
    element.style.pointerEvents = 'none';
    return element;
}

function injectTeamBattleValue(team, value) {
    let element = team.querySelector('.counter');
    if (!element) {
        element = createBattleStatElement();

        team.appendChild(element);
    }

    element.textContent = `Team Value: $${(value).toFixed(2)}`;
}

function injectBattleSlotValue(battleSlot, value) {
    let element = battleSlot.querySelector('.counter');
    if (!element) {
        element = createBattleStatElement();

        battleSlot.insertBefore(element, battleSlot.firstChild);
    }

    element.textContent = `Value: $${(value).toFixed(2)}`;

}

const battlesObserver = new MutationObserver(function (mutations, mutationInstance) {
    const requiredElement = document.querySelector('.battle-view__content')
    if (requiredElement) {
        calculateBattleWinnings();
        mutationInstance.disconnect();

        // listen and update when the battle inventory is updated
        const battleSlots = document.querySelectorAll('.battle-slot-inventory');
        const newObserver = new MutationObserver(function (mutations, newMutationInstance) {
            calculateBattleWinnings();
        });

        battleSlots.forEach(battleSlot => newObserver.observe(battleSlot, {
            childList: true,
            subtree: true
        }));
    }
});


function observeBattles() {
    // only observe when on cases page
    if (!window.location.href.includes('/battles/')) {
        return;
    }

    battlesObserver.observe(document, {
        childList: true,
        subtree: true
    });
}

// observe again when page is changed
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'pageChanged') {
            observeBattles();
        }
    });

observeBattles();