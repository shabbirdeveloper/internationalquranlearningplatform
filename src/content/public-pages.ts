import type { Locale } from "@/i18n/config";

export type Course = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  level: string;
  ageGroup: string;
  classType: string;
  duration: string;
  languages: string[];
  outcomes: string[];
  syllabus: string[];
  coverImage: string;
  detailImage: string;
  methodImage: string;
  overviewHeading: string;
  description: string;
  guidanceHeading: string;
  guidanceBody: string;
  audienceHeading: string;
  audienceBody: string;
  benefitsHeading: string;
  benefits: string[];
  methodHeading: string;
  methodBody: string;
};

const courseBlueprints = [
  ["quran-foundations", "Quran Foundations", "Learn Arabic letters, joining rules, and confident first reading.", "Quran", "Beginner", "Children", "One-to-one", "30 minutes"],
  ["quran-reading", "Quran Reading", "Build fluent, accurate recitation with patient live correction.", "Quran", "Intermediate", "All ages", "One-to-one", "30 minutes"],
  ["quran-with-tajweed", "Quran with Tajweed", "Apply practical Tajweed rules verse by verse.", "Quran", "Intermediate", "Teens & adults", "One-to-one", "45 minutes"],
  ["quran-memorization", "Quran Memorization", "Follow a realistic Hifz and revision plan.", "Quran", "All levels", "All ages", "One-to-one", "45 minutes"],
  ["quran-with-tafseer", "Quran with Tafseer", "Explore meaning, themes, and context with guided study.", "Quran", "Advanced", "Teens & adults", "One-to-one", "45 minutes"],
  ["nahjul-balagha", "Nahjul Balagha", "Study selected sermons, letters, wisdom, and their living lessons.", "Ahlul Bayt", "Intermediate", "Teens & adults", "Small group", "45 minutes"],
  ["sahifa-sajjadiya", "Sahifa Sajjadiya", "Understand the language, themes, and spiritual practice of the supplications.", "Ahlul Bayt", "Intermediate", "Teens & adults", "Small group", "45 minutes"],
  ["islamic-beliefs", "Islamic Beliefs", "Build a clear, age-appropriate foundation in Usul al-Din.", "Islamic Studies", "Beginner", "All ages", "One-to-one", "30 minutes"],
  ["shia-fiqh", "Shia Fiqh", "Learn everyday rulings with structured, practical guidance.", "Islamic Studies", "All levels", "Teens & adults", "One-to-one", "45 minutes"],
  ["akhlaq-character", "Akhlaq & Character", "Connect Islamic values to daily choices, habits, and relationships.", "Islamic Studies", "Beginner", "Children & teens", "Small group", "30 minutes"],
  ["seerah-prophet", "Seerah of the Prophet", "Journey through the life and mission of Prophet Muhammad (s).","History", "Beginner", "All ages", "Small group", "45 minutes"],
  ["lives-of-ahlul-bayt", "Lives of the Ahlul Bayt", "Study the lives, values, and enduring guidance of the Ahlul Bayt (a).","History", "All levels", "All ages", "Small group", "45 minutes"],
  ["arabic-for-quran", "Arabic for Quran", "Develop vocabulary and grammar for deeper Quran understanding.", "Language", "Beginner", "Teens & adults", "One-to-one", "45 minutes"],
  ["duas-ziyarat", "Duas & Ziyarat", "Learn accurate recitation, meaning, and devotional context.", "Devotional", "All levels", "All ages", "One-to-one", "30 minutes"],
  ["islamic-studies-children", "Islamic Studies for Children", "A warm, structured introduction to beliefs, worship, history, and manners.", "Islamic Studies", "Beginner", "Children", "One-to-one", "30 minutes"],
] as const;

