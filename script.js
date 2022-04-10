const cardContainer = document.getElementById("card-container");
const loadMoreBtn = document.getElementById("load-more-btn");
const heartIcon = document.getElementById("heart-icon");
let currentIndex = 0;
let cardData = [];

window.onload = function () {
  getData().then(() => loadCards(currentIndex));
};

async function getData() {
  let data = await fetch("./data.json").then((data) => data.json());
  cardData = data.map((x, i) => {
    //adding IDs for each of the objects in the array, so we can differentiate them
    x["id"] = i;
    return x;
  });
}

function updateCurrentLikesCount(e, element) {
  let clickedHeartIcon = e;
  let currentElement = cardData.find((x) => x.id == element);
  let currentElementID = currentElement.id;
  let currentCardLikes = document.getElementById(`card-likes-${currentElement.id}`); //get the span element with unique ID where the like counts will be displayed

  if (clickedHeartIcon.style.fill == "red") {
    //we check if its clicked
    clickedHeartIcon.style.fill = "none";
    cardData[currentElementID].likes = Number(currentElement.likes) - 1;
    currentCardLikes.innerHTML = cardData[currentElementID].likes; //update cardLikes
  } else {
    clickedHeartIcon.style.fill = "red";
    cardData[currentElement.id].likes = Number(cardData[currentElement.id].likes) + 1;
    currentCardLikes.innerHTML = cardData[currentElement.id].likes;
  }
}

function loadCards(currentCardNumber) {
  cardData
    .slice(currentCardNumber, currentCardNumber + 4)
    .forEach((element) => {
      cardContainer.innerHTML += `            
                    <div class="card">
                        <div id="card-header">
                            <div id="card-info">
                                <div id="profile-img">
                                    <img src=${element.profile_image} alt="">
                                </div>
                                <p id="user-info">
                                    <span style="font-weight: bold">${element.name.toUpperCase()}</span><br>
                                    <span>${formatDate(element.date)}</span>
                                </p>
                            </div>

                            <div id="instagram-logo">
                                <img  src="./assets/instagram-logo.svg" alt="">
                            </div>
                        </div>

                        <div id="card-img">
                            <img src= ${element.image} alt="">
                        </div>

                        <p id="card-text">
                            ${shortenText(element.caption)}
                        </p>
                        <hr>
                        <span id="likes">
                            <svg  onclick="updateCurrentLikesCount(this, ${element.id})" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path  d="M14.7617 3.26543C14.3999 2.90347 13.9703 2.61634 13.4976 2.42045C13.0248 2.22455 12.518 2.12372 12.0063 2.12372C11.4945 2.12372 10.9878 2.22455 10.515 2.42045C10.0422 2.61634 9.61263 2.90347 9.25085 3.26543L8.50001 4.01626L7.74918 3.26543C7.0184 2.53465 6.02725 2.1241 4.99376 2.1241C3.96028 2.1241 2.96913 2.53465 2.23835 3.26543C1.50756 3.99621 1.09702 4.98736 1.09702 6.02084C1.09702 7.05433 1.50756 8.04548 2.23835 8.77626L2.98918 9.52709L8.50001 15.0379L14.0108 9.52709L14.7617 8.77626C15.1236 8.41448 15.4108 7.98492 15.6067 7.51214C15.8026 7.03935 15.9034 6.53261 15.9034 6.02084C15.9034 5.50908 15.8026 5.00233 15.6067 4.52955C15.4108 4.05677 15.1236 3.62721 14.7617 3.26543V3.26543Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span id="card-likes-${element.id}">${element.likes}</span>
                        </span>
                    </div>`});

  currentIndex = currentCardNumber + 4;

  if (currentIndex >= cardData.length) {
    loadMoreBtn.style.display = "none";
  }
}

/** ////////////////////////////////////// EVENT LISTENERS/////////////////////////////////////// */

loadMoreBtn.onclick = function () {
  loadCards(currentIndex);
  console.log(currentIndex);
};

/*///////////////////////////////////////HELPER FUNCTIONS/////////////////////////////////////////*/

function formatDate(time) {
  //formats date from for example "2018-03-12 03:00:00" to "March 12 2018"
  let formatedDate = new Date(time).toDateString();
  return formatedDate.split(" ").slice(1).join(" ");
}

function shortenText(text) {
  let maxCharacters = 120;
  if (text.length > maxCharacters) {
    let shortenedText = text.substr(0, maxCharacters); //we first shorten the text to the max amount of characters
    let lastCharacter = shortenedText.lastIndexOf("."); //Then we find the last time "." occurs in the shortened text, so there wont be unfinished sentences in the text
    return shortenedText.substr(0, lastCharacter + 1);
  } else {
    return text;
  }
}
