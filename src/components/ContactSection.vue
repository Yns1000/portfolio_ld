<script setup>
import { useI18n } from 'vue-i18n'
// Import des icônes
import { Mail, Linkedin } from 'lucide-vue-next'

const { t } = useI18n()
const currentYear = new Date().getFullYear()

// Tes informations de contact
const email = "laurinedhilly26@gmail.com"
const linkedinUrl = "https://www.linkedin.com/in/laurine-dhilly-928886385/"
</script>

<template>
  <section id="contact" class="contact-section">
    <div class="glow-bg"></div>

    <div class="container">

      <div class="contact-card glass-effect">
        <div class="content">
          <h2 class="contact-title">
            {{ t('section_contact_title') }}<span class="dot">.</span>
          </h2>
          <p class="contact-text">{{ t('contact_intro') }}</p>

          <div class="actions">
            <a :href="`mailto:${email}`" class="btn btn-email">
              <Mail :size="20" />
              <span>{{ t('contact_email_btn') }}</span>
            </a>
            <a :href="linkedinUrl" target="_blank" rel="noopener" class="btn btn-linkedin">
              <Linkedin :size="20" />
              <span>{{ t('contact_linkedin_btn') }}</span>
            </a>
          </div>
        </div>
      </div>

      <footer class="site-footer">
        <div class="footer-info">
          <p>© {{ currentYear }} Laurine Dhilly. {{ t('footer_rights') }}</p>
          <p class="credits">{{ t('footer_made') }}</p>
        </div>
      </footer>

    </div>
  </section>
</template>

<style scoped>
.contact-section {
  position: relative;
  padding: 6rem 0 2rem 0;
  background-color: var(--color-bg);
  overflow: hidden;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
}

/* --- Effet Lueur (Blob d'arrière-plan) --- */
.glow-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--color-accent) 0%, transparent 70%);
  opacity: 0.12;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
  z-index: 1;
}

/* --- Carte Glassmorphism --- */
.contact-card {
  width: 100%;
  padding: 4rem 2rem;
  border-radius: 24px;
  text-align: center;
  margin-bottom: 4rem;

  /* Style Glass */
  background: rgba(40, 30, 30, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

:root[data-theme="light"] .contact-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.contact-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--color-text-main);
  line-height: 1.1;
}

.dot { color: var(--color-accent); }

.contact-text {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  margin-bottom: 3.5rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* --- Actions / Boutons --- */
.actions {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

/* Bouton Email - Style "Plein" */
.btn-email {
  background-color: var(--color-accent);
  color: var(--color-accent-text);
  border: 2px solid var(--color-accent);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.btn-email:hover {
  background-color: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

/* Bouton LinkedIn - Style "Outline" amélioré */
.btn-linkedin {
  background-color: transparent;
  color: var(--color-text-main);
  border: 2px solid var(--color-border);
}

.btn-linkedin:hover {
  border-color: var(--color-text-main);
  background-color: rgba(255,255,255,0.05);
  transform: translateY(-3px);
}

/* --- Footer --- */
.site-footer {
  width: 100%;
  text-align: center;
  border-top: 1px solid var(--color-border);
  padding-top: 2rem;
  margin-top: auto;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  opacity: 0.6;
  transition: opacity 0.3s;
}

.footer-info:hover {
  opacity: 1;
}

.credits {
  font-size: 0.8rem;
  font-style: italic;
}

/* Responsive */
@media (max-width: 600px) {
  .contact-card {
    padding: 2.5rem 1.5rem;
  }
  .actions {
    gap: 1rem;
    flex-direction: column;
    width: 100%;
  }
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>