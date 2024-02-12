import { component$, useSignal, useTask$, $, sync$ } from "@builder.io/qwik";
// import { isServer } from "@builder.io/qwik/build";
import { server$, type DocumentHead } from "@builder.io/qwik-city";

export const getData = server$(async (record) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${record}`
  );
  const data = await res.json();
  return data;
});

export default component$(() => {
  const view = useSignal("");

  const loading$ = sync$((_e: Event, target: HTMLButtonElement) => {
    const span = target.querySelector("span");
    target.disabled = span!.hidden;
    span!.hidden = !span!.hidden;
  });

  const update$ = $(async () => {
    const record = Math.floor(Math.random() * 100) + 1;
    console.log("fetching record", record);
    const data = await getData(record);
    console.log("data", data);
    view.value = JSON.stringify(data, null, 2);
  });

  useTask$(() => update$());

  return (
    <>
      <h1>Hi 👋</h1>
      <div>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
        <pre>{view.value}</pre>
        <button onClick$={[loading$, update$, loading$]}>
          Update <span hidden>loading...</span>
        </button>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
