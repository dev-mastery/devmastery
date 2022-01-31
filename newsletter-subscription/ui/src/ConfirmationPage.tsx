import { useLoaderData } from "remix";

type LoaderData = { fruits: Array<string> };
export function loader() {
  const data: LoaderData = { fruits: ["peach", "pear", "plum"] };
  return data;
}

export default function ConfirmationPage() {
  const data = useLoaderData<LoaderData>();
  console.log("data", data);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Almost Done!</h1>
      <p>You're almost done! You just need to confirm your email address.</p>
      <ul>
        {data.fruits.map((fruit) => (
          <li key={fruit}>{fruit}</li>
        ))}
      </ul>
    </div>
  );
}
