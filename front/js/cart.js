const cart = []
retrieveItems()
cart.forEach(item => displayItem(item)) // Pour chaque éléments dans le cart, displayItem

const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e))

// loop qui recupere les éléments dans le localstorage
function retrieveItems() {
    const numberOfItems = localStorage.length
    for (let i = 0; i < numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i)) || ""
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
    }
}

// Fabrication global pour chaque item
function displayItem(item) {
    const article = makeArticle(item)
    const imageDiv = makeImage(item)
    article.appendChild(imageDiv)

    const cartItemContent = makeCartItemContent(item)
    article.appendChild(cartItemContent)
    displayArticle(article)

    displayTotalQuantity()
    displayTotalPrice()
}

// fabrication article
function makeArticle(item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

// affichage article dans l'id cart__items
function displayArticle(article) {
    document.getElementById("cart__items").appendChild(article)
}

// fabrication image
function makeImage(item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt
    div.appendChild(image)
    return div
}

// fabrication global item content
function makeCartItemContent(item) {
    const cartItemContent = document.createElement("div")
    cartItemContent.classList.add("cart__item__content")

    const description = makeDescription(item)
    const settings = makeSettings(item)

    cartItemContent.appendChild(description)
    cartItemContent.appendChild(settings)
    return cartItemContent
}

// fabrication description
function makeDescription(item) {
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.title
    const p = document.createElement("p")
    p.textContent = item.color
    const p2 = document.createElement("p")
    p2.textContent = item.price + " €"

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)
    return description
}

// fabrication global content settings
function makeSettings(item) {
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    addQuantityToSettings(settings, item)
    addDeleteToSettings(settings, item)
    return settings
}

// fabrication de l'input ou l'on pourra modifier la quantitée
function addQuantityToSettings(settings, item) {
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")

    const p = document.createElement("p")
    p.textContent = "Qté : "
    quantity.appendChild(p)

    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity
    input.addEventListener("input", () => updatePriceAndQuantity(item.id, input.value, item))

    quantity.appendChild(input)
    settings.appendChild(quantity)

}

// update du prix selon la quantitée
function updatePriceAndQuantity(id, newValue, item) {
    const itemUpdate = cart.find(item => item.id === id)
    itemUpdate.quantity = Number(newValue)
    item.quantity = itemUpdate.quantity
    displayTotalQuantity()
    displayTotalPrice()
    saveNewDataToLocalStorage(item)
}

// Sauvegarde des nouvelles données dans le local storage
function saveNewDataToLocalStorage(item) {
    const dataSave = JSON.stringify(item)
    localStorage.setItem(`${item.id}-${item.color}`, dataSave)
}

