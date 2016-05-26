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

//start the app here
load_objects(pics_array);
preload_images(choices);

load_state();

function Item(src, clicks, times_shown) {
  this.src = src;
  this.clicks = clicks || 0;
  this.times_shown = times_shown || 0;

  this.name = function() {
    return src.slice(0,src.lastIndexOf('.')).replace(/-/g,' ');
  };

  this.save_state = function() {
    localStorage[this.src] = JSON.stringify(this);
  };

  this.add_click = function() {
    this.clicks++;
    this.save_state();
  };

  this.increment_times_shown = function() {
    this.times_shown++;
    this.save_state();
  };

  this.save_state();
}

function load_objects(name_array) {
  for (var i = 0; i < name_array.length; i++) {
    var temp_object_raw = localStorage[name_array[i]];
    if (temp_object_raw) {
      var temp_object = JSON.parse(temp_object_raw);
      var item = new Item(temp_object.src,temp_object.clicks,temp_object.times_shown);
    } else {
      var item = new Item(name_array[i]);
    }
    choices.push(item);
  }
}

// When the app first loads, check for saved state variables
function load_state() {
  var stored_display_state = localStorage.state;
  if (!stored_display_state || JSON.parse(stored_display_state) < 0 || JSON.parse(stored_display_state) > 3) {
    localStorage.state = 0;
  }
  display_app();

  var stored_clicks = localStorage.total_clicks;
  if (stored_clicks && stored_clicks != 'NaN') {
    total_clicks = stored_clicks;
  }

  var stored_round = localStorage.bonus_round;
  if (!stored_round) {
    localStorage.bonus_round = JSON.stringify(false);
  }
}

function render_image_containers() {
  gebi('pic-container').innerHTML = '';
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
  gebi('button_div').setAttribute('class', 'flex-center grey');
  gebi('results_button').removeEventListener('click', display_results);
  gebi('click_more_button').removeEventListener('click', more_clicks);
}

function render_buttons() {
  var button_div = gebi('button_div');
  if (!button_div) {
    button_div = document.createElement('div');
    button_div.setAttribute('id','button_div');
    button_div.setAttribute('class','flex-center');
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
}

function display_app() {
  // State 0 is just the Heading, Instructions, and three images with listeners
  render_image_containers();
  var last_shown = localStorage.last_shown;
  if (last_shown) {
    last_shown = JSON.parse(last_shown);
    populate_images(last_shown);
  } else {
    populate_images(); // This really only happens when the app is run for the first time.
  }
  render_buttons();
  if (localStorage.state == 0) {
    smooth_scroll_to(document.body);
  }
  if (localStorage.state > 0) {
    // State 1 adds the display of the two choice buttons
    //  and disables listeners on the images
    remove_pic_listeners();
    show_buttons();
  }
  if (localStorage.state == 1) {
    smooth_scroll_to(gebi('button_div'));
  }
  if (localStorage.state > 1) {
  // State 2 greys out the buttons and restores the listeners on the images
    set_pic_listeners();
    grey_out_buttons();
  }
  if (localStorage.state == 2) {
    smooth_scroll_to(gebi('pic-container'));
  }
  if (localStorage.state > 2) {
    // State 3 removes the listeners on the images, displays the results chart,
    //  scrolls down to the chart, and adds a start over button with a listener
    total_clicks = 0;
    save_total_clicks();
    localStorage.bonus_round = JSON.stringify(false);
    remove_pic_listeners();
    grey_out_buttons();
    render_chart();
    render_restart_button();
    smooth_scroll_to(gebi('results_container'));
  }
}

// display 3 fresh images
function populate_images(saved) {
  var showing = [];
  for (var i = 0; i < NUM_PICS_DISPLAYED; i++) {
    var selection;
    if (saved) {
      selection = saved[i];
    } else {
      selection = fresh_pic(showing);
    }
    var img = gebi('pic' + i);
    img.setAttribute('src', 'img/' + choices[selection].src);
    img.setAttribute('choice', selection);
    var caption = gebi('vote' + i);
    caption.textContent = choices[selection].name();

    showing[i] = selection;
  }
  localStorage.last_shown = JSON.stringify(showing);
}

// When a click is detected, log the vote and swap in a new pic
function swap_pic(event) {
  total_clicks++;
  save_total_clicks();
  choices[event.target.attributes[3].value].add_click();
  check_finished();
}

function check_finished() {
  if (total_clicks > 15 && JSON.parse(localStorage.bonus_round) == false) {
    localStorage.state = 1;
    display_app();
  } else if (total_clicks > 23) {
    localStorage.state = 3;
    display_app();
  } else {
    populate_images();
  }
}

function more_clicks() {
  localStorage.bonus_round = JSON.stringify(true);
  localStorage.state = 2;
  display_app();
  populate_images(); // Needed for a new set of images to appear with the button click.
}

function display_results() {
  localStorage.state = 3;
  display_app();
}

function render_chart() {
  var canvas_container_div = document.createElement('div');
  canvas_container_div.setAttribute('id', 'canvas-container');
  var canvas = document.createElement('canvas');
  canvas.setAttribute('id','result-chart');
  canvas.setAttribute('width','100%');
  canvas.setAttribute('height','25%');
  canvas_container_div.appendChild(canvas);
  document.body.appendChild(canvas_container_div);

  var label_array = [];
  var clicks_array = [];
  var times_shown_array = [];
  for (var i = 0; i < choices.length; i++) {
    label_array.push(choices[i].name());
    clicks_array.push(choices[i].clicks);
    times_shown_array.push(Math.floor(choices[i].clicks / choices[i].times_shown * 100));
  }

  var result_chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: label_array,
      datasets: [{
        yAxesGroup: '1',
        label: '# of Votes',
        data: clicks_array,
        backgroundColor: 'rgba(50,50,50,0.9)'
      },
        {
          yAxesGroup: '2',
          type: 'line',
          label: '% clicked',
          data: times_shown_array,
          backgroundColor: 'rgba(230,50,50,0.2)'
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          name: '1',
          position: 'right',
        }, {
          name: '2',
          position: 'left',
          scaleLabel: {
            labelString: 'Percent'
          }
        }]
      }
    }
  });
  smooth_scroll_to(canvas_container_div);
}

