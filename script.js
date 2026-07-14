// Pratap Online Centre

console.log("Website Loaded Successfully");

document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function () {
        console.log("Clicked:", this.innerText);
    });
});