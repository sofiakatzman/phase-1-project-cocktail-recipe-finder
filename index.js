//sends request for data from server
const url = "http://localhost:3000/recipes"

//DOM element selectors that collect user filter labels
const form = document.querySelector('form')
const dropdownSpiritBase = document.querySelector('#dropdownSpiritBase')
const dropdownMixer = document.querySelector('#dropdownMixer')
let divCollect = document.querySelector('#recipe-display')

//event listener that waits for button to be clicked to store the filter label data
form.addEventListener('submit', (event) => {
  event.preventDefault()

  // //below line clears the recipe cards or error message that are being displayed so only new results are seen
  document.querySelectorAll('.card').forEach(e => e.remove());
  document.querySelectorAll('.no-match').forEach(e => e.remove())

  //this captures the values that were entered at time of form submission
  const selectedSpiritBase = dropdownSpiritBase.value
  const selectedMixer = dropdownMixer.value

  //server fetch request to retrieve json data
  fetch(url)
  .then(response => response.json())
  .then(data => {
    data.forEach(recipe => { 

  //function that checks if json results match form filters
    if(recipe.baseSpirit === selectedSpiritBase && recipe.mixer === selectedMixer){
      displayRecipeCard(recipe)  
      }},        
      )
      displayError()},)
  .catch(error => console.error(error))
})

//function that checks for results, if there are none then it displays a "try again" error
function displayError(){
  let checkH5 = document.querySelector('h5')
  if (checkH5 === null){
  const tryAgainDiv = document.createElement('div')
  tryAgainDiv.setAttribute('class','no-match')
  tryAgainDiv.innerText = "No luck! Please try a different combination!"
  divCollect.appendChild(tryAgainDiv)
}}

function displayRecipeCard(recipe){
  // creates a heading for drink name
  const h5 = document.createElement('h5')
  h5.innerText= "Ingredients:";
  const h4 = document.createElement('h4')
  h4.innerText = recipe.name

  // displays drink photo
  const img = document.createElement('img')
    img.setAttribute('src', recipe.imageURL)

  //creates a paragraph element that can hold drink ingredients
    img.setAttribute('class', 'recipe-photo')
    const pLikes = document.createElement('p')
    pLikes.innerText = `Recipe Likes: ${recipe.likeCount}`

  //trying to create a list of ingredients as li elements - for each loop because it is an array of ingredients
      const ul = document.createElement("ul");
      const ingredients = recipe.ingredientsList
      ingredients.forEach(item => {
        const li = document.createElement("li")
        li.textContent = item
        ul.appendChild(li)
  })

  //displays instructions
   const p = document.createElement("p")
    p.innerText = recipe.instructions

  //creates like button 
    const btn = document.createElement('button')
    btn.setAttribute('class', 'like-btn')
    btn.setAttribute('id', `${recipe.id}`)
    btn.innerText = "like"

  //puts all new elements together into one card
    const divCard = document.createElement('div')
    divCard.setAttribute('class', 'card')
    divCard.append(h4, img, h5, ul, p, pLikes, btn)
    divCollect.append(divCard)

    //event listener for card  being hovered over - will change its background color
    divCard.addEventListener("mouseover", () => divCard.setAttribute("style", "background-color:rgb(216, 232, 178);"));
    divCard.addEventListener("mouseout", () => divCard.setAttribute("style", "background-color:white;"));

    // event listener for like button being clicked & changes it's color for one mili se
    divCard.querySelector('.like-btn').addEventListener('click', () => {
      recipe.likeCount += 1;
      pLikes.innerText = `Recipe Likes: ${recipe.likeCount}`
      setTimeout(() =>  btn.classList.toggle("likeClick"), 100)
      btn.classList.toggle("likeClick")

      //fetch request to update server db per like status
      fetch (`http://localhost:3000/recipes/${recipe.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
  
        body: JSON.stringify(recipe)
      })
      .then (res => res.json())
      .then()
    })
}
