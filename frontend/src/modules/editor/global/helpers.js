define(function(require) {
  var Origin = require('core/origin');

  var Helpers = {
    /**
    * set the page title based on location
    * accepts backbone model, or object like so { title: '' }
    */
    setPageTitle: function(model) {
      var type = Origin.location.route2;
      var action = Origin.location.route4;
      var titleKey;
      switch(type) {
        case 'page':
          if(action === 'edit') {
            titleKey = 'editor' + type + 'settings';
            break;
          }
        default:
          titleKey = 'editor' + type;
      }
      var modelTitle = model && model.get && model.get('title');
      var langString = Origin.l10n.t('app.' + titleKey);

      var crumbs = ['dashboard'];
      if(type !== 'menu') crumbs.push('course');
      if(action === 'edit') {
        var page = Helpers.getNearestPage(model);
        crumbs.push({
          title: Origin.l10n.t('app.editorpage'),
          url: '#/editor/' + page.get('_courseId') + '/page/' + page.get('_id')
        });
      }
      crumbs.push({ title: langString });

      Origin.trigger('location:title:update', {
        breadcrumbs: crumbs,
        title: modelTitle || langString
      });
    },

    getNearestPage: function(model) {
      var map = {
        'component': 'components',
        'block': 'blocks',
        'article': 'articles',
        'page': 'contentObjects'
      };
      var mapKeys = Object.keys(map);
      while(model.get('_type') !== 'page') {
        var parentType = mapKeys[_.indexOf(mapKeys, model.get('_type')) + 1];
        var parentCollection = Origin.editor.data[map[parentType]];
        model = parentCollection.findWhere({ _id: model.get('_parentId') });
      }
      return model;
    }
  }

  return Helpers;
});
