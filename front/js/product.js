const idUrl = window.location.search
const searchParams = new URLSearchParams(idUrl)
const id = searchParams.get("id")

fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((res) => canapInformation(res))

function canapInformation(canap) {
    //  const altTxt = canap.altTxt
    //  const colors = canap.colors
    //  const description = canap.description
    //  const imageUrl = canap.imageUrl
    //  const name = canap.name
    //  const price = canap.price
    const {altTxt, colors, description, imageUrl, name, price} = canap
    makeImage(imageUrl, altTxt)
    makeTitle(name)
    makePrice(price)
    makeDescription(description)
    makeColors(colors)
}

function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img")
    if (parent != null) parent.appendChild(image)
    return image
}

function makeTitle(name) {
    const h1 = document.getElementById("title")
    if (h1 != null) h1.textContent = name
}

function makePrice(price) {
    const span = document.getElementById("price")
    if (span != null) span.textContent = price
}

function makeDescription(description) {
    const p = document.getElementById("description")
    if (p != null) p.textContent = description
}

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