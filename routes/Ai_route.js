const express = require('express');
const router = express.Router();

// Load file rules.json (đường dẫn tương đối tới file này)
const rules = require('../rules.json');

function getMusicSuggestions(text) {
    const lower = text.toLowerCase();
    for (let keyword in rules) {
        if (lower.includes(keyword)) {
            return rules[keyword];
        }
    }
    return ["Xin lỗi, mình chưa có gợi ý phù hợp 😢"];
}

router.post("/chat", (req, res) => {
    const { message } = req.body;
    const suggestions = getMusicSuggestions(message);
    res.json({ reply: `🎵 Gợi ý: ${suggestions.join(", ")}` });
});

module.exports = router;
