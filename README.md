# eslint-plugin-lodash-to-native

В библиотеке Lodash есть функция map. Она может использоваться как с массивами, так и с объектами.
Плагин содержит правило map, которое находит использование функции `_.map`, например `_.map(collection, fn)`, и, если это возможно, предлагает заменить его на использование нативного `Array#map`

## Установка

Установка [ESLint](http://eslint.org):

```
$ yarn add eslint -D
```

Установка `eslint-plugin-lodash-to-native`:

```
$ yarn add eslint-plugin-lodash-to-native -D
```

**Note:** Если Eslint был установлен глобально, то и плагин нужно установить глобально .

## Применение

В конфигурации `.eslintrc` нужно добавить следующее:

```json
{
    "plugins": [
        "lodash-to-native"
    ],
    "rules": {
        "lodash-to-native/map": "warn"
    }
}
```

## Правило map
1) Первый аргумент map - идентификатор массива
```js
return _.map(collection, fn);
```
заменит на:
```js
return (Array.isArray(collection)) 
    ? collection.map(fn)
    : _.map(collection, fn);
```
2) Первый аргумент map - литерал массива
```js
_.map([1, 2, 3], fn)
```
заменит на:
```js
[1, 2, 3].map(fn)
```

## Запуск тестов
```
yarn test
```







