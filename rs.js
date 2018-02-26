const remoteStorage = new RemoteStorage();
remoteStorage.access.claim('links', 'rw');
const widget = new Widget(remoteStorage);
widget.attach();

remoteStorage.on('connected', () => {
  const userAddress = remoteStorage.remote.userAddress;
  console.debug(`${userAddress} connected their remote storage.`);
});

remoteStorage.on('network-offline', () => {
  console.debug(`We're offline now.`);
});

remoteStorage.on('network-online', () => {
  console.debug(`Hooray, we're back online.`);
});
