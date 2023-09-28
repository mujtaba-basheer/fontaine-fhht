const memberstack = window.$memberstackDom;

memberstack.getMemberJSON().then(async ({ data: memberJSON }) => {
  // Initialize vodVideos as an array
  let vodVideos;
  // Declare newMemberJSON and assign it the value of memberJSON
  let newMemberJSON = memberJSON || {};

  // If the newMemberJSON object does not have a property called "vodVideos", add it
  if (!newMemberJSON.hasOwnProperty("vodVideos")) {
    newMemberJSON["vodVideos"] = [];
  }
  // Assign vodVideos the value of the "vodVideos" property of newMemberJSON
  vodVideos = newMemberJSON["vodVideos"];

  const videoID =
    "{{wf {&quot;path&quot;:&quot;video-ecommerce-sku&quot;,&quot;type&quot;:&quot;PlainText&quot;} }}";
  const index = vodVideos.findIndex((video) => video.videoID === videoID);
  if (index !== -1 && vodVideos[index].hasOwnProperty("expirationDate")) {
    const expirationDate = new Date(vodVideos[index].expirationDate);
    const formattedExpirationDate = expirationDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    document.getElementById("expirationDate").innerHTML =
      "Rental expires on: " + formattedExpirationDate;

    //check to see if the video rental has expired and hide play buttons if true
    if (new Date() > expirationDate) {
      const btnPlay1 = document.getElementById("btnPlay1");
      if (btnPlay1) btnPlay1.style.display = "none";
      const btnPlay2 = document.getElementById("btnPlay2");
      if (btnPlay2) btnPlay2.style.display = "none";
      document.getElementById("expirationDate").innerHTML =
        "Your rental has expired.";
    }
  } else {
    document.getElementById("expirationDate").innerHTML =
      "Your rental expires in one year.";
  }

  // Add event listener for the "btnPlay1" button
  document
    .getElementById("btnPlay1")
    .addEventListener("click", async function () {
      // Get the value of the videoID variable
      const videoID =
        "{{wf {&quot;path&quot;:&quot;video-ecommerce-sku&quot;,&quot;type&quot;:&quot;PlainText&quot;} }}";

      // Find the index of the videoID in the vodVideos array
      const index = vodVideos.findIndex((video) => video.videoID === videoID);
      // If the videoID is already in the array, increment the views count for that video
      if (index !== -1) {
        vodVideos[index].views++;
      } else {
        // If the videoID is not in the list, add it with a views count of 1
        const currentDate = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(currentDate.getDate() + 365);
        vodVideos.push({
          videoID: videoID,
          views: 1,
          expirationDate: expirationDate,
        });
        const formattedExpirationDate = expirationDate.toLocaleDateString(
          "en-US",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          }
        );
        document.getElementById("expirationDate").innerHTML =
          "Rental expires on: " + formattedExpirationDate;
      }

      // Update the user's data in MemberStack with the updated newMemberJSON object
      await memberstack.updateMemberJSON({
        json: newMemberJSON,
      });

      // Hide the element with the id "vodOverlay"
      document.getElementById("vodOverlay1").style.display = "none";
    });

  // Add event listener for the "btnPlay2" button
  document
    .getElementById("btnPlay2")
    .addEventListener("click", async function () {
      // Get the value of the videoID variable
      const videoID = "{{CMS_UNIQUE_ITEM}}";

      // Find the index of the videoID in the vodVideos array
      const index = vodVideos.findIndex((video) => video.videoID === videoID);
      // If the videoID is already in the array, increment the views count for that video
      if (index !== -1) {
        vodVideos[index].views++;
      } else {
        const currentDate = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(currentDate.getDate() + 365);
        vodVideos.push({
          videoID: videoID,
          views: 1,
          expirationDate: expirationDate,
        });
        const formattedExpirationDate = expirationDate.toLocaleDateString(
          "en-US",
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          }
        );
        document.getElementById("expirationDate").innerHTML =
          "Rental expires on: " + formattedExpirationDate;
      }

      // Update the user's data in MemberStack with the updated newMemberJSON object
      await memberstack.updateMemberJSON({
        json: newMemberJSON,
      });

      // Hide the element with the id "vodOverlay"
      document.getElementById("vodOverlay2").style.display = "none";
    });
});

window.addEventListener("load", () => {
  const dateInput = document.getElementById("Date");
  if (dateInput) {
    const dateStr = new Date().toLocaleDateString();
    dateInput.value = dateStr;
  }
});
