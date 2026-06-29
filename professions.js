/**
 * professions.js — расширенная база профессий (200+ позиций).
 *
 * Структура одной записи:
 *   {
 *     id:     число (уникальный ключ),
 *     title:  'Название профессии',
 *     sphere: 'it' | 'design' | 'business' | 'marketing' | 'science' | 'medicine' | 'public',
 *     mbti:   ['INTJ', 'INTP', ...] — упорядоченный список типов, для которых
 *             профессия подходит. Первая буква массива — самый точный мэтч,
 *             далее по убыванию. Используется алгоритмом в app.js.
 *     why:    'Короткое пояснение «почему подходит» — выводится под названием.'
 *   }
 *
 * Логика выдачи результата (см. app.js → renderProfessions):
 *   1. Из 200 профессий отбираются те, у которых код пользователя входит в mbti.
 *   2. Сортировка: совпадение по mbti[0] (primary) → mbti[1] (secondary) → …
 *   3. Первые 3 — «Ваше идеальное попадание (Топ-3)».
 *   4. Остальные группируются по 7 сферам и выводятся аккордеоном
 *      «Отличные альтернативы по сферам».
 *
 * Распределение по сферам (~200 профессий):
 *   it (35) · design (35) · business (30) · marketing (30)
 *   science (30) · medicine (25) · public (15)
 */

const SPHERES = {
  it:        { label: 'IT, Разработка и Данные',         icon: '💻', accent: 'oklch(60% 0.18 250)' },
  design:    { label: 'Дизайн, Искусство и Креатив',     icon: '🎨', accent: 'oklch(68% 0.17 350)' },
  business:  { label: 'Бизнес, Менеджмент и Финансы',    icon: '📈', accent: 'oklch(62% 0.16 30)'  },
  marketing: { label: 'Маркетинг, Медиа и Коммуникации', icon: '📣', accent: 'oklch(70% 0.16 70)'  },
  science:   { label: 'Наука, Инженерия и Технологии',   icon: '🔬', accent: 'oklch(60% 0.15 200)' },
  medicine:  { label: 'Медицина, Психология, Помощь',    icon: '🩺', accent: 'oklch(64% 0.15 150)' },
  public:    { label: 'Образование, Сервис и Право',     icon: '⚖️', accent: 'oklch(58% 0.13 100)' },
};

