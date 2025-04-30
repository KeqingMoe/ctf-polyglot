# writeup

解法不唯一，提供多种答案。

## 解法一

```js-or-py
eval(['print("Hello Python")', 'console.log("Hello JavaScript")'][
    1 // 2
])
```

原理： `//` 在 JS 中是单行注释，在 Python 中是整除，因而 `1 // 2` 在前者是 `1` 而后者求值为 `0` 。 `eval` 则是两者都有的内建函数。

## 解法二

```js-or-py
1 // (lambda: print('Hello Python') or 1)()
lambda: eval('console.log("Hello JavaScript")')
```

原理：以及 Python 中的 `lambda:` 是无参 Lambda 表达式，而在 JavaScript 中则是标签。前者不调用就不会执行，后者会执行。

## 解法三

```js-or-py
eval(['print("Hello Python")', 'console.log("Hello JavaScript")'][+('toString' in {})])
```

原理：Python 中 `{}` 是字典， `'toString' in {}` 求值为 `False` ；JavaScript 中 `{}` 是 `object` ，其中存在一个 `.toString()` 方法，故 `'toString' in {}` 求值为 `true`。前面的 `+` 用于将布尔值转为整数。

## 解法四

```js-or-py
eval(['print("Hello Python")', 'console.log("Hello JavaScript")'][+(-1 % 2 < 0)])
```

原理：Python 中 `%` 是取模，JavaScript 中 `%` 是取余数。

## 解法五

```js-or-py
1 // 1 or """
console.log('Hello JavaScript')
/*
"""
print('Hello Python')
# */
```

原理：Python 中 `"""` 是多行字符串，直接跳过 JavaScript 部分。再用 `/*` 和 `*/` 令其作 JavaScript 时跳过 Python 部分。