const courseImages: Record<string, [string, string, string]> = {
  "quran-foundations": ["/images/hero-online-class.png", "/images/shia-taleem-hero-learning.png", "/images/shia-taleem-female-teacher.png"],
  "quran-reading": ["/images/shia-taleem-hero-learning.png", "/images/hero-online-class.png", "/images/shia-taleem-female-teacher.png"],
  "quran-with-tajweed": ["/images/shia-taleem-female-teacher.png", "/images/shia-taleem-hero-learning.png", "/images/hero-online-class.png"],
  "quran-memorization": ["/images/quran-trial-art.png", "/images/hero-online-class.png", "/images/shia-taleem-hero-learning.png"],
  "quran-with-tafseer": ["/images/shia-taleem-hero-learning.png", "/images/shia-taleem-female-teacher.png", "/images/hero-online-class.png"],
  "nahjul-balagha": ["/images/shia-taleem-female-teacher.png", "/images/hero-online-class.png", "/images/shia-taleem-hero-learning.png"],
  "sahifa-sajjadiya": ["/images/quran-trial-art.png", "/images/shia-taleem-hero-learning.png", "/images/shia-taleem-female-teacher.png"],
  "islamic-beliefs": ["/images/hero-online-class.png", "/images/shia-taleem-female-teacher.png", "/images/shia-taleem-hero-learning.png"],
  "shia-fiqh": ["/images/shia-taleem-female-teacher.png", "/images/hero-online-class.png", "/images/shia-taleem-hero-learning.png"],
  "akhlaq-character": ["/images/shia-taleem-hero-learning.png", "/images/shia-taleem-female-teacher.png", "/images/hero-online-class.png"],
  "seerah-prophet": ["/images/hero-online-class.png", "/images/shia-taleem-hero-learning.png", "/images/shia-taleem-female-teacher.png"],
  "lives-of-ahlul-bayt": ["/images/shia-taleem-hero-learning.png", "/images/hero-online-class.png", "/images/shia-taleem-female-teacher.png"],
  "arabic-for-quran": ["/images/shia-taleem-female-teacher.png", "/images/shia-taleem-hero-learning.png", "/images/hero-online-class.png"],
  "duas-ziyarat": ["/images/quran-trial-art.png", "/images/shia-taleem-hero-learning.png", "/images/hero-online-class.png"],
  "islamic-studies-children": ["/images/hero-online-class.png", "/images/shia-taleem-female-teacher.png", "/images/shia-taleem-hero-learning.png"],
};

type DetailCopy = Pick<Course, "overviewHeading" | "description" | "guidanceHeading" | "guidanceBody" | "audienceHeading" | "audienceBody" | "benefitsHeading" | "benefits" | "methodHeading" | "methodBody">;

function createDetailCopy(title: string, summary: string, ageGroup: string, classType: string): DetailCopy {
  return {
    overviewHeading: `Begin a focused journey through ${title}`,
    description: `${summary} This live course gives every learner a clear starting point, patient guidance, and a practical path toward confident progress. Lessons are adapted to the learner's current ability, pace, and long-term goals.`,
    guidanceHeading: `${classType} guidance with a caring specialist`,
    guidanceBody: `Each lesson is taught live, allowing the teacher to listen carefully, explain difficult ideas, correct mistakes respectfully, and adjust the lesson in the moment. Personal feedback and guided practice help learners build understanding without feeling rushed.`,
    audienceHeading: `Who should join ${title}?`,
    audienceBody: `This course is suitable for ${ageGroup.toLowerCase()} who want structured learning with a dependable teacher. Complete beginners can start with an assessment, while experienced learners can strengthen weak areas and continue from their present level.`,
    benefitsHeading: `Benefits of the ${title} course`,
    benefits: [
      "A private learning plan shaped around the learner's level and goals",
      "Patient live correction with time to ask questions and practise",
      "Flexible international scheduling for families in different time zones",
      "Regular revision and progress feedback to support steady improvement",
      "A respectful, secure online environment for children and adults",
    ],
    methodHeading: `A clear method for lasting progress in ${title}`,
    methodBody: `The program combines short explanations, teacher demonstration, guided practice, independent revision, and regular review. Each new milestone builds on what the learner can already do, so progress remains clear, achievable, and connected to everyday faith and practice.`,
  };
}

