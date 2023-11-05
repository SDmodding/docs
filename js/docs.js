const docs = {
    menu: null,
    Initialize(callback)
    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "Docs/router.json", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                try {
                    console.log(xhr.responseText)
                    var data = JSON.parse(xhr.responseText);
                    callback(null, data);
                } catch (error) {
                    callback(error, null);
                }
                } else {
                    callback(new Error('Request failed with status: ' + xhr.status), null);
                }
            }
        };
        xhr.send();
    },
    CreateMenu(item) {
        if (item.children) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = item.label;
            a.dataset.url = item.url;
            a.classList.add("docs-link");

            const ul = document.createElement('ul');
            for (const child of item.children) {
                const child_li = document.createElement('li');
                const child_a = document.createElement('a');
                child_a.textContent = child.label;
                child_a.dataset.url = child.url;
                child_a.classList.add("docs-link");

    
                if (child.children) {
                    child_li.appendChild(CreateMenu(child));
                }
    
                child_li.appendChild(child_a);
                ul.appendChild(child_li);
            }
            li.appendChild(a);
            li.appendChild(ul);
            return li;
        } else {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = item.label;
            a.dataset.url = item.url;
            a.classList.add("docs-link");

            li.appendChild(a);
            return li;
        }
    },
    HandleMenu()
    {
        $(".docs-link").click(function(){
            console.log($(this).attr("data-url"))
            docs.GetMD($(this).attr("data-url"), function(error, content){
                console.log(content)
                if(error == null)
                    $("#main-region").html(content);
            });
        });
    },
    GetMD(url, callback)
    {
        console.log(url)
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                try {
                    console.log(xhr.responseText)
                    let output = marked.parse(xhr.responseText);
                    callback(null, output);
                } catch (error) {
                    callback(error, null);
                }
                } else {
                    callback(new Error('Request failed with status: ' + xhr.status), null);
                }
            }
        };
        xhr.send();
    }
};