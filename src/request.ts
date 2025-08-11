import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema } from "effect";

export class FooGroup extends RpcGroup.make(
  Rpc.make("Foo", {
    success: Schema.String,
  })
) {}
