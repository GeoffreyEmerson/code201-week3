// Code Fellows 201 Week 3 - Bus Mall project
// by Geoffrey Emerson

// Constants
var NUM_PICS_DISPLAYED = 3;

// array of Item objects
var choices = [];

// track what has been shown this round
// this array will start out full and choices get removed as they are used
var available_choices = [];

// track how many times the user has made a choices
var total_clicks = 0;

// list of given pics in the img directory
var pics_array = ['Arya-Stark.jpg', 'Bran-Stark.jpg', 'Cersei-Lannister.jpg', 'Daenerys-Targaryen.jpg', 'Jon-Snow.jpg', 'Sansa-Stark.jpg', 'Tyrion-Lannister.jpg', 'Jaime-Lannister.jpg', 'Hodor.jpg'];

//start the game here
load_objects(pics_array);
populate_images(pics_array);

function Item(src) {
  this.src = 'img/' + src;
  this.name = src.slice(0,src.lastIndexOf('.')).replace('-',' ');
  this.clicks = 0;

  this.addClick = function() {
    this.clicks++;
  };
}

function load_objects(name_array) {
  for (var i = 0; i < name_array.length; i++) {
    var item = new Item(name_array[i]);
    choices.push(item);
  }
}

function populate_images() {
  gebi('page-container').innerHTML = '';

  // now make random selections for the initial 4 images
  for (var i = 0; i < NUM_PICS_DISPLAYED; i++) {
    var selection = fresh_pic();
    var img = document.createElement('img');
    img.setAttribute('class', 'headshot');
    img.setAttribute('id', 'pic' + i);
    img.setAttribute('src', choices[selection].src);
    img.setAttribute('choice', selection);
    var caption = document.createElement('figcaption');
    caption.setAttribute('id', 'vote' + i);
    var text = document.createTextNode(choices[selection].name + ': ' + choices[selection].clicks + ' clicks');
    caption.appendChild(text);
    var pic_div = document.createElement('div');
    pic_div.appendChild(img);
    pic_div.appendChild(caption);
    gebi('page-container').appendChild(pic_div);
    gebi('pic' + i).addEventListener('click', swap_pic);
  }
  console.log(available_choices);
}

// When a click is detected, log the vote and swap in a new pic
function swap_pic(event) {
  total_clicks++;
  choices[event.target.attributes[3].value].addClick();
  populate_images();
}

// function new_set() {
//   // when the game gets reset, all choice objects are available to be picked.
//
//   populate_images();
//
//   // if (available_choices.length > 0) {
//   //   var next_pic = fresh_pic();
//   //   var pic_element = gebi(event.target.id);
//   //   pic_element.src = choices[next_pic].src;
//   //   pic_element.setAttribute('choice', next_pic);
//   //   event.target.nextSibling.textContent = choices[next_pic].name + ': ' + choices[next_pic].clicks + ' clicks';
//   // } else {
//   //   populate_images();
//   // }
// }

function fresh_pic() {
  if (0 == available_choices.length) {
    // when out of fresh pics, rest the choices available
    for (var i = 0; i < choices.length; i++) {
      available_choices.push(i);
    }
  }
  var choice_index = Math.floor(Math.random() * available_choices.length);
  var choice = available_choices[choice_index];
  available_choices.splice(choice_index,1); // eliminate the choice used
  return choice;
}

// utility functions
function gebi(name) {
  return document.getElementById(name);
}
