function gebi(name) {
  return document.getElementById(name);
}

var pics_array = ['Arya-Stark.jpg', 'Bran-Stark.jpg', 'Cersei-Lannister.jpg', 'Daenerys-Targaryen.jpg', 'Jon-Snow.jpg', 'Sansa-Stark.jpg', 'Tyrion-Lannister.jpg'];

// gebi('pic1').addEventListener('click', swap_pic);
// gebi('pic2').addEventListener('click', swap_pic);

function swap_pic(event) {
  var current_pic = gebi(event.target.id).src;
  current_pic = current_pic.substring(current_pic.lastIndexOf('/') + 1, current_pic.length);
  console.log('Current pic is: "' + current_pic + '"');
  var next_pic = current_pic;
  while (next_pic == current_pic) {
    next_pic = pics_array[ Math.floor(Math.random() * pics_array.length) ];
  }
  gebi(event.target.id).src = 'img/' + next_pic;
}

function populate_images() {
  var display_array = [];
  for (var i = 0; i < 4; i++) {
    var selection = Math.floor(Math.random() * pics_array.length);
    while ( display_array.indexOf(selection) != -1) {
      selection = Math.floor(Math.random() * pics_array.length);
    }
    var img = document.createElement('img');
    img.setAttribute('class', 'headshot');
    img.setAttribute('id', 'pic' + i);
    img.setAttribute('src', 'img/' + pics_array[selection]);
    gebi('page-container').appendChild(img);
    gebi('pic' + i).addEventListener('click', swap_pic);
  }
}

populate_images();
