const recordLead = (formData, status) => {
  return new Promise((res, rej) => {
    fetch("https://hook.integromat.com/owv1pwltla93j14w971dihy6a5souj1k", {
      method: "POST",
      body: JSON.stringify({
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        LeadName: "Build a Trailer",
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
  const formEl = document.getElementById("wf-form-Contact-Form");
  formEl.removeAttribute("method");

  formEl.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    ev.stopPropagation();

    // $("#submit-button").css("pointer-events", "none");

    try {
      const formData = {
        Customs: [
          // {
          //   FieldName: "IsBrochureRequested",
          //   FieldValue: $("#Request-a-brochure")[0].checked ? "Yes" : "No",
          // },
          {
            FieldName: "ModesOfCommunication",
            FieldValue:
              ($("#Contact-By-Email")[0].checked ? "Email," : "") +
                ($("#Contact-By-Phone")[0].checked ? "Phone" : "") || "None",
          },
          {
            FieldName: "Message",
            FieldValue: $("#Message").val(),
          },
          {
            FieldName: "NumberOfTrailersOperated",
            FieldValue: $("#Own-Operate-Trailers").val(),
          },
        ],
        FirstName: $("#First-Name").val(),
        LastName: $("#Last-Name").val(),
        Email: $("#Email").val(),
        MobilePhone: $("#Mobile-Phone").val(),
        CountryCode: $("#Country").val(),
        Brands: "Fontaine Specialized",
        LeadCategoryName: "fontainespecialized.com",
        IsCommunicationOptIn: $("#Contact-By-Email")[0].checked,
        SMSOptIn: $("#Contact-By-Phone")[0].checked,
        City: $("#City").val(),
        CompanyName: $("#Company").val(),
        PostalCode: $("input#ZIP-3").val(),
        Products: [
          {
            ProductCode: $("#product-code").val(),
            ProductModelYear: $("#product-year").val(),
          },
        ],
      };

      const visibleTab = document.querySelector(
        ".if-commercial:not(.w-condition-invisible), .if-construction:not(.w-condition-invisible), .if-extendable:not(.w-condition-invisible)"
      );
      if (visibleTab) {
        const standardOptions = visibleTab.querySelectorAll(
          "div.filter-option-row"
        );
        for (const standardOption of standardOptions) {
          const [fName, fVal] = standardOption.querySelectorAll("div");
          if (fVal.textContent) {
            formData.Customs.push({
              FieldName: fName.textContent,
              FieldValue: fVal.textContent,
            });
          }
        }
      }

      const userUid = Aimbase.Analytics.GetUserUid(),
        sessionUid = Aimbase.Analytics.GetSessionUid();

      if (userUid) formData["UserUid"] = userUid;
      if (sessionUid) formData["SessionUid"] = sessionUid;

      // console.log(JSON.stringify(formData));

      try {
        const sp = new URLSearchParams(window.location.search);
        const isTesting = sp.get("testing") === "true";
        const baseUrl = isTesting
          ? "http://localhost:5001"
          : "https://api.fontainetrailer.com";
        // const baseUrl = "http://localhost:5001";

        const res = await fetch(`${baseUrl}/api/build-trailer`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(res.statusText);
        await res.json();

        showFormStatus(null, "wf-form-Contact-Form", true);
        window.scrollTo({ behavior: "smooth", top: 0 });
        await recordLead(formData, true);
      } catch (error) {
        console.error(error);
        showFormStatus(null, "wf-form-Contact-Form", false);
        await recordLead(formData, false);
      }
    } catch (error) {
      console.error(error);
      showFormStatus(null, "wf-form-Contact-Form", false);
    }

    $("#submit-button").css("pointer-events", "auto");
  });
});
