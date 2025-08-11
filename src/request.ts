// request.ts
import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema } from "effect";

export class OneRpcs extends RpcGroup.make(
	Rpc.make("Foo", {
		success: Schema.String,
	}),
) {}

export class TwoRpcs extends RpcGroup.make(
	Rpc.make("Foo", {
		success: Schema.String,
	}),
) {}
