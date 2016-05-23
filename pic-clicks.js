function gebi(name) {
  return document.getElementById(name);
}

// TODO: Generate this array by reading the img folder
var pics_array = ['Arya-Stark.jpg', 'Bran-Stark.jpg', 'Cersei-Lannister.jpg', 'Daenerys-Targaryen.jpg', 'Jon-Snow.jpg', 'Sansa-Stark.jpg', 'Tyrion-Lannister.jpg'];
var current_array = [];

// TODO: Pass in pics_array without making it a global
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

function populate_images(image_array_arg) {
  for (var i = 0; i < 4; i++) {
    var selection = Math.floor(Math.random() * image_array_arg.length);
    console.log(current_array.indexOf(selection));
    while ( current_array.indexOf(selection) != -1) {
      selection = Math.floor(Math.random() * image_array_arg.length);
      console.log(current_array.indexOf(selection));
    }
    current_array.push(selection); // keep track of what is being shown
    var img = document.createElement('img');
    img.setAttribute('class', 'headshot');
    img.setAttribute('id', 'pic' + i);
    img.setAttribute('src', 'img/' + image_array_arg[selection]);
    gebi('page-container').appendChild(img);
    gebi('pic' + i).addEventListener('click', swap_pic);
  }
}

populate_images(pics_array);
