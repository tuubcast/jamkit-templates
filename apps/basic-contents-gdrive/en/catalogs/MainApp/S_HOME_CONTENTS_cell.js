const sheets = require("gdrive-sheets"),
      contents = require("contents"),
      conf = include("config.js")

function on_loaded() {
    sheets.fetch_data(conf.sheet_key, conf.sheet_no).then(function(data) {
        data = data.filter(function(datum) {
            return datum[conf.unique_key] && !contents.contains(datum[conf.unique_key])
        })

        if (data.length > 0) {
            _play_content(data[0])

            controller.action("toast", { 
                "message":controller.catalog().string("Updated with the latest contents.") 
            })
        } else {
            if (contents.count() > 0) {
                _play_content(contents.random())
            }
        }

        data.reverse().forEach(function(datum) {
            if (datum[conf.unique_key] && !contents.contains(datum[conf.unique_key])) {
                if ("categories" in datum) {
                    datum["categories"].split(",").forEach(function(category) {
                        if (category.trim().length > 0) {
                            contents.categorize(datum[conf.unique_key], category.trim())
                        }
                    })
                    delete datum["categories"]
                }

                contents.submit(datum[conf.unique_key], datum);
            }
        })

        if (data.length > 0) {
            view.object("showcase.contents").action("reload")
        }

        hide_updating_message()
    }, function(error) {
        
    })

    show_updating_message()
}

function on_select_content(data) {
    _play_content(data)
}

function show_favorites() {
    owner.action("script", {
        "script":"show_favorites"
    })
}

function show_updating_message() {
    owner.action("script", {
        "script":"show_updating_message"
    })
}

function hide_updating_message() {
    owner.action("script", {
        "script":"hide_updating_message"
    })
}

function toggle_favorite(data) {
    var favorite = controller.catalog().value("showcase", "favorites", "S_FAVORITES_" + data[conf.unique_key])

    if (!favorite) {
        controller.catalog().submit("showcase", "favorites", "S_FAVORITES_" + data[conf.unique_key], contents.value(data[conf.unique_key]))
        controller.update("favorite-" + data[conf.unique_key], { 
            "favorite":"yes"
        })
        controller.action("toast", { 
            "message":controller.catalog().string("Added to favorites.")
        })
    } else {
        controller.catalog().remove("showcase", "favorites", "S_FAVORITES_" + data[conf.unique_key])
        controller.update("favorite-" + data[conf.unique_key], { 
            "favorite":"no"
        })
        controller.action("toast", { 
            "message":controller.catalog().string("Removed from favorites.")
        })
    }
}

function remove_favorite(data) {
    controller.catalog().remove("showcase", "favorites", "S_FAVORITES_" + data[conf.unique_key])
    controller.update("favorite-" + data[conf.unique_key], { 
        "favorite":"no"
    })
    controller.action("toast", { 
        "message":controller.catalog().string("Removed from favorites.")
    })
}

function start_search() {
    view.object("section.searchbar").action("show")
    view.object("keyword").action("focus")
}

function cancel_search() {
    view.object("showcase.contents").action("search-cancel")
    view.object("keyword").action("clear")
    view.object("section.searchbar").action("hide")
    view.object("keyword").action("clear")
    view.object("keyword").action("unfocus")
}

function search_keyword() {
    var keyword = view.object("keyword").value()

    if (keyword) {
        view.object("showcase.contents").action("search", {
            "keyword":keyword
        })
    } else {
        controller.action("toast", {
            "message":controller.catalog().string("Please enter a search keyword.")
        })
        view.object("keyword").action("focus")
    }
}

function clear_keyword() {
    view.object("keyword").action("clear")
    view.object("keyword").action("focus")
}

function back() {
    owner.action("script", {
        "script":"hide_contents"
    })
}

function _play_content(data) {
    owner.action("script", Object.assign({}, data, {
        "script":"play_content"
    }))
}
