chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ["twitter_video_rule"]
  });

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      id: "twitter_video_rule",
      action: {
        type: "block"
      },
      priority: 1,
      condition: {
        domains: ["video.twimg.com"]
      }
    }]
  });
});
