// ========== Mobile Nav Toggle ==========
(function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
        // Close nav when clicking a link
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
            });
        });
    }
})();

// ========== Back to Top ==========
(function () {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    function toggleVisibility() {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ========== Search Functionality ==========
(function () {
    var searchInput = document.getElementById('searchInput');
    var searchBtn = document.getElementById('searchBtn');
    var searchOverlay = document.getElementById('searchOverlay');
    var closeSearch = document.getElementById('closeSearch');
    var searchResults = document.getElementById('searchResults');

    if (!searchInput || !searchBtn || !searchOverlay || !closeSearch || !searchResults) return;

    // Build search index from page content
    function buildSearchIndex() {
        var index = [];

        // Index guide cards
        var guideCards = document.querySelectorAll('.guide-card');
        guideCards.forEach(function (card) {
            var title = card.querySelector('h3');
            var items = card.querySelectorAll('li');
            var text = '';
            items.forEach(function (li) { text += li.textContent + ' '; });
            index.push({
                title: title ? title.textContent : '',
                text: text,
                el: card
            });
        });

        // Index issue items
        var issueItems = document.querySelectorAll('.issue-item');
        issueItems.forEach(function (item) {
            var summary = item.querySelector('summary');
            var solution = item.querySelector('.issue-solution');
            index.push({
                title: summary ? summary.textContent : '',
                text: solution ? solution.textContent : '',
                el: item
            });
        });

        // Index FAQ items
        var faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(function (item) {
            var h4 = item.querySelector('h4');
            var p = item.querySelector('p');
            index.push({
                title: h4 ? h4.textContent : '',
                text: p ? p.textContent : '',
                el: item
            });
        });

        // Index error codes table rows
        var tableRows = document.querySelectorAll('table tbody tr');
        tableRows.forEach(function (row) {
            var cells = row.querySelectorAll('td');
            var title = cells.length > 0 ? cells[0].textContent : '';
            var text = '';
            for (var i = 1; i < cells.length; i++) {
                text += cells[i].textContent + ' ';
            }
            index.push({
                title: title,
                text: text,
                el: row
            });
        });

        return index;
    }

    var searchIndex = buildSearchIndex();

    function performSearch(query) {
        query = query.toLowerCase().trim();
        if (!query) {
            searchResults.innerHTML = '<p class="no-results">请输入搜索关键词</p>';
            return;
        }

        var results = [];
        searchIndex.forEach(function (entry) {
            var score = 0;
            var titleLower = entry.title.toLowerCase();
            var textLower = entry.text.toLowerCase();

            if (titleLower.indexOf(query) !== -1) score += 3;
            if (textLower.indexOf(query) !== -1) score += 1;

            // Also check individual words
            var queryWords = query.split(/\s+/);
            queryWords.forEach(function (word) {
                if (titleLower.indexOf(word) !== -1) score += 2;
                if (textLower.indexOf(word) !== -1) score += 1;
            });

            if (score > 0) {
                results.push({ entry: entry, score: score });
            }
        });

        results.sort(function (a, b) { return b.score - a.score; });

        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results">未找到相关结果，请尝试其他关键词</p>';
            return;
        }

        var html = '';
        results.forEach(function (r) {
            var snippet = r.entry.text.substring(0, 120).replace(query, '<mark>' + query + '</mark>');
            html += '<div class="search-result-item"><h4>' + escapeHTML(r.entry.title) + '</h4><p>' + snippet + '...</p></div>';
        });
        searchResults.innerHTML = html;

        // Click handler to scroll to result
        var resultItems = searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach(function (item, i) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function () {
                var target = results[i].entry.el;
                if (target) {
                    // Open details elements
                    var details = target.closest('details');
                    if (details) details.open = true;
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight briefly
                    target.style.transition = 'background 0.3s';
                    target.style.background = 'rgba(0,122,255,0.1)';
                    setTimeout(function () {
                        target.style.background = '';
                    }, 1500);
                }
                searchOverlay.hidden = true;
            });
        });
    }

    function escapeHTML(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function openSearch() {
        searchOverlay.hidden = false;
        var query = searchInput.value;
        performSearch(query);
    }

    searchBtn.addEventListener('click', openSearch);
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') openSearch();
    });
    closeSearch.addEventListener('click', function () {
        searchOverlay.hidden = true;
    });
    searchOverlay.addEventListener('click', function (e) {
        if (e.target === searchOverlay) searchOverlay.hidden = true;
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !searchOverlay.hidden) {
            searchOverlay.hidden = true;
        }
    });
})();

// ========== Smooth scroll for anchor links (accounts for sticky nav) ==========
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = 72; // navbar height + some padding
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });
})();
