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
load_objects(pics_array); // Sets up the array of objects based on the given file names.
preload_images(choices); // Uses a JS trick to get all the images into the browser cache.
prepare_modal_div(); // Sets up the modal as an invisible div for later use.
render_heading(); // Begin the actual readable display. First the big heading zooms in.
render_instructions(); // Then after a second, the instructions fade in.
load_state(); // Run the function that determines where the user last left off.

// Here's the fundamental object constructor. The Items that will be voted on.
function Item(src, clicks, times_shown) {
  this.src = src;
  this.clicks = clicks || 0;
  this.times_shown = times_shown || 0;

  // The display name is not saved. Only generated when needed.
  this.name = function() {
    return src.slice(0,src.lastIndexOf('.')).replace(/-/g,' ');
  };

  // Each object gets saved individually to save on disc access time.
  this.save_state = function() {
    localStorage[this.src] = JSON.stringify(this);
  };

  // When a count changes, the state of the object is saved to disc.
  this.add_click = function() {
    this.clicks++;
    this.save_state();
  };

  this.increment_times_shown = function() {
    this.times_shown++;
    this.save_state();
  };

  // This just makes sure that each object is saved to disc (local storage) as it is created.
  this.save_state();
}

// Sets up the array of objects based on the given file names. If there is data
//  in the local storage related to a given file name, use that data. otherwise
//  generate a new entry.
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

// By loading images into img tags that are never rendered, all the images
//  get cached by the browser. This lets them appear instantly when they
//  are called in for real.
function preload_images(obj_array) {
  for (var i = 0; i < obj_array.length; i++) {
    var temp_image = new Image();
    temp_image.src = 'img/' + obj_array[i].src;
  }
}

// This modal is set as hidden in css upon creation. A listener event causes
//  it to be displayed.
function prepare_modal_div() {
  var video_div = document.createElement('div');
  video_div.setAttribute('class','modal-content');
  video_div.innerHTML = '<iframe width="853" height="480" src="https://www.youtube.com/embed/kMI_HBO5FOM?rel=0&amp;showinfo=0&amp;enablejsapi=1" frameborder="0" allowfullscreen></iframe>';

  // // if the video becomes local, use this code
  // var video = document.createElement('video');
  // video.setAttribute('controls','controls');
  // video.setAttribute('src','video.mp4');
  // video_div.appendChild(video);

  // create modal div
  var modal_div = document.createElement('div');
  modal_div.setAttribute('class', 'modal');
  modal_div.setAttribute('id', 'spoilers-modal');
  modal_div.appendChild(video_div);
  // append modal div to output_div
  document.body.appendChild(modal_div);
}

// Dynamically render the big heading that zooms in.
//  (I was forced to dynamically render the whole page due to animation conflicts.)
function render_heading() {
  var h1 = document.createElement('h1');
  h1.appendChild(document.createTextNode('Most Likely to Die Next!'));
  document.body.appendChild(h1);
}

