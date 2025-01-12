// lib/ndkHelper.ts
import NDK from '@nostr-dev-kit/ndk';

export function initializeNDK() {
  const ndk = new NDK({
    // Add your NDK configuration here
    explicitRelayUrls: ['wss://relay.nostr.band'],
  });

  return ndk;
}