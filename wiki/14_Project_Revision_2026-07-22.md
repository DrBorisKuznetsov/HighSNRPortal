# Project Revision 2026-07-22

Полная ревизия workspace HighSNR Lab после сопоставления текущей реализации, README/wiki, подпроектов и CI/CD.

## Краткое заключение

Проект находится в рабочем состоянии: общий `npm run check` проходит, главный портал, видеокаталог, ADC tool и Passive Filter Distortion Analyzer собираются или тестируются. Основная проблема сейчас не в коде, а в расхождении между живой реализацией и документами разных дат.

Главный риск перед публичными анонсами: часть документации описывает старую структуру (`/projects`, `/consulting`, отдельный Git у `adc_tool`), а текущий код уже использует другую навигацию (`/design-review`, без `/projects`) и фактически живет как корневой Git-workspace.

## Область проверки

Проверены:

- `README.md`;
- `wiki/00_Architecture.md`;
- `wiki/01_Portal_MVP.md`;
- `wiki/02_Project_Research_and_Notes.md`;
- `wiki/03_Project_Tools.md`;
- `wiki/04_Project_Hardware_Software.md`;
- `wiki/05_Project_Courses.md`;
- `wiki/06_Project_Videos.md`;
- `wiki/07_Stabilization_and_Operations.md`;
- `wiki/08_Education_Tools.md`;
- дневные журналы `wiki/09...13`;
- `wiki/research/2026-07-16-mlcc-research-directions.md`;
- публичная копия `portal/public/research/mlcc-research-directions-2026-07-16.md`;
- `portal/src/App.jsx`, `Header.jsx`, основные страницы портала;
- `portal`, `videos_project`, `adc_tool`, `capacitor_filter_tool`;
- `.github/workflows/project-checks.yml`, `deploy.yml`, `deploy-tools.yml`.

## Фактическое состояние реализации

Текущие маршруты портала в `portal/src/App.jsx`:

```text
/
/research
/research/adc-front-end-modeling -> /research
/research/nonlinear-passive-components -> /research
/tools
/tools/adc-enob-loss-calculator -> /tools
/tools/capacitor-distortion-analyzer -> /tools
/tools/capacitor-distortion -> /tools
/publications
/lab-notes
/courses
/education-tools
/education-tools/highsnr-circuit-builder -> /education-tools
/about
/subscribe -> /lab-notes
/design-review
```

Текущее верхнее меню:

```text
Research
Tools
Articles & Papers
Videos
Design Review
About
```

Текущая Git-реальность:

- корень workspace является Git-репозиторием;
- `adc_tool/.git` в текущей структуре отсутствует;
- `adc_tool` отслеживается корневым репозиторием как обычная папка.

## Что хорошо согласовано

1. `Research` теперь соответствует принятому решению: одна тема `Capacitor Research`, без второго уровня `MLCC Physics`, `ADC Modeling`, `Front-End Modeling` и т.п.
2. `Articles & Papers` стал компактным библиографическим разделом, что лучше подходит публикациям, чем крупные карточки.
3. `/tools` стал главным каталогом описания и запуска инструментов; пустые `Model Page` фактически убраны через редиректы.
4. `Education Tools` отделен от инженерных расчетных инструментов, и HighSNR Circuit Builder размещен логично.
5. `capacitor_filter_tool` развивается как самостоятельный инструмент для `filters.highsnr.org`, что соответствует принятой архитектуре.
6. CI/CD уже охватывает portal, videos, ADC и capacitor tool.

## Основные несоответствия

### 1. Навигация: документы говорят `/projects` и `/consulting`, код говорит `/design-review`

`README.md`, `wiki/00_Architecture.md`, `wiki/01_Portal_MVP.md`, `wiki/04_Project_Hardware_Software.md`, `wiki/07_Stabilization_and_Operations.md` все еще описывают `/projects` как действующий раздел и `/consulting` как route.

Фактически в `portal/src/App.jsx` маршрута `/projects` нет, а `/consulting` заменен на `/design-review`.

Риск: пользователь или поисковая система попадет на страницу, которую документация считает существующей, но портал покажет `Page Not Found`.

Рекомендация: принять одно решение и синхронизировать документы. Наиболее практичный вариант:

- оставить `Design Review` в меню;
- добавить legacy redirect `/consulting -> /design-review`;
- решить судьбу `/projects`: либо вернуть плоский реестр вне меню, либо официально удалить концепцию Open Projects из живых документов.

### 2. `deploy.yml` содержит старые публичные entrypoints и не содержит `/design-review`

В `.github/workflows/deploy.yml` создаются статические директории для `/projects` и `/consulting`, но не создается директория `/design-review`.

Риск: прямой production-переход на `https://highsnr.org/design-review` может зависеть от GitHub Pages fallback и отдавать неидеальный статус, тогда как старые маршруты получают полноценные entrypoints.

Рекомендация: добавить `design-review` в список route entrypoints; оставить `consulting` только если будет redirect.

### 3. Git-организация в документах устарела

`README.md` и `wiki/00_Architecture.md` пишут, что корень подготовлен к будущему Git-репозиторию, а `adc_tool` остается отдельным Git-репозиторием.

Фактически:

- `.git` есть в корне;
- `adc_tool/.git` отсутствует;
- корневой репозиторий уже отслеживает `adc_tool`.

Рекомендация: обновить `README.md`, `wiki/00_Architecture.md`, `wiki/07_Stabilization_and_Operations.md`: текущая модель уже ближе к monorepo/workspace, а не к будущему выбору между repo/submodule.