const detailOverrides: Record<string, Partial<DetailCopy>> = {
  "quran-memorization": {
    overviewHeading: "Begin your journey to preserve the words of Allah",
    description: "Build a strong, heartfelt connection with the Quran through a personal memorization plan designed for consistency, clarity, and spiritual growth. From the first lesson, the teacher considers the learner's pace, lifestyle, current memorization, and revision needs so every target remains steady and achievable.",
    guidanceHeading: "One-to-one guidance for Quran memorization",
    guidanceBody: "Every class gives the learner the teacher's full attention. The teacher listens to each passage, corrects recitation and Tajweed, identifies weak points, and recommends practical memorization techniques. Close guidance prevents small mistakes from becoming habits and helps the learner move forward with confidence.",
    audienceHeading: "Who should join the Quran Memorization course?",
    audienceBody: "The course welcomes complete beginners, learners returning after a break, and students who have already memorized portions of the Quran. Children, teenagers, and adults receive a curriculum matched to their pace, with realistic new-lesson and revision targets.",
    benefitsHeading: "Benefits of Quran memorization with Shia Taleem",
    benefits: [
      "Supportive teaching, encouragement, and regular revision sessions",
      "Integration of Shia duas, manners, and the ethics of the Ahlulbayt (a)",
      "Continuous progress tracking through weekly listening and review",
      "Private one-to-one learning suitable for children and adults",
      "A lifelong relationship with the Quran built on love and understanding",
    ],
    methodHeading: "Daily review and regular testing for strong retention",
    methodBody: "A balanced routine combines new memorization with structured revision. Short quizzes, listening checks, and teacher-led assessments reveal areas that need reinforcement, helping learners retain earlier passages while moving forward with accuracy and fluency.",
  },
  "duas-ziyarat": {
    overviewHeading: "Learn the language of devotion with understanding",
    description: "Develop confident recitation of selected duas and ziyarat while exploring their meaning, context, and spiritual lessons. The course connects accurate reading with reflection so learners can bring these treasured words into daily worship with greater presence.",
    guidanceHeading: "Live recitation, translation, and reflection",
    guidanceBody: "The teacher models each passage, listens to the learner, corrects pronunciation, and explains key words and themes in accessible language. Lessons make room for questions and connect the text with the teachings and example of the Ahlulbayt (a).",
    audienceHeading: "Who should join Duas & Ziyarat?",
    audienceBody: "This course suits children, teenagers, adults, new learners, and anyone who already recites but wants better pronunciation and deeper understanding. The starting text and pace are selected after a friendly level and goals review.",
    benefitsHeading: "What learners gain from Duas & Ziyarat",
    benefits: [
      "More accurate Arabic pronunciation and confident recitation",
      "Clear understanding of important vocabulary and central themes",
      "Historical and devotional context for selected texts",
      "A practical routine for reflection and regular recitation",
      "Personal guidance in a respectful one-to-one setting",
    ],
    methodHeading: "A balanced approach to recitation and meaning",
    methodBody: "Lessons move passage by passage through listening, repetition, correction, translation, and reflection. Revision is built into the plan so the learner retains both the words and their message, then confidently applies the learning in personal and family worship.",
  },
};

type CourseBlueprint = readonly [string, string, string, string, string, string, string, string];

function buildCourse([slug, title, summary, category, level, ageGroup, classType, duration]: CourseBlueprint): Course {
  const [coverImage, detailImage, methodImage] = courseImages[slug] ?? ["/images/hero-online-class.png", "/images/shia-taleem-hero-learning.png", "/images/shia-taleem-female-teacher.png"];
  const details = { ...createDetailCopy(title, summary, ageGroup, classType), ...detailOverrides[slug] };
  return {
    slug,
    title,
    summary,
    category,
    level,
    ageGroup,
    classType,
    duration,
    languages: ["English", "Urdu", "Arabic", "Farsi"],
    outcomes: [`Confident progress in ${title}`, "Live correction and personal teacher feedback", "A practical plan for revision and the next learning milestone"],
    syllabus: ["Level and goals assessment", "Teacher demonstration and guided learning", "Supported practice and revision", "Progress review and next-step planning"],
    coverImage,
    detailImage,
    methodImage,
    ...details,
  };
}

export const courses: Course[] = courseBlueprints.map(buildCourse);

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function list(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim());
  return items.length ? items : fallback;
}

