<script setup>
// Pas de logique complexe pour l'instant
</script>

<template>
  <section class="hero-container">
    <div class="dots-decoration">
      <span v-for="n in 25" :key="n" class="dot"></span>
    </div>

    <div class="geo-decoration">
      <div class="geo-square"></div>
      <div class="geo-l-shape"></div>
    </div>

    <div class="text-content">
      <h2 class="greeting">Hi!</h2>
      <h1 class="name">I'm Laurine.</h1>

      <p class="bio">
        I am a <strong>Master Student in LMI</strong> (Langues & Management International)
        at <span class="highlight">Université d'Artois</span>.
      </p>

      <p class="languages">
        Fluent in
        <span class="lang-tag">🇬🇧 English</span>,
        <span class="lang-tag">🇪🇸 Spanish</span>, and
        <span class="lang-tag">🇳🇱 Dutch</span>.
      </p>

      <div class="buttons">
        <a href="#projects" class="btn btn-primary">Discover my projects</a>
        <a href="#about" class="btn btn-outline">Who am I?</a>
      </div>
    </div>

    <div class="visual-content">
      <div class="blob-bg"></div>

      <img
          src="/Laurine.svg"
          alt="Laurine Avatar"
          class="avatar-img"
      />
    </div>
  </section>
</template>

<style scoped>
/* --- Layout Global --- */
.hero-container {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: space-between;
  margin-top: 3rem;
  padding: 2rem 0;
  position: relative;
  /* Important : permet aux décorations de réagir même si elles débordent un peu */
  overflow: visible;
}

/* --- Text Styling --- */
.text-content {
  flex: 1;
  z-index: 10; /* Le texte passe devant les décorations */
  margin-top: 2rem;
  position: relative;
}

.greeting {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-text-main);
  line-height: 1.2;
}

.name {
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-text-main);
  margin-bottom: 1.5rem;
}

.bio {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  max-width: 500px;
  margin-bottom: 1rem;
}

.languages {
  margin-bottom: 2.5rem;
  color: var(--color-text-muted);
}

.lang-tag {
  color: var(--color-accent);
  font-weight: 600;
  margin: 0 5px;
}

.highlight {
  color: #fff;
  font-weight: 600;
}

/* --- Buttons --- */
.buttons {
  display: flex;
  gap: 1.5rem;
}

.btn {
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s, color 0.3s;
}

.btn:hover {
  transform: translateY(-3px);
}

.btn-primary {
  background-color: var(--color-accent);
  color: var(--color-accent-text);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background-color: var(--color-accent-hover);
  color: var(--color-text-main);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--color-text-muted);
  color: var(--color-text-main);
}

.btn-outline:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* --- Visual / Avatar --- */
.visual-content {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  z-index: 5;
}

/* Petit effet : l'avatar bouge un peu quand on survole la zone droite */
.visual-content:hover .avatar-img {
  transform: scale(1.02) rotate(1deg);
}

.blob-bg {
  position: absolute;
  width: 400px;
  height: 500px;
  background-color: var(--color-blob);
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  z-index: 0;
  animation: morph 8s ease-in-out infinite;
  opacity: 0.8;
}

.avatar-img {
  width: 300px;
  height: auto;
  z-index: 1;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
  transition: transform 0.4s ease-out;
}

/* =========================================
   DÉCORATIONS INTERACTIVES
   ========================================= */

/* 1. Les Points (Dots) */
.dots-decoration {
  position: absolute;
  /* On les place DANS le conteneur pour ne pas qu'ils soient coupés */
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  padding: 20px;
  z-index: 0;
  /* Zone interactive */
  cursor: crosshair;
}

.dots-decoration .dot {
  width: 6px;
  height: 6px;
  background-color: var(--color-text-muted);
  border-radius: 50%;
  opacity: 0.2;
  transition: all 0.3s ease;
}

/* Effet au survol : ils s'allument et grossissent */
.dots-decoration:hover .dot {
  background-color: var(--color-accent);
  opacity: 0.8;
  transform: scale(1.5);
  box-shadow: 0 0 5px var(--color-accent);
}


/* 2. Les Formes Géométriques (Géo) */
.geo-decoration {
  position: absolute;
  /* Placement amélioré : plus proche du centre visuel */
  top: -20px;
  right: 5%;
  width: 120px;
  height: 120px;
  z-index: 0;
  /* On réactive les événements souris pour l'interaction */
  pointer-events: auto;
  cursor: pointer;
}

/* Carré */
.geo-square {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 50px;
  height: 50px;
  border: 2px solid var(--color-bg-card);
  z-index: 2;
  opacity: 0.6;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Forme en L */
.geo-l-shape {
  position: absolute;
  top: 0;
  right: 0;
  width: 70px;
  height: 70px;
  border-top: 20px solid var(--color-accent);
  border-right: 20px solid var(--color-accent);
  opacity: 0.5;
  z-index: 1;
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Effet Parallaxe / Éclatement au survol */
.geo-decoration:hover .geo-square {
  transform: translate(-15px, 15px) rotate(-10deg);
  border-color: var(--color-accent-hover);
  opacity: 1;
}

.geo-decoration:hover .geo-l-shape {
  transform: translate(15px, -15px) rotate(10deg) scale(1.1);
  opacity: 1;
}

/* Animation Blob */
@keyframes morph {
  0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
  34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
  67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
}

@media (min-width: 1024px) {
  .hero-container {
    flex-direction: row;
    height: 75vh; /* Hauteur ajustée */
  }

  /* Vos dimensions spécifiques Desktop */
  .avatar-img { width: 500px; }
  .blob-bg { width: 550px; height: 600px; right: 50px; }

  .greeting { font-size: 4rem; }
  .name { font-size: 5.5rem; }

  /* Ajustement position Géo sur grand écran */
  .geo-decoration {
    top: -50px;
    right: 0;
  }
}
</style>