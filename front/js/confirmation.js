const orderId = getOrderId()
displayOrderId(orderId)
removeAllCacheInLocalStorage()

function getOrderId() {
    const idUrl = window.location.search
    const searchParams = new URLSearchParams(idUrl)
    return searchParams.get("orderId")
}

function displayOrderId(orderId) {
    const orderIdElement = document.getElementById("orderId")
    orderIdElement.textContent = orderId
}

function removeAllCacheInLocalStorage () {
    const cache = window.localStorage
    cache.clear()
}