export function courseFromDatabaseRow(row: Record<string, unknown>): Course | null {
  const slug = text(row.slug, "");
  const fallback = courses.find((course) => course.slug === slug);
  const title = text(row.title, fallback?.title ?? "");
  const summary = text(row.summary, fallback?.summary ?? "");
  const category = text(row.category, fallback?.category ?? "");
  const level = text(row.level, fallback?.level ?? "");
  const ageGroup = text(row.age_group, fallback?.ageGroup ?? "");
  const classType = text(row.class_type, fallback?.classType ?? "");
  const durationMinutes = typeof row.duration_minutes === "number" ? row.duration_minutes : Number.parseInt(String(row.duration_minutes ?? ""), 10);
  if (!slug || !title || !summary || !category || !level || !ageGroup || !classType || !Number.isFinite(durationMinutes)) return null;

  const base = fallback ?? {
    ...buildCourse([slug, title, summary, category, level, ageGroup, classType, `${durationMinutes} minutes`]),
  };
  return {
    ...base,
    slug,
    title,
    summary,
    category,
    level,
    ageGroup,
    classType,
    duration: `${durationMinutes} minutes`,
    languages: list(row.languages, base.languages),
    outcomes: list(row.outcomes, base.outcomes),
    syllabus: list(row.syllabus, base.syllabus),
    coverImage: text(row.cover_image_url, base.coverImage),
    detailImage: text(row.detail_image_url, base.detailImage),
    methodImage: text(row.method_image_url, base.methodImage),
    overviewHeading: text(row.overview_heading, base.overviewHeading),
    description: text(row.description, base.description),
    guidanceHeading: text(row.guidance_heading, base.guidanceHeading),
    guidanceBody: text(row.guidance_body, base.guidanceBody),
    audienceHeading: text(row.audience_heading, base.audienceHeading),
    audienceBody: text(row.audience_body, base.audienceBody),
    benefitsHeading: text(row.benefits_heading, base.benefitsHeading),
    benefits: list(row.benefits, base.benefits),
    methodHeading: text(row.method_heading, base.methodHeading),
    methodBody: text(row.method_body, base.methodBody),
  };
}

const en = {
  hero: {
    courses: ["Course marketplace", "Find the right learning path", "Explore structured Quran and Islamic studies programs for children, teens, and adults."],
    teachers: ["Teacher marketplace", "Learn with carefully reviewed tutors", "Search approved public profiles by subject, language, learner age, and availability."],
    how: ["Simple and supported", "How SHIA TALEEM works", "A clear journey from your first enquiry to consistent, visible learning."],
    pricing: ["Flexible learning plans", "Choose a rhythm that works", "Begin with a trial, then confirm a monthly plan around your goals and weekly schedule."],
    contact: ["We are here to help", "Contact SHIA TALEEM", "Ask about courses, admissions, scheduling, safeguarding, or your academy account."],
    tutor: ["Teach with purpose", "Apply to become a tutor", "Share your experience and availability. Every application is privately reviewed before any profile is published."],
    trial: ["Your first step", "Book a free live trial", "Tell us about the learner and we will arrange a suitable teacher, time, and starting level."],
  },
  labels: {
    search: "Search courses", category: "Category", level: "Level", age: "Age group", classType: "Class type", language: "Language", clear: "Clear filters", viewCourse: "View course", results: "courses found", all: "All", apply: "Apply as a tutor", noTeachers: "No public tutor profiles yet", noTeachersDescription: "Teacher profiles appear here only after academy verification and publication approval.", name: "Full name", email: "Email address", phone: "Phone / WhatsApp", country: "Country", timezone: "Time zone", learnerAge: "Learner age", preferredTeacher: "Teacher preference", goals: "Learning goals", schedule: "Preferred days and times", submit: "Submit request", submitting: "Submitting…", message: "Message", subject: "Subject", teachingSubjects: "Subjects you can teach", experience: "Teaching experience", qualifications: "Qualifications", languages: "Teaching languages", availability: "Weekly availability", biography: "Short professional biography", identity: "Identity document", certificate: "Qualification certificate", cv: "CV / résumé", files: "PDF, JPG or PNG · 5 MB maximum per file", success: "Request received", reference: "Your reference number is", error: "We could not save your request. Please review the form or try again.", unavailable: "Online submissions are not configured yet. Please contact the academy team.", customQuote: "Confirmed after your trial", choosePlan: "Book a trial", weekly: "classes each week", oneToOne: "Live one-to-one classes", feedback: "Teacher feedback", family: "Family progress visibility", flexible: "Agreed international schedule", currency: "Display currency", pricingNote: "Fees depend on lesson length, subject, teacher, and location. No payment is taken when you book a trial.", learnerJourney: "For learners and families", tutorJourney: "For teachers", outcomes: "What you will achieve", syllabus: "Program structure", bookCourseTrial: "Book a trial for this course", backCourses: "Back to all courses", notFound: "No courses match these filters." 
  },
  howLearner: ["Share the learner's goals", "Choose a course or ask for guidance", "Tell us your preferred schedule", "Meet a suitable tutor", "Attend a live trial lesson", "Review the recommended learning plan", "Confirm your weekly classes", "Learn with feedback and practice", "Follow progress and next milestones"],
  howTutor: ["Submit your private application", "Provide identity and qualification evidence", "Complete the academy screening", "Discuss subjects and learner groups", "Present a teaching demonstration", "Agree professional standards", "Set verified availability", "Receive approved learner matches", "Teach, report progress, and keep developing"],
  policy: {
    privacy: ["Privacy", "We collect only the information needed to respond to enquiries, arrange learning, operate accounts, and protect learners. Private application documents are restricted to authorized reviewers."],
    terms: ["Terms of service", "Lesson schedules, fees, cancellations, teacher matching, and account access are confirmed in writing before a paid plan begins."],
    safeguarding: ["Safeguarding", "Learner wellbeing, respectful conduct, verified teacher workflows, and appropriate family visibility guide academy operations. Raise any concern through the contact form and select Safeguarding."],
  },
};

