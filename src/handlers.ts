import { Effect } from "effect";
import { OneRpcs, TwoRpcs } from "./request.js";

export const OneHandler = OneRpcs.toLayer(
  Effect.gen(function* () {
    return {
      Foo: () => Effect.succeed("from one"),
    };
  })
);

export const TwoHandler = TwoRpcs.toLayer(
  Effect.gen(function* () {
    return {
      Foo: () => Effect.succeed("from two"),
    };
  })
);
