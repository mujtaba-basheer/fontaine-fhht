const formMaps = [
  {
    id: "email-form",
    name: "Workhorse Literature",
    rootFolderId: "FLqL_zLM0CmiMoyMEtYFOo53XiUW_ym5",
    parentFolderId: "1rOj4npF6_KtqZeyodg0d991Uu32ThtRE",
  },
  {
    id: "wf-form-Magnitude-Trailer",
    name: "Workhorse Literature",
    rootFolderId: "FLqL_zLM0CmiMoyMEtYFOo53XiUW_ym5",
    parentFolderId: "1fuPJplXZDyaAUH5SjGcvrqsXBQOZ_D6B",
  },
  {
    id: "Mechanical-Gooseneck-Trailer",
    name: "Workhorse Literature",
    rootFolderId: "FLqL_zLM0CmiMoyMEtYFOo53XiUW_ym5",
    parentFolderId: "1SMuSoMT82Lt4_ykNmWY2UN5fb6PyIfx7",
  },
  {
    id: "wf-form-Renegade-Hydraulic-Gooseneck-Trailer",
    name: "Workhorse Literature",
    rootFolderId: "FLqL_zLM0CmiMoyMEtYFOo53XiUW_ym5",
    parentFolderId: "1f20RsfCkVKZGdTakCUdjjG3uEok0VMRv",
  },
  {
    id: "wf-form-Xcalibur-Trailer",
    name: "Workhorse Literature",
    rootFolderId: "FLqL_zLM0CmiMoyMEtYFOo53XiUW_ym5",
    parentFolderId: "13jGGUnN9flXBRTP_jIvOKBPdlULMWXao",
  },
  {
    id: "wf-form-Traverse-HT-Trailer",
    name: "Workhorse Literature",
    rootFolderId: "FLqL_zLM0CmiMoyMEtYFOo53XiUW_ym5",
    parentFolderId: "18ml7d1TkOLvMPMYxE4ofA9VIiniHQg4K",
  },
  {
    id: "wf-form-Specialized-General-Trailer",
    name: "Workhorse Literature",
    rootFolderId: "FLqL_zLM0CmiMoyMEtYFOo53XiUW_ym5",
    parentFolderId: "1zaZY1wL-4ZOw_iwFCZIsDK5AMjC4aSwB",
  },
  {
    id: "wf-form-Accessories-Trailer",
    name: "Workhorse Literature",
    rootFolderId: "FLqL_zLM0CmiMoyMEtYFOo53XiUW_ym5",
    parentFolderId: "1NeoDSmp15i_oifpCKtWCcvUDN1nzdtLg",
  },
];

const recordLead = (formData, status) => {
  return new Promise((res, rej) => {
    fetch("https://hook.integromat.com/owv1pwltla93j14w971dihy6a5souj1k", {
      method: "POST",
      body: JSON.stringify({
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        LeadName: "Request A Brochure",
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

window.addEventListener("load", () => {
  for (const formMap of formMaps) {
    const { id, rootFolderId, parentFolderId } = formMap;
    const formEl = document.getElementById(id);
    if (formEl) {
      const closeEl = formEl.querySelector("div.close-icon");
      if (closeEl) {
        closeEl.addEventListener("click", () => {
          formEl.style.display = "flex";
          formEl.nextElementSibling.style.display = "none";
          formEl.nextElementSibling.nextElementSibling.style.display = "none";
        });
      }

      formEl.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        ev.stopPropagation();

        const formData = {
          FirstName: formEl.querySelector(`input[name="First-Name"]`).value,
          LastName: formEl.querySelector(`input[name="Last-Name"]`).value,
          Email: formEl.querySelector(`input[name="Email"]`).value,
          CountryCode: formEl.querySelector(`select[name="Country-Literature"]`)
            .value,
          IsCommunicationOptIn: formEl.querySelector(`input[type="checkbox"]`)
            .checked,
          Brands: "Fontaine Specialized",
          LeadCategoryName: "fontainespecialized.com",
          Folder: `${rootFolderId}/${parentFolderId}`,
          Files: [],
        };

        const userUid = Aimbase.Analytics.GetUserUid(),
          sessionUid = Aimbase.Analytics.GetSessionUid();

        if (userUid) formData["UserUid"] = userUid;
        if (sessionUid) formData["SessionUid"] = sessionUid;

        const Message = formEl.querySelector(`textarea[name="Message"]`).value;
        if (Message) {
          formData["Customs"] = [
            {
              FieldName: "Message",
              FieldValue: Message,
            },
          ];
        }

        // const baseUrl = "http://localhost:5001";
        // const baseUrl = "https://fontaine-node.herokuapp.com";
        const baseUrl = "https://api.fontainetrailer.com";

        const fileEls = formEl.querySelectorAll(
          ".literature-selector .w-dyn-item"
        );
        fileEls.forEach((fileEl) => {
          const inputEl = fileEl.querySelector("input");
          if (inputEl.checked) {
            const nameEl = fileEl.querySelector("div.document-name");
            if (nameEl) {
              const fileName = nameEl.textContent.trim();
              formData.Files.push(fileName);
            }
          }
        });

        if (formData.Files.length > 0) {
          if (formData.Customs) {
            formData.Customs.push({
              FieldName: "Files",
              FieldValue: formData.Files.join(", "),
            });
          } else {
            formData.Customs = [
              {
                FieldName: "Files",
                FieldValue: formData.Files.join(", "),
              },
            ];
          }
        }

        try {
          const aimbaseCall = fetch(`${baseUrl}/api/literature-forms`, {
            method: "POST",
            body: JSON.stringify({ ...formData, Folder: null, Files: null }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const integromatCall = fetch(
            "https://hook.integromat.com/3wguvmdt19cb1zni6jplnisakoxd5m88",
            {
              method: "POST",
              body: JSON.stringify(formData),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const aimbaseReq = await aimbaseCall;
          await aimbaseReq.json();

          formEl.reset();
          formEl.style.display = "none";
          formEl.nextElementSibling.style.display = "block";

          const integromatReq = await integromatCall;
          await integromatReq.json();

          await recordLead(formData, true);
        } catch (error) {
          console.error(error);
          formEl.style.display = "none";
          formEl.nextElementSibling.nextElementSibling.style.display = "block";
          await recordLead(formData, false);
        }
      });
    }
  }
});
