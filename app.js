const screens = {
  login: document.getElementById("loginScreen"),
  queue: document.getElementById("queueScreen"),
  document: document.getElementById("documentScreen"),
  submitted: document.getElementById("submittedScreen"),
  newPoint: document.getElementById("newPointScreen")
};

const missionPlans = {
  cluster: [
    { title: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã‚Â Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â‚¬Â", help: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¨ Ãƒâ€”Ã‚Â©Ãƒâ€”Ã…â€œ Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã…Â¾Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã‚Â Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â‚¬Â.", photo: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã‚Â Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â‚¬Â", control: `<select><option>Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã…Â¸, Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¨</option><option>Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¡ Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã‚Â£</option><option>Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¸ Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¨</option></select>` },
    { title: "Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã…Â¸", help: "Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â¤Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â§ Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â.", photo: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â", control: `<input inputmode="decimal" placeholder="Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‹Å“Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â?">` },
    { title: "Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã‚Â¢Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Âª Ãƒâ€”Ã…â€œÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â", help: "Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã…â€œ Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã‚Â©Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¡ Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã‚Âª Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â¤Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â€žÂ¢ Ãƒâ€”Ã‚Â©Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬â„¢Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â.", photo: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã‚Â£ Ãƒâ€”Ã‚ÂÃƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¡", control: `<textarea rows="3" placeholder="Ãƒâ€”Ã¢â‚¬â„¢Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â©Ãƒâ€”Ã¢â‚¬Â, Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Âª, Ãƒâ€”Ã‚ÂÃƒâ€”Ã‚Â Ãƒâ€”Ã‚Â©Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â, Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Âª..."></textarea>` }
  ],
  signage: [
    { title: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â§", help: "Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¡ Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã…Â¾Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬Ëœ.", photo: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â§", control: `<select><option>Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã…Â¸, Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¨</option><option>Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¡ Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬Å“ Ãƒâ€”Ã‚ÂªÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â</option></select>` },
    { title: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚ÂªÃƒâ€”Ã‚Â§Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Ëœ", help: "Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â¤Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã‚Â©Ãƒâ€”Ã…â€œÃƒâ€”Ã‹Å“ Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚ÂªÃƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â.", photo: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â Ãƒâ€”Ã‚ÂªÃƒâ€”Ã‚Â§Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Ëœ", control: `<textarea rows="2" placeholder="Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã‚Â© Ãƒâ€”Ã…â€œÃƒâ€”Ã‚ÂªÃƒâ€”Ã…â€œÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Â?"></textarea>` },
    { title: "Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Âª Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã‚Â¢Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Âª", help: "Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â‚¬Ëœ, Ãƒâ€”Ã¢â‚¬â„¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã¢â‚¬Â, Ãƒâ€”Ã¢â‚¬â„¢Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â©Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¸.", photo: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¸", control: `<textarea rows="3" placeholder="Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â‚¬Ëœ, Ãƒâ€”Ã¢â‚¬â„¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã¢â‚¬Â, Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬Å“, Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Â, Ãƒâ€”Ã‚Â©Ãƒâ€”Ã‚Â¤Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã‚Âª..."></textarea>` }
  ],
  booth: [
    { title: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã…Â¾Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â", help: "Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¡ Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã…Â¾Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã‚Â¨ Ãƒâ€”Ã‚Â©Ãƒâ€”Ã‚Â.", photo: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â", control: `<select><option>Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã‚Â¤Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â£ Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚ÂªÃƒâ€”Ã‚ÂÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â</option><option>Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â¨</option><option>Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã‚Â© Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â</option></select>` },
    { title: "Ãƒâ€”Ã‚Â©Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Âª Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Âª", help: "Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚ÂªÃƒâ€”Ã¢â€žÂ¢ Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã…Â¸ Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚ÂªÃƒâ€”Ã¢â€žÂ¢ Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â.", photo: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¸", control: `<textarea rows="2" placeholder="Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚ÂªÃƒâ€”Ã¢â€žÂ¢ Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã…Â¸ Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚ÂªÃƒâ€”Ã¢â€žÂ¢ Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â?"></textarea>` },
    { title: "Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã‚Â¢Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Âª Ãƒâ€”Ã…â€œÃƒâ€”Ã…Â¾Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â", help: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬Å“, Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã…â€œ, Ãƒâ€”Ã¢â‚¬â„¢Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â©Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¸.", photo: "Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã‚Â£ Ãƒâ€”Ã‚ÂÃƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¡", control: `<textarea rows="3" placeholder="Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬Å“, Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã‚Â¤Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â¤Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Âª, Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Âª, Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Â..."></textarea>` }
  ]
};

let currentType = "cluster";
let selectedNewType = "";
let activePhotoTarget = null;
let activePhotoInput = null;
let pendingPhotoItem = null;
let activePhotoEditorItem = null;
let photoEditor = null;
let editorCaption = null;
let editorToolMode = "arrow";
let activePhotoSource = "";
const photoCache = new Map();
const buildStampValue = "2026-07-14 15:32:49";
const buildStamp = document.getElementById("buildStamp");
if (buildStamp) {
  buildStamp.textContent = `Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã…Â¸ Ãƒâ€”Ã…â€œÃƒâ€”Ã‚ÂÃƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â: ${buildStampValue} IL`;
}

function getEditorSurface() {
  return document.querySelector(".editor-photo");
}

function clearEditorMarks() {
  const surface = getEditorSurface();
  if (!surface) return;
  surface.querySelectorAll(".editor-mark").forEach((mark) => mark.remove());
}

function resetEditorOverlay() {
  clearEditorMarks();
  activePhotoSource = "";
  const arrow = document.querySelector(".canvas-arrow");
  const label = document.querySelector(".canvas-label");
  if (arrow) arrow.style.display = "none";
  if (label) label.style.display = "none";
}

function addEditorMark(mode) {
  const surface = getEditorSurface();
  if (!surface) return;
  const mark = document.createElement("span");
  mark.className = `editor-mark ${mode}`;
  mark.dataset.mode = mode;
  mark.dataset.editing = "false";
  if (mode === "text") {
    mark.contentEditable = "false";
    mark.textContent = document.getElementById("editorCaption").value.trim() || "Ãƒâ€”Ã‹Å“Ãƒâ€”Ã‚Â§Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã‹Å“";
  } else if (mode === "circle") {
    mark.textContent = "ÃƒÂ¢Ã¢â‚¬â€Ã…â€™";
  } else {
    mark.textContent = "ÃƒÂ¢Ã…Â¾Ã…â€œ";
  }
  const offset = surface.querySelectorAll(".editor-mark").length * 18;
  mark.style.left = `${24 + offset}px`;
  mark.style.top = `${24 + offset}px`;
  surface.appendChild(mark);
  makeEditorMarkInteractive(mark);
}

function makeEditorMarkInteractive(mark) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  mark.addEventListener("pointerdown", (event) => {
    if (mark.dataset.editing === "true") return;
    event.preventDefault();
    dragging = true;
    try {
      mark.setPointerCapture(event.pointerId);
    } catch (error) {}
    const rect = mark.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    mark.classList.add("dragging");
  });

  mark.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    event.preventDefault();
    const surface = getEditorSurface();
    if (!surface) return;
    const bounds = surface.getBoundingClientRect();
    const nextLeft = event.clientX - bounds.left - offsetX;
    const nextTop = event.clientY - bounds.top - offsetY;
    const maxLeft = bounds.width - mark.offsetWidth - 4;
    const maxTop = bounds.height - mark.offsetHeight - 4;
    mark.style.left = `${Math.min(Math.max(4, nextLeft), Math.max(4, maxLeft))}px`;
    mark.style.top = `${Math.min(Math.max(4, nextTop), Math.max(4, maxTop))}px`;
  });

  const endDrag = () => {
    dragging = false;
    mark.classList.remove("dragging");
  };

  mark.addEventListener("pointerup", endDrag);
  mark.addEventListener("pointercancel", endDrag);

  mark.addEventListener("dblclick", (event) => {
    if (mark.dataset.mode !== "text") return;
    event.preventDefault();
    mark.dataset.editing = "true";
    mark.contentEditable = "true";
    mark.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(mark);
    selection.removeAllRanges();
    selection.addRange(range);
  });

  mark.addEventListener("blur", () => {
    if (mark.dataset.mode !== "text") return;
    mark.dataset.editing = "false";
    mark.contentEditable = "false";
    if (!mark.textContent.trim()) mark.textContent = "Ãƒâ€”Ã‹Å“Ãƒâ€”Ã‚Â§Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã‹Å“";
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawContainImage(ctx, img, canvasWidth, canvasHeight) {
  const ratio = Math.min(canvasWidth / img.naturalWidth, canvasHeight / img.naturalHeight);
  const drawWidth = img.naturalWidth * ratio;
  const drawHeight = img.naturalHeight * ratio;
  const dx = (canvasWidth - drawWidth) / 2;
  const dy = (canvasHeight - drawHeight) / 2;
  ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
}

async function flattenEditorPhoto() {
  const surface = getEditorSurface();
  const source = activePhotoSource || activePhotoEditorItem?.dataset.annotatedSrc || activePhotoEditorItem?.dataset.sourceSrc || activePhotoEditorItem?.querySelector(".photo-preview")?.src || "";
  if (!surface || !source) return null;
  const img = await loadImage(source);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(surface.clientWidth || img.naturalWidth));
  canvas.height = Math.max(1, Math.round(surface.clientHeight || img.naturalHeight));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#394b52";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawContainImage(ctx, img, canvas.width, canvas.height);
  const marks = [...surface.querySelectorAll(".editor-mark")];
  marks.forEach((mark) => {
    const left = parseFloat(mark.style.left || "0");
    const top = parseFloat(mark.style.top || "0");
    const text = (mark.innerText || mark.textContent || "").trim();
    ctx.save();
    if (mark.dataset.mode === "text") {
      const paddingX = 10;
      const height = 34;
      ctx.font = "700 18px Arial";
      const textWidth = Math.ceil(ctx.measureText(text).width);
      const width = Math.max(64, textWidth + paddingX * 2);
      ctx.fillStyle = "rgba(255,255,255,0.94)";
      ctx.strokeStyle = "#1769e0";
      ctx.lineWidth = 2;
      roundedRect(ctx, left, top, width, height, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#1769e0";
      ctx.textBaseline = "middle";
      ctx.fillText(text, left + paddingX, top + height / 2 + 1);
    } else if (mark.dataset.mode === "circle") {
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.94)";
      ctx.strokeStyle = "#1769e0";
      ctx.lineWidth = 3;
      ctx.arc(left + 18, top + 18, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.font = "700 24px Arial";
      ctx.fillStyle = "#1769e0";
      ctx.fillText("ÃƒÂ¢Ã…Â¾Ã…â€œ", left, top + 24);
    }
    ctx.restore();
  });
  return canvas.toDataURL("image/jpeg", 0.84);
}

function markLocationStepDone() {
  document.querySelector(".location-step")?.classList.add("done");
  updateProgress();
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
  document.querySelector(".bottom-nav").hidden = name !== "queue";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderMission(type) {
  currentType = type;
  const steps = missionPlans[type] || missionPlans.cluster;
  const target = document.getElementById("missionSteps");
  target.innerHTML = steps.map((step, index) => `
    <section class="mission-step field-step">
      <div class="step-title">
        <span>${index + 3}</span>
        <div>
          <h2>${step.title}</h2>
          <p>${step.help}</p>
        </div>
      </div>
      <div class="photo-line">
        <button class="add-photo" type="button">ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â· ${step.photo}</button>
        <small>Ãƒâ€”Ã‚ÂÃƒâ€”Ã‚Â¤Ãƒâ€”Ã‚Â©Ãƒâ€”Ã‚Â¨ Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â£ Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚ÂªÃƒâ€”Ã‚Â¨ Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚ÂªÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã‚Âª</small>
      </div>
      <div class="photo-gallery"></div>
      <label>Ãƒâ€”Ã‚Â¤Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã‹Å“Ãƒâ€”Ã¢â€žÂ¢ Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã‚Â©Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Ëœ
        ${step.control}
      </label>
      <button class="complete-step" type="button">Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚ÂªÃƒâ€”Ã¢â€žÂ¢ Ãƒâ€”Ã‚Â©Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Ëœ Ãƒâ€”Ã¢â‚¬â€œÃƒâ€”Ã¢â‚¬Â</button>
    </section>
  `).join("");

  document.getElementById("logisticsStepNumber").textContent = steps.length + 3;
  document.getElementById("equipmentStepNumber").textContent = steps.length + 4;
  document.getElementById("reviewStepNumber").textContent = steps.length + 5;
  updateProgress();
}

function updateProgress() {
  const total = document.querySelectorAll("#documentScreen .complete-step").length;
  const done = document.querySelectorAll("#documentScreen .mission-step.done").length;
  document.getElementById("progressText").textContent = `${done} Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚ÂªÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¡ ${total}`;
  document.getElementById("progressBar").style.width = `${Math.min(100, total ? (done / total) * 100 : 0)}%`;
}

function setActivePoint(card) {
  const type = card.dataset.type || "cluster";
  const typeBadge = document.getElementById("documentPointType");
  typeBadge.className = `point-kind ${type}`;
  typeBadge.textContent = card.dataset.badge || type;
  document.getElementById("documentPointNumber").textContent = card.dataset.number || "";
  document.getElementById("documentPointName").textContent = card.dataset.name || "";
  document.getElementById("documentPointAddress").textContent = card.dataset.address || "";
  document.getElementById("submittedPointName").textContent = `${card.dataset.number || ""} Ã‚Â· ${card.dataset.name || ""}`;
  document.getElementById("plannedLocationText").textContent = card.dataset.address || "Ã—Å“Ã—Â¤Ã—â„¢ Ã—Å¾Ã—â€¢Ã—â€˜Ã—â„¢Ã—Å“ Ã—â€Ã—Â¦Ã—â€¢Ã—â€¢Ã—Âª";
  const actual = document.getElementById("actualLocationText");
  actual.textContent = "Ã—Â¢Ã—â€œÃ—â„¢Ã—â„¢Ã—Å¸ Ã—Å“Ã—Â Ã—ÂÃ—â€¢Ã—Å¾Ã—Âª Ã—Å¾Ã—â€Ã—Å¾Ã—â€ºÃ—Â©Ã—â„¢Ã—Â¨";
  actual.className = "";
  const query = encodeURIComponent((card.dataset.location || card.dataset.address || card.dataset.name || "").replace(/\s+/g, " ").trim());
  const navLinks = document.querySelectorAll(".nav-actions a");
  navLinks[0].href = `https://www.waze.com/ul?q=${query}`;
  navLinks[1].href = `https://www.google.com/maps/search/?api=1&query=${query}`;

  document.querySelectorAll("#documentScreen .mission-step").forEach((step) => step.classList.remove("done"));
  document.getElementById("blockerBox").hidden = true;
  renderMission(type);
  updateProgress();
}

function collectMissingItems() {
  const items = [];
  document.querySelectorAll("#documentScreen .mission-step").forEach((step) => {
    const title = step.querySelector("h2")?.textContent || "Ãƒâ€”Ã‚Â©Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Ëœ";
    if (!step.classList.contains("done")) {
      items.push(`Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã…Â¸ Ãƒâ€”Ã‚Â©Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â©Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â: "${title}"`);
    }
    if (step.classList.contains("field-step") && step.querySelectorAll(".photo-item").length === 0) {
      items.push(`Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¸ Ãƒâ€”Ã‚ÂªÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã¢â‚¬Ëœ-"${title}"`);
    }
  });
  if (!document.getElementById("actualLocationText").classList.contains("location-ok")) {
    items.push("Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¸ Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â©Ãƒâ€”Ã‚Â¨");
  }
  return items;
}


function openSubmitDecision() {
  const missing = collectMissingItems();
  const list = document.getElementById("missingList");
  list.innerHTML = missing.length
    ? missing.map((item) => `<span>${item}</span>`).join("")
    : '<span class="all-good">Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…â€œ Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã…Â¸ Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â©Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â‚¬Â</span>';
  document.getElementById("submitDecision").hidden = false;
}

function openPhotoEditor(item) {
  const editor = document.getElementById("photoEditor");
  const editorPhoto = document.querySelector(".editor-photo");
  const captionInput = item.querySelector("input[type='text']");
  const preview = item.querySelector(".photo-preview");
  activePhotoEditorItem = item;
  resetEditorOverlay();
  activePhotoSource = item.dataset.annotatedSrc || preview?.src || item.dataset.sourceSrc || "";
  editor.hidden = false;
  editorPhoto.style.background = activePhotoSource
    ? `#394b52 url(${activePhotoSource}) center/contain no-repeat`
    : "#394b52";
  document.getElementById("editorCaption").value = captionInput ? captionInput.value : "";
}

function setCardAsActive(card) {
  if (!card) return;
  setActivePoint(card);
  showScreen("document");
}

function attachPointLaunchers() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("button, .my-point, .point-card");
    if (!trigger) return;

    const card = trigger.closest(".my-point, .point-card") || trigger;

    if (trigger.classList.contains("point-open") || trigger.classList.contains("take-button") || trigger.classList.contains("my-point") || trigger.classList.contains("point-card")) {
      setCardAsActive(card);
      return;
    }

    if (trigger.classList.contains("back") && trigger.dataset.nav) {
      showScreen(trigger.dataset.nav);
      return;
    }

    if (trigger.dataset.nav) {
      showScreen(trigger.dataset.nav);
      return;
    }

    if (trigger.id === "releaseButton") {
      showScreen("queue");
      return;
    }

    if (trigger.id === "blockerToggle") {
      const box = document.getElementById("blockerBox");
      box.hidden = !box.hidden;
      return;
    }

    if (trigger.classList.contains("complete-step")) {
      trigger.closest(".mission-step")?.classList.add("done");
      trigger.textContent = "ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“ Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â©Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚Â¨";
      updateProgress();
      return;
    }

    if (trigger.classList.contains("add-photo")) {
      const photoArea = trigger.closest(".blocker-box") || trigger.closest(".mission-step");
      activePhotoTarget = photoArea?.querySelector(".photo-gallery");
      activePhotoInput = document.getElementById("photoInput");
      if (!activePhotoTarget || !activePhotoInput) return;
      activePhotoInput.value = "";
      pendingPhotoItem = document.createElement("div");
      pendingPhotoItem.className = "photo-item pending-photo";
      pendingPhotoItem.innerHTML = `
        <div class="photo-thumb photo-placeholder"></div>
        <div>
          <strong>Ãƒâ€”Ã…Â¾Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚ÂªÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¸ Ãƒâ€”Ã…â€œÃƒâ€”Ã‚ÂªÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â...</strong>
          <div class="photo-actions">
            <button class="remove-photo" type="button">Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â</button>
          </div>
        </div>`;
      activePhotoTarget.appendChild(pendingPhotoItem);
      activePhotoInput.click();
      return;
    }

    if (trigger.classList.contains("annotate-button")) {
      openPhotoEditor(trigger.closest(".photo-item"));
      return;
    }

    if (trigger.classList.contains("remove-photo")) {
      trigger.closest(".photo-item")?.remove();
      return;
    }

    if (trigger.id === "addFieldPoint") {
      showScreen("newPoint");
      return;
    }

    if (trigger.id === "confirmLocation") {
      const status = document.getElementById("actualLocationText");
      status.textContent = "Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¸";
      status.className = "location-ok";
      markLocationStepDone();
      return;
    }
  });

  document.getElementById("enterApp").addEventListener("click", () => {
    const merhav = document.getElementById("loginMerhav").value;
    const user = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPassword").value.trim();
    if (!password) {
      alert("Ãƒâ€”Ã‚Â¦Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¡ Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã¢â‚¬â€œÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã…Â¸ Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â¡Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â");
      return;
    }
    document.getElementById("welcomeLine").textContent = `Ãƒâ€”Ã‚Â©Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â, ${user}`;
    showScreen("queue");
  });

  document.getElementById("photoInput").addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    const target = activePhotoTarget || (pendingPhotoItem && pendingPhotoItem.parentElement);
    if (!file || !target) return;
    const previewUrl = URL.createObjectURL(file);
    const item = pendingPhotoItem || document.createElement("div");
    item.className = "photo-item";
    item.innerHTML = `
      <div class="photo-thumb"><img alt="" class="photo-preview" src="${previewUrl}"></div>
      <div>
        <input type="text" placeholder="Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã‚ÂªÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â?" value="">
        <div class="photo-actions">
          <button class="annotate-button" type="button">Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã‚Âª Ãƒâ€”Ã‚ÂªÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â</button>
          <button class="remove-photo" type="button">Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â</button>
        </div>
      </div>`;
    if (!item.parentElement) target.appendChild(item);
    try {
      const compressed = await compressPhotoFile(file);
      item.dataset.fileName = compressed.fileName;
      item.dataset.base64 = compressed.base64;
      item.dataset.width = String(compressed.width);
      item.dataset.height = String(compressed.height);
      item.dataset.bytes = String(compressed.bytes);
      item.dataset.sourceSrc = compressed.dataUrl;
      item.dataset.annotatedSrc = "";
      const preview = item.querySelector(".photo-preview");
      if (preview) preview.src = compressed.dataUrl;
      photoCache.set(item, compressed);
    } catch (error) {
      item.dataset.fileName = file.name;
      item.dataset.base64 = "";
      item.dataset.bytes = "0";
      photoCache.set(item, { error: String(error) });
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
    activePhotoTarget = null;
    pendingPhotoItem = null;
  });

  document.getElementById("useCurrentLocation").addEventListener("click", () => {
    const status = document.getElementById("actualLocationText");
    if (!window.isSecureContext) {
      status.textContent = "Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã¢â‚¬Å“ Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã‚Â§ Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¨ Ãƒâ€”Ã…Â¾Ãƒâ€”Ã‚ÂÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã‹Å“Ãƒâ€”Ã¢â‚¬â€ (https).";
      status.className = "location-error";
      return;
    }
    if (!navigator.geolocation) {
      status.textContent = "Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã‚Â¤Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã‚Â¤Ãƒâ€”Ã…Â¸ Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â Ãƒâ€”Ã‚ÂªÃƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã…Â¾Ãƒâ€”Ã…Â¡ Ãƒâ€”Ã¢â‚¬ËœÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â";
      status.className = "location-error";
      return;
    }
    status.textContent = "Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã‚Â Ãƒâ€”Ã…Â¾Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â€žÂ¢...";
    status.className = "location-pending";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const query = encodeURIComponent(`${lat},${lng}`);
        const navLinks = document.querySelectorAll(".nav-actions a");
        navLinks[0].href = `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
        navLinks[1].href = `https://www.google.com/maps/search/?api=1&query=${query}`;
        status.textContent = `Ãƒâ€”Ã‚Â¢Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬Å“Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã…Â¸ Ãƒâ€”Ã…â€œÃƒâ€”Ã…Â¾Ãƒâ€”Ã¢â€žÂ¢Ãƒâ€”Ã‚Â§Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã¢â‚¬ÂºÃƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã¢â€žÂ¢: ${lat}, ${lng}`;
        status.className = "location-ok";
        markLocationStepDone();
      },
      () => {
        status.textContent = "Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬ÂÃƒâ€”Ã‚Â¦Ãƒâ€”Ã…â€œÃƒâ€”Ã¢â‚¬â€Ãƒâ€”Ã‚Â Ãƒâ€”Ã¢â‚¬Â¢ Ãƒâ€”Ã…â€œÃƒâ€”Ã‚Â§Ãƒâ€”Ã‚Â¨Ãƒâ€”Ã¢â‚¬Â¢Ãƒâ€”Ã‚Â GPS";
        status.className = "location-error";
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });

  document.getElementById("submitReview").addEventListener("click", openSubmitDecision);
  document.getElementById("backToMissing").addEventListener("click", () => {
    document.getElementById("submitDecision").hidden = true;
    const firstMissing = [...document.querySelectorAll("#documentScreen .mission-step")]
      .find((step) => !step.classList.contains("done") || (step.classList.contains("field-step") && step.querySelectorAll(".photo-item").length === 0));
    if (firstMissing) firstMissing.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document.getElementById("sendAnyway").addEventListener("click", () => {
    document.getElementById("submitDecision").hidden = true;
    showScreen("submitted");
  });
  document.getElementById("saveForLater").addEventListener("click", () => {
    document.getElementById("submitDecision").hidden = true;
    showScreen("queue");
  });

  document.getElementById("saveEditor").addEventListener("click", async () => {
    if (activePhotoEditorItem) {
      const captionInput = activePhotoEditorItem.querySelector("input[type='text']");
      const editorCaption = document.getElementById("editorCaption");
      if (captionInput) captionInput.value = editorCaption.value.trim();
      const annotated = await flattenEditorPhoto();
      if (annotated) {
        const preview = activePhotoEditorItem.querySelector(".photo-preview");
        if (preview) preview.src = annotated;
        activePhotoEditorItem.dataset.annotatedSrc = annotated;
        activePhotoEditorItem.dataset.sourceSrc = annotated;
        photoCache.set(activePhotoEditorItem, {
          ...(photoCache.get(activePhotoEditorItem) || {}),
          annotated
        });
      }
    }
    resetEditorOverlay();
    document.querySelector(".editor-photo").style.background = "#394b52";
    document.getElementById("photoEditor").hidden = true;
    activePhotoEditorItem = null;
  });

  document.getElementById("closeEditor").addEventListener("click", () => {
    resetEditorOverlay();
    document.querySelector(".editor-photo").style.background = "#394b52";
    document.getElementById("photoEditor").hidden = true;
    activePhotoEditorItem = null;
  });

  document.querySelectorAll(".editor-tools button").forEach((button, index) => {
    const actions = ["arrow", "circle", "text", "undo"];
    button.dataset.editorAction = actions[index] || "arrow";
    button.addEventListener("click", () => {
      const action = button.dataset.editorAction;
      if (action === "undo") {
        const marks = getEditorSurface()?.querySelectorAll(".editor-mark");
        if (marks && marks.length) marks[marks.length - 1].remove();
        return;
      }
      addEditorMark(action);
    });
  });

  document.querySelectorAll("[data-new-type]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-new-type]").forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      selectedNewType = button.dataset.newType;
    });
  });

  document.getElementById("newPointForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedNewType) {
      alert("צריך לבחור סוג נקודה");
      return;
    }
    const virtualCard = {
      dataset: {
        type: selectedNewType,
        number: `${selectedNewType === "cluster" ? "אשכול" : selectedNewType === "signage" ? "שילוט" : "דוכן"} חדש`,
        name: document.getElementById("newName").value || "נקודה חדשה",
        town: document.getElementById("newTown").value,
        location: document.getElementById("newLocation").value.trim(),
        address: document.getElementById("newLocation").value.trim() || `${document.getElementById("newTown").value} · מיקום נוכחי`,
        badge: selectedNewType === "cluster" ? "אשכול זהב" : selectedNewType === "signage" ? "שילוט" : "דוכן"
      }
    };
    setCardAsActive(virtualCard);
  });
}

function compressPhotoFile(file, maxWidth = 1600, quality = 0.78) {
  return new Promise(async (resolve, reject) => {
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, maxWidth / bitmap.width);
      const width = Math.round(bitmap.width * scale);
      const height = Math.round(bitmap.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error("Photo compression failed"));
          return;
        }
        const dataUrl = await blobToDataUrl(blob);
        resolve({
          dataUrl,
          base64: dataUrl.split(",")[1],
          bytes: blob.size,
          width,
          height,
          fileName: file.name.replace(/\.[^.]+$/, "") + "-compressed.jpg",
          mimeType: "image/jpeg"
        });
      }, "image/jpeg", quality);
    } catch (error) {
      reject(error);
    }
  });
}

renderMission("cluster");
attachPointLaunchers();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js");
}
