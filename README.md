# Build Readme

A cli tool to replace each example block with an actual file from examples

> [examples/simple.ts](examples/simple.ts)

```typescript
import { resolve } from '@ovotech/json-schema';

resolve({});
```

With running

```
yarn build-readme README.md
```

You would copy the contents of the actual `examples/simple.ts` file into the following codeblock.

It also supports extracting bits of the example file, with "sections". You will need to wrap the desired code inside of the referenced file with `// << section-name (...) // section-name`. The resulting url will also contain direct link to the section, when viewed in github.

> [examples/simple.ts:(test-section)](examples/simple.ts)

```typescript
import { resolve } from '@ovotech/json-schema';

// << test-section
resolve({});
// test-section
```

This way you can keep your examples as executable files, and automatically update your readme files when you make changes, so none of your examples get out of date.

## Running the tests

You'll need to start a postgres instance to run the tests for some of the exmaples

```shell
docker-compose -f examples/docker-compose.yaml up
```

You can then run the tests with:

```shell
yarn test
```

### Coding style (linting, etc) tests

Style is maintained with prettier and eslint

```
yarn lint
```

## Deployment

Deployment is done by github when you create a new release in github.

## Contributing

Have a bug? File an issue with a simple example that reproduces this so we can take a look & confirm.

Want to make a change? Submit a PR, explain why it's useful, and make sure you've updated the docs (this file) and the tests (see [test folder](test)).

## License

This project is licensed under Apache 2 - see the [LICENSE](LICENSE) file for details
