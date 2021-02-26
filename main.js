const httpClient = new HttpClient();

$(function () {
    // $(document).ready(function () {
    // let modal = $('.modal');
    // $('.modal').modal();
    M.AutoInit();

    // const elems = document.querySelectorAll('.modal');
    // const instances = M.Modal.init(elems);

    const $memoSubmitLink = $("#memo-submit-link");
    $memoSubmitLink.click(function (event) {
        // aタグクリックでの画面遷移を無効化
        event.preventDefault();
        const title = $("#memo-title").val();
        const contents = $("#memo-text").val();
        confirm("タイトル：" + title + "\n内容：" + contents);

        const callback = function () {
            alert("登録成功");
            httpClient.refreshLatest(initCard);
        };

        httpClient.regist(title, contents, callback);

        // 内容をクリア
        $("#memo-title").val("");
        $("#memo-text").val("");
        M.updateTextFields();
        // return false;
    });

    const $editSubmitLink = $("#edit-submit-link");
    $editSubmitLink.click(function (event) {
        // aタグクリックでの画面遷移を無効化
        event.preventDefault();

        const title = $("#edit-memo-title").val();
        const contents = $("#edit-memo-text").val();
        const id = $("#edited-id").val();
        const url = "http://localhost:9200/my_index/my_type/" + id + "?pretty";

        httpClient.edit(id, title, contents);

    });

    const $deleteLink = $("#delete-link");
    $deleteLink.click(function (event) {
        // aタグクリックでの画面遷移を無効化
        event.preventDefault();

        const id = $("#edited-id").val();
        const url = "http://localhost:9200/my_index/my_type/" + id + "?pretty";

        $.ajax({
            url,
            type: "DELETE",
        }).done(function (data, status, xhr) {
            console.log(data);
            confirm("削除しました");
        }).fail(function (xhr, status, err) {
            console.log(err);
            alert("削除に失敗しました");
        });
    });

    const $searchForm = $("#search-form");
    $searchForm.submit(function (event) {
        // 画面遷移を無効化
        event.preventDefault();

        const $searchInput = $("#search-input");
        const searchStr = $searchInput.val();
        console.log("検索ワード：" + searchStr);

        $searchInput.val("");
        $searchInput.blur();
        $searchInput.val(searchStr);

        const callback = function (data) {
            initCard(data);
            $("#reset-search").css("display", "inline-block");
        }

        httpClient.search(searchStr, callback);
    });

    const callback = function (data) {
        initCard(data);
        $("#preloader").hide();
    }

    const errorCallback = function (xhr, status, err) {
        $("#preloader").hide();
        alert(error);
    }

    const $searchResetLink = $("#reset-search");
    $searchResetLink.click(function (event) {
        // aタグクリックでの画面遷移を無効化
        event.preventDefault();

        const $searchInput = $("#search-input");
        $searchInput.val("");

        // 検索リセットボタンを非表示にする
        $("#reset-search").css("display", "none");

        // カードを初期化し、元に戻す
        httpClient.refreshLatest(callback);
    });

    $("#preloader").css("display", "flex");

    httpClient.refreshLatest(callback, errorCallback);
});

function initCard(data) {
    let hitsArray = data.hits.hits;
    const $area = $("#card-area");
    $area.empty();
    if (!hitsArray.length) {
        $area.append($("<div class='msg msg-error'>メモがありません</div>"));
        return;
    }

    for (const elem of hitsArray) {
        const $card = createCard(elem);
        $area.append($card);
    }
};

function createCard(data) {
    const $cardContent = $('<div class="card-content blue-grey-text text-darken-4">');
    // const title = "タイトル";
    const id = data._id;
    const title = "title" in data._source ? data._source.title : "タイトルなし";
    const message = data._source.message;
    $cardContent.append($('<span class="card-title">').text(title));
    $cardContent.append($('<p>').text(message));
    // const $card = $('<div class="row"><div class="col s12 m6"><div class="card blue-grey lighten-5">');
    // const $card = $cardContent.appendTo($('<div class="card blue-grey lighten-5"/>').appendTo($('<div class="col s12 m6"/>').appendTo($('<div class="row"/>'))));
    // const $card = $('<div class="card blue-grey lighten-5"/>').append($cardContent);

    const $cardRow = $('<div class="row"/>');
    const $cardColumn = $('<div class="col s12 m9"/>');
    const $card = $('<div class="card blue-grey lighten-5"/>');
    $card.attr("data-id", id);
    $card.click(function (event) {
        editCard(this);
    });
    $card.hover(function (event) {
        // マウスオーバーした時の処理
        $(this).removeClass("blue-grey");
        $(this).addClass("light-blue");

    }, function () {
        // マウスが離れた時の処理
        $(this).removeClass("light-blue");
        $(this).addClass("blue-grey");
    });

    $cardContent.appendTo($card);
    $card.appendTo($cardColumn);
    $cardColumn.appendTo($cardRow);

    return $cardRow;
};

function editCard(element) {
    const $card = $(element);
    const title = $card.find("span").text();
    const contents = $card.find("p").text();
    const id = $card.data("id");

    const $modal = $("#modal2");
    $modal.find("#edit-memo-title").val(title);
    $modal.find("#edit-memo-text").val(contents);
    M.updateTextFields();

    $("#edited-id").val(id);

    M.Modal.getInstance($modal).open();

};