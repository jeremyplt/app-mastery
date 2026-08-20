// Disclaimer de non-affiliation exigé par les bonnes pratiques publicitaires
// Meta / Google. Affiché sur toutes les pages recevant du trafic publicitaire
// pour protéger le compte publicitaire (règles "brand usage").
export default function AdDisclaimer() {
  return (
    <div className="border-t border-[var(--sep)] px-4 py-6">
      <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-[var(--fg3)]">
        Ce site ne fait pas partie du site Facebook™, Instagram™, YouTube™ ou
        Google™ et n&apos;est affilié ni à Meta Platforms, Inc. ni à Google LLC.
        Ce site n&apos;est en aucune façon approuvé par Facebook™, Instagram™,
        YouTube™ ou Google™. FACEBOOK™ et INSTAGRAM™ sont des marques déposées
        de Meta Platforms, Inc. GOOGLE™ et YOUTUBE™ sont des marques déposées de
        Google LLC.
      </p>
    </div>
  );
}
