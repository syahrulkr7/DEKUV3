"use strict";
function getGUID() {
  var sectionLength = Date.now();
  var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = Math.floor((sectionLength + Math.random() * 16) % 16);
      sectionLength = Math.floor(sectionLength / 16);
      var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
      return _guid;
    },
  );
  return id;
}
module.exports = {
  config: {
    name: "confess",
    author: "Deku", // sino paba? kidding
    cooldown: 80,
    acessableby: 0,
    prefix: true,
    category: "fun",
    description: "Make a confession post using bot.",
    usage: "[ message | uid ]",
  },
  start: async function ({ api, event, text, reply }) {
    const a = text.join(" ");
    if (!a)
      return reply(
        "Wrong format\nUse: " +
          global.deku.PREFIX +
          this.config.name +
          this.config.usage,
      );
    const b = a.split(" | ");
    const msg = b[0];
    const uid = parseInt(b[1]);
    if (isNaN(uid)) return reply("Invalid UID!");
    if (!msg) return reply("Missing message to confess!");
    try {
      let uuid = getGUID();
      const formData = {
        input: {
          composer_entry_point: "inline_composer",
          composer_source_surface: "timeline",
          idempotence_token: uuid + "_FEED",
          source: "WWW",
          attachments: [],
          audience: {
            privacy: {
              allow: [],
              base_state: "EVERYONE", // SELF EVERYONE FRIENDS
              deny: [],
              tag_expansion_state: "UNSPECIFIED",
            },
          },
          message: {
            ranges: [],
            text:
              "[ DEKU BOT CONFESSION ]\n\nThis message is for the person tagged\n\nMessage: " +
              msg,
          },
          with_tags_ids: [uid],
          inline_activities: [],
          explicit_place_id: "0",
          text_format_preset_id: "0",
          logging: {
            composer_session_id: uuid,
          },
          tracking: [null],
          actor_id: api.getCurrentUserID(),
          client_mutation_id: Math.floor(Math.random() * 17),
        },
        displayCommentsFeedbackContext: null,
        displayCommentsContextEnableComment: null,
        displayCommentsContextIsAdPreview: null,
        displayCommentsContextIsAggregatedShare: null,
        displayCommentsContextIsStorySet: null,
        feedLocation: "TIMELINE",
        feedbackSource: 0,
        focusCommentID: null,
        gridMediaWidth: 230,
        groupID: null,
        scale: 3,
        privacySelectorRenderLocation: "COMET_STREAM",
        renderLocation: "timeline",
        useDefaultActor: false,
        inviteShortLinkKey: null,
        isFeed: false,
        isFundraiser: false,
        isFunFactPost: false,
        isGroup: false,
        isTimeline: true,
        isSocialLearning: false,
        isPageNewsFeed: false,
        isProfileReviews: false,
        isWorkSharedDraft: false,
        UFI2CommentsProvider_commentsKey: "ProfileCometTimelineRoute",
        hashtag: null,
        canUserManageOffers: false,
      };
      const form = {
        av: api.getCurrentUserID(),
        fb_api_req_friendly_name: "ComposerStoryCreateMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "7711610262190099",
        variables: JSON.stringify(formData),
      };
      api.httpPost("https://www.facebook.com/api/graphql/", form, (e, info) => {
        if (e) throw e;
        if (info.error) throw info.error;
        if (typeof info == "string")
          info = JSON.parse(info.replace("for (;;);", ""));
        const postID = info.data.story_create.story.legacy_story_hideable_id;
        if (!postID) throw info.errors;
        console.log(
          "[ DEKU BOT CONFESSION ]\n\nLink: https://www.facebook.com/" +
            api.getCurrentUserID() +
            "/posts/" +
            postID,
        );
        return api.sendMessage(
          "[ DEKU BOT CONFESSION ]\n\nLink: https://www.facebook.com/" +
            api.getCurrentUserID() +
            "/posts/" +
            postID,
          event.threadID,
        );
      });
    } catch (e) {
      return reply(e.message);
    }
  },
};
