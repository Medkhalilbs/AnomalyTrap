import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.medkhalil.anomalytrap',
    appName: 'Anomaly Trap',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    }
};

export default config;