### 4. Публичная копия research plan содержит внутреннюю стратегию

`portal/public/research/mlcc-research-directions-2026-07-16.md` полностью повторяет рабочий wiki-документ и содержит внутренние вещи:

- целевой чек `$5-15 тыс.`;
- vendor outreach;
- закупка и доставка QA403;
- проценты распределения времени;
- стратегические формулировки про вендоров и финансирование.

Риск: ссылка с публичной страницы `/research` ведет не только на научный план, но и на внутреннюю бизнес-стратегию. Для LinkedIn/публичного портала это выглядит слишком открыто.

Рекомендация: оставить полный документ в `wiki/research`, а публичную копию заменить на sanitized/public summary: научные ветки, публикационный roadmap, связь с инструментами, без бюджета, закупок, outreach и внутренней тактики.

### 5. `portal/README.md` и `videos_project/README.md` остались boilerplate

Оба README все еще описывают стандартный React/Vite template, а не реальные подпроекты HighSNR.

Риск: новый агент или разработчик получит неправильный первый контекст.

Рекомендация: заменить на короткие проектные README:

- назначение;
- локальный запуск;
- production path;
- связь с корневым workspace;
- команды проверки.

### 6. `adc_tool` содержит старые `file:///g:/...` ссылки

В `adc_tool/README.md`, `AGENTS.md`, `CLAUDE.md`, `wiki/*` и drafts много ссылок на старое расположение `G:/Мой диск/SNR_Lib/ADC_Model`.

Риск: база знаний внутри `adc_tool` не переносима и не соответствует текущему workspace.

Рекомендация: отдельным механическим проходом заменить старые абсолютные ссылки на относительные ссылки внутри `adc_tool`.

### 7. Courses и newsletter остаются в промежуточном состоянии

`/courses` существует как route, но не показывается в верхнем меню и пока выглядит как будущий раздел. `/subscribe` уже редиректит на `/lab-notes`, но в `wiki/01_Portal_MVP.md` критерий успеха все еще говорит о настроенной форме подписки.

Рекомендация:

- считать Courses скрытым будущим разделом, не частью публичного MVP;
- удалить из MVP-критериев “форма подписки настроена”, пока реальной формы нет;
- для обратной связи в краткосрочной версии использовать `About`, footer email и LinkedIn/GitHub/YouTube.

### 8. Tool status для Passive Filter Distortion Analyzer не везде одинаковый

`capacitor_filter_tool/docs/portal-integration.md` все еще говорит показывать `In development` и не включать visible launch до минимального UI. Но `wiki/03_Project_Tools.md` и сам портал уже считают инструмент рабочим MVP/Active Analyzer.

Рекомендация: обновить `portal-integration.md` под текущий статус: MVP доступен, но отдельные режимы и топологии находятся в development.

### 9. Локальный порт фильтра не закреплен строго

В `capacitor_filter_tool/package.json`:

```text
vite --host 127.0.0.1 --port 5175
```

В отличие от portal/videos, нет `--strictPort`. При занятом порте Vite может перейти на другой порт, а портал будет продолжать вести на `5175`.

Рекомендация: добавить `--strictPort` в dev script или server config.

### 10. Lab Notes пока не являются markdown-driven публичным журналом

Wiki уже хранит `wiki/lab-notes/2026-06-30-capacitor-study-interim-results.md`, а портал показывает hard-coded content в React.

Рекомендация: на следующем этапе сделать простой pipeline: Markdown notes -> список на `/lab-notes`. Пока это не критично, но для “простого способа публиковать бортовой журнал” именно это станет основой.

## Проверка сборки и тестов

Запущено:

```text
npm run check
```

Результат: проходит успешно.

Проверено:

- portal lint + build;
- videos_project lint + build;
- `adc_tool` unit tests: 21 tests, OK;
- `capacitor_filter_tool` TypeScript/Vite build.

Предупреждения:

- `portal/src/pages/ContentPages.jsx`: неиспользуемая переменная `adcToolHref`;
- `capacitor_filter_tool`: крупный JS chunk после minification, не блокер для MVP, но кандидат на будущий code splitting.

## Рекомендуемый порядок исправлений

1. Синхронизировать навигацию: `/design-review`, `/consulting`, `/projects`, deploy entrypoints.
2. Санитизировать публичный research plan и оставить полный стратегический документ только в `wiki`.
3. Обновить `README.md`, `wiki/00_Architecture.md`, `wiki/01_Portal_MVP.md`, `wiki/07_Stabilization_and_Operations.md` под фактическую Git/workspace-модель.
4. Заменить boilerplate README в `portal` и `videos_project`.
5. Исправить старые абсолютные ссылки `file:///g:/...` в `adc_tool`.
6. Добавить `--strictPort` для `capacitor_filter_tool`.
7. Убрать warning `adcToolHref` и позже заняться code splitting фильтра.
8. Спроектировать публикацию Lab Notes из Markdown, чтобы бортовой журнал велся простым добавлением файла.

## Итоговая оценка

Проект уже выглядит как рабочая инженерная экосистема, а не как набор разрозненных прототипов. Техническая база стабильная: сборки проходят, инструменты разделены правильно, плоская структура Research/Tools/Publications в целом выдержана.

Главная задача следующего прохода — не добавлять новые разделы, а выровнять слой знаний: сделать так, чтобы README/wiki/deploy/реальные маршруты говорили одно и то же.
