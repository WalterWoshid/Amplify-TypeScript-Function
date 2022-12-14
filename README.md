# Amplify TypeScript Function Skeleton

---

## Usage:

1. Create a new Amplify function: `amplify function add`
2. Remove all contents from your new functions `src` folder, but keep the `index.js` file (so it can copy the 'Amplify Params' comment)
3. Add all files from this project to the `src` folder

<br>

From your Amplify project root, run the mock command:

```
amplify mock function yourFunctionName --event src/event.json
```

That's it!

---

## Note:

Auto build:
- The `postinstall` section in the `package.json` will compile the TypeScript file into `index.js`

<br>

Amplify Params Comment:
- Add the `Amplify Params` comment from your original `index.js` or run `amplify function update yourFunctionName` and let Amplify add it again
  - You can also add the comment to the `index.ts` file and it will include it into your `index.js` file
  - It will not use the comment from the `index.ts` file if a `index.js` file exists and already has an Amplify comment to ensure that the `build` method always uses the newest comment
