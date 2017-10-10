let nav = document.getElementById('nav')

nav.addEventListener("mouseover", mouseOn, false)
nav.addEventListener("mouseout", mouseOut, false)

function mouseOn() {
  nav.setAttribute("style", "background-color:red;")
}

function mouseOut() {
  nav.setAttribute("style", "background-color:blue;")
}
