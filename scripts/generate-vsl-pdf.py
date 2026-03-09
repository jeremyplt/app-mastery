from fpdf import FPDF
import os

class VSLPDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            self.set_font("Helvetica", "B", 22)
            self.cell(0, 12, "Script VSL - App Mastery", align="C", new_x="LMARGIN", new_y="NEXT")
            self.set_font("Helvetica", "", 11)
            self.set_text_color(100, 100, 100)
            self.cell(0, 8, "Video de Presentation (3 minutes)", align="C", new_x="LMARGIN", new_y="NEXT")
            self.set_text_color(0, 0, 0)
            self.ln(5)

    def section_title(self, title):
        self.set_fill_color(30, 30, 30)
        self.set_text_color(255, 255, 255)
        self.set_font("Helvetica", "B", 13)
        self.cell(0, 10, f"  {title}", fill=True, new_x="LMARGIN", new_y="NEXT")
        self.set_text_color(0, 0, 0)
        self.ln(3)

    def stage_direction(self, text):
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(120, 120, 120)
        self.multi_cell(0, 5, text)
        self.set_text_color(0, 0, 0)
        self.ln(2)

    def french_text(self, text):
        self.set_font("Helvetica", "", 11)
        self.set_text_color(0, 0, 0)
        self.multi_cell(0, 6, text)
        self.ln(1)

    def english_text(self, text):
        self.set_font("Helvetica", "I", 10)
        self.set_text_color(80, 80, 140)
        self.multi_cell(0, 5.5, text)
        self.set_text_color(0, 0, 0)
        self.ln(4)

    def separator(self):
        self.set_draw_color(200, 200, 200)
        y = self.get_y()
        self.line(20, y, self.w - 20, y)
        self.ln(5)


pdf = VSLPDF()
pdf.set_auto_page_break(auto=True, margin=20)
pdf.add_page()

# ---- HOOK ----
pdf.section_title("HOOK (0:00 - 0:15)")
pdf.stage_direction("[Face camera, regard direct, energie haute]")

pdf.french_text(
    "\"Et si je te disais que tu peux avoir ta propre app sur l'App Store "
    "et le Google Play Store dans 28 jours, sans ecrire une seule ligne de code toi-meme ?\n\n"
    "Tu penserais surement que c'est impossible. C'est exactement ce que je pensais aussi.\""
)
pdf.english_text(
    "\"What if I told you that you could have your own app on the App Store "
    "and Google Play Store in 28 days, without writing a single line of code yourself?\n\n"
    "You'd probably think that's impossible. That's exactly what I thought too.\""
)

pdf.separator()

# ---- STORY ----
pdf.section_title("STORY - Le Backstory (0:15 - 0:50)")
pdf.stage_direction("[Ton plus calme, authentique, storytelling]")

pdf.french_text(
    "\"Il y a quelques annees, j'etais comme toi. J'avais des idees d'apps plein la tete. "
    "Mais zero app sur les stores.\n\n"
    "J'ai passe des mois a regarder des tutos YouTube. A m'eparpiller entre les langages, "
    "les frameworks, les outils. Sans jamais finir quoi que ce soit.\n\n"
    "Puis un jour, j'ai decide d'arreter de repousser. J'ai travaille plus de 12 heures par jour "
    "pendant 2 ans sur mon app, Shinobi Japanese.\n\n"
    "J'ai fait toutes les erreurs possibles. Des nuits blanches a debugger. Des crashs en production. "
    "Des semaines entieres a coder des fonctionnalites que personne n'utilisait.\""
)
pdf.english_text(
    "\"A few years ago, I was just like you. I had tons of app ideas in my head. "
    "But zero apps on the stores.\n\n"
    "I spent months watching YouTube tutorials. Jumping between languages, "
    "frameworks, tools. Never finishing anything.\n\n"
    "Then one day, I decided to stop putting it off. I worked over 12 hours a day "
    "for 2 years on my app, Shinobi Japanese.\n\n"
    "I made every mistake possible. Sleepless nights debugging. Production crashes. "
    "Entire weeks coding features nobody used.\""
)

pdf.separator()

