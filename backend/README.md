## About

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).

**IMPORTANT** for demo purposes I had to disable `helmet` in production. In any real world app you should change these 3 lines of code in `src/server.ts`:
```ts
// eslint-disable-next-line n/no-process-env
if (!process.env.DISABLE_HELMET) {
  app.use(helmet());
}
```

To just this:
```ts
app.use(helmet());
```


## Available Scripts

### `pnpm run clean-install`

Remove the existing `node_modules/` folder, `package-lock.json`, and reinstall all library modules.


### `pnpm run dev` or `pnpm run dev:hot` (hot reloading)

Run the server in development mode.<br/>

**IMPORTANT** development mode uses `swc` for performance reasons which DOES NOT check for typescript errors. Run `pnpm run type-check` to check for type errors. NOTE: you should use your IDE to prevent most type errors.


### `pnpm test` or `pnpm run test:hot` (hot reloading)

Run all unit-tests.


### `pnpm test -- "name of test file" (i.e. users).`

Run a single unit-test.


### `pnpm run lint`

Check for linting errors.


### `pnpm run build`

Build the project for production.


### `pnpm start`

Run the production build (Must be built first).


### `pnpm run type-check`

Check for typescript errors.


## Additional Notes

- If `pnpm run dev` gives you issues with bcrypt on MacOS you may need to run: `pnpm rebuild bcrypt --build-from-source`. 
