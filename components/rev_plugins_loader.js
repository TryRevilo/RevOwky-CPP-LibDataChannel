import React, {useContext, useState, useEffect} from 'react';

import {} from 'react-native';

import loadable from '@loadable/component';

import {ReViewsContext} from '../rev_contexts/ReViewsContext';

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

/** START REV INIT PLUGINS */
const REV_PLUGINS_ARR = [
  {
    revPluginName: 'rev_plugin_noticias',
    revModule: async () =>
      await import('./rev_plugins/rev_plugin_noticias/revInit'),
  },
];

function revGetProperty(revObject, revPropertyName) {
  let revPropertyNames = revPropertyName.split('.');
  let revValue = revObject;

  for (const revProp of revPropertyNames) {
    revValue = revValue[revProp];
  }

  return revValue;
}

const revFlattenArray = revArr => {
  let revFlattened = [];

  revArr.forEach(revCurrItem => {
    if (Array.isArray(revCurrItem)) {
      revFlattened = revFlattened.concat(revFlattenArray(revCurrItem));
    } else {
      revFlattened.push(revCurrItem);
    }
  });

  return revFlattened;
};

const RevHOC = ({revItemsArr, revFuncName, revCallBack}) => {
  let revRetArr = [];

  for (let i = 0; i < revItemsArr.length; i++) {
    let useRevStart = revItemsArr[i];
    let revStart = useRevStart();

    if (!revStart) {
      continue;
    }

    let revFuncNameProp = revGetProperty(revStart, revFuncName);
    revRetArr.push(revFuncNameProp);
  }

  revCallBack(revRetArr);
};

export const useRevInitPlugins = () => {
  const {SET_REV_VIRTUAL_VIEW} = useContext(ReViewsContext);

  const revInitPlugins = async ({revFuncName}) => {
    let revItemsArr = [];

    for (let i = 0; i < REV_PLUGINS_ARR.length; i++) {
      let revPlugin = REV_PLUGINS_ARR[i];
      let revPluginName = revPlugin.revPluginName;
      let revModule = await revPlugin.revModule();

      const {useRevStart} = revModule;
      revItemsArr.push(useRevStart);
    }

    return new Promise(resolve => {
      SET_REV_VIRTUAL_VIEW(
        <RevHOC
          revItemsArr={revItemsArr}
          revFuncName={revFuncName}
          revCallBack={revRetData => {
            resolve(revRetData);
          }}
        />,
      );
    });
  };

  const revGetSubTypeContextViews = async ({
    revContextName,
    revEntitySubType,
  }) => {
    let revObjectsArr = await revInitPlugins({
      revFuncName: 'revPluginContextViewsArr',
      revVarArgs: {
        revContextName,
      },
    });

    let revObjectsArrFlat = revFlattenArray(revObjectsArr);
    let revRetObjectsArr = [];

    for (let i = 0; i < revObjectsArrFlat.length; i++) {
      if (revIsEmptyJSONObject(revObjectsArrFlat[i])) {
        continue;
      }

      let revObject = revObjectsArrFlat[i];

      if (revIsStringEqual(revEntitySubType, revObject.revEntitySubType)) {
        revRetObjectsArr.push(revObject.RevComponent);
      }
    }

    return revRetObjectsArr;
  };

  return {revInitPlugins, revGetSubTypeContextViews};
};

export const useRevInitPluginHooks = () => {
  const {revInitPlugins} = useRevInitPlugins();

  const revInitPluginHooks = async ({revPluginHookName, revVarArgs}) => {
    let revRetArr = [];

    if (!revPluginHookName || !revVarArgs) {
      return revRetArr;
    }

    let revSitePluginHooks = await revInitPlugins({
      revFuncName: 'revPluginHooks',
      revVarArgs: {
        revPluginHookName,
      },
    });

    if (Array.isArray(revSitePluginHooks)) {
      revSitePluginHooks = revFlattenArray(revSitePluginHooks);

      for (let i = 0; i < revSitePluginHooks.length; i++) {
        let revPluginHooks = revSitePluginHooks[i];

        let revPluginHook = revPluginHooks({
          revVarArgs: {
            revPluginHookName,
          },
        });

        let revRes = revPluginHook(revVarArgs);
        revRetArr.push(revRes);
      }
    }

    return revRetArr;
  };

  return {revInitPluginHooks};
};

export const RevSubTypeContextView = ({revData = {}}) => {
  const {revContextName, revEntitySubType, revVarArgs = {}} = revData;

  const {revGetSubTypeContextViews} = useRevInitPlugins();

  const [revSubTypeContextView, setRevSubTypeContextView] = useState(null);

  const revLoad = async () => {
    let revViewsArr = await revGetSubTypeContextViews({
      revContextName,
      revEntitySubType,
    });

    let revViews = revViewsArr.map((RevComponent, index) => {
      if (!RevComponent) {
        return null;
      }

      return <RevComponent key={index} revVarArgs={revVarArgs} />;
    });

    setRevSubTypeContextView(revViews);
  };

  useEffect(() => {
    revLoad();
  }, []);

  return revSubTypeContextView;
};
/** END REV INIT PLUGINS */
