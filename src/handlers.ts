import { Effect } from "effect";
import { FooGroup } from "./request.js";

export const FooHandler = FooGroup.toLayer(
  Effect.gen(function* () {
    return {
      Foo: () => Effect.succeed("from one"),
    };
  })
);
