const showFormStatus = (modalClass, formId, status = true, parentClass) => {
  const statusElClass = status ? "w-form-done" : "w-form-fail";
  $(`form#${formId} + div.${statusElClass}`).css("display", "block");
  $(`form#${formId}`).css("display", "none");
  $(`form#${formId}`)[0].reset();

  setTimeout(() => {
    if (status && modalClass) $(`.${modalClass}`).addClass("hidden");
    if (parentClass) {
      $(`form#${formId}`)
        .parents(`div.${parentClass}`)
        .each(function () {
          $(this).css("display", "none");
        });
    }

    if (modalClass || parentClass) {
      $(`form#${formId} + div.${statusElClass}`).css("display", "none");
      $(`form#${formId}`).css("display", "flex");
    }
  }, 2500);
};

window.addEventListener("load", () => {
  const recordLead = (formData, status) => {
    return new Promise((res, rej) => {
      fetch("https://hook.integromat.com/owv1pwltla93j14w971dihy6a5souj1k", {
        method: "POST",
        body: JSON.stringify({
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          Email: formData.Email,
          LeadName: "NewsletterFHHT",
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

  const subFormEl = document.getElementById("email-form");

  if (subFormEl) {
    subFormEl.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();

      const formData = {
        Email: subFormEl.querySelector(`input[data-name="Email"]`).value,
        CountryCode: subFormEl.querySelector(
          `select[data-name="Country-Subscriber"]`
        ).value,
        IsCommunicationOptIn:
          subFormEl.querySelector("input#checkbox-2").checked,
        Brand: "FHH",
        SubscriberTypeCode: "NewsletterFHH",
        Customs: [
          {
            FieldName: "FirstName",
            FieldValue: subFormEl.querySelector(`input[data-name="First"]`)
              .value,
          },
          {
            FieldName: "LastName",
            FieldValue: subFormEl.querySelector(`input[data-name="Last"]`)
              .value,
          },
          {
            FieldName: "BrandName",
            FieldValue: "Fontaine",
          },
        ],
      };

      const hookData = {
        FirstName: subFormEl.querySelector(`input[data-name="First"]`).value,
        LastName: subFormEl.querySelector(`input[data-name="Last"]`).value,
        Email: subFormEl.querySelector(`input[data-name="Email"]`).value,
      };

      try {
        // const baseUrl = "http://localhost:5001";
        const baseUrl = "https://api.fontainetrailer.com";

        const res = await fetch(`${baseUrl}/api/subscribe?brand=FT`, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error(res.statusText);
        await res.json();
        showFormStatus(null, "email-form", true);
        subFormEl.reset();
        await recordLead(hookData, true);
      } catch (error) {
        showFormStatus(null, "email-form", false);
        await recordLead(hookData, false);
      }
    });
  }
});
