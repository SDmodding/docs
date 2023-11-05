document.addEventListener("DOMContentLoaded", function(){
    let sidebar_toggler = document.getElementById("sidebarCollapse");
    let sidebar = document.getElementById("sidebar");

    // Handle click of toggle sidebar button.
    sidebar_toggler.onclick = function(){
        if (sidebar.classList.contains("d-none"))
            sidebar.classList.remove("d-none");
        else
            sidebar.classList.add("d-none");
    }

    // Handle window resize for auto-hide sidebar when is small screen.
    window.addEventListener("resize", function(){
        if(window.innerWidth < 1024)
            sidebar.classList.add("d-none");
        else
            sidebar.classList.remove("d-none");
    });
    
    docs.Initialize();

    var event = new Event('resize');
    window.dispatchEvent(event);
});