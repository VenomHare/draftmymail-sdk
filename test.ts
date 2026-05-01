import { DraftMyMailAI } from "./src";

const dmm = new DraftMyMailAI({
    apiURL: "http://localhost:8787"
});

const { mail, subject } = await dmm.generate({
    context: "LorDFans is a PC Fan Selling website. It is hotspot for InHouse Engineered Efficient Fans along with External PC Fans. This mail is sent on signup for newsletter and updates",
    data: {
        email: "abce213@gmail.com",
    },
    colors: [
        { useAs: "primary", color: "Sapphire White" },
        { useAs: "secondary", color: "Pearl White" },
        { useAs: "text", color: "Dark Coffee" },
    ],
    images: [
        { useAs: "logo", image_link: "https://dynamic.brandcrowd.com/asset/logo/b02ab585-26fa-488e-9512-31430ed35393/logo-search-grid-2x?logoTemplateVersion=4&v=639071527947770000&text=LorDFans&layout=auto"}
    ]
})

console.log(mail);
console.log(subject);