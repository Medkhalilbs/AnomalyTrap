import {
    AdMob,
    type BannerAdOptions,
    BannerAdSize,
    BannerAdPosition,
    type AdOptions
} from '@capacitor-community/admob';
import { Device } from '@capacitor/device';

class AdService {
    private isInitialized = false;
    private gameOverCount = 0;

    // TEST IDs from Google
    private readonly BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
    private readonly INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';

    async initialize() {
        if (this.isInitialized) return;

        try {
            const info = await Device.getInfo();
            if (info.platform === 'web') {
                console.log('AdMob: Ads are disabled on web');
                return;
            }

            await AdMob.initialize({
                initializeForTesting: true,
            });

            this.isInitialized = true;
            console.log('AdMob: Initialized');
        } catch (e) {
            console.error('AdMob: Initialization failed', e);
        }
    }

    async showBanner() {
        if (!this.isInitialized) return;

        const options: BannerAdOptions = {
            adId: this.BANNER_ID,
            adSize: BannerAdSize.ADAPTIVE_BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: true
        };

        try {
            await AdMob.showBanner(options);
            console.log('AdMob: Banner shown');
        } catch (e) {
            console.error('AdMob: Failed to show banner', e);
        }
    }

    async hideBanner() {
        if (!this.isInitialized) return;
        try {
            await AdMob.hideBanner();
            console.log('AdMob: Banner hidden');
        } catch (e) {
            console.error('AdMob: Failed to hide banner', e);
        }
    }

    async showInterstitial() {
        if (!this.isInitialized) return;

        // Only show every 3rd game over to avoid annoyance
        this.gameOverCount++;
        if (this.gameOverCount % 3 !== 0) return;

        const options: AdOptions = {
            adId: this.INTERSTITIAL_ID,
            isTesting: true
        };

        try {
            await AdMob.prepareInterstitial(options);
            await AdMob.showInterstitial();
            console.log('AdMob: Interstitial shown');
        } catch (e) {
            console.error('AdMob: Failed to show interstitial', e);
        }
    }
}

export const adService = new AdService();
