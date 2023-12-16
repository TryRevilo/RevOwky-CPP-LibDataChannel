import React from 'react';

import {View} from 'react-native';

import loadable from '@loadable/component';
import {revIsEmptyVar} from '../rev_function_libs/rev_gen_helper_functions';

var REV_PLUGINS = {
  rev_plugin_flag: {
    revPluginName: 'rev_plugin_flag',
    revPlugin: loadable(() => import(`./rev_plugins/rev_plugin_flag/RevStart`)),
  },
  rev_plugin_likes: {
    revPluginName: 'rev_plugin_likes',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_likes/RevStart`),
    ),
  },
  rev_plugin_tags: {
    revPluginName: 'rev_plugin_tags',
    revPlugin: loadable(() => import(`./rev_plugins/rev_plugin_tags/RevStart`)),
  },
  rev_plugin_text_chat: {
    revPluginName: 'rev_plugin_text_chat',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_text_chat/RevStart`),
    ),
  },
  rev_plugin_site_messages: {
    revPluginName: 'rev_plugin_site_messages',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_site_messages/RevStart`),
    ),
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
  rev_plugin_comments: {
    revPluginName: 'rev_plugin_comments',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_comments/RevStart`),
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
  rev_plugin_members: {
    revPluginName: 'rev_plugin_members',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_members/RevStart`),
    ),
  },
  rev_plugin_member_connections: {
    revPluginName: 'rev_plugin_member_connections',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_member_connections/RevStart`),
    ),
  },
  rev_plugin_noticias: {
    revPluginName: 'rev_plugin_noticias',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_noticias/RevStart`),
    ),
  },
  rev_plugin_ads: {
    revPluginName: 'rev_plugin_ads',
    revPlugin: loadable(() => import(`./rev_plugins/rev_plugin_ads/RevStart`)),
  },
  rev_plugin_check_out: {
    revPluginName: 'rev_plugin_check_out',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_check_out/RevStart`),
    ),
  },
  rev_plugin_stores: {
    revPluginName: 'rev_plugin_stores',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_stores/RevStart`),
    ),
  },
  rev_plugin_organization: {
    revPluginName: 'rev_plugin_organization',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_organization/RevStart`),
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
  rev_plugin_video_call: {
    revPluginName: 'rev_plugin_video_call',
    revPlugin: loadable(() =>
      import(`./rev_plugins/rev_plugin_video_call/RevStart`),
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
  let revPluginViewsArr = revPluginsViews(revVarArgs);

  let revRetView = revPluginViewsArr.map(revPluginView => {
    return revPluginView;
  });

  return revRetView;
}
