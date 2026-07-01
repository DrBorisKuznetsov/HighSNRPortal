# Education Tools

`Education Tools` - отдельная категория HighSNR Lab для инструментов, которые поддерживают обучение, визуализацию и создание технического контента.

## Зачем выделять отдельно

Основной каталог `/tools` должен оставаться каталогом инженерных расчетных инструментов: симуляторов, калькуляторов, физических моделей и design-space exploration.

`Education Tools` решают другую задачу:

- подготовка схем и иллюстраций;
- генерация Manim-сцен;
- создание учебных материалов;
- поддержка видео и курсов;
- единый визуальный язык лаборатории.

Такой раздел сохраняет чистоту позиционирования: HighSNR не смешивает расчетные модели и production-инструменты в одном каталоге.

## Перенесенные инструменты

### HighSNR Circuit Builder

Исходный локальный проект: `G:\Мой диск\Animation\WebEditor`.

Текущее расположение в workspace:

```text
portal/public/education-tools/highsnr-circuit-builder/app/
```

Публичный путь внутри портала:

```text
/education-tools
```

Точный файл запуска:

```text
/education-tools/highsnr-circuit-builder/app/index.html
```

Назначение:
- web-based visual editor для схем;
- генерация Python-кода для Manim;
- поддержка стандартных электронных компонентов;
- экспорт/import JSON-проектов;
- подготовка визуальных материалов для HighSNR YouTube и курсов.

Рекомендуемое позиционирование:

> HighSNR Circuit Builder is an Education Tool for building consistent circuit diagrams and Manim-ready animation assets for technical electronics education.

## Перенос 2026-06-29

Перенесены исходники и нужные ассеты:

- `index.html`
- `README.md`
- `circuit_lib.py`
- `promo_circuit.py`
- `highsnr_logo.png`
- `test.svg`

Не переносились:

- `.git`
- `__pycache__`
- `media/`

Причина: `media/` содержит generated output Manim и partial movie files. Эти файлы не должны раздувать портал и должны пересоздаваться из исходников при необходимости.

UX-правило:
- `/education-tools` является единственной стартовой страницей инструмента: короткое описание + кнопка запуска редактора в новом окне.
- standalone editor содержит ссылку `Back to Portal`, которая возвращает пользователя на `/education-tools`.
- Стартовая страница оформлена в стиле карточек инженерных инструментов: описание слева, скриншот интерфейса справа, статус `Active Education Tool` и CTA `Launch Editor`.

## Правило публикации

Перед полноценной публикацией и релизом нужно решить:

1. Оставлять ли инструмент внутри `portal/public` или вынести в отдельный репозиторий.
2. Нужен ли отдельный production URL или достаточно пути внутри портала.
3. Нужно ли переносить `circuit_lib.py` в отдельный reusable package.
4. Какие демо-сцены и видео показывать на странице инструмента.
5. Как синхронизировать дальнейшие изменения из исходного проекта `G:\Мой диск\Animation\WebEditor`.
