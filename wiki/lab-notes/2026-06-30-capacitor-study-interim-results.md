# 2026-06-30: Первые промежуточные итоги исследования конденсаторов

## Статус

Бортовая запись / промежуточная заметка.

## Исходная диктовка

Можем подвести уже первые промежуточные итоги этого исследования. Тема оказалась гораздо интереснее, чем ожидалось. Попытка просто коснуться физики работы современных многослойных конденсаторов открыла ящик Пандоры. Оказалось, что количество эффектов, которыми награждает нас физика в работе электроники, просто огромное количество, и не всегда мы можем их учесть. Но это все рассуждения. А в настоящее время создан первый калькулятор или расчетчик свойств, который позволяет оценить, как влияет конденсатор на АЦП. И опубликовано, на мой взгляд, три неплохие работы, в которых я попытался, наверное в первую очередь для себя, обобщить те знания и выводы, которые были получены при изучении. Что же, продолжаем двигаться.

## Обработанная версия для портала

The first stage of this study has already produced several useful conclusions. The subject turned out to be much deeper and much more interesting than expected.

What began as an attempt to understand the physics of modern multilayer ceramic capacitors quickly expanded into a broader investigation of how real capacitors behave in real circuits. DC bias, dielectric history, voltage-dependent capacitance, losses, nonlinear behavior, and distortion are not isolated effects. In many practical cases, they interact with each other and directly affect circuit performance.

One important conclusion is already clear: MLCC behavior cannot always be reduced to a simple capacitance correction factor. For many engineering problems, that may be enough. But in precision signal paths, ADC front ends, filters, references, and measurement circuits, the capacitor can become an active source of error rather than a passive component.

On the practical side, the first calculator has been developed to estimate how non-ideal capacitor behavior can affect ADC performance. This is an early engineering tool, but it already helps connect the physical behavior of capacitors with measurable system-level consequences.

Three technical papers have also been published as part of this work. Their purpose is to organize the knowledge, measurements, models, and conclusions that emerged during the study, and to make the results easier to use in future research and design work.

This is still an interim result, not a final conclusion. The work continues.

## Предыдущая рабочая версия

We can already draw the first interim conclusions from this study. The topic turned out to be much more interesting than expected.

What started as an attempt to touch the physics of modern multilayer ceramic capacitors opened a Pandora's box. The number of effects that physics brings into real electronic circuits is enormous, and not all of them can be captured in a simple engineering model.

That is the reflective part. On the practical side, the first calculator has been created to estimate how capacitor behavior can affect ADC performance.

Three papers have also been published. They are an attempt, first of all for myself, to collect the knowledge and conclusions that appeared during this study.

The work continues.

## Связанные материалы

- `/research`
- `/publications`
- `/tools`
