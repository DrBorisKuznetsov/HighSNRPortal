# Структура портала (MVP версия)

Минимальный рабочий вариант (MVP) портала представляет собой статический сайт, объединяющий существующие материалы (каталог канала, готовые инструменты) и формирующий структуру для будущих разработок.

## Структура URL (Routing)

```text
/                         # Главный портал (Отдельный репозиторий)
├── /research             # Исследовательские направления
├── /tools                # Каталог инженерных инструментов
├── /tools/adc-enob-loss-calculator
├── /tools/capacitor-distortion-analyzer
├── /videos_project       # Каталог YouTube видео (Независимый репозиторий)
├── /publications         # Статьи, preprints, технические отчеты
├── /lab-notes            # Лабораторные заметки
├── /projects             # Открытые аппаратные и программные проекты
├── /courses              # Учебные курсы
├── /education-tools      # Стартовая страница Education Tools / HighSNR Circuit Builder
├── /about                # О лаборатории
├── /subscribe            # Подписка HighSNR Lab Notes
└── /consulting           # Engineering review / Work with Us
```

## Главная страница (Hero и Блоки)

Главная страница должна за 1-2 минуты объяснять суть проекта.

### Блок 1: Hero Section
- **Заголовок:** HighSNR Engineering Lab
- **Подзаголовок:** Research, tools, and education for real-world electronic signal chains.
- **Описание:** Миссия лаборатории — изучение потери качества сигнала в реальных электронных системах (нелинейность, паразитные эффекты, шумы). 
- **CTA Кнопки:** "Run Engineering Tools", "Read Research".

### Блок 2: Featured Tools
Карточки уже готовых инструментов:
- *Tool 1 (Например, ADC ENOB Loss Calculator)*
- *Tool 2 (Например, Capacitor Distortion Analyzer)*

### Блок 3: Research
Текущая тема:
- Capacitor Research

Внутри Research пока нет второго уровня. Страница `/research` сразу содержит основной текст про MLCC/конденсаторы и текущий фокус исследований.

### Остальные блоки MVP:
- **Latest Publications & Lab Notes:** Последние текстовые материалы.
- **Open Projects:** плоский реестр реальных hardware/software/measurement проектов.
- **About the Researcher:** Краткое интро лидера проекта.

## Интеграция с GitHub
На каждой странице (будь то инструмент или статья) должна присутствовать ссылка на исходный код, данные или GitHub Discussions для обсуждений.

## Критерии успеха MVP
- Посетитель сразу понимает, что это инженерная лаборатория, а не просто блог.
- Работают 2 готовых инструмента.
- Каталог канала доступен через структуру `/publications` или `/lab-notes`.
- Настроена форма подписки (собираются emails).

## Состояние реализации 2026-06-29

- MVP-карта маршрутов заведена в `portal/src/App.jsx`.
- Заглушки заменены на рабочие страницы-заготовки в `portal/src/pages/ContentPages.jsx`.
- Карточка ADC ведет на `/tools/adc-enob-loss-calculator`, откуда запускается отдельный симулятор.
- Карточка Capacitor Distortion Analyzer ведет на `/tools/capacitor-distortion-analyzer` как на tool brief до переноса полноценного инструмента.
- `/publications` использует компактный publication index и содержит первые DOI-записи engrXiv.
- `/projects` использует плоский project register, чтобы не создавать циклическую навигацию между разделами.
- `/about` содержит профиль автора, официальные ссылки, контактный email и методологию работы; карту портала и публикации не дублируем.
- Добавлена стартовая страница `/education-tools` для HighSNR Circuit Builder: краткое описание и запуск редактора в новой вкладке.
- Видео-каталог остается независимым приложением и открывается по прямой ссылке, а не через React Router портала.