export type PublicCopy = typeof en;

const ur: PublicCopy = {
  ...en,
  hero: {
    courses: ["کورس مارکیٹ", "اپنے لیے درست تعلیمی راستہ تلاش کریں", "بچوں، نوجوانوں اور بڑوں کے لیے منظم قرآن اور اسلامیات کے پروگرام دیکھیں۔"],
    teachers: ["اساتذہ", "جانچ شدہ اساتذہ کے ساتھ سیکھیں", "مضمون، زبان، عمر اور دستیابی کے مطابق منظور شدہ پروفائل تلاش کریں۔"],
    how: ["سادہ اور معاون", "SHIA TALEEM کیسے کام کرتا ہے", "پہلی درخواست سے باقاعدہ تعلیم اور واضح پیش رفت تک ایک صاف سفر۔"],
    pricing: ["لچکدار تعلیمی منصوبے", "اپنے لیے موزوں رفتار چنیں", "آزمائشی سبق سے آغاز کریں، پھر اہداف اور ہفتہ وار وقت کے مطابق ماہانہ منصوبہ طے کریں۔"],
    contact: ["ہم مدد کے لیے حاضر ہیں", "SHIA TALEEM سے رابطہ", "کورسز، داخلہ، اوقات، حفاظت یا اکاؤنٹ کے بارے میں سوال کریں۔"],
    tutor: ["مقصد کے ساتھ پڑھائیں", "استاد بننے کے لیے درخواست دیں", "اپنا تجربہ اور دستیابی بتائیں۔ ہر درخواست کی اشاعت سے پہلے نجی جانچ ہوتی ہے۔"],
    trial: ["پہلا قدم", "مفت براہ راست آزمائشی سبق بک کریں", "طالب علم کے بارے میں بتائیں، ہم موزوں استاد، وقت اور ابتدائی سطح طے کریں گے۔"],
  },
  labels: { ...en.labels, search: "کورس تلاش کریں", clear: "فلٹر ختم کریں", viewCourse: "کورس دیکھیں", all: "تمام", submit: "درخواست جمع کریں", submitting: "جمع ہو رہی ہے…", success: "درخواست موصول ہوگئی", reference: "آپ کا حوالہ نمبر ہے", error: "درخواست محفوظ نہیں ہوسکی۔ دوبارہ کوشش کریں۔", noTeachers: "ابھی کوئی عوامی استاد پروفائل نہیں", noTeachersDescription: "پروفائل صرف اکیڈمی کی تصدیق اور منظوری کے بعد دکھائے جاتے ہیں۔", customQuote: "آزمائشی سبق کے بعد تصدیق", choosePlan: "آزمائشی سبق بک کریں" },
};

