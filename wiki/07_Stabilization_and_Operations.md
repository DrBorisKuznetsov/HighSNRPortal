# Стабилизация и эксплуатационные правила

Дата фиксации: 2026-06-29.

## Цель стабилизационного прохода

Привести workspace HighSNR Lab из состояния набора ранних прототипов к проверяемому MVP-скелету:

- убрать явные поломки production-сборки;
- заменить битые и локально-зашитые ссылки на средозависимые;
- расширить карту маршрутов портала до минимального MVP;
- добавить одну команду проверки проекта;
- сохранить архитектурные решения в wiki.

## Что изменено

### Portal

- Добавлены маршруты:
  - `/research`
  - `/tools/adc-enob-loss-calculator`
  - `/tools/capacitor-distortion-analyzer`
  - `/publications`
  - `/lab-notes`
  - `/projects`
  - `/courses`
  - `/about`
  - `/subscribe`
  - `/consulting`
- Ссылка на видео-каталог теперь зависит от окружения:
  - development: `http://localhost:5174/videos_project/`
  - production: `/videos_project/`
- Карточки инструментов ведут на страницы инструментов, а запуск ADC Simulator остается отдельной внешней ссылкой.

### Videos Project

- Исправлена production-сборка TypeScript: удален неиспользуемый импорт `React`.
- Логотип канала теперь строится через `import.meta.env.BASE_URL`, чтобы путь работал с Vite base `/videos_project/`.

### Operations

- В корне добавлен `package.json` с командой:

  ```bash
  npm run check
  ```

- Команда проверяет:
  - `portal`: lint + build;
  - `videos_project`: lint + build;
  - `adc_tool`: Python unit tests.
- Добавлен `.github/workflows/project-checks.yml` для будущего корневого GitHub-репозитория.

### Education Tools

- HighSNR Circuit Builder перенесен из `G:\Мой диск\Animation\WebEditor`.
- Static app размещен в `portal/public/education-tools/highsnr-circuit-builder/app/`.
- Стартовая страница инструмента находится на `/education-tools`; запуск редактора открывается в новой вкладке.
- В перенос вошли исходные HTML/Python/asset-файлы.
- Не переносились `.git`, `__pycache__` и `media/`, так как это история исходного репозитория, кэш Python и generated output Manim.

### Navigation

- Hero-блоки внутренних страниц теперь показывают один основной `h1`; старый `eyebrow`-label убран, чтобы не дублировать название раздела.
- `Research` оставлен как короткая точка входа к единственной текущей исследовательской теме.
- `Publications` переименован в `Articles & Papers`.
- Верхнее меню сокращено: `Lab Notes`, `Education Tools` и `Courses` убраны из шапки, но остались доступны через связанные страницы.

### Content Structure

- `Articles & Papers` переведен в компактный publication index вместо сетки крупных карточек.
- Добавлены DOI-записи engrXiv: `10.31224/7464`, `10.31224/7456` и `10.31224/7436`.
- `/projects` переведен в плоский project register: только реальные hardware/software/measurement проекты, без разделов портала внутри списка проектов.
- Зафиксировано анти-граф правило: разделы остаются витринами одного уровня, а связи между ними делаются только короткими related-ссылками.
- DSP PWM/PDM Spectrum Analyzer из `D:\DS_Spectum\1.1V` рассмотрен как кандидат в Engineering Tools и будущий веб-инструмент.

## Git-решение

На момент стабилизации Git-репозиторий есть только внутри `adc_tool`. Корень не был автоматически инициализирован как Git-репозиторий, потому что внутри уже существует отдельная история `adc_tool`.

До финального выбора модели хранения нужно решить:

- `monorepo` + `adc_tool` как submodule/subtree;
- или несколько независимых репозиториев и wiki как карта связей.

## Правило для будущих изменений

Каждое значимое изменение должно обновлять минимум один из документов:

- `README.md` - если меняется запуск, проверка или текущий статус workspace;
- `wiki/00_Architecture.md` - если меняется архитектурное решение;
- отдельный файл `wiki/XX_Project_*.md` - если меняется конкретный подпроект;
- `wiki/07_Stabilization_and_Operations.md` - если меняется процесс проверки, деплоя или Git-организации.
- `wiki/09_Daily_Log_2026-06-29.md` - дневной снимок принятых решений и состояния workspace на конец 2026-06-29.
