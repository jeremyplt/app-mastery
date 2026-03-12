from fpdf import FPDF
import os

class VSLPDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            self.set_font("Helvetica", "B", 22)
            self.cell(0, 12, "Script VSL - App Mastery", align="C", new_x="LMARGIN", new_y="NEXT")
            self.set_font("Helvetica", "", 11)
            self.set_text_color(100, 100, 100)
            self.cell(0, 8, "Vidéo de Présentation (3 minutes)", align="C", new_x="LMARGIN", new_y="NEXT")
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
pdf.stage_direction("[Face caméra, regard direct, énergie haute]")

pdf.french_text(
    "\"Et si je te disais que tu peux avoir ta propre app sur l'App Store "
    "et le Google Play Store dans 28 jours, sans écrire une seule ligne de code toi-même ?\n\n"
    "Tu penserais sûrement que c'est impossible. C'est exactement ce que je pensais aussi.\""
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
    "\"Il y a quelques années, j'étais comme toi. J'avais des idées d'apps plein la tête. "
    "Mais zéro app sur les stores.\n\n"
    "J'ai passé des mois à regarder des tutos YouTube. À m'éparpiller entre les langages, "
    "les frameworks, les outils. Sans jamais finir quoi que ce soit.\n\n"
    "Puis un jour, j'ai décidé d'arrêter de repousser. J'ai travaillé plus de 12 heures par jour "
    "pendant 2 ans sur mon app, Shinobi Japanese.\n\n"
    "J'ai fait toutes les erreurs possibles. Des nuits blanches à debugger. Des crashs en production. "
    "Des semaines entières à coder des fonctionnalités que personne n'utilisait.\""
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

# ---- ÉPIPHANIE ----
pdf.section_title("L'ÉPIPHANIE (0:50 - 1:15)")
pdf.stage_direction("[Changement d'énergie, plus intense]")

pdf.french_text(
    "\"Et puis tout a changé.\n\n"
    "L'intelligence artificielle est arrivée. Et j'ai découvert un workflow précis, "
    "le vibe coding, qui m'a permis de faire en quelques heures ce qui me prenait des semaines.\n\n"
    "L'IA écrit le code. Moi, je dirige la vision.\n\n"
    "Résultat ? Mon app génère aujourd'hui plus de 140 000 dollars par an de revenus récurrents. "
    "Avec une seule app.\"\n\n"
    "[Montrer brièvement le screenshot RevenueCat à l'écran]\n\n"
    "\"Et la bonne nouvelle, c'est que cette méthode n'a plus rien à voir avec ce que j'ai vécu "
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
pdf.stage_direction("[Confiant, structuré]")

pdf.french_text(
    "\"C'est pour ça que j'ai créé App Mastery.\n\n"
    "Une formation en 3 phases simples :\n\n"
    "Phase 1 : Tu trouves et tu valides une idée d'app qui a un vrai marché. "
    "Avant de construire quoi que ce soit.\n\n"
    "Phase 2 : Tu développes ton app avec l'IA. Pas besoin de savoir coder. "
    "Je te montre exactement comment faire.\n\n"
    "Phase 3 : Tu publies sur les stores, et surtout, je t'apprends tout le marketing. "
    "Contenu organique, stratégie influenceurs, monétisation. "
    "Parce qu'une app sans visibilité ne fait pas d'argent.\n\n"
    "En 28 jours, tu passes de l'idée à une app publiée et monétisée.\""
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
pdf.stage_direction("[Montrer les preuves à l'écran pendant qu'on parle]")

pdf.french_text(
    "\"Et je ne suis pas le seul à avoir ces résultats.\"\n\n"
    "[Montrer les reviews App Store + Google Play]\n\n"
    "\"Shinobi Japanese, c'est plus de 10 000 avis sur l'App Store et le Google Play Store, "
    "avec une note moyenne de 4.85 sur 5.\"\n\n"
    "[Montrer les vidéos virales de Logan]\n\n"
    "\"Logan, mon cofondateur, a généré des millions de vues avec du contenu organique. "
    "Et il intervient directement dans la formation pour t'apprendre ses stratégies.\"\n\n"
    "[Montrer le screenshot DM influenceur]\n\n"
    "\"On te montre même comment contacter et closer des influenceurs, sans budget pub.\""
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
pdf.stage_direction("[Énergie montante, conviction]")

pdf.french_text(
    "\"App Mastery, c'est 10 modules, plus de 90 leçons pas à pas. "
    "Plus des bonus qui valent plus de 1 500 dollars à eux seuls. "
    "Masterclass Claude Code, masterclass Git, lives Q&A deux fois par mois avec moi, "
    "et une communauté privée à vie.\n\n"
    "Et si tu n'es pas satisfait, tu as 30 jours pour te faire rembourser. Zéro risque.\n\n"
    "Le détail de l'offre et le prix sont juste en dessous de cette vidéo.\""
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
pdf.stage_direction("[Regard caméra, direct, sincère]")

pdf.french_text(
    "\"Réfléchis une seconde. Une app avec seulement 100 abonnés à 10 euros par mois, "
    "ça fait près de 12 000 euros par an de revenus récurrents. Et ça, c'est avec UNE seule app.\n\n"
    "Tu peux continuer à regarder des tutos pendant des mois. "
    "Ou tu peux lancer ton app dans les 28 prochains jours.\n\n"
    "Clique sur le bouton en dessous pour découvrir l'offre complète. À tout de suite.\""
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
    "- Durée totale : 2 min 50 - 3 min 00\n"
    "- Cadrage : Face caméra, buste, arrière-plan neutre ou bureau clean\n"
    "- Éclairage : Bien éclairé, naturel, pas de filtre\n"
    "- Ton : Conversationnel, pas de téléprompteur visible. Parler comme à un ami.\n"
    "- Sous-titres : Obligatoires. 80%+ des gens regardent sans le son au début.\n"
    "- Musique : Légère en fond, montante vers la fin. Pas de musique pendant le hook."
)

pdf.french_text(
    "\nB-roll à insérer :\n"
    "- Screenshot RevenueCat (140K$/an) à 1:05\n"
    "- Reviews App Store + Google Play (10 000+ avis, 4.85/5) à 1:50\n"
    "- Vidéos virales Logan (millions de vues) à 1:55\n"
    "- Screenshot DM influenceur à 2:05\n"
    "- Écran de la formation / interface à 2:15"
)

output_path = os.path.join(os.path.dirname(__file__), "vsl-script-bilingual.pdf")
pdf.output(output_path)
print(f"PDF generated: {output_path}")