function render_restart_button() {
  var button = document.createElement('button');
  button.appendChild(document.createTextNode('MOAR CLICK!'));
  button.addEventListener('click', restart);
  var button_div = document.createElement('div');
  button_div.setAttribute('id','restart-button-div');
  button_div.setAttribute('class','flex-center');
  button_div.appendChild(button);
  document.body.appendChild(button_div);
}

function restart() {
  document.body.removeChild(gebi('restart-button-div'));
  document.body.removeChild(gebi('canvas-container'));
  document.body.removeChild(gebi('button_div'));

  localStorage.state = 0;
  display_app();
  populate_images(); // Needed because the pics will not update otherwise.
}

function save_total_clicks() {
  localStorage.total_clicks = total_clicks;
}

function fresh_pic(taken) {
  if (0 == available_choices.length) {
    // when out of fresh pics, rest the choices available
    for (var i = 0; i < choices.length; i++) {
      available_choices.push(i);
    }
    for (var i = 0; i < taken.length; i++) {
      var choice_to_remove = available_choices.indexOf(taken[i]);
      if (choice_to_remove < 0) {
        console.error('Uh, oh. This variable should never be missing.');
      } else {
        available_choices.splice(taken[i],1);
      }
    }
  }
  var choice_index = Math.floor(Math.random() * available_choices.length);
  var choice = available_choices[choice_index];
  available_choices.splice(choice_index,1); // eliminate the choice used
  choices[choice].increment_times_shown();
  return choice;
}

function preload_images(obj_array) {
  for (var i = 0; i < obj_array.length; i++) {
    var temp_image = new Image();
    temp_image.src = 'img/' + obj_array[i].src;
  }
}

// utility functions
function gebi(target_id) {
  return document.getElementById(target_id);
}

function smooth_scroll_to(element, last_jump) {
  if (element) {
    var next_jump = window.scrollY + Math.ceil((element.offsetTop - window.scrollY) / 8);
    if (next_jump != last_jump) {
      window.setTimeout(render_scroll, 50, next_jump, element);
    }
  }
}

function render_scroll(jump_location, element) {
  window.scrollTo(0, jump_location);
  smooth_scroll_to(element, jump_location);
}
