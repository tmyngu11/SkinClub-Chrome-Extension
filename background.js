// sends a message whenever a page is updated
chrome.runtime.onInstalled.addListener(function () {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        chrome.tabs.sendMessage(tabId, {
            message: 'pageChanged',
            url: changeInfo.url
        })
    })
});