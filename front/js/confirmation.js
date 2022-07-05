const orderId = getOrderId()
displayOrderId(orderId)
removeAllCacheInLocalStorage()

// recupere l'orderId
function getOrderId() {
    const idUrl = window.location.search
    const searchParams = new URLSearchParams(idUrl)
    return searchParams.get("orderId")
}

// Affiche l'orderId
function displayOrderId(orderId) {
    const orderIdElement = document.getElementById("orderId")
    orderIdElement.textContent = orderId
}

// Supprime caches du local storage
function removeAllCacheInLocalStorage () {
    const cache = window.localStorage
    cache.clear()
}