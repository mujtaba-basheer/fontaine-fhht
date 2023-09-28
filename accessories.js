const recordLead = (formData, status) => {
  return new Promise((res, rej) => {
    fetch("https://hook.integromat.com/owv1pwltla93j14w971dihy6a5souj1k", {
      method: "POST",
      body: JSON.stringify({
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        LeadName: "Accessory Form",
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
  $("#wf-form-Accessory-Quote-Form").on("submit", async function (ev) {
    ev.preventDefault();
    ev.stopPropagation();

    $("input.submit").css("pointer-events", "none");

    try {
      const formData = {
        Customs: [
          {
            FieldName: "IsBrochureRequested",
            FieldValue: $("#Request-a-brochure")[0].checked ? "Yes" : "No",
          },
          {
            FieldName: "ModesOfCommunication",
            FieldValue:
              ($("#Contact-by-email")[0].checked ? "Email," : "") +
                ($("#Contact-by-phone")[0].checked ? "Phone" : "") || "None",
          },
          {
            FieldName: "Message",
            FieldValue: $("#Message-3").val(),
          },
          {
            FieldName: "NumberOfTrailersOperated",
            FieldValue: $("#Own-Operate-Trailers-3").val(),
          },
        ],
        FirstName: $("#First-Name-3").val(),
        LastName: $("#Last-Name-3").val(),
        Email: $("#Email-3").val(),
        MobilePhone: $("#Phone-3").val(),
        CountryCode: $("#Country-Trailer").val(),
        Brands: "Fontaine Specialized",
        LeadCategoryName: "fontainespecialized.com",
        IsCommunicationOptIn: $("#Contact-by-email")[0].checked,
        SMSOptIn: $("#Contact-by-phone")[0].checked,
        City: $("#City-3").val(),
        State: $("#State-3").val(),
        CompanyName: $("#Company-3").val(),
      };

      // picking rich text data

      const richTextContainer = document.querySelector(".w-richtext");
      const pTags = richTextContainer.querySelectorAll("p");
      for (const pTag of pTags) {
        const innerHTML = pTag.innerHTML;
        const htmlTxts = innerHTML.split("<br>");
        htmlTxts.forEach((htmlTxt) => {
          let [fn, fv] = htmlTxt.split("</strong>");
          fn = fn.replace("<strong>", "").replace(": &nbsp;", "");
          const obj = {
            FieldName: fn,
            FieldValue: fv,
          };
          if (fv && fn) formData.Customs.push(obj);
        });
      }

      // picking dropdown values

      const dropdownContainers = document.querySelector(
        ".trailer-options-grid"
      );
      const dropdownEls = dropdownContainers.querySelectorAll(
        ".dropdown-field:not(.w-condition-invisible)"
      );
      for (const dropdownEl of dropdownEls) {
        const fn = dropdownEl.querySelector(".form-label strong").innerText;
        const fv = dropdownEl.querySelector("select").value;
        const obj = {
          FieldName: fn,
          FieldValue: fv,
        };
        if (fv && fn) formData.Customs.push(obj);
      }

      const userUid = Aimbase.Analytics.GetUserUid(),
        sessionUid = Aimbase.Analytics.GetSessionUid();

      if (userUid) formData["UserUid"] = userUid;
      if (sessionUid) formData["SessionUid"] = sessionUid;

      // const baseUrl = "http://localhost:5001";
      const baseUrl = "https://api.fontainetrailer.com";

      const res = await fetch(`${baseUrl}/api/accessory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      await res.json();
      showFormStatus(null, "wf-form-Accessory-Quote-Form", true);
      window.scrollTo({ behavior: "smooth", top: 0 });
      await recordLead(formData, true);
    } catch (error) {
      showFormStatus(null, "wf-form-Accessory-Quote-Form", false);
      await recordLead(formData, false);
    }

    $("input.submit").css("pointer-events", "auto");
  });
});
