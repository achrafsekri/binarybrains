import { uuid } from "uuidv4";
import Page from "./page";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Layout(props) {
  const id = uuid();
  props.params.id = id;
  return <div><Page {...props} /></div>;
}
