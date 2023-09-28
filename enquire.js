const recordLead = (formData, status) => {
  return new Promise((res, rej) => {
    fetch("https://hook.integromat.com/owv1pwltla93j14w971dihy6a5souj1k", {
      method: "POST",
      body: JSON.stringify({
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        LeadName: "Quote Request",
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
  const formId = "wf-form-Message";
  const enquireForm = $(`form#${formId}`);

  if (enquireForm.length > 0) {
    enquireForm[0].reset();

    enquireForm.on("submit", async function (ev) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();

      $("div.for-submit").css("pointer-events", "none");

      const formData = {
        FirstName: $("#First-Name-2").val(),
        LastName: $("#Last-Name-2").val(),
        Email: $("#Email-6").val(),
        CountryCode: $("#Country-Inquire").val(),
        Brands: "Fontaine Specialized",
        LeadCategoryName: "fontainespecialized.com",
        IsCommunicationOptIn: $("#checkbox")[0].checked,
        Products: [
          {
            ProductCode: $("#product-code").val(),
            ProductModelYear: $("#product-year").val(),
          },
        ],
        Customs: [],
      };
      const message = $("#Message").val();
      if (message) {
        formData["Customs"].push({
          FieldName: "Message",
          FieldValue: message,
        });
      }

      const userUid = Aimbase.Analytics.GetUserUid(),
        sessionUid = Aimbase.Analytics.GetSessionUid();

      if (userUid) formData["UserUid"] = userUid;
      if (sessionUid) formData["SessionUid"] = sessionUid;

      try {
        // const baseUrl = "http://localhost:5001";
        const baseUrl = "https://api.fontainetrailer.com";

        const res = await fetch(`${baseUrl}/api/enquire`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(res.statusText);
        await res.json();
        showFormStatus(null, formId, true);
        await recordLead(formData, true);
      } catch (error) {
        showFormStatus(null, formId, false);
        await recordLead(formData, false);
      }
    });
  }
});
