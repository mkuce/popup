function initPopup() {
  const popupWrapper = document.createElement("div");
  popupWrapper.setAttribute("class", "modal");
  popupWrapper.setAttribute("id", "popup");
  popupWrapper.addEventListener("click", hidePopup);

  const content = document.createElement("div");
  content.setAttribute("class", "modal-content");

  const confirmationButton = document.createElement("button");
  confirmationButton.addEventListener("click", handleConfirmation);
  confirmationButton.innerHTML = "confirm";

  const heading = document.createElement("div");
  heading.innerHTML = "<h2>Please confirm that you read this.</h2>";

  const message = document.createElement("div");
  message.setAttribute("id", "popup-message");

  const closeButton = document.createElement("span");
  closeButton.setAttribute("class", "close");
  closeButton.setAttribute("id", "close-button");
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", hidePopup);

  content.appendChild(closeButton);
  content.appendChild(heading);
  content.appendChild(message);
  content.appendChild(confirmationButton);
  popupWrapper.appendChild(content);

  document.body.appendChild(popupWrapper);
}

function showPopup() {
  document.querySelector("#popup").style.display = "block";
}

function hidePopup() {
  document.querySelector("#popup").style.display = "none";
}

function handleConfirmation() {
  hidePopup();

  fetch("/popup/confirmation", {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.confirmationTracked) {
        let date = new Date();
        date.setTime(date.getTime() + 10 * 60 * 1000);
        const expires = "expires=" + date.toUTCString();
        document.cookie = "confirmed=true; " + expires;
      } else {
        throw new Error("There was a problem with tracking the confirmation");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    initPopup();

    if (!document.cookie.includes("confirmed=true")) {
      fetch("/popup")
        .then((response) => {
          if (response.status === 200) {
            response
              .json()
              .then((data) => {
                document.getElementById("popup-message").innerHTML =
                  data.message;
                showPopup();
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            throw new Error(
              `Request failed with status code: ${response.status}`
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  },
  false
);
