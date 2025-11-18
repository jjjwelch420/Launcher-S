// Create search bar dynamically
const searchBar = document.createElement("input");
searchBar.type = "text";
searchBar.id = "searchBar";
searchBar.placeholder = "Search games...";
searchBar.classList.add("search-bar"); // apply CSS class

// Insert search bar before the launcher container
const launcher = document.getElementById("launcher");
launcher.parentNode.insertBefore(searchBar, launcher);

// Filtering logic
searchBar.addEventListener("input", function(e) {
  const query = e.target.value.toLowerCase();
  const buttons = document.querySelectorAll("#launcher .fancy-button"); // adjust if needed

  buttons.forEach(btn => {
    const text = btn.textContent.toLowerCase();
    btn.style.display = text.includes(query) ? "" : "none";
  });
});
