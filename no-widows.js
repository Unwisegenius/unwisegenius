/* ==========================================================================
   NO WIDOWS
   Keeps at least three words on the last line of every paragraph, list item
   and caption in a case study, so no line ends with one or two words alone.
   It joins the last three words with non-breaking spaces when the page loads,
   so it keeps working whenever you edit or add text.
   ========================================================================== */
(function () {
    var WORDS_TO_KEEP = 3;   // words that always stay together on the last line
    var MIN_WORDS     = 6;   // skip very short lines (labels, one-liners)

    function keepLastWordsTogether(el) {
        if (el.textContent.trim().split(/\s+/).length < MIN_WORDS) return;

        // Every text node inside the element, in reading order
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        var nodes = [];
        var node;
        while ((node = walker.nextNode())) nodes.push(node);

        var joinsLeft = WORDS_TO_KEEP - 1;
        var seenWord = false;

        // Walk backwards from the end, swapping the last few gaps between words for &nbsp;
        for (var i = nodes.length - 1; i >= 0 && joinsLeft > 0; i--) {
            var chars = nodes[i].data.split("");
            for (var c = chars.length - 1; c >= 0 && joinsLeft > 0; c--) {
                if (!/\s/.test(chars[c])) { seenWord = true; continue; }
                if (!seenWord) continue;                     // trailing space at the very end
                var start = c;
                while (start > 0 && /\s/.test(chars[start - 1])) start--;
                chars.splice(start, c - start + 1, " ");
                c = start;
                joinsLeft--;
                seenWord = false;
            }
            nodes[i].data = chars.join("");
        }
    }

    document.querySelectorAll(".cs-band p, .cs-band li, .cs-band figcaption")
        .forEach(keepLastWordsTogether);
})();
