const docs = {
    menu: null,
    md_viewer: null,
    routes: null,
    theme: localStorage.getItem("theme"),
    dark_light: null,
    Initialize()
    {
        docs.SetTheme();
        docs.HandleTheme();

        docs.md_viewer = document.getElementById("md-viewer");
        ajax.GetRequest("Docs/router.json", function (error, data) {
            if(error == null){
                var json_obj = JSON.parse(data);
                docs.routes = json_obj;

                const menuHTML = docs.CreateMenu(docs.routes);
                document.getElementById('docs-menu').innerHTML = menuHTML;

                docs.LoadRouter();
            }
        })
    },
    SetTheme()
    {
        // data-bs-theme="dark"
        if(docs.theme)
        {
            switch(docs.theme)
            {
                case "os":
                    {
                        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
                            docs.dark_light = "dark";
                        else 
                            docs.dark_light = "light";
                        break;
                    }
                case "dark": docs.dark_light = "dark"; break;
                case "light": docs.dark_light = "light"; break;
            }
        }
        else
        {
            docs.dark_light = "light";
        }

        let html = document.getElementsByTagName("html")
        html[0].setAttribute("data-bs-theme", docs.dark_light);
        localStorage.setItem("theme", docs.theme);
    },
    HandleTheme()
    {
        let theme_btn = document.querySelectorAll(".theme-btn");
        theme_btn.forEach(function(btn) {
            btn.addEventListener("click", function(e) {
                docs.theme = e.target.getAttribute("data-theme");
                localStorage.setItem("theme", docs.theme);
                docs.SetTheme();
            });
        });

    },
    CreateMenu(menu_data) {
        let menuHTML = '<ul>';
    
        for (const item of menu_data) {
            menuHTML += '<li>';
            if (item.url) {
                menuHTML += `<a href="?query=${item.url}">${item.label}</a>`;
            } else {
                menuHTML += item.label;
            }
    
            if (item.children && item.children.length > 0) {
                menuHTML += docs.CreateMenu(item.children);
            }
    
            menuHTML += '</li>';
        }
    
        menuHTML += '</ul>';
        return menuHTML;
    },
    LoadRouter()
    {
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;
        const query = searchParams.get("query");

        ajax.GetRequest(query, function(error, data){
            if(error == null)
                docs.md_viewer.innerHTML = marked.parse(data);
            
        })

        console.log(query);

    }
};