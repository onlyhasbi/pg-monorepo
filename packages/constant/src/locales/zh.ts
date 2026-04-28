import type { TranslationKeys } from "./types";

export const zh: TranslationKeys = {
  common: {
    copySuccess: "链接已成功复制！",
  },
  seo: {
    title: "{{name}} | Public Gold 授权代理商",
    description:
      "从 Public Gold Indonesia 授权代理商处购买 24K 纯金。联系 {{name}} 开启您的黄金储蓄之旅。",
  },
  ui: {
    highlightTestimonials: "客户见证",
    highlightPrice: "今日金价",
    photo: "照片",
  },
  nav: {
    about: "关于我们",
    advantage: "优势",
    products: "产品",
    buy: "购买方式",
    testimonials: "评价",
    start: "开始",
    contact: "联系我们",
    register: "注册",
    share: "分享",
    accountAdult: "成人账户",
    accountChild: "少年账户",
    back: "返回",
  },
  registerPage: {
    selectCountry: "选择国家",
    selectBranch: "选择分行",
    termsAndNewsletter: "订阅并同意条款与细则",
  },
  hero: {
    eyebrow: "Public Gold 官方经销商",
    headline:
      "您好，我是 <span class='bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent drop-shadow-sm'>{{name}}</span>",
    mission:
      "通过稳定且易于变现的实物黄金，保护您的财富免受通胀影响。我随时准备帮助您在 Public Gold 以安全、透明且符合您需求的方式开始黄金投资。",
    cta: "立即免费咨询",
  },
  publicGold: {
    title: "关于 Public Gold",
    desc: "受到东南亚超过240万客户的信赖，提供透明回购系统和具有竞争力的价格的实物黄金买卖平台，并已获得Amanie Advisors的合规认证。",
    stats: {
      customers: "百万活跃客户",
      branches: "分行网点",
      years: "运营年数",
    },
    statsLabels: {
      country: "国家",
    },
    whyTitle: "为什么选择 Public Gold？",
    features: [
      {
        title: "符合伊斯兰教法",
        description:
          "交易安全、透明，并在<a href='https://amanieadvisors.com/' target='_blank' rel='noopener noreferrer' class='text-red-600 hover:underline font-medium'>Amanie Advisors</a>的监督下符合伊斯兰教法。",
      },
      { title: "轻松数字交易", description: "随时随地24小时在线购买黄金。" },
      {
        title: "安全投保配送",
        description: "黄金直接送到您的地址，享有全额保险保障。",
      },
      { title: "免费存储", description: "通过GAP账户享受免费黄金存储服务。" },
      {
        title: "有竞争力的价格",
        description: "直接从生产商获得透明且有竞争力的价格。",
      },
      {
        title: "回购保证",
        description: "轻松转售黄金，即使在某些条件下仍可接受。",
      },
    ],
  },
  benefit: {
    badge: "为什么选择黄金？",
    title: "持有黄金的优势",
    desc: "黄金是在经济变化中长期保持财富价值的理想选择。",
    items: [
      { title: "抗通胀", desc: "帮助保护您的资产免受购买力下降的影响。" },
      { title: "流动性高", desc: "需要资金时可随时出售。" },
      { title: "未来规划", desc: "适用于教育、朝觐、养老等长期规划。" },
      { title: "实物资产", desc: "直接拥有有价值的实物资产。" },
      { title: "符合伊斯兰教法", desc: "交易透明并遵循教法原则。" },
      { title: "可传承资产", desc: "易于继承且价值相对稳定。" },
    ],
  },
  products: {
    badge: "产品目录",
    title: "纯金系列",
    subtitle: "提供多种 999.9（24K）纯度并拥有 LBMA 国际认证的金条与金币选择。",
    seeDetail: "查看详情",
    types: {
      dinar: "第纳尔金币",
      goldbar: "金条",
    },
  },
  buy: {
    badge: "购买指南",
    title: "轻松购买黄金",
    subtitle: "按照简单步骤开始拥有您的黄金资产。",
    steps: [
      {
        title: "1. 注册账户（免费）",
        desc: "通过 Public Gold 官网使用您的身份证信息注册。",
      },
      { title: "2. 选择产品", desc: "选择实物黄金或通过 GAP 账户开始储蓄。" },
      { title: "3. 完成付款", desc: "可通过虚拟账户或银行转账付款。" },
      {
        title: "4. 接收与存储",
        desc: "黄金可配送至您的地址或通过存储服务保存。",
      },
    ],
  },
  excellence: {
    badge: "我们的优势",
    title: "为什么选择我们投资黄金？",
    subtitle: "为您提供更安全、便捷的黄金投资管理服务。",
    items: [
      {
        title: "符合伊斯兰教法",
        text: "Public Gold 符合国际伊斯兰教法标准的实物黄金交易。",
        points: [
          "由具备全球资质的 <a href='https://amanieadvisors.com/' target='_blank' rel='noopener noreferrer' class='text-red-600 hover:underline font-medium'>Amanie Advisors</a> 监管。",
          "支付方式符合教法原则。",
        ],
        features: ["官方认证", "教法合规", "国际标准"],
      },
      {
        title: "交易便捷",
        text: "支持印尼主要银行的多种支付方式。",
        points: ["快速验证流程。", "无额外负担费用。", "交易透明。"],
        features: ["快速", "多银行", "无手续费"],
      },
      {
        title: "安全保障",
        text: "黄金配送全程保险保障，确保安全送达。",
        points: ["保险覆盖商品价值。", "严格操作流程。"],
        features: ["有保险", "可靠", "安全"],
      },
      {
        title: "广泛网络",
        text: "在东南亚拥有多家分行，为客户提供更好服务。",
        points: ["线上与线下服务。", "便捷回购流程。"],
        features: ["多国覆盖", "线上服务", "实体分行"],
      },
    ],
  },
  paymentMethods: {
    badge: "支付方式",
    title: "多种黄金购买方式",
    subtitle: "选择最适合您的方式。",
    items: [
      {
        title: "现金支付",
        subtitle: "直接购买",
        description: "黄金直接归您所有，并可配送至指定地址。",
        features: ["配送到家", "保险保障", "产品认证", "价格随市场变化"],
        cta: "立即购买",
      },
      {
        title: "黄金积累计划（GAP）",
        subtitle: "数字黄金储蓄",
        description: "购买黄金并存储于数字账户。\n灵活且可转换为实物黄金。",
        features: [
          "起步仅需 Rp 300,000",
          "免费存储",
          "可转换为实物黄金",
          "灵活便捷",
        ],
        cta: "开始储蓄",
      },
      {
        title: "分期付款（EPP）",
        subtitle: "教法合规分期",
        description: "按照伊斯兰教法原则进行分期购买黄金。",
        features: ["无利息", "符合教法", "多种期限", "安全存储"],
        cta: "开始分期",
      },
    ],
    note: "需要帮助？咨询最适合您的方案。",
  },
  dealer: {
    badge: "商业机会",
    title: "成为 Public Gold 经销商",
    subtitle: "拓展额外收入来源并提升金融认知。",
    benefits: [
      { title: "额外收入", desc: "通过交易活动获得奖励。" },
      { title: "灵活性", desc: "可随时随地开展。" },
      { title: "支持指导", desc: "获得成长过程中的指导。" },
    ],
    joinTeam: "为什么加入我们的团队？",
    teamBenefits: ["学习社群", "营销资料", "定期培训", "营销策略"],
    quote: "成为经销商是学习与成长黄金资产领域的机会。",
  },
  cta: {
    dealerBadge: "官方经销商",
    title: "开始保障您的资产价值",
    desc: "咨询您的需求，开启正确的黄金投资之路。",
    whatsapp: "通过 WhatsApp 咨询",
    badges: ["免费咨询", "全程指导", "教法合规"],
    footer: "Public Gold Indonesia 授权代理商",
    copyright: "© {{year}} 5G Associates Indonesia。版权所有。",
  },
  contact: {
    badge: "联系我们",
    title: "有任何问题？",
    desc: "我们随时为您提供黄金投资相关帮助。",
    form: {
      firstName: "名字",
      lastName: "姓氏",
      email: "电子邮箱",
      message: "您的留言",
      submit: "发送信息",
      placeholder: "在这里填写您的问题...",
    },
  },
  howToStart: {
    badge: "开始方式",
    title: "3 个简单步骤开始黄金储蓄",
    subtitle: "快速且安全地开启您的首次投资。",
    steps: [
      { title: "1. 免费注册", desc: "填写与身份证一致的信息。" },
      { title: "2. 账户验证", desc: "上传身份信息进行验证。" },
      { title: "3. 开始储蓄", desc: "通过系统开始购买黄金。" },
    ],
    cta: "立即注册",
    note: "*注册完全免费，无隐藏费用",
  },
  startPage: {
    badge: "新手指南",
    title: "开启您的黄金储蓄",
    desc: "通过安全灵活的系统逐步建立您的黄金资产。",
    ctaPrimary: "立即注册",
    ctaSecondary: "了解更多",
    stepsTitle: "开始步骤",
    stepsDesc: "注册流程简单快捷。",
    steps: [
      { title: "在线注册", desc: "填写个人信息。" },
      { title: "身份验证", desc: "上传身份证件。" },
      { title: "开始储蓄", desc: "根据需求购买黄金。" },
    ],
    guarantee: {
      title: "教法合规",
      subtitle: "安全可靠",
    },
  },
  priceList: {
    badge: "实时价格",
    title: "今日黄金价格",
    subtitle: "根据全球市场定期更新",
    loading: "加载中...",
    priceLabel: "卖出价格",
    currency: "Rp ",
    pricePerWeight: "每 {{weight}} 克价格",
    currentPricePerGram: "当前每克价格",
    priceOptions: "价格选项",
    infoTitle: "价格信息",
    infoDesc:
      "价格仅供参考，将在创建订单时锁定。定期价格更新：现金（每 20 分钟），储蓄（每 24 小时，或在全球黄金市场 XAUUSD 发生重大波动时）。",
    modeSaving: "储蓄",
    modeCash: "现金",
    poe: {
      title: "黄金积累计划（GAP）",
      subtitle: "数字存储",
      desc: "起步 Rp 300,000",
    },
    perGram: {
      title: "每克价格",
      subtitle: "实物黄金",
      desc: "24K | 纯度 999.9",
    },
  },
  testimonials: {
    badge: "客户评价",
    title: "他们怎么说？",
    desc: "客户使用 Public Gold 的真实体验。",
    items: [
      {
        quote:
          "一个地方就能用3种方式买黄金：储蓄、现金或分期。没有乱七八糟的费用，分期也不需要首付，零利息，也没有滞纳金。感恩在望加锡有这样的服务。",
        name: "Andi Muhammad Hasbi",
        title: "客户，望加锡",
      },
      {
        quote:
          "通过GAP储蓄黄金，最低300,000印尼盾就能开始。攒够需要的克数后，直接到雅加达分行提取实物黄金。服务热情，非常专业，效率很高。最棒了！",
        name: "Cici Anggraeni",
        title: "客户，雅加达",
      },
      {
        quote:
          "办公环境舒适，员工友善，金条和金币库存充足。买金不用排队，回购也很快，价格透明。",
        name: "Icha Tarissa",
        title: "客户，万隆",
      },
      {
        quote:
          "感恩认识了Public Gold，让我终于懂得如何正确储蓄黄金。以前买了也不知道怎么管理。现在，储蓄黄金比乱花钱好多了。",
        name: "Andrianingsih Risa",
        title: "客户，望加锡",
      },
      {
        quote:
          "有了Public Gold，买黄金再也不用抢了，在家就能买，还能送货上门。很高兴能在PG储蓄。",
        name: "Praktik Mandiri Bidan Tenri Ajeng",
        title: "客户，望加锡",
      },
      {
        quote: "最值得信赖的黄金公司，价格合理，对长期投资非常有利。",
        name: "Risma Marisa",
        title: "客户，万隆",
      },
      {
        quote: "实物黄金兑换流程简便，库存充足无需等待。",
        name: "Ari Wibowo",
        title: "客户，万隆",
      },
      {
        quote:
          "Public Gold印尼望加锡分行的服务一直很棒。很喜欢在这里买黄金和金币。",
        name: "Kasmawati Abdullah",
        title: "客户，望加锡",
      },
    ],
  },
  faq: {
    badge: "常见问题",
    title: "常见问答",
    desc: "关于黄金投资的基础信息。",
    items: [
      {
        category: "价格与产品",
        ask: "数字黄金（GAP）和实物黄金有什么区别？",
        answer:
          "GAP 黄金以数字形式存储在您的账户中，并可随时转换为实物黄金；而实物黄金会直接交付给您。",
      },
      {
        category: "投资",
        ask: "黄金适合长期投资吗？",
        answer: "黄金通常作为保值资产，在长期内有助于维持购买力。",
      },
      {
        category: "购买",
        ask: "最低购买金额是多少？",
        answer: "您可以从较低金额开始，根据所选择的方式逐步购买。",
      },
      {
        category: "安全",
        ask: "我的黄金安全吗？",
        answer: "配送黄金均有保险保障，数字存储系统也具备完善的安全机制。",
      },
      {
        category: "出售",
        ask: "黄金可以轻松卖出吗？",
        answer: "可以，通过系统可快速完成回购流程。",
      },
      {
        category: "账户",
        ask: "如何开始？",
        answer:
          "<a href='/register' class='text-red-600 hover:underline font-medium'>注册账户</a>、完成验证，然后即可开始购买或储蓄黄金。",
      },
    ],
  },
  notFound: {
    title: "页面未找到",
    desc: "抱歉，您访问的页面可能已移动或不存在。",
    backHome: "返回首页",
    goBack: "返回",
  },
  registerForm: {
    titleDewasa: "成人账户注册",
    descDewasa: "立即注册，开启您在 Public Gold 的黄金财富之旅。",
    titleAnak: "青少年账户注册",
    descAnak: "为您孩子注册账户，开启他们的黄金储蓄之旅。",
    tabDewasa: "成人账户",
    tabAnak: "青少年账户",
    noteAnak:
      "备注：18岁以下儿童必须由父母或监护人陪同开户。孩子成年（18岁）后，账户可以转入其个人名下。",
    parentSectionTitle: "父母/监护人详情",
    nameLabelDewasa: "全名",
    nameLabelAnak: "孩子姓名",
    namePlaceholderDewasa: "请输入您的全名",
    namePlaceholderAnak: "请输入孩子姓名（须与身份证件一致）",
    idTypeLabel: "证件类型",
    idTypeKtp: "身份证 / 新IC",
    idTypePassport: "护照 / 外国身份证",
    icLabelDewasa: "身份证/护照号码",
    icLabelAnak: "孩子身份证/护照号码",
    icPlaceholderDewasa: "请输入您的身份证或护照号码",
    icPlaceholderAnak: "请输入孩子身份证或护照号码",
    npwpLabel: "税务 ID (NPWP)",
    npwpDesc: "（可选）",
    npwpPlaceholder: "如有，请输入 NPWP",
    dobLabelDewasa: "出生日期",
    dobLabelAnak: "孩子出生日期",
    emailLabel: "电子邮件",
    emailPlaceholder: "请输入您的电子邮件",
    parentNameLabel: "父母/监护人姓名",
    parentNamePlaceholder: "请输入父母姓名（须与身份证件一致）",
    parentIcLabel: "父母身份证/护照号码",
    parentIcPlaceholder: "请输入父母身份证号码",
    mobileLabelDewasa: "手机号码",
    mobileLabelAnak: "WhatsApp 号码",
    mobilePlaceholder: "8123456789",
    mobileWarning: "请不要在开头输入 0。",
    branchLabel: "首选分行",
    branchDesc: "选择您首选的分行地点",
    submitBtn: "提交",
    submittingBtn: "提交中...",
    termsText:
      "继续操作即表示我确认所提供的信息真实、准确且完整。我理解此申请须经 Public Gold 批准。我同意受公司章程、条款与条件以及隐私政策的约束。",
    termsLink: "隐私政策",
    successSkip: "跳过",
    validation: {
      nameRegex: "姓名只能包含字母、空格和点",
      icDigits: "此字段只能包含数字",
      mobileDigits: "手机号码只能包含数字",
      max20: "不能超过 20 个字符",
      required: "此字段是必填项",
      email: "电子邮件格式无效",
      dob: "出生日期是必填项",
      branch: "首选分行是必填项",
    },
    confirmTitle: "确认详情",
    confirmDesc: "在继续之前，请确保以下详情准确无误。",
    confirmDescAnak: "请确保孩子和父母/监护人的详情准确无误。",
    backBtn: "返回",
    confirmBtn: "确认",
    ageValidationTitle: "年龄验证",
    ageValidationToDewasa: "根据出生日期，此账户应为成人账户。",
    ageValidationToAnak: "根据出生日期，此账户应为少年账户。",
    ageValidationQuestion: "您想切换到",
    ageValidationSwitchBtn: "切换账户",
    ageValidationCancelBtn: "取消",
    successTitle: "注册成功！",
    successDesc: "您的账户已成功注册。请检查您的电子邮件以获取进一步说明。",
    successCta: "前往控制面板",
  },
};
