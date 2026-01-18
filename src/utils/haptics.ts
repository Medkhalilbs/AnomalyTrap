import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Device } from '@capacitor/device';

class HapticsService {
    private isPlatformWeb = true;

    async initialize() {
        const info = await Device.getInfo();
        this.isPlatformWeb = info.platform === 'web';
    }

    async impact(style: ImpactStyle = ImpactStyle.Light) {
        if (this.isPlatformWeb) return;
        try {
            await Haptics.impact({ style });
        } catch (e) {
            console.error('Haptics: Impact failed', e);
        }
    }

    async notification(type: NotificationType) {
        if (this.isPlatformWeb) return;
        try {
            await Haptics.notification({ type });
        } catch (e) {
            console.error('Haptics: Notification failed', e);
        }
    }

    async selectionStart() {
        if (this.isPlatformWeb) return;
        try {
            await Haptics.selectionStart();
        } catch (e) {
            console.error('Haptics: Selection start failed', e);
        }
    }

    async selectionChanged() {
        if (this.isPlatformWeb) return;
        try {
            await Haptics.selectionChanged();
        } catch (e) {
            console.error('Haptics: Selection changed failed', e);
        }
    }

    async selectionEnd() {
        if (this.isPlatformWeb) return;
        try {
            await Haptics.selectionEnd();
        } catch (e) {
            console.error('Haptics: Selection end failed', e);
        }
    }

    async vibrate() {
        if (this.isPlatformWeb) {
            if ('vibrate' in navigator) {
                navigator.vibrate(200);
            }
            return;
        }
        try {
            await Haptics.vibrate();
        } catch (e) {
            console.error('Haptics: Vibrate failed', e);
        }
    }
}

export const haptics = new HapticsService();
