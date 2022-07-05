// on va chercher l'id dans l'url
const idUrl = window.location.search
const searchParams = new URLSearchParams(idUrl)
const id = searchParams.get("id")
if (id != null) {
    let itemPrice = 0
    let itemTitle = 0
    let itemImage, itemAltTxt = 0
}

// requete au serveur pour récupérer toutes les informations dans l'id du produit
fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((res) => canapInformation(res))

// récupération des données
    function canapInformation(canap) {
    //  const altTxt = canap.altTxt
    //  const colors = canap.colors
    //  const description = canap.description
    //  const imageUrl = canap.imageUrl
    //  const name = canap.name
    //  const price = canap.price
    const {altTxt, colors, description, imageUrl, name, price} = canap
    makeImage(imageUrl, altTxt)
    itemImage = imageUrl
    itemAltTxt = altTxt
    makeTitle(name)
    itemTitle = name
    makePrice(price)
    itemPrice = price
    makeDescription(description)
    makeColors(colors)
}

// creation et insertion img
function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img")
    if (parent != null) parent.appendChild(image)
    return image
}

// creation du title h1
function makeTitle(name) {
    const h1 = document.getElementById("title")
    if (h1 != null) h1.textContent = name
}

// creation du span avec le prix
function makePrice(price) {
    const span = document.getElementById("price")
    if (span != null) span.textContent = price
}

// creation du paragraphe contenant la description
function makeDescription(description) {
    const p = document.getElementById("description")
    if (p != null) p.textContent = description
}

// creation du champs de selection contenant les couleurs que propose le produit
function makeColors(colors) {
    const select = document.getElementById("colors")
    if (select != null) {
        colors.forEach((color) => {
            const option = document.createElement("option")
            option.value = color
            option.textContent = color
            select.appendChild(option)
        });
    }
}

// Ajout addEventListener qui recupère les informations lors du clic sur ajouter au panier et les envois dans le local storage
const addToCart = document.getElementById("addToCart")
addToCart.addEventListener("click", (e) => {
    const color = document.getElementById("colors").value
    const quantity = document.getElementById("quantity").value
    if (color == null || color === "" || quantity == null || quantity === "0") {
        alert("Veuillez renseigner une couleur et une quantité avant d'ajouter au panier.")
        return true
    }
    const data = {
        id: id,
        color: color,
        quantity: Number(quantity),
        title: itemTitle,
        price: itemPrice,
        imageUrl: itemImage,
        altTxt: itemAltTxt
    }
    localStorage.setItem(`${id}-${color}`, JSON.stringify(data))
    window.location.href = "cart.html"
})

