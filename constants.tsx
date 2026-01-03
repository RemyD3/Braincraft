
import { TestCategory, PsychologicalTest, PricingPlan, QuestionType } from './types';

export const PRICING_PLANS: PricingPlan[] = [
  { id: 'single', name: 'Single Module', priceUSD: 6.99, priceINR: 580, value: '1 Module', description: 'Deep diagnostic dive into a specific psychological domain.', billingPeriod: 'one-time' },
  { id: 'bundle5', name: 'Explorer Sync', priceUSD: 24.99, priceINR: 2070, value: '5 Modules', description: 'Unlock 5 high-impact tests for a comprehensive trait map.', billingPeriod: 'one-time' },
  { id: 'all_access', name: 'Mastery Pass', priceUSD: 69.99, priceINR: 5800, value: 'Full Access', description: 'Unrestricted access to the entire test library.', billingPeriod: 'monthly' },
  
  { 
    id: 'biz_start', 
    name: 'Team Starter', 
    priceUSD: 299, 
    priceINR: 25000, 
    value: 'Up to 20 Users', 
    description: 'Perfect for small teams building a mindful culture.', 
    billingPeriod: 'monthly',
    isBusiness: true,
    features: ['Admin Dashboard', 'Weekly Pulse Checks', 'Basic Reporting']
  },
  { 
    id: 'biz_growth', 
    name: 'Organization Pro', 
    priceUSD: 899, 
    priceINR: 75000, 
    value: 'Up to 100 Users', 
    description: 'Comprehensive analytics and full library access for growing companies.', 
    billingPeriod: 'monthly',
    isBusiness: true,
    features: ['Advanced Analytics', 'Department Segmentation', 'Priority Support', 'AI Coach for All Employees']
  }
];

// Helper to create clinical frequency scales
const createClinicalScale = (id: string, text: string, category: string) => ({
  id,
  text: `Over the last 2 weeks, how often have you been bothered by: ${text}`,
  type: 'scenario' as QuestionType,
  category,
  options: [
    { label: 'Not at all', value: 0 },
    { label: 'Several days', value: 1 },
    { label: 'More than half the days', value: 2 },
    { label: 'Nearly every day', value: 3 }
  ]
});

const createLikert = (id: string, text: string, category: string) => ({
  id, text, type: 'likert' as QuestionType, category, weight: 1
});

const createLogic = (id: string, text: string, options: {label: string, value: number}[]) => ({
  id, text, type: 'scenario' as QuestionType, category: 'Logic', options
});

