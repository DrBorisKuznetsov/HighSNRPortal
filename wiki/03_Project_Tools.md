# Подпроект: Tools (Инженерные инструменты)

Раздел Tools — один из центральных практических разделов портала. Сюда интегрируются инженерные калькуляторы и модели, которые помогают связать исследования HighSNR Lab с прикладными расчетами.

## Архитектура инструментов

Поскольку портал хостится статически (GitHub Pages), интерактивные инструменты должны работать преимущественно **Client-side (в браузере)**.
- **Технологии:** React, WebAssembly (если нужны сложные вычисления на C++/Rust), Svelte.
- Если инструмент требует тяжелых вычислений (например, симуляция SPICE), потребуется внешний backend (FastAPI/Python), который можно разместить на отдельном сервере или serverless-функциях. Для начала лучше стремиться к Client-side.

## Структура страниц инструментов

Каждый инструмент имеет свою страницу (SEO-оптимизированную), которая включает в себя как сам калькулятор/модель, так и теоретическую базу.

**Структура URL:**
`/tools/tool-name-calculator`

Текущие MVP-страницы:
- `/tools/adc-enob-loss-calculator`
- `/tools/capacitor-distortion-analyzer`
- будущая: `/tools/dsp-pwm-pdm-spectrum-analyzer`

**Содержание страницы (MDX/React):**
1. **Title & Subtitle:** Что делает инструмент (название и какую проблему решает).
2. **Sections (Документация):**
   - What this tool does (Описание).
   - When to use it (Кому и зачем полезен).
   - Input parameters (Описание входных данных).
   - Model assumptions & Limitations (Ограничения модели).
3. **Interactive UI (Сам инструмент):**
   - Формы ввода параметров.
   - Графики (рекомендуется Plotly.js или ECharts для инженерных графиков).
   - Кнопка **"Run the tool"**.
4. **Связанные ресурсы:**
   - Related research (ссылки на раздел /research).
   - GitHub model (ссылка на репозиторий с исходным кодом модели).
   - Related video (YouTube видео с разбором).
5. **Коммерческая функция (в будущем):**
   - Generate professional report (генерация PDF отчета за плату).

## Интеграция инструментов в MVP (Реализовано)

Сложные инструменты переносятся по архитектуре независимых проектов:
- **Каталог на портале:** Создана страница `ToolsCatalog.jsx` в основном портале. Она стилизована под премиальный инженерный дизайн.
- **Инструмент ADC:** Модель `ADC_Model` перенесена в директорию `adc_tool`. Она запускается на отдельном Python-сервере (`serve_app.py`) на порту 8000, так как использует тяжелый PyScript, требующий корректного веб-сервера для загрузки файлов.
- **SEO-страница ADC:** На портале добавлена страница `/tools/adc-enob-loss-calculator`; она описывает модель и содержит кнопку запуска внешнего симулятора.
- **Связь:** Каталог ссылается на инструмент по прямой ссылке (с учетом `import.meta.env.DEV`), минуя внутренний роутер портала. Внутри инструмента есть кнопка "Назад на портал".
- **Passive Filter Distortion Analyzer:** На портале добавлена страница-заготовка `/tools/capacitor-distortion-analyzer`. Полноценный инструмент вынесен в отдельный подготовленный workspace `capacitor_filter_tool`.
- **Дизайн:** Цветовая схема инструмента (`index.css`) обновлена для полного соответствия стилям основного портала.

## Подготовленный проект: Passive Filter Distortion Analyzer

Источник задачи:

```text
C:\Users\Voris\Downloads\Техническое задание.pdf
```

Рабочий каталог:

```text
capacitor_filter_tool
```

Текущий статус на 2026-07-01: подготовлен каркас самостоятельного инструмента, но приложение еще не scaffold-нуто. Внутрь перенесен исходный PDF как `docs/source/technical-spec-source.pdf`, создана сводка ТЗ, архитектурные заметки, дорожная карта, brief для будущих агентов и JSON-манифест для портальной интеграции.

Позиционирование:

> Engineering Tool для анализа пассивных фильтров с реальными конденсаторами: идеальный AC-анализ, линейные неидеальности ESR/ESL/leakage/source/load и нелинейные искажения от voltage-dependent capacitance.

Решение по архитектуре:
- Не встраивать рабочий интерфейс и численное ядро внутрь `portal`.
- Оставить портал как страницу описания и запуска: `/tools/capacitor-distortion-analyzer`.
- Развивать приложение как самостоятельный runtime-проект.
- Локальный порт для будущего Vite-приложения: `5175`.
- Рекомендуемый production-субдомен: `filters.highsnr.org`.

MVP-режимы:
- Linear AC Analysis.
- Linear Non-Ideal Analysis.
- Nonlinear Distortion Analysis с charge-conserving capacitor model.

MVP-топологии:
- RC low-pass;
- RC high-pass;
- RC band-pass;
- RC band-stop / notch;
- RLC band-pass;
- RLC band-stop / notch.

## Кандидат: DSP PWM/PDM Spectrum Analyzer

Исходный локальный проект:

```text
D:\DS_Spectum\1.1V
```

Текущий статус: desktop prototype на Python/PyQt.

Состав:
- `engine.py` - математическое ядро: генерация baseband-сигнала, PWM, delta-sigma PDM, FFT, window functions, OBW 99%.
- `main.py` - PyQt6/pyqtgraph интерфейс.
- `dist/DSP_Analyzer.exe` - готовый Windows executable, около 86 MB.
- `dist/dsp_analyzer_capture.png` - скриншот спектрального анализа.

Позиционирование:

> Engineering Tool для анализа MCU PWM/PDM, ограничений timer/ARR, спектра, occupied bandwidth, aliasing и FFT-артефактов.

Решение на 2026-06-29:
- Не создавать отдельный верхний раздел портала.
- Не добавлять инструмент в `Education Tools`.
- Не хранить большой `.exe` внутри `portal/public`.
- Не строить вокруг него отдельный research-граф до появления статей/курса.
- Парковать как запись в `/tools` со статусом `Desktop prototype`.

Рекомендуемый следующий шаг:
1. Сделать SEO/landing-страницу `/tools/dsp-pwm-pdm-spectrum-analyzer`.
2. Использовать скриншот как preview.
3. Для download использовать GitHub Release или отдельный release storage.
4. После этого перенести ядро в web-MVP.

Web-перенос возможен без полной переписываемости идеи, потому что математическое ядро уже отделено от UI. Для веб-версии предпочтителен React + JavaScript/TypeScript:
- `generate_base_signal`;
- `modulate_pwm`;
- `modulate_delta_sigma`;
- `calculate_spectrum`;
- Hann / Blackman / Rect windows;
- расчет `F_PWM`, `BIT_RES`, `OBW_99%`, `NYQ_STAT`.

Для FFT использовать готовую JS-библиотеку (`fft.js`, `dsp.js` или аналог), не писать FFT вручную.
