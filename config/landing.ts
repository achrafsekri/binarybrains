import { FeatureLdg, InfoLdg, TestimonialType } from "types";

export const infos: InfoLdg[] = [
  {
    title: "Comment ça marche ?",
    description:
      "Comment creez une facture ou devis en ligne en quelques clics ?",
    image: "/_static/illustrations/work-from-home.jpg",
    list: [
      {
        title: "Créez votre compte",
        description: "Inscrivez-vous gratuitement sur notre plateforme.",
        icon: "one",
      },
      {
        title: "Créez une facture ou devis",
        description: "Créez une facture ou devis en quelques clics.",
        icon: "two",
      },
      {
        title: "Telechargez votre facture",
        description:
          "Téléchargez votre facture ou devis au format PDF ou envoyez-le par email.",
        icon: "three",
      },
    ],
  },
  {
    title: "Seamless Integration",
    description:
      "Integrate our open-source SaaS seamlessly into your existing workflows. Effortlessly connect with your favorite tools and services for a streamlined experience.",
    image: "/_static/illustrations/work-from-home.jpg",
    list: [
      {
        title: "Flexible",
        description:
          "Customize your integrations to fit your unique requirements.",
        icon: "laptop",
      },
      {
        title: "Efficient",
        description: "Streamline your processes and reducing manual effort.",
        icon: "search",
      },
      {
        title: "Reliable",
        description:
          "Rely on our robust infrastructure and comprehensive documentation.",
        icon: "settings",
      },
    ],
  },
];

export const features: FeatureLdg[] = [
  {
    title: "Creez des factures",
    description:
      "Créez des factures professionnelles en quelques clics et envoyez-les à vos clients.",
    link: "/",
    icon: "invoice",
  },
  {
    title: "Creez des devis",
    description:
      "Créez des devis professionnels en quelques clics et envoyez-les à vos clients.",
    link: "/",
    icon: "quote",
  },
  {
    title: "Ajoutez des clients",
    description:
      "Ajoutez des clients à votre liste et gérez leurs informations en toute simplicité.",
    link: "/",
    icon: "clients",
  },
  {
    title: "Envoyez vos factures et devis par email",
    description:
      "Envoyez vos factures et devis par email à vos clients en un seul clic.",
    link: "/",
    icon: "mail",
  },
  {
    title: "Telechargez vos factures et devis",
    description: "Téléchargez vos factures et devis au format PDF.",
    link: "/",
    icon: "pdf",
  },
  {
    title: "Reutilisez vos factures et devis",
    description: "Reutilisez vos factures et devis pour gagner du temps.",
    link: "/",
    icon: "reuse",
  },
];

export const testimonials: TestimonialType[] = [
  {
    name: "Achraf Sekri",
    job: "Freelancer",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    review:
      "Cette plateforme a révolutionné ma gestion administrative. Je gagne un temps précieux sur chaque devis et facture. Un outil indispensable pour tout freelance !",
  },
  {
    name: "Taha",
    job: "Propriétaire d'une entreprise en ligne",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    review:
      "Depuis que j'utilise ce service, ma comptabilité est devenue un jeu d'enfant. L'interface intuitive et les fonctionnalités avancées m'ont permis de me concentrer davantage sur le développement de mon entreprise.",
  },
  {
    name: "Yamna Mohamed",
    job: "Pneumaticien",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    review:
      "Un outil remarquable qui s'adapte parfaitement aux besoins spécifiques de mon entreprise. La personnalisation des modèles de devis est un vrai plus pour mon image professionnelle.",
  },
  {
    name: "Miled Ameur",
    job: "Chef de projet",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    review:
      "En tant que chef de projet, la gestion financière peut être complexe. Cette plateforme simplifie considérablement le suivi des factures et des paiements, me permettant de me concentrer sur l'essentiel de mon travail.",
  },
  {
    name: "Sophia Garcia",
    job: "Boulangère",
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    review:
      "Même dans le domaine de la boulangerie, une bonne gestion est cruciale. Cet outil m'aide à garder un œil sur mes finances tout en jonglant avec mes fournées. C'est simple, efficace et absolument indispensable !",
  },
  {
    name: "Antoine",
    job: "Plombier",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    review:
      "Je craignais que la gestion administrative ne soit un cauchemar, mais cette plateforme a tout changé. Mes clients apprécient la clarté de mes devis et la rapidité de ma facturation. Un vrai gain de professionnalisme !",
  },
  {
    name: "Markus jeager",
    job: "electricien",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    review:
      "En tant qu'électricien indépendant, je suis souvent sur le terrain. Cette solution me permet de gérer mes documents administratifs où que je sois, directement depuis mon smartphone. C'est un gain de temps incroyable !",
  },
];