const ar: PublicCopy = {
  ...en,
  hero: {
    courses: ["سوق الدورات", "اعثر على مسار التعلم المناسب", "استكشف برامج منظمة للقرآن والدراسات الإسلامية للأطفال واليافعين والبالغين."],
    teachers: ["المعلمون", "تعلّم مع معلمين تمت مراجعتهم بعناية", "ابحث في الملفات المعتمدة حسب المادة واللغة والعمر والتوفر."],
    how: ["بسيط ومدعوم", "كيف تعمل SHIA TALEEM", "رحلة واضحة من أول استفسار إلى تعلم منتظم وتقدم ظاهر."],
    pricing: ["خطط تعلم مرنة", "اختر الإيقاع المناسب", "ابدأ بحصة تجريبية ثم أكد خطة شهرية حسب أهدافك وجدولك الأسبوعي."],
    contact: ["نحن هنا للمساعدة", "تواصل مع SHIA TALEEM", "اسأل عن الدورات أو القبول أو المواعيد أو حماية الطلاب أو الحساب."],
    tutor: ["علّم بهدف", "قدّم طلبًا لتصبح معلماً", "شارك خبرتك وتوفرك. تتم مراجعة كل طلب بشكل خاص قبل نشر أي ملف."],
    trial: ["خطوتك الأولى", "احجز حصة تجريبية مباشرة مجانية", "أخبرنا عن الطالب وسنرتب معلماً ووقتاً ومستوى بداية مناسباً."],
  },
  labels: { ...en.labels, search: "ابحث في الدورات", clear: "مسح المرشحات", viewCourse: "عرض الدورة", all: "الكل", submit: "إرسال الطلب", submitting: "جارٍ الإرسال…", success: "تم استلام الطلب", reference: "رقم المرجع هو", error: "تعذر حفظ الطلب. يرجى المحاولة مرة أخرى.", noTeachers: "لا توجد ملفات معلمين عامة بعد", noTeachersDescription: "تظهر الملفات فقط بعد تحقق الأكاديمية والموافقة على النشر.", customQuote: "يؤكد بعد الحصة التجريبية", choosePlan: "احجز حصة تجريبية" },
};

