import { FetchHttpClient, Socket } from "@effect/platform";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Console, Effect, Layer } from "effect";
import { FooGroup } from "./request.js";
import { NodeRuntime } from "@effect/platform-node";

class HttpClientA extends Effect.Service<HttpClientA>()("HttpClientA", {
  scoped: RpcClient.make(FooGroup),
  dependencies: [RpcClient.layerProtocolHttp({
    url: `http://localhost:3000/rpc/http`,
  }).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerJson]))],
}) {}

class HttpClientB extends Effect.Service<HttpClientB>()("HttpClientB", {
  scoped: RpcClient.make(FooGroup),
  dependencies: [RpcClient.layerProtocolHttp({
    url: `http://localhost:3000/rpc/http2`,
  }).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerJson]))],
}) {}

class HttpClientSocket extends Effect.Service<HttpClientSocket>()("HttpClientSocket", {
  scoped: RpcClient.make(FooGroup),
  dependencies: [RpcClient.layerProtocolSocket({
    retryTransientErrors: true,
  }).pipe(
    Layer.provide([
      RpcSerialization.layerJson,
      Socket.layerWebSocket(`ws://localhost:3000/rpc/socket`).pipe(
        Layer.provide(Socket.layerWebSocketConstructorGlobal)
      ),
    ])
  )],
}) {}

const program = Effect.gen(function* () {
  const one = yield* HttpClientA
  const twoHttp = yield* HttpClientB
  const twoSocket = yield* HttpClientSocket
  const client = {
    one,
    twoHttp,
    twoSocket,
  } as const;
  console.log("one");
  yield* client.one
    .Foo()
    .pipe(Effect.andThen(Console.log), Effect.ignoreLogged);
  console.log("twoHttp");
  yield* client.twoHttp
    .Foo()
    .pipe(Effect.andThen(Console.log), Effect.ignoreLogged);
  console.log("twoSocket");
  yield* client.twoSocket
    .Foo()
    .pipe(Effect.andThen(Console.log), Effect.ignoreLogged);
}).pipe(Effect.provide([HttpClientA.Default, HttpClientB.Default, HttpClientSocket.Default]));

NodeRuntime.runMain(program);
