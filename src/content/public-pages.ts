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

export const courses: Course[] = courseBlueprints.map(([slug, title, summary, category, level, ageGroup, classType, duration]) => ({
  slug,
  title,
  summary,
  category,
  level,
  ageGroup,
  classType,
  duration,
  languages: ["English", "Urdu", "Arabic"],
  outcomes: ["A plan matched to the learner's current level", "Live correction and teacher feedback", "A clear route to the next learning milestone"],
  syllabus: ["Level and goal assessment", "Guided live lessons", "Practice and revision", "Progress review"],
}));

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

export function getPublicCopy(locale: Locale): PublicCopy {
  return locale === "ur" ? ur : locale === "ar" ? ar : en;
}
