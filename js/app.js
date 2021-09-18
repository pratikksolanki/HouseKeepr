var HOUSE
var USER

$(document).ready(() => {
  fetch("../json/users.json")
  .then(response => {
    return response.json();
  })
  .then(data => {
    USER = data[localStorage.getItem('user')]
    fetch("../json/houses.json")
    .then(response => {
      return response.json();
    })
    .then(data => {
      HOUSE = data[USER['house_id']]
      console.log(USER, HOUSE)
      $('#house_header').text(HOUSE['address'])
      getGroceryData('Apple', createGroceryCards)
      $("#grocery_search_bar").on('input', function(){
        var query = $("#grocery_search_bar").val()
        getGroceryData(query, createGroceryCards)
      });
    })
  });
})

function getGroceryData(queryString="Apple", callback) {
  var endpoint = `https://edamam-food-and-grocery-database.p.rapidapi.com/parser?ingr=${queryString}`
  $.ajax({
    url : endpoint,
    type : 'GET', //method used POST or GET
    success : callback,
    error : function(result, status, error){ // Handle errors
      console.error(error)
    },
    headers: {
      "x-rapidapi-host": "edamam-food-and-grocery-database.p.rapidapi.com",
      "x-rapidapi-key": "01f31a0914mshebf9587336e25bfp16dadcjsncca61ccdae96"
    }
  })
}

function createGroceryCards (groceries) {
  cardString = ``
  for(let food of groceries.parsed) {
    food_info = food['food']
    cardString += `

    <div id='food_card_${food_info['foodId']}' data-foodId=${food_info['foodId']} class="card" style="width: auto; margin: 2.5%">
    <img src="${food_info['image'] === null ? 'https://p.kindpng.com/picc/s/79-798754_hoteles-y-centros-vacacionales-dish-placeholder-hd-png.png' : food_info['image']}" alt="${food_info['label']}" width='100px' height='100px'/>
    <div class="card-body">
      <h5 class="card-title">${food_info['label']}</h5>
      <i class="card-text">${food_info['category']}
      </i>
      <a id="add_food_btn_${food_info['foodId']}" data-category='${food_info['category']}' data-foodId='${food_info['foodId']}' data-label='${food_info['label']}' data-image='${food_info['image']}' class="btn btn-secondary">+
      </a>
    </div>
  </div>
    `
  }
  for(let food of groceries.hints) {
    food_info = food['food']
    cardString += `

    <div id='food_card_${food_info['foodId']}' data-foodId=${food_info['foodId']} class="card" style="width: auto; margin: 2.5%">
    <img src="${food_info['image'] === null ? 'https://p.kindpng.com/picc/s/79-798754_hoteles-y-centros-vacacionales-dish-placeholder-hd-png.png' : food_info['image']}" alt="${food_info['label']}" width='100px' height='100px'/>
    <div class="card-body">
      <h5 class="card-title">${food_info['label']}</h5>
      <i class="card-text">${food_info['category']}
      </i>
      <a id="add_food_btn_${food_info['foodId']}" data-category='${food_info['category']}' data-foodId='${food_info['foodId']}' data-label='${food_info['label']}' data-image='${food_info['image']}' class="btn btn-secondary">+
      </a>
    </div>
  </div>
    `
  }

  $('#groceries-container').empty()
  $("[id^='add_food_btn_']").off('click')
  $('#groceries-container').append(cardString)
  $("[id^='add_food_btn_']").on('click', (e) => {
    let data = e.target.dataset
    HOUSE['grocery_list'][data.foodid]= {foodId: data.foodid, category: data.category, label: data.label, image: data.image}
    console.log(HOUSE)
    createAddedGroceryCards()
  })
}

function createAddedGroceryCards () {
  cardString = ``
  for(let food_info of Object.values(HOUSE['grocery_list'])) {
    cardString += `

    <div id='added_card_${food_info['foodId']}' data-foodId=${food_info['foodId']} class="card" style="width: auto; margin: 2.5%">
    <img src="${food_info['image'] === null ? 'https://p.kindpng.com/picc/s/79-798754_hoteles-y-centros-vacacionales-dish-placeholder-hd-png.png' : food_info['image']}" alt="${food_info['label']}" width='100px' height='100px'/>
    <div class="card-body">
      <h5 class="card-title">${food_info['label']}</h5>
      <i class="card-text">${food_info['category']}
      </i>
      <a id="remove_food_btn_${food_info['foodId']}" data-foodId='${food_info['foodId']}' class="btn btn-secondary">-
      </a>
    </div>
  </div>
    `
  }
  $('#added-groc-container').empty()
  $("[id^='remove_food_btn_']").off('click')
  $('#added-groc-container').append(cardString)
  $("[id^='remove_food_btn_']").on('click', (e) => {
    delete HOUSE['grocery_list'][e.target.dataset.foodid]
    console.log(HOUSE)
    createAddedGroceryCards()
  })
}


