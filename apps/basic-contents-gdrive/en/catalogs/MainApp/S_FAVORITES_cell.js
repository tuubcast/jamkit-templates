const conf = include("config.js")

function on_select_favorite(data) {
    owner.action("script", Object.assign({}, data, {
        "script":"play_content"
    }))
}

function remove_favorite(data) {
    view.object("showcase.favorites").action("remove", { "display-unit":"S_FAVORITES_" + data[conf.unique_key] })
    owner.action("script", {
        "script":"remove_favorite",
        [conf.unique_key]:data[conf.unique_key]
    })
}

function back() {
    owner.action("script", {
        "script":"hide_favorites"
    })
}
