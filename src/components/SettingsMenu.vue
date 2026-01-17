<template>
  <div class="settings-overlay" @click.self="$emit('close')">
    <div class="settings-card">
      <button class="close-btn" @click="$emit('close')">✕</button>
      <h2>{{ t('settings') }}</h2>

      <div class="setting-row">
        <label>{{ t('sound') }}</label>
        <button 
          class="toggle-btn" 
          :class="{ active: store.soundEnabled }"
          @click="store.toggleSound()"
        >
          {{ store.soundEnabled ? 'ON' : 'OFF' }}
        </button>
      </div>

      <div class="setting-row">
        <label>{{ t('language') }}</label>
        <div class="lang-options">
          <button 
            :class="{ active: store.language === 'en' }" 
            @click="store.setLanguage('en')"
          >EN</button>
          <button 
            :class="{ active: store.language === 'fr' }" 
            @click="store.setLanguage('fr')"
          >FR</button>
          <button 
            :class="{ active: store.language === 'ar' }" 
            @click="store.setLanguage('ar')"
          >AR</button>
        </div>
      </div>
      
      <div class="info-row">
        <small>v2.0.0 - Mobile Optimized</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../store/gameStore';
import { translations, type Language } from '../utils/i18n';

const store = useGameStore();
defineEmits(['close']);

function t(key: keyof typeof translations['en']) {
    return translations[store.language][key];
}
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

.settings-card {
  background: white;
  width: 90%;
  max-width: 400px;
  padding: 30px;
  border-radius: 20px;
  position: relative;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #f1f1f1;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  color: #333;
}

h2 {
  margin: 0 0 10px 0;
  color: var(--secondary-color);
  text-align: center;
  font-weight: 800;
  letter-spacing: 1px;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.setting-row label {
  font-weight: 700;
  color: #555;
  font-size: 1.1rem;
}

.toggle-btn {
  background: #ccc;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  width: 80px;
  transition: background-color 0.3s;
}

.toggle-btn.active {
  background: #2ecc71;
}

.lang-options {
  display: flex;
  gap: 10px;
}

.lang-options button {
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-options button.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.info-row {
    text-align: center;
    color: #999;
    margin-top: 10px;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
</style>