# ---- EPIPHANIE ----
pdf.section_title("L'EPIPHANIE (0:50 - 1:15)")
pdf.stage_direction("[Changement d'energie, plus intense]")

pdf.french_text(
    "\"Et puis tout a change.\n\n"
    "L'intelligence artificielle est arrivee. Et j'ai decouvert un workflow precis, "
    "le vibe coding, qui m'a permis de faire en quelques heures ce qui me prenait des semaines.\n\n"
    "L'IA ecrit le code. Moi, je dirige la vision.\n\n"
    "Resultat ? Mon app genere aujourd'hui plus de 140 000 dollars par an de revenus recurrents. "
    "Avec une seule app.\"\n\n"
    "[Montrer brievement le screenshot RevenueCat a l'ecran]\n\n"
    "\"Et la bonne nouvelle, c'est que cette methode n'a plus rien a voir avec ce que j'ai vecu "
    "pendant 2 ans. Aujourd'hui, c'est 10 fois plus rapide.\""
)
pdf.english_text(
    "\"And then everything changed.\n\n"
    "Artificial intelligence arrived. And I discovered a precise workflow, "
    "vibe coding, that allowed me to do in a few hours what used to take me weeks.\n\n"
    "AI writes the code. I direct the vision.\n\n"
    "The result? My app now generates over $140,000 per year in recurring revenue. "
    "With a single app.\"\n\n"
    "[Briefly show the RevenueCat screenshot on screen]\n\n"
    "\"And the good news is that this method has nothing to do with what I went through "
    "for 2 years. Today, it's 10 times faster.\""
)

pdf.separator()

# ---- SOLUTION ----
pdf.section_title("LA SOLUTION (1:15 - 1:45)")
pdf.stage_direction("[Confiant, structure]")

pdf.french_text(
    "\"C'est pour ca que j'ai cree App Mastery.\n\n"
    "Une formation en 3 phases simples :\n\n"
    "Phase 1 : Tu trouves et tu valides une idee d'app qui a un vrai marche. "
    "Avant de construire quoi que ce soit.\n\n"
    "Phase 2 : Tu developpes ton app avec l'IA. Pas besoin de savoir coder. "
    "Je te montre exactement comment faire.\n\n"
    "Phase 3 : Tu publies sur les stores, et surtout, je t'apprends tout le marketing. "
    "Contenu organique, strategie influenceurs, monetisation. "
    "Parce qu'une app sans visibilite ne fait pas d'argent.\n\n"
    "En 28 jours, tu passes de l'idee a une app publiee et monetisee.\""
)
pdf.english_text(
    "\"That's why I created App Mastery.\n\n"
    "A program in 3 simple phases:\n\n"
    "Phase 1: You find and validate an app idea with a real market. "
    "Before building anything.\n\n"
    "Phase 2: You develop your app with AI. No coding skills needed. "
    "I show you exactly how to do it.\n\n"
    "Phase 3: You publish on the stores, and most importantly, I teach you all the marketing. "
    "Organic content, influencer strategy, monetization. "
    "Because an app without visibility doesn't make money.\n\n"
    "In 28 days, you go from idea to a published and monetized app.\""
)

pdf.separator()

# ---- PROOF ----
pdf.section_title("PROOF (1:45 - 2:10)")
pdf.stage_direction("[Montrer les preuves a l'ecran pendant qu'on parle]")

pdf.french_text(
    "\"Et je ne suis pas le seul a avoir ces resultats.\"\n\n"
    "[Montrer les reviews App Store + Google Play]\n\n"
    "\"Shinobi Japanese, c'est plus de 10 000 avis sur l'App Store et le Google Play Store, "
    "avec une note moyenne de 4.85 sur 5.\"\n\n"
    "[Montrer les videos virales de Logan]\n\n"
    "\"Logan, mon cofondateur, a genere des millions de vues avec du contenu organique. "
    "Et il intervient directement dans la formation pour t'apprendre ses strategies.\"\n\n"
    "[Montrer le screenshot DM influenceur]\n\n"
    "\"On te montre meme comment contacter et closer des influenceurs, sans budget pub.\""
)
pdf.english_text(
    "\"And I'm not the only one with these results.\"\n\n"
    "[Show App Store + Google Play reviews]\n\n"
    "\"Shinobi Japanese has over 10,000 reviews on the App Store and Google Play Store, "
    "with an average rating of 4.85 out of 5.\"\n\n"
    "[Show Logan's viral videos]\n\n"
    "\"Logan, my co-founder, generated millions of views with organic content. "
    "And he teaches directly in the program to share his strategies with you.\"\n\n"
    "[Show influencer DM screenshot]\n\n"
    "\"We even show you how to reach out to and close influencers, with zero ad budget.\""
)

