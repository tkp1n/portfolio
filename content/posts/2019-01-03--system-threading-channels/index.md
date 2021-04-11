---
title: Exploring System.Threading.Channels
category: ".NET"
cover: chuttersnap-317196-unsplash.jpg
author: Nicolas Portmann
---

The `System.Threading.Channels` namespace provides data structures (stores) for pub/sub scenarios. It enables you to decouple one-to-many publishers from one-to-many subscribers just as its equally named counterpart from [go](https://tour.golang.org/concurrency/2).

At first glance, this might look similar to the functionality provided by `BufferBlock<T>` from `System.Threading.Task.Dataflow`. `Channels`, however, are a more low-level primitive upon which libraries such as `Dataflow` can be built. If `Dataflow` was still in development today, it would most certainly be based on `Channels` to some extent.

## Bounded vs. Unbounded Channels

Channels are created using the static factory methods of the `Channel` class.
The type parameter `T` is used to identify the type of object that can be passed from a publisher to a subscriber via the created `Channel`.

```csharp
public static Channel<T> CreateBounded<T>(int capacity) {}
public static Channel<T> CreateBounded<T>(BoundedChannelOptions options) {}
public static Channel<T> CreateUnbounded<T>() {}
public static Channel<T> CreateUnbounded<T>(UnboundedChannelOptions options) {}
```

Using `CreateUnbounded` creates a channel that can accept an infinite amount of messages - given an endless amount of memory of course. The unbounded channel variant is more performant than its bounded counterpart in almost every benchmark (see below). This win in performance comes at the cost of potentially running out of memory. If you can externally guarantee, that the channel never contains more then a certain amount of pending objects, using an unbounded channel is profitable. Otherwise, it is more secure to rely on bounded channels.

Bounded channels operate in one of four `FullMode`s, which can be set via the options parameter to the `CreateBounded` factory method.

```csharp
Channel.CreateBounded<T>(new BoundedChannelOptions(capacity)
{
    FullMode = BoundedChannelFullMode.Wait
});
```

The four supported `FullMode`s are:

- `Wait` - Wait for space to be available in order to complete the write operation.
- `DropNewest` - Remove and ignore the newest item in the channel in order to make room for the item being written.
- `DropOldest` - Remove and ignore the oldest item in the channel in order to make room for the item being written.
- `DropWrite` - Drop the item being written.

Be aware that the most convenient option `Wait` might also cause memory issues, as each asynchronously 'waiting' producer requires memory as well.

## Publisher / Subscriber cardinality

Channels are assumingly used to coordinate one publisher with the computing power of multiple subscribers, or to fit the work of multiple producers through the bottleneck of a single consumer. It is however also possible to model multi-publisher / multi-subscriber or single-publisher / single-subscriber scenarios using channels.

To notify the factory methods of the specific scenario at hand, two properties on both the `Unbounded`- and the `BoundedChannelOptions` can be set accordingly.

```csharp
Channel.CreateUnbounded<T>(new UnboundedChannelOptions()
{
    SingleWriter = false,
    SingleReader = true
});
```

The documentation for those two properties indicates, that specific optimizations may be unlocked if the channel knowns about the single-reader or single-writer guarantee. This information is currently used to determine the appropriate `Channel` implementation for the given circumstances. The CoreFX repository contains three implementations of the abstract `Channel<T>` class; a bounded Channel, a single-reader and a multi-reader unbounded channel. Unless specifying a single-consumer scenario to the unbounded channel factory, there is currently no effect in setting those properties. It is nevertheless considered best-practice, as more optimizations might be added in the future.

## Synchronous Continuations

You may have heard of `TaskCreationOptions.RunContinuationsAsynchronously` which was added in .NET Framework 4.6. It forces continuations of tasks to be executed asynchronously (e.g., on the thread pool). The critical thing to note here is that this behavior is not the default. In other words, continuations are executed synchronously per default by the thread that provides the result of a task (e.g., executes `TrySetResult` on the `TaskCompletionSource`). Synchronous execution typically helps with performance but may trigger nasty deadlocks, as developers may not be aware of which thread is executing the continuations.

With `Channels`, this default changed. Not globally of course, but for continuations registered inside the `Channel`. Asynchronous execution ensures, that a producer thread does not end up doing consumer work when executing a continuation synchronously. If you are sure, that this added safety is not necessary in your specific use case, it can be turned off using another boolean property in the `Channel`s options, which defaults to false. Doing so most likely increases throughput but reduces concurrency.

```csharp
Channel.CreateUnbounded<T>(new UnboundedChannelOptions()
{
    AllowSynchronousContinuations = true
});
```

## Interacting with Channels

`Channel` (much as the `IDuplexPipe` interface from `System.IO.Pipelines`) exposes two properties. A `ChannelReader` and a `ChannelWriter`.

```csharp
Channel<T> channel = Channel.CreateUnbounded<T>();

ChannelReader<T> reader = channel.Reader;
ChannelWriter<T> writer = channel.Writer;
```

The `ChannelReader` and the `ChannelWriter` feature a very symmetrical API (optional parameters removed for brevity):

| ChannelReader                     | ChannelWriter                         |
|-----------------------------------|---------------------------------------|
|`bool TryRead(out T item)`         |`bool TryWrite(T item)`                |
|`ValueTask<T> ReadAsync()`         |`ValueTask WriteAsync(T item)`         |
|`ValueTask<bool> WaitToReadAsync()`|`ValueTask<bool> WaitToWriteAsync()`   |
|`Task Completion`                  |`bool TryComplete()`, `void Complete()`|

It is obvious that the `ChannelWriter` can be used to write (publish) objects to the `Channel`, whereas the `ChannelReader` can be used to read (consume) them. It is also obvious that the writing side is in control of the completion of the `Channel`, while the readers can only observe the writers decision (e.g., via the `Completion` Task that completes, when the channel completes).

### TryRead / TryWrite

These synchronous methods may be used to optimistically and synchronously read from or write to a `Channel`. (Note that writing synchronously to an unbounded `Channel` always succeeds unless the channel is closed.) This is typically used to avoid going asynchronous via the following pattern:

```csharp
public ValueTask PublishAsync(T item)
{
    async Task AsyncSlowPath(T thing)
    {
        await channel.WriteAsync(thing);
    }

    return channel.TryWrite(item) ? default : new ValueTask(AsyncSlowPath(item));
}
```

### ReadAsync / WriteAsync

As indicated above, those two methods are the asynchronous counterparts to `TryRead` and `TryWrite`. The critical thing to note here is that both methods throw a `ChannelClosedException` (possibly containing an inner exception if one was passed as a parameter to `TryComplete` or `Complete`) if the `Channel` is completed during the operation. If you can live with a `try`/`catch`-block or externally guarantee, that the channel will not be completed during reads or writes, these two methods are for you. Otherwise, the next pair of methods offers an elegant alternative.

### WaitToReadAsync / WaitToWriteAsync

`WaitToReadAsync` and `WaitToWriteAsyn` allow you to wait asynchronously until the `Channel` becomes readable/writable again. Note, that there is no guarantee, that the `Channel` will stay readable/writable, until you acutally read from / write to it. Both methods will not throw an exception if the channel is completed during the operation (unless you provide an exception to TryComplete or Complete, see below). In this case, they will simply return false. An appropriate usage pattern may be the following. In the case of an exception, it will not be wrapped in a `ChannelClosedException` (as with `ReadAsync` / `WriteAsync`) but thrown directly.

```csharp
public ValueTask<bool> PublishAsync(T item)
{
    async Task<bool> AsyncSlowPath(T thing)
    {
        while (await channel.WaitToWriteAsync())
        {
            if (channel.TryWrite(thing)) return true;
        }
        return false; // Channel was completed during the wait
    }

    return channel.TryWrite(item) ? new ValueTask<bool>(true) : new ValueTask<bool>(AsyncSlowPath(item));
}
```

Note that `TryWrite` is now executed in a while-loop, as the `Channel` may no longer be writeable once we get to actually writing to it.

### Completion / TryComplete / Complete

On the reader side, `Completion` can be used to execute code after the channel has been completed. This can be achieved by either awaiting the `Task` or by registering a continuation using `ContinueWith`. Another option for the reader is to query whether the channel is still active by calling `!channel.Completion.IsCompleted`. Note however that this information might already be outdated, one queried.

As already mentioned, the writing side is in control of `Channel` completion. Publishers can call `TryComplete` or `Complete` without parameter to indicate normal completion, or pass in an `Exception` to indicate completion due to an error. The only difference between `TryComplete` and `Complete` is that the latter will throw a `ChannelClosedException` if the channel is already closed, while to former will just return `false` in this case.

### Usage patterns

The following text and usage patterns were taken from or inspired by the partially outdated [REDAME](https://github.com/dotnet/corefxlab/blob/31d98a89d2e38f786303bf1e9f8ba4cf5b203b0f/src/System.Threading.Tasks.Channels/README.md#example-producerconsumer-patterns) from Stephen Toub. I took the liberty of updating them as the API has slightly changed since its corefxlab days.

#### Producer patterns

The simplest way to produce a bunch of numbers and complete might look like this:

```csharp
private static async Task ProduceRange(ChannelWriter<int> c, int count)
{
    for (int i = 0; i < count; i++)
    {
        await c.WriteAsync(i);
    }
    c.Complete();
}
```

If the `Channel` is expected to be unbounded or the need to wait unlikely, the loop may be optimized using `TryWrite` as indicated earlier:

```csharp
private static async Task ProduceRange(ChannelWriter<int> c, int count)
{
    for (int i = 0; i < count; i++)
    {
        if (c.TryWrite(i)) continue;
        await c.WriteAsync(i);
    }
    c.Complete();
}
```

If returning a `ValueTask` is an option, going async can be avoided altogether if all writes complete synchronously with:

```csharp
private static ValueTask ProduceRange(ChannelWriter<int> c, int count)
{
    for (int i = 0; i < count; i++)
    {
        if (c.TryWrite(i)) continue;

        return new ValueTask(FinishProducingRange(c, i, count));
    }
    c.Complete();
    return default;
}

private static async Task FinishProducingRangeAsync(ChannelWriter<int> c, int current, int count)
{
    for (int i = current; i < count; i++)
    {
        await c.WriteAsync(i);
    }
    c.Complete();
}
```

If you are uncertain, whether the `Channel` may be closed during the operation, the following pattern provides a more secure approach:

```csharp
private static async Task ProduceRange(ChannelWriter<int> c, int count)
{
    for (int i = 0; i < count; i++)
    {
        while (await c.WaitForWriteAsync())
        {
            if (c.TryWrite(i)) break;
        }
    }
    c.Complete();
}
```

And if it's expected that most writers will succeed synchronously, it may be advantageous to also loop on the `TryWrite`, e.g:

```csharp
private static async Task ProduceRange(ChannelWriter<int> c, int count)
{
    int i = 0;
    while (i < count && await c.WaitForWriteAsync())
    {
        while (i < count && c.TryWrite(i)) i++;
    }
    c.Complete();
}
```

The implementation of the variant that may return synchronously without allocating a Task is left as an exercise to the reader.

#### Consumer patterns

On the consuming end, there are similarly multiple ways to consume a channel. Which one is chosen will depend on the exact needs of the situation. A simple read-loop may look like this:

```csharp
private static async Task Consume(ChannelReader<int> c)
{
    try
    {
         while (true)
         {
             int item = await c.ReadAsync();
             // process item...
         }
    }
    catch (ChannelClosedException) {}
}
```

`WaitForReadAsync` and `TryRead` may also be used. This avoids the use of an exception to indicate if/when the channel has been closed, e.g.

```csharp
private static async Task Consume(ChannelReader<int> c)
{
    while (await c.WaitForReadAsync())
    {
        if (c.TryRead(out int item))
        {
             // process item...
        }
    }
}
```

As with the writing example, if it's expected that waiting is relatively rare, a nested loop can be used to optimize for reads by looping over TryRead as well:

```csharp
private static async Task Consume(ChannelReader<int> c)
{
    while (await c.WaitForReadAsync())
    {
        while (c.TryRead(out int item))
        {
            ...
        }
    }
}
```

## Summary

System.Threading.Channels is a highly versatile library to orchestrate pub/sub scenarios in the .NET universe asynchronously.
It is fast enough, to dispatch well over 20 million messages in under a second and does not block any thread while doing so. It's blocking community counterpart [Disruptor-net](https://github.com/disruptor-net/Disruptor-net) is faster in some scenarios (compare the benchmarks below with their [performance results](https://github.com/disruptor-net/Disruptor-net/wiki/Performance-Results)).
I am currently using Channels to sequence the writes of multiple producers to a single `PipeWriter` (from `System.IO.Pipelines`), avoiding some calls to `pipeWriter.FlushAsync` if `channel.TryRead` returns true multiple times.

## Benchmarks

> The source code for the benchmark for reproduction can be found [here](https://github.com/tkp1n/ChannelPlayground). Be aware, that the Bounded channel was sized to be able to store all messages. If the channel were undersized, the benchmarks scores would look much worse.

### Multi-Publisher / Multi-Subscriber

|        Type | SyncCont. | Mean (ms) | Error (ms) | StdDev (ms) |  Million messages / sec |
|------------ |---------- |----------:|-----------:|------------:|------------------------:|
| BoundedWait |     False |     46.40 |     0.8731 |      0.8167 |                   21.55 |
| BoundedWait |      True |     45.22 |     0.4662 |      0.4361 |                   22.11 |
|   Unbounded |     False |     41.07 |     0.2820 |      0.2638 |                   24.35 |
|   Unbounded |      True |     42.13 |     0.3960 |      0.3704 |                   23.74 |

### Multi-Publisher / Single-Subscriber

|        Type | SyncCont. | Mean (ms) | Error (ms) | StdDev (ms) |  Million messages / sec |
|------------ |---------- |----------:|-----------:|------------:|------------------------:|
| BoundedWait |     False |     44.86 |     0.3109 |      0.2756 |                   22.29 |
| BoundedWait |      True |     44.33 |     0.4621 |      0.4323 |                   22.56 |
|   Unbounded |     False |     29.80 |     0.5915 |      0.6329 |                   33.55 |
|   Unbounded |      True |     28.77 |     0.4965 |      0.4644 |                   34.76 |

### Single-Publisher / Multi-Subscriber

|        Type | SyncCont. | Mean (ms) | Error (ms) | StdDev (ms) |  Million messages / sec |
|------------ |---------- |----------:|-----------:|------------:|------------------------:|
| BoundedWait |     False |     45.43 |     0.7245 |      0.6777 |                   22.01 |
| BoundedWait |      True |     45.40 |     0.4925 |      0.4366 |                   22.03 |
|   Unbounded |     False |     41.81 |     0.2038 |      0.1907 |                   23.92 |
|   Unbounded |      True |     42.90 |     0.2406 |      0.2251 |                   23.31 |

### Single-Publisher / Single-Subscriber

|        Type | SyncCont. | Mean (ms) | Error (ms) | StdDev (ms) |  Million messages / sec |
|------------ |---------- |----------:|-----------:|------------:|------------------------:|
| BoundedWait |     False |     45.56 |     0.4974 |      0.4653 |                   21.95 |
| BoundedWait |      True |     44.79 |     0.3766 |      0.3339 |                   22.33 |
|   Unbounded |     False |     28.65 |     0.4288 |      0.4011 |                   34.91 |
|   Unbounded |      True |     28.53 |     0.2122 |      0.1985 |                   35.05 |