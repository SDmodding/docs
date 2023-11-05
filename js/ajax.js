const ajax = {
    GetRequest(url, callback)
    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                try {
                    callback(null, xhr.responseText)
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