const recordLead = (formData, status) => {
  return new Promise((res, rej) => {
    fetch("https://hook.integromat.com/owv1pwltla93j14w971dihy6a5souj1k", {
      method: "POST",
      body: JSON.stringify({
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        LeadName: "Contact a Dealer",
        Brand: "fontainespecialized.com",
        Status: status ? "Passed" : "Failed",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (resp.status !== 200) throw new Error(resp.statusText);
        return resp.json();
      })
      .then(() => res(null))
      .catch(rej);
  });
};

window.addEventListener("load", function () {
  $("#scrimoverlay-close").on("click", function () {
    $(".scrimoverlay").addClass("hidden");
  });
  $("#results-close-btn").on("click", function () {
    $(".scrimoverlayresults").addClass("hidden");
  });

  {
    const resultPopupForm = $("#wf-form-Contact-Dealer-Results-Form");
    resultPopupForm.on("submit", async function (ev) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();

      $("#wf-form-Contact-Dealer-Results-Form .for-submit").css(
        "pointer-events",
        "none"
      );

      const formData = {
        FirstName: $("#First-Name-2").val(),
        LastName: $("#First-Name-2").val(),
        Email: $("#Email-7").val(),
        CountryCode: $("#Country-Contact-Dealer").val(),
        Brands: "Fontaine Specialized",
        LeadCategoryName: "fontainespecialized.com",
        PostalCode: $("#Zip").val(),
        IsCommunicationOptIn: $("input#Checkbox-Dealer-2")[0].checked,
        Customs: [
          {
            FieldName: "Message",
            FieldValue: $("#Message-2").val(),
          },
        ],
        Dealers: [
          {
            DealerName: $("#Dealer-Name").val(),
            DealerNumber: $("#Dealer-Phone").val(),
          },
        ],
      };

      if ($("#Dealer-Location").val())
        formData.Dealers[0]["DealerLocation"] = $("#Dealer-Location").val();

      const userUid = Aimbase.Analytics.GetUserUid(),
        sessionUid = Aimbase.Analytics.GetSessionUid();

      if (userUid) formData["UserUid"] = userUid;
      if (sessionUid) formData["SessionUid"] = sessionUid;

      try {
        // const baseUrl = "http://localhost:5001";
        const baseUrl = "https://api.fontainetrailer.com";

        const res = await fetch(`${baseUrl}/api/dealer`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(res.statusText);
        await res.json();
        showFormStatus(
          "scrimoverlayresults",
          "wf-form-Contact-Dealer-Results-Form",
          true
        );
        resultPopupForm[0].reset();
        $("#wf-form-Contact-Dealer-Results-Form .for-submit").css(
          "pointer-events",
          "auto"
        );
        await recordLead(formData, true);
      } catch (error) {
        console.error(error);
        showFormStatus(
          "scrimoverlayresults",
          "wf-form-Contact-Dealer-Results-Form",
          false
        );
        await recordLead(formData, false);
      }
    });

    const noResultPopupForm = $("#wf-form-Contact-Dealer-Form");
    noResultPopupForm.on("submit", async function (ev) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();

      $("#wf-form-Contact-Dealer-Form .for-submit").css(
        "pointer-events",
        "none"
      );

      const formData = {
        FirstName: $("#First-Name-3").val(),
        LastName: $("#First-Name-3").val(),
        Email: $("#Email-8").val(),
        CountryCode: $("#Country-Contact-Dealer-2").val(),
        Brands: "Fontaine Specialized",
        LeadCategoryName: "fontainespecialized.com",
        PostalCode: $("#Zip-2").val(),
        IsCommunicationOptIn: $("input#Checkbox-Dealer-1")[0].checked,
        Customs: [
          {
            FieldName: "Message",
            FieldValue: $("#Message-4").val(),
          },
        ],
      };

      const userUid = Aimbase.Analytics.GetUserUid(),
        sessionUid = Aimbase.Analytics.GetSessionUid();

      if (userUid) formData["UserUid"] = userUid;
      if (sessionUid) formData["SessionUid"] = sessionUid;

      try {
        // const baseUrl = "http://localhost:5001";
        const baseUrl = "https://fontaine-node.herokuapp.com";
        const res = await fetch(`${baseUrl}/api/dealer`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(res.statusText);
        await res.json();
        showFormStatus("scrimoverlay", "wf-form-Contact-Dealer-Form", true);
        $("#wf-form-Contact-Dealer-Form .for-submit").css(
          "pointer-events",
          "auto"
        );
        noResultPopupForm[0].reset();
      } catch (error) {
        console.error(error);
        showFormStatus("scrimoverlay", "wf-form-Contact-Dealer-Form", false);
      }
    });

    const getDetails = (el) => {
      const dealerName = el.find(".storerocket-popup-name").text().trim();
      let dealerPhone = "",
        dealerLocation = "";
      const customFields = el[0].querySelectorAll(".storerocket-popup-field");
      for (const customField of customFields) {
        const fieldName = customField
          .querySelector(".storerocket-popup-field-name")
          .textContent.trim();
        const fieldValue = customField
          .querySelector(".storerocket-popup-field-value")
          .textContent.trim();
        if (fieldName === "Dealer Number") dealerPhone = fieldValue;
        else if (fieldName === "Dealer Location") dealerLocation = fieldValue;
      }

      // setting values
      $("#Dealer-Name").val(dealerName);
      $("#Dealer-Phone").val(dealerPhone);
      $("#Dealer-Location").val(dealerLocation);
    };
    const getSuggestionsLength = () => {
      return new Promise((res, rej) => {
        setTimeout(() => res($(".storerocket-result").length), 100);
      });
    };

    const storeRocketWidget = document.querySelector("#storerocket-widget");
    const config = { attributes: false, childList: true, subtree: false };

    const config2 = { attributes: false, childList: true, subtree: false };
    const callback2 = function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.tagName !== "DIV") continue;

            const resultDiv = $(addedNode);
            const contactBtn = $(
              addedNode.querySelector("a.storerocket-result-button-1054")
            );
            contactBtn.attr("href", "#");
            contactBtn.attr("target", "_self");
            function showResForm() {
              $(".scrimoverlayresults").removeClass("hidden");
              setTimeout(() => getDetails($(".mapboxgl-popup-content")), 500);
            }
            contactBtn.on("click", showResForm);

            const currContactPopupBtn = document.querySelector(
              ".storerocket-popup-location-button"
            );
            if (currContactPopupBtn) {
              $(currContactPopupBtn).on("click", function () {
                setTimeout(() => {
                  const contactBtnPopup = $(
                    ".storerocket-popup-location-button"
                  );
                  $(contactBtnPopup).attr("href", "#");
                  $(contactBtnPopup).attr("target", "_self");
                  $(contactBtnPopup).on("click", showResForm);
                }, 500);
              });
            }

            $(addedNode).on("click", function () {
              setTimeout(() => {
                const contactBtnPopup = $(".storerocket-popup-location-button");
                contactBtnPopup.attr("href", "#");
                contactBtnPopup.attr("target", "_self");
                contactBtnPopup.on("click", showResForm);

                const phoneEl = document.querySelector(
                  ".storerocket-popup-phone"
                );
                if (phoneEl) {
                  Aimbase.Analytics.RemoveListener(phoneEl, "click");
                  Aimbase.Analytics.AddListener(
                    phoneEl,
                    "Dealer Number",
                    "click",
                    {
                      PageAction: "74f1d421-4e66-43a8-aad5-f9ad74a75abd",
                      UserUid: Aimbase.Analytics.GetUserUid(),
                      SessionUid: Aimbase.Analytics.GetSessionUid(),
                      Dealers: [
                        {
                          DealerNumber: phoneEl.textContent.trim(),
                        },
                      ],
                    },
                    "Dealer Number Click",
                    "Clicks"
                  );
                }
              }, 500);
            });
          }
        }
      }
    };
    const observer2 = new MutationObserver(callback2);

    const callback = function (mutationsList, observer) {
      const resutList = document.querySelector(
        ".storerocket-result-list-content"
      );
      if (resutList) {
        observer2.observe(resutList, config2);

        const searchField =
          storeRocketWidget &&
          storeRocketWidget.querySelector("input.storerocket-search-field");

        if (searchField) {
          searchField.addEventListener("change", async function () {
            let freq = 0;
            for (let i = 0; i < 20; i++) {
              freq = await getSuggestionsLength();
            }
            // console.log(freq);
            if (freq === 0) {
              $(".scrimoverlay").removeClass("hidden");
            } else {
              $(".storerocket-result").each(function (index) {
                const resultDiv = $(this);
                const contactBtn = $(
                  `.storerocket-result[data-index="${index}"] a.storerocket-result-button-1054`
                );
                contactBtn.attr("href", "#");
                contactBtn.attr("target", "_self");
                function showResForm() {
                  $(".scrimoverlayresults").removeClass("hidden");
                  setTimeout(
                    () => getDetails($(".mapboxgl-popup-content")),
                    500
                  );
                }
                contactBtn.on("click", showResForm);

                $(this).on("click", function () {
                  console.log("clicked");
                  setTimeout(() => {
                    const contactBtnPopup = $(
                      ".storerocket-popup-location-button"
                    );
                    console.log({ contactBtnPopup });
                    contactBtnPopup.attr("href", "#");
                    contactBtnPopup.attr("target", "_self");
                    contactBtnPopup.on("click", showResForm);
                  }, 500);
                });
              });
            }
          });
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(storeRocketWidget, config);
  }
});
