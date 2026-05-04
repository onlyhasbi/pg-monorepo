export interface TranslationKeys {
  common: {
    copySuccess: string;
  };
  seo: {
    title: string;
    description: string;
    agentTitleSuffix: string;
    agentDescription: string;
  };
  ui: {
    highlightTestimonials: string;
    highlightPrice: string;
    photo: string;
  };
  nav: {
    about: string;
    advantage: string;
    products: string;
    buy: string;
    testimonials: string;
    start: string;
    contact: string;
    register: string;
    share: string;
    accountAdult: string;
    accountChild: string;
    back: string;
  };
  registerPage: {
    selectCountry: string;
    selectBranch: string;
    termsAndNewsletter: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    mission: string;
    cta: string;
  };
  publicGold: {
    title: string;
    desc: string;
    stats: {
      customers: string;
      branches: string;
      years: string;
    };
    statsLabels: {
      country: string;
    };
    whyTitle: string;
    features: Array<{
      title: string;
      description: string;
    }>;
  };
  benefit: {
    badge: string;
    title: string;
    desc: string;
    items: Array<{
      title: string;
      desc: string;
    }>;
  };
  products: {
    badge: string;
    title: string;
    subtitle: string;
    seeDetail: string;
    types: {
      dinar: string;
      goldbar: string;
    };
  };
  buy: {
    badge: string;
    title: string;
    subtitle: string;
    steps: Array<{
      title: string;
      desc: string;
    }>;
  };
  excellence: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      text: string;
      points: string[];
      features: string[];
    }>;
  };
  paymentMethods: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      subtitle: string;
      description: string;
      features: string[];
      cta: string;
    }>;
    note: string;
  };
  dealer: {
    badge: string;
    title: string;
    subtitle: string;
    benefits: Array<{
      title: string;
      desc: string;
    }>;
    joinTeam: string;
    teamBenefits: string[];
    quote: string;
  };
  cta: {
    dealerBadge: string;
    title: string;
    desc: string;
    whatsapp: string;
    badges: string[];
    footer: string;
    copyright: string;
  };
  contact: {
    badge: string;
    title: string;
    desc: string;
    form: {
      firstName: string;
      lastName: string;
      email: string;
      message: string;
      submit: string;
      placeholder: string;
    };
  };
  howToStart: {
    badge: string;
    title: string;
    subtitle: string;
    steps: Array<{
      title: string;
      desc: string;
    }>;
    cta: string;
    note: string;
  };
  startPage: {
    badge: string;
    title: string;
    desc: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stepsTitle: string;
    stepsDesc: string;
    steps: Array<{
      title: string;
      desc: string;
    }>;
    guarantee: {
      title: string;
      subtitle: string;
    };
  };
  priceList: {
    badge: string;
    title: string;
    subtitle: string;
    loading: string;
    priceLabel: string;
    currency: string;
    pricePerWeight: string;
    currentPricePerGram: string;
    priceOptions: string;
    infoTitle: string;
    infoDesc: string;
    modeSaving: string;
    modeCash: string;
    poe: {
      title: string;
      subtitle: string;
      desc: string;
    };
    perGram: {
      title: string;
      subtitle: string;
      desc: string;
    };
  };
  testimonials: {
    badge: string;
    title: string;
    desc: string;
    items: Array<{
      quote: string;
      name: string;
      title: string;
    }>;
  };
  faq: {
    badge: string;
    title: string;
    desc: string;
    items: Array<{
      category: string;
      ask: string;
      answer: string;
    }>;
  };
  notFound: {
    title: string;
    desc: string;
    backHome: string;
    goBack: string;
  };
  registerForm: {
    titleDewasa: string;
    descDewasa: string;
    titleAnak: string;
    descAnak: string;
    tabDewasa: string;
    tabAnak: string;
    noteAnak: string;
    parentSectionTitle: string;
    nameLabelDewasa: string;
    nameLabelAnak: string;
    namePlaceholderDewasa: string;
    namePlaceholderAnak: string;
    idTypeLabel: string;
    idTypeKtp: string;
    idTypePassport: string;
    icLabelDewasa: string;
    icLabelAnak: string;
    icPlaceholderDewasa: string;
    icPlaceholderAnak: string;
    npwpLabel: string;
    npwpDesc: string;
    npwpPlaceholder: string;
    dobLabelDewasa: string;
    dobLabelAnak: string;
    emailLabel: string;
    emailPlaceholder: string;
    parentNameLabel: string;
    parentNamePlaceholder: string;
    parentIcLabel: string;
    parentIcPlaceholder: string;
    mobileLabelDewasa: string;
    mobileLabelAnak: string;
    mobilePlaceholder: string;
    mobileWarning: string;
    branchLabel: string;
    branchDesc: string;
    submitBtn: string;
    submittingBtn: string;
    termsText: string;
    termsLink: string;
    confirmTitle: string;
    confirmDesc: string;
    confirmDescAnak: string;
    backBtn: string;
    confirmBtn: string;
    ageValidationTitle: string;
    ageValidationToDewasa: string;
    ageValidationToAnak: string;
    ageValidationQuestion: string;
    ageValidationSwitchBtn: string;
    ageValidationCancelBtn: string;
    successTitle: string;
    successDesc: string;
    successCta: string;
    successSkip: string;
    validation: {
      nameRegex: string;
      icDigits: string;
      mobileDigits: string;
      max20: string;
      required: string;
      email: string;
      dob: string;
      branch: string;
    };
  };
}
