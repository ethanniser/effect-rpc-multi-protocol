import { FetchHttpClient, Socket } from "@effect/platform";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Console, Effect, Layer } from "effect";
import { FooGroup } from "./request.js";
import { NodeRuntime } from "@effect/platform-node";

const makeOne = RpcClient.make(FooGroup).pipe(
  Effect.provide(
    RpcClient.layerProtocolHttp({
      url: `http://localhost:3000/rpc/http`,
    }).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerJson]))
  )
);

const makeTwo = RpcClient.make(FooGroup).pipe(
  Effect.provide(
    RpcClient.layerProtocolSocket({
      retryTransientErrors: true,
    }).pipe(
      Layer.provide([
        RpcSerialization.layerJson,
        Socket.layerWebSocket(`ws://localhost:3000/rpc/socket`).pipe(
          Layer.provide(Socket.layerWebSocketConstructorGlobal)
        ),
      ])
    )
  )
);

const program = Effect.gen(function* () {
  const one = yield* makeOne;
  const two = yield* makeTwo;
  const client = {
    one,
    two,
  } as const;
  yield* client.one
    .Foo()
    .pipe(Effect.andThen(Console.log), Effect.ignoreLogged);
  yield* client.two
    .Foo()
    .pipe(Effect.andThen(Console.log), Effect.ignoreLogged);
}).pipe(Effect.scoped);

NodeRuntime.runMain(program);
