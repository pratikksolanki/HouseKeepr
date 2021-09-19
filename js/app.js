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
          if (!localStorage.getItem('house_data')) {
            localStorage.setItem('house_data', JSON.stringify(data[USER['house_id']]))
          }
          HOUSE = JSON.parse(localStorage.getItem('house_data'))
          createAddedGroceryCards()
          $('#house_header').text(HOUSE['address'])
          getGroceryData('Apple', createGroceryCards)
          $("#grocery_search_bar").on('input', function () {
            var query = $("#grocery_search_bar").val()
            getGroceryData(query, createGroceryCards)
          });

          $("#add_note_button").on('click', function () {
            var note_string = $("#notes_box").val()
            $("#notes_box").val("")
            if (!note_string.length) {
              alert("Please enter a note!");
              return;
            }

            var note_id = generateNotesID()
            var note_object = {
              id: note_id,
              note: note_string,
              user: USER
            }
            HOUSE["notes"][note_id] = note_object;
            writeJson('house_data', HOUSE)
            createAddedGroceryCards();
          });
        })
    });
})

function getGroceryData(queryString = "Apple", callback) {
  var endpoint = `https://edamam-food-and-grocery-database.p.rapidapi.com/parser?ingr=${queryString}`
  $.ajax({
    url: endpoint,
    type: 'GET', //method used POST or GET
    success: callback,
    error: function (result, status, error) { // Handle errors
      console.error(error)
    },
    headers: {
      // API KEY and other headers.
      "x-rapidapi-host": "edamam-food-and-grocery-database.p.rapidapi.com",
      "x-rapidapi-key": "01f31a0914mshebf9587336e25bfp16dadcjsncca61ccdae96"
    }
  })
}

function createGroceryCards(groceries) {
  cardString = ``
  for (let food of groceries.parsed) {
    food_info = food['food']
    cardString += `
    
    <div id='food_card_${food_info['foodId']}' data-foodId=${food_info['foodId']} class="card" style="width: auto; margin: 2.5%">
      <div class="customrow"> 
        
        <div class="customcol"> 
        <img src="${food_info['image'] === null ? 'https://p.kindpng.com/picc/s/79-798754_hoteles-y-centros-vacacionales-dish-placeholder-hd-png.png' : food_info['image']}" alt="${food_info['label']}" height='120px'/>
        </div>

        <div class="customcol"> 
          <div class="card-body">
            <h5 class="card-title">${food_info['label']}</h5>
            <i class="card-text">${food_info['category']}</i>
            <a id="add_food_btn_${food_info['foodId']}" data-category='${food_info['category']}' data-foodId='${food_info['foodId']}' data-label='${food_info['label']}' data-image='${food_info['image']}' class="btn btn-light custom-btn">✔
          </a>
          </div>
        </div>

      </div>
    
    </div>
    `
  }
  for (let food of groceries.hints) {
    food_info = food['food']
    cardString += `

    <div id='food_card_${food_info['foodId']}' data-foodId=${food_info['foodId']} class="card" style="width: auto; margin: 2.5%">
      <div class="customrow"> 
        
        <div class="customcol"> 
        <img src="${food_info['image'] === null ? 'https://p.kindpng.com/picc/s/79-798754_hoteles-y-centros-vacacionales-dish-placeholder-hd-png.png' : food_info['image']}" alt="${food_info['label']}" height='120px'/>
        </div>

        <div class="customcol"> 
          <div class="card-body">
            <h5 class="card-title">${food_info['label']}</h5>
            <i class="card-text">${food_info['category']}</i>
            <a id="add_food_btn_${food_info['foodId']}" data-category='${food_info['category']}' data-foodId='${food_info['foodId']}' data-label='${food_info['label']}' data-image='${food_info['image']}' class="btn btn-light custom-btn">✔
          </a>
          </div>
        </div>

      </div>
    
    </div>
    
    `
  }

  $('#groceries-container').empty()
  $("[id^='add_food_btn_']").off('click')
  $('#groceries-container').append(cardString)
  $("[id^='add_food_btn_']").on('click', (e) => {
    let data = e.target.dataset
    HOUSE['grocery_list'][data.foodid] = { foodId: data.foodid, category: data.category, label: data.label, image: data.image, user: USER }
    writeJson('house_data', HOUSE)
    createAddedGroceryCards()
  })
}

function createAddedGroceryCards() {
  cardString = ``
  for (let food_info of Object.values(HOUSE['grocery_list'])) {
    cardString += `

  <div id='food_card_${food_info['foodId']}' data-foodId=${food_info['foodId']} class="card" style="width: auto; margin: 2.5%">
      <div class="customrow"> 
        
        <div class="customcol"> 
        <img src="${food_info['image'] === null ? 'https://p.kindpng.com/picc/s/79-798754_hoteles-y-centros-vacacionales-dish-placeholder-hd-png.png' : food_info['image']}" alt="${food_info['label']}" height='120px'/>
        </div>

        <div class="customcol"> 
          <div class="card-body">
            <h5 class="card-title">${food_info['label']}</h5>
            <i class="card-text">${food_info['category']}</i>
            <a id="remove_food_btn_${food_info['foodId']}" data-foodId='${food_info['foodId']}' class="btn btn-light custom-btn">🗑
            </a>
          </div>
        </div>

      </div>
    
    </div>
    `
  }

  for (let note of Object.values(HOUSE['notes'])) {
    cardString += `

    <div id='added_card_${note['id']}' class="card" style="width: auto; margin: 2.5%">
    <div class="customrow separation"> 

      <div class="customcol"> 
        <div class="card-body">
          <h5 class="card-title">${note['user']['firstName']} ${note['user']['lastName']} says:</h5>
          <i class="card-text note-text">${note['note']}
          </i>
       </div>
      </div>  

      <div id="remove_note_btn_${note['id']}" class="customcol"> 
        <a class="btn btn-light dl-task-btn custom-btn" data-noteid="${note['id']}">🗑
        </a>
      </div>  
      

    </div> 
    


  </div>
    `
  }


  $('#added-groc-container').empty()
  $("[id^='remove_food_btn_']").off('click')
  $("[id^='remove_note_btn_']").off('click')
  $('#added-groc-container').append(cardString)
  $("[id^='remove_food_btn_']").on('click', (e) => {
    delete HOUSE['grocery_list'][e.target.dataset.foodid]
    writeJson('house_data', HOUSE)
    createAddedGroceryCards()
  })
  $("[id^='remove_note_btn_']").on('click', (e) => {
    delete HOUSE['notes'][e.target.dataset.noteid]
    writeJson('house_data', HOUSE)
    console.log(HOUSE)
    createAddedGroceryCards()
  })
}

function writeJson(name, obj) {
  localStorage.setItem(name, JSON.stringify(obj))
}

function generateNotesID(length = 10) {
  // declare all characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