// Dynamically render the paragraphs of instructions.
function render_instructions() {
  var p_tag = document.createElement('p');
  p_tag.appendChild(document.createTextNode('The process here is simple. You will be shown three characters from the Game of Thrones tv show. Just pick which of the three you believe is the most likely to be killed off next!'));
  document.body.appendChild(p_tag);
  p_tag = document.createElement('p');
  p_tag.appendChild(document.createTextNode('After you\'ve gone through 16 sets of photos, you will have the option of seeing the statistics you chose!'));
  document.body.appendChild(p_tag);
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

// This is a very important function that took a lot of tinkering to get right.
//  And it could probably use some refactoring if I had more time.
//  Anyway, it displays the various page elements depending on the state that
//  is saved to local storage so that the user can pick up where they left off.
//  The state is changed at key points throughout the app.
function display_app() {
  // State 0 is just the Heading, Instructions, and three images with listeners
  var last_shown = localStorage.last_shown;
  if (localStorage.state == 0) {
    smooth_scroll_to(document.body); // Scrolls to the top of the page, if not there already.
    render_image_containers(true); // "true" when animation is appropriate.
    add_delayed_fadein(); // This makes the paragraphs fade into view.
    // Here we pull in the last shown images from memory, if any.
    if (last_shown) {
      last_shown = JSON.parse(last_shown);
      window.setTimeout(populate_images, 1000, last_shown); // The timeout is for animation.
    } else {
      window.setTimeout(populate_images, 1000); // This really only happens when the app is run for the first time.
    }
    render_buttons(); // The buttons start out invisible, per spec.
    easter_egg(); // Per spec.
    window.setTimeout(remove_delayed_fadein,2000); // Cleans up after animating.
  }
  if (localStorage.state > 0) {
    // State 1 adds the display of the two choice buttons
    //  and disables listeners on the images
    if (!gebi('pic-container')) {
      // If the pic container is already on the page, don't re-render it.
      //  If it is *not* on the page, skip the animations. (Stage 1)
      render_image_containers(false);
      populate_images(last_shown);
    }
    remove_pic_listeners(); // No clicking on pictures until the button choice is made.
    show_buttons(); // Here's where the choice buttons become visible, per spec.
  }
  if (localStorage.state == 1) {
    // It automatically scrolls to the buttons if and only if it is stage 1.
    smooth_scroll_to(gebi('button_div'));
  }
  if (localStorage.state > 1) {
  // State 2 greys out the buttons and restores the listeners on the images.
  //  This is the "more clicking" stage.
    set_pic_listeners();
    grey_out_buttons();
  }
  if (localStorage.state == 2) {
    // Again, auto-scrolling to the expected action.
    smooth_scroll_to(gebi('pic-container'));
  }
  if (localStorage.state > 2) {
    // State 3 removes the listeners on the images, displays the results chart,
    //  scrolls down to the chart, and adds a start over button with a listener
    remove_pic_listeners();
    grey_out_buttons();
    render_chart();
    smooth_scroll_to(gebi('results_container'));
    render_restart_button();
    set_up_modal_listeners(); // This refers to the flashing button that appears.

    // Start preparing for an app reset.
    total_clicks = 0;
    save_total_clicks();
    localStorage.bonus_round = JSON.stringify(false);
  }
}

// This function actually creates the html for displaying the three images.
function render_image_containers(animate) {
  var pic_container = document.createElement('div');
  pic_container.setAttribute('id','pic-container');
  if (animate) {
    pic_container.setAttribute('class','delayedfadein');
  }
  pic_container.innerHTML = '';
  for (var i = 0; i < NUM_PICS_DISPLAYED; i++) {
    var img = document.createElement('img');
    img.setAttribute('class', 'headshot');
    img.setAttribute('id', 'pic' + i);
    var img_span = document.createElement('div');
    img_span.setAttribute('class', 'img-holder');
    img_span.appendChild(img);
    var caption = document.createElement('figcaption');
    caption.setAttribute('id', 'vote' + i);
    var text = document.createTextNode('');
    caption.appendChild(text);
    var pic_div = document.createElement('div');
    pic_div.appendChild(img_span);
    pic_div.appendChild(caption);
    pic_container.appendChild(pic_div);
  }
  document.body.appendChild(pic_container);
  set_pic_listeners();
}

// These are the listeners that let a user click on images to vote.
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

// This function sets up the html for the choice buttons, but they are hidden to begin with.
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

// At the appropriate time, the choice buttons become visible.
//  I originally thought more code might be needed in this function. Ended up short.
function show_buttons() {
  gebi('button_div').style.visibility = 'visible';
}

// After the user makes a choice, the buttons grey out. This could easily be
//  changed to hiding the buttons, but I got some conflicting info about what the
//  spec required.
function grey_out_buttons() {
  gebi('button_div').setAttribute('class', 'flex-center grey');
  gebi('results_button').removeEventListener('click', display_results);
  gebi('click_more_button').removeEventListener('click', more_clicks);
}

// When the page is first loaded (stage 0) the instruction paragraphs have a nice
//  fade-in animation. But it's not needed if the user restarts in a later stage.
//  So this function is only called for stage 0 starts.
function add_delayed_fadein() {
  var p_tag_array = document.getElementsByTagName('p');
  for (var i = 0; i < p_tag_array.length; i++) {
    p_tag_array[i].classList.add('delayedfadein');
  }
}

// Cleaning up the animation classes after they finish.
function remove_delayed_fadein() {
  var p_tag_array = document.getElementsByTagName('p');
  for (var i = 0; i < p_tag_array.length; i++) {
    p_tag_array[i].classList.remove('delayedfadein');
  }
  gebi('pic-container').classList.remove('delayedfadein');
}

// This is the starting point for the animation that fades out the three images
//  after a user clicks on them.
function fade_out_images() {
  gebi('pic-container').classList.add('fadeout');
  window.setTimeout(populate_images,1000);
}

// Sometimes, like when the page is first rendered after a re-start, the fadeout
//  animation is not wanted, and the image display starts here.
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
    // Here the app keeps track of the images that are currently being shown.
    showing[i] = selection;
  }
  localStorage.last_shown = JSON.stringify(showing); // Saved to local storage
  gebi('pic-container').classList.remove('fadeout'); // Clean up
  gebi('pic-container').classList.add('fadein'); // Start the fade in here after new images are loaded.
  window.setTimeout(complete_populate,1000);

  function complete_populate() {
    gebi('pic-container').classList.remove('fadein');
    set_pic_listeners(); // Wait until here to allow the user to click on a new image.
  }
}

