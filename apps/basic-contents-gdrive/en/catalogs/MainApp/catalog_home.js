const conf = include("config.js")

var _favorites_visible = false

function play_content(data) {
    view.object("showcase.home").view("cell", "S_HOME_PLAYER").data("display-unit", data)
    view.object("showcase.home").view("cell", "S_HOME_PLAYER").action("reload")

    hide_contents()
    hide_favorites()
}

function show_contents() {
    view.object("showcase.home").action("next-page")
}

function hide_contents() {
    view.object("showcase.home").action("prev-page")
}

function show_favorites() {
    view.object("cell.favorites").action("reload")
    view.object("cell.favorites").action("show")

    _favorites_visible = true
}

function hide_favorites() {
    view.object("cell.favorites").action("hide")

    _favorites_visible = false
}

function toggle_favorite(data) {
    view.object("showcase.home").view("cell", "S_HOME_CONTENTS").action("script", {
        "script":"toggle_favorite",
        [conf.unique_key]:data[conf.unique_key]
    })
}

function remove_favorite(data) {
    view.object("showcase.home").view("cell", "S_HOME_CONTENTS").action("script", {
        "script":"remove_favorite",
        [conf.unique_key]:data[conf.unique_key]
    })
}

function show_updating_message() {
    view.object("cell.updating.message").action("show")
}

function hide_updating_message() {
    view.object("cell.updating.message").action("hide")
}

function on_back() {
    if (!_favorites_visible) {
        controller.action("back")
    } else {
        hide_favorites()
    }
}
