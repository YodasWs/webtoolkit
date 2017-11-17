# win-dev

Some fixing up for development using _Bash on Ubuntu on Windows 10_.

## ansi-styles

Because I like the default beige background for _Bash on Ubuntu on Windows 10_,
but `ansi-styles` ends up using white on the light background instead of black,
we need to insert `ansi-styles.js` into `node_modules/ansi-styles/index.js`

```vim
:e node_modules/ansi-styles/index.js<Enter>
}
:r win-dev/ansi-styles.js<Enter>
```