export const ALL_TESTS: PsychologicalTest[] = [
  // 1. DEPRESSION (PHQ-9)
  {
    id: 'phq-9', 
    title: 'Clinical Depression Screen (PHQ-9)', 
    category: TestCategory.CLINICAL, 
    isPremium: false, 
    durationMinutes: 5,
    description: 'The Patient Health Questionnaire-9 is the gold standard for monitoring the severity of depression.',
    image: 'https://images.unsplash.com/photo-1617397757912-3269b2754668?q=80&w=800&auto=format&fit=crop',
    activities: [{title: 'Mood Journaling', duration: '5m', type: 'Journaling'}],
    questions: [
      createClinicalScale('phq-1', 'Little interest or pleasure in doing things?', 'Anhedonia'),
      createClinicalScale('phq-2', 'Feeling down, depressed, or hopeless?', 'Mood'),
      createClinicalScale('phq-3', 'Trouble falling or staying asleep, or sleeping too much?', 'Sleep'),
      createClinicalScale('phq-4', 'Feeling tired or having little energy?', 'Energy'),
      createClinicalScale('phq-5', 'Poor appetite or overeating?', 'Appetite'),
      createClinicalScale('phq-6', 'Feeling bad about yourself — or that you are a failure?', 'Self-Esteem'),
      createClinicalScale('phq-7', 'Trouble concentrating on things, like reading or watching TV?', 'Concentration'),
      createClinicalScale('phq-8', 'Moving or speaking so slowly that other people could have noticed?', 'Psychomotor'),
      createClinicalScale('phq-9', 'Thoughts that you would be better off dead?', 'Self-Harm')
    ]
  },

  // 2. ANXIETY (GAD-7)
  {
    id: 'gad-7', 
    title: 'General Anxiety Disorder (GAD-7)', 
    category: TestCategory.CLINICAL, 
    isPremium: false, 
    durationMinutes: 5,
    description: 'A scientifically validated screener for Generalized Anxiety Disorder and panic symptoms.',
    image: 'https://images.unsplash.com/photo-1620065287614-7284b3d8750a?q=80&w=800&auto=format&fit=crop',
    activities: [{title: 'Box Breathing', duration: '2m', type: 'Mental'}],
    questions: [
      createClinicalScale('gad-1', 'Feeling nervous, anxious, or on edge?', 'Nervousness'),
      createClinicalScale('gad-2', 'Not being able to stop or control worrying?', 'Control'),
      createClinicalScale('gad-3', 'Worrying too much about different things?', 'Worry'),
      createClinicalScale('gad-4', 'Trouble relaxing?', 'Relaxation'),
      createClinicalScale('gad-5', 'Being so restless that it is hard to sit still?', 'Restlessness'),
      createClinicalScale('gad-6', 'Becoming easily annoyed or irritable?', 'Irritability'),
      createClinicalScale('gad-7', 'Feeling afraid, as if something awful might happen?', 'Fear')
    ]
  },

  // 3. BURNOUT
  {
    id: 'stress-burnout',
    title: 'Professional Burnout Index',
    description: 'Assess your levels of emotional exhaustion, depersonalization, and personal accomplishment.',
    category: TestCategory.PROFESSIONAL,
    isPremium: true,
    durationMinutes: 10,
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop',
    activities: [{ title: 'Boundary Setting', duration: '10 min', type: 'Social' }],
    questions: [
        createLikert('burn-1', "I feel emotionally drained from my work.", 'Exhaustion'),
        createLikert('burn-2', "I feel used up at the end of the workday.", 'Exhaustion'),
        createLikert('burn-3', "I feel tired when I get up in the morning and have to face another day on the job.", 'Exhaustion'),
        createLikert('burn-4', "Working with people all day is really a strain for me.", 'Depersonalization'),
        createLikert('burn-5', "I feel burnt out from my work.", 'Exhaustion'),
        createLikert('burn-6', "I have become less enthusiastic about my work.", 'Cynicism'),
        createLikert('burn-7', "I have become more cynical about whether my work contributes anything.", 'Cynicism'),
        createLikert('burn-8', "I doubt the significance of my work.", 'Cynicism'),
        createLikert('burn-9', "I feel I am making an effective contribution to what this organization does.", 'Efficacy'),
        createLikert('burn-10', "In my opinion, I am good at my job.", 'Efficacy')
    ]
  },

  // 4. BIG FIVE (Personality)
  {
    id: 'big-five', 
    title: 'Big Five Personality Traits', 
    category: TestCategory.PERSONALITY, 
    isPremium: true, 
    durationMinutes: 15,
    description: 'The scientific standard for personality modeling. Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.',
    image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=800&auto=format&fit=crop',
    activities: [{ title: 'Strength Mapping', duration: '10 min', type: 'Journaling' }],
    questions: [
      createLikert('bf-1', "I am the life of the party.", 'Extraversion'),
      createLikert('bf-2', "I don't talk a lot.", 'Extraversion'),
      createLikert('bf-3', "I feel little concern for others.", 'Agreeableness'),
      createLikert('bf-4', "I sympathize with others' feelings.", 'Agreeableness'),
      createLikert('bf-5', "I get chores done right away.", 'Conscientiousness'),
      createLikert('bf-6', "I often forget to put things back in their proper place.", 'Conscientiousness'),
      createLikert('bf-7', "I have frequent mood swings.", 'Neuroticism'),
      createLikert('bf-8', "I am relaxed most of the time.", 'Neuroticism'),
      createLikert('bf-9', "I have a vivid imagination.", 'Openness'),
      createLikert('bf-10', "I am not interested in abstract ideas.", 'Openness')
    ]
  },

  // 5. EQ (Emotional Intelligence)
  {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence (EQ)',
    description: 'Quantify your ability to recognize, process, and regulate emotions with scenario-based logic.',
    category: TestCategory.WELLNESS,
    isPremium: true,
    durationMinutes: 15,
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop',
    activities: [{ title: 'Emotion Labeling', duration: '5 min', type: 'Journaling' }],
    questions: [
        createLikert('eq-1', "I know when to speak about my personal problems to others.", 'Self-Awareness'),
        createLikert('eq-2', "I expect that I will do well on most things I try.", 'Motivation'),
        {
          id: 'eq-scn-1',
          text: "A close friend cancels plans with you at the last minute for the third time in a row. How do you react?",
          type: 'scenario',
          category: 'Regulation',
          options: [
            { label: "Send an angry text immediately.", value: 1 },
            { label: "Ignore them for a week to teach them a lesson.", value: 2 },
            { label: "Feel hurt but ask if everything is okay.", value: 4 },
            { label: "Assume something serious came up and offer support.", value: 5 }
          ]
        },
        createLikert('eq-3', "When my mood changes, I see new possibilities.", 'Regulation'),
        createLikert('eq-4', "I can tell how people are feeling by listening to the tone of their voice.", 'Empathy'),
        createLikert('eq-5', "It is difficult for me to understand why people feel the way they do.", 'Empathy'),
        createLikert('eq-6', "I seek out activities that make me happy.", 'Self-Regulation')
    ]
  },

  // 6. ATTENTION & FOCUS
  {
    id: 'focus-attention',
    title: 'Deep Work & Focus Capacity',
    description: 'Evaluate your ability to maintain concentration in a distracted world.',
    category: TestCategory.COGNITIVE,
    isPremium: true,
    durationMinutes: 12,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    activities: [{ title: 'Pomodoro Timer', duration: '25m', type: 'Mental' }],
    questions: [
        createLikert('foc-1', "I find it difficult to focus on a single task for more than 15 minutes.", 'Sustained Attention'),
        createLikert('foc-2', "I often check my phone while watching a movie or TV show.", 'Dopamine Seeking'),
        createLikert('foc-3', "I can easily switch back to my work after an interruption.", 'Switching Cost'),
        createLikert('foc-4', "I often forget what I came into a room to get.", 'Working Memory'),
        createLikert('foc-5', "I struggle to listen when someone is speaking directly to me.", 'Auditory Attention'),
        createLikert('foc-6', "I procrastinate on tasks that require a lot of thinking.", 'Cognitive Load'),
        createLikert('foc-7', "I feel restless if I'm not doing something productive.", 'Restlessness'),
        createLikert('foc-8', "I can block out background noise when reading.", 'Selective Attention')
    ]
  },

  // 7. SLEEP HYGIENE
  {
    id: 'sleep-index',
    title: 'Sleep Hygiene Index',
    description: 'Analyze the behaviors and environmental factors affecting your sleep quality.',
    category: TestCategory.WELLNESS,
    isPremium: false,
    durationMinutes: 8,
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=800&auto=format&fit=crop',
    activities: [],
    questions: [
        createClinicalScale('slp-1', 'Taking more than 30 minutes to fall asleep?', 'Latency'),
        createClinicalScale('slp-2', 'Waking up early and not being able to get back to sleep?', 'Maintenance'),
        createClinicalScale('slp-3', 'Taking medicine (prescribed or over-the-counter) to help you sleep?', 'Medication'),
        createClinicalScale('slp-4', 'Trouble staying awake while driving, eating meals, or engaging in social activity?', 'Dysfunction'),
        createLikert('slp-5', 'I use my phone or computer in bed before sleeping.', 'Hygiene'),
        createLikert('slp-6', 'My bedroom is dark and quiet.', 'Environment')
    ]
  },

  // 8. LOGIC IQ (Raven's Style)
  {
    id: 'logic-iq',
    title: 'Abstract Logic & Reasoning',
    description: 'Test your fluid intelligence and pattern recognition skills.',
    category: TestCategory.COGNITIVE,
    isPremium: true,
    durationMinutes: 20,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    activities: [],
    questions: [
        createLogic('iq-1', 'Which number comes next: 2, 4, 8, 16, ...', [
            { label: '20', value: 0 }, { label: '24', value: 0 }, { label: '32', value: 5 }
        ]),
        createLogic('iq-2', 'If all BLOOPS are RAZZIES and all RAZZIES are ZUZUS, then...', [
            { label: 'All ZUZUS are BLOOPS', value: 0 },
            { label: 'All BLOOPS are ZUZUS', value: 5 },
            { label: 'No BLOOPS are ZUZUS', value: 0 }
        ]),
        createLogic('iq-3', 'Forest is to Tree as Ocean is to...', [
            { label: 'Water', value: 0 }, { label: 'Drop', value: 5 }, { label: 'Wave', value: 0 }
        ]),
        createLogic('iq-4', 'Identify the odd one out: Apple, Orange, Tennis Ball, Watermelon.', [
            { label: 'Apple', value: 0 }, { label: 'Tennis Ball', value: 5 }, { label: 'Watermelon', value: 0 }
        ]),
        createLogic('iq-5', 'If you rearrange the letters "CIFAIPC", you would have the name of a(n):', [
            { label: 'City', value: 0 }, { label: 'Animal', value: 0 }, { label: 'Ocean', value: 5 }
        ])
    ]
  },

  // 9. ADHD ADULT
  {
    id: 'adhd-adult',
    title: 'Adult ADHD Self-Report (ASRS)',
    description: 'Screening for symptoms of Attention Deficit Hyperactivity Disorder in adulthood.',
    category: TestCategory.CLINICAL,
    isPremium: true,
    durationMinutes: 5,
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop',
    activities: [],
    questions: [
        createClinicalScale('adhd-1', 'Trouble wrapping up the final details of a project, once the challenging parts have been done?', 'Completion'),
        createClinicalScale('adhd-2', 'Difficulty getting things in order when you have to do a task that requires organization?', 'Organization'),
        createClinicalScale('adhd-3', 'Problems remembering appointments or obligations?', 'Memory'),
        createClinicalScale('adhd-4', 'Avoid or delay getting started when you have a task that requires a lot of thought?', 'Avoidance'),
        createClinicalScale('adhd-5', 'Fidget or squirm with your hands or feet when you have to sit down for a long time?', 'Hyperactivity'),
        createClinicalScale('adhd-6', 'Feel overly active and compelled to do things, like you were driven by a motor?', 'Hyperactivity')
    ]
  },

  // 10. MBTI
  {
    id: 'career-mbti', 
    title: 'Jungian Type Indicator', 
    category: TestCategory.PERSONALITY, 
    isPremium: false, 
    durationMinutes: 10,
    description: 'Discover your cognitive processing style based on Jungian archetypes.',
    image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=800&auto=format&fit=crop',
    activities: [],
    questions: [
        createLikert('mb-1', 'I prefer planned events over spontaneous ones.', 'Judging'),
        createLikert('mb-2', 'I focus more on the big picture than the details.', 'Intuition'),
        createLikert('mb-3', 'I decide based on logic rather than feelings.', 'Thinking'),
        createLikert('mb-4', 'I get energy from being around people.', 'Extraversion'),
        createLikert('mb-5', 'I work better in a team than alone.', 'Extraversion'),
        createLikert('mb-6', 'I trust my gut experience over theories.', 'Sensing'),
        createLikert('mb-7', 'I value harmony over being right.', 'Feeling'),
        createLikert('mb-8', 'I like to keep my options open rather than committing.', 'Perceiving')
    ]
  }
];
