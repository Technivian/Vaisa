/**
 * All translatable UI chrome for the app — nav, headers, labels, badges,
 * buttons, disclaimers. Deliberately does NOT cover recorded content:
 * conversation transcripts/summaries/recommended actions, quality test
 * questions/expected/observed results, and knowledge-source citations
 * stay in their authored language, the same way a real transcript or
 * test record wouldn't be silently rewritten by a UI language toggle.
 */
const en = {
  shell: {
    workspace: "VONROC workspace",
    nav: {
      overview: "Overview",
      conversations: "Conversations",
      quality: "Quality",
      knowledge: "Knowledge",
    },
    openAssistant: "Open VAISA Assistant",
    assistantShort: "Assistant",
    demoEnvironment: "Demo environment",
    simulatedAnalytics: "Simulated analytics",
    conceptDisclaimer: "Concept demo — not an official VONROC system.",
  },

  assistantPanel: {
    title: "VAISA",
    subtitle: "Customer view",
    demoBadge: "Demo",
    closeLabel: "Close VAISA customer view",
  },

  chat: {
    greeting:
      "Hi! I'm the VONROC customer service assistant (demo). How can I help? You can also write to me in Dutch, German, or French.",
    placeholder: "Type your question...",
    disclaimer: "Demo environment — do not enter real personal or order information.",
    resetDemo: "Reset Demo",
    send: "Send",
    demoInfoLabel: "Demo info (for presenter)",
    demoOrderLabel: "Demo order",
    postcodeLabel: "Postcode",
    genericError: "Something went wrong. Please try again.",
    networkError: "Network error — please check your connection and try again.",
    escalationNotice: "Case {id} passed to a colleague",
  },

  quickActions: {
    orderStatus: "Where is my order?",
    returnItem: "I want to return something",
    machineNotWorking: "My machine isn't working",
    batteryQuestion: "Which battery do I need?",
  },

  home: {
    subtitle: "Customer Service",
    description: "AI Customer Service Concept Demo — Not an official VONROC system",
    dashboardLink: "Employee Dashboard →",
  },

  overview: {
    title: "Overview",
    description: "VAISA customer-service performance and activity.",
    periodOptions: {
      today: "Today",
      "7d": "Last 7 days",
      "30d": "Last 30 days",
    },
    agentOnline: "Agent online",
    kpi: {
      conversations: { label: "Conversations", supporting: "vs previous period" },
      aiResolution: { label: "AI resolution", supporting: "vs previous period" },
      humanEscalations: { label: "Human escalations", supporting: "vs previous period" },
      firstResponse: { label: "First response", supporting: "AI first response" },
    },
    performance: {
      title: "Performance",
      subtitle: "Simulated demo data — seven day trend",
      aiResolutionLegend: "AI resolution",
      humanEscalationLegend: "Human escalation",
      hoverHint: "Hover or tap a day",
      chartAriaLabel: "Seven day performance trend: AI resolution vs human escalation",
      dayAriaLabel: "{day}: {resolved}% resolved, {escalated}% escalated",
      days: { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" },
    },
    topTopics: {
      title: "Top topics",
      subtitle: "Simulated distribution of today's conversations",
      topIntentsLabel: "Top intents:",
      conversationsWord: "conversations",
      aiResolutionWord: "AI resolution",
    },
    topics: {
      orderDelivery: {
        label: "Order & delivery",
        topIntents: ["Order tracking", "Delivery expectation", "Carrier information"],
      },
      returns: {
        label: "Returns",
        topIntents: ["Return eligibility", "Refund timing", "Exchange policy"],
      },
      productAdvice: {
        label: "Product advice",
        topIntents: ["Battery compatibility", "Specifications", "Accessory fit"],
      },
      technicalSupport: {
        label: "Technical support",
        topIntents: ["Battery diagnostics", "Overheating", "Safety escalation"],
      },
      warranty: {
        label: "Warranty",
        topIntents: ["Eligibility check", "Proof of purchase", "Human review"],
      },
    },
    agentOutcomes: {
      title: "Agent outcomes",
      subtitle: "How VAISA handles customer contacts",
      resolvedAutomatically: "Resolved automatically",
      humanEscalation: "Human escalation",
      explanation: "Routine cases are automated. Safety, uncertainty and complex issues are escalated.",
    },
    recentConversations: {
      title: "Recent conversations",
      subtitle: "Latest VAISA interactions",
    },
  },

  conversations: {
    title: "Conversations",
    description: "Inspect how VAISA handled individual customer interactions.",
    panelTitle: "All conversations",
    shownCount: "{shown} of {total} shown",
    searchPlaceholder: "Search conversations...",
    filters: {
      outcome: "Outcome",
      language: "Language",
      topic: "Topic",
      all: "All",
      resolved: "Resolved",
      escalated: "Escalated",
    },
    noMatch: "No conversations match these filters.",
    detail: {
      conversationLabel: "Conversation",
      summaryLabel: "Summary",
      recommendedActionLabel: "Recommended action",
      takeCase: "Take case",
      inReview: "In review",
      customerLabel: "Customer",
      vaisaLabel: "VAISA",
      noTranscript: "No transcript captured.",
      resolvedByVaisa: "✓ Resolved by VAISA",
      noActionRequired: "No employee action required.",
      resolutionTime: "Resolution time: {time}",
      handoffLabel: "VAISA handoff",
      priorityLabel: "Priority",
      categoryLabel: "Category",
      languageLabel: "Language",
      viewActivity: "View VAISA activity",
      hideActivity: "Hide VAISA activity",
      viewKnowledge: "View knowledge used",
      hideKnowledge: "Hide knowledge used",
      illustrativeTrace: "Illustrative demo trace",
    },
    priorityPhrase: {
      high: "High priority",
      medium: "Medium priority",
      low: "Low priority",
    },
    priorityWord: {
      high: "High",
      medium: "Medium",
      low: "Low",
    },
    languageNames: {
      Dutch: "Dutch",
      German: "German",
      French: "French",
      English: "English",
    },
  },

  quality: {
    title: "Quality & Safety",
    description: "Validate critical VAISA behaviours before customer use.",
    readinessTitle: "Agent readiness",
    readinessSummary: "{n}/{n} critical scenarios passed — Ready for controlled demo",
    readinessDisclaimer: "Reflects this demo's test set, not production certification.",
    lastChecked: " Last checked {time}.",
    runChecks: "Run demo checks",
    runningChecks: "Running checks…",
    metrics: {
      grounding: "Grounding",
      toolBehaviour: "Tool behaviour",
      safety: "Safety",
      languagesSupported: "Languages supported",
    },
    scenariosTitle: "Scenarios",
    testQuestionLabel: "Test question",
    expectedBehaviourLabel: "Expected behaviour",
    observedResultLabel: "Observed result",
    passBadge: "Pass",
    scenarios: {
      "returns-policy": { name: "Returns policy", summary: "Grounded answer" },
      warranty: { name: "Warranty", summary: "Correct warranty figures" },
      "product-compatibility": { name: "Product compatibility", summary: "CD510DC concrete restriction" },
      "order-verification": { name: "Order verification", summary: "Postal code verification required" },
      multilingual: { name: "Multilingual", summary: "German interaction" },
      "safety-escalation": { name: "Safety escalation", summary: "Unsafe disassembly refused" },
    },
  },

  knowledge: {
    title: "Knowledge",
    description: "Verified information VAISA uses when answering customers.",
    healthTitle: "Knowledge health",
    healthy: "Healthy",
    verifiedSources: "Verified sources",
    productsCovered: "Products covered",
    knownConflicts: "Known source conflicts",
    coverageTitle: "Coverage",
    coverageAreas: {
      Orders: "Orders",
      Returns: "Returns",
      Warranty: "Warranty",
      "Product advice": "Product advice",
      Troubleshooting: "Troubleshooting",
      "Contact information": "Contact information",
    },
    coverageStatus: {
      Ready: "Ready",
      Limited: "Limited",
    },
    sourcesTitle: "Knowledge sources",
    verifiedBadge: "Verified",
    typeLabel: "Type",
    statusLabel: "Status",
    sourceLabel: "Source",
    usedForLabel: "Used for",
    keyFactsLabel: "Key facts",
    lastRetrieved: "Last retrieved {date} · {coverage}",
    sourceTypes: {
      Policy: "Policy",
      Product: "Product",
      Reference: "Reference",
    },
  },

  common: {
    status: {
      resolved: "Resolved",
      escalated: "Escalated",
      needsAttention: "Needs attention",
      sample: "Sample",
    },
    verifiedSource: "Verified source",
  },
};

const nl: typeof en = {
  shell: {
    workspace: "VONROC werkruimte",
    nav: {
      overview: "Overzicht",
      conversations: "Gesprekken",
      quality: "Kwaliteit",
      knowledge: "Kennis",
    },
    openAssistant: "Open VAISA-assistent",
    assistantShort: "Assistent",
    demoEnvironment: "Demo-omgeving",
    simulatedAnalytics: "Gesimuleerde analyses",
    conceptDisclaimer: "Conceptdemo — geen officieel VONROC-systeem.",
  },

  assistantPanel: {
    title: "VAISA",
    subtitle: "Klantweergave",
    demoBadge: "Demo",
    closeLabel: "Sluit VAISA-klantweergave",
  },

  chat: {
    greeting:
      "Hoi! Ik ben de VONROC klantenservice-assistent (demo). Waarmee kan ik je helpen? U kunt mij ook in het Engels, Duits of Frans schrijven.",
    placeholder: "Typ uw vraag...",
    disclaimer: "Demo-omgeving — vul geen echte persoonlijke gegevens of bestelgegevens in.",
    resetDemo: "Demo resetten",
    send: "Verzenden",
    demoInfoLabel: "Demo-info (voor presentator)",
    demoOrderLabel: "Demobestelling",
    postcodeLabel: "Postcode",
    genericError: "Er ging iets mis. Probeer het opnieuw.",
    networkError: "Netwerkfout — controleer uw verbinding en probeer het opnieuw.",
    escalationNotice: "Zaak {id} doorgezet naar een collega",
  },

  quickActions: {
    orderStatus: "Waar is mijn bestelling?",
    returnItem: "Ik wil iets retourneren",
    machineNotWorking: "Mijn machine werkt niet",
    batteryQuestion: "Welke accu heb ik nodig?",
  },

  home: {
    subtitle: "Klantenservice",
    description: "AI klantenservice conceptdemo — geen officieel VONROC-systeem",
    dashboardLink: "Medewerkersdashboard →",
  },

  overview: {
    title: "Overzicht",
    description: "VAISA klantenservice-prestaties en activiteit.",
    periodOptions: {
      today: "Vandaag",
      "7d": "Laatste 7 dagen",
      "30d": "Laatste 30 dagen",
    },
    agentOnline: "Assistent online",
    kpi: {
      conversations: { label: "Gesprekken", supporting: "t.o.v. vorige periode" },
      aiResolution: { label: "AI-oplossing", supporting: "t.o.v. vorige periode" },
      humanEscalations: { label: "Escalaties naar mens", supporting: "t.o.v. vorige periode" },
      firstResponse: { label: "Eerste reactie", supporting: "AI eerste reactie" },
    },
    performance: {
      title: "Prestaties",
      subtitle: "Gesimuleerde demodata — trend over zeven dagen",
      aiResolutionLegend: "AI-oplossing",
      humanEscalationLegend: "Escalatie naar mens",
      hoverHint: "Beweeg over of tik op een dag",
      chartAriaLabel: "Prestatietrend over zeven dagen: AI-oplossing versus escalatie naar mens",
      dayAriaLabel: "{day}: {resolved}% opgelost, {escalated}% geëscaleerd",
      days: { Mon: "Ma", Tue: "Di", Wed: "Wo", Thu: "Do", Fri: "Vr", Sat: "Za", Sun: "Zo" },
    },
    topTopics: {
      title: "Belangrijkste onderwerpen",
      subtitle: "Gesimuleerde verdeling van de gesprekken van vandaag",
      topIntentsLabel: "Belangrijkste intenties:",
      conversationsWord: "gesprekken",
      aiResolutionWord: "AI-oplossing",
    },
    topics: {
      orderDelivery: {
        label: "Bestelling & levering",
        topIntents: ["Orderstatus", "Leververwachting", "Vervoerdersinformatie"],
      },
      returns: {
        label: "Retouren",
        topIntents: ["Retourvoorwaarden", "Terugbetalingstermijn", "Ruilbeleid"],
      },
      productAdvice: {
        label: "Productadvies",
        topIntents: ["Accucompatibiliteit", "Specificaties", "Accessoirepassing"],
      },
      technicalSupport: {
        label: "Technische ondersteuning",
        topIntents: ["Accudiagnose", "Oververhitting", "Veiligheidsescalatie"],
      },
      warranty: {
        label: "Garantie",
        topIntents: ["Controle in aanmerking komen", "Aankoopbewijs", "Menselijke beoordeling"],
      },
    },
    agentOutcomes: {
      title: "Aanpak van gesprekken",
      subtitle: "Hoe VAISA klantcontacten afhandelt",
      resolvedAutomatically: "Automatisch opgelost",
      humanEscalation: "Escalatie naar mens",
      explanation:
        "Routinegevallen worden geautomatiseerd afgehandeld. Veiligheid, onzekerheid en complexe kwesties worden geëscaleerd.",
    },
    recentConversations: {
      title: "Recente gesprekken",
      subtitle: "Laatste VAISA-interacties",
    },
  },

  conversations: {
    title: "Gesprekken",
    description: "Bekijk hoe VAISA individuele klantgesprekken heeft afgehandeld.",
    panelTitle: "Alle gesprekken",
    shownCount: "{shown} van {total} getoond",
    searchPlaceholder: "Zoek gesprekken...",
    filters: {
      outcome: "Uitkomst",
      language: "Taal",
      topic: "Onderwerp",
      all: "Alle",
      resolved: "Opgelost",
      escalated: "Geëscaleerd",
    },
    noMatch: "Geen gesprekken komen overeen met deze filters.",
    detail: {
      conversationLabel: "Gesprek",
      summaryLabel: "Samenvatting",
      recommendedActionLabel: "Aanbevolen actie",
      takeCase: "Zaak overnemen",
      inReview: "In behandeling",
      customerLabel: "Klant",
      vaisaLabel: "VAISA",
      noTranscript: "Geen transcript vastgelegd.",
      resolvedByVaisa: "✓ Opgelost door VAISA",
      noActionRequired: "Geen actie van medewerker vereist.",
      resolutionTime: "Oplostijd: {time}",
      handoffLabel: "VAISA-overdracht",
      priorityLabel: "Prioriteit",
      categoryLabel: "Categorie",
      languageLabel: "Taal",
      viewActivity: "Bekijk VAISA-activiteit",
      hideActivity: "Verberg VAISA-activiteit",
      viewKnowledge: "Bekijk gebruikte kennis",
      hideKnowledge: "Verberg gebruikte kennis",
      illustrativeTrace: "Illustratief demovoorbeeld",
    },
    priorityPhrase: {
      high: "Hoge prioriteit",
      medium: "Gemiddelde prioriteit",
      low: "Lage prioriteit",
    },
    priorityWord: {
      high: "Hoog",
      medium: "Gemiddeld",
      low: "Laag",
    },
    languageNames: {
      Dutch: "Nederlands",
      German: "Duits",
      French: "Frans",
      English: "Engels",
    },
  },

  quality: {
    title: "Kwaliteit & veiligheid",
    description: "Valideer kritiek VAISA-gedrag vóór gebruik door klanten.",
    readinessTitle: "Gereedheid van de assistent",
    readinessSummary: "{n}/{n} kritieke scenario's geslaagd — Klaar voor gecontroleerde demo",
    readinessDisclaimer: "Weerspiegelt de testset van deze demo, geen productiecertificering.",
    lastChecked: " Laatst gecontroleerd om {time}.",
    runChecks: "Voer democontroles uit",
    runningChecks: "Controles worden uitgevoerd…",
    metrics: {
      grounding: "Onderbouwing",
      toolBehaviour: "Toolgedrag",
      safety: "Veiligheid",
      languagesSupported: "Ondersteunde talen",
    },
    scenariosTitle: "Scenario's",
    testQuestionLabel: "Testvraag",
    expectedBehaviourLabel: "Verwacht gedrag",
    observedResultLabel: "Waargenomen resultaat",
    passBadge: "Geslaagd",
    scenarios: {
      "returns-policy": { name: "Retourbeleid", summary: "Onderbouwd antwoord" },
      warranty: { name: "Garantie", summary: "Correcte garantiegegevens" },
      "product-compatibility": { name: "Productcompatibiliteit", summary: "CD510DC betonbeperking" },
      "order-verification": { name: "Orderverificatie", summary: "Postcodeverificatie vereist" },
      multilingual: { name: "Meertalig", summary: "Duits gesprek" },
      "safety-escalation": { name: "Veiligheidsescalatie", summary: "Onveilige demontage geweigerd" },
    },
  },

  knowledge: {
    title: "Kennis",
    description: "Geverifieerde informatie die VAISA gebruikt bij het beantwoorden van klanten.",
    healthTitle: "Status van de kennisbank",
    healthy: "Gezond",
    verifiedSources: "Geverifieerde bronnen",
    productsCovered: "Producten gedekt",
    knownConflicts: "Bekende bronconflicten",
    coverageTitle: "Dekking",
    coverageAreas: {
      Orders: "Bestellingen",
      Returns: "Retouren",
      Warranty: "Garantie",
      "Product advice": "Productadvies",
      Troubleshooting: "Probleemoplossing",
      "Contact information": "Contactgegevens",
    },
    coverageStatus: {
      Ready: "Gereed",
      Limited: "Beperkt",
    },
    sourcesTitle: "Kennisbronnen",
    verifiedBadge: "Geverifieerd",
    typeLabel: "Type",
    statusLabel: "Status",
    sourceLabel: "Bron",
    usedForLabel: "Gebruikt voor",
    keyFactsLabel: "Kerngegevens",
    lastRetrieved: "Laatst opgehaald {date} · {coverage}",
    sourceTypes: {
      Policy: "Beleid",
      Product: "Product",
      Reference: "Referentie",
    },
  },

  common: {
    status: {
      resolved: "Opgelost",
      escalated: "Geëscaleerd",
      needsAttention: "Vereist aandacht",
      sample: "Voorbeeld",
    },
    verifiedSource: "Geverifieerde bron",
  },
};

export const translations = { en, nl };
export type Locale = keyof typeof translations;
export type TranslationDict = typeof en;
