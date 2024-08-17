async function autoReact(api, event) {
  if (event.type == "message_reaction") {
    if (event.senderID == api.getCurrentUserID()) return;
    let emoji = event.reaction;
    return api.setMessageReaction(
      emoji,
      event.messageID,
      (err) => {
        if (err) return console.error(err);
      },
      true,
    );
  }
}
module.exports = autoReact;
