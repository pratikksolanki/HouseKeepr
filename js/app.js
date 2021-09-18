$(document).ready(() => {
  getGroceryData('', createGroceryCards)
  $("#grocery_search_bar").on('input', function(){
    var query = $("#grocery_search_bar").val()
    getGroceryData(query, createGroceryCards)
  });
})

function getGroceryData(queryString="", callback) {
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
    <img src="${food_info['image'] === null ? 'https://p.kindpng.com/picc/s/79-798754_hoteles-y-centros-vacacionales-dish-placeholder-hd-png.png' : food_info['image']}" alt="${food_info['label']}" width='50px' height='50px'/>
    <div class="card-body">
      <h5 class="card-title">${food_info['label']}</h5>
      <i class="card-text">${food_info['category']}
      </i>
      <a href="#" class="btn btn-primary purple">Accept</a>
      <a href="#" class="btn btn-secondary">
        <i class="feather-sm" data-feather="maximize-2"></i>
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
      <a href="#" class="btn btn-primary purple">Accept</a>
      <a href="#" class="btn btn-secondary">
        <i class="feather-sm" data-feather="maximize-2"></i>
      </a>
    </div>
  </div>
    `
  }

  $('#groceries-container').empty()
  $('#groceries-container').append(cardString)
}