const PROFESSIONS = [
  // ════════════════════════════════════════════════════════════════════
  // 1. IT, РАЗРАБОТКА И ДАННЫЕ (35)
  // ════════════════════════════════════════════════════════════════════
  { id: 1,  title: 'Frontend-разработчик',          sphere: 'it', mbti: ['INTJ','INTP','ISTP','ENTP'], why: 'Сочетание визуальной логики и инженерии интерфейсов — ваша стихия.' },
  { id: 2,  title: 'Backend-разработчик',           sphere: 'it', mbti: ['INTJ','INTP','ISTJ','ISTP'], why: 'Архитектура серверов и баз данных требует системного мышления.' },
  { id: 3,  title: 'Fullstack-разработчик',         sphere: 'it', mbti: ['INTP','INTJ','ISTP','ENTP'], why: 'Широта технического кругозора и самостоятельность — ваши сильные стороны.' },
  { id: 4,  title: 'Mobile-разработчик (iOS/Android)', sphere: 'it', mbti: ['ISTP','INTP','INTJ','ESTP'], why: 'Практичность и внимание к деталям платформы дают качественный продукт.' },
  { id: 5,  title: 'GameDev-разработчик',           sphere: 'it', mbti: ['INTP','INFP','ENTP','ISFP'], why: 'Креатив, математика и любовь к деталям отлично работают в играх.' },
  { id: 6,  title: 'Разработчик нейросетей / AI',   sphere: 'it', mbti: ['INTJ','INTP','ENTP','INFJ'], why: 'Сложные системы и дальновидное мышление — ваша естественная игра.' },
  { id: 7,  title: 'DevOps-инженер',                sphere: 'it', mbti: ['ISTP','INTJ','ISTJ','ESTJ'], why: 'Автоматизация процессов и хладнокровие в инцидентах — ваши козыри.' },
  { id: 8,  title: 'Data Scientist',                sphere: 'it', mbti: ['INTP','INTJ','INFJ','ISTJ'], why: 'Поиск закономерностей в данных и построение моделей — ваша стихия.' },
  { id: 9,  title: 'Data Analyst',                  sphere: 'it', mbti: ['INTJ','ISTJ','INTP','INFJ'], why: 'Опора на факты и методичность дают точные, проверяемые выводы.' },
  { id: 10, title: 'Инженер баз данных',            sphere: 'it', mbti: ['ISTJ','INTJ','ISTP','INTP'], why: 'Структура, порядок и долговременная ответственность за данные.' },
  { id: 11, title: 'ML-инженер',                    sphere: 'it', mbti: ['INTP','INTJ','ENTP','ISTP'], why: 'Сочетание математики, инженерии и исследовательского любопытства.' },
  { id: 12, title: 'QA-инженер / Тестировщик',      sphere: 'it', mbti: ['ISTJ','ISTP','INTJ','ISFJ'], why: 'Внимание к деталям и системный подход превращают вас в надёжный фильтр.' },
  { id: 13, title: 'Системный администратор',       sphere: 'it', mbti: ['ISTP','ISTJ','INTJ','ESTJ'], why: 'Практическая смекалка и спокойствие в кризисе — основа профессии.' },
  { id: 14, title: 'Специалист по кибербезопасности', sphere: 'it', mbti: ['INTJ','ISTP','ISTJ','ENTP'], why: 'Превентивное мышление и умение находить уязвимости — ваш профиль.' },
  { id: 15, title: 'Системный архитектор / CTO',    sphere: 'it', mbti: ['INTJ','ENTJ','INTP','ISTJ'], why: 'Вы проектируете сложные системы и держите в голове всю картину.' },
  { id: 16, title: 'Технический писатель',          sphere: 'it', mbti: ['INTJ','INFJ','ISTJ','INFP'], why: 'Умение структурировать сложное и писать ясно — ваш плюс.' },
  { id: 17, title: 'Менеджер IT-продукта (PM)',     sphere: 'it', mbti: ['ENTJ','INTJ','ESTJ','ENTP'], why: 'Видение продукта и стратегическое мышление ведут команду к цели.' },
  { id: 18, title: 'Scrum-мастер',                  sphere: 'it', mbti: ['ENFJ','ESFJ','ENTP','ESTJ'], why: 'Фасилитация команды и забота о процессах — ваша сильная сторона.' },
  { id: 19, title: 'Технический саппорт (T3)',      sphere: 'it', mbti: ['ISTP','ISTJ','ESTP','INTJ'], why: 'Любовь к отладке и хладнокровие под давлением.' },
  { id: 20, title: 'Cloud-архитектор',              sphere: 'it', mbti: ['INTJ','ENTJ','ISTP','INTP'], why: 'Масштабное проектирование инфраструктуры требует стратегического ума.' },
  { id: 21, title: 'AR/VR-разработчик',             sphere: 'it', mbti: ['INTP','INFP','ENTP','ISFP'], why: 'Технологии будущего и креативный подход создают новые миры.' },
  { id: 22, title: 'Blockchain-разработчик',        sphere: 'it', mbti: ['INTP','INTJ','ENTP','ISTP'], why: 'Криптография, децентрализация и логика — ваша игра.' },
  { id: 23, title: 'Embedded-разработчик',          sphere: 'it', mbti: ['ISTP','ISTJ','INTJ','INTP'], why: 'Работа на стыке «железа» и кода требует точности и системы.' },
  { id: 24, title: 'BI-аналитик',                   sphere: 'it', mbti: ['INTJ','ISTJ','ENTJ','INTP'], why: 'Превращение данных в управленческие решения — ваше призвание.' },
  { id: 25, title: 'SRE-инженер',                   sphere: 'it', mbti: ['ISTP','INTJ','ESTJ','ISTJ'], why: 'Надёжность систем и инцидент-менеджмент требуют спокойствия и логики.' },
  { id: 26, title: 'Специалист по IoT',             sphere: 'it', mbti: ['INTP','ISTP','INTJ','ENTP'], why: 'Сеть устройств и интеграция сенсоров — новая инженерная задача.' },
  { id: 27, title: 'Разработчик чат-ботов',         sphere: 'it', mbti: ['ENTP','INTP','ENFP','INTJ'], why: 'Игривый ум и технические навыки рождают полезных ботов.' },
  { id: 28, title: 'Геймдизайнер (Game Designer)',  sphere: 'it', mbti: ['INFP','INTP','ENFP','ENTP'], why: 'Баланс механик и нарратива требует и логики, и воображения.' },
  { id: 29, title: 'Технический евангелист',        sphere: 'it', mbti: ['ENTP','ENFJ','ENTJ','INTP'], why: 'Распространение технологий требует харизмы и экспертизы.' },
  { id: 30, title: 'Специалист по Big Data',        sphere: 'it', mbti: ['INTJ','INTP','ISTJ','INFJ'], why: 'Масштаб данных и поиск инсайтов — идеальная задача для аналитика.' },
  { id: 31, title: 'Prompt-инженер (AI)',           sphere: 'it', mbti: ['INFP','ENTP','INTP','ENFP'], why: 'Лингвистическое творчество и работа с нейросетями — новая профессия.' },
  { id: 32, title: 'MLOps-инженер',                 sphere: 'it', mbti: ['INTJ','ISTP','INTP','ESTJ'], why: 'Девопс для машинного обучения — системная инженерия на стыке.' },
  { id: 33, title: 'Web3-разработчик',              sphere: 'it', mbti: ['INTP','ENTP','INTJ','ESTP'], why: 'Инновации, смелость и логика — основа децентрализованных систем.' },
  { id: 34, title: 'API-архитектор',                sphere: 'it', mbti: ['INTJ','INTP','ISTJ','ENTJ'], why: 'Проектирование контрактов между системами требует системности.' },
  { id: 35, title: 'Низкоуровневый программист (C/C++)', sphere: 'it', mbti: ['ISTP','INTJ','ISTJ','INTP'], why: 'Точность, производительность и понимание «внутренностей» — ваш профиль.' },

  // ════════════════════════════════════════════════════════════════════
  // 2. ДИЗАЙН, ИСКУССТВО И КРЕАТИВ (35)
  // ════════════════════════════════════════════════════════════════════
  { id: 36, title: 'UX/UI-дизайнер',                sphere: 'design', mbti: ['INFJ','INFP','ENFP','INTJ'], why: 'Эмпатия к пользователю и структурное мышление — основа UX.' },
  { id: 37, title: 'Веб-дизайнер',                  sphere: 'design', mbti: ['ISFP','ENFP','INFP','ESFP'], why: 'Эстетика и чувство баланса превращаются в красивые интерфейсы.' },
  { id: 38, title: 'Продуктовый дизайнер',          sphere: 'design', mbti: ['INTJ','INFJ','ENFP','ENTP'], why: 'Баланс бизнес-логики, эмпатии и эстетики — ваша стихия.' },
  { id: 39, title: 'Моушн-дизайнер',                sphere: 'design', mbti: ['ISFP','ENFP','ESFP','INFP'], why: 'Динамика и чувство ритма создают запоминающуюся анимацию.' },
  { id: 40, title: '3D-моделлер',                   sphere: 'design', mbti: ['ISFP','ISTP','INFP','INTP'], why: 'Пространственное мышление и терпение к деталям — ваши козыри.' },
  { id: 41, title: 'Иллюстратор',                   sphere: 'design', mbti: ['INFP','ISFP','INFJ','ENFP'], why: 'Воображение и чувство формы рождают уникальные образы.' },
  { id: 42, title: 'Режиссёр монтажа',              sphere: 'design', mbti: ['ISFP','ISTP','INFJ','INTJ'], why: 'Чувство ритма и структуры истории — основа монтажа.' },
  { id: 43, title: 'Саунд-дизайнер',                sphere: 'design', mbti: ['ISFP','INFP','ISTP','ENFP'], why: 'Тонкий слух и атмосферное мышление создают аудиомир проекта.' },
  { id: 44, title: 'Видеограф',                     sphere: 'design', mbti: ['ESFP','ESTP','ISFP','ENFP'], why: 'Динамика кадра и умение ловить момент — ваша стихия.' },
  { id: 45, title: 'Сценарист',                     sphere: 'design', mbti: ['INFP','INFJ','ENFP','INTP'], why: 'Слова и истории — ваш способ осмыслить мир.' },
  { id: 46, title: 'Архитектор',                    sphere: 'design', mbti: ['INTJ','INFJ','ISTJ','INFP'], why: 'Стратегическое мышление и чувство пространства создают долгоживущие формы.' },
  { id: 47, title: 'Дизайнер интерьеров',           sphere: 'design', mbti: ['ISFP','INFJ','ESFJ','ENFP'], why: 'Эстетика и забота о человеке превращают пространство в дом.' },
  { id: 48, title: 'Промышленный дизайнер',         sphere: 'design', mbti: ['ISTP','INTJ','ISFP','ENTP'], why: 'Инженерия + эстетика + функциональность — баланс трёх начал.' },
  { id: 49, title: 'Арт-директор',                  sphere: 'design', mbti: ['ENTP','ENFP','ENTJ','INTJ'], why: 'Видение сильного образа и лидерство в креативной команде.' },
  { id: 50, title: 'Графический дизайнер',          sphere: 'design', mbti: ['ISFP','INFP','ESFP','ENFP'], why: 'Чувство композиции и цвета рождает визуальный язык бренда.' },
  { id: 51, title: 'Бренд-дизайнер',                sphere: 'design', mbti: ['ENFP','ENTP','INFJ','ISFP'], why: 'Смыслы + визуал + эмоция создают узнаваемый бренд.' },
  { id: 52, title: 'Шрифтовой дизайнер',            sphere: 'design', mbti: ['ISTJ','INTJ','ISFP','INFP'], why: 'Точность к деталям и любовь к форме буквы — редкое сочетание.' },
  { id: 53, title: 'Фотограф',                      sphere: 'design', mbti: ['ISFP','ESTP','ESFP','INFP'], why: 'Вы ловите момент и передаёте настроение лучше слов.' },
  { id: 54, title: 'Художник',                      sphere: 'design', mbti: ['ISFP','INFP','INFJ','ENFP'], why: 'Внутренние миры легко превращаются в образы на холсте.' },
  { id: 55, title: 'Аниматор 2D/3D',                sphere: 'design', mbti: ['ISFP','INFP','ESFP','ENTP'], why: 'Динамика и наблюдательность за движением — основа анимации.' },
  { id: 56, title: 'Концепт-художник',              sphere: 'design', mbti: ['INFP','ISFP','INFJ','INTJ'], why: 'Воображение и проработка деталей создают миры ещё не существующего.' },
  { id: 57, title: 'Стилист',                       sphere: 'design', mbti: ['ESFP','ESTP','ISFP','ENFP'], why: 'Эстетика и внимание к человеку создают цельный образ.' },
  { id: 58, title: 'Визажист',                      sphere: 'design', mbti: ['ESFP','ESTP','ISFP','ENFJ'], why: 'Чувство цвета и работа с лицом — ваша творческая стихия.' },
  { id: 59, title: 'Декоратор',                     sphere: 'design', mbti: ['ESFP','ISFP','ENFP','ESFJ'], why: 'Эстетика и атмосфера превращают помещение в событие.' },
  { id: 60, title: 'Ландшафтный дизайнер',          sphere: 'design', mbti: ['ISFP','INFJ','ISTP','INFP'], why: 'Гармония и живой материал — ваша естественная стихия.' },
  { id: 61, title: 'Дизайнер упаковки',             sphere: 'design', mbti: ['ISFP','ENFP','ISTJ','ENTP'], why: 'Функциональность + эстетика + маркетинг в одном флаконе.' },
  { id: 62, title: 'Шоудизайнер (витрин)',          sphere: 'design', mbti: ['ESFP','ESTP','ENFP','ISFP'], why: 'Театральность и коммерческое чутьё создают продающие витрины.' },
  { id: 63, title: 'Гастрономический стилист',      sphere: 'design', mbti: ['ISFP','ESFP','INFP','ENFP'], why: 'Эстетика еды и визуальное чутьё рождают аппетитные кадры.' },
  { id: 64, title: 'Дизайнер ювелирных изделий',    sphere: 'design', mbti: ['ISFP','ISTP','INFP','INTJ'], why: 'Точность + эстетика + ремесло — тонкая инженерия красоты.' },
  { id: 65, title: 'Тату-мастер',                   sphere: 'design', mbti: ['ISFP','ESFP','ISTP','INFP'], why: 'Эстетика, ремесло и эмпатия к клиенту в одной профессии.' },
  { id: 66, title: 'Дизайнер персонажей',           sphere: 'design', mbti: ['INFP','ISFP','ENTP','INFJ'], why: 'Воображение + психология + анатомия создают живых героев.' },
  { id: 67, title: 'Креативный директор',           sphere: 'design', mbti: ['ENTP','ENTJ','ENFP','INTJ'], why: 'Поток идей превращается в смелые концепции под вашим руководством.' },
  { id: 68, title: 'AI-художник (генеративный)',    sphere: 'design', mbti: ['INFP','ENTP','ENFP','INTP'], why: 'Сотрудничество с нейросетями требует и креатива, и техники.' },
  { id: 69, title: 'Дизайнер интерфейсов AR',       sphere: 'design', mbti: ['INTJ','ENTP','INFP','ISTP'], why: 'Пространственное мышление + UX будущего — новая дисциплина.' },
  { id: 70, title: 'Каллиграф / леттеринг',         sphere: 'design', mbti: ['ISFP','ISTJ','INFP','INFJ'], why: 'Терпение, ритм и любовь к форме буквы — редкое ремесло.' },

  // ════════════════════════════════════════════════════════════════════
  // 3. БИЗНЕС, МЕНЕДЖМЕНТ И ФИНАНСЫ (30)
  // ════════════════════════════════════════════════════════════════════
  { id: 71, title: 'Продакт-менеджер',              sphere: 'business', mbti: ['INTJ','ENTJ','ENFP','ENTP'], why: 'Видение продукта и стратегическое мышление ведут команду к цели.' },
  { id: 72, title: 'Проджект-менеджер',             sphere: 'business', mbti: ['ESTJ','ENTJ','ISTJ','ESFJ'], why: 'Чёткость и дисциплина приводят проект к сроку.' },
  { id: 73, title: 'Scrum-мастер (Agile-coach)',    sphere: 'business', mbti: ['ENFJ','ESFJ','ENTP','ESTJ'], why: 'Фасилитация команды и забота о процессах — ваша сильная сторона.' },
  { id: 74, title: 'Операционный директор (COO)',   sphere: 'business', mbti: ['ESTJ','ENTJ','ISTJ','ESTP'], why: 'Вы выстраиваете процессы и держите всё под контролем.' },
  { id: 75, title: 'Финансовый аналитик',           sphere: 'business', mbti: ['INTJ','ISTJ','ENTJ','INTP'], why: 'Вы просчитываете сценарии и принимаете взвешенные ставки.' },
  { id: 76, title: 'Аудитор',                       sphere: 'business', mbti: ['ISTJ','INTJ','ESTJ','ISFJ'], why: 'Точность, дисциплина и любовь к порядку — основа этой профессии.' },
  { id: 77, title: 'Инвестиционный брокер',         sphere: 'business', mbti: ['ENTJ','ESTP','ENTP','INTJ'], why: 'Риск-аппетит и аналитика в одной динамичной роли.' },
  { id: 78, title: 'Риск-менеджер',                 sphere: 'business', mbti: ['INTJ','ISTJ','ESTJ','ENTJ'], why: 'Превентивное мышление и оценка сценариев — ваш профиль.' },
  { id: 79, title: 'Бизнес-трекер / Акселератор',   sphere: 'business', mbti: ['ENTJ','ESTJ','ENTP','ENFJ'], why: 'Дисциплина и драйв доводят стартапы до роста.' },
  { id: 80, title: 'HR-бизнес-партнер',             sphere: 'business', mbti: ['ENFJ','ESFJ','INFJ','ESTJ'], why: 'Связываете бизнес-цели с потребностями людей.' },
  { id: 81, title: 'IT-рекрутер',                   sphere: 'business', mbti: ['ENFJ','ESFJ','ENTP','ENFP'], why: 'Любопытство к людям и техническая эрудиция — ваша комбинация.' },
  { id: 82, title: 'Директор по логистике',         sphere: 'business', mbti: ['ESTJ','ISTJ','ENTJ','ESTP'], why: 'Вы превращаете хаос поставок в отлаженную систему.' },
  { id: 83, title: 'CEO / Генеральный директор',    sphere: 'business', mbti: ['ENTJ','INTJ','ESTJ','ENFJ'], why: 'Масштаб мышления и воля ведут компанию вперёд.' },
  { id: 84, title: 'Бизнес-консультант',            sphere: 'business', mbti: ['ENTJ','INTJ','ENTP','ESTJ'], why: 'Логика и решительность перестраивают бизнес-процессы.' },
  { id: 85, title: 'Управляющий партнёр',           sphere: 'business', mbti: ['ENTJ','ESTJ','INTJ','ENFJ'], why: 'Вы соединяете стратегию и людей ради роста.' },
  { id: 86, title: 'Директор по развитию',          sphere: 'business', mbti: ['ENTJ','ENFJ','ENTP','ESTP'], why: 'Вы видите цель и прокладываете к ней маршрут.' },
  { id: 87, title: 'Бухгалтер',                     sphere: 'business', mbti: ['ISTJ','ISFJ','ESTJ','INTJ'], why: 'Порядок в цифрах и регулярность — основа доверия.' },
  { id: 88, title: 'Налоговый консультант',         sphere: 'business', mbti: ['ISTJ','INTJ','ESTJ','ISFJ'], why: 'Знание норм и точность в деталях контрактной работы.' },
  { id: 89, title: 'Антикризисный менеджер',        sphere: 'business', mbti: ['ESTP','ENTJ','INTJ','ESTJ'], why: 'Хладнокровие и решительность спасают в острых ситуациях.' },
  { id: 90, title: 'Менеджер по продажам (B2B)',    sphere: 'business', mbti: ['ESTP','ENTJ','ESFJ','ENFJ'], why: 'Энергия и умение убеждать закрывают сделки.' },
  { id: 91, title: 'Account-менеджер',              sphere: 'business', mbti: ['ESFJ','ENFJ','ESTP','ENTP'], why: 'Забота о клиенте и структурность ведут к долгим отношениям.' },
  { id: 92, title: 'Pre-sales инженер',             sphere: 'business', mbti: ['ENTP','ENTJ','ENFP','INTJ'], why: 'Техническая экспертиза + коммуникабельность = рост продаж.' },
  { id: 93, title: 'Фаундер стартапа',              sphere: 'business', mbti: ['ENTP','ENTJ','ENFP','INTJ'], why: 'Энтузиазм заражает команду и инвесторов.' },
  { id: 94, title: 'Корпоративный тренер',          sphere: 'business', mbti: ['ENFJ','ESFJ','ENTP','ENFP'], why: 'Харизма и эмпатия мотивируют к росту.' },
  { id: 95, title: 'Talent-менеджер',               sphere: 'business', mbti: ['ENFJ','ESFJ','INFJ','ENTP'], why: 'Видите потенциал человека и помогаете раскрыться.' },
  { id: 96, title: 'Менеджер по закупкам',          sphere: 'business', mbti: ['ESTJ','ISTJ','ESFJ','ESTP'], why: 'Системность и торг — ваш двойной актив.' },
  { id: 97, title: 'Венчурный аналитик',            sphere: 'business', mbti: ['INTJ','ENTP','ENTJ','INTP'], why: 'Чутьё на идеи и риск-аппетит — ваше преимущество.' },
  { id: 98, title: 'CFO (финансовый директор)',     sphere: 'business', mbti: ['ENTJ','INTJ','ISTJ','ESTJ'], why: 'Стратегическое управление финансами требует воли и системы.' },
  { id: 99, title: 'Бизнес-аналитик',               sphere: 'business', mbti: ['INTJ','ISTJ','ENTJ','INTP'], why: 'Перевод бизнес-смыслов в требования — ваш инженерный ум.' },
  { id: 100, title: 'Директор по стратегии',        sphere: 'business', mbti: ['INTJ','ENTJ','INFJ','ENTP'], why: 'Дальновидность и логика превращают хаос в чёткий план.' },

  // ════════════════════════════════════════════════════════════════════
  // 4. МАРКЕТИНГ, МЕДИА И КОММУНИКАЦИИ (30)
  // ════════════════════════════════════════════════════════════════════
  { id: 101, title: 'Бренд-менеджер',               sphere: 'marketing', mbti: ['ENFP','ENTP','INFJ','ESFP'], why: 'Идеи и харизма создают сильные кампании и узнаваемость.' },
  { id: 102, title: 'Performance-маркетолог',       sphere: 'marketing', mbti: ['INTJ','ENTJ','ESTP','ISTJ'], why: 'Аналитика + ставка на результат = управляемые кампании.' },
  { id: 103, title: 'SEO-специалист',               sphere: 'marketing', mbti: ['INTJ','INTP','ISTJ','INFJ'], why: 'Системный подход к структуре интернета и терпение к данным.' },
  { id: 104, title: 'Таргетолог',                   sphere: 'marketing', mbti: ['ESTP','ENTP','INTJ','ESFP'], why: 'Динамика ставок и аналитика результатов — ваша стихия.' },
  { id: 105, title: 'PR-менеджер',                  sphere: 'marketing', mbti: ['ENFJ','ENFP','ENTP','ESFJ'], why: 'Чувство аудитории помогает выстраивать сильный образ.' },
  { id: 106, title: 'Копирайтер',                   sphere: 'marketing', mbti: ['INFP','ENFP','INFJ','ENTP'], why: 'Воображение и чувство слова рождают тексты с душой.' },
  { id: 107, title: 'Редактор',                     sphere: 'marketing', mbti: ['INFJ','INFP','ISTJ','ENFJ'], why: 'Структура текста и внимание к смыслам — основа профессии.' },
  { id: 108, title: 'Контент-мейкер',               sphere: 'marketing', mbti: ['ENFP','ESFP','INFP','ENTP'], why: 'Креатив и энергия создают контент, который смотрят.' },
  { id: 109, title: 'Продюсер подкастов/YouTube',   sphere: 'marketing', mbti: ['ENFP','ENTP','ESFP','ENFJ'], why: 'Координация команды + чувство тренда = рост шоу.' },
  { id: 110, title: 'SMM-специалист',               sphere: 'marketing', mbti: ['ESFP','ESTP','ENFP','ENTP'], why: 'Обаяние и живость отлично работают на камеру и аудиторию.' },
  { id: 111, title: 'Event-менеджер',               sphere: 'marketing', mbti: ['ESFP','ESTP','ENFJ','ESFJ'], why: 'Энергия и чувство момента создают яркие события.' },
  { id: 112, title: 'Email-маркетолог',             sphere: 'marketing', mbti: ['INFJ','INTJ','ENFP','ISTJ'], why: 'Сегментация + текст + аналитика в одном канале.' },
  { id: 113, title: 'CRM-маркетолог',               sphere: 'marketing', mbti: ['INTJ','INFJ','ESTJ','ISTJ'], why: 'Структура данных о клиенте + эмпатия к его пути.' },
  { id: 114, title: 'Продуктовый маркетолог (PMM)', sphere: 'marketing', mbti: ['ENTP','ENFP','INTJ','ENTJ'], why: 'Позиционирование + рынок + нарратив — стратегическая роль.' },
  { id: 115, title: 'Influence-маркетолог',         sphere: 'marketing', mbti: ['ENFP','ESFP','ENTP','ENFJ'], why: 'Управление блогерами и чувство тренда — ваша стихия.' },
  { id: 116, title: 'Креативный стратег',           sphere: 'marketing', mbti: ['ENTP','INTJ','ENFP','INFJ'], why: 'Генерация идей и логика находят новые ниши.' },
  { id: 117, title: 'Аналитик маркетинга',          sphere: 'marketing', mbti: ['INTJ','ISTJ','INTP','ENTJ'], why: 'Превращение метрик в решения — ваша аналитическая сила.' },
  { id: 118, title: 'Журналист',                    sphere: 'marketing', mbti: ['ENFP','ENTP','INFJ','INFP'], why: 'Любопытство и общительность открывают любые двери.' },
  { id: 119, title: 'Телеведущий / Подкастер',      sphere: 'marketing', mbti: ['ESFP','ENFP','ENTP','ENFJ'], why: 'Сцена и внимание публики раскрывают ваш талант.' },
  { id: 120, title: 'Модератор сообщества',         sphere: 'marketing', mbti: ['ENFJ','ESFJ','INFP','ENFP'], why: 'Забота об атмосфере и эмпатия к участникам — ваш профиль.' },
  { id: 121, title: 'Спикер-коуч (по медиа)',       sphere: 'marketing', mbti: ['ENFJ','ENTP','ENFP','ESFP'], why: 'Вы вдохновляете людей расти и пробовать новое.' },
  { id: 122, title: 'Комьюнити-менеджер',           sphere: 'marketing', mbti: ['ENFJ','ENFP','ESFJ','INFP'], why: 'Создание живой экосистемы вокруг бренда требует эмпатии.' },
  { id: 123, title: 'Технический копирайтер',       sphere: 'marketing', mbti: ['INTJ','INTP','INFJ','ISTJ'], why: 'Перевод сложного в простой текст — ваш инженерный язык.' },
  { id: 124, title: 'Дизайнер презентаций',         sphere: 'marketing', mbti: ['ISFP','ENFP','INFP','ENTP'], why: 'Визуальная логика + сторителлинг = продающие слайды.' },
  { id: 125, title: 'Пресс-секретарь',              sphere: 'marketing', mbti: ['ENFJ','ENTJ','ESFJ','ENTP'], why: 'Чёткость коммуникации и харизма под камерами — ваш актив.' },
  { id: 126, title: 'Специалист по исследованиям',  sphere: 'marketing', mbti: ['INFJ','INTJ','INFP','ISTJ'], why: 'Глубокое понимание людей через опросы и интервью.' },
  { id: 127, title: 'Лоббист / GR-специалист',      sphere: 'marketing', mbti: ['ENTJ','ENTP','ESTJ','ENFJ'], why: 'Дипломатия, аргументация и связи — основа профессии.' },
  { id: 128, title: 'Кризис-коммуникатор',          sphere: 'marketing', mbti: ['ENTJ','ENFJ','ESTP','INTJ'], why: 'Хладнокровие под давлением медиа — ваш козырь.' },
  { id: 129, title: 'Нейромаркетолог',              sphere: 'marketing', mbti: ['INFJ','INTJ','INFP','ENTP'], why: 'Сочетание науки о мозге и брендинга — передний край.' },
  { id: 130, title: 'Стрим-продюсер (Twitch/YT)',   sphere: 'marketing', mbti: ['ESFP','ESTP','ENTP','ENFP'], why: 'Live-динамика + техническая координация — ваша стихия.' },

  // ════════════════════════════════════════════════════════════════════
  // 5. НАУКА, ИНЖЕНЕРИЯ И ТЕХНОЛОГИИ (30)
  // ════════════════════════════════════════════════════════════════════
  { id: 131, title: 'Инженер-конструктор',          sphere: 'science', mbti: ['ISTJ','ISTP','INTJ','ESTJ'], why: 'Системный подход к чертежам и расчётам — ваш профиль.' },
  { id: 132, title: 'Робототехник',                 sphere: 'science', mbti: ['INTP','INTJ','ISTP','ENTP'], why: 'Механика + электроника + код — креативная инженерия.' },
  { id: 133, title: 'Инженер-энергетик',            sphere: 'science', mbti: ['ISTJ','ISTP','INTJ','ESTJ'], why: 'Дисциплина и ответственность за критическую инфраструктуру.' },
  { id: 134, title: 'Проектировщик умного дома',    sphere: 'science', mbti: ['ISTP','INTJ','ENTP','ISFP'], why: 'Интеграция систем и комфорт пользователя — ваша инженерия.' },
  { id: 135, title: 'Биоинформатик',                sphere: 'science', mbti: ['INTP','INTJ','INFJ','INFP'], why: 'Симбиоз биологии и данных требует глубокого аналитика.' },
  { id: 136, title: 'Генетик',                      sphere: 'science', mbti: ['INTJ','INTP','INFJ','ISTJ'], why: 'Точность и стратегическое мышление о будущем вида.' },
  { id: 137, title: 'Эколог',                       sphere: 'science', mbti: ['INFJ','INFP','ISFJ','ISTJ'], why: 'Забота о планете + системный анализ данных среды.' },
  { id: 138, title: 'Агротехнолог',                 sphere: 'science', mbti: ['ISTP','ISTJ','INTP','ISFP'], why: 'Практичность + данные + любовь к живым системам.' },
  { id: 139, title: 'Материаловед',                 sphere: 'science', mbti: ['INTP','INTJ','ISTJ','ISTP'], why: 'Исследование свойств веществ — терпеливая наука для аналитика.' },
  { id: 140, title: 'Учёный-исследователь',         sphere: 'science', mbti: ['INTJ','INTP','INFJ','INFP'], why: 'Любовь к глубоким идеям и независимость двигают науку.' },
  { id: 141, title: 'Астрофизик',                   sphere: 'science', mbti: ['INTP','INTJ','INFP','INFJ'], why: 'Масштаб Вселенной и абстрактные модели — ваша игра ума.' },
  { id: 142, title: 'Нанотехнолог',                 sphere: 'science', mbti: ['INTJ','INTP','ISTP','ISTJ'], why: 'Точность и инновации на грани физики и инженерии.' },
  { id: 143, title: 'Инженер-биомеханик',           sphere: 'science', mbti: ['INTP','ISTP','INTJ','INFJ'], why: 'Симбиоз живого и механики — инженерия будущего.' },
  { id: 144, title: 'Геолог',                       sphere: 'science', mbti: ['ISTP','ISTJ','INTJ','ISFP'], why: 'Полевая работа + анализ данных + наблюдательность.' },
  { id: 145, title: 'Метеоролог / Климатолог',      sphere: 'science', mbti: ['ISTJ','INTJ','INFJ','ISTP'], why: 'Анализ массивов данных + долгосрочное прогнозирование.' },
  { id: 146, title: 'Химик-исследователь',          sphere: 'science', mbti: ['INTP','INTJ','ISTJ','ISTP'], why: 'Точность эксперимента и любопытство к реакциям.' },
  { id: 147, title: 'Физик-теоретик',               sphere: 'science', mbti: ['INTP','INTJ','INFP','INFJ'], why: 'Абстрактные модели и любовь к фундаментальным вопросам.' },
  { id: 148, title: 'Инженер-оптик',                sphere: 'science', mbti: ['ISTP','INTJ','ISTJ','INTP'], why: 'Точность + физика + ремесло — узкая и глубокая ниша.' },
  { id: 149, title: 'Аэрокосмический инженер',      sphere: 'science', mbti: ['INTJ','ISTP','INTP','ESTJ'], why: 'Сложные системы, безопасность и стратегическое мышление.' },
  { id: 150, title: 'Инженер-биотехнолог',          sphere: 'science', mbti: ['INTJ','INTP','INFJ','INFP'], why: 'Симбиоз живых систем и инженерии — наука с миссией.' },
  { id: 151, title: 'Океанолог',                    sphere: 'science', mbti: ['INFJ','INFP','ISTP','INTP'], why: 'Любопытство к неизведанному + системный анализ среды.' },
  { id: 152, title: 'Археолог',                     sphere: 'science', mbti: ['ISTP','INFJ','INFP','ISTJ'], why: 'Полевая кропотливость + интерпретация находок.' },
  { id: 153, title: 'Инженер по возобн. энергии',   sphere: 'science', mbti: ['ISTP','INTJ','ISTJ','INFJ'], why: 'Техника + миссия устойчивости — работа со смыслом.' },
  { id: 154, title: 'Математик',                    sphere: 'science', mbti: ['INTP','INTJ','INFP','ISTJ'], why: 'Чистая абстракция и доказательства — ваша стихия.' },
  { id: 155, title: 'Инженер-гидролог',             sphere: 'science', mbti: ['ISTJ','ISTP','INTJ','INFJ'], why: 'Полевые измерения + моделирование водных систем.' },
  { id: 156, title: 'Специалист по квантовым вычислениям', sphere: 'science', mbti: ['INTP','INTJ','ENTP','INFJ'], why: 'Передний край физики и информатики — для визионеров.' },
  { id: 157, title: 'Инженер-строитель',            sphere: 'science', mbti: ['ISTJ','ESTJ','ISTP','INTJ'], why: 'Долговечность, расчёт и ответственность — основа профессии.' },
  { id: 158, title: 'Геофизик',                     sphere: 'science', mbti: ['ISTP','INTJ','ISTJ','INTP'], why: 'Полевая работа + физика земли + обработка данных.' },
  { id: 159, title: 'Лаборант-исследователь',       sphere: 'science', mbti: ['ISTJ','ISFJ','INTP','INTJ'], why: 'Точность, повторяемость и любовь к протоколу.' },
  { id: 160, title: 'Инженер по промышленной безопасности', sphere: 'science', mbti: ['ISTJ','ESTJ','INTJ','ISTP'], why: 'Превентивное мышление и системность — ваш профиль.' },

  // ════════════════════════════════════════════════════════════════════
  // 6. МЕДИЦИНА, ПСИХОЛОГИЯ И ПОМОЩЬ ЛЮДЯМ (25)
  // ════════════════════════════════════════════════════════════════════
  { id: 161, title: 'Хирург',                       sphere: 'medicine', mbti: ['ISTP','INTJ','ESTJ','ISTJ'], why: 'Точность, спокойствие и работа руками под давлением.' },
  { id: 162, title: 'Невролог',                     sphere: 'medicine', mbti: ['INTJ','INFJ','INTP','ISTJ'], why: 'Системный анализ сложнейшей системы — мозга.' },
  { id: 163, title: 'Фармацевт',                    sphere: 'medicine', mbti: ['ISTJ','ISFJ','INTJ','INFJ'], why: 'Точность в дозировках и ответственность за результат.' },
  { id: 164, title: 'Нутрициолог',                  sphere: 'medicine', mbti: ['ISFJ','ESFJ','INFJ','INFP'], why: 'Забота + системность + эмпатия к пациенту.' },
  { id: 165, title: 'Психотерапевт',                sphere: 'medicine', mbti: ['INFJ','INFP','ENFJ','ISFJ'], why: 'Глубокое понимание людей помогает вести их к изменениям.' },
  { id: 166, title: 'Корпоративный психолог',       sphere: 'medicine', mbti: ['ENFJ','INFJ','ENTP','ESFJ'], why: 'Связываете психологию и бизнес-задачи команды.' },
  { id: 167, title: 'Коуч',                         sphere: 'medicine', mbti: ['ENFJ','ENFP','INFJ','ENTP'], why: 'Видите потенциал человека и помогаете раскрыться.' },
  { id: 168, title: 'Профориентолог',               sphere: 'medicine', mbti: ['ENFJ','INFJ','INFP','ESFJ'], why: 'Помогаете людям найти путь — ваша эмпатия и стратегия.' },
  { id: 169, title: 'Реабилитолог',                 sphere: 'medicine', mbti: ['ISFJ','ESTP','ESFJ','ISTP'], why: 'Терпение + забота + практический подход — устойчивый результат.' },
  { id: 170, title: 'Фитнес-тренер',                sphere: 'medicine', mbti: ['ESTP','ESFP','ENFJ','ESFJ'], why: 'Драйв и практичность мотивируют клиента на результат.' },
  { id: 171, title: 'Спортивный врач',              sphere: 'medicine', mbti: ['ISTP','ESTJ','ISFJ','ESTP'], why: 'Хладнокровие + биомеханика + ответственность за атлета.' },
  { id: 172, title: 'Педиатр',                      sphere: 'medicine', mbti: ['ISFJ','ENFJ','ESFJ','INFJ'], why: 'Забота + тепло + внимание к деталям развития.' },
  { id: 173, title: 'Гериатр (пожилые)',            sphere: 'medicine', mbti: ['ISFJ','INFJ','ESFJ','INFP'], why: 'Терпение и эмпатия к пожилым — ваша тёплая сторона.' },
  { id: 174, title: 'Стоматолог',                   sphere: 'medicine', mbti: ['ISTP','ISTJ','INTJ','ISFJ'], why: 'Точность рук + системность + эстетика результата.' },
  { id: 175, title: 'Ветеринар',                    sphere: 'medicine', mbti: ['ISFJ','ISTP','INFP','INFJ'], why: 'Забота о тех, кто не может сказать + медицинская точность.' },
  { id: 176, title: 'Медсестра / Медбрат',          sphere: 'medicine', mbti: ['ISFJ','ESFJ','ENFJ','ESTP'], why: 'Сочетание заботы и практической помощи — ваша сильнейшая сторона.' },
  { id: 177, title: 'Акушер / Гинеколог',           sphere: 'medicine', mbti: ['ISFJ','ESFJ','ESTP','ENFJ'], why: 'Тепло + решительность + ответственность за две жизни.' },
  { id: 178, title: 'Психолог-консультант',         sphere: 'medicine', mbti: ['INFP','INFJ','ENFJ','ISFJ'], why: 'Эмпатия помогает людям услышать и понять себя.' },
  { id: 179, title: 'Кризис-психолог',              sphere: 'medicine', mbti: ['INFJ','ENFJ','ISFJ','ENTP'], why: 'Хладнокровие + эмпатия в острых ситуациях — редкое сочетание.' },
  { id: 180, title: 'Арт-терапевт',                 sphere: 'medicine', mbti: ['INFP','ISFP','INFJ','ENFP'], why: 'Творчество + психология — мягкий путь к исцелению.' },
  { id: 181, title: 'Логопед',                      sphere: 'medicine', mbti: ['ISFJ','ESFJ','INFJ','ISTJ'], why: 'Терпение + системность + забота о развитии речи.' },
  { id: 182, title: 'Эрготерапевт',                 sphere: 'medicine', mbti: ['ISFJ','ENFJ','ISTP','ESFJ'], why: 'Адаптация быта под человека — эмпатия + инженерия.' },
  { id: 183, title: 'Массажист / Физиотерапевт',    sphere: 'medicine', mbti: ['ISFP','ISTP','ESFP','ISFJ'], why: 'Ремесло рук + знание тела + забота о пациенте.' },
  { id: 184, title: 'Специалист по паллиативу',     sphere: 'medicine', mbti: ['INFJ','ISFJ','INFP','ENFJ'], why: 'Глубокая эмпатия и достоинство в финале жизни.' },
  { id: 185, title: 'Сексолог',                     sphere: 'medicine', mbti: ['INFJ','ENFJ','INFP','ENTP'], why: 'Эмпатия + деликатность + биомедицинские знания.' },

  // ════════════════════════════════════════════════════════════════════
  // 7. ОБРАЗОВАНИЕ, СЕРВИС И ПРАВО (15)
  // ════════════════════════════════════════════════════════════════════
  { id: 186, title: 'Юрист-международник',          sphere: 'public', mbti: ['INTJ','ENTJ','INFJ','ESTJ'], why: 'Уважение к правилам и стратегическое мышление на глобальной арене.' },
  { id: 187, title: 'Корпоративный юрист',          sphere: 'public', mbti: ['ISTJ','INTJ','ESTJ','ENTJ'], why: 'Системное мышление и точность помогают в нормах.' },
  { id: 188, title: 'Нотариус',                     sphere: 'public', mbti: ['ISTJ','ISFJ','ESTJ','INTJ'], why: 'Порядок, точность и доверие — основа профессии.' },
  { id: 189, title: 'Педагог-новатор',              sphere: 'public', mbti: ['ENFP','ENFJ','INFP','ENTP'], why: 'Вы зажигаете интерес к смыслам и идеям.' },
  { id: 190, title: 'Методист онлайн-курсов (EdTech)', sphere: 'public', mbti: ['INFJ','INTJ','ENFJ','INFP'], why: 'Структура знаний + эмпатия к ученику = сильный курс.' },
  { id: 191, title: 'Репетитор',                    sphere: 'public', mbti: ['INFJ','ENFJ','ISTJ','INFP'], why: 'Глубокое внимание к ученику и терпение дают результат.' },
  { id: 192, title: 'Переводчик',                   sphere: 'public', mbti: ['INFJ','INFP','INTJ','ISFJ'], why: 'Чувство языка и любовь к культуре — ваш двойной актив.' },
  { id: 193, title: 'Гид-экскурсовод',              sphere: 'public', mbti: ['ESFP','ESTP','ENFP','ENFJ'], why: 'Энергия + знания + умение держать аудиторию.' },
  { id: 194, title: 'Консьерж / Персонал отеля',    sphere: 'public', mbti: ['ESFJ','ISFJ','ENFJ','ESFP'], why: 'Забота о людях и организованность создают атмосферу гостеприимства.' },
  { id: 195, title: 'Дипломат',                     sphere: 'public', mbti: ['INFJ','ENFJ','ENTJ','INTJ'], why: 'Такт + стратегия + языки — ваша комплексная роль.' },
  { id: 196, title: 'Социальный работник',          sphere: 'public', mbti: ['ISFJ','INFJ','ENFJ','INFP'], why: 'Вы искренне вникаете в проблемы людей и доводите помощь до конца.' },
  { id: 197, title: 'Библиотекарь / Архивариус',    sphere: 'public', mbti: ['ISTJ','ISFJ','INTJ','INFJ'], why: 'Любовь к порядку знаний и тихая системность.' },
  { id: 198, title: 'Медиатор (конфликты)',         sphere: 'public', mbti: ['ENFJ','INFJ','ENTP','ESFJ'], why: 'Гармония в отношениях + аргументация = разрешение споров.' },
  { id: 199, title: 'Преподаватель вуза',           sphere: 'public', mbti: ['INTJ','INFJ','ENTP','ENFJ'], why: 'Глубина знаний + умение зажигать мыслью.' },
  { id: 200, title: 'Школьный учитель',             sphere: 'public', mbti: ['ESFJ','ENFJ','ISFJ','INFJ'], why: 'Сочетание заботы и порядка идеально для школы.' },
  { id: 201, title: 'Госслужащий-управленец',       sphere: 'public', mbti: ['ESTJ','ISTJ','ENTJ','ESFJ'], why: 'Уважение к структуре и порядку — ваша основа.' },
  { id: 202, title: 'Таможенный инспектор',         sphere: 'public', mbti: ['ISTJ','ESTJ','ISTP','ISFJ'], why: 'Внимание к деталям и следование правилам.' },
  { id: 203, title: 'Администратор клиники/отеля',  sphere: 'public', mbti: ['ESFJ','ESTJ','ENFJ','ISFJ'], why: 'Вы создаёте атмосферу, где о людях позаботились.' },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PROFESSIONS, SPHERES };
}
