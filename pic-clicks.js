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
var pics_array = ['Arya-Stark.jpg',
                  'Bran-Stark.jpg',
                  'Brienne-of-Tarth.jpg',
                  'Cersei-Lannister.jpg',
                  'Daenerys-Targaryen.jpg',
                  'Hodor.jpg',
                  'Jaime-Lannister.jpg',
                  'Jon-Snow.jpg',
                  'Margaery-Tyrell.jpg',
                  'Ramsay-Bolton.jpg',
                  'Sansa-Stark.jpg',
                  'The-High-Sparrow.jpg',
                  'Tommen-Baratheon.jpg',
                  'Tyrion-Lannister.jpg'];

//start the game here
load_objects(pics_array);
render_image_containers();
render_buttons();
populate_images(pics_array);

function Item(src) {
  this.src = 'img/' + src;
  this.name = src.slice(0,src.lastIndexOf('.')).replace(/-/g,' ');
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

function render_image_containers() {
  for (var i = 0; i < NUM_PICS_DISPLAYED; i++) {
    var img = document.createElement('img');
    img.setAttribute('class', 'headshot');
    img.setAttribute('id', 'pic' + i);
    var caption = document.createElement('figcaption');
    caption.setAttribute('id', 'vote' + i);
    var text = document.createTextNode('');
    caption.appendChild(text);
    var pic_div = document.createElement('div');
    pic_div.appendChild(img);
    pic_div.appendChild(caption);
    gebi('page-container').appendChild(pic_div);
    gebi('pic' + i).addEventListener('click', swap_pic);
  }
}

function render_buttons() {
  var button_div = document.createElement('div');
  button_div.setAttribute('id','button_div');
  var button = document.createElement('button');
  button.appendChild(document.createTextNode('Show Me The Results!'));
  button.setAttribute('id','results_button');
  button_div.appendChild(button);
  button = document.createElement('button');
  button.appendChild(document.createTextNode('I Want to Click More!'));
  button.setAttribute('id','click_more_button');
  button_div.appendChild(button);
  document.body.appendChild(button_div);
}

function populate_images() {
  // now make random selections for the initial 4 images
  for (var i = 0; i < NUM_PICS_DISPLAYED; i++) {
    var selection = fresh_pic();
    var img = gebi('pic' + i);
    img.setAttribute('src', choices[selection].src);
    img.setAttribute('choice', selection);
    var caption = gebi('vote' + i);
    caption.textContent = choices[selection].name + ': ' + choices[selection].clicks + ' clicks';
  }
  console.log(available_choices);
}

// When a click is detected, log the vote and swap in a new pic
function swap_pic(event) {
  total_clicks++;
  choices[event.target.attributes[3].value].addClick();
  populate_images();
}

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
