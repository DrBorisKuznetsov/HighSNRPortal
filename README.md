# HighSNR Engineering Lab

Корневая директория экосистемы HighSNR. Проект организован как multi-project workspace: главный портал, независимый видеокаталог, инженерные инструменты и wiki знаний развиваются отдельно, но связаны общей навигацией и архитектурными правилами.

## Структура

- `/portal` - основной сайт-хаб лаборатории на React + Vite.
- `/videos_project` - независимый каталог YouTube-видео на React + Vite.
- `/adc_tool` - ADC Input Stage Simulator с Python-ядром, PyScript/Pyodide фронтендом и отдельным сервером для локальной разработки.
- `/capacitor_filter_tool` - подготовленный standalone-проект для анализа влияния нелинейности конденсаторов на пассивные фильтры.
- `/wiki` - база знаний, архитектурные решения и журнал стабилизации в Markdown.
- `/.github/workflows` - базовая автоматическая проверка для будущего корневого репозитория.

Дневные журналы текущей стабилизации:

```text
wiki/09_Daily_Log_2026-06-29.md
wiki/10_Daily_Log_2026-06-30.md
wiki/11_Daily_Log_2026-07-01.md
wiki/12_Daily_Log_2026-07-02.md
```

## Локальный запуск

Каждый интерактивный подпроект запускается своим сервером:

1. **Главный портал** (`/portal`)

   ```bash
   cd portal
   npm install
   npm run dev
   # http://localhost:5173
   ```

2. **Видео-каталог** (`/videos_project`)

   ```bash
   cd videos_project
   npm install
   npm run dev
   # http://localhost:5174/videos_project/
   ```

3. **ADC Tool** (`/adc_tool`)

   ```bash
   cd adc_tool
   pip install -r requirements.txt
   python serve_app.py
   # http://localhost:8000
   ```

## Проверка проекта

Из корня workspace можно запустить общий smoke-check:

```bash
npm run check
```

Он выполняет:

- lint и production build для `portal`;
- lint и production build для `videos_project`;
- unit tests для `adc_tool`.

Та же логика оформлена в `.github/workflows/project-checks.yml` для будущего корневого GitHub-репозитория.

## Текущий статус

- [x] Создан главный портал и рабочая карта MVP-маршрутов.
- [x] Добавлены страницы `/research`, `/tools`, `/publications`, `/lab-notes`, `/projects`, `/courses`, `/about`, `/consulting`; старый `/subscribe` перенаправляет на `/lab-notes`.
- [x] Уточнены названия разделов в навигации: `Research` и `Articles & Papers`.
- [x] Верхнее меню сокращено до основных точек входа; `Lab Notes`, `Education Tools` и `Courses` доступны через связанные страницы.
- [x] Раздел `Articles & Papers` переведен в компактный publication index и заполнен DOI-записями engrXiv.
- [x] Раздел `Projects` упрощен до плоского реестра реальных проектов без циклической навигации по разделам портала.
- [x] Зафиксировано анти-граф правило: разделы остаются плоскими витринами, а связи между объектами делаются короткими related-ссылками.
- [x] Раздел `/about` расширен: профиль автора, официальные ссылки, контактный email и методология работы.
- [x] Каталог `/tools` стал основной страницей описания и запуска инструментов; старые адреса `/tools/adc-enob-loss-calculator` и `/tools/capacitor-distortion-analyzer` сохранены как редиректы на каталог.
- [x] Добавлена стартовая страница `/education-tools` для HighSNR Circuit Builder и будущих Education Tools.
- [x] Перенесен HighSNR Circuit Builder как standalone static app: `/education-tools/highsnr-circuit-builder/app/index.html`.
- [x] Проанализирован `D:\DS_Spectum\1.1V`; DSP PWM/PDM Spectrum Analyzer зафиксирован как кандидат в Engineering Tools и будущий веб-инструмент.
- [x] Подготовлен standalone-каркас `capacitor_filter_tool` для Passive Filter Distortion Analyzer: ТЗ, спецификация, архитектура, roadmap, agent brief и portal manifest.
- [x] Исправлена production-сборка `videos_project`.
- [x] Исправлены локальные/production-ссылки между порталом, видео-каталогом и ADC Tool.
- [x] Добавлена базовая автоматическая проверка проекта.
- [ ] Реализовать рабочий веб-MVP Passive Filter Distortion Analyzer на основе `capacitor_filter_tool`.
- [ ] Подключить newsletter/feedback формы и полноценные публикации из wiki/статей.

## Git-организация

На текущем этапе `adc_tool` уже является отдельным Git-репозиторием. Корень workspace подготовлен к роли будущего управляющего репозитория, но автоматическое преобразование структуры не выполнялось, чтобы не повредить существующую историю `adc_tool`.

Рекомендуемый следующий шаг: выбрать финальную модель хранения:

- единый monorepo с `portal`, `videos_project`, `wiki` и подключением `adc_tool` как submodule/subtree;
- или отдельные репозитории для каждого подпроекта с единым tracking-документом в `wiki`.
