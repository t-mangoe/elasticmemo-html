class HttpClient {
    constructor() {
        // this.baseUrl = "http://localhost:9200/my_index/my_type/?pretty";
        this.baseUrl = "http://localhost:9200/my_index/my_type/";
    }

    regist(title, contents, callback) {

        const date = new Date();
        const dateStr = date.toISOString();

        $.ajax({
            url: this.baseUrl + "?pretty",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                user_name: "user",
                date: dateStr,
                title: title,
                message: contents
            })
        }).done(function (data, status, xhr) {
            callback();
        }).fail(function (xhr, status, err) {
            console.log(err);
        });
    }

    refreshLatest(callback) {
        $("#card-area").empty();
        $.ajax({
            url: "http://localhost:9200/my_index/_search",
            type: "POST",
            crossDomain: true,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                sort: [{
                    date: "desc"
                }]
            }),
        }).done(function (data, status, xhr) {
            console.log(data);
            callback(data, status, xhr);
        }).fail(function (xhr, status, err) {
            console.log(xhr);
        });
    }

    edit(id, title, contents, callback) {
        const date = new Date();
        const dateStr = date.toISOString();

        $.ajax({
            url: this.baseUrl + id + "?pretty",
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                user_name: "user",
                date: dateStr,
                title: title,
                message: contents
            })
        }).done(function (data, status, xhr) {
            console.log(data);
            if (callback) callback(data);
        }).fail(function (xhr, status, err) {
            console.log(err);
        });
    }

    search(searchStr, callback) {
        $.ajax({
            url: this.baseUrl + "_search?pretty",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                query: {
                    match: {
                        message: searchStr
                    }
                }
            })
        }).done(function (data, status, xhr) {
            console.log(data);
            if (callback) callback(data);
        }).fail(function (xhr, status, err) {
            console.log(err);

        })
    }
}