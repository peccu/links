(function(MD5){
  const linkType = {
    'type': 'object',
    'properties': {
      'id': {
        'type': 'string'
      },
      'title': {
        'type': 'string'
      },
      'url': {
        'type': 'string',
        'format': 'uri'
      },
      'description': {
        'type': 'string'
      },
      'keyword': {
        'type': 'array',
        'default': []
      },
      'category': {
        'type': 'array',
        'default': [['']]
      },
      'active': {
        'type': 'object',
        'default': {}
      },
      'ts': {
        'type': 'string'
      },
      'target': {
        'type': 'string',
        'default': '_blank'
      }
    },
    'required': ['title', 'url']
  };

  const builder = function(privateClient, publicClient){
    privateClient.declareType('archive-link', linkType);
    privateClient.cache('archive/', 'ALL');
    return {
      exports: {
        getAll: function(){
          return privateClient.getAll('archive/').then(objects => {
            return objects;
          });
        },
        get: function(url){
          var linkId = MD5(url); // hash URL for nice ID
          var path = 'archive/' + linkId; // use hashed URL as filename as well
          return privateClient.getObject(path);
        },
        add: function(link){
          link.id = MD5(link.url); // hash URL for nice ID
          var path = 'archive/' + link.id; // use hashed URL as filename as well

          return privateClient.storeObject('archive-link', path, link).
            then(function() {
              return link; // return link with added ID property
            });
        }
      }
    };
  };

  var Links = {
    name: 'links',
    builder: builder
  };

  const setUpStorage = function(selector, getAll){
    const remoteStorage = new RemoteStorage();
    remoteStorage.addModule(Links);
    remoteStorage.access.claim('links', 'rw');
    const widget = new Widget(remoteStorage);
    widget.attach(selector);

    remoteStorage.on('connected', () => {
      const userAddress = remoteStorage.remote.userAddress;
      console.debug(`${userAddress} connected their remote storage.`);
      return getAll();
    });

    remoteStorage.on('network-offline', () => {
      console.debug(`We're offline now.`);
    });

    remoteStorage.on('network-online', () => {
      console.debug(`Hooray, we're back online.`);
      return getAll();
    });

    return remoteStorage;
  };

  var LinkStore = {
    debug: true,
    storage: null,
    state: {
      links: []
    },
    setup(cb){
      // console.log('setup called');
      const store = this;
      this.storage = setUpStorage('remoteStorage', cb);
    },
    getAllAction(cb){
      if(this.debug){
        console.log('getAllAction called');
      }
      var store = this;
      return this.storage.links.getAll().then(function(links){
        console.log('link fetched');
        store.state.links = Object.values(links);
      });
    },
    getAction(url){
      if(this.debug){
        console.log('getAction called');
      }
      return this.storage.links.get(url);
    },
    addLinksAction(link){
      if(this.debug){
        console.log('addLinksAction triggered with', link);
      }
      return this.storage.links.add(link)
      .then(() => {
        console.log('success in addLinksAction');
      })
      .catch((err) => {
        console.error('validation error in addLinksAction:', err);
      });
    }
  };

  if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
    module.exports = LinkStore;
  }else{
    window.LinkStore = LinkStore;
  }
})(MD5);
