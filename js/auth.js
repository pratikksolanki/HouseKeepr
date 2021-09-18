var USERS

$(document).ready(() => {
  fetch("../json/users.json")
  .then(response => {
    return response.json();
  })
  .then(data => {
    USERS = data
    $('#login_button').on('click', async () => {
      var username = $('#username_box').val()
      var password = $('#password_box').val()
      await authenticateUser(username, password)
    })
  });
})

async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);                    
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // convert bytes to hex string                  
  const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  return hashHex;
}

async function authenticateUser(username, password) {
  var found = false
  var id
  var salt
  var hash
  for (let user_id of Object.keys(USERS)) {
    if (USERS[user_id]['userid'] !== username) 
      continue
    found = true
    id = user_id
    salt = USERS[user_id]['salt']
    hash = USERS[user_id]['pwd']
    break
  }
  if (!found) {
    alert('This user does not exist!')
    return
  } else {
    var entered_hash = await sha256(password)
    var entered_salt_hash = await sha256(`${entered_hash}${salt}`)
    if (entered_salt_hash == hash) {
      localStorage.setItem('user', id)
      window.location.href = "/dashboard.html";
    }
  }
}