// fabrication du p "Supprimer" avec ecoute lors d'un clic
function addDeleteToSettings(settings, item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    
    div.addEventListener("click", () => deleteItem(item))

    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

// Suppression global lors du clic 
function deleteItem(item) {
    const itemToDelete = cart.findIndex((product) => product.id === item.id && product.color === item.color)
    cart.splice(itemToDelete, 1)
    displayTotalPrice()
    displayTotalQuantity()
    deleteDataToLocalStorage(item)
    deleteArticleFromPage(item)
}

// Supprime du localstorage
function deleteDataToLocalStorage(item) {
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
}

// Supprime de la page
function deleteArticleFromPage(item) {
    const articleToDelete = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`
    )
    articleToDelete.remove()
}

// Affichage de la quantitée global
function displayTotalQuantity() {
    let total = 0
    const totalQuantity = document.getElementById("totalQuantity")
    cart.forEach(item => total = total + item.quantity)
    totalQuantity.textContent = total
}

// Affichage du prix global
function displayTotalPrice() {
    let total = 0
    const totalPrice = document.getElementById("totalPrice")
    cart.forEach(item => {
        const totalItemPrice = item.price * item.quantity
        total = total + totalItemPrice
    })
    totalPrice.textContent = total
}

// fonction pour soumettre le formulaire
function submitForm(e) {
    e.preventDefault()
    if (cart.length === 0) {
        alert("Veuillez remplir le panier.") // Si le panier est vide pop up d'alerte
        return
    }

//    if (validateForm()) return
    if (validateEmail()) return

    const body = makeRequestBody()
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((data) => {
            const orderId = data.orderId
            window.location.href = "confirmation.html" + "?orderId=" + orderId
        })
        .catch((err) => console.error(err))
}

// fonction de validation du formulaire
//function validateForm() {
//    const form = document.querySelector(".cart__order__form")
//    const inputs = document.querySelectorAll("input")
//    inputs.forEach((input) => {
//        if (input.value === "") {
//            alert("Veuillez remplir tous les champs demandé.")
//            return true
//        }
//        return false
//    })
//}

// p error message
const prenom = document.getElementById("firstName")
const nom = document.getElementById("lastName")
const adresse = document.getElementById("address")
const ville = document.getElementById("city")

let valuePrenom, valueNom, valueAdresse, valueVille;

prenom.addEventListener("input", function (e) {
    valuePrenom;
    if (e.target.value.length == 0) {
        firstNameErrorMsg.innerHTML = "";
        valuePrenom = null;
    }
    else if (e.target.value.length < 3 || e.target.value.length > 25){
        firstNameErrorMsg.innerHTML = "Prenom doit contenir entre 3 et 25 caractères"
        valuePrenom = null
    }
    if (e.target.value.match(/^[a-z A-Z]{3,25}$/)){
        firstNameErrorMsg.innerHTML = ""
        valuePrenom = e.target.value
    }
    if (!e.target.value.match(/^[a-z A-Z]{3,25}$/) &&
    e.target.value.length > 3 &&
    e.target.value.length < 25){
        firstNameErrorMsg.innerHTML = "Prenom ne doit pas contenir de caractères spécial, chiffre ou accent"
        valuePrenom = null;
    }
})

nom.addEventListener("input", function (e) {
    valueNom;
    if (e.target.value.length == 0) {
        lastNameErrorMsg.innerHTML = "";
        valueNom = null;
    }
    else if (e.target.value.length < 3 || e.target.value.length > 25) {
        lastNameErrorMsg.innerHTML = "Nom doit contenir entre 3 et 25 caractères"
        valueNom = null
    }
    if (e.target.value.match(/^[a-z A-Z]{3,25}$/)) {
        lastNameErrorMsg.innerHTML = ""
        valueNom = e.target.value
    }
    if (!e.target.value.match(/^[a-z A-Z]{3,25}$/) &&
        e.target.value.length > 3 &&
        e.target.value.length < 25) {
        lastNameErrorMsg.innerHTML = "Nom ne doit pas contenir de caractères spécial, chiffre ou accent"
        valueNom = null;
    }
})

adresse.addEventListener("input", function (e) {
    valueAdresse;
    if (e.target.value.length == 0) {
        addressErrorMsg.innerHTML = "";
        valueAdresse = null;
    }
    else if (e.target.value.length < 3 || e.target.value.length > 50) {
        addressErrorMsg.innerHTML = "Adresse doit contenir entre 3 et 50 caractères"
        valueAdresse = null
    }
    if (e.target.value.match(/^[1-9]{1}[0-9]{0,3} [a-z A-Z]{3,50}$/)) {
        addressErrorMsg.innerHTML = ""
        valueAdresse = e.target.value
    }
    if (!e.target.value.match(/^[1-9]{1}[0-9]{0,3} [a-z A-Z]{3,50}$/) &&
        e.target.value.length > 3 &&
        e.target.value.length < 50) {
        addressErrorMsg.innerHTML = "Adresse invalide"
        valueAdresse = null;
    }
})

ville.addEventListener("input", function (e) {
    valueVille;
    if (e.target.value.length == 0) {
        cityErrorMsg.innerHTML = "";
        valueVille = null;
    }
    else if (e.target.value.length < 3 || e.target.value.length > 25) {
        cityErrorMsg.innerHTML = "Ville doit contenir entre 3 et 25 caractères"
        valueVille = null
    }
    if (e.target.value.match(/^[a-z A-Z]{3,25}$/)) {
        cityErrorMsg.innerHTML = ""
        valueVille = e.target.value
    }
    if (!e.target.value.match(/^[a-z A-Z]{3,25}$/) &&
        e.target.value.length > 3 &&
        e.target.value.length < 25) {
        cityErrorMsg.innerHTML = "Ville ne doit pas contenir de caractères spécial, chiffre ou accent"
        valueVille = null;
    }
})

email.addEventListener("input" , (e) => {
    if(e.target.value.length == 0){
        emailErrorMsg.innerHTML = ""
        valueEmail = null;
    }
    else if (e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)){
        emailErrorMsg.innerHTML = "";
        valueEmail = e.target.value;
    }
    if (!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) && !e.target.value.length == 0){
        emailErrorMsg.innerHTML = "Veuillez rensseigner un email valide. <br>  Exemple: jean@gmail.com";
    }
})

// fonction de validation de l'email
function validateEmail() {
    const email = document.querySelector("#email").value
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    if (regex.test(email) === false) {
        alert("Veuillez rensseigner un email valide.")
        return true
    }
    return false
}

// Récupère les éléments renseigné
function makeRequestBody() {
    const form = document.querySelector(".cart__order__form")
    const firstName = form.elements.firstName.value
    const lastName = form.elements.lastName.value
    const address = form.elements.address.value
    const city = form.elements.city.value
    const email = form.elements.email.value
    
    const body = { 
      contact: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
        },
        products: getIdFromLocalStorage()
    }
    return body
}

// récupère l'id du localStorage
function getIdFromLocalStorage() {
    const numberOfProducts = localStorage.length
    const ids = []
    for (let i = 0; i < numberOfProducts; i++) {
        const key = localStorage.key(i)
        const id = key.split("-")[0]
        ids.push(id)
    }
    return ids
}