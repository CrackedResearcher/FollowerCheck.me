document.addEventListener("DOMContentLoaded", function () {
  console.log("dom loaded entered into popup");
  let followerCount = localStorage.getItem("Total Follower Count");
  if (followerCount) {
    document.getElementById("valueof_followers").innerText = followerCount;
  } else {
  }

  document
    .getElementById("savefollowers")
    .addEventListener("click", function () {
      console.log("clicked on button");

      localStorage.clear();

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { command: "findFollowers" },
          function (response) {
            if (response.result) {
              console.log(response.result);
              storeDataIntoLocalStorage(response.result);
            } else {
              console.log("error while storing data to local storage..");
            }
          }
        );
      });
    });

  document
    .getElementById("checkUnfollowers")
    .addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { command: "findFollowers" },
          function (response) {
            if (response.result) {
              culprits = attack_the_unfollower(response.result);

              if (culprits) {
                document.getElementById("list_unfollowers").innerText =
                  "These ppl unfollowed you, you too unfollow them 😠 \nDO remember: if your follower count has increased since last time then they may also be listed below.\n\n";

                unfollower_list = [];
                let count = 0;

                Object.keys(culprits).forEach((index) => {
                  let link = document.createElement("a");
                  link.href = "https://instagram.com" + culprits[index];

                  filterLinkText = culprits[index].replace(/^\/|\/$/g, "");
                  link.append(document.createTextNode(filterLinkText));
                  link.style.display = "inline";
                  link.target = "_blank";

                  let nodeToAdd = document.createTextNode(count + 1 + ". ");
                  let createdDiv = document.createElement("div");
                  createdDiv.style.paddingBottom = "3px";
                  createdDiv.appendChild(nodeToAdd);
                  createdDiv.appendChild(link);

                  document
                    .getElementById("list_unfollowers")
                    .appendChild(createdDiv);
                  unfollower_list.push(link);
                  console.log("appending completed!");
                  count++;
                });
              }
            }
          }
        );
      });
    });
});

function storeDataIntoLocalStorage(value) {
  console.log("gotten data: ", value);
  let idVal = 0;
  value.forEach((element) => {
    localStorage.setItem(idVal, element);
    idVal = idVal + 1;
  });
  totalFollowers = idVal;
  localStorage.setItem("Total Follower Count", totalFollowers);
  document.getElementById("valueof_followers").innerText = totalFollowers;
  console.log("stored data success!");
}

function getDataFromLocalStorage() {
  followerData = [];
  let totalCount = localStorage.getItem("Total Follower Count");
  for (let i = 0; i < totalCount; i++) {
    followerData.push(localStorage.getItem(i));
  }
  return followerData;
}

function attack_the_unfollower(currentFollowers) {
  currentFrends = currentFollowers;
  console.log(currentFrends);
  pastFollowerData = getDataFromLocalStorage();
  let culprits = {};
  let numbering = 0;

  pastFollowerData.forEach((follower) => {
    console.log("checking follower with id: ", follower);

    if (currentFrends.includes(follower)) {
      console.log(follower + "matched with ", currentFollowers);
      console.log("good to go!");
    } else {
      console.log("found a unfollower", follower);
      culprits[numbering] = follower;
    }

    numbering = numbering + 1;
  });

  numbering = numbering + 1;

  currentFollowers.forEach((newfollower) => {
    if (pastFollowerData.includes(newfollower)) {
      console.log("maybe new follower or unfollower: ", pastFollowerData);
      console.log("completed past follower checking");
    } else {
      console.log("a new follower? ");
      culprits[numbering] = newfollower;
    }
    numbering = numbering + 1;
  });

  return culprits;
}
