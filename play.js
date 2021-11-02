let history = document.querySelector(".history");

function stopPlayback() {
  let records = document.querySelectorAll(".history li");

  records.forEach(function(record){
    record.classList.remove("playback");

    if (record.dataset.timeout)
      clearTimeout(record.dataset.timeout);
    record.dataset.timeout = undefined;
  });
}

function playbackHistory(){
  let records = document.querySelectorAll(".history li");
  if (records.length == 0)
    return;

  let start_time = records[0].dataset.time;

  records.forEach(function(record){
    record.classList.add("playback");

    let timeoutCode = setTimeout(function(){
      record.classList.remove("playback");
      playSound(record.dataset.key);
    }, record.dataset.time - start_time);
    
    record.dataset.timeout = timeoutCode;
  })
};

function addToHistory(drum){
  let record = document.createElement("li");
  record.textContent = drum.dataset.key;
  record.dataset.time = Date.now();
  record.dataset.key = drum.dataset.key;

  history.appendChild(record);
  record.onclick = function(){
    record.remove();
  };
}

function playSound(key){         
    //Get data-key attribute of drum element via drum.dataset.key property
    const audio = document.querySelector(`audio[data-key="${key}"]`);
    if(!audio) {
      console.log(`No matching audio for drum with key-data=${key}`);
      return;
    }

    audio.currentTime = 0; //rewind to the start
    audio.play(); //Play the audio sound. Without the rewind, doesn't play again if already playing.

    
}

//Add mousedown event listeners to all drums
document.querySelectorAll(".drum").forEach(function(drum){
  drum.addEventListener("mousedown", function() {
    playSound(drum.dataset.key);
    addToHistory(drum);
  });
});


window.addEventListener('keydown', function(event){
  if (event.repeat) //This avoids the rapid keydown events when held.
      return;

  const drum = document.querySelector(`.drum[data-key="${event.key}"]`);
  if(!drum){
    console.log(`No drum with key-data=${event.key}`);
    return;
  }

  drum.classList.add('playing');  
  playSound(drum.dataset.key);
  addToHistory(drum);
});

window.addEventListener('keyup', function(event){
  if (event.key == "1"){ //play
    stopPlayback();
    playbackHistory();
  } else if (event.key == "2") { //stop
    stopPlayback(); 
  } else if (event.key == "3"){ //clear
    stopPlayback();
    history.replaceChildren();
  } else if (event.key == " ") {
    samplePlayAll();
  } else {
    const drum = document.querySelector(`.drum[data-key="${event.key}"]`);
    if(drum){
      drum.classList.remove('playing');
    }
  
  }

});

function samplePlayAll(){
  const pauseBetween = 200;

  document.querySelectorAll(".drum").forEach(function(drum, index){
  
      setTimeout(function(){
          playSound(drum.dataset.key);
          drum.classList.add('playing');    
      }, pauseBetween * index);
  
      setTimeout(function(){
          drum.classList.remove('playing');    
      }, pauseBetween * (index + 1));
  });
    
}



