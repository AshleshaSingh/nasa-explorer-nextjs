'use client'
import { title } from "@/components/primitives";
import {Button} from "@heroui/button";

export default function DocsPage() {
  console.log('rendered page doc')
  return (
    <div>
      <h1 className={title()}>Docs</h1>
       <Button color="primary">Button</Button>;
    </div>
  );
}