pdf.separator()

# ---- OFFRE ----
pdf.section_title("L'OFFRE + URGENCE (2:10 - 2:40)")
pdf.stage_direction("[Energie montante, conviction]")

pdf.french_text(
    "\"App Mastery, c'est 10 modules, plus de 90 lecons pas a pas. "
    "Plus des bonus qui valent plus de 1 500 dollars a eux seuls. "
    "Masterclass Claude Code, masterclass Git, lives Q&A deux fois par mois avec moi, "
    "et une communaute privee a vie.\n\n"
    "Et si tu n'es pas satisfait, tu as 30 jours pour te faire rembourser. Zero risque.\n\n"
    "Le detail de l'offre et le prix sont juste en dessous de cette video.\""
)
pdf.english_text(
    "\"App Mastery is 10 modules, over 90 step-by-step lessons. "
    "Plus bonuses worth over $1,500 on their own. "
    "Claude Code masterclass, Git masterclass, live Q&A twice a month with me, "
    "and a lifetime private community.\n\n"
    "And if you're not satisfied, you have 30 days to get a full refund. Zero risk.\n\n"
    "The full offer details and pricing are right below this video.\""
)

pdf.separator()

# ---- CTA ----
pdf.section_title("CTA FINAL (2:40 - 3:00)")
pdf.stage_direction("[Regard camera, direct, sincere]")

pdf.french_text(
    "\"Reflechis une seconde. Une app avec seulement 100 abonnes a 10 euros par mois, "
    "ca fait pres de 12 000 euros par an de revenus recurrents. Et ca, c'est avec UNE seule app.\n\n"
    "Tu peux continuer a regarder des tutos pendant des mois. "
    "Ou tu peux lancer ton app dans les 28 prochains jours.\n\n"
    "Clique sur le bouton en dessous pour decouvrir l'offre complete. A tout de suite.\""
)
pdf.english_text(
    "\"Think about it for a second. An app with just 100 subscribers at 10 euros per month "
    "is nearly 12,000 euros per year in recurring revenue. And that's with just ONE app.\n\n"
    "You can keep watching tutorials for months. "
    "Or you can launch your app in the next 28 days.\n\n"
    "Click the button below to see the full offer. See you in a moment.\""
)

pdf.separator()

# ---- NOTES DE PRODUCTION ----
pdf.section_title("NOTES DE PRODUCTION")

pdf.french_text(
    "- Duree totale : 2 min 50 - 3 min 00\n"
    "- Cadrage : Face camera, buste, arriere-plan neutre ou bureau clean\n"
    "- Eclairage : Bien eclaire, naturel, pas de filtre\n"
    "- Ton : Conversationnel, pas de teleprompter visible. Parler comme a un ami.\n"
    "- Sous-titres : Obligatoires. 80%+ des gens regardent sans le son au debut.\n"
    "- Musique : Legere en fond, montante vers la fin. Pas de musique pendant le hook."
)

pdf.french_text(
    "\nB-roll a inserer :\n"
    "- Screenshot RevenueCat (140K$/an) a 1:05\n"
    "- Reviews App Store + Google Play (10 000+ avis, 4.85/5) a 1:50\n"
    "- Videos virales Logan (millions de vues) a 1:55\n"
    "- Screenshot DM influenceur a 2:05\n"
    "- Ecran de la formation / interface a 2:15"
)

output_path = os.path.join(os.path.dirname(__file__), "vsl-script-bilingual.pdf")
pdf.output(output_path)
print(f"PDF generated: {output_path}")
