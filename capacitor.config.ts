import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.medkhalil.anomalytrap',
    appName: 'Anomaly Trap',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        AdMob: {
            androidAppId: 'ca-app-pub-3940256099942544~3347511713',
            requestTrackingAuthorization: true,
        },
    },
};

export default config;
