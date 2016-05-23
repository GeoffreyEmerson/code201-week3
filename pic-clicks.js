// track what has been shown this round
var current_array = [];

// track votes over the whole session
var votes = {};

// TODO: Generate this array by reading the img folder
var pics_array = ['Arya-Stark.jpg', 'Bran-Stark.jpg', 'Cersei-Lannister.jpg', 'Daenerys-Targaryen.jpg', 'Jon-Snow.jpg', 'Sansa-Stark.jpg', 'Tyrion-Lannister.jpg'];

//start the game here
populate_images(pics_array);

// When a click is detected, log the vote and swap in a new pic
// TODO: Pass in pics_array without making it a global
function swap_pic(event) {
  var filename = event.target.src;
  filename = filename.substring(filename.lastIndexOf('/') + 1, filename.length);
  var image_votes = add_vote(filename);

  if (current_array.length < pics_array.length) {
    // Show a new pic
    var next_pic = fresh_pic();
    gebi(event.target.id).src = 'img/' + pics_array[next_pic];
    var vote_count;
    if ( !(vote_count = votes[pics_array[next_pic]]) ) {
      vote_count = 0;
    }
    event.target.nextSibling.textContent = pics_array[selection] + ': ' + vote_count + ' clicks';
  } else {
    // Empty array and start over
    populate_images();
  }
}

function add_vote(key) {
  if (key in votes) {
    votes[key] += 1;
  } else {
    votes[key] = 1;
  }
  return votes[key];
}

function populate_images() {
  gebi('page-container').innerHTML = '';
  current_array = [];
  for (var i = 0; i < 4; i++) {
    var selection = fresh_pic();
    var img = document.createElement('img');
    img.setAttribute('class', 'headshot');
    img.setAttribute('id', 'pic' + i);
    img.setAttribute('src', 'img/' + pics_array[selection]);
    img.setAttribute('value', selection);
    var caption = document.createElement('figcaption');
    caption.setAttribute('id', 'vote' + i);
    var vote_count;
    if ( !(vote_count = votes[pics_array[selection]]) ) {
      vote_count = 0;
    }
    var text = document.createTextNode(pics_array[selection] + ': ' + vote_count + ' clicks');
    caption.appendChild(text);
    var pic_div = document.createElement('div');
    pic_div.appendChild(img);
    pic_div.appendChild(caption);
    gebi('page-container').appendChild(pic_div);
    gebi('pic' + i).addEventListener('click', swap_pic);
  }
}

function fresh_pic() {
  do {
    selection = Math.floor(Math.random() * pics_array.length);
  } while (current_array.indexOf(selection) != -1);
  current_array.push(selection); // keep track of what is being shown
  return selection;
}

// utility functions
function gebi(name) {
  return document.getElementById(name);
}
