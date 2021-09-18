$(document).ready(() => {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://edamam-food-and-grocery-database.p.rapidapi.com/parser?ingr=apple",
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "edamam-food-and-grocery-database.p.rapidapi.com",
      "x-rapidapi-key": "01f31a0914mshebf9587336e25bfp16dadcjsncca61ccdae96"
    }
  };
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
})