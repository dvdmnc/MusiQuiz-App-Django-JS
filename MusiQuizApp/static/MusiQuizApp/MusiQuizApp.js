document.addEventListener("DOMContentLoaded", () => {

  try { // So we don't parse before the elements exists or after they've been removed
  const time = JSON.parse(document.getElementById('time').textContent);
  const turn = JSON.parse(document.getElementById('turn').textContent);
  const songs = JSON.parse(document.getElementById('songs').textContent);
  const songs_singers = JSON.parse(document.getElementById('songs_singers').textContent);
  const singers_names_faces = JSON.parse(document.getElementById('singers_names_faces').textContent);
  const songs_samples = JSON.parse(document.getElementById('songs_samples').textContent);
  
  teams = [];
  
  for (let i = 1; i <= turn; i++) { //We set the list that we're going to use to count and display the team and round number. 
    teams.push(i);
    if (document.getElementById("teamturn") != null){ // If team game : We create the table with all the teams and set the score to 0
      const team_score_display = document.createElement("tr");
      const team_display = document.createElement("td");
      const score_display = document.createElement("td");
      score_display.id = `team${i}_score`;
      const team_display_text = document.createTextNode(`Equipe ${i}`);
      team_display.appendChild(team_display_text);
      const score_display_text = document.createTextNode("0");
      score_display.appendChild(score_display_text);
      team_score_display.appendChild(team_display);
      team_score_display.appendChild(score_display);
      document.getElementById("scoretable").appendChild(team_score_display);
    };
  };
  
  i=0;
  function SetGame(){
    team_turn = teams[i];
    if (document.getElementById("teamturn") != null){
      document.getElementById("teamturn").innerHTML = "Tour équipe : "+ team_turn +"  |";
    }
    else{
      document.getElementById("turn").innerHTML = "Tour n°"+ team_turn +" sur "+turn+"  |";
    };
    random_songs = [];
    random_singers = [];
    random_samples = [];
    for (let j = 9; j >= 0; j--){ //We create a list of 10 random songs
      index = Math.floor(Math.random() * songs.length);
      random_songs.push(songs[index]);
      random_samples.push(songs_samples[songs[index]]);
      for(let key in songs_singers){
        if (songs_singers[key].includes(songs[index])){ //We look for the singer who sing this song
          if (random_singers.includes(key)){ //If we had a song of this singer he/she is already in the list, then no need to add it again
            continue
          };
          random_singers.push(key);
        };
      };
      songs.splice(index,1);
    };
    random_faces = [];
    for (let y = 0; y < random_singers.length; y++){ //Create a list containing the faces of all the chosen singers
      random_faces.push(singers_names_faces[random_singers[y]]);
    };
    const songs_links = document.getElementsByClassName("songlink");
    for (let k = 0; k < random_songs.length; k++){ //Display the songs
      songs_links[k].innerHTML = random_songs[k];
    };
    const samples_links = document.getElementsByClassName("samplelink");
    for (let b = random_samples.length -1; b >= 0; b--){ //Display the samples in random order
      index = Math.floor(Math.random() * random_samples.length);
      samples_links[b].nextElementSibling.src = random_samples[index];
      random_samples.splice(index,1); 
    };
    document.getElementById("names").innerHTML = "";
    document.getElementById("faces").innerHTML = ""; //We clear the names and faces from the last round
    for(let x = random_singers.length-1 ;x >= 0 ; x--){ //Create all the elements we need to display singers and faces, then display them (the number of songs is fixed all the time so we can have the <a> and <p> containing the songs already created, but that's not the case for the singers and faces)
      index = Math.floor(Math.random() * random_singers.length);
      index2 = Math.floor(Math.random() * random_faces.length); //We get random indexes to display singers and faces in random order
      const img = document.createElement("img");
      const namelink = document.createElement("a");
      const facelink = document.createElement("a");
      namelink.href = "#";
      facelink.href = "#";
      namelink.style.color = "black";
      namelink.className = "namelink";
      facelink.className = "facelink";
      namelink.style.display = "block";
      namelink.style.marginTop = "10px";
      img.src = random_faces[index2];
      random_faces.splice(index2,1); //The delete method doesn't change the size of the array, so we use splice
      img.style.maxHeight = "30%";
      img.style.maxWidth = "30%";
      img.style.margin = "7px";
      namelink.innerHTML = random_singers[index];
      random_singers.splice(index,1);
      facelink.appendChild(img);
      document.getElementById("names").appendChild(namelink);
      document.getElementById("faces").appendChild(facelink);
    };
    //Link between Singer&Songs, Link between Singer&Face, Link between Singer&Sample
    const faces_links = document.getElementsByClassName("facelink");
    const names_links = document.getElementsByClassName("namelink");
    songclicked = "";
    nameclicked = "";
    faceclicked = "";
    sampleclicked = "";
    for (let h = 0; h < songs_links.length; h++){ //Link between songs and singer, Link between songs and samples
      songs_links[h].addEventListener("click", function (event){
        event.preventDefault();
        songclicked = songs_links[h].innerHTML; //We get the value of the clicked song
        songclickedelement = songs_links[h];
        if (nameclicked != ""){
          if (songs_singers[nameclicked].includes(songclicked)){ //If it is sung by the singer whose name was clicked before, we add 1 to the current team score
            if (document.getElementById("teamturn") != null){ //We first check if it's a team game, because if it's not we don't have a score table
              alert("Bien joué ! 1 point !");
              score = parseInt(document.getElementById(`team${team_turn}_score`).innerHTML);
              score += 1;
              document.getElementById(`team${team_turn}_score`).innerHTML = `${score}`;
            }
            else{
              alert("Bien joué ! 1 point !");
            };
            songclickedelement.style.color = "white";
            songclickedelement.style.backgroundColor = "green"
            nameclickedelement.style.backgroundColor = "green";
            nameclickedelement.style.color = "white";
            songclicked = "";
            nameclicked = "";
            faceclicked = "";
            sampleclicked = "";
          }
          else {
          //Otherwise, we first check if a name was clicked before, if yes we print a message ("Wrong"), if no we do nothing
            alert("Mauvais choix");
            songclicked = "";
            nameclicked = "";
            faceclicked = "";
            sampleclicked = "";
          };
        }
          else if (sampleclicked != ""){
          if ("http://127.0.0.1:8000"+songs_samples[songclicked] == sampleclicked){ //If the name of the song matches the sample that was clicked before, we add 1 to the current team score
            if (document.getElementById("teamturn") != null){ //We first check if it's a team game, because if it's not we don't have a score table
              alert("Bien joué ! 1 point !");
              sampleclickedelement.nextElementSibling.pause();
              score = parseInt(document.getElementById(`team${team_turn}_score`).innerHTML);
              score += 1;
              document.getElementById(`team${team_turn}_score`).innerHTML = `${score}`;
            }
            else{
              alert("Bien joué ! 1 point !");
              sampleclickedelement.nextElementSibling.pause();
            };
            songclickedelement.style.color = "white";
            songclickedelement.style.backgroundColor = "green";
            sampleclickedelement.style.color = "white";
            sampleclickedelement.style.backgroundColor = "green";
            sampleclickedelement.nextElementSibling.style.filter = "blur(5px)";
            songclicked = "";
            nameclicked = "";
            faceclicked = "";
            sampleclicked = "";
          }
          else{
            alert("Mauvais choix");
            songclicked = "";
            nameclicked = "";
            faceclicked = "";
            sampleclicked = "";
          };
        }
      });
      
      samples_links[h].addEventListener("click", function (event){ //Link between sample & song => We have the same number of samples and songs
        event.preventDefault();
        sampleclicked = samples_links[h].nextElementSibling.src;
        sampleclickedelement = samples_links[h];
        if (songclicked != ""){ //If a song was clicked before the sample
          if("http://127.0.0.1:8000"+songs_samples[songclicked] == sampleclicked){ //If the src of the sample is the same as the one we have for this song, we add 1 to the current team score
          if (document.getElementById("teamturn") != null){
            alert("Bien joué ! 1 point !");
            sampleclickedelement.nextElementSibling.pause();
            score = parseInt(document.getElementById(`team${team_turn}_score`).innerHTML);
            score += 1;
            document.getElementById(`team${team_turn}_score`).innerHTML = `${score}`;}
            else{
              alert("Bien joué ! 1 point !");
              sampleclickedelement.nextElementSibling.pause();
            };
            sampleclickedelement.style.color = "white";
            sampleclickedelement.style.backgroundColor = "green";
            sampleclickedelement.nextElementSibling.style.filter = "blur(5px)";
            songclickedelement.style.color = "white";
            songclickedelement.style.backgroundColor = "green";
            songclicked = "";
            nameclicked = "";
            faceclicked = "";
            sampleclicked = "";
          }
          else{ //Otherwise we print a message "Wrong"
            alert("Mauvais choix");
            faceclicked = "";
            nameclicked = "";
            songclicked = "";
            sampleclicked = "";
          };
        };
      });
    }; 
    for (let n = 0; n < names_links.length; n++){ //We have the same number of names and faces
      names_links[n].addEventListener("click", function (event){//Link between song&singer, link between singer&face
        event.preventDefault();
        nameclicked = names_links[n].innerHTML;
        nameclickedelement = names_links[n];
        if (songclicked != ""){
        if (songs_singers[nameclicked].includes(songclicked)){ //If it is sung by the singer whose name was clicked before, we add 1 to the current team score
          if (document.getElementById("teamturn") != null){
            alert("Bien joué ! 1 point !");
            score = parseInt(document.getElementById(`team${team_turn}_score`).innerHTML);
            score += 1;
            document.getElementById(`team${team_turn}_score`).innerHTML = `${score}`;
          }
          else{
            alert("Bien joué ! 1 point !");
          };
          songclickedelement.style.color = "white";
          songclickedelement.style.backgroundColor = "green"
          nameclickedelement.style.backgroundColor = "green";
          nameclickedelement.style.color = "white";
          songclicked = "";
          nameclicked = "";
          faceclicked = "";
          sampleclicked = "";
        }
        else {//Otherwise, we first check if a song was clicked before, if yes we print a message ("Wrong"), if no we do nothing
          alert("Mauvais choix");
          songclicked = "";
          nameclicked = "";
          faceclicked = "";
          sampleclicked = "";
        };}
        if (faceclicked != ""){ //If a face was clicked before the name
          if("http://127.0.0.1:8000"+singers_names_faces[nameclicked] == faceclicked){ //If the src of the face is the same as the one we have for this name, we add 1 to the current team score
          if (document.getElementById("teamturn") != null){
            alert("Bien joué ! 1 point !");
            score = parseInt(document.getElementById(`team${team_turn}_score`).innerHTML);
            score += 1;
            document.getElementById(`team${team_turn}_score`).innerHTML = `${score}`;
            }
            else{
              alert("Bien joué ! 1 point !");
            };
            faceclickedelement.style.filter = "blur(10px)";
            faceclickedelement.style.setProperty("transform", "none");
            nameclickedelement.style.color = "white";
            nameclickedelement.style.backgroundColor = "green";
            songclicked = "";
            nameclicked = "";
            faceclicked = "";
            sampleclicked = "";
          }
          else{ //Otherwise we print a message "Wrong"
            alert("Mauvais choix");
            faceclicked = "";
            nameclicked = "";
            songclicked = "";
            sampleclicked = "";
          };
        };
      }); 
      faces_links[n].addEventListener("click", function (event){ //Link between face and singer
        event.preventDefault();
        faceclicked = faces_links[n].firstChild.src;
        faceclickedelement = faces_links[n].firstChild;
        if (nameclicked != ""){ //If a name was clicked before the face
          if("http://127.0.0.1:8000"+singers_names_faces[nameclicked] == faceclicked){ //If the src of the face is the same as the one we have for this name, we add 1 to the current team score
          if (document.getElementById("teamturn") != null){
            alert("Bien joué ! 1 point !");
            score = parseInt(document.getElementById(`team${team_turn}_score`).innerHTML);
            score += 1;
            document.getElementById(`team${team_turn}_score`).innerHTML = `${score}`;}
            else{
              alert("Bien joué ! 1 point !");
              
            };
            faceclickedelement.style.filter = "blur(10px)";
            faceclickedelement.style.setProperty("transform", "none");
            nameclickedelement.style.color = "white";
            nameclickedelement.style.backgroundColor = "green";
            songclicked = "";
            nameclicked = "";
            faceclicked = "";
            sampleclicked = "";
          }
          else{ //Otherwise we print a message "Wrong"
            alert("Mauvais choix");
            faceclicked = "";
            nameclicked = "";
            songclicked = "";
            sampleclicked = "";
          };
        };
      });
    };
  };
  SetInterval();
  function SetInterval() { //Set the timer
    SetGame();
    var timer2 = `${time}:00`;
    var isPaused = false;
    
    var interval = setInterval(function() {
      if (!isPaused){

        var timer = timer2.split(':');
        //by parsing integer, I avoid all extra string processing
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) clearInterval(interval);
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        document.getElementById("timer").innerHTML = "Temps restant : " + minutes + ':' + seconds + " minutes.";
        timer2 = minutes + ':' + seconds;

      };
      //We check if every link was found. If so we stop the time and display a button to pass to next turn
      const faces_links = document.getElementsByClassName("facelink");
      const songs_links = document.getElementsByClassName("songlink");
      const samples_links = document.getElementsByClassName("samplelink");
      linksfound = 0;
      totallinks = 0;
      for (let h = 0; h < songs_links.length; h++){
        totallinks += 1;
        if (songs_links[h].style.color == "white"){
          linksfound +=1
        };
      };
      for (let n = 0; n < faces_links.length; n++){
        totallinks += 1 
        if (faces_links[n].firstChild.style.filter == "blur(10px)"){
          linksfound += 1;
        };
      };
      for (let d = 0; d < samples_links.length; d++){
        totallinks += 1 
        if (samples_links[d].nextElementSibling.style.filter == "blur(5px)"){
          linksfound += 1;
        };
      };
      
    

    if ((minutes == 0 && seconds == '0'+0) || (linksfound == totallinks)) { //When the timer reaches 0, or the teams/players found all the links, we display a "next" button, once clicked we set a new timer, we change team turn or round and set new songs/singers/faces
      clearInterval(interval);
      document.getElementById("next").style.display = "inline";
      document.getElementById("next").addEventListener("click", function NewRound(){
        document.getElementById("next").style.display = "none";
        document.getElementById("next").removeEventListener("click", NewRound); //To avoid having multiple event listener on the same button
        i += 1;
        const songs_links = document.getElementsByClassName("songlink");
        for (let k = 0; k < songs_links.length; k++){
          songs_links[k].style.color = "black"; //We reset the links to black
          songs_links[k].style.backgroundColor = "white";
          songs_links[k].replaceWith(songs_links[k].cloneNode(true)); //This is used to remove the current event listener from each link
          };
        const samples_links = document.getElementsByClassName("samplelink");
        for (let b = 0 ; b < samples_links.length; b++){
          samples_links[b].style.color = "black"; //We reset the links to black
          samples_links[b].style.backgroundColor = "white";
          samples_links[b].nextElementSibling.style.filter = "blur(0px)";
          samples_links[b].replaceWith(samples_links[b].cloneNode(true)); //This is used to remove the current event listener from each link
        };
        if (i < teams.length){ //We do this until all teams have played or all rounds have passed.
          SetInterval();
        };
        if (i == teams.length && document.getElementById("teamturn") != null){ //If every team played we call the end game view and pass the results
          resultstring = "";
          for (let f = 1; f <= turn; f++){
            const team_score = document.getElementById(`team${f}_score`);
            const team_score_text = team_score.innerHTML;
            resultstring += "+" + team_score_text;
          };
          document.location.href = `end_game/${resultstring}`;
        }
        else if (i == teams.length && document.getElementById("teamturn") == null){ //If every round was played
          resultstring = "round";
          document.location.href = `end_game/${resultstring}`;
        };
    });
    };
    }, 1000); 

    //Play & Pause buttons
    document.getElementById("play").addEventListener("click", function(event){
      event.preventDefault();
      isPaused = false;
    });
    document.getElementById("pause").addEventListener("click", function(event){
      event.preventDefault();
      isPaused = true;
    });
  };}

  catch{
    console.log("Game hasn't started yet or end game");
  };
  
})