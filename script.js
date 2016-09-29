$(document).ready(function () {
  //variable for all the color options.
  var choices = ['blue', 'red', 'yellow', 'green', 'orange', 'purple', 'white', 'black', 'gray', 'pink', 'gold', 'silver'];
  var restartChoices = [];
  var totalChoices = choices.length;
  var restartTotalChoices = choices.length;
  var $selection;


  loadBlocks(totalChoices);
  //jquery used to check which blocks are clicked
  $('#blocks').on('click', '.block', verifySelection);

  //button to start the game (run loadBlocks)
  $('#startGame').on('click', newGame);

  //loadBlocks function should also run function to see what the input is in the form
  // and use that many blocks
  function numBlocks () {
    return $('#numBlocks').val();
  }

  //function to append the dom, remove old game, and start new.
  function newGame () {
    $('#blocks').children('.block').remove();
    //empties restartChoices and puts values back into choices array
    for (var i = 0; i < restartTotalChoices; i++) {
      //using unshift instead of push so that the choices cycle through
      choices.unshift(restartChoices.pop());
      var shuffle = 5;
      while (shuffle > 0) {
        choices.unshift(choices.pop());
        shuffle--;
      }
    }
    $selection = '';
    loadBlocks(numBlocks());
  }

  //function to load blocks in a random order on the screen.
  function loadBlocks (num) {
    //num = number of blocks selected in this game.
    for (var i = restartTotalChoices; i > num; i--) {
      restartChoices.push(choices.pop());
    }

    totalChoices = choices.length;
    //Pick the random color to be selected from the list.
    $selection = blockSelected();
    $('#randomColor').text($selection);
    $('#response').text('');

    //function to dynamically create a block and add it to the append list
    // for loop to assign all boxes
    for(var i = 0; i < totalChoices; i++) {
      var num = randomNumber();
      var boxColor = pickColor(num);
      //remove the selected color from the choices array so it can't be picked again.
      var usedChoice = choices.splice(num,1).join();
      restartChoices.push(usedChoice);
      var $block = $('<div class="block" id="' + boxColor + '"></div>');
      //append the dom
      $('#blocks').append($block);
    }
  }

  //randomly pick a color
  function pickColor(num) {
    return choices[num];
  }

  //randomly pick a number
  function randomNumber() {
    var remainingChoices = choices.length;
    return  Math.floor(Math.random() * remainingChoices - 1) + 1;
  }

  //function to randomly pick one of the blocks to guess and display it's name.
  function blockSelected () {
    var selected = pickColor(randomNumber());
    return selected;
  }

  //function to determine if correct block was picked and display the result.
  function verifySelection (event) {
    event.preventDefault();
    var $blockID = $(this).attr('id');
    var $response = '';

    if ($blockID === $selection) {
      $response = 'Winner! You know the color ' + $blockID + '.';
      //function to light up block that was picked
      correctChoice($blockID);
    } else {
      $response = 'Nope! You picked ' + $blockID + '. Try again, Dummy!';
    }
    var $colorResponse = '<span id="response">' + $response + '</span></h3>';
    $('#response').replaceWith($colorResponse);
    $('#response').css('color', $blockID);
    console.log('A ' + $blockID + ' block was selected');
  }

  //function to light up block that was picked
  function correctChoice(color) {
    //change color and/or size
    var thisID = '#' + color;
    //Flashing ends on color, so it ends up with the same color that it started as
    var colorFlashes = ['white', 'red', color, 'blue', 'green', 'yellow', 'purple']
    var colorIndex = 0;
    //setInterval to flash different colors, setTimeout to stop the flashing.

    var flash = setInterval(function () {
      $(thisID).css('background-color', colorFlashes[colorIndex]);
      colorIndex = (colorIndex + 1) % colorFlashes.length;}, 200);
    //waits to return for 2 seconds.  Clear interval is run at the end to stop the
    //setInterval function above.
    return setTimeout(function (){
      clearInterval(flash);
    }, 2000);
  }
});
