const AWS = require("aws-sdk");
const fs = require("fs");
const dotenv = require("dotenv");
const minify = require("babel-minify");
dotenv.config();

const creds = new AWS.Credentials({
  accessKeyId: process.env.S3AccessKeyId,
  secretAccessKey: process.env.S3SecretAccessKey,
});

const S3 = new AWS.S3({ credentials: creds });

const filesToUpload = [
  // "locate-dealer",
  // "index",
  "compare-trailer",
  // "contact-fontaine",
  // "literature",
  // "enquire",
  // "accessories",
  // "integromat",
];

const returnPromise = (file) => {
  return new Promise((res, rej) => {
    S3.upload(
      {
        Bucket: "steel-croissant-static-assets",
        Key: `fontaine-heavy/${file}.js`,
        Body: fs.createReadStream(`dist/${file}.js`),
        ACL: "public-read",
        ContentType: "application/javascript",
      },
      (err, data) => {
        if (err) rej(err);
        else {
          // console.log(`uploaded: ${file}.js\t ✅`);
          console.log(`link: ${data.Location}\t ✅\n`);
          res(null);
        }
      }
    );
  });
};

for (const file of filesToUpload) {
  (async () => {
    const inputCode = fs.readFileSync(`${file}.js`, {
      encoding: "utf8",
    });
    const outputCode = minify(inputCode, {}).code;
    fs.writeFileSync(`dist/${file}.min.js`, outputCode, {
      encoding: "utf8",
    });
    await returnPromise(file + ".min");
  })();
  // (async () => {
  //   await returnPromise(file);
  // })();
}
