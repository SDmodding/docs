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

    },
    DoVehicles()
    {
        ajax.GetRequest("Docs/Vehicles/Vehicles.json", function(err, data){

            let categories = JSON.parse(data);

            let veh_viewer = document.getElementById("vehicle-viewer");

            let cat_keys = Object.keys(categories.Categories);

            cat_keys.forEach((key) => {
                let h1 = document.createElement('h1');
                h1.id = "cat-"+ key;
                h1.innerText = key;
                veh_viewer.appendChild(h1);

                let cat_models = Object.keys(categories.Categories[key]);
                cat_models.forEach((model_key) => {

                    let grid_container = document.createElement('div');
                    grid_container.classList.add("grid-container");
                    veh_viewer.appendChild(grid_container);

                    let h2 = document.createElement('h2');
                    h2.id = "model-"+ model_key;
                    h2.innerText = model_key;

                    let model_variations = Object.keys(categories.Categories[key][model_key]);
                    model_variations.forEach((variation) => {

                        let grid_item = document.createElement('div');
                        grid_item.classList.add("grid-item");
                        grid_item.innerText = variation;
                        grid_container.appendChild(grid_item);

                        let grid_item_img = document.createElement('div');
                        grid_item_img.classList.add("grid-item-img");
                        grid_item.appendChild(grid_item_img);

                        let img = document.createElement('img');
                        img.src="Docs/Vehicles/img/"+categories.Categories[key][model_key][variation]+".jpg";
                        img.setAttribute("loading", "lazzy");
                        grid_item_img.appendChild(img);
                    });
                });

            });

            
        });

        ajax.GetRequest("https://raw.githubusercontent.com/SDmodding/SDK/main/QSymbols/VehicleModels.txt", function(err, data){

            const arrayOfObjects = data.split('\n').map(item => {
                  const [hash, objName] = item.split(" - ");
                  return { hash, objName };
            });
        
            console.log(arrayOfObjects)
            
        });
    }
};