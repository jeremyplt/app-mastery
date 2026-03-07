# App Secrets - Design Direction

## Vision

Landing page premium **dark mode** avec esthetique **Liquid Glass** (iOS 26/macOS Tahoe) pour vendre une formation high-ticket ($997) sur la creation d'apps mobiles avec le vibecoding.

Le design doit evoquer :
- **Technologie de pointe** : on enseigne le futur du dev mobile
- **Premium / Luxe** : justifier le prix high-ticket
- **Apple ecosystem** : rappeler l'univers iOS/mobile
- **Clarte et confiance** : faciliter la decision d'achat

---

## Direction Artistique

### Style : "Dark Liquid Glass"

Fusion entre le **glassmorphism dark mode** et le nouveau **Liquid Glass d'Apple** (WWDC 2025). On reprend les codes d'iOS 26 :

1. **Fond sombre profond** (#0A0A0F) avec des **orbes de couleur flottants** en arriere-plan (violet, bleu cyan, touches de rose) qui donnent de la vie et de la profondeur
2. **Cartes en verre givre** : `backdrop-filter: blur(20px)`, fond semi-transparent (3-10% opacite blanc), bordures subtiles (8% opacite)
3. **Effet Liquid Glass** sur les elements au hover : leger deplacement du reflet interne, highlight speculaire subtil
4. **Gradients vibrants** pour les CTAs et accents (violet -> bleu cyan)
5. **Typographie nette** avec un fort contraste sur fond sombre

### Palette de couleurs

| Role | Couleur | Code |
|------|---------|------|
| Background | Noir profond bleuté | `#0A0A0F` |
| Surface Glass | Blanc ultra-transparent | `rgba(255,255,255,0.04)` |
| Accent primaire | Violet electrique | `#6C5CE7` |
| Accent secondaire | Bleu cyan | `#00D2FF` |
| Accent light | Violet clair | `#A29BFE` |
| Texte primaire | Blanc quasi-pur | `rgba(255,255,255,0.95)` |
| Texte secondaire | Blanc attenue | `rgba(255,255,255,0.70)` |
| Success/CTA urgence | Vert neon | `#00E676` |
| Danger/Urgence | Rouge vif | `#FF5252` |

**Pourquoi ce choix :**
- Le violet + cyan evoque la tech, l'IA, le premium
- Le fond sombre permet au glassmorphism de briller (le glass a besoin de couleur derriere pour distordre)
- Les couleurs rappellent l'univers du code et des terminaux

### Typographie

- **Titres** : SF Pro Display (fallback: Inter) - Bold 700, tracking serre (-0.03em)
- **Corps** : SF Pro Text (fallback: Inter) - Regular 400, line-height genereux (1.7)
- **Code/Tech** : SF Mono / JetBrains Mono - pour les elements techniques
- **Labels** : Uppercase, letter-spacing large (0.08em), small, weight 600

**Tailles cles :**
- Hero titre : 72px desktop / 40px mobile
- Section titre : 48px desktop / 32px mobile
- Body : 16-18px
- Prix : 56px bold

### Glassmorphism - Specifications techniques

```css
/* Carte standard */
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Carte hover - effet Liquid Glass */
.glass-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

/* Navigation fixe */
.glass-nav {
  background: rgba(10, 10, 15, 0.80);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* Orbes d'ambiance (background) */
.ambient-orb {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(100px);
  animation: float 20s ease-in-out infinite alternate;
  pointer-events: none;
}
```

### Animations

- **Scroll reveal** : Elements apparaissent en fade-up (30px) avec stagger de 100ms entre chaque element
- **Orbes flottants** : Animation lente (20s) de mouvement pour le background
- **Hover cartes** : translateY(-2px) + augmentation opacite du glass + transition 300ms
- **CTA pulse** : Subtle glow pulse sur le bouton principal toutes les 3s
- **Compteur** : Flip animation sur les digits du countdown
- **Parallax leger** : Les orbes bougent plus lentement que le scroll

---

## Elements de Design Specifiques

### 1. Phone Frame Mockup

Un mockup iPhone (style iPhone 16 Pro) en verre qui montre l'app en cours de construction. Le frame a un border-radius de 48px avec un glow violet/cyan subtil.

Utilise dans :
- Hero section (a cote du headline)
- Section "Ce que tu vas construire"

### 2. Bento Grid

Inspire du design "Copilot bento box" de Dribbble. Grille asymetrique (3 colonnes) ou chaque cellule est une carte glass avec un module/feature different. Tailles variees pour creer du rythme visuel.

### 3. Pricing Card (style Nebula)

Tres inspire du shot "Nebula Pricing Card". Une seule carte glass centrale avec :
- Badge "ACCES A VIE" en haut
- Prix barre + prix actuel en gradient
- Liste des features avec checkmarks
- CTA gradient pleine largeur
- Glow subtil violet autour de la carte

### 4. Testimonial Carousel

Cartes glass avec photo, nom, resultat, etoiles. Defilement horizontal automatique avec pause au hover.

### 5. Section Dividers

Lignes horizontales en gradient (transparent -> violet -> transparent) pour separer les sections.

---

## Accessibilite

- Tous les textes respectent WCAG AA minimum (contraste 4.5:1)
- Les elements glass ont toujours un overlay semi-opaque suffisant pour la lisibilite
- `prefers-reduced-motion` respecte : pas d'animations pour ceux qui le souhaitent
- Focus states visibles sur tous les elements interactifs
- Texte jamais en dessous de 14px

---

## Responsive

- **Desktop (1024px+)** : Layout complet, bento 3 colonnes, mockup phone a cote du hero
- **Tablet (768px)** : Bento 2 colonnes, hero empile
- **Mobile (< 768px)** : Single column, tailles de texte reduites, spacing reduit, CTAs full-width

---

## References & Inspirations

### Design
- Apple Liquid Glass / iOS 26 : Translucence, refraction, depth
- Dribbble "Nebula Pricing Card" : Structure pricing card glassmorphism
- Dribbble "Copilot Bento Box" : Layout bento grid
- Dribbble "Smart Home Dashboard" : Palette dark + glass
- Dribbble "Spotify Glassmorphism" : Traitement des couleurs vibrantes sous le glass

### Page de vente
- Structure classique long-form high-ticket (cf. PRD pour le detail)
- Inspirations : codelynx.dev, nowts.app, rosewell.dev