const fa: PublicCopy = {
  ...en,
  hero: {
    courses: ["فهرست دوره‌ها", "مسیر آموزشی مناسب را پیدا کنید", "دوره‌های منظم قرآن و معارف اسلامی را برای کودکان، نوجوانان و بزرگسالان بررسی کنید."],
    teachers: ["اساتید", "با اساتید ارزیابی‌شده بیاموزید", "پروفایل‌های تأییدشده را بر اساس موضوع، زبان، سن دانش‌آموز و زمان آزاد جست‌وجو کنید."],
    how: ["ساده و همراه", "SHIA TALEEM چگونه کار می‌کند", "مسیری روشن از نخستین درخواست تا یادگیری منظم و پیشرفت قابل مشاهده."],
    pricing: ["برنامه‌های آموزشی منعطف", "ریتم مناسب خود را انتخاب کنید", "با جلسه آزمایشی آغاز کنید و سپس برنامه ماهانه را بر اساس اهداف و زمان‌بندی هفتگی خود تأیید کنید."],
    contact: ["برای کمک در کنار شما هستیم", "تماس با SHIA TALEEM", "درباره دوره‌ها، ثبت‌نام، زمان‌بندی، حفاظت از دانش‌آموزان یا حساب آکادمی پرسش کنید."],
    tutor: ["هدفمند تدریس کنید", "برای همکاری به‌عنوان استاد درخواست دهید", "تجربه و زمان‌های آزاد خود را معرفی کنید. هر درخواست پیش از انتشار پروفایل به‌صورت خصوصی بررسی می‌شود."],
    trial: ["نخستین گام شما", "جلسه آزمایشی زنده رایگان رزرو کنید", "درباره دانش‌آموز بگویید تا استاد، زمان و سطح شروع مناسب را هماهنگ کنیم."],
  },
  labels: {
    ...en.labels,
    search: "جست‌وجوی دوره‌ها", category: "دسته‌بندی", level: "سطح", age: "گروه سنی", classType: "نوع کلاس", language: "زبان", clear: "پاک کردن فیلترها", viewCourse: "مشاهده دوره", results: "دوره یافت شد", all: "همه", apply: "درخواست همکاری به‌عنوان استاد", noTeachers: "هنوز پروفایل عمومی استادی منتشر نشده است", noTeachersDescription: "پروفایل استاد تنها پس از بررسی و تأیید آکادمی منتشر می‌شود.", name: "نام کامل", email: "نشانی ایمیل", phone: "تلفن / واتس‌اپ", country: "کشور", timezone: "منطقه زمانی", learnerAge: "سن دانش‌آموز", preferredTeacher: "ترجیح استاد", goals: "اهداف یادگیری", schedule: "روزها و زمان‌های دلخواه", submit: "ارسال درخواست", submitting: "در حال ارسال…", message: "پیام", subject: "موضوع", teachingSubjects: "موضوعات قابل تدریس", experience: "تجربه تدریس", qualifications: "مدارک و صلاحیت‌ها", languages: "زبان‌های تدریس", availability: "زمان‌های آزاد هفتگی", biography: "زندگی‌نامه حرفه‌ای کوتاه", success: "درخواست دریافت شد", reference: "شماره پیگیری شما", error: "درخواست ذخیره نشد. فرم را بررسی کنید یا دوباره تلاش کنید.", unavailable: "ارسال آنلاین هنوز پیکربندی نشده است. با آکادمی تماس بگیرید.", customQuote: "پس از جلسه آزمایشی تأیید می‌شود", choosePlan: "رزرو جلسه آزمایشی", learnerJourney: "برای دانش‌آموزان و خانواده‌ها", tutorJourney: "برای اساتید", outcomes: "دستاوردهای دوره", syllabus: "ساختار برنامه", bookCourseTrial: "رزرو جلسه آزمایشی این دوره", backCourses: "بازگشت به همه دوره‌ها", notFound: "دوره‌ای مطابق این فیلترها یافت نشد.",
  },
  howLearner: ["اهداف دانش‌آموز را بیان کنید", "دوره‌ای انتخاب کنید یا راهنمایی بخواهید", "زمان‌بندی دلخواه را بگویید", "با استاد مناسب آشنا شوید", "در جلسه آزمایشی زنده شرکت کنید", "برنامه پیشنهادی را بررسی کنید", "کلاس‌های هفتگی را تأیید کنید", "با تمرین و بازخورد بیاموزید", "پیشرفت و گام‌های بعدی را دنبال کنید"],
  howTutor: ["درخواست خصوصی خود را ارسال کنید", "مدارک هویتی و تحصیلی ارائه دهید", "ارزیابی آکادمی را کامل کنید", "درباره موضوعات و گروه‌های سنی گفت‌وگو کنید", "نمونه تدریس ارائه دهید", "استانداردهای حرفه‌ای را بپذیرید", "زمان‌های آزاد تأییدشده را تعیین کنید", "دانش‌آموزان مناسب دریافت کنید", "تدریس کنید و پیشرفت را گزارش دهید"],
  policy: {
    privacy: ["حریم خصوصی", "ما تنها اطلاعات لازم برای پاسخ‌گویی، هماهنگی آموزش، مدیریت حساب‌ها و حفاظت از دانش‌آموزان را جمع‌آوری می‌کنیم."],
    terms: ["شرایط استفاده", "زمان‌بندی کلاس، شهریه، لغو، انتخاب استاد و دسترسی حساب پیش از آغاز برنامه پولی به‌صورت کتبی تأیید می‌شود."],
    safeguarding: ["حفاظت از دانش‌آموزان", "سلامت دانش‌آموز، رفتار محترمانه، بررسی استاد و دسترسی مناسب خانواده، راهنمای فعالیت‌های آکادمی است."],
  },
};

export function getPublicCopy(locale: Locale): PublicCopy {
  return locale === "ur" ? ur : locale === "ar" ? ar : locale === "fa" ? fa : en;
}
