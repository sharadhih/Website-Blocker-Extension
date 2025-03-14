window.onload = ()=>{
    updateBlockedWebsitesSection();
    var blockButton = document.getElementById("blockButton");
    blockButton.onclick = function () {
      getWebsiteInput();
    };
  };
  
  function getWebsiteInput() {
    var websiteInput = document.getElementById("websiteInput").value;
    if (!websiteInput) {
      alert("Error: please enter a website URL");
    } else {
      chrome.storage.sync.get("blockedWebsitesArray", function (data) {
        var blockedWebsitesArray = data.blockedWebsitesArray || [];
        const isInputInArray = blockedWebsitesArray.some(
          (item) => item === websiteInput
        );
        if (isInputInArray) {
          alert("Error: URL is already blocked");
        } else {
          blockedWebsitesArray.push(websiteInput);
          chrome.storage.sync.set(
            { blockedWebsitesArray: blockedWebsitesArray },
            function () {
              updateBlockedWebsitesSection();
              document.getElementById("websiteInput").value = "";
              document.getElementById("websiteInput").focus();
            }
          );
        }
      });
    }
  }
  
  function updateBlockedWebsitesSection() {
    const blockedWebsitesDiv = document.getElementById("blockedWebsitesDiv");
    while (blockedWebsitesDiv.firstChild) {
      blockedWebsitesDiv.removeChild(blockedWebsitesDiv.firstChild);
    }
    chrome.storage.sync.get("blockedWebsitesArray", function (data) {
      const blockedWebsitesArray = data.blockedWebsitesArray;
      if (blockedWebsitesArray && blockedWebsitesArray.length > 0) {
        const nothingBlockedDiv = document.querySelector(".nothingBlocked");
        if (nothingBlockedDiv) {
          blockedWebsitesDiv.removeChild(nothingBlockedDiv);
        }
        blockedWebsitesArray.forEach((website, index) => {
          const websiteDiv = document.createElement("div");
          websiteDiv.classList.add("websiteDiv");
          const websiteDivText = document.createElement("div");
          websiteDivText.classList.add("websiteDivText");
          websiteDivText.textContent = website;
          websiteDiv.appendChild(websiteDivText);
          const deleteButton = document.createElement("button");
          deleteButton.classList.add("delete");
          deleteButton.setAttribute("id", index);
          const trashIcon = document.createElement("i");
          trashIcon.classList.add("fas", "fa-trash");
          trashIcon.setAttribute("id", index);
          deleteButton.appendChild(trashIcon);
          deleteButton.addEventListener("click", unblockURL);
          websiteDiv.appendChild(deleteButton);
          blockedWebsitesDiv.appendChild(websiteDiv);
        });
      } else {
        const nothingBlocked = document.createElement("div");
        nothingBlocked.textContent = "No websites have been blocked";
        nothingBlocked.classList.add("nothingBlocked");
        blockedWebsitesDiv.appendChild(nothingBlocked);
      }
    });
  }
  
  function unblockURL(event) {
    const clickedButtonId = event.target.id;
    chrome.storage.sync.get("blockedWebsitesArray", function (data) {
      let blockedWebsitesArray = data.blockedWebsitesArray;
      for (let i = 0; i < blockedWebsitesArray.length; i++) {
        if (clickedButtonId == i) {
          blockedWebsitesArray.splice(i, 1);
          break;
        }
      }
      chrome.storage.sync.set({ blockedWebsitesArray: blockedWebsitesArray });
      updateBlockedWebsitesSection();
    });
  }
  