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
var bonus_round = false;

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
  this.times_shown = 0;

  this.add_click = function() {
    this.clicks++;
  };

  this.increment_times_shown = function() {
    this.times_shown++;
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
    gebi('pic-container').appendChild(pic_div);
  }
  set_pic_listeners();
}

function set_pic_listeners() {
  for (var i = 0; i < NUM_PICS_DISPLAYED; i++) {
    gebi('pic' + i).addEventListener('click', swap_pic);
  }
}

function remove_pic_listeners() {
  for (var i = 0; i < NUM_PICS_DISPLAYED; i++) {
    gebi('pic' + i).removeEventListener('click', swap_pic);
  }
}

function show_buttons() {
  gebi('button_div').style.visibility = 'visible';
}

function grey_out_buttons() {
  gebi('button_div').setAttribute('class', 'grey');
  gebi('results_button').removeEventListener('click', display_results);
  gebi('click_more_button').removeEventListener('click', more_clicks);
}

function render_buttons() {
  var button_div = document.createElement('div');
  button_div.setAttribute('id','button_div');
  var button = document.createElement('button');
  button.appendChild(document.createTextNode('Show Me The Results!'));
  button.setAttribute('id','results_button');
  button.addEventListener('click', display_results);
  button_div.appendChild(button);
  button = document.createElement('button');
  button.appendChild(document.createTextNode('I Want to Click More!'));
  button.setAttribute('id','click_more_button');
  button.addEventListener('click', more_clicks);
  button_div.appendChild(button);
  button_div.style.visibility = 'hidden';
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
    // caption.textContent += 'Times shown: ' + choices[selection].times_shown;
  }
}

// When a click is detected, log the vote and swap in a new pic
function swap_pic(event) {
  total_clicks++;
  choices[event.target.attributes[3].value].add_click();
  if ( total_clicks > 15 && bonus_round == false) {
    remove_pic_listeners();
    show_buttons();
  } else if (total_clicks > 23) {
    remove_pic_listeners();
    display_results();
    grey_out_buttons();
  } else {
    populate_images();
  }
}

function more_clicks() {
  bonus_round = true;
  set_pic_listeners();
  grey_out_buttons();
}

function display_results() {
  grey_out_buttons();
  var results_container = document.createElement('div');
  results_container.setAttribute('id','results_container');
  var text_results_div = document.createElement('div');
  var histogram_div = document.createElement('div');
  histogram_div.setAttribute('class', 'monospace');
  var percentage_div = document.createElement('div');
  // results_div.appendChild(document.createTextNode('Results go here.'));
  for (var i = 0; i < choices.length; i++) {
    var individual_result_div = document.createElement('div');
    console.log(choices[i]);
    var build_string = choices[i].name + ': ';
    build_string += choices[i].clicks + ' clicks out of ';
    build_string += choices[i].times_shown + ' times shown.';
    individual_result_div.appendChild(document.createTextNode(build_string));
    text_results_div.appendChild(individual_result_div);
    //show histogram in second div
    individual_result_div = document.createElement('div');
    build_string = '|';
    for (var j = 0; j < choices[i].clicks; j++) {
      build_string += '=';
    }
    for (var j = choices[i].clicks; j < choices[i].times_shown; j++) {
      build_string += '&nbsp;';
    }
    build_string += '|';
    individual_result_div.innerHTML = build_string;
    histogram_div.appendChild(individual_result_div);
    // Show percents in third div
    individual_result_div = document.createElement('div');
    build_string = Math.floor(choices[i].clicks / choices[i].times_shown * 100) + '%';
    individual_result_div.appendChild(document.createTextNode(build_string));
    percentage_div.appendChild(individual_result_div);
  }
  results_container.appendChild(text_results_div);
  results_container.appendChild(histogram_div);
  results_container.appendChild(percentage_div);
  document.body.appendChild(results_container);
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
  choices[choice].increment_times_shown();
  return choice;
}

// utility functions
function gebi(name) {
  return document.getElementById(name);
}
