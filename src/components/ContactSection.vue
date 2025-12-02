<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentYear = new Date().getFullYear()

// Remplacer par vos vraies infos ici
const email = "laurinedhilly26@gmail.com"
const linkedinUrl = "https://www.linkedin.com/in/laurine-dhilly-928886385/"
</script>

<template>
  <section id="contact" class="contact-section">
    <div class="container">

      <div class="contact-content">
        <h2 class="contact-title">
          {{ t('section_contact_title') }}<span class="dot">.</span>
        </h2>
        <p class="contact-text">{{ t('contact_intro') }}</p>

        <div class="actions">
          <a :href="`mailto:${email}`" class="btn btn-email">
            <span class="icon">✉️</span> {{ t('contact_email_btn') }}
          </a>
          <a :href="linkedinUrl" target="_blank" rel="noopener" class="btn btn-linkedin">
            <span class="icon">🔗</span> {{ t('contact_linkedin_btn') }}
          </a>
        </div>
      </div>

      <footer class="site-footer">
        <div class="divider"></div>
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
  padding: 6rem 0 2rem 0;
  /* On utilise la couleur "Card" (plus foncée/contrastée) pour fermer le site */
  background-color: var(--color-bg-card);
  color: var(--color-text-main);
  text-align: center;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* --- Contact --- */
.contact-content {
  margin-bottom: 5rem;
}

.contact-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--color-text-main);
}

.dot { color: var(--color-accent); }

.contact-text {
  font-size: 1.2rem;
  color: var(--color-text-muted);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

/* Bouton Email (Style Primaire) */
.btn-email {
  background-color: var(--color-accent);
  color: var(--color-accent-text);
  border: 2px solid var(--color-accent);
}

/* Bouton LinkedIn (Style Outline) */
.btn-linkedin {
  background-color: transparent;
  color: var(--color-text-main);
  border: 2px solid var(--color-border);
}

.btn-linkedin:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* --- Footer --- */
.site-footer {
  margin-top: auto;
}

.divider {
  height: 1px;
  background-color: var(--color-border);
  margin-bottom: 2rem;
  width: 100%;
  opacity: 0.3;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  opacity: 0.7;
}

.credits {
  font-size: 0.8rem;
}
</style>