function on_loaded() {
    if ($data["content-id"]) {
        var favorite = controller.catalog().value("showcase", "favorites", "S_FAVORITES_" + $data["content-id"])

        if (favorite) {
            view.object("btn.favorite").property({ "selected":"yes" })
        }
    }
}

function on_data_changed(id, data) {
    if (id.startsWith("favorite-")) {
        view.object("btn.favorite").property({
            "selected":data["favorite"]
        })
    }
}

function toggle_favorite() {
    owner.action("script", {
        "script":"toggle_favorite",
        "content-id":$data["content-id"]
    })
}

function show_contents() {
    owner.action("script", {
        "script":"show_contents"
    })
}
