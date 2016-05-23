function gebi(name) {
  return document.getElementById(name);
}

// TODO: Generate this array by reading the img folder
var pics_array = ['Arya-Stark.jpg', 'Bran-Stark.jpg', 'Cersei-Lannister.jpg', 'Daenerys-Targaryen.jpg', 'Jon-Snow.jpg', 'Sansa-Stark.jpg', 'Tyrion-Lannister.jpg'];
var current_array = [];
var votes = {};

// TODO: Pass in pics_array without making it a global
function swap_pic(event) {
  var position = event.target.id;
  console.log('Chosen position was: "' + position + '"');
  var filename = event.target.src;
  filename = filename.substring(filename.lastIndexOf('/') + 1, filename.length);
  console.log('Filename chosen was: "' + filename + '"');
  var image_votes = add_vote(filename);
  console.log('Total votes for that image is: "' + image_votes + '"');

  if (current_array.length < pics_array.length) {
    var next_pic = fresh_pic();
    gebi(event.target.id).src = 'img/' + pics_array[next_pic];
  } else {
    console.log('Emptying array and starting over.');
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
    gebi('page-container').appendChild(img);
    gebi('pic' + i).addEventListener('click', swap_pic);
  }
}

function fresh_pic() {
  var selection = Math.floor(Math.random() * pics_array.length);
  while ( current_array.indexOf(selection) != -1) {
    selection = Math.floor(Math.random() * pics_array.length);
  }
  current_array.push(selection); // keep track of what is being shown
  return selection;
}

populate_images(pics_array);
