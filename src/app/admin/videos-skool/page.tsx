import QuestionsBoard from "../questions/QuestionsBoard";

// Les grandes vidéos Skool à tourner, chacune sur un sujet entier comme celle
// sur l'onboarding. Mêmes données que /admin/questions (table student_questions,
// support_format « grande vidéo Skool »).
export default function VideosSkoolPage() {
  return <QuestionsBoard mode="videos" />;
}
