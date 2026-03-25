# PostHog - Tracking & Funnels pour /plan-action

## Events disponibles

| Event | Type | Déclencheur | Propriétés |
|---|---|---|---|
| `$pageview` | Auto | Visite de n'importe quelle page | `$current_url`, `pathname` |
| `plan_action_form_submitted` | Custom | Formulaire soumis avec succès sur /plan-action | `source`, `utm_source`, `utm_medium`, `utm_campaign` |
| `calendly_click` | Custom | Clic sur un lien Calendly (toutes pages) | `source` (pathname de la page) |
| `calendly_booked` | Server-side | Réservation confirmée via webhook Calendly | `email`, `name`, `start_time` |
| `calendly_canceled` | Server-side | Annulation d'un appel via webhook Calendly | `email`, `name` |
| `contact_form_submitted` | Custom | Formulaire de contact soumis | - |
| `whatsapp_click` | Custom | Clic sur un lien WhatsApp (toutes pages) | `source` (pathname de la page) |
| `checkout_started` | Custom | Clic sur un bouton d'achat /formation | `plan` (essentiel, complet, vip...) |

---

## Funnel principal : /plan-action

Le funnel complet du lead magnet, de la visite jusqu'a la reservation d'appel.

### Configuration dans PostHog : Funnels > New Funnel

**Étapes :**
1. `$pageview` where `$current_url` contains `/plan-action` (exclure `/merci` et `/video`)
2. `plan_action_form_submitted`
3. `$pageview` where `$current_url` contains `/plan-action/merci`
4. `$pageview` where `$current_url` contains `/plan-action/video`
5. `calendly_click` where `source` = `/plan-action/video` OR `source` = `/plan-action/merci`
6. `calendly_booked`

**Ce que tu mesures :**
- Taux de conversion du formulaire (étape 1 -> 2)
- Taux d'ouverture de la vidéo (étape 3 -> 4)
- Taux de clic Calendly (étape 4 -> 5)
- Taux de reservation effective (étape 5 -> 6)
- Taux global visite -> réservation (étape 1 -> 6)

**Filtres recommandés :**
- Breakdown by `utm_source` pour voir quelle source de trafic convertit le mieux
- Breakdown by `utm_campaign` pour comparer les campagnes
- Time period : 14 ou 30 derniers jours

---

## Insights a créer

### 1. Taux de conversion du formulaire (KPI principal)

**Type :** Funnel
**Étapes :**
1. `$pageview` where `$current_url` contains `/plan-action` (exclure `/merci`, `/video`)
2. `plan_action_form_submitted`

**Affichage :** Conversion rate (%)
**Breakdown :** `utm_source` pour voir d'ou viennent les meilleurs leads

---

### 2. Taux de visionnage de la vidéo

**Type :** Funnel
**Étapes :**
1. `plan_action_form_submitted`
2. `$pageview` where `$current_url` contains `/plan-action/video`

Mesure combien de gens qui s'inscrivent vont réellement regarder la vidéo (via le lien email).

---

### 3. Taux de réservation Calendly (depuis la vidéo)

**Type :** Funnel
**Étapes :**
1. `$pageview` where `$current_url` contains `/plan-action/video`
2. `calendly_click` where `source` = `/plan-action/video`
3. `calendly_booked`

---

### 4. Taux de réservation Calendly (depuis la page merci)

**Type :** Funnel
**Étapes :**
1. `$pageview` where `$current_url` contains `/plan-action/merci`
2. `calendly_booked`

Note : pas de `calendly_click` ici car l'iframe Calendly sur /merci n'est pas trackable via clic. On mesure directement la réservation.

---

### 5. Trafic /plan-action par source

**Type :** Trends
**Event :** `$pageview` where `$current_url` contains `/plan-action` (exclure `/merci`, `/video`)
**Breakdown :** `utm_source`
**Affichage :** Line chart, par jour ou par semaine

---

### 6. Volume de soumissions par jour

**Type :** Trends
**Event :** `plan_action_form_submitted`
**Affichage :** Bar chart, par jour
**Breakdown :** `utm_source` (optionnel)

---

### 7. Performance par campagne UTM

**Type :** Funnel
**Étapes :**
1. `$pageview` where `$current_url` contains `/plan-action`
2. `plan_action_form_submitted`

**Breakdown :** `utm_campaign`

Compare les taux de conversion entre tes différentes campagnes (ads, emails, posts...).

---

## Dashboard recommandé

Crée un dashboard "Plan d'Action" avec ces 6 widgets :

| Widget | Type | Métrique |
|---|---|---|
| Conversion formulaire | Funnel | % visiteurs -> soumission |
| Soumissions / jour | Trend | Volume de leads par jour |
| Conversion par source | Funnel + breakdown | Quelle source convertit le mieux |
| Visionnage vidéo | Funnel | % inscrits qui regardent la vidéo |
| Clics Calendly | Trend | Volume de clics par jour |
| Réservations | Trend | `calendly_booked` par jour |

---

## Notes techniques

- Les events `calendly_booked` et `calendly_canceled` arrivent server-side via le webhook Calendly. Le `distinct_id` est l'email du contact. Pour que PostHog relie ces events aux pageviews du meme utilisateur, il faut que PostHog ait identifié l'utilisateur avec son email (via `posthog.identify(email)`) coté client. Sinon, les funnels cross-device ne matcheront pas exactement.
- L'iframe Calendly sur /plan-action/merci ne génère pas de `calendly_click`. Les réservations depuis cette page ne sont visibles que via `calendly_booked`.
- Les UTM params sont capturés sur `plan_action_form_submitted`. PostHog capture aussi automatiquement les UTM params sur les pageviews via les query strings.