// When a click is detected, log the vote and make the image flash
function swap_pic(event) {
  remove_pic_listeners();
  total_clicks++;
  save_total_clicks();
  choices[event.target.attributes[3].value].add_click();
  gebi(event.target.id).classList.add('whiteout');
  // Then check to see how many clicks have been tracked
  window.setTimeout(check_finished, 500, event.target.id);
}

// Depending on how many clicks have come in, the app will go to various next steps
function check_finished(element) {
  if (element) {
    // This just double checks that an event triggered animation. Could probably cut the if.
    gebi(element).classList.remove('whiteout');
  }

  // Check to see if a state change is warranted
  if (total_clicks > 15 && JSON.parse(localStorage.bonus_round) == false) {
    localStorage.state = 1;
    display_app();
  } else if (total_clicks > 23) {
    localStorage.state = 3;
    display_app();
  } else {
    // If it's not time for a state change, then start the process for displaying new images.
    fade_out_images();
  }
}

// This function is for when a user clicks the "more clicks" button.
function more_clicks() {
  localStorage.bonus_round = JSON.stringify(true);
  localStorage.state = 2;
  display_app();
  fade_out_images(); // Needed for a new set of images to appear with the button click.
}

// And this is when the app goes to display the chart and end buttons.
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

  // Chart.js is a pain in the butt, and unfortunately I didn't have time to debug it.
  //  So the chart looks ok, but could be much better.
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

// This makes the final restart button and the spoilers easter egg button.
function render_restart_button() {
  var button = document.createElement('button');
  button.appendChild(document.createTextNode('MOAR CLICK!'));
  button.setAttribute('id','restart-button');
  button.addEventListener('click', restart);
  var button_div = document.createElement('div');
  button_div.setAttribute('id','restart-button-div');
  button_div.setAttribute('class','flex-center');
  button_div.appendChild(button);
  document.body.appendChild(button_div);

  button = document.createElement('button');
  button.appendChild(document.createTextNode('OH NOES, SPOILERZ!'));
  button.setAttribute('id','spoilers-button');
  button_div = document.createElement('div');
  button_div.setAttribute('id','spoiler-button-div');
  button_div.appendChild(button);
  document.body.appendChild(button_div);
}

// Here the app resets the last needed settings and starts the app from stage 0.
function restart() {
  document.body.innerHTML = '';
  localStorage.state = 0;
  render_heading();
  render_instructions();
  load_state();
  fade_out_images(); // Needed because the pics will not update otherwise.
}

// Here comes more modal functionality
function set_up_modal_listeners() {
  // Get the button that opens the modal
  var btn = document.getElementById('spoilers-button');

  // When the user clicks the button, open the modal
  btn.addEventListener('click', display_modal);
}

function display_modal() {
  var modal = document.getElementById('spoilers-modal');
  modal.style.display = 'block';
  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener('click', hide_modal);
}

function hide_modal(event) {
  var modal = document.getElementById('spoilers-modal');
  if (event.target == modal) {
    modal.style.display = 'none';
    var iframe = document.getElementsByTagName('iframe')[0].contentWindow;
    iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
  }
}

// Simple storage function.
function save_total_clicks() {
  localStorage.total_clicks = total_clicks;
}

// Tries to track what is displayed to avoid repeats. Not perfect, sadly.
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

function easter_egg() {
  document.onkeydown = function(e) {
    if (e.code == 'KeyC') {
      display_modal();
    }
  };

}
