import React from 'react';

import {View} from 'react-native';

import loadable from '@loadable/component';

var REV_PLUGINS = {
  rev_flag: {
    revPluginName: 'rev_flag',
    revPlugin: loadable(() => import(`./rev_plugins/rev_flag/RevStart`)),
  },
  rev_text_chat: {
    revPluginName: 'rev_text_chat',
    revPlugin: loadable(() => import(`./rev_plugins/rev_text_chat/RevStart`)),
  },
  rev_contacts: {
    revPluginName: 'rev_contacts',
    revPlugin: loadable(() => import(`./rev_plugins/rev_contacts/RevStart`)),
  },
  rev_plugin_tagged_posts: {
    revPluginName: 'rev_plugin_tagged_posts',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_tagged_posts/RevStart`),
    ),
  },
  rev_plugin_search: {
    revPluginName: 'rev_plugin_search',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_search/RevStart`),
    ),
  },
  rev_plugin_user_settings: {
    revPluginName: 'rev_plugin_user_settings',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_user_settings/RevStart`),
    ),
  },
  rev_plugin_user_profile: {
    revPluginName: 'rev_plugin_user_profile',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_user_profile/RevStart`),
    ),
  },
  rev_plugin_ads: {
    revPluginName: 'rev_plugin_ads',
    revPlugin: loadable(() => import(`./rev_plugins/rev_plugin_ads/RevStart`)),
  },
  rev_plugin_stores: {
    revPluginName: 'rev_plugin_stores',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_stores/RevStart`),
    ),
  },
  rev_plugin_timeline_activity: {
    revPluginName: 'rev_plugin_timeline_activity',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_timeline_activity/RevStart`),
    ),
  },
  rev_plugin_video: {
    revPluginName: 'rev_plugin_video',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_video/RevStart`),
    ),
  },
};

export function revPluginsViews(revVarArgs) {
  let revViews = [];

  for (const [revPluginName, revCurrPlugin] of Object.entries(REV_PLUGINS)) {
    let revVarPluginName = revVarArgs.revPluginName;

    if (revVarPluginName !== revPluginName) {
      continue;
    }

    let RevAsyncPage = revCurrPlugin.revPlugin;

    revViews.push(<RevAsyncPage key={revPluginName} revVarArgs={revVarArgs} />);
  }

  return revViews;
}

export function revPluginsLoader(revVarArgs) {
  let RevPluginViewsArr = revPluginsViews(revVarArgs);

  return (
    <View>
      {RevPluginViewsArr.map(RevPluginView => {
        return RevPluginView;
      })}
    </View>
  );
}
