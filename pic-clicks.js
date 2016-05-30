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
prepare_modal_div();
render_heading();
render_instructions();
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

function render_heading() {
  var h1 = document.createElement('h1');
  h1.appendChild(document.createTextNode('Most Likely to Die Next!'));
  document.body.appendChild(h1);
}

function render_instructions() {
  var p_tag = document.createElement('p');
  p_tag.appendChild(document.createTextNode('The process here is simple. You will be shown three characters from the Game of Thrones tv show. Just pick which of the three you believe is the most likely to be killed off next!'));
  document.body.appendChild(p_tag);
  p_tag = document.createElement('p');
  p_tag.appendChild(document.createTextNode('After you\'ve gone through 16 sets of photos, you will have the option of seeing the statistics you chose!'));
  document.body.appendChild(p_tag);
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
  var pic_container = document.createElement('div');
  pic_container.setAttribute('id','pic-container');
  pic_container.setAttribute('class','delayedfadein');
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
  if (localStorage.state == 0) {
    smooth_scroll_to(document.body);
    render_image_containers();
  }
  add_delayed_fadein();
  var last_shown = localStorage.last_shown;
  if (last_shown) {
    last_shown = JSON.parse(last_shown);
    window.setTimeout(populate_images, 1000, last_shown);
  } else {
    window.setTimeout(populate_images, 1000); // This really only happens when the app is run for the first time.
  }
  render_buttons();
  easter_egg();
  window.setTimeout(remove_delayed_fadein,2000);
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
    set_up_modal_listeners();
    smooth_scroll_to(gebi('results_container'));
  }
}

function add_delayed_fadein() {
  var p_tag_array = document.getElementsByTagName('p');
  for (var i = 0; i < p_tag_array.length; i++) {
    p_tag_array[i].classList.add('delayedfadein');
  }
}

function remove_delayed_fadein() {
  var p_tag_array = document.getElementsByTagName('p');
  for (var i = 0; i < p_tag_array.length; i++) {
    p_tag_array[i].classList.remove('delayedfadein');
  }
  gebi('pic-container').classList.remove('delayedfadein');
}

function fade_out_images() {
  gebi('pic-container').classList.add('fadeout');
  window.setTimeout(populate_images,1000);
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
  gebi('pic-container').classList.remove('fadeout');
  gebi('pic-container').classList.add('fadein');
  window.setTimeout(complete_populate,1000);

  function complete_populate() {
    gebi('pic-container').classList.remove('fadein');
  }
}

// When a click is detected, log the vote and swap in a new pic
function swap_pic(event) {
  total_clicks++;
  save_total_clicks();
  choices[event.target.attributes[3].value].add_click();
  gebi(event.target.id).classList.add('whiteout');
  window.setTimeout(check_finished, 500, event.target.id);
}

function check_finished(element) {
  if (element) {
    gebi(element).classList.remove('whiteout');
  }
  if (total_clicks > 15 && JSON.parse(localStorage.bonus_round) == false) {
    localStorage.state = 1;
    display_app();
  } else if (total_clicks > 23) {
    localStorage.state = 3;
    display_app();
  } else {
    fade_out_images();
  }
}

function more_clicks() {
  localStorage.bonus_round = JSON.stringify(true);
  localStorage.state = 2;
  display_app();
  // populate_images(); // Needed for a new set of images to appear with the button click. ...?
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

function restart() {
  // document.body.removeChild(gebi('restart-button-div'));
  // document.body.removeChild(gebi('spoiler-button-div'));
  // document.body.removeChild(gebi('canvas-container'));
  // document.body.removeChild(gebi('button_div'));
  document.body.innerHTML = '';
  localStorage.state = 0;
  render_heading();
  render_instructions();
  load_state();
  populate_images(); // Needed because the pics will not update otherwise.
}

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

function easter_egg() {
  document.onkeydown = function(e) {
    if (e.code == 'KeyC') {
      display_modal();
    }
  };

}
