var shareImageButton = document.querySelector("#share-image-button");
var createPostArea = document.querySelector("#create-post");
var closeCreatePostModalButton = document.querySelector(
    "#close-create-post-modal-btn"
);
var sharedMomentsArea = document.querySelector("#shared-moments");

function openCreatePostModal() {
    createPostArea.style.display = "block";
    if (deferredPrompt) {
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then(function (choiceResult) {
            console.log(choiceResult.outcome);

            if (choiceResult.outcome === "dismissed") {
                console.log("User cancelled installation");
            } else {
                console.log("User added to home screen");
            }
        });

        deferredPrompt = null;
    }
}

function closeCreatePostModal() {
    createPostArea.style.display = "none";
}

shareImageButton.addEventListener("click", openCreatePostModal);

closeCreatePostModalButton.addEventListener("click", closeCreatePostModal);

function createCard() {
    var cardWrapper = document.createElement("div");
    cardWrapper.className = "shared-moment-card mdl-card mdl-shadow--2dp";
    var cardTitle = document.createElement("div");
    cardTitle.className = "mdl-card__title";
    cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
    cardTitle.style.backgroundSize = "cover";
    cardTitle.style.height = "180px";
    cardWrapper.appendChild(cardTitle);
    var cardTitleTextElement = document.createElement("h2");
    cardTitleTextElement.className = "mdl-card__title-text";
    cardTitleTextElement.textContent = "San Francisco Trip";
    cardTitleTextElement.style.color = "yellow";
    cardTitle.appendChild(cardTitleTextElement);
    var cardSupportingText = document.createElement("div");
    cardSupportingText.className = "mdl-card__supporting-text";
    cardSupportingText.textContent = "In San Francisco";
    cardSupportingText.style.textAlign = "center";

    const button = document.createElement("button");
    button.textContent = "Cache me";
    button.addEventListener("click", () => {
        if ("caches" in window) {
            caches.open("button").then((cache) => {
                cache.add("https://httpbin.org/get");
                cache.add("/src/images/sf-boat.jpg");
            });
        }
    });
    cardSupportingText.appendChild(button);

    cardWrapper.appendChild(cardSupportingText);
    componentHandler.upgradeElement(cardWrapper);
    sharedMomentsArea.innerHTML = "";
    sharedMomentsArea.appendChild(cardWrapper);
}

let fetchUrl = "https://httpbin.org/get";
let networkFetchComplete = false;

// fetch by network first
fetch(fetchUrl)
    .then((response) => {
        if (response != undefined) {
            return response.json();
        }
    })
    .then((data) => {
        networkFetchComplete = true;
        createCard();
    });

// fetch by cache next
if (!networkFetchComplete && "caches" in window) {
    caches
        .match(fetchUrl)
        .then((response) => {
            if (response != undefined) {
                return response.json();
            } else {
            }
        })
        .then((data) => {
            createCard();
        });
}
