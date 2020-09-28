function on_loaded() {
    var message = view.object("label.message").value()

    if (message) {
        _move_message(message, 1)
    }
}

function _move_message(message, step) {
    view.object("label.message").property({
        "text":message + "....".substring(0, step % 4)
    })

    timeout(0.5, function() {
        _move_message(message, step + 1)
    })
}
