// Initialize Typed.js
new Typed('#typed-output', {
    strings: ["Data Analyst", "Data Scientist", "Data Engineer"],
    typeSpeed: 60, // Speed in milliseconds for typing each character
    backSpeed: 40, // Speed in milliseconds for erasing each character
    backDelay: 1000, // Delay before starting to erase (optional)
    loop: true, // Enable continuous looping
    loopCount: Infinity, // Optional: Loop infinitely
    showCursor: false, // Optional: Show the blinking cursor
});


let bar = document.querySelector(".bars .fa-bars");
let menu = document.querySelector(".menu");

bar.addEventListener("click", function () {
    menu.classList.toggle("show_menu");
});

AOS.init();

function openTab(evt, tabName) {
    // Hide all tab contents
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // Remove "active" class from all tab buttons
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show the current tab and add "active" class to the clicked tab
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}