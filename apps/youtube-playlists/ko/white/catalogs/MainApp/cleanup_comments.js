document.addEventListener('DOMContentLoaded', function() {
    var cleanup_comments_style = document.createElement('style');

    cleanup_comments_style.innerHTML = `
        .mobile-topbar-header,
        .player-size,
        ytm-item-section-renderer,
        #player-container-id {
            display: none !important;
        }
    `;

    document.head.appendChild(cleanup_comments_style);
})
